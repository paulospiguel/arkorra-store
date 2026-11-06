# Napkin Runbook

## Curation Rules
- Re-prioritize on every read.
- Keep recurring, high-value notes only.
- Max 10 items per category.
- Each item includes date + "Do instead".

## Execution & Validation (Highest Priority)
1. **[2026-11-06] Validate Shopify Liquid files with Shopify skill validator**
   Do instead: Always run `scripts/validate.mjs --api liquid --filename <name.liquid> --filetype <filetype> --context theme` before returning modified or created Liquid files.

## Shell & Command Reliability
1. **[2026-11-06] Keep commands prefix-matchable inside sandbox**
   Do instead: Invoke binaries directly without command substitution or variable expansion when possible.

## Domain Behavior Guardrails
1. **[2026-11-06] Theme architecture is a Shopify Liquid theme**
   Do instead: Inspect `config/settings_schema.json`, `config/settings_data.json`, `layout/theme.liquid`, and CSS/Liquid snippets when updating design tokens, colors, typography, and theme editor components.

## User Directives
1. **[2026-11-06] Run type-check if applicable**
   Do instead: Check if a `package.json` with `ts-check` exists, or validate theme files appropriately.
