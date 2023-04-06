<template>
  <a-result
    status="404"
    title="404"
    sub-title="Sorry, the page you visited does not exist."
  >
    <template #extra>
      <a-button type="primary" @click="toHome"> Back Home </a-button>
    </template>
  </a-result>
</template>

<script>
import { mapState } from "vuex";
import { roleDefulRouter } from "@/utils/defulRouter";
export default {
  name: "Exception404",
  methods: {
    toHome() {
      let redirect = roleDefulRouter(this.roles.permissionList[0]);
      this.$router.push({ path: redirect });
    },
  },
  computed: {
    ...mapState({
      roles: (state) => state.user.roles,
    }),
  },
};
</script>
