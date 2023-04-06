<template>
  <div :class="wrpCls">
    <avatar-dropdown
      :menu="showMenu"
      :current-user="currentUser"
      :class="prefixCls"
      @editPassword="editPassword"
    />
    <password
      ref="createPassword"
      :visible="pw_visible"
      :loading="pw_confirmLoading"
      @cancel="pw_handleCancel"
      @ok="pw_handleOk"
    />
    <!-- <select-lang :class="prefixCls" /> -->
    <!-- <div class="user-view" :class="prefixCls" v-if="currentUser && currentUser.name">
      <a-avatar
        size="default"
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        class="antd-pro-global-header-index-avatar"
      />
      <div class="title-class">{{ currentUser.name }}</div>
      <a-popconfirm
        title="确定退出当前用户吗?"
        ok-text="确认"
        cancel-text="取消"
        @confirm="loginOut()"
      >
        <div class="outLog-class">
          <a-icon type="logout" class="icon-class" />
          <span class="title-class">退出系统</span>
        </div>
      </a-popconfirm>
    </div>
    <span v-else class="spin-class">
      <a-spin />
    </span> -->
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown';
import SelectLang from '@/components/SelectLang';
// import Password from "@/views/material/set/user/Password";
import { editPassword } from '@/api/account';
import storage from 'store';
import store from '../../store';
import { ACCESS_TOKEN } from '@/store/mutation-types';
import { mapState } from 'vuex';
import Storage from '@/utils/storage';
import CryptoJS from 'crypto-js';
export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    SelectLang,
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action',
    },
    isMobile: {
      type: Boolean,
      default: () => false,
    },
    topMenu: {
      type: Boolean,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showMenu: true,
      currentUser: {},
      role_country: false,

      /* create password */
      pw_visible: false,
      pw_confirmLoading: false,
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  computed: {
    ...mapState({
      info: (state) => state.user.info,
    }),
    wrpCls() {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${
          this.isMobile || !this.topMenu ? 'light' : this.theme
        }`]: true,
      };
    },
  },
  mounted() {
    setTimeout(() => {
      let name = this.info.realName;
      this.currentUser = {
        name,
      };
    }, 1500);
  },
  methods: {
    loginOut() {
      store.commit('SET_TOKEN', '');
      store.commit('SET_ROLES', []);
      storage.remove(ACCESS_TOKEN);
      this.$router.push({ name: 'login' });
    },
    editPassword() {
      this.pw_visible = true;
    },
    pw_handleOk() {
      const form = this.$refs.createPassword.form;
      this.pw_confirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values);
          var key = CryptoJS.enc.Utf8.parse('qwertyuiqwertyui');
          var cipher = CryptoJS.AES.encrypt(values.password, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
          });
          let aesEncryptPassword = cipher.ciphertext.toString(
            CryptoJS.enc.Base64
          );
          editPassword(aesEncryptPassword).then((res) => {
            if (res.code == 200) {
              this.loginOut();
              this.$message.info('操作成功');
            }
          });
        } else {
          this.pw_confirmLoading = false;
        }
      });
    },
    pw_handleCancel() {
      this.pw_visible = false;
      const form = this.$refs.createPassword.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.pw_confirmLoading = false;
    },
  },
};
</script>

<style scoped>
.user-view {
  display: flex;
  align-items: center;
}

.user-view .title-class {
  font-size: 15px;
  margin: 0 8px;
}

.user-view .outLog-class {
  margin: 0 20px;
}

.outLog-class .icon-class {
  font-size: 16px;
}

.spin-class {
  margin-right: 20px;
}

.required:after {
  color: #f5222d;
  font-size: 20px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '•';
}
</style>
