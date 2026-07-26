import type {CSSProperties} from "react";
import {COLORS, FONT_FAMILY} from "../theme";

type DisclosureProps = {
  bottom?: number;
  children: React.ReactNode;
  maxWidth?: number;
  right?: number;
  style?: CSSProperties;
  tone?: "neutral" | "warning";
  top?: number;
};

export const Disclosure: React.FC<DisclosureProps> = ({
  bottom,
  children,
  maxWidth = 560,
  right = 72,
  style,
  tone = "neutral",
  top = 56,
}) => {
  return (
    <div
      style={{
        backdropFilter: "blur(10px)",
        backgroundColor:
          tone === "warning"
            ? "rgba(255, 248, 226, 0.92)"
            : "rgba(255, 255, 255, 0.88)",
        border: `1px solid ${
          tone === "warning" ? "rgba(214, 154, 34, 0.45)" : COLORS.line
        }`,
        borderRadius: 999,
        bottom,
        color: tone === "warning" ? "#74500B" : COLORS.muted,
        fontFamily: FONT_FAMILY,
        fontSize: 22,
        fontWeight: 500,
        lineHeight: 1.25,
        maxWidth,
        padding: "8px 16px",
        position: "absolute",
        right,
        textAlign: "right",
        top: bottom === undefined ? top : undefined,
        zIndex: 20,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
