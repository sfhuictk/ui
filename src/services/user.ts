import request from '@/utils/request';

export interface apiTokenType {
  api_token: string;
}

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(params: apiTokenType): Promise<any> {
  return request('/server/api/currentUser',{
    method: 'POST',
    data: params,
  });
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
