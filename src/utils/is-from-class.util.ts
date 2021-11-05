/**
 * Typecheck to verify if some given ```data``` is from type ```C```.
 * @param data object to apply typecheck.
 * @param key the key to identify if data is actually from type ```C```. e.g: key='code' data=```classroom:{ code: 'SOME 11 LENGTH UUID CODE', ....rest }``` will return ```true```, while
 * data=```classroom: { code:undefined, ...rest }``` will return ```false```.
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
