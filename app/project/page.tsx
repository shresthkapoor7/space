import React from 'react'
import BlogPost from '../components/BlogPost'
import TableOfContents from '../components/TableOfContents'

const projectPosts = [
  {
    id: 1,
    date: '04 Mar, 2025',
    title: "building a personal finance tracker",
    content: `i decided to build my own personal finance tracker because existing solutions didn't fit my needs.

## tech stack

- **frontend**: next.js with typescript
- **backend**: node.js with express
- **database**: postgresql
- **auth**: nextauth.js

## key features

- transaction categorization
- budget tracking and alerts
- **visual spending analytics**
- recurring transaction detection
- export/import capabilities

## lessons learned

building this taught me the importance of:
- data modeling for financial transactions
- handling edge cases in financial calculations
- **user experience** in financial apps
- security considerations for sensitive data

the hardest part was getting the categorization algorithm right.

here's the database schema i used:

\`\`\`sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  account_id UUID REFERENCES accounts(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_category ON transactions(category);
\`\`\`

\`\`\`typescript
interface Transaction {
  id: string
  amount: number
  description: string
  category: string
  date: Date
  account: string
}

// Example usage
const transaction: Transaction = {
  id: 'txn_123',
  amount: -45.67,
  description: 'Coffee at Starbucks',
  category: 'Food & Dining',
  date: new Date(),
  account: 'checking'
}

function categorizeTransaction(transaction: Transaction): string {
  if (transaction.amount < 0) {
    return 'expense'
  } else {
    return 'income'
  }
}
\`\`\`

> "The best way to learn is to build something you'll actually use"`
  },
  {
    id: 2,
    date: '27 Feb, 2025',
    title: "lessons from my first open source contribution",
    content: `contributing to open source was intimidating at first, but incredibly rewarding.

## finding the right project

i looked for projects that:
- had good documentation
- welcomed new contributors
- **aligned with my interests**
- had active maintainers

## my contribution

i added a feature to automatically generate API documentation from type definitions.

## what i learned

- reading other people's code is a skill
- communication is as important as coding
- **tests are crucial** for maintainability
- code reviews teach you so much

## tips for first-time contributors

1. start small - fix typos, improve docs
2. read the contributing guidelines
3. ask questions in issues/discussions
4. be patient with the review process

the open source community is incredibly welcoming once you take the first step.`
  }
]

export default function Project() {
  return (
    <div className="page-with-toc">
      <TableOfContents posts={projectPosts} currentPage="project" />
      <div className="main-content">
        <br />
        <h1 className="page-title">project chronicles</h1>
        {projectPosts.map((post) => (
          <BlogPost key={`project-${post.id}`} post={post} currentPage="project" />
        ))}
      </div>
    </div>
  )
}