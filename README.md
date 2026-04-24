# 小酒馆

线下啤酒测评活动应用的产品与工程设计仓库。

当前仓库已从纯设计阶段推进到 MVP 工程落地阶段，当前内容包括：

- 产品需求文档（PRD）
- 信息架构与用户流
- 数据模型与模板机制设计
- 工程方案与开发建议
- Next.js 工程骨架
- 用户端 / 管理端页面雏形
- Fallback 活动数据与页面链路
- Supabase 初始 schema 与 seed

## 文档目录

- [PRD 总览](./docs/prd/product-requirements.md)
- [信息架构与用户流](./docs/product/information-architecture.md)
- [测评模板草案](./docs/product/review-template-draft.md)
- [数据模型设计](./docs/architecture/data-model.md)
- [工程方案](./docs/architecture/engineering-plan.md)
- [Supabase 接入说明](./docs/architecture/supabase-setup.md)
- [源材料记录](./docs/notes/source-materials.md)

## 项目目标

把线下纸质啤酒品鉴表，升级为适用于活动现场的 Web App：

- 用户可参与活动、逐款测评啤酒、填写总评分与分享文字
- 主办方可维护活动、酒款库与测评模板
- 用户可沉淀自己的品鉴记录，并带有轻量社交属性

## 建议技术路线

- 前端：Next.js
- 数据库/鉴权/对象存储：Supabase
- 部署：Vercel

## 本地开发

```bash
npm install
npm run dev
```

当前样式使用本地系统字体栈，本地构建不依赖外网字体下载。

环境变量请参考：

- [`.env.example`](./.env.example)
- [Supabase 接入说明](./docs/architecture/supabase-setup.md)

数据库初始化文件：

- [`supabase/migrations/20260424171000_initial_schema.sql`](./supabase/migrations/20260424171000_initial_schema.sql)
- [`supabase/seed.sql`](./supabase/seed.sql)

## 当前状态

当前仓库已经完成：

- 设计文档基线
- Next.js App Router 工程骨架
- 用户端 App 化壳层：首页、活动、酒单底部导航已接入
- 用户端页面雏形：首页、活动列表、活动详情、酒款测评页、我的活动、我的酒款
- 管理端首页占位
- `5 月 1 日啤酒入门评测活动` fallback 数据源与页面链路
- Supabase 初始 schema、seed 与基础接入代码
- 数据层的“优先读数据库，失败回退 fallback”策略
- 测评提交、历史回填、只读历史记录查看链路
- `我的酒款` 与 `我的活动` 的真实数据接入

当前已经验证：

- `npm run lint` 通过
- `npm run typecheck` 通过
- `npm run build` 通过

下一步建议优先实现：

1. 把 `5 月 1 日` 活动与酒款正式写入远程 Supabase
2. 完成酒款测评提交流程的真实持久化
3. 继续完善测评模板渲染器
4. 补齐后台模板、活动与酒款管理
