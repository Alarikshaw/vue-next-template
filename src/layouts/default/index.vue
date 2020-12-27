<template>
    <div>
        主体布局
        <button @click="handleLoginOut">退出</button>
    </div>
</template>
<script lang="ts">
import Vue, { defineComponent } from 'vue'
import { userStore } from '/@/store/modules/user'

export default defineComponent ({
    name: 'layout',
    setup(){
        function handleLoginOut() {
            userStore.confirmLoginOut();
        };
        return {
            handleLoginOut
        }
    }
})
</script>
