import axios from 'axios';
import store from '@/store';
import storage from 'store';
import notification from 'ant-design-vue/es/notification';
import { VueAxios } from './axios';
import { ACCESS_TOKEN, CAPTAHCHAT_TOKEN } from '@/store/mutation-types';
import { message } from 'ant-design-vue';
import qs from 'qs';

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 120000, // 请求超时时间
});

// 异常拦截处理器
const errorHandler = (error) => {
  // storage.remove(ACCESS_TOKEN);
  if (error.response) {
    const data = error.response.data;
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN);
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message,
      });
    }
    if (
      error.response.status === 401 &&
      !(data.result && data.result.isLogin)
    ) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed',
      });
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            storage.remove(ACCESS_TOKEN);
            window.location.reload();
          }, 1500);
        });
      }
    } else {
      if (error.response.data && error.response.data.msg) {
        notification.error({
          message: error.response.data.msg,
        });
      } else {
        notification.error({
          message: '服务器异常,请稍后再试',
        });
      }
    }
  }
  return Promise.reject(error);
};

// request interceptor
request.interceptors.request.use((config) => {
  const token = storage.get(ACCESS_TOKEN);
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['Authorization'] = token;
  }
  if (config.method === 'get') {
    config.paramsSerializer = function(params) {
      return qs.stringify(params, { arrayFormat: 'repeat' });
    };
  }
  return config;
}, errorHandler);

// response interceptor
request.interceptors.response.use((response) => {
  if (response.headers.authorization) {
    storage.set(
      ACCESS_TOKEN,
      response.headers.authorization,
      7 * 24 * 60 * 60 * 1000
    );
    store.commit('SET_TOKEN', response.headers.authorization);
  }
  if (response.data.code !== 200) {
    message.error(response.data.msg);
  }
  return response.data;
}, errorHandler);

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request);
  },
};

export default request;

export { installer as VueAxios, request as axios };
