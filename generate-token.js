import dotenv from 'dotenv'
import { initializeKeys, generateToken } from './keys.js'

dotenv.config()

initializeKeys()

console.log(generateToken())
