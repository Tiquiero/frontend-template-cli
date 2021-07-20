import { extend } from 'umi-request';
import { USER_DASHBOARD_BACKEND } from '@/utils/const';
import { errorHandler } from './request';

const request = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  prefix: USER_DASHBOARD_BACKEND,
});

request.interceptors.request.use(async (url, options) => {
  const token = localStorage.getItem('token');
  if (token) {
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    };
    return {
      url: url,
      options: { ...options, headers: headers },
    };
  }
});

request.interceptors.response.use(async (response) => {
  return response;
});

export default request;
