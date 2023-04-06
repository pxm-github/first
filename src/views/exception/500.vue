<template>
  <a-result status="500" title="500" sub-title="Sorry, the server is reporting an error.">
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
  name: 'Exception500',
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
