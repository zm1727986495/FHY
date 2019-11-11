<template>
  <!-- 步骤条 -->
  <div class="tepsLine">
    <!-- {{dayNumber}}天 -->

    <div class="mineLine">
      <div v-for="(item,index) in cirList" :key="index">
        <i class="circular" :style="'margin-left:'+140*index+'px'"></i>
      </div>
      <div class="redLine" :style="'width:'+20*dayNumber+'px'">
        <div class="dataClass">{{dayNumber}}天</div>
      </div>

      <div v-for="(item,index) in cirList" :key="index">
        <span class="circularSpan" :style="'margin-left:'+140*index+'px'">{{item}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["dayNumber"],
  components: {},
  // name: 'brandmanagement',
  data() {
    return {
      cirList: ["当日完成", "1周期", "2周期", "3周期", "4周期", "4+周期"],
      showDay: 35
    };
  },
  mounted() {},
  methods: {}
};
</script>
<style scoped lang='scss'>
.tepsLine {
  .mineLine {
    border-top: 1px solid #797979;
    width: 700px;
    margin: 40px auto 60px;
    display: flex;
    flex-wrap: nowrap;
    position: relative;
    .circular {
      display: flex;
      position: absolute;
      width: 12px;
      height: 12px;
      margin-left: 140px;
      border-radius: 50%;
      transform: translateY(-50%) translateX(-50%);
      background: #ffffff;
      border: 1px solid #7e7e7e;
      z-index: 1;
    }
    .circularSpan {
      display: flex;
      position: absolute;
      left: -20px;
      top: 20px;
      min-width: 100px;
    }
    .redLine {
      border: 1px solid red;
      position: relative;
    }
  }

  .dataClass {
    position: absolute;
    top: -25px;
    right: -15px;
    color: red;
  }
}
</style>

