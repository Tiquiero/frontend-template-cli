import { getUserInfo, getEndpoints } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { transformEndpointsToMenuAuth } from '@apulis/authz';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {
      userName: '',
      id: undefined,
      permissionList: [],
      nickName: undefined,
      phone: '',
      email: '',
      currentVC: [],
      jobMaxTimeSecond: null,
    },
    currentAuthority: undefined,
    endpoints: {}
  },
  effects: {
    * fetchCurrent(_, { call, put }) {
      const { code, data } = yield call(getUserInfo);
      if (code === 0) {
        yield put({
          type: 'updateState',
          payload: {
            currentUser: {
              ...data,
              userName: data.username,
              id: data.id
            },
          },
        });
      } else {
        yield put({
          type: 'updateState',
          payload: {},
        });
      }
    },

    * fetchEndpoints(_, { call, put }) {
      const { code, data } = yield call(getEndpoints);
      if (code === 0) {
        const { endpoints } = data;
        const menuAuth = transformEndpointsToMenuAuth(endpoints);
        setAuthority(menuAuth);
        yield put({
          type: 'updateState',
          payload: {
            currentAuthority: menuAuth,
            endpoints
          }
        });
      } else {
        setAuthority([]);
        yield put({
          type: 'updateState',
          payload: { 
            currentAuthority: undefined,
            endpoints: {}
          },
        });
      }
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
export default UserModel;
