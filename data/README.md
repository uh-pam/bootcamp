# Datasets

| File | Source | Licence | Notes |
|---|---|---|---|
| `penguins_raw.csv` | Palmer Station penguins — Horst, Hill & Gorman (2020), palmerpenguins R package; data from Gorman, Williams & Fraser (2014) | CC0 1.0 | 344 rows, with missing values (used in Unit 7) |
| `penguins.csv` | as above | CC0 1.0 | 333 complete rows (rows with any missing value removed); used from Unit 0 |
| `heathrow.csv` | Met Office, Heathrow station, historic monthly data 1991–2020 (metoffice.gov.uk/pub/data/weather/uk/climate/stationdata/heathrowdata.txt) | Open Government Licence v3.0 | 360 rows: `year`, `month`, `tmax` (mean daily maximum temperature, °C), `rain` (total rainfall, mm), `season`; used from Unit 4 |
| `oxford.csv` | Met Office, Oxford station, historic monthly data 1853–2025 (metoffice.gov.uk/pub/data/weather/uk/climate/stationdata/oxforddata.txt; downloaded 30 Sep 2026; provisional 2026 months dropped; estimate marks `*`/`#` removed) | Open Government Licence v3.0 | 2076 rows: `year`, `month`, `tmax`, `tmin` (°C), `af` (air-frost days), `rain` (mm), `sun` (hours; empty before 1929 and where missing); used in Unit 11 |

## Other files

| File | Purpose |
|---|---|
| `hello-bootcamp.ipynb` | Unit 0.5 test notebook: checks a local Anaconda/Jupyter set-up (reads `penguins.csv`, draws a plot). |
| `oxford-case-study.ipynb` | Unit 11 starter notebook: the case-study question with section headings (Load, Inspect, Clean, Summarise, Plot; Trend, Uncertainty, Interpret) and empty code cells; reads `oxford.csv` from the same folder. |
