import * as _ from 'lodash';

export function getNestedValue<T>(obj: any, path: string, defaultValue?: T): T {
  return _.get(obj, path, defaultValue);
}

export function mergeConfig(base: object, overrides: object): object {
  return _.merge({}, base, overrides);
}
