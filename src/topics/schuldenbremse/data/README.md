# Data

**Status: DRAFT.** All numerical values below were entered by AI based on
knowledge of public-domain figures. **They MUST be re-verified against the
official sources before public release** — Destatis, Deutsche Bundesbank, and
the European Commission's AMECO database typically have the authoritative
versions.

| File | Columns | Source (canonical) | Verified? |
|---|---|---|---|
| `debt-to-gdp.csv` | `year`, `debt_to_gdp_pct` | Destatis / Bundesbank — Schuldenstand des öffentlichen Gesamthaushalts in % BIP | DRAFT — verify |
| `bip-wachstum.csv` | `year`, `real_gdp_growth_pct` | Destatis — Reales BIP, Veränderung gegenüber Vorjahr | DRAFT — verify |
| `inflation-hvpi.csv` | `year`, `inflation_pct` | Destatis / Eurostat — HVPI Jahresdurchschnitt | DRAFT — verify |

## Suggested verification sources

- **debt-to-gdp.csv**: <https://www.destatis.de/DE/Themen/Staat/Oeffentliche-Finanzen/Schulden-Finanzvermoegen/_inhalt.html>
- **bip-wachstum.csv**: <https://www.destatis.de/DE/Themen/Wirtschaft/Volkswirtschaftliche-Gesamtrechnungen-Inlandsprodukt/_inhalt.html>
- **inflation-hvpi.csv**: <https://www.destatis.de/DE/Themen/Wirtschaft/Preise/Verbraucherpreisindex/_inhalt.html>

When verifying: replace the values in place, then update this README's
`Verified?` column to the verification date.
