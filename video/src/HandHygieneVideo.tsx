import {AbsoluteFill, Sequence} from "remotion";
import {CaptionTrack} from "./components/CaptionTrack";
import {Disclosure} from "./components/Disclosure";
import {DISCLOSURES} from "./data/assets";
import {SCENES, type SceneId} from "./data/timeline";
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

export const SCENE_PREMOUNT_FRAMES = 30;
export const PROTOTYPE_DISCLOSURE_WINDOW = {
  from: 480,
  durationInFrames: 4440,
} as const;
export const AI_DISCLOSURE_WINDOW = {
  from: 5250,
  durationInFrames: 150,
} as const;

const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  "agent-loop": AgentLoopScene,
  "closing": ClosingScene,
  "hook": HookScene,
  "management": ManagementScene,
  "missed-event": MissedEventScene,
  "positioning": PositioningScene,
  "review-event": ReviewEventScene,
  "valid-event": ValidEventScene,
};

export const HandHygieneVideo: React.FC<HandHygieneVideoProps> = ({
  showAiDisclosure,
  showPrototypeDisclosure,
}) => {
  return (
    <AbsoluteFill>
      {SCENES.map((scene) => {
        const Scene = SCENE_COMPONENTS[scene.id];

        return (
          <Sequence
            durationInFrames={scene.durationInFrames}
            from={scene.from}
            key={scene.id}
            premountFor={SCENE_PREMOUNT_FRAMES}
          >
            <Scene />
          </Sequence>
        );
      })}

      <CaptionTrack />

      {showPrototypeDisclosure ? (
        <Sequence
          from={PROTOTYPE_DISCLOSURE_WINDOW.from}
          durationInFrames={PROTOTYPE_DISCLOSURE_WINDOW.durationInFrames}
          layout="none"
        >
          <Disclosure>{DISCLOSURES[0]}</Disclosure>
        </Sequence>
      ) : null}

      {showAiDisclosure ? (
        <Sequence
          from={AI_DISCLOSURE_WINDOW.from}
          durationInFrames={AI_DISCLOSURE_WINDOW.durationInFrames}
          layout="none"
        >
          <Disclosure bottom={56} maxWidth={610}>
            {DISCLOSURES[3]}
          </Disclosure>
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
