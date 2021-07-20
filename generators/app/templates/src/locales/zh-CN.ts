import bizComponent from './zh-CN/bizComponent';
import component from './zh-CN/component';
import globalHeader from './zh-CN/globalHeader';
import layout from './zh-CN/layout';
import menu from './zh-CN/menu';
import pwa from './zh-CN/pwa';
import reg from './zh-CN/reg';
import request from './zh-CN/request';
import service from './zh-CN/service';
import settingDrawer from './zh-CN/settingDrawer';
import settings from './zh-CN/settings';

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  ...layout,
  ...reg,
  ...request,
  ...bizComponent,
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...service,
  ...settings,
  ...pwa,
  ...component,
};
