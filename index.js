require('es6-promise').polyfill();
require('isomorphic-fetch');
import { Observable } from 'rxjs';
import BigCommerceSystem from './bigcommerce';
import { TOTAL_ORDERS } from "./config";
let bigCommerceSystem = new BigCommerceSystem('./data/customers.csv', './data/products.csv')

Observable.timer(0, 500)
    .timeInterval()
    .mergeMap(resp => bigCommerceSystem.postOrder())
    .take(TOTAL_ORDERS)
    .subscribe(
        data => console.log(data),
        err => console.error(err),
        () => console.log("Completed")
)
