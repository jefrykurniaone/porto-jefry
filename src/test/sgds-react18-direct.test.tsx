import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

function SgdsDirectProbe() {
  return (
    <div>
      <sgds-button suppressHydrationWarning>Click me</sgds-button>
      <sgds-mainnav suppressHydrationWarning>
        <span slot="brand">Brand</span>
        <sgds-mainnav-item slot="end">
          Home
        </sgds-mainnav-item>
      </sgds-mainnav>
      <sgds-card suppressHydrationWarning>
        <span slot="title">Card Title</span>
        <span slot="description">Card description text</span>
        <span slot="footer">Card footer</span>
      </sgds-card>
    </div>
  )
}

describe('React 18 direct SGDS custom elements', () => {
  it('renders sgds-button without throwing', () => {
    const { container } = render(<SgdsDirectProbe />)
    const btn = container.querySelector('sgds-button')
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveTextContent('Click me')
  })

  it('renders sgds-mainnav with brand slot and mainnav-item', () => {
    const { container } = render(<SgdsDirectProbe />)
    const nav = container.querySelector('sgds-mainnav')
    expect(nav).toBeInTheDocument()
    const brandSlot = nav?.querySelector('[slot="brand"]')
    expect(brandSlot).toBeInTheDocument()
    expect(brandSlot).toHaveTextContent('Brand')
    const navItem = nav?.querySelector('sgds-mainnav-item')
    expect(navItem).toBeInTheDocument()
    expect(navItem).toHaveTextContent('Home')
  })

  it('renders sgds-card with title, description, and footer slots', () => {
    const { container } = render(<SgdsDirectProbe />)
    const card = container.querySelector('sgds-card')
    expect(card).toBeInTheDocument()
    expect(card?.querySelector('[slot="title"]')).toHaveTextContent('Card Title')
    expect(card?.querySelector('[slot="description"]')).toHaveTextContent('Card description text')
    expect(card?.querySelector('[slot="footer"]')).toHaveTextContent('Card footer')
  })

  it('bubbles click events from host wrapper around sgds-button', async () => {
    const user = userEvent.setup()
    let clicked = false
    const { container } = render(
      <div onClick={() => { clicked = true }}>
        <sgds-button suppressHydrationWarning>Test</sgds-button>
      </div>
    )
    const btn = container.querySelector('sgds-button')!
    await user.click(btn)
    expect(clicked).toBe(true)
  })
})
