import Promise from 'bluebird';
Promise.config({
    longStackTraces: true,
    warnings: true
})

import tabs from '../core/tabs';
import { randomString } from '../core/utils';

tabs.getAllForCurrent();

console.log(randomString(12));
console.log(randomString(10));
console.log(randomString(10));
console.log(randomString(10));
console.log(randomString(10));
console.log(randomString(10));
console.log(randomString(10));
console.log(randomString(10));
