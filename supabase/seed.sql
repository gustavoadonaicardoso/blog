-- =============================================================
-- Vórtice Blog — Seed: 3 posts de exemplo (1 patrocinado)
-- Execute após o schema.sql
-- =============================================================

insert into posts (title, slug, excerpt, content, published, is_sponsored, sponsor_name, sponsor_url, sponsor_badge)
values

(
  'O silêncio produtivo: por que o tédio é subestimado',
  'silencio-produtivo',
  'Em um mundo de notificações constantes, o tédio pode ser o espaço mais criativo que você tem.',
  '## A fuga do vazio

Vivemos em uma era de estímulo contínuo. Cada pausa é preenchida com scroll, podcast ou série. Raramente deixamos a mente vagar sem propósito — e pagamos um preço por isso.

O tédio, paradoxalmente, é um dos estados mais férteis para a criatividade. Pesquisas em neurociência mostram que a chamada *rede de modo padrão* do cérebro — ativa justamente quando não estamos focados em nenhuma tarefa — é responsável por conexões criativas, planejamento futuro e empatia.

## O custo da superestimulação

Quando preenchemos cada segundo com conteúdo, privamos o cérebro do tempo de integração. É como tentar aprender sem dormir: a consolidação nunca acontece.

> "O tédio é o sonho de olhos abertos." — Walter Benjamin

A criatividade precisa de espaço vazio para surgir. Não de mais insumos.

## Como reintroduzir o vazio

Não se trata de meditação formal ou retiro digital radical. Comece pequeno:

- Espere o café passar sem olhar para o celular
- Caminhe sem fone de ouvido uma vez por semana
- Deixe a mente divagar no banho, em vez de planejar o dia

O vazio não é ausência. É o solo onde as melhores ideias germinam.',
  true,
  false,
  null,
  null,
  null
),

(
  'Tipografia na web: o que os designers esquecem de dizer',
  'tipografia-web-designers',
  'A maioria dos tutoriais fala de fontes bonitas. Poucos falam do que realmente importa: ritmo, escala e legibilidade real.',
  '## Além da escolha da fonte

Designers passam horas escolhendo entre Inter e Söhne. Mas a fonte em si raramente é o problema. O problema está na escala, no espaçamento e no contraste.

## O trio que define a leitura

**1. Tamanho do corpo**

18px não é "grande demais" para um blog. É o mínimo confortável para leitura prolongada em tela. A web não é impressão — a distância de leitura é maior, a resolução varia.

**2. Line-height**

Para texto corrido, 1.6–1.8 é o intervalo ideal. Parece muito? Leia um parágrafo com 1.3 e perceba o esforço ocular.

**3. Largura da coluna**

65–75 caracteres por linha. Não pixels — caracteres. É a medida que o olho humano processa confortavelmente antes de mudar de linha.

## A serifada não morreu

Há uma crença de que serifa é coisa de impresso. É um mito. Georgia renderiza lindamente em tela e melhora significativamente a leitura de textos longos. Use-a sem culpa.

## Hierarquia é tudo

Uma tipografia eficaz comunica hierarquia antes mesmo de o leitor processar o conteúdo. Tamanho, peso e espaçamento devem guiar o olhar — não decorar a página.',
  true,
  false,
  null,
  null,
  null
),

(
  'Como estruturamos nosso fluxo de trabalho com Supabase em produção',
  'fluxo-trabalho-supabase-producao',
  'Depois de 6 meses usando Supabase em produção, aqui estão os padrões que funcionaram — e os que não funcionaram.',
  '## Por que Supabase?

Adotamos o Supabase como backend principal após testar Firebase e PlanetScale. A combinação de Postgres real, autenticação integrada e Row Level Security nos deu o controle que precisávamos sem a complexidade de montar infraestrutura própria.

## O que funcionou

### Row Level Security

RLS é subestimado. A maioria dos tutoriais o trata como opcional — na prática, é o que permite expor o cliente diretamente ao frontend sem abrir brechas de segurança.

Nosso padrão: políticas conservadoras por padrão, abertura explícita para cada operação necessária.

```sql
-- Leitura pública apenas para conteúdo publicado
create policy "public read" on posts
  for select using (published = true);

-- Escrita apenas para autenticados
create policy "admin write" on posts
  for all using (auth.role() = ''authenticated'');
```

### Migrations versionadas

Usamos a CLI do Supabase para versionar todas as mudanças de schema. Nenhuma alteração vai ao banco sem passar por `supabase db diff` primeiro.

## O que não funcionou

**Storage para assets grandes**: migramos para Cloudflare R2 após problemas de latência com assets acima de 5MB.

**Realtime em escala**: o canal de realtime funcionou bem em desenvolvimento, mas apresentou instabilidade com mais de 200 conexões simultâneas.

## Conclusão

Supabase é uma escolha sólida para projetos de pequeno a médio porte. Para escala maior, vale monitorar os pontos de atrito antes que virem problemas de produção.',
  true,
  true,
  'Supabase',
  'https://supabase.com',
  'Conteúdo patrocinado'
);
