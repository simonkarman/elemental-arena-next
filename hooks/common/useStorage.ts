import {
  useCallback, useState, useEffect, Dispatch, SetStateAction,
} from 'react';
import { usePrevious } from './usePrevious';

const useStorage = (key: string, defaultValue: string | undefined, storage: Storage | undefined): [
  string | undefined,
  Dispatch<SetStateAction<string | undefined>>,
  () => void,
] => {
  const previousKey = usePrevious(key);
  const [value, setValue] = useState<string | undefined>(() => {
    const existingValue = storage?.getItem(key);
    if (!existingValue) {
      return defaultValue;
    }
    return existingValue;
  });

  useEffect(() => {
    if (value) {
      storage?.setItem(key, value);
    } else {
      storage?.removeItem(key);
    }
  }, [value]);

  useEffect(() => {
    if (value) {
      if (previousKey) {
        storage?.removeItem(previousKey);
      }
      storage?.setItem(key, value);
    } else {
      storage?.removeItem(key);
    }
  }, [key]);

  const clear = useCallback(() => {
    setValue(undefined);
  }, []);

  return [value, setValue, clear];
};

export const useLocalStorage = (key: string, defaultValue?: string) => useStorage(
  key, defaultValue, process.browser ? window.localStorage : undefined,
);

export const useSessionStorage = (key: string, defaultValue?: string) => useStorage(
  key, defaultValue, process.browser ? window.sessionStorage : undefined,
);
