import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const dashboard: AppRouteModule = {
  path: '/home',
  name: 'Home',
  component: LAYOUT,
  redirect: '/home/welcome',
  meta: {
    icon: 'bx:bx-home',
    title: '首页',
  },
  children: [
    {
      path: 'welcome',
      name: 'Welcome',
      component: () => import('/@/views/dashboard/welcome/index.vue'),
      meta: {
        title: '首页',
        affix: true,
        icon: 'bx:bx-home',
      },
    },
  ],
};

export default dashboard;
