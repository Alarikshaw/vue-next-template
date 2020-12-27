/**
 * 用户登录参数
 */
export interface LoginParams {
  username: string;
  password: string;
}

/**
 * 获取用户信息
 */
export interface GetUserInfoByUserIdParams {
  userId: string | number;
}

/**
 * 获取角色信息
 */
export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * 登录界面返回值
 */

export interface LoginResultModel {
  userId: string;
  token: string;
  role: RoleInfo;
}
/**
 * @description: Get user information return value
 */
export interface GetUserInfoByUserIdModel {
  role?: RoleInfo;
  // 用户id
  userId?: string | number;
  // 用户名
  username?: string;
  // 真实名字
  realName?: string;
  // 介绍
  desc?: string;
}
