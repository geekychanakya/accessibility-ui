import {
  createContext,
  useContext,
} from 'react';

export function createStrictContext<T>(displayName: string) {
  const Ctx = createContext<T | undefined>(undefined);
  Ctx.displayName = displayName;

  function useStrictContext(): T {
    const value = useContext(Ctx);
    if (value === undefined) {
      throw new Error(
        `\`${displayName}\` context value is undefined. Make sure to wrap the component in the appropriate Provider.`
      );
    }
    return value;
  }

  return [Ctx.Provider, useStrictContext] as const;
}
