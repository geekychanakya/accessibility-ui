import { useCallback, useRef, useState } from 'react';

export function useControllable<T>(
  controlledValue: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
): [T, (value: T) => void] {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : internalValue;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  return [value, setValue];
}

let idCounter = 0;
export function useId(providedId?: string): string {
  const ref = useRef<string | null>(null);
  if (ref.current === null) {
    ref.current = providedId ?? `ax-${++idCounter}`;
  }
  return providedId ?? ref.current;
}
