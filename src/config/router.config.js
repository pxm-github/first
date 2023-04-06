// eslint-disable-next-line
/* 配置路由信息 
（Pro 中的路由为了方便管理，使用了中心化的方式，在 router.config.js 统一配置和管理。）*/
import { UserLayout, BasicLayout, RouteView } from '@/layouts';
import { bxAnaalyse } from '@/core/icons';

// const RouteView = {
//   name: 'RouteView',
//   render: h => h('router-view'),
// };

export const myRouter = [
  /* 零件管理 */
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/MemoryStats/MainView'),
    meta: {
      title: '首页',
      icon: 'home',
      permission: ['home'],
    },
  },
];

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/home',
    children: [...myRouter],
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
];

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/404',
    component: () =>
      import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
  },
  ...myRouter,
];
