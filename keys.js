import { generateKeyPairSync, privateEncrypt, publicDecrypt } from 'crypto'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { encodeUrlSafeBase64, decodeUrlSafeBase64 } from './url-safe-base64.js'

const privateKeyPath = join('secrets', 'private-key.pem')
const publicKeyPath = join('secrets', 'public-key.pem')

let privateKey, publicKey

export function initializeKeys () {
  if (existsSync(privateKeyPath)) {
    privateKey = readFileSync(privateKeyPath)
    publicKey = readFileSync(publicKeyPath)
  } else {
    const { privateKey: newPrivateKey, publicKey: newPublicKey } = generateKeyPairSync('rsa', {
      modulusLength: 512,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: process.env.PK_PASSPHRASE || ''
      }
    })

    writeFileSync(privateKeyPath, newPrivateKey)
    writeFileSync(publicKeyPath, newPublicKey)

    privateKey = newPrivateKey
    privateKey = newPublicKey
  }
}

export function generateToken () {
  const encryptedContent = privateEncrypt(privateKey, Buffer.from(JSON.stringify({
    metricsToken: 1,
    iat: Math.floor(Date.now() / 1000)
  }), 'utf8'))

  return encodeUrlSafeBase64(encryptedContent)
}

export function isTokenValid (token) {
  try {
    const decryptedContent = publicDecrypt(publicKey, decodeUrlSafeBase64(token))
    const content = JSON.parse(decryptedContent.toString('utf8'))

    return (content.metricsToken && content.iat <= Date.now() / 1000)
  } catch (_) {
    return false
  }
}
