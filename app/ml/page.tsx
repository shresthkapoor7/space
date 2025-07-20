import React from 'react'
import BlogPost from '../components/BlogPost'
import TableOfContents from '../components/TableOfContents'

const mlPosts = [
  {
    id: 1,
    date: '06 Mar, 2025',
    title: "visualizing data with matplotlib: the foundation of ml insights",
    content: `data visualization is crucial for understanding machine learning models and datasets. matplotlib is the cornerstone library for creating beautiful, informative plots in python.

## basic plotting fundamentals

let's start with a simple example to test our plotting system:

\`\`\`python
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
\`\`\`

now let's explore more complex patterns every ml practitioner should know:

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

# Generate sample data
x = np.linspace(0, 10, 100)
y1 = np.sin(x)
y2 = np.cos(x)

# Create a figure with subplots
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))

# Plot sine wave
ax1.plot(x, y1, 'b-', linewidth=2, label='sin(x)')
ax1.set_title('Sine Wave', color='white')
ax1.set_xlabel('x', color='white')
ax1.set_ylabel('sin(x)', color='white')
ax1.grid(True, alpha=0.3)
ax1.legend()
ax1.tick_params(colors='white')

# Plot cosine wave
ax2.plot(x, y2, 'r--', linewidth=2, label='cos(x)')
ax2.set_title('Cosine Wave', color='white')
ax2.set_xlabel('x', color='white')
ax2.set_ylabel('cos(x)', color='white')
ax2.grid(True, alpha=0.3)
ax2.legend()
ax2.tick_params(colors='white')

# Set dark background
fig.patch.set_facecolor('#2a2a2a')
ax1.set_facecolor('#2a2a2a')
ax2.set_facecolor('#2a2a2a')

plt.tight_layout()
plt.show()

print("✅ Generated sine and cosine wave plots!")
\`\`\`

## machine learning visualization patterns

here are common visualization patterns for ml workflows:

\`\`\`python
# Simulating ML workflow visualizations
import matplotlib.pyplot as plt
import numpy as np

# Generate synthetic dataset
np.random.seed(42)
n_samples = 100
X = np.random.randn(n_samples, 2)
y = (X[:, 0] + X[:, 1] > 0).astype(int)

# Create a comprehensive ML visualization
fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 10))

# 1. Scatter plot of data points
colors = ['red', 'blue']
for i in range(2):
    mask = y == i
    ax1.scatter(X[mask, 0], X[mask, 1], c=colors[i],
                label=f'Class {i}', alpha=0.7)
ax1.set_title('Dataset Visualization')
ax1.set_xlabel('Feature 1')
ax1.set_ylabel('Feature 2')
ax1.legend()
ax1.grid(True, alpha=0.3)

# 2. Training/Validation Loss
epochs = np.arange(1, 51)
train_loss = 2.0 * np.exp(-epochs/10) + 0.1 + np.random.normal(0, 0.05, 50)
val_loss = 2.2 * np.exp(-epochs/8) + 0.15 + np.random.normal(0, 0.08, 50)

ax2.plot(epochs, train_loss, 'b-', label='Training Loss', linewidth=2)
ax2.plot(epochs, val_loss, 'r-', label='Validation Loss', linewidth=2)
ax2.set_title('Training Progress')
ax2.set_xlabel('Epoch')
ax2.set_ylabel('Loss')
ax2.legend()
ax2.grid(True, alpha=0.3)

# 3. Feature importance
features = ['Age', 'Income', 'Education', 'Experience', 'Location']
importance = np.random.rand(5)
importance = importance / importance.sum()

ax3.barh(features, importance, color='skyblue')
ax3.set_title('Feature Importance')
ax3.set_xlabel('Importance Score')

# 4. Confusion Matrix Heatmap
confusion_matrix = np.array([[85, 15], [20, 80]])
im = ax4.imshow(confusion_matrix, cmap='Blues')
ax4.set_title('Confusion Matrix')
ax4.set_xlabel('Predicted')
ax4.set_ylabel('Actual')

# Add text annotations
for i in range(2):
    for j in range(2):
        ax4.text(j, i, confusion_matrix[i, j],
                ha='center', va='center', fontweight='bold')

plt.tight_layout()
plt.show()

# Print accuracy
accuracy = np.trace(confusion_matrix) / np.sum(confusion_matrix)
print(f"Model Accuracy: {accuracy:.2%}")
\`\`\`

## advanced styling and customization

matplotlib's power shines in its customization capabilities:

\`\`\`python
# Set style for publication-ready plots
plt.style.use('seaborn-v0_8-darkgrid')  # or 'ggplot', 'bmh'

# Create a professional-looking plot
fig, ax = plt.subplots(figsize=(10, 6))

# Generate data for different algorithms
algorithms = ['Linear Regression', 'Random Forest', 'SVM', 'Neural Network']
accuracy_scores = [0.78, 0.89, 0.85, 0.92]
colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']

# Create bar plot with custom styling
bars = ax.bar(algorithms, accuracy_scores, color=colors, alpha=0.8)

# Customize the plot
ax.set_title('Model Performance Comparison', fontsize=16, fontweight='bold', pad=20)
ax.set_ylabel('Accuracy Score', fontsize=12)
ax.set_ylim(0, 1)

# Add value labels on bars
for bar, score in zip(bars, accuracy_scores):
    height = bar.get_height()
    ax.text(bar.get_x() + bar.get_width()/2., height + 0.01,
            f'{score:.2%}', ha='center', va='bottom', fontweight='bold')

# Rotate x-axis labels for better readability
plt.xticks(rotation=45, ha='right')

# Add a horizontal line for benchmark
ax.axhline(y=0.8, color='red', linestyle='--', alpha=0.7, label='Baseline (80%)')
ax.legend()

plt.tight_layout()
plt.show()
\`\`\`

## key takeaways for ml visualization

- **always start with exploratory plots** to understand your data
- use **consistent color schemes** across related visualizations
- **annotate important insights** directly on plots
- create **publication-ready figures** with proper styling

matplotlib is your gateway to understanding data patterns and communicating ml insights effectively.

*Note: These plotting examples showcase syntax highlighting. For interactive plotting in jupyter notebooks, consider using \`%matplotlib inline\` or plotly for web-based interactivity.*`
  },
  {
    id: 2,
    date: '05 Mar, 2025',
    title: "understanding neural networks from first principles",
    content: `neural networks are inspired by how our brain processes information, but they're much simpler.

## the basic building block: perceptron

a perceptron takes inputs, multiplies them by weights, adds a bias, and applies an activation function.

\`\`\`python
# Let's create a simple perceptron and test it
import math

def sigmoid(x):
    return 1 / (1 + math.exp(-x))

def perceptron(inputs, weights, bias):
    # Calculate weighted sum
    weighted_sum = sum(i * w for i, w in zip(inputs, weights)) + bias
    return sigmoid(weighted_sum)

# Test the perceptron
inputs = [0.5, 0.3, 0.8]
weights = [0.2, -0.4, 0.6]
bias = 0.1

output = perceptron(inputs, weights, bias)
print(f"Inputs: {inputs}")
print(f"Weights: {weights}")
print(f"Bias: {bias}")
print(f"Output: {output:.4f}")
\`\`\`

## key concepts

- **forward propagation**: data flows from input to output
- **backpropagation**: errors flow backwards to update weights
- **gradient descent**: optimization algorithm to minimize loss

## activation functions

- **sigmoid**: smooth, bounded between 0 and 1
- **ReLU**: simple, efficient, widely used
- **tanh**: centered around zero

the magic happens when we stack these simple units into deep networks.`
  },
  {
    id: 3,
    date: '28 Feb, 2025',
    title: "the bias-variance tradeoff",
    content: `one of the most fundamental concepts in machine learning is the bias-variance tradeoff.

## bias

**high bias** means your model makes strong assumptions about the data. it might be too simple to capture the underlying patterns.

examples:
- linear regression on non-linear data
- using too few features

## variance

**high variance** means your model is sensitive to small changes in training data. it might be overfitting.

examples:
- decision trees that are too deep
- models with too many parameters

## the sweet spot

we want to find the balance:
- **low bias** + **low variance** = good generalization
- **high bias** + **low variance** = underfitting
- **low bias** + **high variance** = overfitting

> "All models are wrong, but some are useful" - George Box`
  }
]

export default function ML() {
  return (
    <div className="page-with-toc">
      <TableOfContents posts={mlPosts} currentPage="ml" />
      <div className="main-content">
        <br />
        <h1 className="page-title">machine learning insights</h1>
        {mlPosts.map((post) => (
          <BlogPost key={`ml-${post.id}`} post={post} currentPage="ml" />
        ))}
      </div>
    </div>
  )
}