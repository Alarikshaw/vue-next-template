import type {
  LoginParams,
  GetUserInfoByUserIdModel,
  GetUserInfoByUserIdParams,
} from '/@/api/sys/model/userModel';
import store from '/@/store/index';
import { VuexModule, Module, getModule, Mutation, Action } from 'vuex-module-decorators';
import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';

import { PageEnum } from '/@/enums/pageEnum';
import { ErrorMessageMode } from '/@/utils/http/axios/types';
/**
 * 弹出框
 */
import { useMessage } from '/@/hooks/web/useMessage';
import router from '/@/router';
import { RoleEnum } from '/@/enums/roleEnum';
import { setLocal, getLocal, setSession, getSession } from '/@/utils/helper/persistent';
import { CacheTypeEnum, USER_INFO_KEY, ROLES_KEY, TOKEN_KEY } from '/@/enums/cacheEnum';
import { useProjectSetting } from '/@/hooks/setting';
export type UserInfo = Omit<GetUserInfoByUserIdModel, 'roles'>;
const NAME = 'user';
hotModuleUnregisterModule(NAME);
const { permissionCacheType } = useProjectSetting();
function setCache(USER_INFO_KEY: string, info: any) {
  if (!info) return;
  // const fn = permissionCacheType === CacheTypeEnum.LOCAL ? setLocal : setSession;
  setLocal(USER_INFO_KEY, info, true);
  // TODO
  setSession(USER_INFO_KEY, info, true);
}
function getCache<T>(key: string) {
  const fn = permissionCacheType === CacheTypeEnum.LOCAL ? getLocal : getSession;
  return fn(key) as T;
}

@Module({ namespaced: true, name: NAME, dynamic: true, store })
class User extends VuexModule {
  /**
   * 用户信息
   */
  private userInfoState: any | null = null;
  /**
   * 用户token
   */
  private tokenState = '';

  // roleList
  private roleListState: RoleEnum[] = [];
  /**
   * 获取用户信息方法
   */
  get getUserInfoState(): any {
    return this.userInfoState || getCache<UserInfo>(USER_INFO_KEY) || {};
  }
  /**
   * 获取用户token方法
   */
  get getTokenState(): string {
    return this.tokenState || getCache<string>(TOKEN_KEY);
  }
  get getRoleListState(): RoleEnum[] {
    return this.roleListState.length > 0 ? this.roleListState : getCache<RoleEnum[]>(ROLES_KEY);
  }
  /**
   * 清空用户相关信息
   */
  @Mutation
  commitResetState(): void {
    this.userInfoState = null;
    this.tokenState = '';
    this.roleListState = [];
  }

  /**
   * 设置用户信息
   * @param info 传入的信息
   */
  @Mutation
  commitUserInfoState(info: any): void {
    this.userInfoState = info;
    setCache(USER_INFO_KEY, info);
  }
  /**
   * 设置用户token
   * @param info 传入的token
   */
  @Mutation
  commitTokenState(info: string): void {
    this.tokenState = info;
    console.log('设置的token', info);
    setCache(TOKEN_KEY, info);
  }
  @Mutation
  commitRoleListState(roleList: RoleEnum[]): void {
    this.roleListState = roleList;
    setCache(ROLES_KEY, roleList);
  }

  /**
   * 登录
   * @param params
   */
  @Action
  async login(
    params: LoginParams & {
      goHome?: boolean;
      mode?: ErrorMessageMode;
    }
  ): Promise<GetUserInfoByUserIdModel | null> {
    try {
      const { goHome = true, mode, ...loginParams } = params;
      //   const data = await loginApi(loginParams, mode);

      const { token, userId } = {
        token: params.username,
        userId: params.password,
      };
      const resData = {
        userId: params.password,
      };
      // get user info
      const userInfo = await this.getUserInfoAction(resData);
      console.log('user.ts userInfo', userInfo);
      console.log('user.ts token', token);
      // save token
      this.commitTokenState(token);

      // const name = FULL_PAGE_NOT_FOUND_ROUTE.name;
      // name && router.removeRoute(name);
      goHome && (await router.replace(PageEnum.BASE_HOME));
      return userInfo;
    } catch (error) {
      return null;
    }
  }

  @Action
  async getUserInfoAction(params: GetUserInfoByUserIdParams) {
    // const userInfo = await getUserInfoById({ userId });
    this.commitUserInfoState(params);
    return params;
  }

  /**
   * 退出登录
   */
  @Action
  async loginOut(goLogin = false) {
    goLogin && router.push(PageEnum.BASE_LOGIN);
  }
  /**
   * @description: Confirm before logging out
   */
  @Action
  async confirmLoginOut() {
    const { createConfirm } = useMessage();
    createConfirm({
      iconType: 'warning',
      title: '温馨提醒',
      content: '是否确认退出系统?',
      onOk: async () => {
        await this.loginOut(true);
      },
    });
  }
}
export const userStore = getModule<User>(User);
