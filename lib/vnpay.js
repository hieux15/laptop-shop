import crypto from 'crypto';

export function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

export function generateSignature(data, secret) {
  const signData = Object.keys(data).map(key => `${key}=${data[key]}`).join('&');
  const hmac = crypto.createHmac('sha512', secret);
  const signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest('hex');
  return signed;
}
