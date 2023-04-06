<template>
  <div :id="'chart-container' + id" style="height:93%"></div>
</template>

<script>
import {
  lightningChart,
  PieChartTypes,
  LegendBoxBuilders,
  SliceLabelFormatters,
  Themes,
} from '@arction/lcjs';
import { createProgressiveTraceGenerator } from '@arction/xydata';
import request from '@/utils/request';

export default {
  data() {
    return {};
  },
  props: ['id'],
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    this.test();
  },
  methods: {
    test() {
      const pieType =
        window.innerWidth > 599
          ? PieChartTypes.LabelsOnSides
          : PieChartTypes.LabelsInsideSlices;

      const pie = lightningChart({
        resourcesBaseUrl: `${window.location.origin}${window.location.pathname}resources`,
      })
        // .ChartXY({
        //   container: document.getElementById('chart-container' + this.id),
        //   // NOTE: Effects are implemented quite performantly, but regardless, best performance is got without them.
        // })
        .Pie({
          // theme: Themes.darkGold
          type: pieType,
          container: 'chart-container' + this.id,
        })
        .setTitle('Project Time Division')
        .setMultipleSliceExplosion(true);

      // ----- User defined data -----
      const data = [
        {
          name: 'Planning',
          value: 40,
        },
        {
          name: 'Development',
          value: 120,
        },
        {
          name: 'Testing',
          value: 60,
        },
        {
          name: 'Review',
          value: 24,
        },
        {
          name: 'Bug Fixing',
          value: 90,
        },
      ];

      // ----- Create Slices -----
      const slices = data.map((item) => pie.addSlice(item.name, item.value));

      // Specify function which generates text for Slice Labels(LabelFormatter).

      pie.setLabelFormatter(SliceLabelFormatters.NamePlusRelativeValue);

      // ----- Add LegendBox -----
      pie
        .addLegendBox(LegendBoxBuilders.VerticalLegendBox)
        // Dispose example UI elements automatically if they take too much space. This is to avoid bad UI on mobile / etc. devices.
        .setAutoDispose({
          type: 'max-width',
          maxWidth: 0.3,
        })
        .add(pie);
    },
    handleSubmit(e) {
      e.preventDefault();
      const {
        form: { validateFields },
        Login,
      } = this;

      this.loginBtn = true;
      const validateFieldsKey = ['username', 'password'];
      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          console.log('login form', values);
          const password = values.password;
          const loginParams = { ...values };
          delete loginParams.username;
          loginParams['username'] = values.username;
          // 一定要用utf8生成密钥，不然无法用java解密
          // 长度128bit,192bit,256bit之一
          var key = CryptoJS.enc.Utf8.parse('qwertyuiqwertyui');
          var cipher = CryptoJS.AES.encrypt(values.password, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
          });
          let aesEncryptPassword = cipher.ciphertext.toString(
            CryptoJS.enc.Base64
          );
          //loginParams.password = md5(values.password)
          loginParams.password = aesEncryptPassword;
          Login(loginParams)
            .then((res) => this.loginSuccess(loginParams, password, res))
            .catch((err) => this.requestFailed(err))
            .finally(() => {
              this.loginBtn = false;
            });
        } else {
          setTimeout(() => {
            this.loginBtn = false;
          }, 600);
        }
      });
    },
  },
};
</script>

<style scoped></style>
