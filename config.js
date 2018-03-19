import dotenv from "dotenv";

dotenv.config()

const BIGCOMMERCE_STORE_HASH = process.env.BIGCOMMERCE_STORE_HASH || ""
const BIGCOMMERCE_API_URL = `https://api.bigcommerce.com/stores/${BIGCOMMERCE_STORE_HASH}`
const BIGCOMMERCE_AUTH_TOKEN = process.env.BIGCOMMERCE_AUTH_TOKEN || ""
const BIGCOMMERCE_CLIENT_ID = process.env.BIGCOMMERCE_CLIENT_ID || ""
const CUSTOMER_DATA_URL = process.env.CUSTOMER_DATA_URL || ""
const PRODUCT_DATA_URL = process.env.PRODUCT_DATA_URL || ""

export {
    BIGCOMMERCE_STORE_HASH,
    BIGCOMMERCE_API_URL,
    BIGCOMMERCE_AUTH_TOKEN,
    BIGCOMMERCE_CLIENT_ID,
    CUSTOMER_DATA_URL,
    PRODUCT_DATA_URL
}