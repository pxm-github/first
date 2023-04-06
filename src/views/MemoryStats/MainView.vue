<!-- 登录 -->
<template>
  <div style="display:flex;height:100%">
    <div style="border: 2px solid black;">
      <a-tree
        :load-data="onLoadData"
        :tree-data="treeData"
        style="width:10%"
        defaultExpandAll
      />
    </div>
    <div style="display:flex;height:100%;flex-direction:column;width:100%">
      <div id="chart-container" style="height:30%"></div>
      <div style="height:70%">
        <a-tabs
          default-active-key="1"
          @change="callback"
          style="height:100%"
          class="test"
        >
          <a-tab-pane
            :key="index"
            :tab="item"
            v-for="(item, index) in tabFormNames"
            style="height:100%"
          >
            <component :is="item" :id="index" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import {
  disableThemeEffects,
  emptyFill,
  lightningChart,
  Themes,
  UIElementBuilders,
  UILayoutBuilders,
  UIOrigins,
} from '@arction/lcjs';
import { createProgressiveTraceGenerator } from '@arction/xydata';
import request from '@/utils/request';
import ClassesView from './TabView/ClassesView.vue';
import CallgraphView from './TabView/CallgraphView.vue';
import ExclusiveView from './TabView/ExclusiveView.vue';
import CallstackHistory from './TabView/CallstackHistory.vue';
import HeatmapView from './TabView/HeatmapView.vue';
import CompareView from './TabView/CompareView.vue';
import RHIResourceView from './TabView/RHIResourceView.vue';
import UObjectView from './TabView/UObjectView.vue';
import UnLuaView from './TabView/UnLuaView.vue';

export default {
  data() {
    return {
      treeData: [
        {
          title: 'Local',
          key: '0',
          children: [
            {
              title: '2023-02-08',
              key: '1',
              children: [
                {
                  title: '12-02-13(905.18M, 1397.69M).log',
                  key: '2',
                  isLeaf: true,
                },
                {
                  title: '15-01-29(692.28M, 776.88M).log',
                  key: '3',
                  isLeaf: true,
                },
              ],
            },
          ],
        },
      ],
      tabFormNames: [
        'CallgraphView',
        'ExclusiveView',
        'CallstackHistory',
        'ClassesView',
        'HeatmapView',
        'CompareView',
        'RHIResourceView',
        'UObjectView',
        'UnLuaView',
      ],
    };
  },
  components: {
    ClassesView,
    CallgraphView,
    ExclusiveView,
    CallstackHistory,
    HeatmapView,
    CompareView,
    RHIResourceView,
    UObjectView,
    UnLuaView,
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    this.test();
  },
  methods: {
    onLoadData(treeNode) {
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        setTimeout(() => {
          treeNode.dataRef.children = [
            { title: 'Child Node', key: `${treeNode.eventKey}-0` },
            { title: 'Child Node', key: `${treeNode.eventKey}-1` },
          ];
          this.treeData = [...this.treeData];
          resolve();
        }, 1000);
      });
    },
    test() {
      // Use theme if provided
      const urlParams = new URLSearchParams(window.location.search);
      let theme = Themes[urlParams.get('theme')] || Themes.darkGold;

      const dataAmountNumber = 5 * 1000 * 1000;
      const dataAmountString = `${dataAmountNumber / 10 ** 6}M`;

      const chart = lightningChart({
        resourcesBaseUrl: `${window.location.origin}${window.location.pathname}resources`,
      })
        .ChartXY({
          container: document.getElementById('chart-container'),
          // NOTE: Effects are implemented quite performantly, but regardless, best performance is got without them.
          theme: disableThemeEffects(theme),
        })
        .setTitleFillStyle(emptyFill)
        .setPadding({ right: 40 });

      const axisX = chart.getDefaultAxisX();
      const axisY = chart.getDefaultAxisY();

      const series = chart.addLineSeries({
        dataPattern: {
          pattern: 'ProgressiveX',
          regularProgressiveStep: true,
        },
      });
      const series2 = chart.addLineSeries({
        dataPattern: {
          pattern: 'ProgressiveX',
          regularProgressiveStep: true,
        },
      });

      const uiLayout = chart
        .addUIElement(UILayoutBuilders.Column, { x: axisX, y: axisY })
        .setOrigin(UIOrigins.LeftTop);

      const positionUiLayout = () => {
        uiLayout.setPosition({
          x: axisX.getInterval().start,
          y: axisY.getInterval().end,
        });
      };
      positionUiLayout();
      axisX.onIntervalChange(positionUiLayout);
      axisY.onIntervalChange(positionUiLayout);

      const labelGenerate = uiLayout
        .addElement(UIElementBuilders.TextBox)
        .setText(`Generating ${dataAmountString} data points...`);
      const labelGenerateResult = uiLayout
        .addElement(UIElementBuilders.TextBox)
        .setText(``)
        .setTextFont((font) => font.setWeight('bold').setSize(12));
      const labelAppend = uiLayout
        .addElement(UIElementBuilders.TextBox)
        .setText(``);
      const labelAppendResult = uiLayout
        .addElement(UIElementBuilders.TextBox)
        .setText(``)
        .setTextFont((font) => font.setWeight('bold').setSize(12));
      const labelRender = uiLayout
        .addElement(UIElementBuilders.TextBox)
        .setText(``);
      const labelRenderResult = uiLayout
        .addElement(UIElementBuilders.TextBox)
        .setText(``)
        .setTextFont((font) => font.setWeight('bold').setSize(12));
      const labelSubsequentRender = uiLayout
        .addElement(UIElementBuilders.TextBox)
        .setText(``);
      const labelSubsequentRenderResult = uiLayout
        .addElement(UIElementBuilders.TextBox)
        .setText(``)
        .setTextFont((font) => font.setWeight('bold').setSize(12));

      const t0 = window.performance.now();
      // createProgressiveTraceGenerator()
      //   .setNumberOfPoints(dataAmountNumber)
      //   .generate()
      //   .toPromise()
      request({
        url: 'weatherforecast',
        method: 'get',
      }).then((data) => {
        console.log(data);
        data['temp'].forEach((element, index) => {
          data['temp'][index] = { x: index, y: element - 0 };
        });
        data['temp2'].forEach((element, index) => {
          data['temp2'][index] = { x: index, y: element - 0 };
        });
        const t1 = window.performance.now();
        const dGenerateData = t1 - t0;
        labelGenerate.setText(`Generate ${dataAmountString} data points`);
        labelGenerateResult.setText(`${Math.round(dGenerateData)} ms`);
        labelAppend.setText(`Append ${dataAmountString} data points`);
        labelRender.setText(`Render first frame with data`);

        window.requestAnimationFrame(() => {
          const t2 = window.performance.now();
          series.add(data['temp']);
          series2.add(data['temp2']);
          axisX.fit(false);
          axisY.fit(false);
          const t3 = window.performance.now();
          const dAppendData = t3 - t2;
          labelAppendResult.setText(`${Math.round(dAppendData)} ms`);

          window.requestAnimationFrame(() => {
            const t4 = window.performance.now();
            const dRenderFrame = t4 - t3;
            labelRenderResult.setText(`${Math.round(dRenderFrame)} ms`);

            window.requestAnimationFrame(() => {
              const t5 = window.performance.now();
              const dRenderSubsequentFrame = t5 - t4;
              labelSubsequentRender.setText(`Render subsequent frame`);
              labelSubsequentRenderResult.setText(
                `${Math.round(dRenderSubsequentFrame)} ms`
              );
            });
          });
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .test .ant-tabs-top-content,
/deep/ .test .ant-tabs-bottom-content {
  height: 100% !important;
}
/deep/ .ant-tabs-bar {
  margin: 0 0 0 0 !important;
}
</style>
