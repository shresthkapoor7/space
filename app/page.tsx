import React from 'react'
import BlogPost from './components/BlogPost'
import TableOfContents from './components/TableOfContents'

const dummyPosts = [
  {
    id: 1,
    date: '19 Jul, 2025',
    title: "Σpace - notepad on steroids",
    content: `not sure why i started this, the idea was to clear out some concepts that i am weak at.
with this project i can basically sharpen 3 things, python, maths and next.js.


here is my reason to do it exactly – i cannot write python, people say it has the easiest syntax,
i beg to differ c++ has the easiest one, python is so confusing to me, brackets are the most perfectly designed things after cars and video games. the whole idea to ditch that concept to have spaces is revolting to me. think about it i can barely see a computer screen how do i notice this    i put 4 spaces ~ 1 tab. it might be visible here but in code it is sort of hard. and there is no restrictions on things you can do on list like have atleast some basic ones right?!

anyway i figured i should atleast be able to write basic code in python. and should be able to manipulate data and visualize it with pandas and numpy and matplotlib that feels sorta basic.

<div style="display: flex; justify-content: center; margin-top: 1rem;">
  <img
    src="/images/1.jpg"
    alt="nerd"
    style="width: 400px;"
  />
</div>

**maths** – i am not bad at math but i did see a lot of limitations/knowledge gaps when i was studying ai, so i figured why not now.
\n
**next.js** – not gonna lie i do not like it that much especially with tailwind looks yuck, like when angela yu said spaghetti code i am sure she was talking about next with tailwind but industry is moving towards it so why not. next feels like a failed attempt on creating a flutter copy. no matter how many stacks i switch flutter would always be <3

also a little break once in a while from [strands](https://www.strandschat.com/) can be important for my hair routine

i also like documenting stuff and am a nerd (ps this my 3rd attempt at doing this).

<div style="display: flex; justify-content: center; margin-top: 1rem;">
  <img
    src="https://i.pinimg.com/originals/51/0b/c9/510bc947c8b18d99f0409270c7f535b0.gif"
    alt="nerd"
    style="width: 400px;"
  />
</div>

> *anyway lets start music + math is fire*

`
  },
  {
    id: 2,
    date: '19 Jul, 2025',
    title: "interesting features of the website",
    content: ` you can write markdown in the blog posts and it will be rendered as html. you can write tooltips <mark data-tooltip="I am a tooltip">tooltip</mark>.

you can write code in the blog posts and it will be rendered as well you can run it in the browser.

\`\`\`python
print("hello world")
\`\`\`



you can make tables in the blog posts.

| Name | Age | City |
|------|-----|------|
| shresth | 23  | delisted |



`
  }
]

export default function Home() {
  return (
    <div className="page-with-toc">
      <TableOfContents posts={dummyPosts} currentPage="home" />
      <div className="main-content">
        <br />
        <h1 className="page-title">welcome to Σpace</h1>
        {dummyPosts.map((post) => (
          <BlogPost key={`home-${post.id}`} post={post} currentPage="home" />
        ))}
      </div>
    </div>
  )
}