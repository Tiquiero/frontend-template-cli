import { message } from 'antd';
import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import type { MessageDescriptor } from 'react-intl';
import { stringify } from 'querystring';

export const prefix = '/aom/api/v1';

type FormatMessageFunc = (
  descriptor: MessageDescriptor,
  values?: Record<string, string | number | boolean | null | undefined | Date>,
) => string;

let codeMessage = {};
let bizCodeMessage = {};

let formatMessage: FormatMessageFunc;

const instance = axios.create({
  baseURL: prefix,
  timeout: 30000,
});

const responseInterceptor1 = [
  (data: any) => {
    return data;
  },
  (err: any) => {
    const status = err.response?.status;
    if (status === 401 && process.env.NODE_ENV === 'production') {
      const queryString = stringify({
        redirect: window.location.href,
      });
      window.location.href = `/custom-user-dashboard/user/login?${queryString}`;
    }
    const code = err.response?.data?.code;
    const data = err.response?.data?.data;

    if (code === 500010110) {
      message.error(`当前资源配额已经被分配给用户组：${  data.assignedGroup}`)
      throw err;
    }
    if (code === 500010006) {
      message.error(`当前资源配额已经被分配给组织：${  data.assignedOrg}`)
      throw err;
    }

    if (bizCodeMessage[code]) {
      message.error(bizCodeMessage[code]);
      throw err;
    }

    if (status && codeMessage[status]) {
      message.error(codeMessage[status]);
    }
    if(err.message.includes('timeout')){   // 判断请求异常信息中是否含有超时timeout字符串
      message.error("请求超时");
      return {};
    }
    if(err.message === 'Network Error'){
      message.error("网络错误");
      return {};
    }
    throw err;
  },
];

instance.interceptors.response.use(...responseInterceptor1);

const requestIntercetor1 = async (options: AxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string | number> = {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    return {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };
  }
  return {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };
};

instance.interceptors.request.use(requestIntercetor1);

const requestIamInstance = axios.create({
  baseURL: '/iam/api/v1',
  timeout: 30000,
});

requestIamInstance.interceptors.request.use(requestIntercetor1);
requestIamInstance.interceptors.response.use(...responseInterceptor1);

const request = async <T = any>(path: string, config?: AxiosRequestConfig) => {
  const res = await instance(path, config);
  return res.data as Promise<{ code: number; data: T }>;
};

export const requestIam = async (path: string, config?: AxiosRequestConfig) => {
  const res = await requestIamInstance(path, config);
  return res.data;
};

export const setApiLocale = (f: FormatMessageFunc) => {
  formatMessage = f;
  codeMessage = {
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

  bizCodeMessage = {
    500010001: formatMessage({ id: 'bizCodeMessage.500010001' }),
    500010101: formatMessage({ id: 'bizCodeMessage.500010101' }),
    500010002: formatMessage({ id: 'bizCodeMessage.500010002' }),
    500010102: formatMessage({ id: 'bizCodeMessage.500010102' }),
    500010103: formatMessage({ id: 'bizCodeMessage.500010103' }),
    500010106: formatMessage({ id: 'bizCodeMessage.500010106' }),
    500010109: formatMessage({ id: 'bizCodeMessage.500010109' }),
    500010116: formatMessage({ id: 'bizCodeMessage.500010116' }),
    500010007: formatMessage({ id: 'bizCodeMessage.500010007' }),
    500010302: formatMessage({ id: 'bizCodeMessage.500010302' }),
    500010303: formatMessage({ id: 'bizCodeMessage.500010303' }),
    500010304: formatMessage({ id: 'bizCodeMessage.500010304' }),
  };
};

export const { CancelToken } = axios;

export default request;
