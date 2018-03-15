import { generateRandomInt, getLine, getFileLineCount } from "./utils";
import { BIGCOMMERCE_API_URL, BIGCOMMERCE_AUTH_TOKEN, BIGCOMMERCE_CLIENT_ID } from "./config";

export default class BigCommerceSystem {
    constructor(customersDataPath, productsDataPath, totalCustomer, totalProducts) {
        this.customersDataPath = customersDataPath;
        this.productsDataPath = productsDataPath;
    }

    async getCustomer(){
        this.totalCustomers = await getFileLineCount(this.customersDataPath)
        return getLine(this.customersDataPath, generateRandomInt(1,this.totalCustomers))
    }

    async getProduct(){
        this.totalProducts = await getFileLineCount(this.productsDataPath)
        return getLine(this.productsDataPath, generateRandomInt(1,this.totalProducts))
    }

    async getProductsList(){
        let arrayOfProducts = [];
        for (let i = 0; i < generateRandomInt(1, 5); i++) {
            arrayOfProducts.push(await this.getProduct())
        }
        return arrayOfProducts
    }

    async generateOrder(){
        let customerId = await this.getCustomer();
        let productsList = await this.getProductsList();
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
                "product_id": product,
                "quantity": generateRandomInt(1,3)
            })),
            "billing_address": billingAddress
        }
        return order
    }

    async postOrder(){
        let order = await this.generateOrder();
        return await fetch(`${BIGCOMMERCE_API_URL}/v2/orders.json`,{
            method: "POST",
            headers:{
                "X-Auth-Token": BIGCOMMERCE_AUTH_TOKEN,
                "X-Auth-Client": BIGCOMMERCE_CLIENT_ID,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        }).then(resp => resp.json())
    }
}