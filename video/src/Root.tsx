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
