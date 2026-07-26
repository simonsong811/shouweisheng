$workspaceRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\\..")).Path
$destinationDirectory = Join-Path $workspaceRoot "video\\public\\prototype"
$sourceDirectory = Join-Path $workspaceRoot "outputs\\video-assets"
$pngSignature = [byte[]](0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A)
$assets = @(
  @{ Source = ('01_' + [char]0x539F + [char]0x578B + [char]0x6A2A + [char]0x5C4F + '_' + [char]0x7591 + [char]0x4F3C + [char]0x6709 + [char]0x6548 + '.png'); Destination = "01-valid.png" },
  @{ Source = ('02_' + [char]0x539F + [char]0x578B + [char]0x6A2A + [char]0x5C4F + '_' + [char]0x9057 + [char]0x6F0F + [char]0x98CE + [char]0x9669 + '.png'); Destination = "02-missed.png" },
  @{ Source = ('03_' + [char]0x539F + [char]0x578B + [char]0x6A2A + [char]0x5C4F + '_' + [char]0x5F85 + [char]0x590D + [char]0x6838 + '.png'); Destination = "03-review.png" },
  @{ Source = ('04_' + [char]0x539F + [char]0x578B + [char]0x6A2A + [char]0x5C4F + '_' + [char]0x591A + [char]0x4EBA + [char]0x5E72 + [char]0x6270 + '.png'); Destination = "04-interference.png" }
)

foreach ($asset in $assets) {
  $sourcePath = Join-Path $sourceDirectory $asset.Source
  if (-not (Test-Path -LiteralPath $sourcePath -PathType Leaf)) {
    throw "Missing prototype asset: $sourcePath"
  }

  if ((Get-Item -LiteralPath $sourcePath).Length -lt 50000) {
    throw "Prototype asset is smaller than 50,000 bytes: $sourcePath"
  }
}

New-Item -ItemType Directory -Path $destinationDirectory -Force | Out-Null
Add-Type -AssemblyName System.Drawing

foreach ($asset in $assets) {
  $sourcePath = Join-Path $sourceDirectory $asset.Source
  $destinationPath = Join-Path $destinationDirectory $asset.Destination
  $image = [System.Drawing.Image]::FromFile($sourcePath)

  try {
    $image.Save($destinationPath, [System.Drawing.Imaging.ImageFormat]::Png)
  }
  finally {
    $image.Dispose()
  }
}

foreach ($asset in $assets) {
  $destinationPath = Join-Path $destinationDirectory $asset.Destination
  $destination = Get-Item -LiteralPath $destinationPath
  if ($destination.Length -lt 50000) {
    throw "Converted prototype asset is smaller than 50,000 bytes: $destinationPath"
  }

  $signature = [System.IO.File]::ReadAllBytes($destinationPath)[0..7]
  if (-not [System.Linq.Enumerable]::SequenceEqual([byte[]]$signature, $pngSignature)) {
    throw "Converted prototype asset does not have a PNG signature: $destinationPath"
  }
}

Write-Output "Copied and validated 4 prototype assets."
