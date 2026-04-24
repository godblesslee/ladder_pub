# 工程方案

## 1. 总体建议

建议采用：

- 前端：Next.js App Router
- UI：Tailwind CSS + shadcn/ui（或团队偏好的组件体系）
- 数据库/鉴权/存储：Supabase
- 部署：Vercel
- 监控：Sentry（V2 可接入）

原因：

- 适合快速迭代
- 适合 AI 辅助生成页面与 CRUD 逻辑
- Supabase 能显著降低鉴权、数据库和对象存储的初始成本
- Vercel 部署简单，适合先做 Web App

## 2. 系统模块划分

## 2.1 前台用户端

- 活动浏览
- 酒款测评
- 历史记录
- 公开评论浏览

## 2.2 后台管理端

- 活动管理
- 酒款库管理
- 模板管理
- 提交记录查看

## 2.3 BFF / Server Actions

建议把核心写操作收敛到服务端：

- 创建活动
- 发布活动
- 提交测评
- 更新模板

好处：

- 更容易做权限校验
- 更容易控制数据一致性

## 3. 推荐项目结构

```text
app/
  (marketing)/
  (user)/
    page.tsx
    events/
    my-events/
    my-beers/
    reviews/
  (admin)/
    admin/
      events/
      beers/
      templates/
components/
  ui/
  review/
  events/
  beers/
lib/
  supabase/
  auth/
  reviews/
  events/
  beers/
types/
docs/
```

## 4. 前端页面建议

## 4.1 用户端页面

- `/`
- `/events`
- `/events/[eventSlug]`
- `/events/[eventSlug]/beers/[eventBeerId]`
- `/my-events`
- `/my-beers`
- `/reviews/[reviewId]`

## 4.2 后台页面

- `/admin`
- `/admin/events`
- `/admin/events/new`
- `/admin/events/[id]`
- `/admin/beers`
- `/admin/templates`
- `/admin/templates/[id]`

## 5. 组件策略

需要优先抽象的组件：

- 活动卡片
- 酒款卡片
- 模板分组渲染器
- 模板字段渲染器
- 评分输入组件
- 评论输入组件
- 提交状态组件

关键原则：

- 模板渲染组件必须根据数据库配置驱动，而不是写死字段

## 6. 开发阶段建议

## 6.1 阶段一：设计和骨架

- 建 repo
- 配置 lint / format / typecheck
- 建 Supabase schema
- 导入基础假数据

## 6.2 阶段二：MVP 用户端

- 登录
- 首页
- 活动详情
- 酒款测评页
- 我的活动
- 我的酒款

## 6.3 阶段三：后台

- 活动 CRUD
- 酒款 CRUD
- 模板 CRUD

## 6.4 阶段四：社交与复盘

- 公开评论展示
- 排行与统计
- 活动结果页

## 7. 工程规范建议

## 7.1 基础规范

- TypeScript strict mode
- ESLint
- Prettier
- Husky + lint-staged
- Conventional Commits

## 7.2 Git 流程

建议：

- `main` 用于稳定版本
- 功能开发使用 `codex/...` 或 `feature/...` 分支
- 每个功能独立 PR

建议首批分支示例：

- `codex/setup-nextjs`
- `codex/schema-supabase`
- `codex/mvp-user-home`
- `codex/admin-templates`

## 7.3 环境配置

建议至少区分：

- local
- preview
- production

## 8. GitHub 与部署建议

## 8.1 GitHub

建议立即建立远程仓库，并配置：

- `README`
- `LICENSE`
- Issue templates
- Pull request template
- `.env.example`

## 8.2 CI

建议在 GitHub Actions 里跑：

- install
- lint
- typecheck
- test（后续）

## 8.3 部署

优先采用：

- GitHub -> Vercel 自动部署
- Supabase 作为托管数据库与存储

这样能显著降低传统服务器运维成本。

## 9. 风险与注意点

- 模板系统如果写死，会很快成为技术债
- 用户端页面必须优先适配手机端
- 活动、酒款、测评之间的关系必须在数据库层先定义清楚
- 公开评论与私密记录要明确区分
- 若未来支持多组织，权限模型要尽早预留

## 10. 结论

这个项目完全适合 AI 辅助开发，但前提是先把：

- 数据结构
- 模板机制
- 页面流转
- 权限边界

四件事定义清楚。

当前文档已经可以作为下一步正式编码的设计输入。
