import { checkIfGpuOrNpu } from '@/models/resource';
import moment from 'moment';
import pathRegexp from 'path-to-regexp';
import { parse } from 'querystring';
import { formatMessage, setLocale } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import ErrImg from '@/assets/errImg.png';
import requestUser from './request-user';
import { isObject } from './types';

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = (path) => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getAuthorityFromRouter = (router = [], pathname) => {
  const authority = router.find(
    ({ routes, path = '/' }) =>
      (path && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path, routeData) => {
  let authorities;
  routeData.forEach((route) => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      } // exact match

      if (route.path === path) {
        authorities = route.authority || authorities;
      } // get children authority recursively

      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

/**
 * 规范化返回的列表数据
 * @param {Object} data 列表数据
 */
export const normalizeTableResult = (data) => {
  if (Array.isArray(data)) {
    return {
      list: data || [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    };
  }
  if (isObject(data)) {
    return {
      list: data.list || [],
      pagination: {
        current: data.pageNum || 1,
        pageSize: data.pageSize || 10,
        total: data.total,
      },
    };
  }
  return data;
};

// 文件大小显示转换
export const bytesToSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024; // or 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  // eslint-disable-next-line no-restricted-properties
  // return `${(bytes / Math.pow(k, i)).toPrecision(3)} ${sizes[i]}`
  return `${(bytes / Math.pow(k, i)).toFixed(0)} ${sizes[i]}`;
};

export const getStatusList = () => [
  // { value: 0, label: '未启动' },
  // { value: 1, label: '初始化中' },
  { value: 2, label: '启动中' },
  { value: 3, label: '队列中' },
  { value: 4, label: '调度中' },
  { value: 5, label: '关闭中' },
  // { value: 6, label: '等待关闭中' },
  { value: 7, label: '运行中' },
  { value: 99, label: '结束中' },
  { value: 100, label: '已完成' },
  { value: 101, label: '已终止' },
  { value: 102, label: '错误' },
  { value: 103, label: '失败' },
  // { value: 104, label: '保存失败' },
];

export const canCreateVisualJobStatus = ['unapproved', 'queued', 'scheduling', 'running', 'finished'];

export const getJobStatus = (status) => {
  const statusList = {
    0: '未启动',
    1: '初始化中',
    2: '启动中',
    3: '队列中',
    4: '调度中',
    5: '关闭中',
    6: '等待关闭中',
    7: '运行中',
    99: '结束中',
    100: '已完成',
    101: '已终止',
    102: '错误',
    103: '失败',
    104: '保存失败',
  };
  return statusList[status] || '';
};

export const formatTime = (time) => {
  return moment(time).format('YYYY-MM-DD HH:mm:ss')
}

export const getStatusColor = (status) => {
  const colorList = {
    error: '#CC0000',
    failed: '#d48265',
    finished: '#2f4554',
    running: '#61a0a8',
    killed: '#DDDDDD',
    Killed: '#DDDDDD',

    unapproved: '#91c7ae',
    queued: '#749f83',
    scheduling: '#9ACD32',
    pausing: '#ca8622',
    paused: '#bda29a',
    killing: '#C0C0C0',
  };
  return colorList[status] || '#1890ff';
};

export const getModelStatus = (status) => {
  const statusList = {
    normal: '正常',
    deleting: '删除中',
  };
  return statusList[status] || '';
};

export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0;
};

export const isEmptyString = (str) => {
  if (typeof str === 'undefined' || str === '') {
    return true;
  } 
  return false;
};

export const downloadStringAsFile = function (content, filename) {
  // 创建隐藏的可下载链接
  const eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.style.display = 'none';
  // 字符内容转变成blob地址
  const blob = new Blob([content]);
  eleLink.href = URL.createObjectURL(blob);
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
};

export const checkIfCanDelete = (status) => {
  return !['pausing', 'running', 'killing'].includes(status);
};

export const checkIfCanStop = (status) => {
  return ['unapproved', 'queued', 'scheduling', 'running'].includes(status);
};

export const checkIfCanResume = (status) => {
  return ['paused'].includes(status);
};

export const checkIfCanPause = (status) => {
  return ['running', 'queued', 'scheduling'].includes(status);
};

export function setI18n(lang) {
  localStorage.language = lang;
  requestUser(`/language/${  lang}`);
  setLocale(lang, false);
}

export function capFirstLetter(s = '') {
  return s.replace(/\b(\w)(\w*)/g, (_$0, $1, $2) => {
    return $1.toUpperCase() + $2.toLowerCase();
  });
}

export const generateKey = () => {
  return new Date().getTime();
};

export const generateUUID = () => {
  return uuidv4();
};

export function UpdateUrlParam(data, deleteAll = false) {
  let thisURL = document.location.href;
  if (deleteAll) {
    thisURL = document.location.pathname;
  } else {
    data && data.forEach(i => {
      const { name, val } = i;
      // 如果 url中包含这个参数 则修改
      if (thisURL.indexOf(`${name  }=`) > 0) {
        const v = getUrlParam(name);
        if (v != null) {
          // 是否包含参数
          thisURL = thisURL.replace(`${name  }=${  v}`, `${name  }=${  val}`);
        } else {
          thisURL = thisURL.replace(`${name  }=`, `${name  }=${  val}`);
        }
      } // 不包含这个参数 则添加
      else if (thisURL.indexOf('?') > 0) {
          thisURL = `${thisURL  }&${  name  }=${  val}`;
        } else {
          thisURL = `${thisURL  }?${  name  }=${  val}`;
        }
    });
  }
  const state = {
    title: document.title,
    url: document.location.href,
    otherkey: null
  };
  history.replaceState(state, document.title, thisURL);
}

// 获取url参数
function getUrlParam(name) {
  // 封装方法
  const reg = new RegExp(`(^|&)${  name  }=([^&]*)(&|$)`); // 构造一个含有目标参数的正则表达式对象
  const r = window.location.search.substr(1).match(reg); // 匹配目标参数
  if (r != null) return unescape(r[2]);
  return null; // 返回参数值
}

export function onImgError(e) {
  e.target.src = ErrImg;
  e.target.onerror = null;
};

export const formatTime2Seconds = (value, unit = 'second') => {
  const map = {
    'week': 86400 * 7,
    'day': 86400,
    'hour': 3600,
    'minute': 60,
    'second': 1,
    'now': 0,
  }
  return parseInt(value, 10) * map[unit];
};

export const formatSeconds = seconds => {
  const secondTime = parseInt(seconds, 10);
  if (!seconds && secondTime !== 0) {
    return {
      value: 0,
      unit: '',
      label: '',
    };
  }
  // 60 3600 86400 604800
  let result = {};
  if (secondTime === 0) {
    result = {
      value: undefined,
      unit: 'now',
      label: '立即',
    };
  } else if (secondTime % 604800 === 0) {
    result = {
      value: secondTime / 604800,
      unit: 'week',
      label: `${secondTime / 604800}周`,
    };
  } else if (secondTime % 86400 === 0) {
    result = {
      value: secondTime / 86400,
      unit: 'day',
      label: `${secondTime / 86400}天`,
    };
  } else if (secondTime % 3600 === 0) {
    result = {
      value: secondTime / 3600,
      unit: 'hour',
      label: `${secondTime / 3600}小时`,
    };
  } else if (secondTime % 60 === 0) {
    result = {
      value: secondTime / 60,
      unit: 'minute',
      label: `${secondTime / 60}分钟`,
    };
  } else {
    result = {
      value: secondTime,
      unit: 'second',
      label: `${secondTime}秒`,
    };
  }
  return result;
};

// 将秒数转换成时长描述
export const formatSeconds2Time = seconds => {
  let secondTime = parseInt(seconds, 10);
  let minuteTime = 0;
  let hourTime = 0;
  let dayTime = 0;
  let result = '';
  if (seconds < 60) {
    result = secondTime === 0 ? '立即' : `${secondTime}秒`;
  } else {
    if (secondTime >= 60) {
      minuteTime = parseInt(secondTime / 60, 10);
      secondTime = parseInt(secondTime % 60, 10);
      if (minuteTime >= 60) {
        hourTime = parseInt(minuteTime / 60, 10);
        minuteTime = parseInt(minuteTime % 60, 10);
        if (hourTime >= 24) {
          dayTime = parseInt(hourTime / 24, 10);
          hourTime = parseInt(hourTime % 24, 10);
        }
      }
    }
    if (secondTime > 0) {
      secondTime = parseInt(secondTime, 10) >= 10 ? secondTime : `0${  secondTime}`;
      result = `${secondTime}秒`;
    }
    if (minuteTime > 0) {
      minuteTime = parseInt(minuteTime, 10) >= 10 ? minuteTime : `0${  minuteTime}`;
      result = `${minuteTime}分${result}`;
    }
    if (hourTime > 0) {
      result = `${hourTime}小时${result}`;
    }
    if (dayTime > 0) {
      result = `${dayTime}天${result}`;
    }
  }
  return result;
};

export const getRandomColor = () => {
  const rgb = [];
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16);
    color = color.length == 1 ? `0${  color}` : color;
    rgb.push(color);
  }
  return `#${  rgb.join('')}`;
}
