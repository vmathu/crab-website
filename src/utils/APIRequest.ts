import { getCookie } from './Cookie';

async function doPost(url: string, data: any) {
  const token = getCookie('token') || '';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}

async function doGet(url: string) {
  const token = getCookie('token') || '';

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  });

  return await response.json();
}

async function doPatch(url: string, data: any) {
  const token = getCookie('token') || '';

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}

export { doPost, doGet, doPatch };
