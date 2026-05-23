import {
  forwardRef,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type MouseEvent,
} from 'react';
import { createStrictContext } from '../utils/create-context';
import { useFocusTrap } from '../utils/focus';
import { useId, useControllable } from '../utils/hooks';
import { type PolymorphicProps, Slot } from '../utils/polymorphic';

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentId: string;
  titleId: string;
  descriptionId: string;
}

const [DialogProvider, useDialogContext] = createStrictContext<DialogContextValue>('DialogContext');

export interface DialogRootProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DialogRoot({ children, open: controlledOpen, defaultOpen = false, onOpenChange }: DialogRootProps) {
  const [open, setOpen] = useControllable(controlledOpen, defaultOpen, onOpenChange);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentId = useId();
  const titleId = useId();
  const descriptionId = useId();

  return (
    <DialogProvider
      value={{ open, onOpenChange: setOpen, triggerRef, contentId, titleId, descriptionId }}
    >
      {children}
    </DialogProvider>
  );
}

export interface DialogTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement>, PolymorphicProps {}

export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  function DialogTrigger({ asChild, onClick, ...props }, ref) {
    const { onOpenChange, triggerRef, contentId } = useDialogContext();

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) {
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
      'aria-haspopup': 'dialog' as const,
      'aria-expanded': undefined,
      'aria-controls': contentId,
      onClick: handleClick,
      ...props,
    };

    if (asChild) {
      return <Slot {...triggerProps}>{props.children}</Slot>;
    }

    return <button type="button" {...triggerProps} />;
  }
);

export interface DialogContentProps extends HTMLAttributes<HTMLDialogElement> {
  /**
   * Called when the user presses Escape or clicks the backdrop.
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
}

export const DialogContent = forwardRef<HTMLDialogElement, DialogContentProps>(
  function DialogContent({ onEscapeKeyDown, children, ...props }, ref) {
    const { open, onOpenChange, contentId, titleId, descriptionId } = useDialogContext();
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const focusTrapRef = useFocusTrap(open);

    const combinedRef = useCallback(
      (node: HTMLDialogElement | null) => {
        dialogRef.current = node;
        (focusTrapRef as React.MutableRefObject<HTMLElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref, focusTrapRef]
    );

    useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      if (open) {
        if (!dialog.open) {
          dialog.showModal();
        }
      } else {
        if (dialog.open) {
          dialog.close();
        }
      }
    }, [open]);

    useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      function handleCancel(event: Event) {
        event.preventDefault();
        onOpenChange(false);
      }

      function handleKeyDown(event: Event) {
        if ((event as KeyboardEvent).key === 'Escape') {
          onEscapeKeyDown?.(event as KeyboardEvent);
          if (!(event as KeyboardEvent).defaultPrevented) {
            onOpenChange(false);
          }
        }
      }

      dialog.addEventListener('cancel', handleCancel);
      dialog.addEventListener('keydown', handleKeyDown);
      return () => {
        dialog.removeEventListener('cancel', handleCancel);
        dialog.removeEventListener('keydown', handleKeyDown);
      };
    }, [onOpenChange, onEscapeKeyDown]);

    const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
      if (event.target === dialogRef.current) {
        onOpenChange(false);
      }
    };

    return (
      <dialog
        ref={combinedRef}
        id={contentId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClick={handleBackdropClick}
        className="ax-dialog-content"
        {...props}
      >
        {open ? children : null}
      </dialog>
    );
  }
);

export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  function DialogTitle(props, ref) {
    const { titleId } = useDialogContext();
    return <h2 ref={ref} id={titleId} className="ax-dialog-title" {...props} />;
  }
);

export interface DialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  function DialogDescription(props, ref) {
    const { descriptionId } = useDialogContext();
    return <p ref={ref} id={descriptionId} className="ax-dialog-description" {...props} />;
  }
);

export interface DialogCloseProps extends ButtonHTMLAttributes<HTMLButtonElement>, PolymorphicProps {}

export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  function DialogClose({ asChild, onClick, ...props }, ref) {
    const { onOpenChange } = useDialogContext();

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

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};
