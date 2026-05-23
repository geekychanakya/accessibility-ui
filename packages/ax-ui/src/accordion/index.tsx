import {
  forwardRef,
  useEffect,
  useState,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
} from 'react';
import { createStrictContext } from '../utils/create-context';
import { useId } from '../utils/hooks';

interface AccordionContextValue {
  type: 'single' | 'multiple';
  value: string[];
  onValueChange: (value: string[]) => void;
}

const [AccordionProvider, useAccordionContext] = createStrictContext<AccordionContextValue>('AccordionContext');

interface AccordionItemContextValue {
  value: string;
  open: boolean;
  triggerId: string;
  contentId: string;
}

const [AccordionItemProvider, useAccordionItemContext] = createStrictContext<AccordionItemContextValue>('AccordionItemContext');

export interface AccordionRootProps extends HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
}

export const AccordionRoot = forwardRef<HTMLDivElement, AccordionRootProps>(
  function AccordionRoot({
    type = 'single',
    value: controlledValue,
    defaultValue = type === 'single' ? '' : [],
    onValueChange,
    collapsible = false,
    children,
    ...props
  }, ref) {
    const normalizeValue = (v: string | string[] | undefined): string[] => {
      if (v === undefined) return [];
      if (Array.isArray(v)) return v;
      return v ? [v] : [];
    };

    const [value, setValue] = useState<string[]>(normalizeValue(controlledValue ?? defaultValue));

    useEffect(() => {
      if (controlledValue !== undefined) {
        setValue(normalizeValue(controlledValue));
      }
    }, [controlledValue]);

    const handleValueChange = (newValue: string[]) => {
      if (controlledValue === undefined) {
        setValue(newValue);
      }
      if (type === 'single') {
        onValueChange?.(newValue[0] ?? '');
      } else {
        onValueChange?.(newValue);
      }
    };

    const contextValue: AccordionContextValue = {
      type,
      value,
      onValueChange: (newValue: string[]) => {
        if (type === 'single') {
          const current = value[0];
          const next = newValue[0];
          if (current === next && collapsible) {
            handleValueChange([]);
          } else {
            handleValueChange(next ? [next] : []);
          }
        } else {
          handleValueChange(newValue);
        }
      },
    };

    return (
      <AccordionProvider value={contextValue}>
        <div ref={ref} className="ax-accordion-root" {...props}>
          {children}
        </div>
      </AccordionProvider>
    );
  }
);

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  function AccordionItem({ value, children, ...props }, ref) {
    const { value: openValues } = useAccordionContext();
    const open = openValues.includes(value);
    const triggerId = useId();
    const contentId = useId();

    return (
      <AccordionItemProvider value={{ value, open, triggerId, contentId }}>
        <div
          ref={ref}
          data-state={open ? 'open' : 'closed'}
          className="ax-accordion-item"
          {...props}
        >
          {children}
        </div>
      </AccordionItemProvider>
    );
  }
);

export interface AccordionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ onClick, ...props }, ref) {
    const { value: openValues, onValueChange, type } = useAccordionContext();
    const { value, open, triggerId, contentId } = useAccordionItemContext();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;

      if (type === 'single') {
        onValueChange([open ? '' : value]);
      } else {
        if (open) {
          onValueChange(openValues.filter((v) => v !== value));
        } else {
          onValueChange([...openValues, value]);
        }
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        id={triggerId}
        role="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={handleClick}
        className="ax-accordion-trigger"
        data-state={open ? 'open' : 'closed'}
        {...props}
      />
    );
  }
);

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {}

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent({ children, ...props }, ref) {
    const { open, triggerId, contentId } = useAccordionItemContext();

    return (
      <div
        ref={ref}
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!open}
        className="ax-accordion-content"
        data-state={open ? 'open' : 'closed'}
        {...props}
      >
        {open ? children : null}
      </div>
    );
  }
);

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
};
