import { jwtDecode } from 'jwt-decode';

function setCookie(name: string, value: string, time: number) {
  let expires = '';
  if (time) {
    const date = new Date();
    date.setTime(date.getTime() + time * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

function getCookie(name: string) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return '';
}

function eraseCookie(name: string) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function checkCookie(name: string) {
  const cookie = getCookie(name);
  if (cookie) {
    return true;
  }
  return false;
}

function getRoleFromCookie(name: string) {
  const token = getCookie(name);
  const decoded = checkCookie(name) ? (jwtDecode(token) as any) : null;
  return decoded ? decoded.role : null;
}

export { setCookie, getCookie, eraseCookie, checkCookie, getRoleFromCookie };
