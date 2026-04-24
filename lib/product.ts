export const platformPrinciples = [
  "模板配置化优先",
  "记录感受而非分项打分",
  "同酒款跨活动可重复测评",
  "公开评论与私密记录分离",
];

export const appModules = [
  {
    title: "已上线活动",
    description:
      "用户能看到未来要开始的活动、正在进行中的活动，以及可回顾的公开活动。",
  },
  {
    title: "我参与的活动",
    description:
      "按时间顺序展示每场活动和完成进度，帮助用户在现场快速切回当前任务。",
  },
  {
    title: "我测评过的酒",
    description:
      "按评分从高到低展示历史记录，并为同一酒款的多次场次记录预留聚合空间。",
  },
];

export const organizerNeeds = [
  {
    title: "维护酒款数据库",
    description:
      "组织者需要先把厂牌、产品名称、风格、容量、国别、酒精度和图片维护成标准数据。",
  },
  {
    title: "按活动配置酒款",
    description:
      "同一款酒可以出现在不同活动中，因此活动与酒款必须通过桥接表关联，而不是直接写死。",
  },
  {
    title: "模板版本化",
    description:
      "活动绑定的是模板版本，而不是可变模板，避免活动开始后后台改模板影响历史记录。",
  },
  {
    title: "查看公开分享与进度",
    description:
      "后台不仅要能看数据提交情况，还要能浏览用户公开评论，支持活动复盘和内容运营。",
  },
];

export const implementationSteps = [
  {
    title: "接入 Supabase schema 与 RLS",
    description:
      "先把核心数据关系和权限规则立起来，后续页面和表单才不会越写越乱。",
  },
  {
    title: "完成用户端首页与活动列表",
    description:
      "把首页的三个核心模块做出来，再接活动详情和活动酒款列表。",
  },
  {
    title: "实现酒款测评页与模板渲染器",
    description:
      "这是产品核心，字段不能写死，要根据模板定义动态渲染单选、多选、文本和总评分。",
  },
  {
    title: "补后台活动 / 酒款 / 模板管理",
    description:
      "先把主办方最常用的配置流跑通，后续再做统计和社交增强能力。",
  },
];

export const sampleEvents = [
  {
    title: "比利时修道院风格夜",
    description: "围绕 Dubbel、Tripel、Quadrupel 做对照品鉴，重点观察酯香与酒精融合度。",
    date: "2026-05-10",
    location: "小酒馆静安店",
    beerCount: 6,
    status: "即将开始",
  },
  {
    title: "山系 IPA 对照场",
    description: "同场对比 West Coast、Hazy 与 Cold IPA，关注苦度、香气层次和收口。",
    date: "2026-05-24",
    location: "小酒馆长宁店",
    beerCount: 8,
    status: "已上线",
  },
  {
    title: "六月盲评局",
    description: "以盲评方式记录用户第一感受，强化模板作为现场记录工具的价值。",
    date: "2026-06-07",
    location: "小酒馆徐汇店",
    beerCount: 5,
    status: "筹备中",
  },
];
