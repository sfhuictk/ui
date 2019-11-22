import request from '@/utils/request';
import { BasicListItemDataType } from './data';

interface ParamsType extends Partial<BasicListItemDataType> {
  process?: number;  
}

export async function queryserverFakeList(params: ParamsType) {
  const process = {"process": 1}
  return request('/server/api/dispatch/todolist',{
    method: 'POST',
    data: {
      ...process,
    },
  });
}

export async function queryserverSearch(params: ParamsType) {
  const { ...restParams } = params;
  return request('/server/api/dispatch/search',{
  method: 'POST',
  data: { ...restParams },
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
