/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { USER_LOGIN_URL } from '@/utils/const';
import { message, notification } from 'antd';
import { stringify } from 'querystring';
import { formatMessage } from 'umi';
import { extend } from 'umi-request';
import { bizCodeMessage, noMessageCodes } from './errCode';

const prefix = '/iqi/api/v1';
let codeMessage;

/**
 * 异常处理程序
 */

export const errorHandler = async (error) => {
  if (!codeMessage) {
    codeMessage = {
      200: formatMessage({ id: 'codeMessage.200' }),
      201: formatMessage({ id: 'codeMessage.201' }),
      202: formatMessage({ id: 'codeMessage.202' }),
      204: formatMessage({ id: 'codeMessage.204' }),
      400: formatMessage({ id: 'codeMessage.400' }),
      401: formatMessage({ id: 'codeMessage.401' }),
      403: formatMessage({ id: 'codeMessage.403' }),
      404: formatMessage({ id: 'codeMessage.404' }),
      406: formatMessage({ id: 'codeMessage.406' }),
      410: formatMessage({ id: 'codeMessage.410' }),
      422: formatMessage({ id: 'codeMessage.422' }),
      500: formatMessage({ id: 'codeMessage.500' }),
      502: formatMessage({ id: 'codeMessage.502' }),
      503: formatMessage({ id: 'codeMessage.503' }),
      504: formatMessage({ id: 'codeMessage.504' }),
    };
  }
  const { response, data } = error;
  let responseTemp;
  try {
    responseTemp = await response.json();
  } catch (e) {
    // notification.error({
    //   message: '请求错误',
    //   description: '请稍后再试',
    // });
  }
  const CODE = responseTemp?.code;
  const hasMessage = bizCodeMessage[CODE] || responseTemp?.msg;
  if (CODE !== 0 && hasMessage) {
    if (CODE === 510100004) {
      localStorage.removeItem('token');
      const queryString = stringify({
        // 强制跳转到根目录
        redirect: window.location.origin,
      });
      window.location.href = `${USER_LOGIN_URL}?${queryString}`;
    }
    if (hasMessage.length < 200 && !noMessageCodes.includes(CODE)) {
      message.error(hasMessage);
    }
  }
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    if (status === 401) {
      const href = window.location.href;
      if (!/localhost/.test(href)) {
        const queryString = stringify({
          redirect: window.location.href,
        });
        window.location.href = `${USER_LOGIN_URL}?${queryString}`;
      }
    }
    !hasMessage &&
      notification.error({
        message: `${formatMessage({ id: 'request.error.tips' })} ${status}: ${url}`,
        description: errorText,
      });
  }
  return { ...response, ...data };
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  prefix: prefix,
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

export default request;
