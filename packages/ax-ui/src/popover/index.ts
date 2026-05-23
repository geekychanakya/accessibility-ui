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
} from 'react';
import { createStrictContext } from '../utils/create-context';
import { useId, useControllable } from '../utils/hooks';
import { type PolymorphicProps, Slot } from '../utils/polymorphic';

interface PopoverContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentId: string;
  contentRef: React.RefObject<HTMLElement | null>;
}

const [PopoverProvider, usePopoverContext] = createStrictContext<PopoverContextValue>('PopoverContext');

export interface PopoverRootProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function PopoverRoot({ children, open: controlledOpen, defaultOpen = false, onOpenChange }: PopoverRootProps) {
  const [open, setOpen] = useControllable(controlledOpen, defaultOpen, onOpenChange);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const contentId = useId();

  return (
    <PopoverProvider value={{ open, onOpenChange: setOpen, triggerRef, contentId, contentRef }}>
      {children}
    </PopoverProvider>
  );
}

export interface PopoverTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement>, PolymorphicProps {}

export const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  function PopoverTrigger({ asChild, onClick, ...props }, ref) {
    const { open, onOpenChange, triggerRef, contentId } = usePopoverContext();

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) {
        onOpenChange(!open);
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
      'aria-controls': open ? contentId : undefined,
      'aria-haspopup': 'dialog' as const,
      onClick: handleClick,
      ...props,
    };

    if (asChild) {
      return <Slot {...triggerProps}>{props.children}</Slot>;
    }

    return <button type="button" {...triggerProps} />;
  }
);

export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {}

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent({ children, ...props }, ref) {
    const { open, onOpenChange, contentId, triggerRef, contentRef } = usePopoverContext();

    const combinedRef = useCallback(
      (node: HTMLDivElement | null) => {
        (contentRef as React.MutableRefObject<HTMLElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref, contentRef]
    );

    useEffect(() => {
      if (!open) return;

      function handleKeyDown(event: KeyboardEvent) {
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

    return (
      <div
        ref={combinedRef}
        id={contentId}
        role="dialog"
        aria-modal="false"
        className="ax-popover-content"
        {...props}
      >
        {children}
      </div>
    );
  }
);

export interface PopoverCloseProps extends ButtonHTMLAttributes<HTMLButtonElement>, PolymorphicProps {}

export const PopoverClose = forwardRef<HTMLButtonElement, PopoverCloseProps>(
  function PopoverClose({ asChild, onClick, ...props }, ref) {
    const { onOpenChange } = usePopoverContext();

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) {
        onOpenChange(false);
      }
    };

    const closeProps = { ref, onClick: handleClick, ...props };

    if (asChild) {
      return <Slot {...closeProps}>{props.children}</Slot>;
    }

    return <button type="button" {...closeProps} />;
  }
);

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: PopoverClose,
};
