<template>
  <div class="login">
    <div class="login-mask" />
    <div class="login-form-wrap">
      <div class="login-form mx-6">
        <div class="login-form__content px-2 py-10">
          <header>
            <h1>vue-next-template</h1>
          </header>

          <a-form class="mx-auto mt-10" :model="formData" :rules="formRules" ref="formRef">
            <a-form-item name="account">
              <a-input size="large" v-model:value="formData.account" placeholder="username" />
            </a-form-item>
            <a-form-item name="password">
              <a-input-password
                size="large"
                visibilityToggle
                v-model:value="formData.password"
                placeholder="password"
              />
            </a-form-item>
            <a-row>
              <a-col :span="12">
                <a-form-item>
                  <a-checkbox v-model:checked="autoLogin" size="small">自动登录</a-checkbox>
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item>
              <a-button
                type="primary"
                size="large"
                class="rounded-sm"
                :block="true"
                @click="login"
                :loading="formState.loading"
                >登录</a-button
              >
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, unref, toRaw } from 'vue';
  import { Checkbox } from 'ant-design-vue';

  import { Button } from '/@/components/Button';
  // import { BasicDragVerify, DragVerifyActionType } from '/@/components/Verify/index';

  import { userStore } from '/@/store/modules/user';

  // import { appStore } from '/@/store/modules/app';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    components: {
      //  BasicDragVerify,
      AButton: Button,
      ACheckbox: Checkbox,
    },
    setup() {
      const formRef = ref<any>(null);
      const autoLoginRef = ref(false);
      const { notification } = useMessage();
      const formData = reactive({
        account: 'userName',
        password: '123456',
      });

      const formState = reactive({
        loading: false,
      });

      const formRules = reactive({
        account: [{ required: true, message: '填写用户名', trigger: 'blur' }],
        password: [
          { required: true, message: '输入密码', trigger: 'blur' },
        ],
      });
      async function handleLogin() {
        const form = unref(formRef);
        if (!form) return;
        formState.loading = true;
        try {
          const data = await form.validate();
          const userInfo = await userStore.login(
            toRaw({
              password: data.password,
              username: data.account,
            })
          );
          console.log('userInfo', userInfo)
          if (userInfo) {
            notification.success({
              message: '登录成功',
              description: '欢迎回来',
              duration: 3,
            });
          }
        } catch (error) {
        } finally {
          formState.loading = false;
        }
      }
      return {
        formRef,
        formData,
        formState,
        formRules,
        login: handleLogin,
        autoLogin: autoLoginRef,
      };
    },
  });
</script>
<style lang="less">
  @import (reference) '../../../design/index.less';

  .login-form__locale {
    position: absolute;
    top: 14px;
    right: 14px;
    z-index: 1;
  }

  .login {
    position: relative;
    height: 100vh;
    min-width: 1200px;
    background: url(../../../assets/images/login/bannerimgs.jpg) no-repeat;
    background-size: 100% 100%;


    &-mask {
      display: none;
      height: 100%;
    //   background: url(../../../assets/images/login/login-in.png) no-repeat;
      background-position: 30% 30%;
      background-size: 80% 80%;

      .respond-to(xlarge, { display: block;});
    }

    &-form {
      position: relative;
      bottom: 60px;
      width: 400px;
      background: @white;
    //   border: 10px solid rgba(255, 255, 255, 0.5);

      border-width: 0;
      border-radius: 10px;
      background-clip: padding-box;
      .respond-to(xlarge, { margin: 0 120px 0 50px});

      &-wrap {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        width: 100%;
        height: 100%;
        // height: 90%;
        justify-content: center;
        align-items: center;
        .respond-to(xlarge, {
        // justify-content: flex-end;
          });
      }

      &__content {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 60px 0 40px 0;
        border: 1px solid #999;
        border: none;
        border-radius: 2px;

        header {
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            display: inline-block;
            width: 48px;
          }

          h1 {
            margin-bottom: 0;
            font-size: 24px;
            text-align: center;
          }
        }

        form {
          width: 80%;
        }
      }
    }
  }
</style>
