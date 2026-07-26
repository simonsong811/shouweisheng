export const FPS = 30;
export const TOTAL_FRAMES = 5400;

export const SCENES = [
  {id: "hook", from: 0, durationInFrames: 480},
  {id: "positioning", from: 480, durationInFrames: 600},
  {id: "agent-loop", from: 1080, durationInFrames: 720},
  {id: "valid-event", from: 1800, durationInFrames: 990},
  {id: "missed-event", from: 2790, durationInFrames: 750},
  {id: "review-event", from: 3540, durationInFrames: 780},
  {id: "management", from: 4320, durationInFrames: 600},
  {id: "closing", from: 4920, durationInFrames: 480},
] as const;

export type SceneId = (typeof SCENES)[number]["id"];
export type SceneTiming = (typeof SCENES)[number];
