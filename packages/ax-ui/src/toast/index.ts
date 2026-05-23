import {
  forwardRef,
  useRef,
  useEffect,
  useCallback,
  useState,
  type ReactNode,
  type HTMLAttributes,
} from 'react';
import { createStrictContext } from '../utils/create-context';
import { useId } from '../utils/hooks';

interface ToastContextValue {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => string;
  removeToast: (id: string) => void;
}

interface ToastData {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
  type?: 'foreground' | 'background';
}

const [ToastProviderCtx, useToastContext] = createStrictContext<ToastContextValue>('ToastContext');

export { useToastContext as useToast };

export interface ToastProviderProps {
  children: ReactNode;
  duration?: number;
}

export function ToastProvider({ children, duration = 5000 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback(
    (toast: Omit<ToastData, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { ...toast, id, duration: toast.duration ?? duration }]);
      return id;
    },
    [duration]
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastProviderCtx value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastProviderCtx>
  );
}

export interface ToastViewportProps extends HTMLAttributes<HTMLOListElement> {
  label?: string;
}

export const ToastViewport = forwardRef<HTMLOListElement, ToastViewportProps>(
  function ToastViewport({ label = 'Notifications', children, ...props }, ref) {
    const { toasts, removeToast } = useToastContext();

    return (
      <ol
        ref={ref}
        role="region"
        aria-label={label}
        aria-live="polite"
        aria-relevant="additions"
        tabIndex={-1}
        className="ax-toast-viewport"
        {...props}
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
        ))}
        {children}
      </ol>
    );
  }
);

interface ToastItemProps {
  toast: ToastData;
  onDismiss: () => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      timerRef.current = setTimeout(onDismiss, toast.duration);
    }
    return () => clearTimeout(timerRef.current);
  }, [toast.duration, onDismiss]);

  return (
    <li
      role="status"
      aria-atomic="true"
      className="ax-toast"
      data-type={toast.type ?? 'foreground'}
    >
      {toast.title && <div className="ax-toast-title">{toast.title}</div>}
      {toast.description && <div className="ax-toast-description">{toast.description}</div>}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="ax-toast-close"
      >
        ×
      </button>
    </li>
  );
}

export const Toast = {
  Provider: ToastProvider,
  Viewport: ToastViewport,
};
