# Supabase 接入说明

当前项目已绑定的 Supabase Project Ref：

- `dysswcyynltekxclznvi`

Dashboard：

- [项目后台](https://supabase.com/dashboard/project/dysswcyynltekxclznvi)

## 1. 你需要从后台拿到的值

进入：

- `Project Settings` -> `API`

把下面 3 个值填入本地 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

其中：

- `NEXT_PUBLIC_SUPABASE_URL` 一般形如 `https://dysswcyynltekxclznvi.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 用于前端公开访问
- `SUPABASE_SERVICE_ROLE_KEY` 仅服务端使用，不能暴露到浏览器

## 2. 首次 CLI 登录与关联

本机不用全局安装 Supabase CLI，仓库已经提供 `npx` 脚本。

首次执行：

```bash
npx supabase login
```

登录后把项目 link 到当前仓库：

```bash
npm run supabase:link
```

## 3. 推送数据库 schema

当前初始 migration 在：

- [supabase/migrations/20260424171000_initial_schema.sql](/Users/eric/Desktop/Codex/小酒馆/supabase/migrations/20260424171000_initial_schema.sql)

登录并 link 后，可以执行：

```bash
npm run supabase:push
```

这会把当前 schema 推到远程项目。

## 4. 生成 TypeScript 类型

数据库表建立后，建议生成前端类型：

```bash
npm run supabase:types
```

输出文件：

- `types/database.generated.ts`

## 5. 当前状态

仓库已经完成：

- `supabase/config.toml` 初始化
- 远程 project ref 写入
- 初始 migration
- seed 文件
- 常用 CLI scripts

仍需手动完成：

- CLI 登录
- `.env.local` 填值
- 首次 `db push`

## 6. 当前仓库补充说明

当前仓库的 `package.json` 已将 `supabase:push` 调整为：

```bash
npx supabase db push --include-seed
```

这样会按官方 CLI 路径同时推送 migration 和 seed。

如果远程命令卡在 `Initialising login role...`，优先检查这两个环境变量是否已在当前 shell 中设置：

```bash
SUPABASE_ACCESS_TOKEN
SUPABASE_DB_PASSWORD
```

其中：

- `SUPABASE_ACCESS_TOKEN` 用于 CLI 登录态
- `SUPABASE_DB_PASSWORD` 用于远程数据库连接 / link / push 过程中的非交互认证
