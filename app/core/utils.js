export function randomString(length, charset) {
  length = length || 12;
  charset = charset || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let rStr = [];
  for (let i = 0; i < length; i++) {
    rStr.push(charset[Math.floor(Math.random() * charset.length)]);
  }
  return rStr.join('');
}

export function prettifyJSON(obj) {
  return JSON.stringify(obj, null, 4);
}
