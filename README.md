# 小酒馆

线下啤酒测评活动应用的产品与工程设计仓库。

当前阶段以设计为主，输出内容包括：

- 产品需求文档（PRD）
- 信息架构与用户流
- 数据模型与模板机制设计
- 工程方案与开发建议
- Next.js 工程骨架
- Supabase 初始 schema 与 seed

## 文档目录

- [PRD 总览](./docs/prd/product-requirements.md)
- [信息架构与用户流](./docs/product/information-architecture.md)
- [测评模板草案](./docs/product/review-template-draft.md)
- [数据模型设计](./docs/architecture/data-model.md)
- [工程方案](./docs/architecture/engineering-plan.md)
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

环境变量请参考：

- [`.env.example`](./.env.example)

数据库初始化文件：

- [`supabase/migrations/20260424171000_initial_schema.sql`](./supabase/migrations/20260424171000_initial_schema.sql)
- [`supabase/seed.sql`](./supabase/seed.sql)

## 当前状态

当前仓库已经完成：

- 设计文档基线
- Next.js App Router 工程骨架
- 用户端 / 后台路由占位
- Supabase 初始 schema 草案

下一步建议优先实现：

1. 活动列表与活动详情数据接入
2. 测评模板渲染器
3. 酒款测评提交流程
4. 后台模板与酒款管理
