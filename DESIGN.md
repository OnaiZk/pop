# Design System — POP Operacional Eletromidia (Concessão SP)

## Aesthetic Direction & Paradigm
- **Domain**: Field Engineering Operations / Urban Furniture Maintenance (Totens & Abrigos)
- **Primary Paradigm**: **P4 Atmospheric Minimalism & High-Craft UI** (65%) blended with **P2 Kinetic Typography & Neo-Brutalist Swiss Grids** (35%)
- **Theme Polarity**: Intentional Dark Mode Operational Workbench (`#0C0E12`) paired with High-Craft Daylight Paper (`#FAF7F2`) for the NBR ISO 9001:2015 A4 specification sheet and `@media print` workflow.

## Color & Atmospheric Tokens
| Token | Value | Role |
|---|---|---|
| `--bg-canvas` | `#0C0E12` | Deep carbon operational background |
| `--bg-elevated` | `#13171F` | Technical card & panel surface |
| `--bg-interactive` | `#1A202C` | Interactive control & hover surface |
| `--paper-surface` | `#FAF7F2` | High-craft warm technical paper for ISO 9001 A4 sheet |
| `--paper-elevated` | `#F1EDE4` | Secondary cell fill on ISO sheet |
| `--text-primary` | `#F4F6F8` | Crisp off-white primary copy |
| `--text-secondary` | `#A0AEC0` | Technical slate secondary copy |
| `--text-muted` | `#64748B` | Captions, metadata labels, coordinates |
| `--accent-brand` | `#FF4F00` | Eletromidia Signal Orange (primary focal action & safety highlight) |
| `--accent-amber` | `#F59E0B` | NBR 9050 / Cone & Tinta Fresca field warning |
| `--accent-emerald` | `#10B981` | Field Service (FS) compliance & verified check |
| `--border-hairline` | `#222936` | Exposed `1px solid` Swiss engineering grid hairline |

## Typography & Scannable Hierarchy
- **Display / Section Headers (`--font-display`)**: `'Barlow Condensed'` (`600` / `700`), uppercase for technical headers, tight tracking (`-0.01em` to `0.04em`).
- **UI & Technical Procedure Copy (`--font-sans`)**: `'Archivo'` (`400`, `500`, `600`), comfortable reading measure (`60ch–70ch`).
- **Codes, CA Numbers, Revisão, Timestamps (`--font-mono`)**: `'JetBrains Mono'` (`500`, `700`) with `font-variant-numeric: tabular-nums`.

## Layout, Spatial Architecture & Focal Point
- **Grid Structure**: Exposed `1px solid` structural hairlines dividing metadata cells, procedure steps, and vector technical diagrams.
- **3 Integrated Formats**:
  1. **Vídeo Remotion (16:9 & 9:16)**: 30fps animated composition (`1260` frames / `42s`) with chapter scrubber, safe-zone guides, and direct CLI MP4 export commands.
  2. **Playbook Interativo de Campo**: Pre-flight checklist for 12 EPIs (with CA numbers) and 19 materials grouped into 3 functional kits (`KIT-01`, `KIT-02`, `KIT-03`), interactive 3-angle FS photo simulator, conditional "Tinta Fresca" procedure toggle, and onboarding quiz.
  3. **Ficha Oficial NBR ISO 9001:2015 (A4 Print-Ready)**: 2-page technical specification sheet correcting all Canva layout issues, with authored SVG diagrams and direct `@media print` A4 export.
