import { USER_LOGIN_URL } from '@/utils/const';
import { ConfigProvider, message } from 'antd';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import { stringify } from 'querystring';
import React, { useEffect } from 'react';
import { connect, getLocale, useIntl } from 'umi';
import { setApiLocale } from '@/utils/errCode';
import { AuthzProvider } from '@apulis/authz';
import request from '@/utils/request-user';
import AFirstLogin, { FirstLoginProvider } from '@apulis/first-login';

const SecurityLayout = props => {
  const { children, location, history, dispatch, user, common } = props;
  const { formatMessage } = useIntl();
  setApiLocale(formatMessage);

  const collectAuthInfo = () => {
    let token = '';
    let error = '';
    if (location && location.query && location.query.token) {
      token = location.query.token;
    }
    if (token) {
      localStorage.token = token;
      history && history.push('/');
    }
    if (location && location.query && location.query.error) {
      error = location.query.error;
    }
    if (error) {
      message.error(error);
      const redirectPath = location?.pathname;
      const routerBase = window.routerBase;
      if (routerBase.includes(redirectPath) || redirectPath?.includes(routerBase)) {
        history && history.push('/');
      } else {
        history && history.push(location.pathname);
      }
    }
  };

  useEffect(() => {
    if (!localStorage.token) {
      const queryString = stringify({
        redirect: window.location.origin,
      });
      if (process.env.NODE_ENV !== 'development') {
        window.location.href = `${USER_LOGIN_URL}?${queryString}`;
      }
    }
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({
        type: 'user/fetchEndpoints',
      });

      dispatch({
        type: 'common/fetchPlatformConfig',
      });
    }
    collectAuthInfo();
  }, []);

  useEffect(() => {
    if (common?.platformName) {
      window.document.title = common?.platformName;
    }
  }, [common]);

  const getLanguage = () => {
    const lang = getLocale();
    if (lang === 'en-US') {
      return enUS;
    }
    if (lang === 'zh-CN') {
      return zhCN;
    }
  };

  return (
    <AuthzProvider endpoints={user.endpoints}>
      <FirstLoginProvider currentUser={user.currentUser}>
        <AFirstLogin request={request} path='/users/password' />
      </FirstLoginProvider>
      <ConfigProvider locale={getLanguage()}>{children}</ConfigProvider>
    </AuthzProvider>
  )
}

export default connect(({ user, common }) => ({
  user,
  common,
}))(SecurityLayout);
