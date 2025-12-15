import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function Match<T extends object>(property: keyof T, validationOptions?: ValidationOptions) {
  return function (object: T, propertyName: string) {
    registerDecorator({
      name: 'Match',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          const [relatedPropertyName] = args.constraints as [string];
          return typeof value === 'string' && value === (args.object as Record<string, unknown>)[relatedPropertyName];
        },

        defaultMessage(args: ValidationArguments): string {
          const [relatedPropertyName] = args.constraints as [string];
          return `${args.property} must match ${relatedPropertyName}`;
        },
      },
    });
  };
}
