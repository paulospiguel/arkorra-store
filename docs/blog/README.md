# Primeiros artigos do blog

Cada ficheiro `.html` é o corpo do artigo, pronto a colar no editor da Shopify
(Online Store → Blogs → Adicionar artigo → botão `<>` para HTML).

Antes de publicar: criar o blog em Online Store → Blogs (handle `news` ou outro),
e rever o conteúdo (números de emergência e os conselhos de saúde e veterinários).

| # | Ficheiro | Título | Etiquetas | Resumo (campo "Excerto") |
|---|----------|--------|-----------|--------------------------|
| 1 | `01-apagao-primeiras-72-horas.html` | Apagão: o que fazer nas primeiras 72 horas | Apagão, Guias | O que fazer, por ordem, na primeira hora, nas primeiras 12 horas e até às 72 horas sem eletricidade. |
| 2 | `02-o-que-guardar-em-casa.html` | O que guardar em casa para 3 dias sem serviços | Kits, Preparação | Água, comida, luz, saúde, documentos e dinheiro: a lista de base para uma primeira reserva. |
| 3 | `03-porque-imprimir-o-guia.html` | Porque deves imprimir o teu guia de emergência | Guias, Preparação | Sem bateria nem rede, o papel continua a funcionar. Como imprimir, onde guardar e quando rever. |
| 4 | `04-sem-internet-como-manter-te-informado.html` | Sem internet: como te informares, comunicar e pagar | Ciberataque, Comunicação | Rádio, SMS, contacto fora da zona, numerário e cuidado com burlas quando a rede falha. |
| 5 | `05-o-teu-animal-tambem-precisa-de-um-plano.html` | O teu animal também precisa de um plano | Animais, Preparação | Identificação, reservas, calor e ruído, e o que fazer se tiveres de sair de casa com o teu animal. |

## Imagens

Cada artigo tem um campo de imagem de destaque. Sem imagem, o cartão mostra o ícone
ilustrado do guia. Podem gerar-se capas no estilo da marca com o FLUX.

## Notas de revisão

- Telefones usados: 112 e SNS 24 (808 24 24 24). Confirmar antes de publicar.
- Artigo 5: dose de água (cerca de 50 ml/kg/dia) e sinais de alarme devem ser
  validados por um médico veterinário.
- Os links `/#guias` apontam para a seção de guias da home.

## Segunda série: emergência e escassez

| # | Ficheiro | Título | Etiquetas | Resumo (campo "Excerto") |
|---|----------|--------|-----------|--------------------------|
| 6 | `06-estado-de-emergencia-o-que-significa.html` | Estado de emergência: o que significa e o que fazer | Emergência, Preparação | Alerta, contingência, calamidade e estado de emergência explicados, e o que fazer ao receber um aviso, ficar ou sair de casa. |
| 7 | `07-escassez-de-itens-basicos.html` | Prateleiras vazias: como atravessar uma escassez de itens básicos | Escassez, Preparação | Porque faltam as coisas, o que acaba primeiro e como te preparares sem açambarcar. |
| 8 | `08-agua-e-comida-quando-faltam.html` | Água e comida quando faltam: contas e cuidados | Água, Comida, Escassez | Quanta água e comida precisas, como tornar a água segura e como evitar riscos sem frio. |

Rever antes de publicar: definições de alerta, contingência, calamidade e estado de emergência
(confirmar com fontes oficiais), valores de kcal e orientações sobre água, bebés e saúde.

## Ilustrações (obrigatórias em todos os artigos)

Cada artigo tem uma capa e duas ilustrações no corpo, geradas no FLUX no estilo da marca:
`assets/ark-blog-<handle>-cover.jpg`, `-1.jpg` e `-2.jpg`.

- **Handle do artigo = nome do ficheiro sem o número**, por exemplo `apagao-primeiras-72-horas`.
  Definir esse handle ao criar o artigo na Shopify (campo "Endereço URL" / handle).
- **Capa:** se o artigo não tiver imagem de destaque, o tema usa a capa ilustrada automaticamente,
  na listagem, nos cartões da home e no topo do artigo.
- **Corpo:** o HTML usa `src="ark-img/ark-blog-<handle>-N.jpg"`; o tema converte isso para o asset
  do tema. No editor da Shopify as imagens podem aparecer partidas; na loja aparecem.
- Novos artigos: gerar as 3 imagens, guardar em `assets/` com o mesmo padrão e acrescentar o handle
  à lista em `snippets/ark-blog-art.liquid`.
