/* 路由守卫(路由权限控制)
在permission.js通过路由守卫，捕获到用户的登录事件
首先在登录时将用户的token信息存储在本地，路由守卫中通过storage方法将token取出进行判断，若token为空，系统还通过whiteList定义了免登录白名单检验，白名单中的这几个路由地址，无需token即可登录
其次，系统还会进行重复性的验证，若此账号登陆过本系统，这个账号的权限信息就会存储在vuex中，当第二次登录的时候，无需通过登录页，直接进入系统
如果该账号是第一次登录系统，未在本地获取到任何相关信息，则正式进入我们今天的主题权限管理 */
import router from './router';
import store from './store';
import storage from 'store';
import NProgress from 'nprogress'; // progress bar
import '@/components/NProgress/nprogress.less'; // progress bar custom style
import notification from 'ant-design-vue/es/notification';
import { setDocumentTitle, domTitle } from '@/utils/domUtil';
import { roleDefulRouter, getNameByPath } from '@/utils/defulRouter';
import { ACCESS_TOKEN } from '@/store/mutation-types';
import { i18nRender } from '@/locales';
import { myRouter } from '@/config/router.config';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const allowList = ['login', 'register', 'registerResult', 'home']; // 无重定向允许列表
const loginRoutePath = '/user/login';
const defaultRoutePath = '/dashboard/workplace';

router.beforeEach((to, from, next) => {
  NProgress.start(); // start progress bar
  to.meta &&
    typeof to.meta.title !== 'undefined' &&
    setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`);
  next();
  return;
  /* 判断是否拥有token */
  if (storage.get(ACCESS_TOKEN)) {
    if (to.path === loginRoutePath) {
      /* 如果有token,跳转到登录页默认重定向到系统首页 */
      next({ path: defaultRoutePath });
      NProgress.done();
    } else {
      // check login user.roles is null
      /* 检查用户的权限,若没有权限则进行获取权限,获取路由菜单;
         有权限路由菜单代表此用户已经获取路由菜单 */
      if (store.getters.roles.length === 0) {
        // request login userInfo
        store
          .dispatch('GetInfo')
          .then((res) => {
            const roles = res.data && res.data.role;
            // roles为用户的基础信息以及权限
            /* 在GetInfo的回调函数内，调用了GenerateRoutes方法，
              我们需要做的就是将在GetInfo中获取到的用户账号信息以参数的方式传递到GenerateRoutes中 */
            store.dispatch('GenerateRoutes', { roles }).then(() => {
              // 根据roles权限生成可访问的路由表
              // 动态添加可访问路由表
              router.addRoutes(store.getters.addRouters);
              // 请求带有 redirect 重定向时，登录自动重定向到该地址
              let redirect = decodeURIComponent(from.query.redirect || to.path);
              let name = getNameByPath(redirect, myRouter);
              if (roles.permissionList.indexOf(name) == -1) {
                redirect = roleDefulRouter(roles.permissionList[0], myRouter);
              }
              if (to.path === redirect) {
                // set the replace: true so the navigation will not leave a history record
                next({ ...to, replace: true });
              } else {
                // 跳转到目的路由
                next({ path: redirect });
              }
            });
          })
          .catch(() => {
            notification.error({
              message: '错误',
              description: '请求用户信息失败，请重试',
            });
            // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
            // store.dispatch('Logout').then(() => {
            //   next({ path: loginRoutePath, query: { redirect: to.fullPath } })
            // })
            store.commit('SET_TOKEN', '');
            store.commit('SET_ROLES', []);
            storage.remove(ACCESS_TOKEN);
            window.location.reload();
          });
      } else {
        next();
      }
    }
  } else {
    if (allowList.includes(to.name)) {
      // 在免登录名单，直接进入
      next();
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } });
      NProgress.done(); // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
});

router.onError((error) => {
  const pattern = /Loading chunk (\w)+ failed/g;
  const isError = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  if (isError) {
    router.replace(targetPath);
  }
});

router.afterEach(() => {
  NProgress.done(); // finish progress bar
});
