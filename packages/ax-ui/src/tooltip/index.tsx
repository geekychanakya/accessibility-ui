import {
  forwardRef,
  useRef,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
  type HTMLAttributes,
  type MouseEvent,
} from 'react';
import { createStrictContext } from '../utils/create-context';
import { useId } from '../utils/hooks';
import { type PolymorphicProps, Slot } from '../utils/polymorphic';

interface TooltipContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentId: string;
}

const [TooltipProvider, useTooltipContext] = createStrictContext<TooltipContextValue>('TooltipContext');

export interface TooltipRootProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayMs?: number;
}

export function TooltipRoot({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  delayMs = 700,
}: TooltipRootProps) {
  const [open, setOpenState] = useState(controlledOpen ?? defaultOpen);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentId = useId();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const isControlled = controlledOpen !== undefined;
  const actualOpen = isControlled ? controlledOpen : open;

  const setOpen = useCallback(
    (value: boolean) => {
      clearTimeout(timeoutRef.current);
      if (!isControlled) setOpenState(value);
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange]
  );

  const handleOpenChange = useCallback(
    (value: boolean) => {
      if (value) {
        timeoutRef.current = setTimeout(() => setOpen(true), delayMs);
      } else {
        setOpen(false);
      }
    },
    [delayMs, setOpen]
  );

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <TooltipProvider value={{ open: actualOpen, onOpenChange: handleOpenChange, triggerRef, contentId }}>
      {children}
    </TooltipProvider>
  );
}

export interface TooltipTriggerProps extends HTMLAttributes<HTMLElement>, PolymorphicProps {}

export const TooltipTrigger = forwardRef<HTMLElement, TooltipTriggerProps>(
  function TooltipTrigger({ asChild, onMouseEnter, onMouseLeave, onFocus, onBlur, ...props }, ref) {
    const { open, onOpenChange, triggerRef, contentId } = useTooltipContext();

    const combinedRef = useCallback(
      (node: HTMLElement | null) => {
        (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref, triggerRef]
    );

    const triggerProps = {
      ref: combinedRef,
      'aria-describedby': open ? contentId : undefined,
      onMouseEnter: (e: MouseEvent<HTMLElement>) => {
        (onMouseEnter as any)?.(e);
        onOpenChange(true);
      },
      onMouseLeave: (e: MouseEvent<HTMLElement>) => {
        (onMouseLeave as any)?.(e);
        onOpenChange(false);
      },
      onFocus: (e: React.FocusEvent<HTMLElement>) => {
        (onFocus as any)?.(e);
        onOpenChange(true);
      },
      onBlur: (e: React.FocusEvent<HTMLElement>) => {
        (onBlur as any)?.(e);
        onOpenChange(false);
      },
      ...props,
    };

    if (asChild) {
      return <Slot {...triggerProps}>{props.children}</Slot>;
    }

    return <span tabIndex={0} {...triggerProps} />;
  }
);

export interface TooltipContentProps extends HTMLAttributes<HTMLDivElement> {}

export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  function TooltipContent(props, ref) {
    const { open, contentId } = useTooltipContext();

    if (!open) return null;

    return (
      <div
        ref={ref}
        id={contentId}
        role="tooltip"
        className="ax-tooltip-content"
        {...props}
      />
    );
  }
);

export const Tooltip = {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
};
