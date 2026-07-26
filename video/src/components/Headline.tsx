import type {CSSProperties} from "react";
import {Easing, interpolate, useCurrentFrame} from "remotion";
import {COLORS, TYPOGRAPHY} from "../theme";

type HeadlineProps = {
  accent?: string;
  align?: CSSProperties["textAlign"];
  eyebrow?: string;
  maxWidth?: number;
  title: string;
  titleSize?: number;
};

export const Headline: React.FC<HeadlineProps> = ({
  accent,
  align = "left",
  eyebrow,
  maxWidth = 1040,
  title,
  titleSize = TYPOGRAPHY.title,
}) => {
  const frame = useCurrentFrame();
  const entrance = interpolate(frame, [0, 18], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        maxWidth,
        opacity: entrance,
        textAlign: align,
        translate: `0 ${interpolate(entrance, [0, 1], [24, 0])}px`,
      }}
    >
      {eyebrow ? (
        <div
          style={{
            color: COLORS.teal,
            fontSize: TYPOGRAPHY.label,
            fontWeight: 700,
            letterSpacing: 2,
            marginBottom: 10,
          }}
        >
          {eyebrow}
        </div>
      ) : null}
      <div
        style={{
          fontSize: titleSize,
          fontWeight: 700,
          letterSpacing: -1.5,
          lineHeight: 1.13,
        }}
      >
        {title}
      </div>
      {accent ? (
        <div
          style={{
            color: COLORS.muted,
            fontSize: TYPOGRAPHY.body,
            fontWeight: 400,
            lineHeight: 1.45,
            marginTop: 16,
          }}
        >
          {accent}
        </div>
      ) : null}
    </div>
  );
};

