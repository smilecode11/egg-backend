/** 扩展 application */
import { Application } from 'egg';
import axios, { AxiosInstance } from 'axios';
const AXIOS = Symbol('Application#axios');

export default {
  // 方法扩展
  echo(msg: string) {
    const _self = this as unknown as Application;
    return `hello, ${msg} ${_self.config.name}`;
  },
  //  属性扩展
  get axiosInstance(): AxiosInstance {
    if (!this[AXIOS]) {
      this[AXIOS] = axios.create({
        baseURL: 'https://dog.ceo/',
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
          'Accept-Encoding': 'x-www-form-urlencoded', //  axios 需要设置该项
        },
        // responseType: 'json',
        // transformRequest: [ function(data, headers) {
        //   console.log('_transformRequest', data, headers);
        //   return data;
        // } ],
        // transformResponse: [ function(data) {
        //   console.log('_transformResponse', data);
        //   return data;
        // } ],
      });
    }
    return this[AXIOS];
  },
};
