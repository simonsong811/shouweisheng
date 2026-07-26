# 手卫生 AI 智能体网关接口契约

小程序不再内置模拟数据。真实数据由边缘网关提供，网关负责接收 WiFi CSI 采集端、手消按压传感器、区域停留传感器的数据，并完成时间戳对齐和模型判读。

## 1. 健康检查

`GET /health`

请求参数：

```json
{
  "siteId": "treatment-room-01"
}
```

成功返回：

```json
{
  "ok": true,
  "gatewayId": "gateway-01",
  "version": "0.1.0"
}
```

## 2. 点位状态

`GET /status`

请求参数：

```json
{
  "siteId": "treatment-room-01"
}
```

成功返回：

```json
{
  "devices": {
    "csi": {
      "online": true,
      "desc": "ESP32 CSI receiver online"
    },
    "pressure": {
      "online": true,
      "desc": "HX711 pressure channel online"
    },
    "presence": {
      "online": true,
      "desc": "presence channel online"
    },
    "gateway": {
      "online": true,
      "desc": "edge inference service online"
    }
  },
  "stats": {
    "validCount": 38,
    "shortDurationCount": 6,
    "reviewCount": 3
  },
  "latestEvent": {
    "id": "evt-20260726-0001",
    "level": "safe",
    "title": "疑似发生手卫生",
    "label": "疑似发生",
    "summary": "检测到按压事件、区域停留和疑似揉搓动作，记录为空间级疑似手卫生事件。",
    "evidence": [
      {
        "name": "停留时间",
        "value": "18 秒"
      },
      {
        "name": "按压事件",
        "value": "1 次"
      },
      {
        "name": "CSI 判读",
        "value": "疑似揉搓"
      }
    ]
  },
  "reviewItems": [
    {
      "id": "rev-001",
      "reason": "多人同时在场，无法绑定唯一人员",
      "time": "14:22",
      "site": "treatment-room-01"
    }
  ]
}
```

## 3. 判读等级约定

- `safe`：疑似发生手卫生。
- `risk`：未形成疑似手卫生事件，需要提醒。
- `warn`：证据不足或多人干扰，需要人工复核。

## 4. 统计字段约定

- `validCount`：今日疑似有效手卫生事件数。
- `shortDurationCount`：今日洗手或揉搓时长不足人数/事件数。
- `reviewCount`：今日待人工复核事件数。

在未接入可确认身份的工牌/RFID 前，`shortDurationCount` 建议按事件数统计；接入身份并完成授权后，可按去标识化人员统计。

## 5. 后续硬件数据流

```text
ESP32 CSI 采集端
压力/按压传感器
区域停留传感器
        ↓
边缘网关：时间戳对齐、特征提取、模型判读
        ↓
小程序：设备状态、最新事件、复核队列、提醒输出
```

## 6. 临床边界

系统输出为“疑似事件”和“提醒线索”，不作为最终手卫生合规质控依据。涉及个人身份关联时，应遵守医院伦理、隐私保护和最小必要原则。
