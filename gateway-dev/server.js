const http = require("http");
const { URL } = require("url");

const PORT = 8787;

const siteProfiles = {
  "treatment-room-01": "治疗室入口手消点",
  "icu-bedside-01": "ICU 床旁手消点",
  "buffer-room-01": "缓冲间洗手区"
};

let eventCursor = 0;

const eventStream = [
  {
    level: "safe",
    title: "疑似发生手卫生",
    label: "疑似发生",
    summary: "检测到按压事件、区域停留和疑似揉搓动作，记录为空间级疑似手卫生事件。",
    evidence: [
      { name: "停留时间", value: "18 秒" },
      { name: "按压事件", value: "1 次" },
      { name: "CSI 判读", value: "疑似揉搓" }
    ]
  },
  {
    level: "risk",
    title: "手卫生时长不足",
    label: "需要提醒",
    summary: "已检测到按压事件，但揉搓持续时间低于阈值，建议进行温和提醒。",
    evidence: [
      { name: "停留时间", value: "9 秒" },
      { name: "按压事件", value: "1 次" },
      { name: "时长阈值", value: "15 秒" }
    ]
  },
  {
    level: "warn",
    title: "无法判断",
    label: "待复核",
    summary: "区域内存在多人活动，CSI 片段与身份信号无法形成唯一对应。",
    evidence: [
      { name: "停留时间", value: "22 秒" },
      { name: "按压事件", value: "1 次" },
      { name: "场景状态", value: "多人干扰" }
    ]
  }
];

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  response.end(JSON.stringify(payload, null, 2));
}

function buildStatus(siteId) {
  const event = eventStream[eventCursor % eventStream.length];
  eventCursor += 1;

  const shortDurationCount = 6 + Math.floor(eventCursor / 3);
  const reviewCount = event.level === "warn" ? 4 : 3;

  return {
    siteId,
    siteName: siteProfiles[siteId] || siteId,
    devices: {
      csi: {
        online: true,
        desc: "CSI receiver online"
      },
      pressure: {
        online: true,
        desc: "press sensor online"
      },
      presence: {
        online: true,
        desc: "presence sensor online"
      },
      gateway: {
        online: true,
        desc: "edge service online"
      }
    },
    stats: {
      validCount: 38 + eventCursor,
      shortDurationCount,
      reviewCount
    },
    latestEvent: {
      id: `evt-${Date.now()}`,
      ...event
    },
    reviewItems:
      event.level === "warn"
        ? [
            {
              id: "rev-001",
              reason: "多人同时在场，无法绑定唯一人员",
              time: currentTime(),
              site: siteProfiles[siteId] || siteId
            }
          ]
        : []
  };
}

function currentTime() {
  const now = new Date();
  const hour = `${now.getHours()}`.padStart(2, "0");
  const minute = `${now.getMinutes()}`.padStart(2, "0");
  return `${hour}:${minute}`;
}

const server = http.createServer((request, response) => {
  if (request.method === "OPTIONS") {
    sendJson(response, 200, { ok: true });
    return;
  }

  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const siteId = requestUrl.searchParams.get("siteId") || "treatment-room-01";

  if (requestUrl.pathname === "/health") {
    sendJson(response, 200, {
      ok: true,
      gatewayId: "gateway-dev-01",
      version: "0.1.0"
    });
    return;
  }

  if (requestUrl.pathname === "/status") {
    sendJson(response, 200, buildStatus(siteId));
    return;
  }

  sendJson(response, 404, {
    ok: false,
    message: "Not found"
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Hand hygiene gateway listening on http://127.0.0.1:${PORT}`);
});
