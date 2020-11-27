<template>
  <div class="login">
    <div>这是测试s</div>
    <div>{{ msg }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  setup() {},
});
</script>
