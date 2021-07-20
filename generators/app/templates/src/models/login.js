import { userLogout } from '@/services/login';
import { USER_LOGIN_URL } from '@/utils/const';
import { stringify } from 'querystring';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *logout(_, { call }) {
      yield call(userLogout);
      localStorage.removeItem('token');
      const queryString = stringify({
        // 强制跳转到根目录
        redirect: window.location.origin,
      });
      window.location.href = `${USER_LOGIN_URL}?${queryString}`;
    },
  },
  reducers: {},
};
export default Model;
