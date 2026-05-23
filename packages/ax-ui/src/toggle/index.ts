import {
  forwardRef,
  useCallback,
  type InputHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { useId, useControllable } from '../utils/hooks';

export interface ToggleProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onChange'> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  function Toggle({
    pressed: controlledPressed,
    defaultPressed = false,
    onPressedChange,
    disabled = false,
    onClick,
    onKeyDown,
    ...props
  }, ref) {
    const [pressed, setPressed] = useControllable(controlledPressed, defaultPressed, onPressedChange);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      (onClick as any)?.(event);
      if (!event.defaultPrevented && !disabled) {
        setPressed(!pressed);
      }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      (onKeyDown as any)?.(event);
      if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
        event.preventDefault();
        setPressed(!pressed);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={pressed}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="ax-toggle"
        data-state={pressed ? 'on' : 'off'}
        data-disabled={disabled || undefined}
        {...props}
      />
    );
  }
);

export interface SwitchProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  value?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  function Switch({
    checked: controlledChecked,
    defaultChecked = false,
    onCheckedChange,
    disabled = false,
    name,
    value = 'on',
    onClick,
    ...props
  }, ref) {
    const [checked, setChecked] = useControllable(controlledChecked, defaultChecked, onCheckedChange);
    const id = useId();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      (onClick as any)?.(event);
      if (!event.defaultPrevented && !disabled) {
        setChecked(!checked);
      }
    };

    return (
      <>
        <button
          ref={ref}
          type="button"
          role="switch"
          id={id}
          aria-checked={checked}
          aria-disabled={disabled || undefined}
          disabled={disabled}
          onClick={handleClick}
          className="ax-switch"
          data-state={checked ? 'checked' : 'unchecked'}
          data-disabled={disabled || undefined}
          {...props}
        >
          <span className="ax-switch-thumb" data-state={checked ? 'checked' : 'unchecked'} />
        </button>
        {name && (
          <input
            type="hidden"
            name={name}
            value={checked ? value : ''}
            aria-hidden
            tabIndex={-1}
          />
        )}
      </>
    );
  }
);
