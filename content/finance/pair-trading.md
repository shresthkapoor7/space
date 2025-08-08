---
id: 1
date: '2025-08-06'
title: "pair trading: getting started"
pinned: false
---

<div class="desktop-layout" style="display: flex; flex-direction: column; align-items: center; background-color: white; padding: 0 1rem; width: 100%; gap: 0.1rem;">
  <img
    src="https://img.artpal.com/578651/4-20-2-23-23-38-45m.jpg"
    alt="nerd"
    style="height: 200px;"
  />
      <div class="desktop-text" style="font-family: 'Comic Sans MS', cursive, sans-serif; font-size: 2rem; color: #333; line-height: 1.2; text-align: center;">
      <p class="curved-text" style="margin: 0; text-shadow: 2px 2px 0px #000, 4px 4px 0px #000; color: white; -webkit-text-stroke: 2px black; display: none; flex-wrap: wrap; justify-content: center; align-items: center; gap: 0.1rem;"><strong><span style="font-size: 3.5rem; transform: translateY(8px) rotate(-1deg);">C</span><span style="font-size: 3.7rem; transform: translateY(6px) rotate(0deg);">H</span><span style="font-size: 3.9rem; transform: translateY(4px) rotate(1deg);">A</span><span style="font-size: 4.1rem; transform: translateY(2px) rotate(2deg);">P</span><span style="font-size: 4.3rem; transform: translateY(0px) rotate(3deg);">T</span><span style="font-size: 4.5rem; transform: translateY(-2px) rotate(4deg);">E</span><span style="font-size: 4.7rem; transform: translateY(-4px) rotate(5deg);">R</span><span style="font-size: 4.9rem; transform: translateY(-6px) rotate(6deg); margin-right: 0.5rem;"> </span><span style="font-size: 5.1rem; transform: translateY(-8px) rotate(7deg);">1</span></strong></p>
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

<center><h3 style="color: pink">glossary before busting neovim out</h3></center>

> ↓ so they are the ones i sort of remember now

<div class="glossary-group">
<details><summary>long</summary>buy a stock expecting it to go up</details>
<details><summary>short</summary>sell (borrow) a stock expecting it to go down</details>
<details><summary>spread</summary>the difference in price between two assets (often A − hedge_ratio × B)</details>
<details><summary>z-score</summary>how far the current spread is from its historical mean, measured in standard deviations</details>
<details><summary>cointegration</summary>when two time series (like coke and pepsi) move together in a statistically stable way</details>
<details><summary>p-value</summary>probability that the cointegration is due to chance (low p-value = strong relationship)</details>
<details><summary>rolling window</summary>a moving set of recent data points (e.g. past 20 days) used to calculate mean, std, etc</details>
<details><summary>mean</summary>the average (add all numbers, divide by count)</details>
<details><summary>standard deviation</summary>how spread out the values are from the mean (helps detect volatility)</details>
<details><summary>backtesting</summary>simulating a strategy on historical data to see if it would've worked</details>
<details><summary>hedge ratio</summary>multiplier to balance stock A against B (from linear regression or ml)</details>
</div>

> ↓ these are the ones i still have trouble with especially `lookahead bias`

<div class="glossary-group">
<details><summary>entry signal</summary>the condition that tells you when to enter a trade (e.g., z-score > +1)</details>
<details><summary>exit signal</summary>the condition that tells you when to exit (e.g., z-score reverts to 0)</details>
<details><summary>cumulative return</summary>the total profit or loss over time from your strategy</details>
<details><summary>drawdown</summary>the dip from a peak to a trough in your returns; how much you lost before recovering</details>
<details><summary>market-neutral</summary>a strategy that aims to make money regardless of overall market direction (long + short offset)</details>
<details><summary>lookahead bias</summary>using future data in a past calculation (cheating without knowing it)</details>
<details><summary>high-frequency data</summary>stock prices every second/millisecond (vs. daily close data)</details>
<details><summary>mean reversion</summary>assumption that prices will return to the average over time</details>
<details><summary>equity curve</summary>a graph of your cumulative returns over time; shows if your strategy works</details>
</div>


> the main thing **pair trading** it is basically analysis on two stocks that move similarly so if one goes high and the other one goes low at some point they are going to converge, at what value and at what time they would converge is where we make money

so i am gonna break this down into steps

1. data collection
2. hedge ratio
3. spread & z score
4. trade rules
5. backest
6. plots