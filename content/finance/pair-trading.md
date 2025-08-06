---
id: 1
date: '2025-08-06'
title: "pair trading"
pinned: false
---

<center><h3 style="color: pink">glossary before busting neovim out</h3></center>

> ↓ so they are the ones i sort of remember now

<div class="glossary-group">
<details><summary>Long</summary>buy a stock expecting it to go up</details>
<details><summary>Short</summary>sell (borrow) a stock expecting it to go down</details>
<details><summary>Spread</summary>the difference in price between two assets (often A − hedge_ratio × B)</details>
<details><summary>Z-score</summary>how far the current spread is from its historical mean, measured in standard deviations</details>
<details><summary>Cointegration</summary>when two time series (like Coke and Pepsi) move together in a statistically stable way</details>
<details><summary>P-value</summary>probability that the cointegration is due to chance (low p-value = strong relationship)</details>
<details><summary>Rolling window</summary>a moving set of recent data points (e.g. past 20 days) used to calculate mean, std, etc</details>
<details><summary>Mean</summary>the average (add all numbers, divide by count)</details>
<details><summary>Standard deviation</summary>how spread out the values are from the mean (helps detect volatility)</details>
<details><summary>Backtesting</summary>simulating a strategy on historical data to see if it would've worked</details>
<details><summary>Hedge ratio</summary>multiplier to balance stock A against B (from linear regression or ML)</details>
</div>

> ↓ these are the ones i am still have trouble with especially `lookahead bias`

<div class="glossary-group">
<details><summary>Entry signal</summary>the condition that tells you when to enter a trade (e.g., z-score > +1)</details>
<details><summary>Exit signal</summary>the condition that tells you when to exit (e.g., z-score reverts to 0)</details>
<details><summary>Cumulative return</summary>the total profit or loss over time from your strategy</details>
<details><summary>Drawdown</summary>the dip from a peak to a trough in your returns; how much you lost before recovering</details>
<details><summary>Market-neutral</summary>a strategy that aims to make money regardless of overall market direction (long + short offset)</details>
<details><summary>Lookahead bias</summary>using future data in a past calculation (cheating without knowing it)</details>
<details><summary>High-frequency data</summary>stock prices every second/millisecond (vs. daily close data)</details>
<details><summary>Mean reversion</summary>assumption that prices will return to the average over time</details>
<details><summary>Equity curve</summary>a graph of your cumulative returns over time; shows if your strategy works</details>
</div>