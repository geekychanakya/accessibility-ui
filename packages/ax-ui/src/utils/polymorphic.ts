import {
  forwardRef,
  createElement,
  cloneElement,
  isValidElement,
  type ElementType,
  type ReactElement,
  type Ref,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';

export interface SlotProps {
  children?: ReactNode;
}

function mergeProps(slotProps: Record<string, unknown>, childProps: Record<string, unknown>) {
  const merged: Record<string, unknown> = { ...slotProps, ...childProps };

  for (const key of Object.keys(childProps)) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];

    if (key === 'style') {
      merged[key] = { ...(slotValue as object), ...(childValue as object) };
    } else if (key === 'className') {
      merged[key] = [slotValue, childValue].filter(Boolean).join(' ');
    } else if (typeof slotValue === 'function' && typeof childValue === 'function') {
      merged[key] = (...args: unknown[]) => {
        (childValue as Function)(...args);
        (slotValue as Function)(...args);
      };
    }
  }

  return merged;
}

export function Slot({ children, ...props }: SlotProps & Record<string, unknown>) {
  if (!isValidElement(children)) {
    return null;
  }

  return cloneElement(children, mergeProps(props, children.props as Record<string, unknown>));
}

export interface PolymorphicProps {
  asChild?: boolean;
}

export function createPrimitive<E extends ElementType>(defaultElement: E) {
  type Props = ComponentPropsWithoutRef<E> & PolymorphicProps & { ref?: Ref<Element> };

  const Component = forwardRef<Element, Props>(function Primitive(
    { asChild, ...props },
    ref
  ) {
    if (asChild) {
      return createElement(Slot, { ...props, ref } as any);
    }
    return createElement(defaultElement as any, { ...props, ref });
  });

  Component.displayName = `Primitive(${String(defaultElement)})`;
  return Component;
}
