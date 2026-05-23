import {
  forwardRef,
  useRef,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type KeyboardEvent,
} from 'react';
import { createStrictContext } from '../utils/create-context';
import { useId, useControllable } from '../utils/hooks';
import { getFocusableElements } from '../utils/focus';
import { type PolymorphicProps, Slot } from '../utils/polymorphic';

interface MenuContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLElement | null>;
  contentId: string;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const [MenuProvider, useMenuContext] = createStrictContext<MenuContextValue>('MenuContext');

export interface MenuRootProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MenuRoot({ children, open: controlledOpen, defaultOpen = false, onOpenChange }: MenuRootProps) {
  const [open, setOpen] = useControllable(controlledOpen, defaultOpen, onOpenChange);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const contentId = useId();
  const [activeIndex, setActiveIndex] = useState(-1);

  return (
    <MenuProvider
      value={{ open, onOpenChange: setOpen, triggerRef, contentRef, contentId, activeIndex, setActiveIndex }}
    >
      {children}
    </MenuProvider>
  );
}

export interface MenuTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement>, PolymorphicProps {}

export const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(
  function MenuTrigger({ asChild, onClick, onKeyDown, ...props }, ref) {
    const { open, onOpenChange, triggerRef, contentId } = useMenuContext();

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) {
        onOpenChange(!open);
      }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onOpenChange(true);
      }
    };

    const combinedRef = useCallback(
      (node: HTMLButtonElement | null) => {
        (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref, triggerRef]
    );

    const triggerProps = {
      ref: combinedRef,
      'aria-expanded': open,
      'aria-haspopup': 'menu' as const,
      'aria-controls': open ? contentId : undefined,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      ...props,
    };

    if (asChild) {
      return <Slot {...triggerProps}>{props.children}</Slot>;
    }

    return <button type="button" {...triggerProps} />;
  }
);

export interface MenuContentProps extends HTMLAttributes<HTMLDivElement> {}

export const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(
  function MenuContent({ children, ...props }, ref) {
    const { open, onOpenChange, contentId, contentRef, triggerRef, activeIndex, setActiveIndex } = useMenuContext();

    const combinedRef = useCallback(
      (node: HTMLDivElement | null) => {
        (contentRef as React.MutableRefObject<HTMLElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref, contentRef]
    );

    useEffect(() => {
      if (!open || !contentRef.current) return;

      const items = contentRef.current.querySelectorAll<HTMLElement>('[role="menuitem"]');
      if (items.length > 0) {
        items[0].focus();
        setActiveIndex(0);
      }
    }, [open, contentRef, setActiveIndex]);

    useEffect(() => {
      if (!open) return;

      function handleKeyDown(event: globalThis.KeyboardEvent) {
        if (event.key === 'Escape') {
          onOpenChange(false);
          triggerRef.current?.focus();
        }
      }

      function handleClickOutside(event: Event) {
        const target = event.target as Node;
        if (
          contentRef.current &&
          !contentRef.current.contains(target) &&
          triggerRef.current &&
          !triggerRef.current.contains(target)
        ) {
          onOpenChange(false);
        }
      }

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('pointerdown', handleClickOutside);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('pointerdown', handleClickOutside);
      };
    }, [open, onOpenChange, triggerRef, contentRef]);

    if (!open) return null;

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      const items = contentRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
      if (!items || items.length === 0) return;

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          const next = (activeIndex + 1) % items.length;
          items[next].focus();
          setActiveIndex(next);
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          const prev = (activeIndex - 1 + items.length) % items.length;
          items[prev].focus();
          setActiveIndex(prev);
          break;
        }
        case 'Home': {
          event.preventDefault();
          items[0].focus();
          setActiveIndex(0);
          break;
        }
        case 'End': {
          event.preventDefault();
          items[items.length - 1].focus();
          setActiveIndex(items.length - 1);
          break;
        }
        case 'Tab': {
          event.preventDefault();
          onOpenChange(false);
          triggerRef.current?.focus();
          break;
        }
      }
    };

    return (
      <div
        ref={combinedRef}
        id={contentId}
        role="menu"
        aria-orientation="vertical"
        onKeyDown={handleKeyDown}
        className="ax-menu-content"
        {...props}
      >
        {children}
      </div>
    );
  }
);

export interface MenuItemProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  onSelect?: () => void;
}

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  function MenuItem({ disabled = false, onSelect, onClick, onKeyDown, ...props }, ref) {
    const { onOpenChange, triggerRef } = useMenuContext();

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
      onClick?.(event);
      if (!disabled && !event.defaultPrevented) {
        onSelect?.();
        onOpenChange(false);
        triggerRef.current?.focus();
      }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
        event.preventDefault();
        onSelect?.();
        onOpenChange(false);
        triggerRef.current?.focus();
      }
    };

    return (
      <div
        ref={ref}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="ax-menu-item"
        data-disabled={disabled || undefined}
        {...props}
      />
    );
  }
);

export interface MenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

export const MenuSeparator = forwardRef<HTMLDivElement, MenuSeparatorProps>(
  function MenuSeparator(props, ref) {
    return <div ref={ref} role="separator" className="ax-menu-separator" {...props} />;
  }
);

export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
  Separator: MenuSeparator,
};
