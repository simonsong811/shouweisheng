# 手护智感 AI 智能体网站

该目录用于将根目录的手卫生行为感知看板构建为 Sites 可部署版本。

## 本地运行

```powershell
pnpm install
pnpm dev
```

打开 `http://localhost:3000/`，页面会进入 `/prototype/index.html`。

## 构建

```powershell
pnpm test
pnpm build
```

生产构建输出到 `dist/`。真实设备数据通过浏览器配置的边缘网关 `/health` 与 `/status` 接口获取；“生成演示事件”仅用于评审调试，不随机、不自动循环，也不写入后台。
