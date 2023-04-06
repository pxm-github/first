import request from '@/utils/request';

const api = {
  users: 'users',
  resourceTree: 'resourceTree',
};

export default api;

export function getUsers(parameter) {
  return request({
    url: api.users,
    method: 'get',
    params: parameter,
  });
}

// id 为空 add     post
// id 不为空 update  PATCH
export function saveUsers(parameter) {
  return request({
    url: parameter.id ? `${api.users}/${parameter.id}` : api.users,
    method: parameter.id ? 'patch' : 'post',
    data: parameter,
  });
}

export function deleteUsers(id) {
  return request({
    url: `${api.users}/${id}`,
    method: 'delete',
  });
}

export function batchDelete(ids) {
  return request({
    url: api.users,
    method: 'delete',
    data: ids,
  });
}

/* 资源树形结构数据 */
export function getResourceTree() {
  return request({
    url: api.resourceTree,
    method: 'get',
  });
}

/* 分配角色 当前已选中的角色 */
export function getSelectRole(id) {
  return request({
    url: `users/${id}/roles`,
    method: 'get',
  });
}

/* 保存 当前已选中的角色 */
export function patchSelectRole(id, ids) {
  return request({
    url: `users/${id}/roles`,
    method: 'patch',
    data: ids,
  });
}

/* 重置密码 */
export function resetPassword(id) {
  return request({
    url: `users/${id}/resetpassword`,
    method: 'patch',
  });
}
/* 修改密码 */
export function editPassword(password) {
  return request({
    url: `/users/i/updatepwd`,
    method: 'patch',
    data: { password },
  });
}
