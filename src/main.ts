import { createApp } from 'vue';
import App from '/@/App.vue';

import router, { setupRouter } from '/@/router';
import { setupAntd } from '/@/setup/ant-design-vue';

const app = createApp(App);
import '/@/design/index.less';

/**
 * 配置路由
 */
setupRouter(app);

router.isReady().then(() => {
  app.mount('#app');
});

setupAntd(app);
