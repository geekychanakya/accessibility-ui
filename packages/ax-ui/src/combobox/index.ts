import {
  forwardRef,
  useRef,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react';
import { createStrictContext } from '../utils/create-context';
import { useId, useControllable } from '../utils/hooks';

interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface ComboboxContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  selectedValue: string;
  onSelect: (value: string) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  options: ComboboxOption[];
  registerOption: (option: ComboboxOption) => void;
  unregisterOption: (value: string) => void;
  listboxId: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  listRef: React.RefObject<HTMLElement | null>;
}

const [ComboboxProvider, useComboboxContext] = createStrictContext<ComboboxContextValue>('ComboboxContext');

export interface ComboboxRootProps {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  inputValue?: string;
  onInputValueChange?: (value: string) => void;
}

export function ComboboxRoot({
  children,
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  open: controlledOpen,
  onOpenChange,
  inputValue: controlledInput,
  onInputValueChange,
}: ComboboxRootProps) {
  const [selectedValue, setSelectedValue] = useControllable(controlledValue, defaultValue, onValueChange);
  const [open, setOpen] = useControllable(controlledOpen, false, onOpenChange);
  const [inputValue, setInputValue] = useState(controlledInput ?? '');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [options, setOptions] = useState<ComboboxOption[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLElement | null>(null);
  const listboxId = useId();

  useEffect(() => {
    if (controlledInput !== undefined) {
      setInputValue(controlledInput);
    }
  }, [controlledInput]);

  const onInputChange = useCallback(
    (value: string) => {
      setInputValue(value);
      onInputValueChange?.(value);
      if (!open) setOpen(true);
      setActiveIndex(-1);
    },
    [open, setOpen, onInputValueChange]
  );

  const onSelect = useCallback(
    (value: string) => {
      setSelectedValue(value);
      const option = options.find((o) => o.value === value);
      if (option) {
        setInputValue(option.label);
        onInputValueChange?.(option.label);
      }
      setOpen(false);
      setActiveIndex(-1);
      inputRef.current?.focus();
    },
    [options, setSelectedValue, setOpen, onInputValueChange]
  );

  const registerOption = useCallback((option: ComboboxOption) => {
    setOptions((prev) => {
      if (prev.find((o) => o.value === option.value)) return prev;
      return [...prev, option];
    });
  }, []);

  const unregisterOption = useCallback((value: string) => {
    setOptions((prev) => prev.filter((o) => o.value !== value));
  }, []);

  return (
    <ComboboxProvider
      value={{
        open,
        onOpenChange: setOpen,
        inputValue,
        onInputChange,
        selectedValue,
        onSelect,
        activeIndex,
        setActiveIndex,
        options,
        registerOption,
        unregisterOption,
        listboxId,
        inputRef,
        listRef,
      }}
    >
      {children}
    </ComboboxProvider>
  );
}

export interface ComboboxInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {}

export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  function ComboboxInput({ onKeyDown, onFocus, onBlur, ...props }, ref) {
    const {
      open,
      onOpenChange,
      inputValue,
      onInputChange,
      activeIndex,
      setActiveIndex,
      options,
      onSelect,
      listboxId,
      inputRef,
    } = useComboboxContext();

    const combinedRef = useCallback(
      (node: HTMLInputElement | null) => {
        (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref, inputRef]
    );

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);

      const enabledOptions = options.filter((o) => !o.disabled);

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          if (!open) {
            onOpenChange(true);
          } else {
            const next = activeIndex < enabledOptions.length - 1 ? activeIndex + 1 : 0;
            setActiveIndex(next);
          }
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          if (open) {
            const prev = activeIndex > 0 ? activeIndex - 1 : enabledOptions.length - 1;
            setActiveIndex(prev);
          }
          break;
        }
        case 'Enter': {
          event.preventDefault();
          if (open && activeIndex >= 0 && enabledOptions[activeIndex]) {
            onSelect(enabledOptions[activeIndex].value);
          }
          break;
        }
        case 'Escape': {
          if (open) {
            event.preventDefault();
            onOpenChange(false);
            setActiveIndex(-1);
          }
          break;
        }
        case 'Home': {
          if (open) {
            event.preventDefault();
            setActiveIndex(0);
          }
          break;
        }
        case 'End': {
          if (open) {
            event.preventDefault();
            setActiveIndex(enabledOptions.length - 1);
          }
          break;
        }
      }
    };

    const activeOption = options.filter((o) => !o.disabled)[activeIndex];

    return (
      <input
        ref={combinedRef}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={activeOption ? `${listboxId}-option-${activeOption.value}` : undefined}
        autoComplete="off"
        value={inputValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={(e) => {
          onFocus?.(e);
          onOpenChange(true);
        }}
        onBlur={(e) => {
          onBlur?.(e);
          setTimeout(() => onOpenChange(false), 200);
        }}
        className="ax-combobox-input"
        {...props}
      />
    );
  }
);

export interface ComboboxListProps extends HTMLAttributes<HTMLUListElement> {}

export const ComboboxList = forwardRef<HTMLUListElement, ComboboxListProps>(
  function ComboboxList({ children, ...props }, ref) {
    const { open, listboxId, listRef } = useComboboxContext();

    const combinedRef = useCallback(
      (node: HTMLUListElement | null) => {
        (listRef as React.MutableRefObject<HTMLElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref, listRef]
    );

    if (!open) return null;

    return (
      <ul
        ref={combinedRef}
        id={listboxId}
        role="listbox"
        className="ax-combobox-list"
        {...props}
      >
        {children}
      </ul>
    );
  }
);

export interface ComboboxOptionProps extends HTMLAttributes<HTMLLIElement> {
  value: string;
  label?: string;
  disabled?: boolean;
}

export const ComboboxOption = forwardRef<HTMLLIElement, ComboboxOptionProps>(
  function ComboboxOption({ value, label, disabled = false, children, onClick, ...props }, ref) {
    const {
      selectedValue,
      onSelect,
      activeIndex,
      options,
      registerOption,
      unregisterOption,
      listboxId,
    } = useComboboxContext();

    const displayLabel = label ?? (typeof children === 'string' ? children : value);

    useEffect(() => {
      registerOption({ value, label: displayLabel, disabled });
      return () => unregisterOption(value);
    }, [value, displayLabel, disabled, registerOption, unregisterOption]);

    const enabledOptions = options.filter((o) => !o.disabled);
    const index = enabledOptions.findIndex((o) => o.value === value);
    const isActive = index === activeIndex;
    const isSelected = value === selectedValue;

    return (
      <li
        ref={ref}
        id={`${listboxId}-option-${value}`}
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled || undefined}
        data-active={isActive || undefined}
        data-disabled={disabled || undefined}
        onClick={(e) => {
          onClick?.(e);
          if (!disabled) onSelect(value);
        }}
        className="ax-combobox-option"
        {...props}
      >
        {children ?? displayLabel}
      </li>
    );
  }
);

export const Combobox = {
  Root: ComboboxRoot,
  Input: ComboboxInput,
  List: ComboboxList,
  Option: ComboboxOption,
};
