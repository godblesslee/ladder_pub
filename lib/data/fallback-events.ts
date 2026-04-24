export type FallbackEventBeer = {
  id: string;
  servingOrder: number;
  notes: string;
  breweryName: string;
  productName: string;
  styleName: string;
  abv: number | null;
  volumeMl: number | null;
  priceCny: number | null;
};

export type FallbackEvent = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  location: string;
  beerCount: number;
  status: string;
  theme: string;
  audience: string;
  schedule: string;
  sourceNote: string;
  beers: FallbackEventBeer[];
};

export const fallbackEvents: FallbackEvent[] = [
  {
    id: "fallback-event-20260501",
    slug: "may-day-beginner-beer-tasting-2026",
    title: "5 月 1 日啤酒入门评测活动",
    description:
      "为入门用户设计的 8 杯体验场，从拉格、小麦到 IPA，重点练习看、闻、喝与记录感受。",
    date: "2026-05-01",
    location: "小酒馆静安店",
    beerCount: 8,
    status: "已上线",
    theme: "入门对照",
    audience: "第一次系统喝精酿、想建立基础风味词汇的人",
    schedule: "19:30 签到，20:00 开喝，按轻到重顺序完成 8 杯测评。",
    sourceNote:
      "已根据你提供的 PDF 首屏整理出前 4 款，后 4 款先保留占位，等补齐文件内容后继续更新。",
    beers: [
      {
        id: "fallback-beer-20260501-1",
        servingOrder: 1,
        notes: "作为开场拉格，帮助新手先建立清爽、轻酒体和高易饮度的基准。",
        breweryName: "Corona Extra",
        productName: "科罗娜",
        styleName: "拉格",
        abv: null,
        volumeMl: null,
        priceCny: 10,
      },
      {
        id: "fallback-beer-20260501-2",
        servingOrder: 2,
        notes: "进入小麦啤酒，练习泡沫、酯香和柔和口感的识别。",
        breweryName: "Paulaner",
        productName: "柏龙小麦白啤酒",
        styleName: "小麦",
        abv: null,
        volumeMl: null,
        priceCny: 17,
      },
      {
        id: "fallback-beer-20260501-3",
        servingOrder: 3,
        notes: "作为社交 IPA，对照感受酒花香气和苦度在易饮型产品里的呈现。",
        breweryName: "拾捌精酿",
        productName: "不拉芝批评社交 IPA",
        styleName: "社交 IPA",
        abv: null,
        volumeMl: null,
        priceCny: 16,
      },
      {
        id: "fallback-beer-20260501-4",
        servingOrder: 4,
        notes: "往下切到浑浊 IPA，观察香气饱满度、苦感和收口的变化。",
        breweryName: "阿酿精选",
        productName: "大石裹黑双倍西楚浑浊 IPA",
        styleName: "浑浊 IPA",
        abv: null,
        volumeMl: null,
        priceCny: 28,
      },
      {
        id: "fallback-beer-20260501-5",
        servingOrder: 5,
        notes: "PDF 第 2 页待补充。",
        breweryName: "待补充",
        productName: "待补充酒款 5",
        styleName: "待补充",
        abv: null,
        volumeMl: null,
        priceCny: null,
      },
      {
        id: "fallback-beer-20260501-6",
        servingOrder: 6,
        notes: "PDF 第 2 页待补充。",
        breweryName: "待补充",
        productName: "待补充酒款 6",
        styleName: "待补充",
        abv: null,
        volumeMl: null,
        priceCny: null,
      },
      {
        id: "fallback-beer-20260501-7",
        servingOrder: 7,
        notes: "PDF 第 2 页待补充。",
        breweryName: "待补充",
        productName: "待补充酒款 7",
        styleName: "待补充",
        abv: null,
        volumeMl: null,
        priceCny: null,
      },
      {
        id: "fallback-beer-20260501-8",
        servingOrder: 8,
        notes: "PDF 第 2 页待补充。",
        breweryName: "待补充",
        productName: "待补充酒款 8",
        styleName: "待补充",
        abv: null,
        volumeMl: null,
        priceCny: null,
      },
    ],
  },
  {
    id: "fallback-event-20260510",
    slug: "belgian-abbey-night-2026",
    title: "比利时修道院风格夜",
    description:
      "围绕 Dubbel、Tripel、Quadrupel 做对照品鉴，重点观察酯香与酒精融合度。",
    date: "2026-05-10",
    location: "小酒馆静安店",
    beerCount: 6,
    status: "即将开始",
    theme: "修道院风格",
    audience: "已经喝过基础风格，想进阶理解酯香和酒体层次的人",
    schedule: "20:00 开始，按强度逐步推进。",
    sourceNote: "示例活动。",
    beers: [],
  },
  {
    id: "fallback-event-20260524",
    slug: "mountain-ipa-flight-2026",
    title: "山系 IPA 对照场",
    description:
      "同场对比 West Coast、Hazy 与 Cold IPA，关注苦度、香气层次和收口。",
    date: "2026-05-24",
    location: "小酒馆长宁店",
    beerCount: 8,
    status: "已上线",
    theme: "IPA 对照",
    audience: "想建立酒花风格差异感知的人",
    schedule: "20:00 开始，按风格并行对照。",
    sourceNote: "示例活动。",
    beers: [],
  },
  {
    id: "fallback-event-20260607",
    slug: "june-blind-tasting-2026",
    title: "六月盲评局",
    description:
      "以盲评方式记录用户第一感受，强化模板作为现场记录工具的价值。",
    date: "2026-06-07",
    location: "小酒馆徐汇店",
    beerCount: 5,
    status: "筹备中",
    theme: "盲评体验",
    audience: "想减少标签干扰、练习独立判断的人",
    schedule: "19:30 签到，20:00 开始盲评。",
    sourceNote: "示例活动。",
    beers: [],
  },
];

export function getFallbackEventBySlug(slug: string) {
  return fallbackEvents.find((event) => event.slug === slug) ?? null;
}

