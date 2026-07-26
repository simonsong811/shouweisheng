# “手护智感”三分钟视频 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 使用现有“手护智感”原型素材制作一支 1280×720、30fps、180 秒的比赛评审介绍视频，并导出可提交的 MP4、字幕、旁白和素材授权记录。

**Architecture:** 在现有项目中新增独立的 `video/` Remotion 工程，不修改微信小程序、网页原型或本地网关的业务逻辑。视频采用数据驱动的 8 段时间轴，将现有原型截图、矢量场景、字幕、旁白和原创环境音组合成可复现的 React/TypeScript 视频。

**Tech Stack:** Remotion、React、TypeScript、Vitest、`@remotion/media`、`@remotion/captions`、`@remotion/google-fonts`、Edge TTS、PowerShell、 bundled Node.js/pnpm。

## Global Constraints

- 输出分辨率固定为 `1280 × 720`。
- 帧率固定为 `30fps`，总帧数固定为 `5400`，总时长固定为 `180 秒`。
- 全片不得出现单位、作者、患者或医务人员身份信息。
- 网站数值必须标注为“原型演示｜去标识化模拟事件”，不能表述为真实临床结果。
- 不宣称单一 Wi-Fi CSI 可以判定个人最终依从性。
- WHO 表述固定为：速干手消毒完整程序 `20–30 秒`，肥皂和流动水洗手 `40–60 秒`。
- 网站当前 `15 秒`仅作为原型阈值；成片必须显示“原型演示阈值，正式部署需按场景验证”。
- 不使用未经验证的准确率、感染率下降或个人合规率结论。
- 不下载无明确授权的照片、音乐、音效或字体。
- 关键文字安全区：左右至少 `72px`，上下至少 `56px`。
- 720p 主标题不小于 `64px`，重要说明不小于 `32px`，普通标签不小于 `22px`。
- 所有动画使用 `useCurrentFrame()`、`interpolate()` 和 `Sequence`；禁止 CSS transition、CSS keyframes 和 Tailwind 动画类。
- 当前工作区不是 Git 仓库；不得自行初始化 Git。每个任务使用 `video/IMPLEMENTATION_LOG.md`记录变更和验证结果，替代提交步骤。

---

## File Map

### 新建工程与配置

- `video/package.json`：Remotion、测试和音频工具依赖。
- `video/tsconfig.json`：TypeScript 配置。
- `video/remotion.config.ts`：渲染配置。
- `video/src/index.ts`：Remotion 入口。
- `video/src/Root.tsx`：注册 720p、5400 帧主合成。
- `video/src/HandHygieneVideo.tsx`：主时间轴。

### 数据与样式

- `video/src/data/timeline.ts`：8 个片段的精确帧区间。
- `video/src/data/narration.ts`：最终旁白和字幕分句。
- `video/src/data/assets.ts`：素材清单和免责声明。
- `video/src/theme.ts`：颜色、字号、安全区和字体。

### 视频组件

- `video/src/components/Stage.tsx`：720p 安全区和背景。
- `video/src/components/Headline.tsx`：标题和重点文案动画。
- `video/src/components/PrototypeFrame.tsx`：原型截图、缩放和高亮框。
- `video/src/components/WorkflowLoop.tsx`：感知—推理—行动—学习闭环。
- `video/src/components/CaptionTrack.tsx`：底部字幕。
- `video/src/components/Disclosure.tsx`：原型与 AI 内容标识。
- `video/src/scenes/Scenes.tsx`：8 个场景的画面实现。

### 素材、脚本和输出

- `video/public/prototype/*.png`：现有 4 类原型截图。
- `video/public/audio/narration-*.mp3`：8 段旁白。
- `video/public/audio/ambient-bed.wav`：原创环境音。
- `video/public/captions.json`：`Caption[]` 字幕。
- `video/scripts/copy-assets.ps1`：复制和核验原型素材。
- `video/scripts/generate-voiceover.ps1`：生成分段中文旁白。
- `video/scripts/generate-captions.mjs`：生成字幕 JSON。
- `video/scripts/generate-ambient.mjs`：生成原创环境音。
- `video/scripts/validate-build.mjs`：时长、素材、字幕和旁白检查。
- `video/tests/timeline.test.ts`：时间轴测试。
- `video/tests/captions.test.ts`：字幕测试。
- `video/out/手护智感_三分钟介绍_720p.mp4`：最终成片。
- `video/out/手护智感_三分钟介绍_字幕.srt`：提交或存档字幕。
- `video/out/素材与AI生成内容说明.md`：授权和 AI 标识记录。
- `video/IMPLEMENTATION_LOG.md`：无 Git 环境下的任务检查点。

---

### Task 1: Scaffold the isolated Remotion project

**Files:**

- Create: `video/package.json`
- Create: `video/tsconfig.json`
- Create: `video/remotion.config.ts`
- Create: `video/src/index.ts`
- Create: `video/src/Root.tsx`
- Create: `video/IMPLEMENTATION_LOG.md`

**Interfaces:**

- Consumes: bundled Node.js and pnpm paths supplied by Codex workspace dependencies.
- Produces: Remotion composition ID `HandHygieneVideo`, width `1280`, height `720`, fps `30`, duration `5400`.

- [ ] **Step 1: Scaffold the project**

Run from the workspace root:

```powershell
& 'C:\Users\Owner\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' dlx create-video@latest --yes --blank --no-tailwind video
```

Expected: `video/package.json`, `video/src/Root.tsx`, and Remotion starter files exist.

- [ ] **Step 2: Install the exact dependencies**

```powershell
& 'C:\Users\Owner\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' --dir .\video add @remotion/media @remotion/captions @remotion/google-fonts music-metadata
& 'C:\Users\Owner\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' --dir .\video add -D vitest
```

Expected: all commands exit `0`; `video/pnpm-lock.yaml` exists.

- [ ] **Step 3: Register the fixed composition**

Replace `video/src/Root.tsx` with:

```tsx
import {Composition} from "remotion";
import {HandHygieneVideo} from "./HandHygieneVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="HandHygieneVideo"
      component={HandHygieneVideo}
      durationInFrames={5400}
      fps={30}
      width={1280}
      height={720}
      defaultProps={{
        showPrototypeDisclosure: true,
        showAiDisclosure: true,
      }}
    />
  );
};
```

Create `video/src/HandHygieneVideo.tsx`:

```tsx
import {AbsoluteFill} from "remotion";

export type HandHygieneVideoProps = {
  showPrototypeDisclosure: boolean;
  showAiDisclosure: boolean;
};

export const HandHygieneVideo: React.FC<HandHygieneVideoProps> = () => {
  return <AbsoluteFill style={{backgroundColor: "#F3F8F6"}} />;
};
```

- [ ] **Step 4: Verify the composition metadata**

```powershell
& 'C:\Users\Owner\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' --dir .\video exec remotion compositions .\src\index.ts
```

Expected output contains:

```text
HandHygieneVideo
1280x720
30 fps
5400 frames
```

- [ ] **Step 5: Record the checkpoint**

Append to `video/IMPLEMENTATION_LOG.md`:

```markdown
## Task 1

- Composition: HandHygieneVideo
- Resolution: 1280×720
- FPS: 30
- Frames: 5400
- Validation: `remotion compositions` passed
```

---

### Task 2: Lock the timeline, narration, and compliance data

**Files:**

- Create: `video/src/data/timeline.ts`
- Create: `video/src/data/narration.ts`
- Create: `video/src/data/assets.ts`
- Create: `video/tests/timeline.test.ts`
- Modify: `video/package.json`

**Interfaces:**

- Produces: `SCENES`, `TOTAL_FRAMES`, `NARRATION`, `DISCLOSURES`.
- Consumers: main composition, scene renderer, subtitle generator, build validator.

- [ ] **Step 1: Write the failing timeline test**

Create `video/tests/timeline.test.ts`:

```ts
import {describe, expect, it} from "vitest";
import {SCENES, TOTAL_FRAMES} from "../src/data/timeline";

describe("video timeline", () => {
  it("covers exactly 180 seconds without gaps or overlap", () => {
    expect(TOTAL_FRAMES).toBe(5400);
    expect(SCENES[0].from).toBe(0);
    for (let index = 1; index < SCENES.length; index += 1) {
      const previous = SCENES[index - 1];
      expect(SCENES[index].from).toBe(previous.from + previous.durationInFrames);
    }
    const last = SCENES.at(-1);
    expect(last!.from + last!.durationInFrames).toBe(TOTAL_FRAMES);
  });

  it("uses the approved eight scene structure", () => {
    expect(SCENES.map((scene) => scene.id)).toEqual([
      "hook",
      "positioning",
      "agent-loop",
      "valid-event",
      "missed-event",
      "review-event",
      "management",
      "closing",
    ]);
  });
});
```

- [ ] **Step 2: Run the test and verify failure**

```powershell
& 'C:\Users\Owner\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' --dir .\video exec vitest run .\tests\timeline.test.ts
```

Expected: FAIL because `src/data/timeline.ts` does not exist.

- [ ] **Step 3: Implement the exact timeline**

Create `video/src/data/timeline.ts`:

```ts
export const FPS = 30;
export const TOTAL_FRAMES = 5400;

export type SceneId =
  | "hook"
  | "positioning"
  | "agent-loop"
  | "valid-event"
  | "missed-event"
  | "review-event"
  | "management"
  | "closing";

export type SceneTiming = {
  id: SceneId;
  from: number;
  durationInFrames: number;
};

export const SCENES: SceneTiming[] = [
  {id: "hook", from: 0, durationInFrames: 480},
  {id: "positioning", from: 480, durationInFrames: 600},
  {id: "agent-loop", from: 1080, durationInFrames: 720},
  {id: "valid-event", from: 1800, durationInFrames: 990},
  {id: "missed-event", from: 2790, durationInFrames: 750},
  {id: "review-event", from: 3540, durationInFrames: 780},
  {id: "management", from: 4320, durationInFrames: 600},
  {id: "closing", from: 4920, durationInFrames: 480},
];
```

Create `video/src/data/narration.ts` with the eight approved narration paragraphs from the design spec, keyed by the exact scene IDs:

```ts
import type {SceneId} from "./timeline";

export const NARRATION: Record<SceneId, string> = {
  hook:
    "在治疗室入口，一次匆忙经过，手卫生可能成为被忽略的一步。人工观察难以持续覆盖，摄像头又有隐私顾虑。能否用更低侵扰的方式，及时发现遗漏风险？",
  positioning:
    "这就是手护智感，一款面向治疗室入口、ICU床旁手消点和缓冲间的非视觉化手卫生AI智能体。它不采集视频、音频和人脸，而是利用Wi-Fi CSI与多源事件，对疑似手卫生行为进行初筛、提醒和复核。",
  "agent-loop":
    "智能体首先接收CSI动作变化、手消剂按压、区域停留和设备状态；随后识别经过、停留、疑似揉搓和干扰，输出持续时间与置信度；再依据证据完整性执行提醒或转入人工复核；复核结果还可用于阈值校准和后续场景优化，形成感知、推理、行动和学习闭环。",
  "valid-event":
    "先看一条证据相对完整的原型事件。人员进入固定手消区域后，系统记录到区域停留和手消剂按压，同时CSI波形出现连续揉搓样变化。智能体对时间戳和多源证据进行融合，在达到原型阈值后输出疑似有效，并保留完整事件链，供趋势分析和过程改进使用。",
  "missed-event":
    "当人员快速经过重点区域，系统未获得按压事件，也未识别到稳定的揉搓样动作时，智能体不会把它记录为已完成事件，而是标记为手卫生遗漏风险，并触发低打扰提醒。系统由此从事后统计前移到现场风险发现。",
  "review-event":
    "真实病区还会出现多人同时在场、信号遮挡、设备异常和证据冲突。遇到这些情况，智能体不会强行给出个人合规结论，而是保留置信度和证据来源，将事件主动降级为待复核，由院感人员确认。这是不确定性感知，也是临床应用必须保留的安全边界。",
  management:
    "管理端以去标识化方式汇总疑似有效、遗漏风险和待复核事件，帮助院感人员发现重点场景和高风险时段。系统的创新不只是使用Wi-Fi感知，而是将非视觉化感知、多源证据融合、即时提醒和人工复核连接成一个可解释的管理闭环。",
  closing:
    "当前已完成小程序、网页管理端、本地网关和复核流程。下一阶段将接入真实传感设备，开展场景验证。手护智感不替代WHO五时刻判断，只为重点空间提供更早发现和及时提醒。",
};
```

Create `video/src/data/assets.ts`:

```ts
export const PROTOTYPE_ASSETS = {
  valid: "prototype/01-valid.png",
  missed: "prototype/02-missed.png",
  review: "prototype/03-review.png",
  interference: "prototype/04-interference.png",
} as const;

export const DISCLOSURES = {
  prototype: "原型演示｜去标识化模拟事件",
  threshold: "原型演示阈值，正式部署需按场景验证",
  final:
    "本片展示内容为软件原型及去标识化模拟事件，不代表已完成临床效能验证。",
  ai: "旁白及部分动态图形由AI辅助生成",
} as const;
```

- [ ] **Step 4: Add and run the test script**

Add to `video/package.json`:

```json
{
  "scripts": {
    "test": "vitest run"
  }
}
```

Run:

```powershell
& 'C:\Users\Owner\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' --dir .\video test
```

Expected: 2 tests pass.

- [ ] **Step 5: Record the checkpoint**

Append scene frame boundaries and the passing test count to `video/IMPLEMENTATION_LOG.md`.

---

### Task 3: Copy and validate the real prototype assets

**Files:**

- Create: `video/scripts/copy-assets.ps1`
- Create: `video/public/prototype/01-valid.png`
- Create: `video/public/prototype/02-missed.png`
- Create: `video/public/prototype/03-review.png`
- Create: `video/public/prototype/04-interference.png`

**Interfaces:**

- Consumes: `outputs/video-assets/*.png`.
- Produces: stable asset filenames referenced by `PROTOTYPE_ASSETS`.

- [ ] **Step 1: Create the copy and validation script**

Create `video/scripts/copy-assets.ps1`:

```powershell
$ErrorActionPreference = 'Stop'
$workspace = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$source = Join-Path $workspace 'outputs\video-assets'
$destination = Join-Path (Split-Path -Parent $PSScriptRoot) 'public\prototype'

New-Item -ItemType Directory -Force -Path $destination | Out-Null

$files = @{
  '01_原型横屏_疑似有效.png' = '01-valid.png'
  '02_原型横屏_遗漏风险.png' = '02-missed.png'
  '03_原型横屏_待复核.png' = '03-review.png'
  '04_原型横屏_多人干扰.png' = '04-interference.png'
}

foreach ($item in $files.GetEnumerator()) {
  $inputPath = Join-Path $source $item.Key
  if (-not (Test-Path -LiteralPath $inputPath)) {
    throw "Missing source asset: $inputPath"
  }
  if ((Get-Item -LiteralPath $inputPath).Length -lt 50000) {
    throw "Source asset is unexpectedly small: $inputPath"
  }
  Copy-Item -LiteralPath $inputPath -Destination (Join-Path $destination $item.Value) -Force
}

Write-Output "Copied and validated 4 prototype assets."
```

- [ ] **Step 2: Run the script**

```powershell
& .\video\scripts\copy-assets.ps1
```

Expected: `Copied and validated 4 prototype assets.`

- [ ] **Step 3: Verify the asset names**

```powershell
Get-ChildItem -LiteralPath .\video\public\prototype -File |
  Select-Object Name, Length
```

Expected: exactly four PNG files, each larger than `50000` bytes.

- [ ] **Step 4: Record the checkpoint**

Append the four filenames and sizes to `video/IMPLEMENTATION_LOG.md`.

---

### Task 4: Build the visual system and reusable video components

**Files:**

- Create: `video/src/theme.ts`
- Create: `video/src/components/Stage.tsx`
- Create: `video/src/components/Headline.tsx`
- Create: `video/src/components/PrototypeFrame.tsx`
- Create: `video/src/components/WorkflowLoop.tsx`
- Create: `video/src/components/CaptionTrack.tsx`
- Create: `video/src/components/Disclosure.tsx`

**Interfaces:**

- Produces: safe-area stage, consistent typography, screenshot animation, workflow diagram, captions and disclosures.
- Consumers: all scenes in `video/src/scenes/Scenes.tsx`.

- [ ] **Step 1: Define the 720p theme**

Create `video/src/theme.ts`:

```ts
import {loadFont} from "@remotion/google-fonts/NotoSansSC";

export const {fontFamily} = loadFont("normal", {
  weights: ["400", "500", "700"],
});

export const theme = {
  colors: {
    background: "#F3F8F6",
    surface: "#FFFFFF",
    ink: "#13211D",
    muted: "#64736E",
    teal: "#07877F",
    tealSoft: "#DDF2EE",
    amber: "#D69A22",
    red: "#B53A40",
    line: "#D9E4E0",
  },
  safe: {x: 72, y: 56},
  type: {hero: 72, title: 54, body: 32, label: 24, caption: 28},
  radius: 24,
} as const;
```

- [ ] **Step 2: Implement Stage and Headline**

Create `video/src/components/Stage.tsx`:

```tsx
import type {PropsWithChildren} from "react";
import {AbsoluteFill} from "remotion";
import {fontFamily, theme} from "../theme";

export const Stage: React.FC<PropsWithChildren<{background?: string}>> = ({
  children,
  background = theme.colors.background,
}) => (
  <AbsoluteFill
    style={{
      background,
      color: theme.colors.ink,
      fontFamily,
      padding: `${theme.safe.y}px ${theme.safe.x}px`,
      overflow: "hidden",
    }}
  >
    {children}
  </AbsoluteFill>
);
```

Create `video/src/components/Headline.tsx`:

```tsx
import {Easing, interpolate, useCurrentFrame} from "remotion";
import {theme} from "../theme";

export const Headline: React.FC<{
  eyebrow?: string;
  title: string;
  accent?: string;
}> = ({eyebrow, title, accent}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        opacity: interpolate(frame, [0, 18], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        translate: `0 ${interpolate(frame, [0, 18], [28, 0], {
          extrapolateRight: "clamp",
        })}px`,
      }}
    >
      {eyebrow ? (
        <div style={{fontSize: theme.type.label, color: theme.colors.teal}}>
          {eyebrow}
        </div>
      ) : null}
      <div
        style={{
          marginTop: 10,
          maxWidth: 1050,
          fontSize: theme.type.hero,
          fontWeight: 700,
          lineHeight: 1.15,
        }}
      >
        {title}
      </div>
      {accent ? (
        <div style={{marginTop: 16, fontSize: theme.type.body, color: theme.colors.muted}}>
          {accent}
        </div>
      ) : null}
    </div>
  );
};
```

- [ ] **Step 3: Implement PrototypeFrame**

Create `video/src/components/PrototypeFrame.tsx`:

```tsx
import {Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {theme} from "../theme";

export const PrototypeFrame: React.FC<{
  src: string;
  focusX?: number;
  focusY?: number;
  zoom?: number;
  highlight?: {x: number; y: number; width: number; height: number};
}> = ({src, focusX = 50, focusY = 50, zoom = 1.04, highlight}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 120], [1, zoom], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 500,
        overflow: "hidden",
        borderRadius: theme.radius,
        boxShadow: "0 22px 70px rgba(19,33,29,0.16)",
        background: theme.colors.surface,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${focusX}% ${focusY}%`,
          scale,
        }}
      />
      {highlight ? (
        <div
          style={{
            position: "absolute",
            left: highlight.x,
            top: highlight.y,
            width: highlight.width,
            height: highlight.height,
            border: `4px solid ${theme.colors.amber}`,
            borderRadius: 18,
            boxShadow: "0 0 0 9999px rgba(19,33,29,0.22)",
          }}
        />
      ) : null}
    </div>
  );
};
```

- [ ] **Step 4: Implement captions and disclosures**

Create `video/src/components/Disclosure.tsx` with a top-right translucent label using `theme.type.label`. Create `video/src/components/CaptionTrack.tsx` that fetches `staticFile("captions.json")` with `useDelayRender()`, renders only the active `Caption`, and places no more than two lines inside a bottom safe-area block with `fontSize: 28`, `lineHeight: 1.35`, white text and a 72% black backing.

The active-caption test must be:

```ts
caption.startMs <= currentMs && caption.endMs > currentMs
```

The component must preserve Chinese punctuation and must not use word-by-word flashing.

- [ ] **Step 5: Implement WorkflowLoop**

Create a four-node SVG/HTML layout with labels:

```ts
[
  ["感知", "CSI、按压、停留、设备状态"],
  ["推理", "类别、时长、置信度"],
  ["行动", "提醒、记录、人工复核"],
  ["学习", "阈值校准、场景优化"],
]
```

Reveal one node every `120` frames. Draw connecting lines using SVG `strokeDashoffset` driven by `interpolate()`. Do not use CSS animations.

- [ ] **Step 6: Render component stills**

Render frames at `540`, `1320`, and `2010`:

```powershell
& 'C:\Users\Owner\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' --dir .\video exec remotion still HandHygieneVideo .\out\component-check-540.png --frame=540
& 'C:\Users\Owner\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' --dir .\video exec remotion still HandHygieneVideo .\out\component-check-1320.png --frame=1320
& 'C:\Users\Owner\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' --dir .\video exec remotion still HandHygieneVideo .\out\component-check-2010.png --frame=2010
```

Expected: all images are 1280×720, titles stay inside the safe area, and no element overlaps captions.

- [ ] **Step 7: Record the checkpoint**

Append still filenames and visual findings to `video/IMPLEMENTATION_LOG.md`.

---

### Task 5: Implement the eight approved scenes and main timeline

**Files:**

- Create: `video/src/scenes/Scenes.tsx`
- Modify: `video/src/HandHygieneVideo.tsx`

**Interfaces:**

- Consumes: `SCENES`, `PROTOTYPE_ASSETS`, `DISCLOSURES`, all reusable components.
- Produces: complete silent 5400-frame picture track.

- [ ] **Step 1: Implement the scene exports**

Create `video/src/scenes/Scenes.tsx` exporting:

```ts
export const HookScene: React.FC;
export const PositioningScene: React.FC;
export const AgentLoopScene: React.FC;
export const ValidEventScene: React.FC;
export const MissedEventScene: React.FC;
export const ReviewEventScene: React.FC;
export const ManagementScene: React.FC;
export const ClosingScene: React.FC;
```

Required scene contents:

- `HookScene`: vector-only treatment-room entrance, fixed hand-rub point, moving anonymous silhouette, headline “一次匆忙经过，手卫生可能成为被忽略的一步”。
- `PositioningScene`: project name, subtitle, valid-event screenshot, prototype disclosure.
- `AgentLoopScene`: `WorkflowLoop` and one-sentence positioning.
- `ValidEventScene`: valid screenshot, staged highlights for stop/press/rub/event-chain, multi-source evidence headline, threshold disclosure.
- `MissedEventScene`: missed screenshot, highlights for 5-second pass/no press/no stable rubbing, “从事后统计，前移至现场提醒”。
- `ReviewEventScene`: first half uses review screenshot, second half crossfades to interference screenshot, ending on “AI识别不确定性，而不是过度判断”。
- `ManagementScene`: three large cards “非视觉化”“多源证据融合”“提醒—复核—改进闭环” plus treatment room/ICU/buffer-room tags.
- `ClosingScene`: two columns “当前已完成”和“下一阶段”，then title card “手护智感｜让感知更隐私，让提醒更及时” and final disclosure.

- [ ] **Step 2: Assemble the exact Sequence timeline**

Replace `video/src/HandHygieneVideo.tsx` with:

```tsx
import {AbsoluteFill, Sequence} from "remotion";
import {CaptionTrack} from "./components/CaptionTrack";
import {Disclosure} from "./components/Disclosure";
import {SCENES} from "./data/timeline";
import {
  AgentLoopScene,
  ClosingScene,
  HookScene,
  ManagementScene,
  MissedEventScene,
  PositioningScene,
  ReviewEventScene,
  ValidEventScene,
} from "./scenes/Scenes";

export type HandHygieneVideoProps = {
  showPrototypeDisclosure: boolean;
  showAiDisclosure: boolean;
};

const COMPONENTS = {
  hook: HookScene,
  positioning: PositioningScene,
  "agent-loop": AgentLoopScene,
  "valid-event": ValidEventScene,
  "missed-event": MissedEventScene,
  "review-event": ReviewEventScene,
  management: ManagementScene,
  closing: ClosingScene,
} as const;

export const HandHygieneVideo: React.FC<HandHygieneVideoProps> = ({
  showPrototypeDisclosure,
  showAiDisclosure,
}) => (
  <AbsoluteFill>
    {SCENES.map((scene) => {
      const Scene = COMPONENTS[scene.id];
      return (
        <Sequence
          key={scene.id}
          from={scene.from}
          durationInFrames={scene.durationInFrames}
          premountFor={30}
        >
          <Scene />
        </Sequence>
      );
    })}
    <CaptionTrack />
    {showPrototypeDisclosure ? (
      <Sequence from={480} durationInFrames={4440}>
        <Disclosure text="原型演示｜去标识化模拟事件" />
      </Sequence>
    ) : null}
    {showAiDisclosure ? (
      <Sequence from={5250} durationInFrames={150}>
        <Disclosure text="旁白及部分动态图形由AI辅助生成" />
      </Sequence>
    ) : null}
  </AbsoluteFill>
);
```

- [ ] **Step 3: Render eight representative stills**

Render frames:

```text
240, 690, 1320, 2130, 3060, 3930, 4500, 5220
```

Expected for each still:

- one obvious focal point;
- no text smaller than 22px;
- no key content inside the outer 56px/72px unsafe margins;
- no screenshot label presented as clinical truth;
- no visible unit or personal information.

- [ ] **Step 4: Record the checkpoint**

Append the eight reviewed frame numbers and any corrected layout issues to `video/IMPLEMENTATION_LOG.md`.

---

### Task 6: Generate narration, captions, and original ambient audio

**Files:**

- Create: `video/scripts/generate-voiceover.ps1`
- Create: `video/scripts/generate-captions.mjs`
- Create: `video/scripts/generate-ambient.mjs`
- Create: `video/scripts/validate-build.mjs`
- Create: `video/tests/captions.test.ts`
- Create: `video/public/audio/narration-*.mp3`
- Create: `video/public/audio/ambient-bed.wav`
- Create: `video/public/captions.json`
- Modify: `video/src/HandHygieneVideo.tsx`

**Interfaces:**

- Consumes: `NARRATION`, `SCENES`.
- Produces: eight scene narration files, one caption JSON, one 180-second original music bed.

- [ ] **Step 1: Write the caption timing test**

Create `video/tests/captions.test.ts`:

```ts
import {readFileSync} from "node:fs";
import {describe, expect, it} from "vitest";

type Caption = {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number | null;
  confidence: number | null;
};

describe("captions", () => {
  const captions = JSON.parse(
    readFileSync("public/captions.json", "utf8"),
  ) as Caption[];

  it("stays inside the 180-second composition", () => {
    expect(captions.length).toBeGreaterThan(16);
    expect(captions[0].startMs).toBeGreaterThanOrEqual(0);
    expect(captions.at(-1)!.endMs).toBeLessThanOrEqual(180000);
  });

  it("has valid, non-overlapping intervals", () => {
    for (let index = 0; index < captions.length; index += 1) {
      expect(captions[index].text.trim().length).toBeGreaterThan(0);
      expect(captions[index].endMs).toBeGreaterThan(captions[index].startMs);
      if (index > 0) {
        expect(captions[index].startMs).toBeGreaterThanOrEqual(
          captions[index - 1].endMs,
        );
      }
    }
  });
});
```

- [ ] **Step 2: Generate eight Chinese narration and SRT files**

Create `video/scripts/generate-voiceover.ps1` that installs Edge TTS into `video/.python-tools` and invokes:

```powershell
python -m edge_tts `
  --voice zh-CN-XiaoxiaoNeural `
  --rate=+8% `
  --volume=-3% `
  --text $sceneText `
  --write-media $outputPath `
  --write-subtitles $subtitlePath
```

Use the bundled Python executable:

```text
C:\Users\Owner\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe
```

Generate files:

```text
narration-hook.mp3
narration-positioning.mp3
narration-agent-loop.mp3
narration-valid-event.mp3
narration-missed-event.mp3
narration-review-event.mp3
narration-management.mp3
narration-closing.mp3
```

The script must fail when any output is smaller than `10000` bytes.

- [ ] **Step 3: Merge the generated SRT files into exact caption JSON**

Create `video/scripts/generate-captions.mjs` with these exact rules:

1. import `parseSrt` from `@remotion/captions`;
2. read the eight `narration-<scene-id>.srt` files;
3. add each scene's absolute start time plus `400ms` to every parsed `startMs`, `endMs` and non-null `timestampMs`;
4. reject captions that extend beyond the owning scene's end minus `400ms`;
5. sort by `startMs`;
6. write the resulting `Caption[]` to `video/public/captions.json`.

The core offset must be:

```js
const offsetMs = Math.round((scene.from / 30) * 1000) + 400;
const shifted = parsed.map((caption) => ({
  ...caption,
  startMs: caption.startMs + offsetMs,
  endMs: caption.endMs + offsetMs,
  timestampMs:
    caption.timestampMs === null ? null : caption.timestampMs + offsetMs,
}));
```

Run:

```powershell
& 'C:\Users\Owner\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\video\scripts\generate-captions.mjs
```

Expected: `video/public/captions.json` exists and contains no overlapping captions.

- [ ] **Step 4: Generate a copyright-safe ambient bed**

Create `video/scripts/generate-ambient.mjs` that writes a 180-second, 44.1kHz, 16-bit stereo WAV using:

- sine layers at 110Hz, 164.81Hz and 220Hz;
- combined peak amplitude below `0.08`;
- 3-second fade-in and 5-second fade-out;
- no sampled third-party audio.

Run:

```powershell
& 'C:\Users\Owner\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\video\scripts\generate-ambient.mjs
```

Expected: `video/public/audio/ambient-bed.wav` exists and is longer than `30MB`.

- [ ] **Step 5: Add audio to the composition**

In `video/src/HandHygieneVideo.tsx`, import:

```tsx
import {Audio} from "@remotion/media";
import {staticFile} from "remotion";
```

Add one background audio track:

```tsx
<Audio src={staticFile("audio/ambient-bed.wav")} volume={0.12} />
```

For each scene, add its narration in the same `Sequence`, starting `12` frames after the scene begins:

```tsx
<Sequence from={scene.from + 12} durationInFrames={scene.durationInFrames - 24}>
  <Audio src={staticFile(`audio/narration-${scene.id}.mp3`)} volume={0.95} />
</Sequence>
```

- [ ] **Step 6: Validate audio lengths**

Create `video/scripts/validate-build.mjs` using `music-metadata`:

```js
import {parseFile} from "music-metadata";
```

For each narration file, compare `format.duration` with its scene seconds minus `0.8`. Fail with the exact scene ID when narration would be clipped.

Run:

```powershell
& 'C:\Users\Owner\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\video\scripts\validate-build.mjs
```

Expected: `8 narration files fit; captions end by 180000ms; ambient bed is 180s.`

- [ ] **Step 7: Run all tests**

```powershell
& 'C:\Users\Owner\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' --dir .\video test
```

Expected: timeline and caption tests pass.

- [ ] **Step 8: Record the checkpoint**

Append narration durations, caption count and ambient duration to `video/IMPLEMENTATION_LOG.md`.

---

### Task 7: Render the 720p master and perform visual/audio QA

**Files:**

- Create: `video/out/手护智感_三分钟介绍_720p.mp4`
- Create: `video/out/qa-frames/*.png`
- Create: `video/out/素材与AI生成内容说明.md`

**Interfaces:**

- Consumes: complete Remotion composition and validated assets.
- Produces: final competition-ready MP4 and QA evidence.

- [ ] **Step 1: Render a low-resolution draft**

```powershell
& 'C:\Users\Owner\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' --dir .\video exec remotion render HandHygieneVideo .\out\draft.mp4 --scale=0.5 --codec=h264 --crf=23 --pixel-format=yuv420p
```

Expected: render succeeds and draft duration is 180 seconds.

- [ ] **Step 2: Review the full draft**

Check and record:

- narration is not clipped at scene changes;
- captions match narration meaning and remain within two lines;
- prototype disclosure is visible during all interface scenes;
- 15-second prototype threshold is never presented as WHO compliance;
- final disclosure remains readable for at least 4 seconds;
- music does not mask the narration;
- no unit, author, patient or staff identity appears.

- [ ] **Step 3: Render QA stills at every transition**

Render frames:

```text
0, 479, 480, 1079, 1080, 1799, 1800, 2789,
2790, 3539, 3540, 4319, 4320, 4919, 4920, 5399
```

Expected: no blank frames, accidental flash frames or missing assets.

- [ ] **Step 4: Render the final master**

```powershell
& 'C:\Users\Owner\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' --dir .\video exec remotion render HandHygieneVideo .\out\手护智感_三分钟介绍_720p.mp4 --codec=h264 --crf=20 --pixel-format=yuv420p --audio-bitrate=192k
```

Expected:

- resolution `1280×720`;
- duration `180 seconds`;
- H.264 video and AAC audio;
- file smaller than `300MB`.

- [ ] **Step 5: Write the material and AI disclosure record**

Create `video/out/素材与AI生成内容说明.md`:

```markdown
# 素材与 AI 生成内容说明

## 项目自有素材

- “手护智感”网页原型界面与四类事件状态截图
- 微信小程序及本地网关项目内容
- 视频内信息图、图标、波形和动画

## AI 辅助内容

- 中文旁白使用 Microsoft Edge TTS 的 zh-CN-XiaoxiaoNeural 生成
- 部分动态图形由程序化动画生成

## 音频

- 环境音乐由本项目脚本程序化生成，不包含第三方采样

## 临床与数据说明

- 界面事件和统计数字均为去标识化原型模拟数据
- 视频不代表已完成临床效能验证
- 系统不替代 WHO“五个时刻”判断或个人最终依从性质控
```

- [ ] **Step 6: Record the checkpoint**

Append final filename, byte size, duration result and QA pass status to `video/IMPLEMENTATION_LOG.md`.

---

### Task 8: Package the final deliverables

**Files:**

- Create: `video/out/手护智感_三分钟视频提交包.zip`
- Create: `video/out/交付清单.md`

**Interfaces:**

- Consumes: master MP4, design spec, implementation plan, disclosure record.
- Produces: one submission-ready archive.

- [ ] **Step 1: Create the delivery checklist**

Create `video/out/交付清单.md`:

```markdown
# “手护智感”三分钟视频交付清单

- [x] 1280×720
- [x] 30fps
- [x] 180秒
- [x] MP4 / H.264 / AAC
- [x] 文件小于300MB
- [x] 不含单位及个人信息
- [x] 原型模拟事件已有明确标识
- [x] AI生成旁白已有明确标识
- [x] 未使用未经授权的第三方素材
- [x] 已说明当前完成度与后续验证阶段
```

- [ ] **Step 2: Package only the required files**

The ZIP must contain:

```text
手护智感_三分钟介绍_720p.mp4
素材与AI生成内容说明.md
交付清单.md
```

Run:

```powershell
Compress-Archive `
  -LiteralPath `
    '.\video\out\手护智感_三分钟介绍_720p.mp4', `
    '.\video\out\素材与AI生成内容说明.md', `
    '.\video\out\交付清单.md' `
  -DestinationPath '.\video\out\手护智感_三分钟视频提交包.zip' `
  -Force
```

- [ ] **Step 3: Verify the archive**

```powershell
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::OpenRead(
  (Resolve-Path '.\video\out\手护智感_三分钟视频提交包.zip')
)
$archive.Entries | Select-Object FullName, Length
$archive.Dispose()
```

Expected: exactly three files and a non-empty MP4.

- [ ] **Step 4: Final checkpoint**

Append:

```markdown
## Task 8

- Final MP4 packaged
- Disclosure record packaged
- Delivery checklist packaged
- ZIP inventory verified
```

to `video/IMPLEMENTATION_LOG.md`.

---

## Final Verification Commands

Run from the workspace root:

```powershell
& 'C:\Users\Owner\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' --dir .\video test
& 'C:\Users\Owner\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\video\scripts\validate-build.mjs
Get-Item -LiteralPath '.\video\out\手护智感_三分钟介绍_720p.mp4' |
  Select-Object FullName, Length, LastWriteTime
Get-Item -LiteralPath '.\video\out\手护智感_三分钟视频提交包.zip' |
  Select-Object FullName, Length, LastWriteTime
```

Expected:

- all Vitest tests pass;
- build validation reports 8 valid narration tracks and a 180-second caption/audio timeline;
- MP4 exists and is smaller than `314572800` bytes;
- ZIP exists and contains exactly the three required deliverables.
