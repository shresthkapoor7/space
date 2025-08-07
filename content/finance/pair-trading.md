---
id: 1
date: '2025-08-06'
title: "pair trading"
pinned: false
---

<div class="desktop-layout" style="display: flex; flex-direction: column; align-items: center; background-color: white; padding: 0 1rem; width: 100%; gap: 0.1rem;">
  <img
    src="https://img.artpal.com/578651/4-20-2-23-23-38-45m.jpg"
    alt="nerd"
    style="height: 200px;"
  />
      <div class="desktop-text" style="font-family: 'Comic Sans MS', cursive, sans-serif; font-size: 2rem; color: #333; line-height: 1.2; text-align: center;">
      <p class="curved-text" style="margin: 0; text-shadow: 1px 1px 0px #000, 2px 2px 0px #000; color: white; -webkit-text-stroke: 1px black; display: none; flex-wrap: wrap; justify-content: center; align-items: center; gap: 0.05rem;"><strong><span style="font-size: 1.0rem; transform: translateY(4px) rotate(-1deg);">P</span><span style="font-size: 1.1rem; transform: translateY(3px) rotate(0deg);">A</span><span style="font-size: 1.2rem; transform: translateY(2px) rotate(1deg);">I</span><span style="font-size: 1.3rem; transform: translateY(1px) rotate(2deg);">R</span><span style="font-size: 1.4rem; transform: translateY(0px) rotate(3deg); margin-right: 0.3rem;"></span><span style="font-size: 1.5rem; transform: translateY(-1px) rotate(4deg);">T</span><span style="font-size: 1.6rem; transform: translateY(-2px) rotate(5deg);">R</span><span style="font-size: 1.7rem; transform: translateY(-3px) rotate(6deg);">A</span><span style="font-size: 1.8rem; transform: translateY(-4px) rotate(7deg);">D</span><span style="font-size: 1.9rem; transform: translateY(-5px) rotate(8deg);">I</span><span style="font-size: 2.0rem; transform: translateY(-6px) rotate(9deg);">N</span><span style="font-size: 2.1rem; transform: translateY(-7px) rotate(10deg);">G</span><span style="font-size: 2.2rem; transform: translateY(-8px) rotate(11deg); margin-right: 0.3rem;"></span><span style="font-size: 2.3rem; transform: translateY(-9px) rotate(12deg);">A</span><span style="font-size: 2.4rem; transform: translateY(-10px) rotate(13deg);">D</span><span style="font-size: 2.5rem; transform: translateY(-11px) rotate(14deg);">V</span><span style="font-size: 2.6rem; transform: translateY(-12px) rotate(15deg);">E</span><span style="font-size: 2.7rem; transform: translateY(-13px) rotate(16deg);">N</span><span style="font-size: 2.8rem; transform: translateY(-14px) rotate(17deg);">T</span><span style="font-size: 2.9rem; transform: translateY(-15px) rotate(18deg);">U</span><span style="font-size: 3.0rem; transform: translateY(-16px) rotate(19deg);">R</span><span style="font-size: 3.1rem; transform: translateY(-17px) rotate(20deg);">E</span><span style="font-size: 3.2rem; transform: translateY(-18px) rotate(21deg);">!</span></strong></p>
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

> ↓ these are the ones i still have trouble with especially `lookahead bias`

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


> the main thing **pair trading** it is basically analysis on two stocks that move similarly so if one goes high and the other one goes low at some point they are going to converge, at what value and at what time they would converge is where we make money

so i am gonna break this down into steps

1. data collection
2. hedge ratio
3. spread & z score
4. trade rules
5. backest
6. plots


$begin:math:display$
\beta = \frac{\text{Cov}(Y_h, Y_p)}{\text{Var}(Y_h)} = \frac{\sum_t (\Delta Y_h - \overline{\Delta Y_h})(\Delta Y_p - \overline{\Delta Y_p})}{\sum_t (\Delta Y_h - \overline{\Delta Y_h})^2}
$end:math:display$

copied from [cool website](https://analystprep.com/study-notes/frm/part-2/market-risk-measurement-and-management/regression-hedging-and-principal-component-analysis/)