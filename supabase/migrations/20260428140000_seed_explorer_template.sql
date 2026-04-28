insert into public.review_templates (id, organization_id, name, description, status)
values (
  '22222222-2222-2222-2222-222222222223',
  '11111111-1111-1111-1111-111111111111',
  '精酿探险家 · 通关文牒',
  '抛弃枯燥的学术分类，用更生活化的方式引导新手观察、闻香、品味。适合现场活动快速填写。',
  'published'
)
on conflict do nothing;

insert into public.review_template_versions (
  id,
  template_id,
  version_number,
  snapshot_json,
  published_at
)
values (
  '33333333-3333-3333-3333-333333333334',
  '22222222-2222-2222-2222-222222222223',
  1,
  '{
    "sections": [
      {
        "key": "appearance",
        "title": "第一眼：它长得像谁？",
        "description": "观察酒液的颜色与清澈度",
        "fields": [
          {
            "key": "appearance_color",
            "label": "它的肤色",
            "type": "single_select",
            "options": ["清透柠檬水", "暖阳金", "琥珀色", "焦糖/棕色", "浓郁墨黑"]
          },
          {
            "key": "appearance_foam",
            "label": "它的"云朵"（泡沫）",
            "type": "single_select",
            "options": ["几乎没有", "像汽水一样快消失", "像奶油慕斯一样持久"]
          }
        ]
      },
      {
        "key": "aroma",
        "title": "闻一下：这味道好熟悉！",
        "description": "闭上眼深吸一口气，最先蹦出脑海的是？",
        "fields": [
          {
            "key": "aroma_wood",
            "label": "森林与花园",
            "type": "multi_select",
            "options": ["刚割过的草地", "松针香", "各种小花"]
          },
          {
            "key": "aroma_fruit",
            "label": "水果摊位",
            "type": "multi_select",
            "options": ["柚子/橙子皮", "热带芒果/百香果", "香蕉/苹果"]
          },
          {
            "key": "aroma_bakery",
            "label": "点心铺子",
            "type": "multi_select",
            "options": ["烤面包", "甜饼干", "咖啡/黑巧克力"]
          },
          {
            "key": "aroma_other",
            "label": "其他古怪味道",
            "type": "multi_select",
            "options": ["烟熏火腿", "泥土", "辛香料"]
          }
        ]
      },
      {
        "key": "taste",
        "title": "喝一口：舌尖上的情报",
        "description": "别急着咽下去，让酒液在嘴里打个转",
        "fields": [
          {
            "key": "taste_bitterness",
            "label": "性格（苦度）",
            "type": "single_select",
            "options": ["温柔无害", "有点小脾气", "苦得清醒（像黑咖啡）"]
          },
          {
            "key": "taste_body",
            "label": "身材（酒体）",
            "type": "single_select",
            "options": ["轻盈（像矿泉水）", "饱满（像果汁）", "浓稠（像奶昔）"]
          },
          {
            "key": "taste_carbonation",
            "label": "活泼度（气泡）",
            "type": "single_select",
            "options": ["文静", "活泼跳跃", "像爆炸一样冲击"]
          }
        ]
      },
      {
        "key": "judgment",
        "title": "终极判官：你和它来电吗？",
        "description": "综合评价这款酒的"易饮性"与"平衡感"",
        "fields": [
          {
            "key": "judgment_pairing",
            "label": "搭配点什么",
            "type": "single_select",
            "options": ["火锅", "烧烤", "芝士蛋糕", "故事"]
          },
          {
            "key": "judgment_personality",
            "label": "性格画像",
            "type": "single_select",
            "options": ["阳光大男孩", "文艺青年", "深沉大叔"]
          },
          {
            "key": "judgment_refill",
            "label": "续杯指数",
            "type": "single_select",
            "options": ["没喝够！再来一杯", "体验过就好", "还是给朋友喝吧"]
          },
          {
            "key": "judgment_comment",
            "label": "一句话点评",
            "type": "textarea"
          }
        ]
      }
    ]
  }'::jsonb,
  '2026-04-28T06:00:00Z'
)
on conflict (template_id, version_number) do nothing;
