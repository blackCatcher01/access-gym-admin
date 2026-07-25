import client from './client';

export function demanderOtp(telephone) {
  return client.post('/auth/otp/request', { telephone });
}

export function verifierOtp(telephone, code) {
  return client.post('/auth/otp/verify', { telephone, code });
}
