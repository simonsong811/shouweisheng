import {Easing, interpolate, useCurrentFrame} from "remotion";
import {Disclosure} from "../components/Disclosure";
import {Headline} from "../components/Headline";
import {
  PrototypeFrame,
  type HighlightRectangle,
} from "../components/PrototypeFrame";
import {Stage} from "../components/Stage";
import {WorkflowLoop} from "../components/WorkflowLoop";
import {DISCLOSURES, PROTOTYPE_ASSETS} from "../data/assets";
import {COLORS, SHADOW, TYPOGRAPHY} from "../theme";

const Tag: React.FC<{
  children: React.ReactNode;
  tone?: "default" | "amber" | "red";
}> = ({children, tone = "default"}) => {
  const palette =
    tone === "red"
      ? {background: "#F9E6E7", color: COLORS.red}
      : tone === "amber"
        ? {background: "#FFF3D9", color: "#86600F"}
        : {background: COLORS.tealSoft, color: COLORS.teal};

  return (
    <div
      style={{
        backgroundColor: palette.background,
        borderRadius: 999,
        color: palette.color,
        fontSize: TYPOGRAPHY.label,
        fontWeight: 700,
        lineHeight: 1.2,
        padding: "12px 18px",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
};

const EntranceIllustration: React.FC = () => {
  const frame = useCurrentFrame();
  const personX = interpolate(frame, [25, 390], [-170, 520], {
    easing: Easing.bezier(0.42, 0, 0.58, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dispenserPulse = interpolate(
    frame % 60,
    [0, 30, 59],
    [0.16, 0.45, 0.16],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <div
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(221,242,238,0.74))",
        border: `2px solid ${COLORS.line}`,
        borderRadius: 32,
        boxShadow: SHADOW,
        height: 500,
        overflow: "hidden",
        position: "relative",
        width: 500,
      }}
    >
      <div
        style={{
          backgroundColor: "#D4E2DE",
          height: 4,
          left: 0,
          position: "absolute",
          top: 400,
          width: "100%",
        }}
      />
      <div
        style={{
          backgroundColor: "#E6EFEC",
          border: `4px solid ${COLORS.line}`,
          borderBottom: 0,
          borderRadius: "18px 18px 0 0",
          height: 340,
          left: 65,
          position: "absolute",
          top: 64,
          width: 270,
        }}
      >
        <div
          style={{
            backgroundColor: COLORS.tealSoft,
            height: "100%",
            marginLeft: 130,
            width: 6,
          }}
        />
      </div>
      <div
        style={{
          backgroundColor: COLORS.surface,
          border: `3px solid ${COLORS.teal}`,
          borderRadius: 14,
          boxShadow: `0 0 0 18px rgba(7, 135, 127, ${dispenserPulse})`,
          height: 82,
          position: "absolute",
          right: 45,
          top: 190,
          width: 62,
        }}
      >
        <div
          style={{
            backgroundColor: COLORS.teal,
            borderRadius: 4,
            height: 11,
            left: 13,
            position: "absolute",
            top: 17,
            width: 34,
          }}
        />
        <div
          style={{
            backgroundColor: COLORS.tealSoft,
            borderRadius: 5,
            bottom: 12,
            height: 31,
            left: 14,
            position: "absolute",
            width: 32,
          }}
        />
      </div>
      <div
        style={{
          color: COLORS.teal,
          fontSize: TYPOGRAPHY.label,
          fontWeight: 700,
          position: "absolute",
          right: 26,
          textAlign: "center",
          top: 292,
          width: 100,
        }}
      >
        固定
        <br />
        手消点
      </div>

      <div
        style={{
          height: 250,
          left: 0,
          position: "absolute",
          top: 164,
          translate: `${personX}px 0`,
          width: 120,
        }}
      >
        <div
          style={{
            backgroundColor: "#526660",
            borderRadius: "50%",
            height: 58,
            left: 31,
            position: "absolute",
            top: 0,
            width: 58,
          }}
        />
        <div
          style={{
            backgroundColor: "#526660",
            borderRadius: "48px 48px 22px 22px",
            height: 150,
            left: 10,
            position: "absolute",
            top: 52,
            width: 100,
          }}
        />
        <div
          style={{
            backgroundColor: "#526660",
            borderRadius: 20,
            height: 92,
            left: 20,
            position: "absolute",
            rotate: "8deg",
            top: 176,
            width: 27,
          }}
        />
        <div
          style={{
            backgroundColor: "#526660",
            borderRadius: 20,
            height: 92,
            position: "absolute",
            right: 20,
            rotate: "-8deg",
            top: 176,
            width: 27,
          }}
        />
      </div>
    </div>
  );
};

export const HookScene: React.FC = () => {
  return (
    <Stage>
      <div
        style={{
          alignItems: "center",
          display: "grid",
          gap: 56,
          gridTemplateColumns: "1fr 500px",
        }}
      >
        <Headline
          accent="人工观察难持续｜摄像头有隐私顾虑"
          eyebrow="治疗室入口"
          maxWidth={570}
          title="一次匆忙经过，手卫生可能成为被忽略的一步"
        />
        <EntranceIllustration />
      </div>
    </Stage>
  );
};

export const PositioningScene: React.FC = () => {
  const frame = useCurrentFrame();
  const screenshotOpacity = interpolate(frame, [20, 50], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage>
      <div
        style={{
          alignItems: "center",
          display: "grid",
          gap: 46,
          gridTemplateColumns: "390px 1fr",
        }}
      >
        <div style={{display: "flex", flexDirection: "column", gap: 26}}>
          <Headline
            accent="非视觉化手卫生 AI 智能体"
            eyebrow="项目亮相"
            maxWidth={390}
            title="手护智感"
            titleSize={TYPOGRAPHY.hero}
          />
          <div style={{display: "flex", flexWrap: "wrap", gap: 12}}>
            <Tag>治疗室入口</Tag>
            <Tag>ICU 床旁</Tag>
            <Tag>缓冲间</Tag>
          </div>
          <div
            style={{
              color: COLORS.muted,
              fontSize: 26,
              lineHeight: 1.5,
            }}
          >
            Wi-Fi CSI × 多源事件
            <br />
            初筛 · 提醒 · 复核
          </div>
        </div>
        <PrototypeFrame
          durationInFrames={600}
          src={PROTOTYPE_ASSETS.valid}
          style={{opacity: screenshotOpacity, width: 700}}
        />
      </div>
    </Stage>
  );
};

export const AgentLoopScene: React.FC = () => {
  return (
    <Stage justify="flex-start">
      <div style={{display: "flex", flexDirection: "column", gap: 10}}>
        <Headline
          accent="感知 → 推理 → 行动 → 学习"
          eyebrow="可解释闭环"
          maxWidth={720}
          title="AI 智能体闭环"
        />
        <div style={{alignSelf: "center"}}>
          <WorkflowLoop />
        </div>
      </div>
    </Stage>
  );
};

const getValidHighlight = (frame: number): HighlightRectangle => {
  if (frame < 220) {
    return {height: 38, left: 29, top: 18, width: 68};
  }

  if (frame < 500) {
    return {height: 18, left: 29, top: 57, width: 68};
  }

  return {height: 24, left: 29, top: 73, width: 68};
};

const StoryCopy: React.FC<{
  eyebrow: string;
  evidence?: React.ReactNode;
  title: string;
}> = ({evidence, eyebrow, title}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        justifyContent: "center",
        minWidth: 0,
      }}
    >
      <Headline
        eyebrow={eyebrow}
        maxWidth={380}
        title={title}
        titleSize={44}
      />
      {evidence}
    </div>
  );
};

export const ValidEventScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Stage>
      <div
        style={{
          alignItems: "center",
          display: "grid",
          gap: 42,
          gridTemplateColumns: "720px 1fr",
        }}
      >
        <PrototypeFrame
          durationInFrames={990}
          highlight={getValidHighlight(frame)}
          src={PROTOTYPE_ASSETS.valid}
          style={{width: 720}}
        />
        <StoryCopy
          evidence={
            <div style={{display: "flex", flexDirection: "column", gap: 12}}>
              <Tag>区域停留</Tag>
              <Tag>手消剂按压</Tag>
              <Tag>连续揉搓样动作</Tag>
            </div>
          }
          eyebrow="疑似有效事件"
          title="多源证据融合，不依赖单一传感器"
        />
      </div>
      <Disclosure bottom={56} tone="warning">
        {DISCLOSURES[1]}
      </Disclosure>
    </Stage>
  );
};

export const MissedEventScene: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = (index: number) =>
    interpolate(frame, [index * 70, index * 70 + 18], [0, 1], {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return (
    <Stage>
      <div
        style={{
          alignItems: "center",
          display: "grid",
          gap: 42,
          gridTemplateColumns: "720px 1fr",
        }}
      >
        <PrototypeFrame
          durationInFrames={750}
          highlight={{height: 19, left: 29, top: 57, width: 68}}
          src={PROTOTYPE_ASSETS.missed}
          style={{width: 720}}
        />
        <StoryCopy
          evidence={
            <div style={{display: "flex", flexDirection: "column", gap: 14}}>
              {[
                "快速经过 5 秒",
                "未检测到按压",
                "未识别稳定揉搓",
              ].map((item, index) => (
                <div
                  key={item}
                  style={{
                    opacity: reveal(index),
                    scale: interpolate(reveal(index), [0, 1], [0.94, 1]),
                  }}
                >
                  <Tag tone={index === 0 ? "amber" : "red"}>{item}</Tag>
                </div>
              ))}
            </div>
          }
          eyebrow="遗漏风险"
          title="从事后统计，前移至现场提醒"
        />
      </div>
    </Stage>
  );
};

const ReviewPrototype: React.FC = () => {
  const frame = useCurrentFrame();
  const crossfade = interpolate(frame, [330, 450], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{height: 500, position: "relative", width: 720}}>
      <PrototypeFrame
        durationInFrames={780}
        src={PROTOTYPE_ASSETS.review}
        style={{
          left: 0,
          opacity: 1 - crossfade,
          position: "absolute",
          top: 0,
          width: 720,
        }}
      />
      <PrototypeFrame
        durationInFrames={780}
        src={PROTOTYPE_ASSETS.interference}
        style={{
          left: 0,
          opacity: crossfade,
          position: "absolute",
          top: 0,
          width: 720,
        }}
      />
    </div>
  );
};

export const ReviewEventScene: React.FC = () => {
  const frame = useCurrentFrame();
  const copyReveal = interpolate(frame, [250, 310], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage>
      <div
        style={{
          alignItems: "center",
          display: "grid",
          gap: 42,
          gridTemplateColumns: "720px 1fr",
        }}
      >
        <ReviewPrototype />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            opacity: copyReveal,
          }}
        >
          <Headline
            eyebrow="待复核事件"
            maxWidth={380}
            title="AI 识别不确定性，而不是过度判断"
            titleSize={42}
          />
          <div style={{display: "flex", flexWrap: "wrap", gap: 12}}>
            <Tag tone="amber">数据缺失</Tag>
            <Tag tone="amber">低置信度</Tag>
            <Tag tone="amber">多人干扰</Tag>
            <Tag>转人工复核</Tag>
          </div>
        </div>
      </div>
    </Stage>
  );
};

const MANAGEMENT_CARDS = [
  {
    detail: "不采集视频、音频与人脸",
    number: "01",
    title: "非视觉化",
  },
  {
    detail: "CSI × 按压 × 停留 × 设备状态",
    number: "02",
    title: "多源证据融合",
  },
  {
    detail: "风险发现与人工确认相连接",
    number: "03",
    title: "提醒—复核—改进闭环",
  },
] as const;

export const ManagementScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <Stage justify="flex-start">
      <div style={{display: "flex", flexDirection: "column", gap: 34}}>
        <Headline
          accent="形成可解释、可复核的重点空间管理闭环"
          eyebrow="管理价值"
          maxWidth={720}
          title="把事件变成可行动的改进线索"
        />
        <div style={{display: "grid", gap: 22, gridTemplateColumns: "repeat(3, 1fr)"}}>
          {MANAGEMENT_CARDS.map((card, index) => {
            const reveal = interpolate(
              frame,
              [index * 60, index * 60 + 18],
              [0, 1],
              {
                easing: Easing.bezier(0.16, 1, 0.3, 1),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            );

            return (
              <div
                key={card.number}
                style={{
                  backgroundColor:
                    index === 2 ? COLORS.teal : COLORS.surface,
                  border: `2px solid ${
                    index === 2 ? COLORS.teal : COLORS.line
                  }`,
                  borderRadius: 28,
                  boxShadow: SHADOW,
                  color: index === 2 ? COLORS.surface : COLORS.ink,
                  minHeight: 230,
                  opacity: reveal,
                  padding: "28px 30px",
                  scale: interpolate(reveal, [0, 1], [0.92, 1]),
                }}
              >
                <div
                  style={{
                    color:
                      index === 2 ? "rgba(255,255,255,0.68)" : COLORS.teal,
                    fontSize: TYPOGRAPHY.label,
                    fontWeight: 700,
                    marginBottom: 18,
                  }}
                >
                  {card.number}
                </div>
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    minHeight: 82,
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    color:
                      index === 2 ? "rgba(255,255,255,0.82)" : COLORS.muted,
                    fontSize: TYPOGRAPHY.label,
                    lineHeight: 1.4,
                    marginTop: 16,
                  }}
                >
                  {card.detail}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{display: "flex", gap: 14, justifyContent: "center"}}>
          <Tag>治疗室入口</Tag>
          <Tag>ICU 床旁</Tag>
          <Tag>缓冲间</Tag>
        </div>
      </div>
    </Stage>
  );
};

const CURRENT_ITEMS = [
  "小程序管理端",
  "网页管理端",
  "本地联调网关",
  "事件复核流程",
] as const;

const NEXT_ITEMS = [
  "接入真实传感设备",
  "场景数据采集",
  "模型训练",
  "前瞻性验证",
] as const;

const DeliveryColumn: React.FC<{
  items: readonly string[];
  title: string;
  tone: "current" | "next";
}> = ({items, title, tone}) => {
  return (
    <div
      style={{
        backgroundColor:
          tone === "current" ? COLORS.surface : "rgba(221, 242, 238, 0.72)",
        border: `2px solid ${
          tone === "current" ? COLORS.line : "rgba(7, 135, 127, 0.28)"
        }`,
        borderRadius: 30,
        boxShadow: SHADOW,
        minHeight: 430,
        padding: "34px 40px",
      }}
    >
      <div
        style={{
          color: COLORS.teal,
          fontSize: 38,
          fontWeight: 700,
          marginBottom: 26,
        }}
      >
        {title}
      </div>
      <div style={{display: "flex", flexDirection: "column", gap: 22}}>
        {items.map((item) => (
          <div
            key={item}
            style={{
              alignItems: "center",
              display: "flex",
              fontSize: 30,
              fontWeight: 500,
              gap: 16,
            }}
          >
            <div
              style={{
                backgroundColor:
                  tone === "current" ? COLORS.teal : COLORS.amber,
                borderRadius: 999,
                flex: "0 0 auto",
                height: 12,
                width: 12,
              }}
            />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const titleCard = interpolate(frame, [220, 260], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Stage>
      <div
        style={{
          display: "grid",
          gap: 30,
          gridTemplateColumns: "1fr 1fr",
          opacity: 1 - titleCard,
          width: "100%",
        }}
      >
        <DeliveryColumn
          items={CURRENT_ITEMS}
          title="当前已完成"
          tone="current"
        />
        <DeliveryColumn items={NEXT_ITEMS} title="下一阶段" tone="next" />
      </div>

      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          inset: "56px 72px",
          justifyContent: "center",
          opacity: titleCard,
          position: "absolute",
          textAlign: "center",
        }}
      >
        <div
          style={{
            backgroundColor: COLORS.teal,
            borderRadius: 999,
            color: COLORS.surface,
            fontSize: TYPOGRAPHY.label,
            fontWeight: 700,
            letterSpacing: 3,
            marginBottom: 30,
            padding: "10px 24px",
          }}
        >
          非视觉化手卫生 AI 智能体
        </div>
        <div
          style={{
            fontSize: TYPOGRAPHY.hero,
            fontWeight: 700,
            lineHeight: 1.08,
          }}
        >
          手护智感
        </div>
        <div
          style={{
            color: COLORS.teal,
            fontSize: 40,
            fontWeight: 500,
            marginTop: 24,
          }}
        >
          让感知更隐私，让提醒更及时
        </div>
        <div
          style={{
            borderTop: `1px solid ${COLORS.line}`,
            color: COLORS.muted,
            fontSize: 22,
            lineHeight: 1.45,
            marginTop: 56,
            maxWidth: 940,
            paddingTop: 20,
          }}
        >
          {DISCLOSURES[2]}
        </div>
      </div>
    </Stage>
  );
};
