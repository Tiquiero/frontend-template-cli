import request from '@/utils/request';
import userRequest from '@/utils/request-user';

export async function userLogout() {
  return await userRequest('/users/logout');  
}
