// original source: https://github.com/RGBboy/urlsafe-base64/blob/master/lib/urlsafe-base64.js

export function encodeUrlSafeBase64 (buffer) {
  return buffer.toString('base64')
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, '') // Remove ending '='
}

export function decodeUrlSafeBase64 (base64) {
  base64 += Array(5 - base64.length % 4).join('=')

  base64 = base64
    .replace(/-/g, '+') // Convert '-' to '+'
    .replace(/_/g, '/') // Convert '_' to '/'

  return Buffer.from(base64, 'base64')
}
