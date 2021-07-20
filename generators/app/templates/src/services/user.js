import request from '@/utils/request-user';

export async function getUserInfo() {
  return await request(`/users/current`);
}

export async function getEndpoints() {
  return await request('/authz/endpoints');
}

