import type {CSSProperties, PropsWithChildren} from "react";
import {AbsoluteFill} from "remotion";
import {COLORS, FONT_FAMILY, SAFE_AREA} from "../theme";

type StageProps = PropsWithChildren<{
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  style?: CSSProperties;
}>;

export const Stage: React.FC<StageProps> = ({
  align = "stretch",
  children,
  justify = "center",
  style,
}) => {
  return (
    <AbsoluteFill
      style={{
        alignItems: align,
        backgroundColor: COLORS.background,
        color: COLORS.ink,
        display: "flex",
        fontFamily: FONT_FAMILY,
        justifyContent: justify,
        overflow: "hidden",
        padding: `${SAFE_AREA.vertical}px ${SAFE_AREA.horizontal}px`,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

