<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <router-view />
</template>

<script>
  import Login from '/@/views/sys/login/Login.vue';

  export default {
    name: 'App',
    components: {
      Login,
    },
  };
</script>
