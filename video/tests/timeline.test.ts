import {describe, expect, it} from "vitest";
import {SCENES, TOTAL_FRAMES} from "../src/data/timeline";

describe("video timeline", () => {
  it("covers exactly 5400 contiguous frames with the specified scene order", () => {
    expect(TOTAL_FRAMES).toBe(5400);
    expect(SCENES[0].from).toBe(0);

    for (let index = 1; index < SCENES.length; index++) {
      const previous = SCENES[index - 1];
      const current = SCENES[index];
      expect(current.from).toBe(previous.from + previous.durationInFrames);
    }

    const lastScene = SCENES[SCENES.length - 1];
    expect(lastScene.from + lastScene.durationInFrames).toBe(5400);
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
