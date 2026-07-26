import type {CSSProperties} from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {COLORS, SHADOW} from "../theme";

export type HighlightRectangle = {
  height: number;
  left: number;
  top: number;
  width: number;
};

type PrototypeFrameProps = {
  durationInFrames: number;
  highlight?: HighlightRectangle;
  imageOpacity?: number;
  src: string;
  style?: CSSProperties;
};

export const PrototypeFrame: React.FC<PrototypeFrameProps> = ({
  durationInFrames,
  highlight,
  imageOpacity = 1,
  src,
  style,
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        backgroundColor: COLORS.surface,
        border: `1px solid ${COLORS.line}`,
        borderRadius: 28,
        boxShadow: SHADOW,
        height: 500,
        overflow: "hidden",
        position: "relative",
        ...style,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          height: "100%",
          objectFit: "cover",
          opacity: imageOpacity,
          scale: interpolate(
            frame,
            [0, Math.max(1, durationInFrames - 1)],
            [1, 1.035],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          ),
          width: "100%",
        }}
      />
      {highlight ? (
        <AbsoluteFill>
          <div
            style={{
              border: `4px solid ${COLORS.amber}`,
              borderRadius: 16,
              boxShadow:
                "0 0 0 2000px rgba(19, 33, 29, 0.34), 0 0 28px rgba(214, 154, 34, 0.42)",
              height: `${highlight.height}%`,
              left: `${highlight.left}%`,
              position: "absolute",
              top: `${highlight.top}%`,
              width: `${highlight.width}%`,
            }}
          />
        </AbsoluteFill>
      ) : null}
    </div>
  );
};

