import type { ReviewFieldType } from "@/types/domain";

export type ReviewField = {
  key: string;
  label: string;
  type: ReviewFieldType;
  options?: string[];
};

export type ReviewSection = {
  key: string;
  title: string;
  fields: ReviewField[];
};

export const reviewTemplateSections: ReviewSection[] = [
  {
    key: "appearance",
    title: "外观",
    fields: [
      {
        key: "appearance_clarity",
        label: "清澈度",
        type: "single_select",
        options: ["晶莹透亮", "清澈", "略微浑浊", "浑浊"],
      },
      {
        key: "appearance_head_texture",
        label: "泡沫质地",
        type: "single_select",
        options: ["薄", "蓬松", "奶油慕斯状"],
      },
    ],
  },
  {
    key: "aroma",
    title: "香气",
    fields: [
      {
        key: "aroma_hops",
        label: "酒花香气",
        type: "multi_select",
        options: ["柑橘", "花香", "松针", "树脂", "热带水果", "辛香"],
      },
      {
        key: "aroma_malt",
        label: "麦芽香气",
        type: "multi_select",
        options: ["谷物", "饼干", "面包", "焦糖", "巧克力", "咖啡"],
      },
    ],
  },
  {
    key: "flavor",
    title: "风味与余味",
    fields: [
      {
        key: "flavor_bitterness",
        label: "酒花苦度",
        type: "single_select",
        options: ["克制", "中等", "强劲", "粗糙刺口"],
      },
      {
        key: "flavor_notes",
        label: "风味补充",
        type: "textarea",
      },
    ],
  },
  {
    key: "palate",
    title: "口感",
    fields: [
      {
        key: "palate_body",
        label: "酒体",
        type: "single_select",
        options: ["干爽", "柔和", "覆口感强", "黏稠"],
      },
      {
        key: "palate_finish",
        label: "长度/收口",
        type: "single_select",
        options: ["短（15 秒以内）", "中等（15 到 60 秒）", "长（超过 60 秒）"],
      },
    ],
  },
];
