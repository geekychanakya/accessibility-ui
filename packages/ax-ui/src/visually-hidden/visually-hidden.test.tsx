import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { VisuallyHidden } from './index';

expect.extend(toHaveNoViolations);

describe('VisuallyHidden', () => {
  it('renders children', () => {
    const { container } = render(<VisuallyHidden>Hidden text</VisuallyHidden>);
    expect(container.textContent).toBe('Hidden text');
  });

  it('applies visually hidden styles', () => {
    const { container } = render(<VisuallyHidden>Hidden</VisuallyHidden>);
    const span = container.firstElementChild as HTMLElement;
    expect(span.style.position).toBe('absolute');
    expect(span.style.width).toBe('1px');
    expect(span.style.height).toBe('1px');
    expect(span.style.overflow).toBe('hidden');
  });

  it('is not visually visible but is in the DOM', () => {
    const { container } = render(<VisuallyHidden>Screen reader text</VisuallyHidden>);
    expect(container.textContent).toBe('Screen reader text');
  });

  it('passes axe accessibility check', async () => {
    const { container } = render(
      <div>
        <button>
          <VisuallyHidden>Click me</VisuallyHidden>
          Icon
        </button>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
