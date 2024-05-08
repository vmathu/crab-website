function getExpFromJWT(token: string): number {
  const [, payload] = token.split('.');
  const decodedPayload = JSON.parse(atob(payload));
  return decodedPayload.exp;
}

function getPayload(token: string): any {
  const [, payload] = token.split('.');
  const decodedPayload = JSON.parse(atob(payload));
  return decodedPayload;
}

export { getExpFromJWT, getPayload };
