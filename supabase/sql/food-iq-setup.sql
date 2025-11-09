-- Tabla Food-IQ: información organoléptica y consejos de alimentos
-- Ejecutar en Supabase SQL Editor

create table if not exists public.food_iq (
  id bigserial primary key,
  common_name text not null,
  aliases text[] default '{}',
  ideal_ripeness_cues jsonb,
  storage_advice text,
  shelf_life_fresh text,
  shelf_life_fridge text,
  spoilage_signs jsonb,
  taste_profile_by_stage jsonb,
  safe_to_eat_warnings jsonb,
  substitutions jsonb,
  updated_at timestamptz default now()
);

-- Policies (lectura pública)
alter table public.food_iq enable row level security;
create policy "read food iq" on public.food_iq for select using (true);

-- Seed inicial: 15 alimentos comunes
insert into public.food_iq
(common_name, aliases, ideal_ripeness_cues, storage_advice, shelf_life_fresh, shelf_life_fridge, spoilage_signs, taste_profile_by_stage, safe_to_eat_warnings, substitutions)
values
('banana', '{plátano}', '{"color":"amarillo con pequeñas motas","textura":"ligeramente blanda"}',
 'Ambiente lejos del sol. Frigorífico si está muy madura (piel oscurece). Se puede congelar pelada.',
 '2-4 días', '3-5 días (pelada)', '["moho", "líquido viscoso", "olor fermentado"]',
 '{"verde":"almidón, poco dulce","maduro":"dulce, aroma intenso","sobre-maduro":"muy dulce, ideal repostería"}',
 '["Descartar si hay moho o mal olor"]',
 '["plátano macho (cocción)","manzana para dulzor"]'),

('tomate', '{jitomate}', '{"color":"rojo uniforme","firmeza":"ligeramente cede al presionar"}',
 'Ambiente con ventilación. Frigorífico solo muy maduros para frenar maduración.',
 '3-5 días', '2-3 días (muy maduros)', '["moho en pedúnculo","olor avinagrado","piel arrugada extrema"]',
 '{"verde":"ácido y firme","maduro":"jugoso y dulce-ácido"}',
 '["No consumir con moho extendido"]',
 '["pimiento rojo (aromas dulces)","salsa de tomate en conserva"]'),

('aguacate', '{palta}', '{"color":"oscuro (Hass)","firmeza":"cede con presión suave"}',
 'Madurar en ambiente; refrigerar cuando está en punto. Con hueso y limón para conservar media pieza.',
 '2-4 días (madurando)', '2-3 días (maduro)', '["manchas negras fibrosas","olor rancio","moho"]',
 '{"verde":"duro y herbáceo","punto":"mantecoso, suave","pasado":"oscuro, amargor"}',
 '["Descartar con moho u olor rancio"]',
 '["hummus","tahini"]'),

('manzana', '{}', '{"color":"vivo sin golpes","firmeza":"crujiente"}',
 'Frigorífico en cajón de verduras o ambiente fresco.',
 '5-7 días (ambiente)', '2-3 semanas (frío)', '["moho","zonas blandas amplias","olor fermentado"]',
 '{"verde":"ácida y crujiente","madura":"equilibrada y jugosa"}',
 '["Evitar consumo con moho/internal browning"]',
 '["pera","membrillo (cocción)"]'),

('lechuga', '{}', '{"hojas":"firmes y turgentes","color":"vivo sin bordes marrones"}',
 'Frigorífico en contenedor ventilado y seco, sin aplastar.',
 '1-2 días (ambiente)', '3-5 días (frío)', '["mucílago baboso","olor desagradable","moho"]',
 '{"fresca":"crujiente y acuosa","pasada":"fláccida y amarga"}',
 '["No consumir con baba o moho"]',
 '["espinaca","rúcula"]'),

('fresa', '{frutilla}', '{"color":"rojo uniforme","pedúnculo":"verde"}',
 'Frío, sin lavar hasta consumo. Recipiente con papel secante.',
 '1 día (ambiente)', '2-3 días (frío)', '["moho blanco","olor fermentado"]',
 '{"madura":"dulce y aromática"}',
 '["Descartar con moho"]',
 '["frambuesa","arándano"]'),

('pera', '{}', '{"firmeza":"cede suavemente en cuello","aroma":"dulce"}',
 'Madurar a ambiente. Frío cuando está en su punto.',
 '2-4 días', '3-5 días', '["moho","licuefacción","olor a sidra"]',
 '{"verde":"harinosa/ácida","madura":"jugosa y dulce"}',
 '["Evitar con moho"]',
 '["manzana"]'),

('piña', '{}', '{"aroma":"dulce en base","hojas":"salen con leve tirón"}',
 'Ambiente. Cortada: refrigerar cerrada.',
 '2-3 días', '2-3 días (cortada)', '["moho en base","olor fermentado"]',
 '{"pálida":"ácida y dura","madura":"dulce y jugosa"}',
 '["Descartar con moho u olor fuerte"]',
 '["mango","papaya"]'),

('mango', '{}', '{"firmeza":"cede al tacto","aroma":"dulce"}',
 'Ambiente para madurar; luego frío.',
 '2-4 días', '2-3 días', '["puntos negros internos extensos","olor fermentado"]',
 '{"verde":"herbáceo y firme","maduro":"dulce, fragante"}',
 '["Descartar con moho/olor fuerte"]',
 '["melocotón"]'),

('papaya', '{}', '{"color":"amarillo/naranja","firmeza":"suave"}',
 'Ambiente para madurar; frío ya madura.',
 '2-3 días', '2-3 días', '["moho","olor fuerte"]',
 '{"verde":"neutra","madura":"dulce y melosa"}',
 '["Evitar si hay moho"]',
 '["mango"]'),

('patata', '{papa}', '{"piel":"firme sin brotes verdes"}',
 'Ambiente fresco/oscuro, nunca refrigerar (endurece almidón).',
 '1-2 semanas', '—', '["verde (solanina)","brotes grandes","moho"]',
 '{"fresca":"terrosa y firme"}',
 '["No consumir zonas verdes o con brotes grandes"]',
 '["boniato (dulzor)"]'),

('zanahoria', '{}', '{"firmeza":"crujiente","color":"vivo"}',
 'Frigorífico en bolsa perforada.',
 '3-4 días (ambiente)', '1-2 semanas (frío)', '["baba","moho"]',
 '{"fresca":"dulce-terrosa"}',
 '["Descartar con baba/moho"]',
 '["calabaza"]'),

('pepino', '{}', '{"piel":"tensa","firmeza":"alta"}',
 'Frigorífico en cajón (no muy frío).',
 '1-2 días', '3-5 días', '["baba","olor agrio"]',
 '{"fresco":"acuoso y suave"}',
 '["Descartar si hay baba"]',
 '["calabacín"]'),

('pimiento rojo', '{}', '{"piel":"brillante y firme"}',
 'Frigorífico en bolsa perforada.',
 '2-3 días (ambiente)', '5-7 días (frío)', '["moho","piel muy arrugada"]',
 '{"maduro":"dulce"}',
 '["Evitar moho"]',
 '["pimiento asado en conserva"]'),

('calabacín', '{}', '{"piel":"firme, sin marcas"}',
 'Frigorífico, sin aplastar.',
 '2-3 días', '4-6 días', '["mucílago","moho"]',
 '{"fresco":"suave"}',
 '["No consumir con baba"]',
 '["berenjena"]')
ON CONFLICT (id) DO NOTHING;
