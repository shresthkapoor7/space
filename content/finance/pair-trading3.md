---
id: 3
date: '2025-08-08'
title: "pair trading: hedge ratio"
pinned: false
---

<div class="desktop-layout" style="display: flex; flex-direction: column; align-items: center; background-color: white; padding: 0 1rem; width: 100%; gap: 0.1rem;">
  <img
    src="https://i.redd.it/drawing-every-single-one-piece-character-young-nami-young-v0-79ijfargauuc1.jpg?width=596&format=pjpg&auto=webp&s=b715c3c40663c1d37d0ae3e527af36fe01f97c00"
    alt="nerd"
    style="height: 200px;"
  />
      <div class="desktop-text" style="font-family: 'Comic Sans MS', cursive, sans-serif; font-size: 2rem; color: #333; line-height: 1.2; text-align: center;">
      <p class="curved-text" style="margin: 0; text-shadow: 2px 2px 0px #000, 4px 4px 0px #000; color: white; -webkit-text-stroke: 2px black; display: none; flex-wrap: wrap; justify-content: center; align-items: center; gap: 0.1rem;"><strong><span style="font-size: 3.5rem; transform: translateY(8px) rotate(-1deg);">C</span><span style="font-size: 3.7rem; transform: translateY(6px) rotate(0deg);">H</span><span style="font-size: 3.9rem; transform: translateY(4px) rotate(1deg);">A</span><span style="font-size: 4.1rem; transform: translateY(2px) rotate(2deg);">P</span><span style="font-size: 4.3rem; transform: translateY(0px) rotate(3deg);">T</span><span style="font-size: 4.5rem; transform: translateY(-2px) rotate(4deg);">E</span><span style="font-size: 4.7rem; transform: translateY(-4px) rotate(5deg);">R</span><span style="font-size: 4.9rem; transform: translateY(-6px) rotate(6deg); margin-right: 0.5rem;"> </span><span style="font-size: 5.1rem; transform: translateY(-8px) rotate(7deg);">3</span></strong></p>
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

<center><h3 style="color: pink">calculating hedge ratio</h3></center>

**hedge** is a way to protect yourself from big losses by taking an opposite position.
so if you own stock A (long) and think it might drop, you short stock B that usually moves in the same way. if A falls, B will likely fall too, and your short position on B will offset part of the loss from A.

**why we use it**, basically it reduce risk (volatility) and make profits more stable, especially when trading pairs.

**hedge ratio (β)** tells you how much of the hedge stock to hold vs. the primary stock to balance risk.

formula [copied from](https://analystprep.com/study-notes/frm/part-2/market-risk-measurement-and-management/regression-hedging-and-principal-component-analysis/):
$begin:math:display$
\beta = \frac{\text{Cov}(Y_h, Y_p)}{\text{Var}(Y_h)} = \frac{\sum_t (\Delta Y_h - \overline{\Delta Y_h})(\Delta Y_p - \overline{\Delta Y_p})}{\sum_t (\Delta Y_h - \overline{\Delta Y_h})^2}
$end:math:display$

where:

$begin:math:display$
Y_p
$end:math:display$ - price (or returns) of the stock you want to protect (primary)

$begin:math:display$
Y_h
$end:math:display$ - price (or returns) of the hedge stock

$begin:math:display$
\Delta Y
$end:math:display$ - daily return (today’s price – yesterday’s price)

$begin:math:display$
\overline{\Delta Y}
$end:math:display$ - mean daily return over the period

$begin:math:display$
\text{Cov}
$end:math:display$ - how the two stocks move together

$begin:math:display$
\text{Var}
$end:math:display$ - how much the hedge stock’s returns vary on their own