require('es6-promise').polyfill();
require('isomorphic-fetch');
import { Observable } from 'rxjs';
import BigCommerceSystem from './bigcommerce';
let program = require('commander');

const argv = require('yargs').argv


let generate = argv.generate || 'orders'
let count = argv.count || 10

let bigCommerceSystem = new BigCommerceSystem(count)
console.log(generate,count)
switch (generate) {
    case 'customer':
    case 'customers':
        Observable.fromPromise(bigCommerceSystem.initializeCustomers())
            .mergeMap(resp =>
                Observable.timer(0, 500)
                    .timeInterval()
            )
            .take(count)
            .mergeMap(resp => Observable.fromPromise(bigCommerceSystem.postCustomer()))
            .subscribe(
                data => console.log(data),
                err => console.error(err),
                () => console.log("Completed")
            )
        break;

    case 'products':
    case 'product':
            console.log('here')
        Observable.fromPromise(bigCommerceSystem.initializeProducts())
            .mergeMap(resp =>
                Observable.timer(0, 500)
                    .timeInterval()
            )
            .take(count)
            .mergeMap(resp => Observable.fromPromise(bigCommerceSystem.postProduct()))
            .subscribe(
                data => console.log(data),
                err => console.error(err),
                () => console.log("Completed")
            )
        break;

    case 'order':
    case 'orders':
    default:
        Observable.timer(0, 500)
            .timeInterval()
            .take(count)
            .mergeMap(resp => bigCommerceSystem.postOrder())
            .subscribe(
                data => console.log(data),
                err => console.error(err),
                () => console.log("Completed")
            )
        break;
}