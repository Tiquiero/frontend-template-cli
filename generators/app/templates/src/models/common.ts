import { getPlatformConfig } from '../services/common';

export const locales = ['zh-CN', 'en-US'];

export interface CommonStateType {
  interval: number | null;
  platformName: string;
  i18n: string | boolean;
  isTop: boolean; // 标识当前是否【项目列表】菜单
  platformInfo: any;  // 当前项目信息
}

export interface CommonModelType {
  namespace: 'common';
  state: CommonStateType;
  effects: {
    changeTop: Effect;
    changeProjectId: Effect;
    changeProjectName: Effect;
    changeInterval: Effect;
    fetchPlatformConfig: Effect;
    fetchPrivilegeJobStatus: Effect;
  };
  reducers: {
    updateTop: Reducer;
    updateProjectId: Reducer;
    updateProjectName: Reducer;
    updateInterval: Reducer;
    savePlatform: Reducer;
  };
}

const common: CommonModelType = {
  namespace: 'common',
  state: {
    interval: localStorage.interval === 'null' ? null : Number(localStorage.interval) || 3000,
    platformName: '',
    i18n: locales.includes(localStorage.language) ? localStorage.language : navigator.language,
    isTop: true,
    platformInfo: '',
  },
  effects: {
    * changeTop({ payload }, { put }) {
      yield put({
        type: 'updateTop',
        payload,      
      });
    },
    * fetchPlatformConfig({ payload }, { call, put }) {
      const { code, data } = yield call(getPlatformConfig);
      if (code === 0) {
        // res.i18n = 'en-US'; // 开发
        // if (locales.includes(res.i18n)) {
        //   setI18n(res.i18n);
        // }
        yield put({
          type: 'savePlatform',
          payload: {
            platformName: data.homeTitle,
            platformInfo: data,
            // i18n: res.i18n,
          },
        });
      }
    },
  },
  reducers: {
    updateTop(state, { payload }) {
      return {
        ...state,
        isTop: payload,
      };
    },
    savePlatform(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default common;
