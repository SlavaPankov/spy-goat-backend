import { Transform } from 'class-transformer';

export const IsoDate = () =>
  Transform(({ value }: { value: Date | string }) => (value instanceof Date ? value.toISOString() : value));
