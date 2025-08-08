---
id: 2
date: '2025-08-07'
title: "pair trading: data collection"
pinned: false
---

<div class="desktop-layout" style="display: flex; flex-direction: column; align-items: center; background-color: white; padding: 0 1rem; width: 100%; gap: 0.1rem;">
  <img
    src="https://i.pinimg.com/564x/39/1a/bc/391abcc625995a5743e34f1ef8beb8d7.jpg"
    alt="nerd"
    style="height: 200px;"
  />
      <div class="desktop-text" style="font-family: 'Comic Sans MS', cursive, sans-serif; font-size: 2rem; color: #333; line-height: 1.2; text-align: center;">
      <p class="curved-text" style="margin: 0; text-shadow: 2px 2px 0px #000, 4px 4px 0px #000; color: white; -webkit-text-stroke: 2px black; display: none; flex-wrap: wrap; justify-content: center; align-items: center; gap: 0.1rem;"><strong><span style="font-size: 3.5rem; transform: translateY(8px) rotate(-1deg);">C</span><span style="font-size: 3.7rem; transform: translateY(6px) rotate(0deg);">H</span><span style="font-size: 3.9rem; transform: translateY(4px) rotate(1deg);">A</span><span style="font-size: 4.1rem; transform: translateY(2px) rotate(2deg);">P</span><span style="font-size: 4.3rem; transform: translateY(0px) rotate(3deg);">T</span><span style="font-size: 4.5rem; transform: translateY(-2px) rotate(4deg);">E</span><span style="font-size: 4.7rem; transform: translateY(-4px) rotate(5deg);">R</span><span style="font-size: 4.9rem; transform: translateY(-6px) rotate(6deg); margin-right: 0.5rem;"> </span><span style="font-size: 5.1rem; transform: translateY(-8px) rotate(7deg);">2</span></strong></p>
    </div>
      <style>
      @media (min-width: 768px) {
        .desktop-layout {
          flex-direction: row !important;
          align-items: center !important;
          gap: 2rem !important;
        }
        .desktop-text {
          font-size: 2.5rem !important;
          transform: rotate(-5deg) !important;
        }
        .curved-text {
          display: flex !important;
        }
      }
    </style>
</div>

<center><h3 style="color: pink">data collection using yfinance</h3></center>

```py
# step 1 - getting data
import yfinance as yf
import pandas as pd

ko_df = yf.download("KO", period="2y")
pep_df = yf.download("PEP", period="2y")


# ChatGPT say this will save memory, ↓ memory ∝ ↑ more chances of me getting a job
ko_close = ko_df[("Close", "KO")]
pep_close = pep_df[("Close", "PEP")]

# ChatGPT says it is ok to use close for pair trading but we should use adj_close but there is no adj_close here 😭

print(ko_df.columns)
print(ko_close.head)
```

***note: i won't be using the `yfinance` because it has dependencies that would not work in the browser***

```python
import pandas as pd
import numpy as np

dates = pd.date_range(start='2022-01-01', end='2024-01-01', freq='D')
np.random.seed(42)

ko_base = 50
pep_base = 150

returns_ko = np.random.normal(0.0005, 0.02, len(dates))
returns_pep = np.random.normal(0.0003, 0.018, len(dates))

correlation_factor = 0.6
returns_pep = correlation_factor * returns_ko + np.sqrt(1 - correlation_factor**2) * returns_pep

ko_prices = [ko_base]
pep_prices = [pep_base]

for i in range(1, len(dates)):
    ko_prices.append(ko_prices[-1] * (1 + returns_ko[i]))
    pep_prices.append(pep_prices[-1] * (1 + returns_pep[i]))

ko_df = pd.DataFrame({
    'Open': ko_prices,
    'High': [p * (1 + np.random.uniform(0, 0.02)) for p in ko_prices],
    'Low': [p * (1 - np.random.uniform(0, 0.02)) for p in ko_prices],
    'Close': ko_prices,
    'Volume': np.random.randint(1000000, 10000000, len(dates))
}, index=dates)

pep_df = pd.DataFrame({
    'Open': pep_prices,
    'High': [p * (1 + np.random.uniform(0, 0.02)) for p in pep_prices],
    'Low': [p * (1 - np.random.uniform(0, 0.02)) for p in pep_prices],
    'Close': pep_prices,
    'Volume': np.random.randint(1000000, 10000000, len(dates))
}, index=dates)

ko_close = ko_df["Close"]
pep_close = pep_df["Close"]

print("KO DataFrame columns:")
print(ko_df.columns.tolist())
print("\nKO Close prices (first 5):")
print(ko_close.head())
print(f"\nKO price range: ${ko_close.min():.2f} - ${ko_close.max():.2f}")
print(f"PEP price range: ${pep_close.min():.2f} - ${pep_close.max():.2f}")
```