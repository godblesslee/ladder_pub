# Git / GitHub / 工程化清单

## 当前状态

- 已在本地初始化 git 仓库
- 已建立基础文档结构
- 尚未创建 GitHub 远程仓库
- 尚未进行首次 commit

## 建议的下一步顺序

## 1. 创建 GitHub 仓库

仓库名建议：

- `xiaojiuguan`
- `beer-tasting-app`
- `taproom-tasting`

建议选择：

- Private 仓库起步
- 默认分支：`main`

## 2. 首次提交建议内容

首次提交只放设计与文档，不放临时处理文件。

建议纳入版本控制：

- `README.md`
- `docs/`
- `.gitignore`

建议不纳入版本控制：

- `tmp_pdf/`
- `.swift-module-cache/`

CSV 是否纳入版本控制，可按用途决定：

- 如果作为模板源数据：可保留
- 如果只是一次性中间产物：可移出仓库

## 3. 推荐命令

```bash
git checkout -b codex/design-foundation
git add README.md .gitignore docs
git commit -m "docs: add product and architecture design foundation"
git remote add origin <your-github-repo-url>
git push -u origin codex/design-foundation
```

如果你决定把 CSV 也纳入版本控制，可追加：

```bash
git add "BeerTastingSheet_中文版_HiraginoSansGB_V3_副本.csv"
```

## 4. 工程化初始化建议

正式开始编码时，建议第一批工作包括：

- 初始化 Next.js + TypeScript
- 配置 ESLint / Prettier
- 配置 Husky + lint-staged
- 配置 `.env.example`
- 配置 GitHub Actions
- 初始化 Supabase 项目

## 5. 分支策略建议

- `main`：稳定分支
- `codex/...`：AI 协作分支
- `feature/...`：人工功能分支
- `fix/...`：修复分支

## 6. Issue 建议拆分

建议把开发任务拆成以下几个 issue：

- 建立 Next.js 工程骨架
- 建立 Supabase schema
- 完成用户端首页与活动列表
- 完成酒款测评页
- 完成后台酒款管理
- 完成后台模板管理

## 7. 当前最重要的设计输入

在正式开发前，最好先确认这 4 件事：

- 总评分量表
- 模板字段最终版本
- 用户如何加入活动
- 公开评论的可见性规则
