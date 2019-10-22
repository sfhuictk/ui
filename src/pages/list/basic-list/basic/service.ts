import request from '@/utils/request';

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryDispatch(id: number = 1) {
  return request('/server/api/dispatch/' + id);
}
