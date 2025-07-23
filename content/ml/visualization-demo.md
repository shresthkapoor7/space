---
id: 1
date: '2025-07-19'
title: "data visualization works"
pinned: false
---

testing out matplotlib with some random data visualization:

```python
import matplotlib.pyplot as plt
import numpy as np

# Simple scatter plot
x = np.random.randn(50)
y = np.random.randn(50)
colors = np.random.rand(50)

plt.figure(figsize=(8, 6))
plt.scatter(x, y, c=colors, alpha=0.7, cmap='viridis')
plt.title('Random Scatter Plot', color='white', fontsize=14)
plt.xlabel('X values', color='white')
plt.ylabel('Y values', color='white')
plt.colorbar(label='Color Scale')

# Dark theme
plt.gca().set_facecolor('#2a2a2a')
plt.gcf().patch.set_facecolor('#2a2a2a')
plt.tick_params(colors='white')

plt.show()
print("🎨 Beautiful scatter plot generated!")
```

data visualization is the art of making numbers tell stories! 📊