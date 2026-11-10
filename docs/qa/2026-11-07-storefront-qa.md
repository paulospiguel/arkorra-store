# QA da loja Arkorra (2026-11-07)

Alvo: https://arkorra.myshopify.com (tema live `arkorra-store/main`, #201334096256), desktop e 375px.
Método: sitemap + varredura HTTP, auditoria no navegador (console, DOM, imagens, nomes acessíveis, contraste), interação com os CTAs, menu, gaveta mobile e validação do formulário.

## Não testado (e porquê)
- **Página de produto, adicionar ao carrinho e checkout:** a loja não tem produtos publicados (sitemap sem `sitemap_products`, busca "kit" = 0 resultados). O caminho principal de compra não pôde ser exercitado.
- **Envio do formulário "Receber a checklist":** não enviei, para não gravar dados pessoais. Só validei os campos.
- **Artigo de blog, resultados de busca, conta de cliente:** sem conteúdo ou fora do tema (a conta redireciona para shopify.com).
- Teclado além de Escape, Safari/Firefox, tablet.

## P0 — bloqueia a compra ou o fluxo principal
| # | Problema | Evidência | Correção |
|---|---|---|---|
| 1 | **Nenhum produto real.** Todos os cards são blocos estáticos; "Ver kit" (12 links) leva a `/collections/frontpage`, que mostra os mesmos cards. | Sitemap sem produtos; busca `kit` = 0; `/collections/all` com 4 cards estáticos, todos com `href=/collections/frontpage`. | Criar/publicar produtos e vincular aos cards (campo `product` dos blocos). |
| 2 | **4 CTAs levam a 404.** `Fazer o plano em 2 minutos` e 3× `Ver checklist completa` → `/pages/guia-de-preparacao`. | `/pages/guia-de-preparacao` = 404. O template `page.guia.json` existe, a página não. | Criar a página "Guia de preparação" com o template `page.guia` (handle `guia-de-preparacao`) ou mudar os links. |
| 2b | `Ler o guia de preparação` aponta para `/` (volta à home). Menu "Protocolos & Guias" → `/#guia`. | Lista de links da home. | Apontar para a página do guia. |

## P1 — grave
| # | Problema | Evidência | Correção |
|---|---|---|---|
| 3 | **`/pages/contact` vazia** (só breadcrumb "Casa Contacto"), sem formulário. É o destino dos 3 links legais do rodapé (Termos, Privacidade, Diretivas). | `main` com 1 `h1`, 0 campos. Termos, reembolso e envio dão 404; só `/policies/privacy-policy` existe. | Criar a página de contacto com formulário; configurar Termos, Reembolso e Envio em Configurações → Políticas; apontar os links do rodapé para `/policies/*`. |
| 4 | **Erro de Liquid visível em `/collections`:** `snippets/collection-grid-item line 13: Could not find asset snippets/bgset.liquid`. | Texto no HTML da página. | Restaurar `snippets/bgset.liquid` ou trocar o `include 'bgset'` em `collection-grid-item.liquid`. |
| 5 | **Gaveta mobile:** botão fechar (X) branco sobre `rgb(244,246,248)` = 1,1:1 (invisível); "Envio Hoje até às 17h" `rgb(203,213,225)` = 1,4:1; clicar no fundo **não** fecha; foco não entra na gaveta nem fica preso. | Medido por `getComputedStyle` e clique real. | No painel claro, usar cor escura no `.ark-header__icon-button` e no `.ark-header__shipping`; fechar no clique do fundo; mover o foco ao abrir. |
| 6 | **Afirmações não verificáveis** no site: "100% Homologado", "Norma EN-72H", "Lote Ibérico #04", "RESTAM 9 UNIDADES", "Homologação e Diretrizes de Proteção Civil UE", validade "5 a 25 anos". O rodapé anuncia MB WAY, Multibanco, Bizum e Visa/MC, mas `shop.enabled_payment_types` = só `paypal`. | Conteúdo da home, `/collections/*` e rodapé. | O dono confirma cada claim e cada método de pagamento; remover o que não for verdadeiro. |

## P2 — médio
| # | Problema | Evidência | Correção |
|---|---|---|---|
| 7 | Filtros de `/collections/all` não filtram: as 4 pílulas apontam para `/collections/all`. Sem ordenação. | `filters` e `sort` no DOM. | Ligar a coleções/tags reais ou remover. |
| 8 | Menu com 6 categorias que vão para 3 destinos (4 → `/#catalogo`). "Ver kits para pessoas/famílias/idosos" → todos `/collections/all`. | Lista de links. | Coleções por categoria e por público. |
| 9 | "Escolher o meu kit" rola para `#catalogo` e o header fixo cobre o topo da secção (`top` = −34px, sem `scroll-margin-top`). | Medido após o clique. | `scroll-margin-top` ≥ altura do header nas secções com âncora. |
| 10 | Idioma: breadcrumb "Casa" no lugar de "Início" (contacto, blog, coleções, carrinho); página 404 em inglês ("PAGE NOT FOUND…") com imagem `404.png` quebrada; blog vazio com títulos em inglês ("CATEGORIES RECENT POST BLOG TAGS BLOG BANNER"); carrinho vazio com "Você…" (pt-BR); coleção `frontpage` intitulada "Página inicial". | Texto das páginas. | Traduzir os locales `pt-PT`, corrigir o caminho da imagem do 404, renomear a coleção. |
| 11 | Dois catálogos estáticos diferentes (home: "Kit Apagão Essencial"…; coleção: "Kit Família 72 Horas Pro"…). Imagens com texto embutido cortado, e a foto do "Kit Casa 72h" diz "KIT SÉNIOR". | Capturas mobile. | Usar produtos reais com fotos próprias. |
| 12 | SEO: sem meta description na home; `og:description` = "Arkorra"; H1 → H3 sem H2 na barra de confiança; título "Prepare-se para o inevitável" contradiz "sem alarmismo". | `meta`, ordem dos títulos. | Definir descrição em Preferências do Online Store; trocar H3 por H2 ou reordenar; rever o título. |

## P3 — baixo
| # | Problema | Evidência |
|---|---|---|
| 13 | Console: CSP `frame-ancestors` de `shop.app` (plataforma); 2× 404 e 1× 500 em recursos que não identifiquei (não são ficheiros do tema, todos com 200); preloads de `jquery`, `novstyle.css`, `history.js` enviados mas não usados na home. | `read_console_messages` e `read_network_requests`. |
| 14 | Formulário da checklist: validação só nativa (mensagem no idioma do navegador), sem captcha. A promessa "Enviamos o PDF" depende de uma automação não verificada. | Campos `required`, `form_type=customer`, tags `newsletter,guia-72h`. |
| 15 | Blog: 2 links/botões sem nome acessível. | Auditoria de `/blogs/noticias`. |

## O que está bem
Sem estouro horizontal em nenhuma página; sem imagens quebradas fora do 404; `lang="pt-PT"`; JSON-LD `Organization+WebSite` válido; canonical e Open Graph presentes; formulário com labels, `autocomplete` e `required`; política de privacidade completa; gaveta fecha com Escape e destrava o scroll; busca do cabeçalho envia para `/search`.

## Status das correções de tema
As correções de código já estão no `main` e no tema live (a integração do Shopify commitou de volta as publicações). Verificadas no servidor de dev (`shopify theme dev`), em 375 px e desktop, e depois no live.

| # | Estado | Como foi verificado |
|---|---|---|
| 4 | Corrigido | `/collections` sem erro de Liquid; o item usa o placeholder do tema. |
| 5 | Corrigido | Contraste do X: 1,1 → 15,7. Texto de envio: 1,4 → 7,0. Clique no fundo fecha. Foco vai para o X ao abrir, volta ao botão do menu ao fechar e fica preso no painel (12 Tabs). Escape fecha e destrava o scroll. |
| 9 | Corrigido | `scroll-padding-top`: a seção `#catalogo` fica 96 px (tablet) ou 152 px (≥990 px) abaixo do topo, livre do header. Antes: −34 px. |
| 10 (parcial) | Corrigido só o 404 | Removida a imagem `404.png`, que não existe, chamada com o filtro inválido `assets_url`. Os textos em inglês, "Casa" e "Você" vêm de traduções salvas no admin (o tema não tem `pt-PT.json`) e **não** foram alterados. |
| 12 (parcial) | Corrigido só os títulos | H2 oculto na barra de garantias: ordem H1 → H2 → H3. A meta description depende das Preferências do Online Store e **não** foi alterada. |
| 15 | Corrigido | Botão de busca do blog com `aria-label`; banner placeholder deixou de ser link para `#`. |
| novo | **Pendente** | `config/settings_data.json` do `main` tem `br_pi` = 12, fora do passo de 5 do schema, e o upload falha no `shopify theme dev` ("Setting 'br_pi' must be a step in the range"). A correção seria `br_pi` = 10 (o valor do live), mas ficou **fora** de propósito: o arquivo do `main` também traz o design novo (`ark_color_*`, `color_button` `#0B1E2D`), que o live ainda não tem, e o merge dele pode aplicá-lo nas páginas legadas. Decidir antes. |
| novo | Corrigido | Header e rodapé apareciam menores nas páginas internas (busca, carrinho, blog, 404, páginas): `novstyle.css` define `html{font-size:62.5%}` (59% abaixo de 1200 px, 57% abaixo de 992 px, 55% abaixo de 576 px) e os componentes `ark-*` usam `rem`. Header, rodapé e tokens passaram a usar `--ark-rem: 16px`. Medido em 1440 px e 375 px: header, logo, largura da página e fonte do rodapé iguais à home. |

Fora do código do tema, continuam abertos: 1, 2, 2b, 3, 6, 7, 8, 11, 13 e 14.
