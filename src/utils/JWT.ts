function getExpFromJWT(token: string): number {
  const [, payload] = token.split('.');
  const decodedPayload = JSON.parse(atob(payload));
  return decodedPayload.exp;
}

export { getExpFromJWT };