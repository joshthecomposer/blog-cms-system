import { useState, useEffect } from "react";

function getSavedValue(key: string, initialValue: any) {
  const item = localStorage.getItem(key);
  if (item === null)
  {
    if (initialValue instanceof Function) return initialValue();
    return initialValue;
  }

  const savedValue = JSON.parse(item);
  return savedValue;
}

export default function useLocalStorage(key : string, initialValue : any) {
  const [value, setValue] = useState(() => {
    return getSavedValue(key, initialValue)
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  },[value])

  return [value, setValue]
}
