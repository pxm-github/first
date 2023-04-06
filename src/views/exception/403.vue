<template>
  <a-result status="403" title="403" sub-title="Sorry, you don't have access to this page.">
    <template #extra>
      <a-button type="primary" @click="toHome">
        Back Home
      </a-button>
    </template>
  </a-result>
</template>

<script>
import { mapState } from 'vuex';
import { roleDefulRouter } from '@/utils/defulRouter';
export default {
  name: 'Exception403',
  methods: {
    toHome() {
      let redirect = roleDefulRouter(this.roles.permissionList[0]);
      this.$router.push({ path: redirect });
    },
  },
  computed: {
    ...mapState({
      roles: state => state.user.roles,
    }),
  },
};
</script>
