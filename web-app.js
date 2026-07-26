const STORAGE_KEYS = {
  gatewayBaseUrl: "hh_gateway_base_url",
  siteId: "hh_site_id"
};

const DEFAULT_DEVICES = [
  {
    key: "csi",
    code: "CSI",
    name: "Wi-Fi CSI 采集端",
    desc: "等待支持 CSI 的接收设备上报"
  },
  {
    key: "pressure",
    code: "PRS",
    name: "按压 / 水流传感器",
    desc: "等待按压开关、称重或流量事件"
  },
  {
    key: "presence",
    code: "LOC",
    name: "区域停留传感器",
    desc: "等待红外、门磁或存在检测事件"
  },
  {
    key: "gateway",
    code: "GW",
    name: "边缘网关",
    desc: "负责时间同步、模型调用与证据融合"
  }
];

const DEMO_EVENTS = [
  {
    level: "safe",
    title: "疑似有效手卫生事件",
    label: "疑似有效",
    summary: "按压、区域停留与持续揉搓证据完整，持续时间达到设定阈值。",
    evidence: [
      { name: "停留时间", value: "22 秒" },
      { name: "按压事件", value: "1 次" },
      { name: "CSI 判读", value: "疑似揉搓 · 88%" }
    ],
    stats: { validCount: 42, shortDurationCount: 7, reviewCount: 3 },
    reviewItems: []
  },
  {
    level: "risk",
    title: "手卫生时长不足",
    label: "需要提醒",
    summary: "检测到手消剂按压和疑似揉搓动作，但持续时间未达到 15 秒阈值。",
    evidence: [
      { name: "揉搓时间", value: "9 秒" },
      { name: "按压事件", value: "1 次" },
      { name: "提醒动作", value: "已触发低打扰提醒" }
    ],
    stats: {
      validCount: 42,
      shortDurationCount: 8,
      shortDurationPersonCount: 6,
      reviewCount: 3
    },
    reviewItems: []
  },
  {
    level: "warn",
    title: "证据不足，转人工复核",
    label: "待复核",
    summary: "CSI 片段置信度偏低，按压事件与区域停留时间存在冲突。",
    evidence: [
      { name: "停留时间", value: "13 秒" },
      { name: "按压事件", value: "信号缺失" },
      { name: "CSI 置信度", value: "54%" }
    ],
    stats: { validCount: 42, shortDurationCount: 8, reviewCount: 4 },
    reviewItems: [
      {
        id: "demo-review-01",
        reason: "传感器证据冲突，需确认是否形成有效事件",
        site: "治疗室入口手消点",
        time: "评审演示"
      }
    ]
  },
  {
    level: "warn",
    title: "多人干扰，无法绑定唯一人员",
    label: "复杂场景",
    summary: "两人同时进入手卫生区域，系统仅保留空间级事件并主动停止个人判定。",
    evidence: [
      { name: "区域人数", value: "2 人" },
      { name: "按压事件", value: "1 次" },
      { name: "处置结果", value: "进入复核队列" }
    ],
    stats: { validCount: 42, shortDurationCount: 8, reviewCount: 5 },
    reviewItems: [
      {
        id: "demo-review-02",
        reason: "多人同时在场，无法形成唯一证据对应",
        site: "治疗室入口手消点",
        time: "评审演示"
      }
    ]
  }
];

let demoCursor = 0;

const elements = {
  sidebar: document.querySelector(".sidebar"),
  gatewayBaseUrl: document.querySelector("#gatewayBaseUrl"),
  siteId: document.querySelector("#siteId"),
  saveConfig: document.querySelector("#saveConfig"),
  testConnection: document.querySelector("#testConnection"),
  generateDemoEvent: document.querySelector("#generateDemoEvent"),
  refreshStatus: document.querySelector("#refreshStatus"),
  connectionMessage: document.querySelector("#connectionMessage"),
  systemStatus: document.querySelector("#systemStatus"),
  lastSync: document.querySelector("#lastSync"),
  validCount: document.querySelector("#validCount"),
  shortDurationCount: document.querySelector("#shortDurationCount"),
  shortDurationUnit: document.querySelector("#shortDurationUnit"),
  reviewCount: document.querySelector("#reviewCount"),
  statsScope: document.querySelector("#statsScope"),
  deviceSummary: document.querySelector("#deviceSummary"),
  deviceGrid: document.querySelector("#deviceGrid"),
  decisionSource: document.querySelector("#decisionSource"),
  emptyDecision: document.querySelector("#emptyDecision"),
  decisionCard: document.querySelector("#decisionCard"),
  decisionBadge: document.querySelector("#decisionBadge"),
  latestEventTitle: document.querySelector("#latestEventTitle"),
  latestEventId: document.querySelector("#latestEventId"),
  latestEventSummary: document.querySelector("#latestEventSummary"),
  evidenceList: document.querySelector("#evidenceList"),
  reviewQueueCount: document.querySelector("#reviewQueueCount"),
  reviewQueue: document.querySelector("#reviewQueue")
};

function formatTime(date = new Date()) {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(date);
}

function normalizeBaseUrl(value) {
  return value.trim().replace(/\/+$/, "");
}

function getConfig(showMessage = true) {
  const gatewayBaseUrl = normalizeBaseUrl(elements.gatewayBaseUrl.value);
  const siteId = elements.siteId.value.trim();
  if (!gatewayBaseUrl || !siteId) {
    if (showMessage) {
      setConnectionMessage("请先填写网关地址和点位编号。", "error");
    }
    return null;
  }
  return { gatewayBaseUrl, siteId };
}

function setConnectionMessage(message, state = "") {
  elements.connectionMessage.textContent = message;
  elements.connectionMessage.className = `connection-message ${state}`.trim();
}

function setSystemState(label, state = "pending") {
  elements.systemStatus.textContent = label;
  elements.sidebar.classList.toggle("is-online", state === "online");
  elements.sidebar.classList.toggle("is-offline", state === "offline");
}

function setBusy(button, busy, busyText) {
  if (!button.dataset.label) button.dataset.label = button.textContent;
  button.disabled = busy;
  button.textContent = busy ? busyText : button.dataset.label;
}

async function requestGateway(path) {
  const config = getConfig();
  if (!config) throw new Error("配置不完整");

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);
  const url = new URL(`${config.gatewayBaseUrl}${path}`);
  url.searchParams.set("siteId", config.siteId);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`网关返回 HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") throw new Error("连接超时，请检查网关状态");
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

function renderDevices(payloadDevices = {}) {
  elements.deviceGrid.replaceChildren();
  let onlineCount = 0;

  DEFAULT_DEVICES.forEach((device) => {
    const remote = payloadDevices[device.key] || {};
    const online = remote.online === true;
    if (online) onlineCount += 1;

    const card = document.createElement("article");
    card.className = `device-card ${online ? "online" : "offline"}`;

    const indicator = document.createElement("span");
    indicator.className = "device-indicator";
    indicator.textContent = device.code;

    const copy = document.createElement("div");
    copy.className = "device-copy";
    const name = document.createElement("strong");
    name.textContent = device.name;
    const desc = document.createElement("span");
    desc.textContent = remote.desc || device.desc;
    copy.append(name, desc);

    const state = document.createElement("span");
    state.className = "device-state";
    state.textContent = online ? "在线" : "未连接";

    card.append(indicator, copy, state);
    elements.deviceGrid.append(card);
  });

  elements.deviceSummary.textContent = `${onlineCount} / ${DEFAULT_DEVICES.length} 在线`;
  return onlineCount;
}

function renderStats(stats = {}, reviewItems = []) {
  const validCount = Number(stats.validCount) || 0;
  const eventShortCount = Number(stats.shortDurationCount) || 0;
  const personShortCount = Number(stats.shortDurationPersonCount);
  const hasPersonCount = Number.isFinite(personShortCount) && personShortCount >= 0;
  const reviewCount = Number(stats.reviewCount) || reviewItems.length;

  elements.validCount.textContent = String(validCount);
  elements.shortDurationCount.textContent = String(
    hasPersonCount ? personShortCount : eventShortCount
  );
  elements.shortDurationUnit.textContent = hasPersonCount
    ? "去标识化人次"
    : "事件数";
  elements.reviewCount.textContent = String(reviewCount);
  elements.statsScope.textContent = hasPersonCount
    ? "已授权身份关联，显示去标识化人次"
    : "未关联身份，仅统计事件";
}

function renderLatestEvent(event) {
  if (!event) {
    elements.emptyDecision.hidden = false;
    elements.decisionCard.hidden = true;
    elements.decisionSource.textContent = "等待真实设备事件";
    return;
  }

  const level = ["safe", "risk", "warn"].includes(event.level)
    ? event.level
    : "warn";
  elements.emptyDecision.hidden = true;
  elements.decisionCard.hidden = false;
  elements.decisionCard.className = `decision-card ${level}`;
  elements.decisionBadge.textContent = event.label || "待复核";
  elements.latestEventTitle.textContent = event.title || "未命名事件";
  elements.latestEventId.textContent = event.id || "";
  elements.latestEventSummary.textContent =
    event.summary || "网关未返回事件说明。";
  elements.decisionSource.textContent = "来自网关实时判读";
  elements.evidenceList.replaceChildren();

  const evidence = Array.isArray(event.evidence) ? event.evidence : [];
  evidence.forEach((item) => {
    const wrapper = document.createElement("div");
    wrapper.className = "evidence-item";
    const term = document.createElement("dt");
    term.textContent = item.name || "证据";
    const value = document.createElement("dd");
    value.textContent = item.value || "未返回";
    wrapper.append(term, value);
    elements.evidenceList.append(wrapper);
  });
}

function renderReviewQueue(items = []) {
  const reviewItems = Array.isArray(items) ? items : [];
  elements.reviewQueueCount.textContent = `${reviewItems.length} 条`;
  elements.reviewQueue.replaceChildren();

  if (!reviewItems.length) {
    const empty = document.createElement("div");
    empty.className = "quiet-state";
    empty.textContent =
      "暂无待复核事件。多人干扰、证据冲突或低置信度事件会进入这里。";
    elements.reviewQueue.append(empty);
    return;
  }

  reviewItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = "review-item";
    const copy = document.createElement("div");
    const reason = document.createElement("strong");
    reason.textContent = item.reason || "不确定事件";
    const meta = document.createElement("p");
    meta.textContent = item.site || "未标记点位";
    copy.append(reason, meta);
    const time = document.createElement("time");
    time.textContent = item.time || "";
    card.append(copy, time);
    elements.reviewQueue.append(card);
  });
}

function resetDashboard(message = "等待真实设备事件") {
  renderDevices();
  renderStats();
  renderLatestEvent(null);
  renderReviewQueue();
  elements.decisionSource.textContent = message;
}

function applyGatewayStatus(payload = {}) {
  const reviewItems = Array.isArray(payload.reviewItems)
    ? payload.reviewItems
    : [];
  const onlineCount = renderDevices(payload.devices || {});
  renderStats(payload.stats || {}, reviewItems);
  renderLatestEvent(payload.latestEvent || null);
  renderReviewQueue(reviewItems);
  elements.lastSync.textContent = formatTime();
  setSystemState(onlineCount ? "采集链路在线" : "等待设备接入", onlineCount ? "online" : "pending");
}

async function testConnection() {
  if (!getConfig()) return;
  setBusy(elements.testConnection, true, "连接中");
  setConnectionMessage("正在检查边缘网关…");
  try {
    const payload = await requestGateway("/health");
    const gatewayId = payload.gatewayId ? ` · ${payload.gatewayId}` : "";
    setConnectionMessage(`连接正常${gatewayId}`, "success");
    setSystemState("网关在线", "online");
    elements.lastSync.textContent = formatTime();
  } catch (error) {
    setConnectionMessage(error.message || "连接失败", "error");
    setSystemState("网关离线", "offline");
  } finally {
    setBusy(elements.testConnection, false, "连接中");
  }
}

async function refreshStatus() {
  if (!getConfig()) return;
  setBusy(elements.refreshStatus, true, "刷新中");
  setConnectionMessage("正在读取设备与事件状态…");
  try {
    const payload = await requestGateway("/status");
    applyGatewayStatus(payload);
    setConnectionMessage("状态已更新。", "success");
  } catch (error) {
    resetDashboard("网关暂不可用");
    setConnectionMessage(error.message || "状态读取失败", "error");
    setSystemState("网关离线", "offline");
    elements.lastSync.textContent = formatTime();
  } finally {
    setBusy(elements.refreshStatus, false, "刷新中");
  }
}

function saveConfig() {
  const config = getConfig();
  if (!config) return;
  localStorage.setItem(STORAGE_KEYS.gatewayBaseUrl, config.gatewayBaseUrl);
  localStorage.setItem(STORAGE_KEYS.siteId, config.siteId);
  elements.gatewayBaseUrl.value = config.gatewayBaseUrl;
  setConnectionMessage("配置已保存在当前浏览器。", "success");
}

function generateDemoEvent() {
  const demo = DEMO_EVENTS[demoCursor % DEMO_EVENTS.length];
  demoCursor += 1;

  const devices = Object.fromEntries(
    DEFAULT_DEVICES.map((device) => [
      device.key,
      { online: true, desc: "评审演示链路在线" }
    ])
  );

  applyGatewayStatus({
    devices,
    stats: demo.stats,
    latestEvent: {
      id: `DEMO-${String(demoCursor).padStart(2, "0")}`,
      level: demo.level,
      title: demo.title,
      label: demo.label,
      summary: demo.summary,
      evidence: demo.evidence
    },
    reviewItems: demo.reviewItems
  });

  elements.decisionSource.textContent = "评审演示数据 · 不写入后台";
  setSystemState("评审演示模式", "online");
  setConnectionMessage(
    `已生成第 ${demoCursor} 条演示事件；再次点击可切换下一场景。`,
    "success"
  );
}

function initialize() {
  elements.gatewayBaseUrl.value =
    localStorage.getItem(STORAGE_KEYS.gatewayBaseUrl) || "";
  elements.siteId.value = localStorage.getItem(STORAGE_KEYS.siteId) || "";
  renderDevices();
  resetDashboard();

  elements.saveConfig.addEventListener("click", saveConfig);
  elements.testConnection.addEventListener("click", testConnection);
  elements.generateDemoEvent.addEventListener("click", generateDemoEvent);
  elements.refreshStatus.addEventListener("click", refreshStatus);
}

initialize();
