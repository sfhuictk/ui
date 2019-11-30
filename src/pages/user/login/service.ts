import request from '@/utils/request';
import { FormDataType } from './index';

export async function fakeAccountLogin(params: FormDataType) {
  // return request('/api/login/account', {
    return request('/server/api/user/login', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
