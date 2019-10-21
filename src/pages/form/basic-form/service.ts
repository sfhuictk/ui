import request from '@/utils/request';

export async function fakeSubmitForm(params: any) {
  return request('/server/api/dispatchcreate', {
    method: 'POST',
    data: params,
  });
}
