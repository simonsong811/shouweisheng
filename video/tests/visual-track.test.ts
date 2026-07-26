import {describe, expect, it} from "vitest";
import {CaptionTrack} from "../src/components/CaptionTrack";
import {getWorkflowNodeRevealRange} from "../src/components/WorkflowLoop";
import {
  AgentLoopScene,
  ClosingScene,
  HookScene,
  ManagementScene,
  MissedEventScene,
  PositioningScene,
  ReviewEventScene,
  ValidEventScene,
} from "../src/scenes/Scenes";
import {COLORS, SAFE_AREA, TYPOGRAPHY} from "../src/theme";

describe("silent visual track contract", () => {
  it("exports all eight required scene components", () => {
    expect([
      HookScene,
      PositioningScene,
      AgentLoopScene,
      ValidEventScene,
      MissedEventScene,
      ReviewEventScene,
      ManagementScene,
      ClosingScene,
    ]).toHaveLength(8);

    for (const scene of [
      HookScene,
      PositioningScene,
      AgentLoopScene,
      ValidEventScene,
      MissedEventScene,
      ReviewEventScene,
      ManagementScene,
      ClosingScene,
    ]) {
      expect(scene).toBeTypeOf("function");
    }
  });

  it("uses the approved safe area, palette, and type scale", () => {
    expect(SAFE_AREA).toEqual({horizontal: 72, vertical: 56});
    expect(COLORS).toMatchObject({
      background: "#F3F8F6",
      surface: "#FFFFFF",
      ink: "#13211D",
      muted: "#64736E",
      teal: "#07877F",
      tealSoft: "#DDF2EE",
      amber: "#D69A22",
      red: "#B53A40",
      line: "#D9E4E0",
    });
    expect(TYPOGRAPHY).toEqual({
      hero: 72,
      title: 54,
      body: 32,
      label: 24,
      caption: 28,
    });
  });

  it("keeps the caption track inert until Task 6", () => {
    expect(CaptionTrack({})).toBeNull();
  });

  it("keeps every workflow reveal range strictly increasing", () => {
    for (let index = 0; index < 4; index++) {
      const [start, end] = getWorkflowNodeRevealRange(index);
      expect(end).toBeGreaterThan(start);
      expect(end).toBe(index * 120);
    }
  });
});
