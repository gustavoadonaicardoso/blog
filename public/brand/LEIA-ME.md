# Assets de marca — Vórtice

Coloque aqui os arquivos de logo e identidade visual do blog.

## Arquivos esperados

| Arquivo | Uso |
|---------|-----|
| `logo.svg` | Logo principal (recomendado: SVG vetorial) |
| `logo-dark.svg` | Versão para fundos escuros (opcional) |
| `favicon.svg` | Favicon do site (referenciado em `/public/favicon.svg`) |
| `og-image.png` | Imagem para Open Graph / redes sociais (1200×630px) |

## Favicon

O favicon é referenciado em `/public/favicon.svg`. Coloque seu arquivo de ícone diretamente em `/public/favicon.svg`.

## Como usar no layout

No `Layout.astro`, o logo textual "Vórtice" é usado por padrão.
Para usar um logo em imagem, edite o componente `.site-logo` em `src/layouts/Layout.astro`:

```astro
<!-- Substitua o texto por uma imagem -->
<a href="/" class="site-logo">
  <img src="/brand/logo.svg" alt="Vórtice" height="32" />
</a>
```

## Paleta de cores

| Cor | Hex | Uso |
|-----|-----|-----|
| Fundo | `#ffffff` | Background principal |
| Texto | `#111111` | Texto base |
| Accent | `#5c4de0` | Links, botões, destaques |
| Accent claro | `#ede9ff` | Badges, fundos sutis |
| Bordas | `#e8e8e8` | Divisores, bordas |
| Texto secundário | `#666666` | Metadados, legendas |
