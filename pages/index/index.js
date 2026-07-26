const STORAGE_KEYS = {
  apiBaseUrl: "hh_api_base_url",
  siteId: "hh_site_id"
};

const DEFAULT_DEVICES = [
  {
    key: "csi",
    name: "WiFi CSI 采集端",
    desc: "等待 ESP32/网卡网关上报",
    state: "offline",
    stateText: "未连接"
  },
  {
    key: "pressure",
    name: "手消按压传感器",
    desc: "等待按压开关或 HX711 上报",
    state: "offline",
    stateText: "未连接"
  },
  {
    key: "presence",
    name: "区域停留传感器",
    desc: "等待红外、门磁或毫米波上报",
    state: "offline",
    stateText: "未连接"
  },
  {
    key: "gateway",
    name: "边缘网关",
    desc: "负责时间戳对齐与模型推理",
    state: "offline",
    stateText: "未连接"
  }
];

Page({
  data: {
    apiBaseUrl: "",
    siteId: "",
    spaceName: "未配置",
    dataSourceLabel: "真实数据",
    lastSyncText: "未同步",
    systemStatusText: "待接入",
    systemStatusClass: "pending",
    decisionSourceText: "等待真实传感器数据",
    loadingStatus: false,
    testingConnection: false,
    stats: {
      validCount: 0,
      shortDurationCount: 0,
      reviewCount: 0
    },
    devices: DEFAULT_DEVICES,
    latestEvent: null,
    reviewItems: [],
    workflow: [
      {
        title: "连接设备",
        desc: "接入 WiFi CSI 采集端、按压传感器和区域停留传感器。"
      },
      {
        title: "同步时间戳",
        desc: "边缘网关统一记录 CSI 片段、按压事件和停留时间。"
      },
      {
        title: "采集标注样本",
        desc: "按经过、靠近未手消、按压后揉搓、整理袖口、多人干扰分组采集。"
      },
      {
        title: "模型判读",
        desc: "后台返回疑似发生、未发生或无法判断，疑难事件进入复核。"
      }
    ]
  },

  onLoad() {
    const apiBaseUrl = wx.getStorageSync(STORAGE_KEYS.apiBaseUrl) || "";
    const siteId = wx.getStorageSync(STORAGE_KEYS.siteId) || "";
    this.setData({
      apiBaseUrl,
      siteId,
      spaceName: siteId || "未配置"
    });
  },

  onApiInput(event) {
    this.setData({ apiBaseUrl: event.detail.value.trim() });
  },

  onSiteInput(event) {
    this.setData({
      siteId: event.detail.value.trim(),
      spaceName: event.detail.value.trim() || "未配置"
    });
  },

  saveConfig() {
    wx.setStorageSync(STORAGE_KEYS.apiBaseUrl, this.data.apiBaseUrl);
    wx.setStorageSync(STORAGE_KEYS.siteId, this.data.siteId);
    wx.showToast({
      title: "已保存",
      icon: "success"
    });
  },

  refreshStatus() {
    if (!this.hasEndpoint()) return;

    this.setData({ loadingStatus: true });
    this.requestGateway("/status")
      .then((payload) => {
        this.applyGatewayStatus(payload);
      })
      .catch(() => {
        this.markGatewayOffline("连接失败");
      })
      .finally(() => {
        this.setData({ loadingStatus: false });
      });
  },

  testConnection() {
    if (!this.hasEndpoint()) return;

    this.setData({ testingConnection: true });
    this.requestGateway("/health")
      .then(() => {
        this.setData({
          systemStatusText: "网关在线",
          systemStatusClass: "online",
          lastSyncText: this.formatTime(new Date())
        });
        wx.showToast({
          title: "连接正常",
          icon: "success"
        });
      })
      .catch(() => {
        this.markGatewayOffline("测试失败");
      })
      .finally(() => {
        this.setData({ testingConnection: false });
      });
  },

  hasEndpoint() {
    if (!this.data.apiBaseUrl || !this.data.siteId) {
      wx.showToast({
        title: "请先填写配置",
        icon: "none"
      });
      return false;
    }
    return true;
  },

  requestGateway(path) {
    const baseUrl = this.data.apiBaseUrl.replace(/\/$/, "");
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${baseUrl}${path}`,
        method: "GET",
        data: {
          siteId: this.data.siteId
        },
        timeout: 8000,
        success: (response) => {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            resolve(response.data || {});
          } else {
            reject(new Error(`HTTP ${response.statusCode}`));
          }
        },
        fail: reject
      });
    });
  },

  applyGatewayStatus(payload) {
    const devices = DEFAULT_DEVICES.map((device) => {
      const remote = payload.devices && payload.devices[device.key];
      if (!remote) return device;
      return {
        ...device,
        desc: remote.desc || device.desc,
        state: remote.online ? "online" : "offline",
        stateText: remote.online ? "在线" : "离线"
      };
    });

    const latestEvent = payload.latestEvent || null;
    const reviewItems = Array.isArray(payload.reviewItems) ? payload.reviewItems : [];
    const stats = {
      validCount: Number(payload.stats && payload.stats.validCount) || 0,
      shortDurationCount: Number(payload.stats && payload.stats.shortDurationCount) || 0,
      reviewCount: Number(payload.stats && payload.stats.reviewCount) || reviewItems.length
    };
    const anyOnline = devices.some((device) => device.state === "online");

    this.setData({
      devices,
      latestEvent,
      reviewItems,
      stats,
      lastSyncText: this.formatTime(new Date()),
      systemStatusText: anyOnline ? "采集中" : "待接入",
      systemStatusClass: anyOnline ? "online" : "pending",
      decisionSourceText: latestEvent ? "来自网关实时判读" : "暂无真实事件"
    });
  },

  markGatewayOffline(message) {
    this.setData({
      devices: DEFAULT_DEVICES,
      latestEvent: null,
      reviewItems: [],
      stats: {
        validCount: 0,
        shortDurationCount: 0,
        reviewCount: 0
      },
      systemStatusText: "离线",
      systemStatusClass: "offline",
      decisionSourceText: message,
      lastSyncText: this.formatTime(new Date())
    });
    wx.showToast({
      title: message,
      icon: "none"
    });
  },

  formatTime(date) {
    const hour = `${date.getHours()}`.padStart(2, "0");
    const minute = `${date.getMinutes()}`.padStart(2, "0");
    return `${hour}:${minute}`;
  }
});
