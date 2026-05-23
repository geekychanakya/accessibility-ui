import {
  forwardRef,
  useRef,
  useCallback,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { createStrictContext } from '../utils/create-context';
import { useId, useControllable } from '../utils/hooks';

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  orientation: 'horizontal' | 'vertical';
  baseId: string;
}

const [TabsProvider, useTabsContext] = createStrictContext<TabsContextValue>('TabsContext');

export interface TabsRootProps extends HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

export const TabsRoot = forwardRef<HTMLDivElement, TabsRootProps>(
  function TabsRoot({ value: controlledValue, defaultValue = '', onValueChange, orientation = 'horizontal', children, ...props }, ref) {
    const [value, setValue] = useControllable(controlledValue, defaultValue, onValueChange);
    const baseId = useId();

    return (
      <TabsProvider value={{ value, onValueChange: setValue, orientation, baseId }}>
        <div ref={ref} data-orientation={orientation} className="ax-tabs-root" {...props}>
          {children}
        </div>
      </TabsProvider>
    );
  }
);

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  function TabsList({ onKeyDown, children, ...props }, ref) {
    const { orientation } = useTabsContext();
    const listRef = useRef<HTMLDivElement | null>(null);

    const combinedRef = useCallback(
      (node: HTMLDivElement | null) => {
        listRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);

      const tabs = listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])');
      if (!tabs || tabs.length === 0) return;

      const currentIndex = Array.from(tabs).indexOf(event.target as HTMLElement);
      if (currentIndex === -1) return;

      const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
      const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';

      let nextIndex: number | null = null;

      switch (event.key) {
        case nextKey:
          nextIndex = (currentIndex + 1) % tabs.length;
          break;
        case prevKey:
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    };

    return (
      <div
        ref={combinedRef}
        role="tablist"
        aria-orientation={orientation}
        onKeyDown={handleKeyDown}
        className="ax-tabs-list"
        {...props}
      >
        {children}
      </div>
    );
  }
);

export interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  function TabsTrigger({ value, onClick, ...props }, ref) {
    const { value: selectedValue, onValueChange, baseId } = useTabsContext();
    const isSelected = value === selectedValue;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) {
        onValueChange(value);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={`${baseId}-trigger-${value}`}
        aria-selected={isSelected}
        aria-controls={`${baseId}-content-${value}`}
        tabIndex={isSelected ? 0 : -1}
        onClick={handleClick}
        className="ax-tabs-trigger"
        data-state={isSelected ? 'active' : 'inactive'}
        {...props}
      />
    );
  }
);

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  function TabsContent({ value, ...props }, ref) {
    const { value: selectedValue, baseId } = useTabsContext();
    const isSelected = value === selectedValue;

    if (!isSelected) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`${baseId}-content-${value}`}
        aria-labelledby={`${baseId}-trigger-${value}`}
        tabIndex={0}
        className="ax-tabs-content"
        data-state="active"
        {...props}
      />
    );
  }
);

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
};
