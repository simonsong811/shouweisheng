import {Easing, interpolate, useCurrentFrame} from "remotion";
import {COLORS, TYPOGRAPHY} from "../theme";

const NODES = [
  {
    detail: "CSI、按压、停留、设备状态",
    label: "感知",
    x: 80,
    y: 80,
  },
  {
    detail: "类别、时长、置信度",
    label: "推理",
    x: 700,
    y: 80,
  },
  {
    detail: "提醒、记录、人工复核",
    label: "行动",
    x: 700,
    y: 300,
  },
  {
    detail: "阈值校准、场景优化",
    label: "学习",
    x: 80,
    y: 300,
  },
] as const;

const PATHS = [
  "M300 145 H680",
  "M790 190 V285",
  "M680 365 H300",
  "M190 300 V205",
] as const;

export const getWorkflowNodeRevealRange = (
  index: number,
): readonly [number, number] => {
  const end = index * 120;
  return [end - 18, end];
};

export const WorkflowLoop: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        height: 450,
        position: "relative",
        width: 1000,
      }}
    >
      <svg
        aria-hidden="true"
        height="450"
        style={{left: 0, position: "absolute", top: 0}}
        viewBox="0 0 1000 450"
        width="1000"
      >
        <defs>
          <marker
            id="arrow"
            markerHeight="10"
            markerWidth="10"
            orient="auto"
            refX="7"
            refY="3"
          >
            <path d="M0,0 L0,6 L8,3 z" fill={COLORS.teal} />
          </marker>
        </defs>
        {PATHS.map((path, index) => {
          const progress = interpolate(
            frame,
            [index * 120 + 50, index * 120 + 110],
            [0, 1],
            {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            },
          );
          return (
            <path
              d={path}
              fill="none"
              key={path}
              markerEnd={progress > 0 ? "url(#arrow)" : undefined}
              pathLength="1"
              stroke={COLORS.teal}
              strokeDasharray="1"
              strokeDashoffset={1 - progress}
              strokeLinecap="round"
              strokeWidth="5"
            />
          );
        })}
      </svg>

      {NODES.map((node, index) => {
        const revealRange = getWorkflowNodeRevealRange(index);
        const reveal = interpolate(
          frame,
          revealRange,
          [0, 1],
          {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );

        return (
          <div
            key={node.label}
            style={{
              alignItems: "center",
              backgroundColor: COLORS.surface,
              border: `2px solid ${COLORS.line}`,
              borderRadius: 24,
              boxShadow: "0 12px 30px rgba(19, 33, 29, 0.08)",
              display: "flex",
              height: 130,
              left: node.x,
              opacity: reveal,
              padding: "18px 24px",
              position: "absolute",
              scale: interpolate(reveal, [0, 1], [0.9, 1]),
              top: node.y,
              width: 220,
            }}
          >
            <div>
              <div
                style={{
                  color: COLORS.teal,
                  fontSize: 34,
                  fontWeight: 700,
                  lineHeight: 1,
                  marginBottom: 12,
                }}
              >
                {node.label}
              </div>
              <div
                style={{
                  color: COLORS.muted,
                  fontSize: TYPOGRAPHY.label,
                  fontWeight: 500,
                  lineHeight: 1.35,
                }}
              >
                {node.detail}
              </div>
            </div>
          </div>
        );
      })}

      <div
        style={{
          alignItems: "center",
          backgroundColor: COLORS.teal,
          borderRadius: 999,
          color: COLORS.surface,
          display: "flex",
          fontSize: TYPOGRAPHY.body,
          fontWeight: 700,
          height: 124,
          justifyContent: "center",
          left: 438,
          lineHeight: 1.2,
          position: "absolute",
          textAlign: "center",
          top: 190,
          width: 124,
        }}
      >
        AI
        <br />
        智能体
      </div>
    </div>
  );
};
