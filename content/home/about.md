---
id: 7
date: '2025-08-10'
title: "shresth.md"
pinned: true
---

<link href="https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&family=Caveat:wght@400;500;600;700&family=Dancing+Script:wght@400;500;600;700&display=swap" rel="stylesheet">

cs at [@nyu](https://www.nyu.edu/), ex-swe [@talenttitan](https://talenttitan.com/)

<style>
  .about-container {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    margin-top: 1rem;
  }

  .about-image {
    flex-shrink: 0;
  }

  .about-image {
    position: relative;
    transform: rotate(-2deg);
    transition: transform 0.3s ease;
  }

  .about-image:hover {
    transform: rotate(0deg);
  }

  .about-image img {
    width: 300px;
    border: 12px solid #faf9f7;
    border-bottom: 40px solid #faf9f7;
    border-radius: 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), 0 6px 20px rgba(0, 0, 0, 0.2);
    filter: sepia(25%) contrast(1.1) brightness(1.05) saturate(0.9) hue-rotate(-5deg);
  }

  .about-image::after {
    content: '';
    position: absolute;
    top: 12px;
    left: 12px;
    right: 12px;
    bottom: 40px;
    background: linear-gradient(45deg,
      rgba(139, 69, 19, 0.03) 0%,
      rgba(160, 82, 45, 0.02) 25%,
      rgba(210, 180, 140, 0.03) 50%,
      rgba(139, 69, 19, 0.02) 75%,
      rgba(101, 67, 33, 0.03) 100%);
    pointer-events: none;
    mix-blend-mode: multiply;
  }

  .photo-caption {
    position: absolute;
    bottom: 18px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 18px;
    color: #333;
    font-family: 'Kalam', 'Caveat', 'Dancing Script', cursive;
    margin: 0;
    font-weight: 400;
    letter-spacing: 0.5px;
  }

  .about-content {
    flex: 1;
  }

  @media (max-width: 768px) {
    .about-container {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .about-image img {
      width: 250px;
      border: 10px solid #faf9f7;
      border-bottom: 30px solid #faf9f7;
    }

    .about-image::after {
      top: 10px;
      left: 10px;
      right: 10px;
      bottom: 30px;
    }

    .photo-caption {
      bottom: 16px;
      font-size: 12px;
    }
  }
</style>

<div class="about-container">
  <div class="about-image">
    <img
      src="/images/shresth.JPG"
      alt="nerd"
    />
    <p class="photo-caption">10/08/2025</p>
  </div>
  <div class="about-content">

#### working on
- **[strands](/strands)** slack threads but for LLMs
- **[Σpace](/2)** my personal substack
- **[riff](/5)** shazam but with spotify
- **[caterpillar](/4)** track your favorite creators and me

  </div>
</div>


<center>

[twitter](https://x.com/shresthkapoor7) | [github](https://github.com/shresthkapoor7)
 | [linkedin](https://www.linkedin.com/in/shresth-kapoor-7skp/)
</center>