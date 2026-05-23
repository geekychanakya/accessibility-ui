import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';

const visuallyHiddenStyles: CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
};

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * When true, content becomes visible (useful for focus-visible skip links).
   */
  focusable?: boolean;
}

export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  function VisuallyHidden({ focusable, style, ...props }, ref) {
    return (
      <span
        ref={ref}
        style={{
          ...visuallyHiddenStyles,
          ...(focusable && {
            position: 'static',
            width: 'auto',
            height: 'auto',
            padding: 0,
            margin: 0,
            overflow: 'visible',
            clip: 'auto',
            whiteSpace: 'normal',
          }),
          ...style,
        }}
        {...props}
      />
    );
  }
);
