// Going further: this decorator is an extra, not core midterm material.
//
// It uses the legacy (experimental) decorator signature
// (target, propertyKey, descriptor) because tsconfig.json sets
// "experimentalDecorators": true, which Angular projects enable for its own
// decorators such as @Component. With that flag off, TypeScript would expect
// the TC39 standard form (originalMethod, context: ClassMethodDecoratorContext).

/**
 * Method decorator: logs the method name and its arguments every time the
 * method runs, then calls the original method.
 *
 * @typeParam A The method's parameter list, as a tuple of unknown values.
 * @typeParam R The method's return type, passed through unchanged.
 */
export function logCall<A extends unknown[], R>(
  _target: object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<(...args: A) => R>,
): TypedPropertyDescriptor<(...args: A) => R> {
  const original = descriptor.value;
  if (!original) {
    return descriptor;
  }

  // A regular function (not an arrow) so that `this` is the class instance.
  descriptor.value = function (this: unknown, ...args: A): R {
    console.log(`[logCall] ${String(propertyKey)}`, args);
    return original.apply(this, args);
  };
  return descriptor;
}
