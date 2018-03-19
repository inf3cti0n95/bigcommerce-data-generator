# bigcommerce-data-generator

Generates Orders for BigCommerce Store

Example .env file

```

BIGCOMMERCE_AUTH_TOKEN="Store OAuth Token"
BIGCOMMERCE_CLIENT_ID="BigCommerce Client Id"
BIGCOMMERCE_STORE_HASH="Store Hash"
TOTAL_ORDERS=10
CUSTOMER_DATA_URL="https://my.api.mockaroo.com/customer_data.json?key=xxxxx"
PRODUCT_DATA_URL="https://my.api.mockaroo.com/product_data.json?key=xxxxx"

```

Mockaroo Schema's in Data dir

**Put an .env file in the project folder and run the script**

```

node entry.js --generate order/customer/product --count 100


```