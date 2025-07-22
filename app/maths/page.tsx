import React from 'react'
import BlogPost from '../components/BlogPost'
import TableOfContents from '../components/TableOfContents'

const mathsPosts = [
{
  id: 1,
  date: '22 Jul, 2025',
  title: "revisiting linear-algebra",
  content: `
  vector - it's like an arrow pointing, with the tail sitting at the origin.

how they look →
$begin:math:display$
\\begin{bmatrix} x \\\\ y \\\\ z \\end{bmatrix}
$end:math:display$
coordinate system tells you how far to move along the x, y, and z axes.

**vector addition** - move the tail of one vector to the tip of another.
then draw a line from the tail of the first to the tip of the second - that’s the sum. basic stuff, pff.

\`\`\`python
# update
\`\`\`

**multiply by scalar / scaling** - stretches or shrinks the vector by a constant factor.


some fancy lingo: **span** - the set of all linear combinations
$begin:math:display$
a \\vec{v} + b \\vec{w}
$end:math:display$
so span is like: where can we go using those vectors?


**redundant vector / linearly dependent** - if one vector is just a scaled version of another.
This restricts the span.
in 2D, it would only give you a **line** instead of covering the whole **plane**.


**basis** - the holy origin for vectors.
Usually $begin:math:text$\\hat{i}$end:math:text$ and $begin:math:text$\\hat{j}$end:math:text$, the unit vectors in x and y direction.



### linear transformations

think of them as functions:
they take in a vector and spit out another vector.

suppose you have a vector:
$begin:math:display$
\\vec{v} = \\begin{bmatrix} -1 \\\\ 2 \\end{bmatrix}
$end:math:display$
and you wish to transform it.

but instead of transforming $begin:math:text$\\vec{v}$end:math:text$ directly,
you transform the **basis vectors** $begin:math:text$\\hat{i}$end:math:text$ and $begin:math:text$\\hat{j}$end:math:text$.

**example:**
imagine you want to rotate a vector by **90°**.
instead of rotating the vector, you rotate the **entire base** by 90°.

like the harry potter stairs...
you don't move - you're pointing the same way - but the **stair rotates** beneath you, and now you're pointing somewhere else.

<div style="display: flex; justify-content: center; margin-top: 1rem;">
  <img
    src="https://i.pinimg.com/originals/72/45/9b/72459bc263d46ae4b4c6a3749474ef46.gif"
    alt="nerd"
    style="width: 400px;"
  />
</div>


mathematically, what you're doing is multiplying the vector by a **transformation matrix** - built from the rotated basis vectors. for a 90° counterclockwise rotation, the matrix is:

$begin:math:display$
R_{90°} = \\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix}
$end:math:display$

then:

$begin:math:display$
\\vec{v}_{\\text{rotated}} = R_{90°} \\cdot \\vec{v} = \\begin{bmatrix} 0 & -1 \\\\ 1 & 0 \\end{bmatrix} \\cdot \\begin{bmatrix} x \\\\ y \\end{bmatrix}
$end:math:display$

which gives you the rotated vector.
  `
}
]

export default function Maths() {
  return (
    <div className="page-with-toc">
      <TableOfContents posts={mathsPosts} currentPage="maths" />
      <div className="main-content">
        <br />
        <h1 className="page-title">mathematical chaos</h1>
        <div style={{display: "flex", justifyContent: "center"}}>
          <img
            src="https://img.devrant.com/devrant/rant/r_2293403_nbLGe.jpg"
            alt="nerd"
            style={{width: "375px", padding: "1rem"}}
          />
        </div>
        <br />
        {mathsPosts.map((post) => (
          <BlogPost key={`maths-${post.id}`} post={post} currentPage="maths" />
        ))}
      </div>
    </div>
  )
}