/**
 *
 * @author andr3z0
 **/
export function isFromClass<C>(data: any, key: string): data is C {
  return data && (data[key] !== undefined || data[key] !== null);
}

/**
* 
* @author andr3z0
**/
export function isPureArrayOfClass<T>(array: any[], key: string): array is T[] {
  for (const item of array) {
    if (!isFromClass<T>(item, key)) {
      return false;
    }
  }

  return true;
}
