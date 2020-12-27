import type { Router, RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '../constant';
import { PageEnum } from '/@/enums/pageEnum';
import { appStore } from '/@/store/modules/app';
import { permissionStore } from '/@/store/modules/permission';
import { getToken } from '/@/utils/auth';

const LOGIN_PATH = PageEnum.BASE_LOGIN;

const whitePathList: PageEnum[] = [LOGIN_PATH];
export function createPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    console.log('是否');
    // 根据传入的路由先行判断是否进入首页或者进入404页面
    if (from.path === LOGIN_PATH && to.name === PAGE_NOT_FOUND_ROUTE.name) {
      next(PageEnum.BASE_HOME);
      return;
    }

    // 进入白名单中
    if (whitePathList.includes(to.path as PageEnum)) {
      next();
      return;
    }

    /**
     * 获取用户token
     */
    const token = getToken();
    console.log('per token', token, !token);
    if (!token) {
      // 如果无token，则规则自定
      // 一般是重定向登录页
      const redirectData: { path: string; replace: boolean; query?: Indexable<string> } = {
        path: LOGIN_PATH,
        replace: true,
      };
      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.path,
        };
      }
      next(redirectData);
      return;
    }

    if (permissionStore.getIsDynamicAddedRouteState) {
      next();
      return;
    }
    const routes = await permissionStore.buildRoutesAction();
    console.log('per routes', routes);
    routes.forEach((route) => {
      // router.addRoute(RootRoute.name!, route as RouteRecordRaw);
      router.addRoute(route as RouteRecordRaw);
    });

    const redirectPath = (from.query.redirect || to.path) as string;
    const redirect = decodeURIComponent(redirectPath);
    const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
    permissionStore.commitDynamicAddedRouteState(true);
    next(nextData);
  });
  router.afterEach((to) => {
    // 进入登录界面，并且清除用户相关信息
    console.log('重置');
    if (to.path === LOGIN_PATH) {
      appStore.resumeAllState();
    }
  });
}
