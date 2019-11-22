import request from '@/utils/request';
import { BasicListItemDataType } from './data';

interface ParamsType extends Partial<BasicListItemDataType> {
  page?: number;
  key?: number;
}

export async function queryserverFakeList(params: ParamsType) {
  return request('/server/api/dispatch/todolist',{
    method: 'POST',
    data: {
      "process": 5,
    },
  });
}

export async function updateFakeList(params: ParamsType) {
  const { page = 5, ...restParams } = params;
  return request('/server/api/dispatch/assign', {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}
