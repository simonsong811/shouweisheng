import {fontFamily, loadFont} from "@remotion/google-fonts/NotoSansSC";

loadFont("normal", {
  ignoreTooManyRequestsWarning: true,
  weights: ["400", "500", "700"],
  subsets: ["chinese-simplified", "latin"],
});

export const FONT_FAMILY = fontFamily;

export const COLORS = {
  background: "#F3F8F6",
  surface: "#FFFFFF",
  ink: "#13211D",
  muted: "#64736E",
  teal: "#07877F",
  tealSoft: "#DDF2EE",
  amber: "#D69A22",
  red: "#B53A40",
  line: "#D9E4E0",
} as const;

export const TYPOGRAPHY = {
  hero: 72,
  title: 54,
  body: 32,
  label: 24,
  caption: 28,
} as const;

export const SAFE_AREA = {
  horizontal: 72,
  vertical: 56,
} as const;

export const SHADOW = "0 18px 48px rgba(19, 33, 29, 0.12)";
