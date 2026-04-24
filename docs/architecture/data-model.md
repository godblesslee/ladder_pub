# 数据模型设计

## 1. 设计原则

- 把“酒款静态信息”和“活动中的酒款实例”分开
- 把“模板定义”和“用户填写结果”分开
- 把“公开分享内容”和“结构化测评记录”统一归属于一次测评会话
- 支持同一用户在不同活动中对同一酒款重复测评

## 2. 核心实体

## 2.1 users

基础用户信息。

关键字段建议：

- id
- nickname
- avatar_url
- email / phone
- role
- created_at

## 2.2 organizations

如果未来会有多个主办方或多个酒馆，建议提前保留。

关键字段建议：

- id
- name
- slug
- created_at

## 2.3 organization_members

用于定义用户与组织的关系。

关键字段建议：

- id
- organization_id
- user_id
- role

## 2.4 beers

酒款基础库。

关键字段建议：

- id
- organization_id
- brewery_name
- product_name
- style_name
- volume_ml
- country_code
- abv
- image_url
- description
- created_at
- updated_at

## 2.5 events

活动表。

关键字段建议：

- id
- organization_id
- title
- slug
- description
- location
- start_at
- end_at
- cover_image_url
- status
- template_version_id
- published_at
- created_by

## 2.6 event_participants

活动与用户的关系。

关键字段建议：

- id
- event_id
- user_id
- participation_status
- joined_at

## 2.7 event_beers

活动中的酒款实例。

关键字段建议：

- id
- event_id
- beer_id
- serving_order
- custom_label
- vintage
- batch_no
- blind_code
- notes

说明：

- `event_beers` 是活动与酒款的桥接表
- 同一酒款可参加多个活动

## 2.8 review_templates

模板主表。

关键字段建议：

- id
- organization_id
- name
- description
- status
- created_at

## 2.9 review_template_sections

模板分组。

关键字段建议：

- id
- template_id
- title
- description
- sort_order

## 2.10 review_template_fields

模板字段定义。

关键字段建议：

- id
- section_id
- field_key
- label
- help_text
- field_type
- is_required
- allows_multiple
- sort_order
- config_json

字段类型建议：

- `single_select`
- `multi_select`
- `text`
- `textarea`
- `score`

## 2.11 review_template_field_options

模板选项定义。

关键字段建议：

- id
- field_id
- value
- label
- sort_order

## 2.12 reviews

用户对某场活动中的某款酒的一次测评记录。

这是最核心的实体。

关键字段建议：

- id
- user_id
- event_id
- event_beer_id
- beer_id
- template_version_id
- total_score
- public_note
- private_note
- status
- submitted_at
- created_at
- updated_at

唯一性建议：

- `user_id + event_id + event_beer_id` 唯一

这意味着：

- 同一用户在同一活动中对同一酒款只有一条当前测评记录
- 但同一酒款出现在不同活动中时，可以有不同记录

## 2.13 review_answers

存储模板字段的实际填写结果。

关键字段建议：

- id
- review_id
- field_id
- value_text
- value_number
- value_json

说明：

- 单选可存 `value_text`
- 多选可存 `value_json`
- 分数可存 `value_number`

## 3. 推荐关系图（文字版）

- 一个组织有多个活动
- 一个组织有多个酒款
- 一个活动有多个参与用户
- 一个活动通过 `event_beers` 关联多个酒款
- 一个活动绑定一个模板版本
- 一个用户在一个活动中的某个酒款上提交一条 `review`
- 一条 `review` 包含多条 `review_answers`

## 4. 模板版本化建议

不要让活动直接绑定“可变模板”，而应绑定“模板版本”。

原因：

- 活动开始后，模板内容不应因为后台修改而影响历史记录
- 历史活动必须可以完整回放当时的结构

建议新增：

## 4.1 review_template_versions

- id
- template_id
- version_number
- snapshot_json
- published_at

活动实际引用：

- `events.template_version_id`

## 5. 可见性与权限规则

## 5.1 用户

- 可查看自己的所有 reviews 和 review_answers
- 可编辑自己的草稿和活动开放期内记录
- 可查看他人的公开评论字段，但不可查看完整结构化答案

## 5.2 组织者

- 可管理自己组织下的 beers / events / templates
- 可查看活动内提交进度与统计
- 默认不直接查看用户私密备注

## 5.3 管理员

- 拥有全局管理权限

## 6. Supabase 实施建议

### 6.1 Row Level Security

重点对以下表启用 RLS：

- event_participants
- reviews
- review_answers

### 6.2 Storage

图片建议使用 Supabase Storage：

- beer-images
- event-covers
- avatars

## 7. 建模结论

这个业务的关键不是“酒款”本身，而是“用户在某场活动中对某款酒的测评记录”。

因此整个系统应以 `reviews` 为核心聚合点展开，而不是直接围绕 `beers` 或 `events` 做扁平表单。
