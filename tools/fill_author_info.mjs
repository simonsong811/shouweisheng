import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const documentsDir = "C:/Users/Owner/Documents";
const outputDir = "outputs/hand-hygiene-ai-submission";
const entries = await fs.readdir(documentsDir);
const sourceName = entries.find((name) => name.toLowerCase().endsWith(".xlsx"));
if (!sourceName) throw new Error("Author information workbook was not found.");

const source = await FileBlob.load(`${documentsDir}/${sourceName}`);
const workbook = await SpreadsheetFile.importXlsx(source);
const sheet = workbook.worksheets.getItemAt(0);

// Only the non-personal project name is known. The remaining fields must be
// completed by the entrants with verified information before they submit.
sheet.getRange("A2").values = [["手护智感 AI 智能体"]];

await fs.mkdir(outputDir, { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(`${outputDir}/作者基本信息表_手护智感_待补充真实作者信息.xlsx`);

const check = await workbook.inspect({
  kind: "table",
  range: "A1:I10",
  include: "values,formulas",
  tableMaxRows: 10,
  tableMaxCols: 9,
});
console.log(check.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 50 },
  summary: "formula error scan",
});
console.log(errors.ndjson);

const preview = await workbook.render({
  sheetName: sheet.name,
  range: "A1:I10",
  scale: 2,
  format: "png",
});
await fs.writeFile(`${outputDir}/作者基本信息表_预览.png`, new Uint8Array(await preview.arrayBuffer()));
