/* 根据不同用户跳转默认打开鉴权后路由第一个页面 */
export const roleDefulRouter = (permission, router) => {
  let path = '';

  router.some(element => {
    if (element.name == permission) {
      path = element.path;
      return true;
    }
    if (element.children) {
      path = roleDefulRouter(permission, element.children);
      if (path != '') {
        return true;
      }
    }
  });
  return path;
};

export const getNameByPath = (path, router) => {
  let name = '';

  router.some(element => {
    if (element.path == path) {
      name = element.name;
      return true;
    }
    if (element.children) {
      name = getNameByPath(path, element.children);
      if (name != '') {
        return true;
      }
    }
  });
  return name;
};
