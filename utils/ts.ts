export type OptionalPropertiesOf<T extends object> = Exclude<
  {
    [K in keyof T]: T extends Record<K, T[K]> ? never : K;
  }[keyof T],
  undefined
>;

export type OptionalObjectOf<T extends object> = {
  [K in OptionalPropertiesOf<T>]: Exclude<T[K], undefined>;
};

export function mergeOptionals<T extends object>(
  optionals: T,
  defaultOptions: OptionalObjectOf<T>
) {
  return { ...defaultOptions, ...optionals } as Required<T>;
}

export function assertOrThrow<T>(value: T | undefined | null) {
  if (value === undefined || value === null) throw new Error("Assertion Error");

  return value;
}
