---
target: "https://arkorra.myshopify.com/ (homepage, live)"
total_score: 22
max_score: 32
na_heuristics: 7,9
p0_count: 0
p1_count: 3
target_identity: "url:https://arkorra.myshopify.com/"
timestamp: 2026-11-07T01-47-00Z
slug: arkorra-myshopify-com
---
# Critique: arkorra.myshopify.com homepage (live)

Method: DEGRADED: single-context (sub-agents not spawned; user did not request them)

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Cart badge visible; add-to-cart feedback not verified |
| 2 | Match System / Real World | 3 | Clear PT-PT copy; "Sem jargão" delivers |
| 3 | User Control and Freedom | 3 | Standard nav and back paths |
| 4 | Consistency and Standards | 3 | Kit naming varies (Kit Apagão / Casa 72h / Família 72h) |
| 5 | Error Prevention | 2 | Email capture shows no visible constraints in the static page |
| 6 | Recognition Rather Than Recall | 2 | Header home/search/account are icon-only |
| 7 | Flexibility and Efficiency | n/a | Persuade surface |
| 8 | Aesthetic and Minimalist Design | 3 | Strong palette; top urgency bar competes with hero |
| 9 | Error Recovery | n/a | No error states reachable from homepage |
| 10 | Help and Documentation | 3 | "Guia de utilização", checklist, 3-step plan |

Total: 22/32 (69%), Acceptable (just under Good threshold of 70%).

## Design Specificity Verdict
Authored for this product: Portuguese civil-protection voice, Iberian blackout reference (abril 2025), three personas (pessoas, famílias, idosos), concrete 72h framing. Not category-interchangeable.

Deterministic scan: `impeccable detect` over sections/ and snippets/ returned 0 findings. No false positives to report.

## Overall Impression
Strong copy and a clear audience split. The header breaks on mobile and the top urgency bar fights the calm tone the copy promises.

## What's Working
- Headline "Preparados hoje. Tranquilos amanhã." sets tone in one line.
- Audience segmentation (Para ti / Para famílias / Para idosos) gives a single decision per card.
- Trust row under the CTA (72h, sem jargão, guia, envio, pagamento, devolução, apoio) answers objections early.

## Priority Issues
1. **[P1] Mobile header clips search and cart at 375px.** Cart button is not visible; only the home, search, and account icons partly show. Why it matters: on mobile, the cart is the path to checkout. Fix: collapse search to an icon that opens a field, keep the cart pinned, and verify at 375px. Suggested command: $impeccable adapt
2. **[P1] Header utility icons have no labels.** Home, search, and account are icon-only; screen readers and first-timers depend on guesses. Fix: add visible labels or aria-labels that match the copy; check focus order. Suggested command: $impeccable clarify
3. **[P1] Top urgency bar contradicts "Sem alarmismo".** Uppercase "RESTAM 9 UNIDADES" and "ALERTA DE PRONTIDÃO CIVIL" sit above a hero promising calm, and take ~110px of a 812px mobile viewport. Fix: decide if scarcity is real; if yes, reduce to one line in sentence case; if not, remove. Suggested command: $impeccable quieter
4. **[P2] Product cards repeat the same CTA with no visible price in text.** Six cards all read "Em Stock / Adicionar ao Carrinho". Price is not in the page text, so it may be images or JS. Fix: confirm price is visible on card; differentiate cards by outcome, not repeated labels. Suggested command: $impeccable layout
5. **[P2] Primary and secondary hero CTAs have similar visual weight on mobile.** Filled orange "Escolher o meu kit" and outlined "Fazer o plano em 2 minutos" stack at full width; the plan CTA reads as equal. Suggested command: $impeccable typeset

## Persona Red Flags
- **Jordan (First-Timer):** header home/search/account icons give no clue what they do; the urgency bar may read as an error.
- **Sam (Accessibility):** icon-only header buttons; cart clipped on mobile may be unreachable without zoom.
- **Casey (Distracted Mobile):** the alert bar pushes the hero down; cart is out of view when they want to buy.

## Minor Observations
- Top bar text is all caps and three lines on mobile.
- Hero image is cropped; subject not clear in the first viewport.
- Footer copy is dense.

## Questions to Consider
- What if the primary action were more prominent on mobile?
- Does the urgency bar need to exist on every page?
- What would a confident version of the header look like with three labeled items?
