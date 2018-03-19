import { generateRandomInt, getLine, getFileLineCount } from "./utils";
import {
    BIGCOMMERCE_API_URL,
    BIGCOMMERCE_AUTH_TOKEN,
    BIGCOMMERCE_CLIENT_ID,
    CUSTOMER_DATA_URL,
    PRODUCT_DATA_URL
} from "./config";

export default class BigCommerceSystem {

    constructor(count) {
        this.dummyCustomers = [];
        this.dummyProducts = [];
        this.count = count;
    }

    async initializeCustomers() {
        let customers = await fetch(`${CUSTOMER_DATA_URL}&count=${this.count}`).then(resp => resp.json());
        this.dummyCustomers = customers;
        console.log('length', this.dummyCustomers.length)
        return this.dummyCustomers
    }

    async initializeProducts() {
        let products = await fetch(`${PRODUCT_DATA_URL}&count=${this.count}`).then(resp => resp.json());
        this.dummyProducts = products;
        return this.dummyProducts
    }

    async getCustomerId() { }
    async getProductId() { }

    getCustomer() { console.log(this.count,this.dummyProducts);        console.log('length', this.dummyCustomers.length);
    return this.dummyCustomers.pop() }
    getProduct() { console.log(this.count,this.dummyProducts);return this.dummyProducts.pop() }

    async postCustomer() {
        let customerData = this.getCustomer()
        console.log(customerData)
        let customerResponse = await fetch(`${BIGCOMMERCE_API_URL}/v2/customers.json`, {
            method: "POST",
            headers: {
                "X-Auth-Token": BIGCOMMERCE_AUTH_TOKEN,
                "X-Auth-Client": BIGCOMMERCE_CLIENT_ID,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "first_name": customerData.first_name,
                "last_name": customerData.last_name,
                "email": customerData.email,
                "phone": customerData.phone
            })
        })
            let customer = await customerResponse.json()
            let customerId = customer.id
            let addressResponse = await fetch(`${BIGCOMMERCE_API_URL}/v2/customers/${customerId}/addresses.json`, {
                method: "POST",
                headers: {
                    "X-Auth-Token": BIGCOMMERCE_AUTH_TOKEN,
                    "X-Auth-Client": BIGCOMMERCE_CLIENT_ID,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "first_name": customerData.first_name,
                    "last_name": customerData.last_name,
                    "company": customerData.company,
                    "street_1": customerData.address,
                    "street_2": "",
                    "city": customerData.city,
                    "state": customerData.state,
                    "zip": customerData.zip,
                    "country": "United States",
                    "phone": customerData.phone
                })
            })
        
        return customerResponse
    }

    async postProduct() {
        let productData = this.getProduct()

        let categoryResponse = await fetch(`${BIGCOMMERCE_API_URL}/v2/categories.json?name=${productData.category}`, {
            method: "GET",
            headers: {
                "X-Auth-Token": BIGCOMMERCE_AUTH_TOKEN,
                "X-Auth-Client": BIGCOMMERCE_CLIENT_ID,
                "Content-Type": "application/json"
            }
        })
        let category;
        if (categoryResponse.status === 200)
            category = await categoryResponse.json()

        if (categoryResponse.status === 204) {
            let categoryResponse = await fetch(`${BIGCOMMERCE_API_URL}/v2/categories.json`, {
                method: "POST",
                headers: {
                    "X-Auth-Token": BIGCOMMERCE_AUTH_TOKEN,
                    "X-Auth-Client": BIGCOMMERCE_CLIENT_ID,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "name": productData.category
                })
            })
            category = await categoryResponse.json()

        }
        let productResponse = await fetch(`${BIGCOMMERCE_API_URL}/v2/products.json`, {
            method: "POST",
            headers: {
                "X-Auth-Token": BIGCOMMERCE_AUTH_TOKEN,
                "X-Auth-Client": BIGCOMMERCE_CLIENT_ID,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "name": productData.name,
                "type": productData.type,
                "description": productData.description,
                "price": productData.price,
                "availability": "available",
                "weight": generateRandomInt(5),
                "categories": [category.id]
            })
        })
        return productResponse
    }

    async getRandomProductFromShop(count){
        let product = await fetch(`${BIGCOMMERCE_API_URL}/v2/products.json?limit=1&page=${generateRandomInt(1,count)}`, {
            method: "GET",
            headers: {
                "X-Auth-Token": BIGCOMMERCE_AUTH_TOKEN,
                "X-Auth-Client": BIGCOMMERCE_CLIENT_ID,
                "Content-Type": "application/json"
            }
        }).then(resp => resp.json())
        return product[0]
    }

    async getRandomCustomerFromShop(count){
        let customerCount = await fetch(`${BIGCOMMERCE_API_URL}/v2/customers/count.json`, {
            method: "GET",
            headers: {
                "X-Auth-Token": BIGCOMMERCE_AUTH_TOKEN,
                "X-Auth-Client": BIGCOMMERCE_CLIENT_ID,
                "Content-Type": "application/json"
            }
        }).then(resp => resp.json())
        let customer = await fetch(`${BIGCOMMERCE_API_URL}/v2/customers.json?limit=1&page=${generateRandomInt(1,customerCount.count)}`, {
            method: "GET",
            headers: {
                "X-Auth-Token": BIGCOMMERCE_AUTH_TOKEN,
                "X-Auth-Client": BIGCOMMERCE_CLIENT_ID,
                "Content-Type": "application/json"
            }
        }).then(resp => resp.json())
        return customer
    }

    async getProductsList(){
        let productCount = await fetch(`${BIGCOMMERCE_API_URL}/v2/products/count.json`, {
            method: "GET",
            headers: {
                "X-Auth-Token": BIGCOMMERCE_AUTH_TOKEN,
                "X-Auth-Client": BIGCOMMERCE_CLIENT_ID,
                "Content-Type": "application/json"
            }
        }).then(resp => resp.json())

        let arrayOfProducts = [];
        for (let i = 0; i < generateRandomInt(1, 5); i++) {
            arrayOfProducts.push(await this.getRandomProductFromShop(productCount.count))
        }
        return arrayOfProducts
    }

    async postOrder() {
        
        let customer = await this.getRandomCustomerFromShop()
        let productsList = await this.getProductsList()
        let customerId = customer[0].id
        let orderStatus = generateRandomInt(1,14)

        let addresses = await fetch(`${BIGCOMMERCE_API_URL}/v2/customers/${customerId}/addresses.json`,{
            method: "GET",
            headers:{
                "X-Auth-Token": BIGCOMMERCE_AUTH_TOKEN,
                "X-Auth-Client": BIGCOMMERCE_CLIENT_ID,
                "Content-Type": "application/json"
            }
        }).then(resp => resp.json())


        let billingAddress = addresses[generateRandomInt(addresses.length)]
        delete billingAddress.id
        delete billingAddress.customer_id
        delete billingAddress.address_type
        delete billingAddress.form_fields
        let order = {
            "customer_id": customerId,
            "status_id": orderStatus,
            "products": productsList.map(product => ({
                "product_id": product.id,
                "quantity": generateRandomInt(1,3)
            })),
            "billing_address": billingAddress
        }

        let orderResponse = await fetch(`${BIGCOMMERCE_API_URL}/v2/orders.json`,{
            method: "POST",
            headers:{
                "X-Auth-Token": BIGCOMMERCE_AUTH_TOKEN,
                "X-Auth-Client": BIGCOMMERCE_CLIENT_ID,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        }).then(resp => resp.json())

        return orderResponse
    }
}