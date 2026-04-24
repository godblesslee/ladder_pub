import type { ReviewFieldType } from "@/types/domain";
import type { Json } from "@/types/database.generated";

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

function isFieldType(value: unknown): value is ReviewFieldType {
  return (
    value === "single_select" ||
    value === "multi_select" ||
    value === "text" ||
    value === "textarea" ||
    value === "score"
  );
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export function parseReviewTemplateSections(snapshot: Json): ReviewSection[] | null {
  if (!snapshot || Array.isArray(snapshot) || typeof snapshot !== "object") {
    return null;
  }

  const sections = snapshot.sections;

  if (!Array.isArray(sections)) {
    return null;
  }

  const parsedSections = sections
    .map((section) => {
      if (!section || Array.isArray(section) || typeof section !== "object") {
        return null;
      }

      const key = section.key;
      const title = section.title;
      const fields = section.fields;

      if (
        typeof key !== "string" ||
        typeof title !== "string" ||
        !Array.isArray(fields)
      ) {
        return null;
      }

      const parsedFields = fields
        .map((field) => {
          if (!field || Array.isArray(field) || typeof field !== "object") {
            return null;
          }

          const fieldKey = field.key;
          const label = field.label;
          const type = field.type;
          const options = field.options;

          if (
            typeof fieldKey !== "string" ||
            typeof label !== "string" ||
            !isFieldType(type)
          ) {
            return null;
          }

          const parsedField: ReviewField = {
            key: fieldKey,
            label,
            type,
            options: isStringArray(options) ? options : undefined,
          };

          return parsedField;
        })
        .filter(isNonNullable);

      if (parsedFields.length === 0) {
        return null;
      }

      const parsedSection: ReviewSection = {
        key,
        title,
        fields: parsedFields,
      };

      return parsedSection;
    })
    .filter(isNonNullable);

  return parsedSections.length > 0 ? parsedSections : null;
}

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
