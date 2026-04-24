insert into public.organizations (id, name, slug)
values ('11111111-1111-1111-1111-111111111111', '小酒馆', 'xiaojiuguan')
on conflict (slug) do nothing;

insert into public.review_templates (id, organization_id, name, description, status)
values (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  '啤酒品鉴表中文版 V1',
  '基于 BeerTastingSheet 中文版整理的首版数字化模板',
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
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  1,
  '{
    "sections": [
      {
        "key": "appearance",
        "title": "外观",
        "fields": [
          {
            "key": "appearance_clarity",
            "label": "清澈度",
            "type": "single_select",
            "options": ["晶莹透亮", "清澈", "略微浑浊", "浑浊"]
          },
          {
            "key": "appearance_head_texture",
            "label": "泡沫质地",
            "type": "single_select",
            "options": ["薄", "蓬松", "奶油慕斯状"]
          }
        ]
      },
      {
        "key": "aroma",
        "title": "香气",
        "fields": [
          {
            "key": "aroma_hops",
            "label": "酒花香气",
            "type": "multi_select",
            "options": ["柑橘", "花香", "松针", "树脂", "热带水果", "辛香"]
          },
          {
            "key": "aroma_malt",
            "label": "麦芽香气",
            "type": "multi_select",
            "options": ["谷物", "饼干", "面包", "焦糖", "巧克力", "咖啡"]
          }
        ]
      },
      {
        "key": "flavor",
        "title": "风味与余味",
        "fields": [
          {
            "key": "flavor_bitterness",
            "label": "酒花苦度",
            "type": "single_select",
            "options": ["克制", "中等", "强劲", "粗糙刺口"]
          },
          {
            "key": "flavor_notes",
            "label": "风味补充",
            "type": "textarea"
          }
        ]
      },
      {
        "key": "palate",
        "title": "口感",
        "fields": [
          {
            "key": "palate_body",
            "label": "酒体",
            "type": "single_select",
            "options": ["干爽", "柔和", "覆口感强", "黏稠"]
          },
          {
            "key": "palate_finish",
            "label": "长度/收口",
            "type": "single_select",
            "options": ["短（15 秒以内）", "中等（15 到 60 秒）", "长（超过 60 秒）"]
          }
        ]
      }
    ]
  }'::jsonb,
  '2026-04-24T10:00:00Z'
)
on conflict (template_id, version_number) do nothing;

insert into public.events (
  id,
  organization_id,
  title,
  slug,
  description,
  location,
  start_at,
  end_at,
  status,
  template_version_id,
  published_at
)
values (
  '44444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111',
  '5 月 1 日啤酒入门评测活动',
  'may-day-beginner-beer-tasting-2026',
  '为入门用户设计的 8 杯体验场，从拉格、小麦到 IPA，再到深色、酸和古斯，重点练习看、闻、喝与记录感受。',
  '小酒馆静安店',
  '2026-05-01T12:00:00Z',
  '2026-05-01T15:00:00Z',
  'published',
  '33333333-3333-3333-3333-333333333333',
  '2026-04-24T10:00:00Z'
)
on conflict (id) do update set
  title = excluded.title,
  slug = excluded.slug,
  description = excluded.description,
  location = excluded.location,
  start_at = excluded.start_at,
  end_at = excluded.end_at,
  status = excluded.status,
  template_version_id = excluded.template_version_id,
  published_at = excluded.published_at;

insert into public.beers (
  id,
  organization_id,
  brewery_name,
  product_name,
  style_name,
  description
)
values
  (
    '55555555-5555-5555-5555-555555555551',
    '11111111-1111-1111-1111-111111111111',
    'Corona Extra',
    '科罗娜',
    '拉格',
    '入门场第 1 杯，用来建立清爽、轻酒体和高易饮度的基准。'
  ),
  (
    '55555555-5555-5555-5555-555555555552',
    '11111111-1111-1111-1111-111111111111',
    'Paulaner',
    '柏龙小麦白啤酒',
    '小麦',
    '入门场第 2 杯，用来感受泡沫、酯香和柔和口感。'
  ),
  (
    '55555555-5555-5555-5555-555555555553',
    '11111111-1111-1111-1111-111111111111',
    '拾捌精酿',
    '不拉芝批评社交 IPA',
    '社交 IPA',
    '入门场第 3 杯，用来感受更友好的酒花香气和苦度表达。'
  ),
  (
    '55555555-5555-5555-5555-555555555554',
    '11111111-1111-1111-1111-111111111111',
    '阿酿精选',
    '大石裹黑双倍西楚浑浊 IPA',
    '浑浊 IPA',
    '入门场第 4 杯，对照感受更饱满的香气和酒体。'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    '野鹅微醺',
    '夜莺帝国世涛',
    '世涛',
    '入门场第 5 杯，进入烘烤、焦糖与厚重酒体。'
  ),
  (
    '55555555-5555-5555-5555-555555555556',
    '11111111-1111-1111-1111-111111111111',
    '山乘',
    '嘎嘎呱呱香柠檬西打',
    '西打',
    '入门场第 6 杯，借助更直白的果香和酸甜对比做风格跳转。'
  ),
  (
    '55555555-5555-5555-5555-555555555557',
    '11111111-1111-1111-1111-111111111111',
    '大九酿造',
    '热带共和国海盐古斯',
    '古斯',
    '入门场第 7 杯，把盐感、乳糖和热带水果放在一起对照。'
  ),
  (
    '55555555-5555-5555-5555-555555555558',
    '11111111-1111-1111-1111-111111111111',
    '女公爵',
    '橡木桶酸艾尔',
    '酸',
    '入门场第 8 杯，用木桶酸收尾，感受复杂发酵风味。'
  )
on conflict (id) do update set
  brewery_name = excluded.brewery_name,
  product_name = excluded.product_name,
  style_name = excluded.style_name,
  description = excluded.description;

insert into public.event_beers (
  id,
  event_id,
  beer_id,
  serving_order,
  notes
)
values
  (
    '66666666-6666-6666-6666-666666666661',
    '44444444-4444-4444-4444-444444444444',
    '55555555-5555-5555-5555-555555555551',
    1,
    '作为开场拉格，帮助新手先建立清爽、轻酒体和高易饮度的基准。'
  ),
  (
    '66666666-6666-6666-6666-666666666662',
    '44444444-4444-4444-4444-444444444444',
    '55555555-5555-5555-5555-555555555552',
    2,
    '进入小麦啤酒，练习泡沫、酯香和柔和口感的识别。'
  ),
  (
    '66666666-6666-6666-6666-666666666663',
    '44444444-4444-4444-4444-444444444444',
    '55555555-5555-5555-5555-555555555553',
    3,
    '作为社交 IPA，对照感受酒花香气和苦度在易饮型产品里的呈现。'
  ),
  (
    '66666666-6666-6666-6666-666666666664',
    '44444444-4444-4444-4444-444444444444',
    '55555555-5555-5555-5555-555555555554',
    4,
    '往下切到浑浊 IPA，观察香气饱满度、苦感和收口的变化。'
  ),
  (
    '66666666-6666-6666-6666-666666666665',
    '44444444-4444-4444-4444-444444444444',
    '55555555-5555-5555-5555-555555555555',
    5,
    '开始进入更厚重的深色风味，练习烘烤、焦糖和麦芽苦感的识别。'
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    '44444444-4444-4444-4444-444444444444',
    '55555555-5555-5555-5555-555555555556',
    6,
    '用更直接的柑橘香气和苦度表达，帮助新手建立西海岸 IPA 的典型印象。'
  ),
  (
    '66666666-6666-6666-6666-666666666667',
    '44444444-4444-4444-4444-444444444444',
    '55555555-5555-5555-5555-555555555557',
    7,
    '把盐感、乳糖和热带水果放在一起对照，感受古斯风格的张力。'
  ),
  (
    '66666666-6666-6666-6666-666666666668',
    '44444444-4444-4444-4444-444444444444',
    '55555555-5555-5555-5555-555555555558',
    8,
    '最后以桶酸收尾，感受酸度、木桶感和复杂发酵风味的层次。'
)
on conflict (id) do update set
  event_id = excluded.event_id,
  beer_id = excluded.beer_id,
  serving_order = excluded.serving_order,
  notes = excluded.notes;
