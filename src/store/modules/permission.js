/* 获取登陆用户信息以及权限 */
import { asyncRouterMap, constantRouterMap } from '@/config/router.config';
// 从lodash中引入深拷贝
import cloneDeep from 'lodash.clonedeep';

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 * 此方法将（上文提到）我们特意转换过格式的用户权限数组集合，以及循环解析后的单条路由信息传递过去，这个方法的主要目的是进行相互匹配操作
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */

/* 这个函数就是将用户的权限信息，与每一条路由相对应的权限进行includes操作

如果用户的权限与某一条路由表的权限匹配成功即代表用户拥有这条权限，返回true，匹配失败则返回false，将结果return回filterAsyncRouter函数中。

最终在filterAsyncRouter函数内，定义变量accessedRouters用来接收过滤器过滤后产生的新数组，将这个数组return回vuex的GenerateRoutes函数内，
vuex将这个数组存储到全局变量中，至此。我们就获取到根据权限所匹配出的正确路由权限表
————————————————
版权声明：本文为CSDN博主「晋晋晋晋崔」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/weixin_45884080/article/details/106803937 */
function hasPermission(permission, route) {
  /* permission:当前用户的所有的权限
     route:所有的路由信息
  */
  if (route.meta && route.meta.permission) {
    let flag = false;
    for (let i = 0, len = permission.length; i < len; i++) {
      flag = route.meta.permission.includes(permission[i]);
      if (flag) {
        return true;
      }
    }
    return false;
  }
  return true;
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roles.id);
  } else {
    return true;
  }
}

/* 此方法接收两个参数，一个参数是系统中的全局路由，一个是我们传递过来的用户权限信息，
  通过js的filter方法，进行过滤操作，这里用到了es6语法中的箭头函数，其实箭头符号后的关键字route，
  我们就可以理解成将整个路由表进行循环解析后的每单条路由信息 */
function filterAsyncRouter(routerMap, roles) {
  // 增加此行是因为如果不深拷贝，会更改原路由表，当切换用户时，会出现用户该有的菜单无法显示
  let asyncRouterMap = cloneDeep(routerMap);
  /* routerMap:所有的路由信息 */
  /* roles:用户的权限,信息 */
  /* 只返回 用户权限跟路由权限相互匹配成功的路由 */
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles.permissionList, route)) {
      if (route.children && route.children.length) {
        /* 子路由也进行匹配,传递的参数顺序正反无所谓,因为是进行相互匹配 */
        route.children = filterAsyncRouter(route.children, roles);
      }
      return true;
    }
    return false;
  });
  return accessedRouters;
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    },
  },
  actions: {
    /* 根据不同的权限获取路由表 */
    /* 在GenerateRoutes方法中定义了accessedRouters参数，这个参数其实就是我们最终想要的根据账号权限匹配后的正确路由，但获取这个参数我们主要经历了如下几个步骤：
      第一步
      定义过滤器filterAsyncRouter方法，此方法接收两个参数
      routerMap：系统中全部路由表
      调用位置在src–store–modules–permission.js的第一行
      roles：我们传递过来，登陆用户的权限信息
      ————————————————
      版权声明：本文为CSDN博主「晋晋晋晋崔」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
      原文链接：https://blog.csdn.net/weixin_45884080/article/details/106803937 */
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data;
        /* 过滤器将路由中匹配的路由过滤出来,并且将过滤出来的路由存储到VueX中 */
        const accessedRouters = filterAsyncRouter(asyncRouterMap, roles);
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      });
    },
  },
};

export default permission;
