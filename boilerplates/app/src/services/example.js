import request from 'utils/request';
import { prefix, example } from '@/meta';

const { path, method } = example;

export function fetch() {
  const url = `${prefix}${path}`;
  return request(url, {
    method: method
  });
}
