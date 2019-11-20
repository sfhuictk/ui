import request from '@/utils/request';
import { BasicListItemDataType } from './data';

interface ParamsType extends Partial<BasicListItemDataType> {
  page?: number;
  key?: number;
}

export async function queryserverFakeList(params: ParamsType) {
  return request('/server/api/dispatch/waitmaterialout',{
    params,
  });
}

export async function updateFakeList(params: ParamsType) {
  const { page = 5, ...restParams } = params;
  return request('/server/api/dispatch/materialout', {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}
