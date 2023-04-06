<template>
  <router-view />
</template>

<script>
export default {
  name: 'UserLayout',

  mounted() {},
};
</script>

<style lang="less" scoped>
#userLayout {
  height: 100vh;
}

#userLayout .head {
  height: 13vh;
  width: 100%;
  display: flex;
  align-items: center;
}

.logoImg {
  width: 50px;
  margin-right: 21px;
  margin-left: 89px;
}

.logo-txt {
  font-size: 32px;
  color: #333333;
  font-weight: bold;
}

#userLayout .center {
  height: 100vh;
  background-image: url(~@/assets/login/cover.jpg);
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}

#userLayout .foot {
  height: 11vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.foot-title {
  text-align: center;
  line-height: 25px;
  font-size: 14px;
  color: #666666;
}
</style>
