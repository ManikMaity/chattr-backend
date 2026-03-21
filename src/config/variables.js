import dotenv from 'dotenv'
dotenv.config()

export const PORT = Number(process.env.PORT) || 3000
export const NODE_ENV = process.env.NODE_ENV
export const DEV_DB_URL = process.env.DEV_DB_URL
export const PROD_DB_URL = process.env.PROD_DB_URL
export const SALT_ROUND = Number(process.env.SALT_ROUND)
export const JWT_SECRET = process.env.JWT_SECRET
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD
export const MAIL_ID = process.env.MAIL_ID
export const REDIS_HOST = process.env.RADIS_HOST || 'localhost'
export const REDIS_PORT = process.env.RADIS_PORT
export const CLIENT_URL = process.env.CLIENT_URL
export const REDIS_PASSWORD = process.env.RADIS_PASSWORD
export const ENABLE_EMAIL_VERIFICATION =
  process.env.ENABLE_EMAIL_VARIFICATION || false
export const JWT_EXPIRY = process.env.JWT_EXPIRY
export const RAZORPAY_ID = process.env.RAZORPAY_ID
export const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET
export const RECEIPT_SECRET = process.env.RECEIPT_SECRET || 'receipt_1103'
export const GROQ_API_KEY = process.env.GROQ_API
