/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import RightContent from '@/components/GlobalHeader/RightContent';
import Authorized from '@/utils/Authorized';
import ProLayout, { PageLoading, getPageTitle } from '@ant-design/pro-layout';
import { Result } from 'antd';
import { getAuthorityFromRouter } from '@apulis/authz/es/Authorized';
import React, { useEffect, useMemo } from 'react';
import { connect, formatMessage, Link, useIntl } from 'umi';
import { setApiLocale } from '@/utils/request-aom';
import logo from '../assets/logo.svg';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle={formatMessage({ id: '403.tips.error' })}
    extra={<p>{formatMessage({ id: '403.tips.concat' })}</p>}
  />
);

/**
* use Authorized check all menu item
*/
const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    user,
    global: {
      collapsed,
    }
  } = props;

  /**
  * init variables
  */

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  const authority = useMemo(() => {
    return getAuthorityFromRouter(location.pathname || '/', props.route.routes || []);
  }, [location.pathname]);

  const { formatMessage } = useIntl();

  setApiLocale(formatMessage);

  useEffect(() => {
    if (!props.common.platformName) return;
    dispatch({
      type: 'settings/changeSetting',
      payload: {
        ...settings,
        title: props.common.platformName,
      },
    });
  }, [props.common]);

  if (typeof user.currentAuthority === 'undefined') {
    return <PageLoading />;
  }

  const pageTitleRender = (t: any) => {
    const curPageTitle = getPageTitle(t);
    window.document.title = curPageTitle;
    return curPageTitle;
  };

  return (
    <>
      <ProLayout
        logo={logo}
        formatMessage={formatMessage}
        menuHeaderRender={(logoDom, titleDom) => (
          <Link to="/">
            {titleDom}
          </Link>
        )}
        onCollapse={handleMenuCollapse}
        collapsed={collapsed}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
            return defaultDom;
          }
          if (menuItemProps.target === '_blank') {
            return (
              <a href={menuItemProps.path} target="blank">
                {defaultDom}
              </a>
            );
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: formatMessage({
              id: 'menu.home',
            }),
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={`/${paths.join('/')}`}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        menuDataRender={menuDataRender}
        rightContentRender={() => <RightContent pathname={props.location.pathname} />}
        {...props}
        {...settings}
        fixedHeader
        pageTitleRender={pageTitleRender}
      >
        <Authorized authority={authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </ProLayout>
    </>
  );
};

export default connect(({ settings, common, user, global }) => ({
  settings,
  common,
  user,
  global,
}))(BasicLayout);
