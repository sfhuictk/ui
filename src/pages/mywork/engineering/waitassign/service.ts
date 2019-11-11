import request from '@/utils/request';
import { BasicListItemDataType } from './data';

interface ParamsType extends Partial<BasicListItemDataType> {
  page?: number;
  key?: number;
}

export async function queryserverFakeList(params: ParamsType) {
  return request('/server/api/dispatch',{
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

export async function removeFakeList(params: ParamsType) {
  const { page = 5, ...restParams } = params;
  return request('/api/fake_list', {
    method: 'POST',
    params: {
      page,
    },
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params: ParamsType) {
  const { page = 5, ...restParams } = params;
  return request('/server/api/dispatchcreate', {
    method: 'POST',
    data: {
      ...restParams,
    },
  });
}

export async function updateFakeList(params: ParamsType) {
  const { page = 5, ...restParams } = params;
  return request('/server/api/dispatchupdate', {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function queryCurrent() {
  return request('/api/currentUser');
}
