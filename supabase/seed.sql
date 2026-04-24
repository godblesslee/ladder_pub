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
