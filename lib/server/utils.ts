import { headers } from 'next/headers';

export function getIp() {
  let ip = headers().get('x-forwarded-for');

  if (ip) {
    return ip.split(',')[0].trim();
  }

  ip = headers().get('x-real-ip');

  if (ip) {
    return ip;
  }

  return headers().get('host');
}
