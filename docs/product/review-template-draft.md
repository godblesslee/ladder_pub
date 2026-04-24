# 测评模板草案 V1

> 来源：`BeerTastingSheet_中文版_HiraginoSansGB_V3_副本.pdf` 与整理后的 CSV。

本文档把当前纸质测评表转换为适合系统配置的模板草案，用于后续：

- 建数据库种子数据
- 设计后台模板编辑器
- 设计前端模板渲染组件

## 1. 模板元信息

- 模板名称：啤酒品鉴表中文版 V1
- 模板用途：线下啤酒测评活动
- 使用场景：活动现场用户逐款填写
- 结构特点：以感受记录为主，末尾补充总评分与公开评论

## 2. 推荐字段类型说明

- `single_select`：单选，适合程度判断
- `multi_select`：多选，适合风味/香气标签
- `textarea`：长文本
- `score`：总评分

## 3. 模板结构

## 3.1 基本信息

### 姓名

- 字段 key：`taster_name`
- 类型：`text`
- 必填：否
- 备注：App 内若已登录，可自动带出，不一定需要用户手填

### 啤酒风格

- 字段 key：`declared_style`
- 类型：`text`
- 必填：否
- 备注：更适合作为活动酒款数据自动展示，而不是用户填写

### 品牌

- 字段 key：`brand_name`
- 类型：`text`
- 必填：否
- 备注：更适合作为活动酒款数据自动展示，而不是用户填写

## 3.2 外观 Appearance

### 颜色（SRM）

- 字段 key：`appearance_color_srm`
- 类型：`single_select`
- 必填：否
- 选项：
  - 浅黄色（1-1.5）
  - 稻草色（2-3）
  - 淡色（4）
  - 金色（5-6）
  - 浅琥珀色（7）
  - 琥珀色（8）
  - 中度琥珀色（9）
  - 铜色（10-12）
  - 浅棕色（13-15）
  - 马鞍棕（16-17）
  - 棕色（18-24）
  - 深棕色（25-39）
  - 黑色（40+）

### 清澈度

- 字段 key：`appearance_clarity`
- 类型：`single_select`
- 选项：
  - 晶莹透亮
  - 清澈
  - 略微浑浊
  - 浑浊

### 泡沫量与持久性/质地

- 字段 key：`appearance_head_retention`
- 类型：`single_select`
- 选项：
  - 无
  - 差（15 秒以内）
  - 中等（15 到 60 秒）
  - 良好（超过 60 秒）

### 泡沫质地

- 字段 key：`appearance_head_texture`
- 类型：`single_select`
- 选项：
  - 薄
  - 蓬松
  - 奶油慕斯状

### 碳酸感（视觉）

- 字段 key：`appearance_visual_carbonation`
- 类型：`single_select`
- 选项：
  - 无
  - 缓慢
  - 中等
  - 气泡上升很快

## 3.3 香气 Aroma

### 酒精

- 字段 key：`aroma_alcohol`
- 类型：`single_select`
- 选项：
  - 无法察觉
  - 轻微
  - 明显
  - 强烈
  - 刺鼻

### 酒花

- 字段 key：`aroma_hops`
- 类型：`multi_select`
- 选项：
  - 柑橘
  - 果香
  - 花香
  - 青草
  - 草本
  - 洋葱-蒜
  - 松针
  - 树脂
  - 云杉
  - 汗感
  - 辛香
  - 热带水果
  - 木质
  - 其他

### 麦芽

- 字段 key：`aroma_malt`
- 类型：`multi_select`
- 选项：
  - 生面粉
  - 谷物
  - 饼干
  - 面包
  - 烘烤
  - 焦糖
  - 西梅干
  - 焙烤
  - 巧克力
  - 咖啡
  - 烟熏
  - 焦糊
  - 其他

### 酯香

- 字段 key：`aroma_esters`
- 类型：`multi_select`
- 选项：
  - 苹果
  - 杏
  - 香蕉
  - 黑莓
  - 樱桃
  - 无花果
  - 葡萄柚
  - 猕猴桃
  - 桃
  - 梨
  - 菠萝
  - 李子
  - 葡萄干
  - 树莓
  - 草莓
  - 其他

### 酚类

- 字段 key：`aroma_phenols`
- 类型：`multi_select`
- 选项：
  - 丁香
  - 肉桂
  - 香草
  - 烟熏
  - 白胡椒
  - 其他
  - 无

### 其他

- 字段 key：`aroma_other_notes`
- 类型：`textarea`

## 3.4 风味与余味 Flavor And Aftertaste

### 酒精

- 字段 key：`flavor_alcohol`
- 类型：`single_select`
- 选项：
  - 无法察觉
  - 轻微
  - 明显
  - 强烈
  - 刺鼻

### 酒花风味

- 字段 key：`flavor_hops`
- 类型：`multi_select`
- 选项：
  - 柑橘
  - 果香
  - 花香
  - 青草
  - 草本
  - 洋葱-蒜
  - 松针
  - 树脂
  - 云杉
  - 汗感
  - 辛香
  - 热带水果
  - 木质
  - 其他
  - 无

### 酒花苦度

- 字段 key：`flavor_hop_bitterness`
- 类型：`single_select`
- 选项：
  - 克制
  - 中等
  - 强劲
  - 粗糙刺口

### 麦芽风味

- 字段 key：`flavor_malt`
- 类型：`multi_select`
- 选项：
  - 生面粉
  - 谷物
  - 饼干
  - 面包
  - 烘烤
  - 焦糖
  - 西梅干
  - 焙烤
  - 巧克力
  - 咖啡
  - 烟熏
  - 焦糊
  - 其他

### 麦芽甜感

- 字段 key：`flavor_malt_sweetness`
- 类型：`single_select`
- 选项：
  - 低
  - 中
  - 高
  - 甜腻

### 其他

- 字段 key：`flavor_other_notes`
- 类型：`textarea`

## 3.5 口感 Palate

### 涩感

- 字段 key：`palate_astringency`
- 类型：`single_select`
- 选项：
  - 低
  - 中
  - 高

### 酒体

- 字段 key：`palate_body`
- 类型：`single_select`
- 选项：
  - 干爽
  - 柔和
  - 覆口感强
  - 黏稠

### 口腔中的碳酸感

- 字段 key：`palate_carbonation`
- 类型：`single_select`
- 选项：
  - 低
  - 中
  - 高

### 长度/收口

- 字段 key：`palate_finish_length`
- 类型：`single_select`
- 选项：
  - 短（15 秒以内）
  - 中等（15 到 60 秒）
  - 长（超过 60 秒）

## 3.6 氧化/陈化特征 Oxidative/Aged Qualities

### 氧化/陈化特征

- 字段 key：`aged_qualities`
- 类型：`multi_select`
- 选项：
  - 杏仁
  - 黑加仑
  - 纸张味
  - 纸板味
  - 蜂蜜
  - 金属
  - 雪莉酒
  - 汗袜
  - 其他
  - 无

### 可接受度

- 字段 key：`aged_acceptability`
- 类型：`single_select`
- 选项：
  - 可接受
  - 不可接受

## 3.7 平衡与易饮性 Balance and Drinkability

### 平衡与易饮性

- 字段 key：`balance_drinkability`
- 类型：`single_select`
- 选项：
  - 理想
  - 不理想

## 3.8 风格 Style

### 风格符合度

- 字段 key：`style_alignment`
- 类型：`single_select`
- 选项：
  - 符合风格
  - 偏离风格

## 3.9 分享与结论

### 总评分

- 字段 key：`total_score`
- 类型：`score`
- 建议分值：`0-10` 或 `0-100`
- 建议：产品定义时尽早统一，不要后期改

### 配餐备注

- 字段 key：`pairing_note`
- 类型：`textarea`

### 公开评论/感受/故事

- 字段 key：`public_story`
- 类型：`textarea`
- 备注：这是社交展示的核心字段

### 私密备注

- 字段 key：`private_note`
- 类型：`textarea`
- 备注：仅用户本人可见

## 4. 产品化建议

## 4.1 不建议让用户填写的字段

以下字段更适合从酒款数据库自动带出，而不是让用户填写：

- 姓名
- 啤酒风格
- 品牌

## 4.2 适合做成标签选择器的字段

- 酒花
- 麦芽
- 酯香
- 酚类
- 酒花风味
- 麦芽风味
- 氧化/陈化特征

## 4.3 适合做成分段单选按钮的字段

- 清澈度
- 酒精感知
- 苦度
- 酒体
- 收口长度
- 平衡与易饮性
- 风格符合度

## 4.4 推荐的用户端页面处理

为了现场填写效率，建议将模板分为 4 个折叠分组：

- 外观
- 香气
- 风味与口感
- 总评分与分享

这样比完全照搬纸质表更适合手机端。

## 5. 待确认问题

- 总评分采用 10 分制还是 100 分制
- 是否允许用户上传配图
- 公开评论是否默认公开，还是由用户主动勾选公开
- 活动结束后是否锁定结构化答案编辑
