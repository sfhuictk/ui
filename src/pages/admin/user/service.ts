import request from '@/utils/request';
import { User } from './data.d';

interface ParamsType extends Partial<User> {
  page?: number;
  key?: number;
}

export async function queryserverFakeList(params: ParamsType) {
  return request('/server/api/users',{
    params,
  });
}

export async function queryserverSearch(params: ParamsType) {
  const { ...restParams } = params;
  return request('/server/api/dispatch/search',{
  method: 'POST',
  data: { ...restParams },
  });
}

export async function queryFakeList(params: ParamsType) {
  return request('/api/fake_list', {
    params,
  });
}

export async function resetPassword(params: ParamsType) {
  const { page = 5, ...restParams } = params;  
  const api_token = sessionStorage.getItem('api_token');
  return request('server/api/user/resetpwd', {
    method: 'POST',
    data: {
      ...restParams,
      api_token,
      method: 'update',
    },
  });
}

export async function addFakeList(params: ParamsType) {
  const { page = 5, ...restParams } = params;
  return request('/server/api/user/create', {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

export async function updateFakeList(params: ParamsType) {
  const { page = 5, ...restParams } = params;
  return request('/server/api/user/update', {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}
