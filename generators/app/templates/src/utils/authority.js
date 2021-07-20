import { message } from 'antd';

import { reloadAuthorized } from './Authorized'; // use localStorage to store the authority info, which might be sent from server in actual project.

export function getAuthority() {
  if (localStorage.authority) {
    let result = [];
    try {
      result = JSON.parse(localStorage.authority);
    } catch (err) {
      message.error(`Authority farmat error ${localStorage.authority}`);
    }
    return result;
  }
  return [];
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('authority', JSON.stringify(proAuthority));
  // auto reload
  reloadAuthorized();
}
