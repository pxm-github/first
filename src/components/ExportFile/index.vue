<!-- 文件上传 -->
<template>
  <div>
    <a-upload
      :action="action"
      :headers="headers"
      :before-upload="beforeUpload"
      @change="handleChange"
      :showUploadList="false"
      :fileList="fileList"
    >
      <a-button type="primary" class="rightBut" :loading="exportLoading"
        >导入</a-button
      >
    </a-upload>
    <a-modal
      title="导入结果"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :width="640"
      :footer="null"
      class="heightModel"
    >
      <p v-for="(item, index) in msgArr" :key="index">{{ item }}</p>
    </a-modal>
  </div>
</template>

<script>
import storage from "store";
import { ACCESS_TOKEN } from "@/store/mutation-types";
export default {
  props: {
    /* 上传地址 */
    action: {
      type: String,
    },
  },
  data() {
    return {
      headers: {
        authorization: storage.get(ACCESS_TOKEN),
      },
      fileList: [],
      visible: false,
      msgArr: [],
      exportLoading: false,
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
  methods: {
    // 校验附件
    beforeUpload(e) {
      return new Promise((reslove, reject) => {
        const fileTypeStr = ["xls", "xlsx"];
        const isLt100M = e.size / 1024 / 1024 < 8;
        if (!isLt100M) {
          this.$message.error("附件大于8MB，无法上传");
          reject(new Error());
          return;
        }
        let filename = e.name;
        const index = filename.lastIndexOf(".");
        filename = filename.substr(index + 1);
        if (fileTypeStr.includes(filename.toLocaleLowerCase())) {
          reslove(true);
        } else {
          this.$message.error("文件格式不正确");
          reject(new Error());
        }
      });
    },
    // 上传附件
    handleChange(info) {
      this.exportLoading = true;
      if (info.file.status !== "removed") {
        this.confirmLoading = true;
      }
      let fileList = [...info.fileList];
      this.fileList = fileList;
      fileList = fileList.map((file) => {
        if (file.response) {
          this.confirmLoading = false;
          if (file.response.code !== 200) {
            this.fileList = [];
            this.$message.error(file.response.msg || "服务端发生错误");
            return;
          } else {
            this.msgArr = file.response.msg.split(";");
            this.visible = true;
            this.fileList = [];
            this.exportLoading = false;
            this.$emit("ok");
          }
        }
      });
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
