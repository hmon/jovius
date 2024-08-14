export const isDev = ENV === 'development';
export const isProd = ENV === 'production';

export function whenDev<T>(devValue: T, prodValue: T): T {
  return isDev ? devValue : prodValue;
}

export function whenProd<T>(prodValue: T, devValue: T): T {
  return isProd ? prodValue : devValue;
}

export function when<T>(env: string, value: T, defaultValue: T): T {
  return ENV === env ? value : defaultValue;
}
