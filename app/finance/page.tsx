import React from 'react'
import BlogPost from '../components/BlogPost'
import TableOfContents from '../components/TableOfContents'

const financePosts = [
  {
    id: 1,
    date: '03 Mar, 2025',
    title: "compound interest: the eighth wonder of the world",
    content: `Einstein allegedly called compound interest "the eighth wonder of the world" and "the most powerful force in the universe."

## the power of time

starting early makes an enormous difference. consider two investors:

- **Alice** invests $200/month starting at age 25
- **Bob** invests $400/month starting at age 35

assuming 7% annual returns, Alice will have more money at retirement despite investing less total money.

## the formula

\`A = P(1 + r/n)^(nt)\`

where:
- A = final amount
- P = principal
- r = annual interest rate
- n = number of times compounded per year
- t = time in years

\`\`\`python
def compound_interest(principal, rate, compounds_per_year, years):
    """Calculate compound interest"""
    return principal * (1 + rate/compounds_per_year) ** (compounds_per_year * years)

# Compare Alice vs Bob scenario
alice_monthly = 200
bob_monthly = 400
annual_rate = 0.07
years_alice = 40  # Starting at 25, retiring at 65
years_bob = 30    # Starting at 35, retiring at 65

# Calculate total investments
alice_total_invested = alice_monthly * 12 * years_alice
bob_total_invested = bob_monthly * 12 * years_bob

# For simplicity, let's calculate as if they invested lump sums
# (In reality, monthly contributions would use annuity formulas)
alice_principal = alice_total_invested
bob_principal = bob_total_invested

alice_final = compound_interest(alice_principal, annual_rate, 1, years_alice)
bob_final = compound_interest(bob_principal, annual_rate, 1, years_bob)

print(f"Alice: Invests \${alice_monthly}/month for {years_alice} years")
print(f"Total invested: \${alice_total_invested:,}")
print(f"Final amount: \${alice_final:,.2f}")
print()
print(f"Bob: Invests \${bob_monthly}/month for {years_bob} years")
print(f"Total invested: \${bob_total_invested:,}")
print(f"Final amount: \${bob_final:,.2f}")
print()
print(f"Alice has \${alice_final - bob_final:,.2f} more despite investing \${bob_total_invested - alice_total_invested:,} less!")
\`\`\`

> "Compound interest is the most powerful force in the universe" - Attributed to Einstein`
  },
  {
    id: 2,
    date: '01 Mar, 2025',
    title: "understanding risk and diversification",
    content: `risk isn't just about losing money - it's about **uncertainty** and **volatility**.

## types of risk

1. **market risk** - overall market movements
2. **company risk** - specific to individual companies
3. **inflation risk** - purchasing power erosion
4. **liquidity risk** - difficulty selling investments

## diversification strategies

- spread investments across asset classes
- geographic diversification
- **time diversification** through dollar-cost averaging
- sector diversification

remember: diversification is the only free lunch in investing.`
  },
  {
    id: 3,
    date: '03 Mar, 2025',
    title: "compound interest: the eighth wonder of the world",
    content: `Einstein allegedly called compound interest "the eighth wonder of the world" and "the most powerful force in the universe."

## the power of time

starting early makes an enormous difference. consider two investors:

- **Alice** invests $200/month starting at age 25
- **Bob** invests $400/month starting at age 35

assuming 7% annual returns, Alice will have more money at retirement despite investing less total money.

## the formula

\`A = P(1 + r/n)^(nt)\`

where:
- A = final amount
- P = principal
- r = annual interest rate
- n = number of times compounded per year
- t = time in years

\`\`\`python
def compound_interest(principal, rate, compounds_per_year, years):
    """Calculate compound interest"""
    return principal * (1 + rate/compounds_per_year) ** (compounds_per_year * years)

# Compare Alice vs Bob scenario
alice_monthly = 200
bob_monthly = 400
annual_rate = 0.07
years_alice = 40  # Starting at 25, retiring at 65
years_bob = 30    # Starting at 35, retiring at 65

# Calculate total investments
alice_total_invested = alice_monthly * 12 * years_alice
bob_total_invested = bob_monthly * 12 * years_bob

# For simplicity, let's calculate as if they invested lump sums
# (In reality, monthly contributions would use annuity formulas)
alice_principal = alice_total_invested
bob_principal = bob_total_invested

alice_final = compound_interest(alice_principal, annual_rate, 1, years_alice)
bob_final = compound_interest(bob_principal, annual_rate, 1, years_bob)

print(f"Alice: Invests \${alice_monthly}/month for {years_alice} years")
print(f"Total invested: \${alice_total_invested:,}")
print(f"Final amount: \${alice_final:,.2f}")
print()
print(f"Bob: Invests \${bob_monthly}/month for {years_bob} years")
print(f"Total invested: \${bob_total_invested:,}")
print(f"Final amount: \${bob_final:,.2f}")
print()
print(f"Alice has \${alice_final - bob_final:,.2f} more despite investing \${bob_total_invested - alice_total_invested:,} less!")
\`\`\`

> "Compound interest is the most powerful force in the universe" - Attributed to Einstein`
  },
]

export default function Finance() {
  return (
    <div className="page-with-toc">
      <TableOfContents posts={financePosts} currentPage="finance" />
      <div className="main-content">
        <br />
        <h1 className="page-title">financial thoughts</h1>
        {financePosts.map((post) => (
          <BlogPost key={`finance-${post.id}`} post={post} currentPage="finance" />
        ))}
      </div>
    </div>
  )
}