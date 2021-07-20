import { formatMessage } from 'umi';

export const SpeNameReg = {
  pattern: /^[\u4e00-\u9fa5A-Za-z0-9-_]+$/,
  message: '名称只能由中英文，数字，下划线或横线组成！',
};

export const NameReg = {
  pattern: /^[A-Za-z0-9-_]+$/,
  message: '名称只能由字母，数字，下划线或横线组成！',
};

export const LowercaseBeginNameReg = {
  pattern: /^[a-z][a-zA-Z0-9-_]+$/,
  message: '名称只能由小写字母开头，字母，数字，下划线或横线组成！',
};

export const linuxPathReg = {
  pattern: /^\/$|(\/[a-zA-Z_0-9-]+)+$/,
  message: formatMessage({ id: 'reg.input.limit.linuxPath' }),
};

export const modelNameReg = {
  type: 'string',
  max: 255,
  message: formatMessage({ id: 'reg.input.limit.textLength' }),
};

export const getNameFromDockerImage = (tag) => {
  if (!tag) {
    return '';
  }
  return tag.replace(/(.+\/)/, '');
};

export const startUpFileReg = {
  pattern: /\.py|\.sh$/,
  message: formatMessage({ id: 'reg.input.limit.fileType' }),
};

export const getUserPathPrefixReg = (path) => {
  return {
    pattern:  new RegExp(`^${path}`),
    message: formatMessage({ id: 'reg.user.path.prefix.reg' }),
  }
}

export const emailReg = {
  pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  message: '请输入正确的邮箱地址'
}

export const FilePathReg = {
  pattern: /^(.*)\/$/,
  message: '路径必须以 / 结尾！'
}