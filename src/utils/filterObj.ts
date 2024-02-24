export function filterObj<T extends object>(
  obj: T,
  ...allowedFields: Array<keyof T>
): Partial<T> {
  const newObj: Partial<T> = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key as keyof T)) {
      newObj[key as keyof T] = obj[key as keyof T];
    }
  });
  return newObj;
}
