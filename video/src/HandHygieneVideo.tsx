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
            premountFor={30}
          >
            <Scene />
          </Sequence>
        );
      })}

      <CaptionTrack />

      {showPrototypeDisclosure ? (
        <Sequence from={480} durationInFrames={4440} layout="none">
          <Disclosure>{DISCLOSURES[0]}</Disclosure>
        </Sequence>
      ) : null}

      {showAiDisclosure ? (
        <Sequence from={5250} durationInFrames={150} layout="none">
          <Disclosure bottom={56} maxWidth={610}>
            {DISCLOSURES[3]}
          </Disclosure>
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
