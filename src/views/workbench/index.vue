<template>
  <div style="width: 100%; height: 100%;">
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <div class="indexImg" :style="{backgroundImage:'url('+ indexImg +')'}"></div>
  </div>
<!--  <div class="wrapper lvs">-->
<!--    <div class="apper">-->

<!--    </div>-->
<!--  </div>-->
<!--  <div class="workbench_index">-->



<!--    -->
<!--    &lt;!&ndash; 工作简报 &ndash;&gt;-->
<!--    <bulletin class="m-bottom10"></bulletin>-->
<!--    <el-row :gutter="gutter" class="m-bottom10" v-if="identity == '1'||identity == '2'||identity == '3'">-->
<!--        <el-col :span="8">-->
<!--          &lt;!&ndash; 快捷菜单 &ndash;&gt;-->
<!--          <boxfast></boxfast>-->
<!--        </el-col>-->

<!--        <el-col :span="8">-->
<!--          &lt;!&ndash; 签单捷报 &ndash;&gt;-->
<!--          <boxstart></boxstart>-->
<!--        </el-col>-->

<!--        <el-col :span="8">-->
<!--          &lt;!&ndash; 前道日历 &ndash;&gt;-->
<!--          <boxcalendarQian></boxcalendarQian>-->
<!--        </el-col>-->
<!--    </el-row>-->
<!--    <el-row :gutter="gutter" class="m-bottom10" v-if="identity == '1'||identity == '2'||identity == '3'">-->
<!--        -->
<!--        <el-col :span="16">-->
<!--          &lt;!&ndash; 英雄榜 &ndash;&gt;-->
<!--          <boxhero v-if="identity == '1'|| identity == '2'||identity == '3'"></boxhero>-->
<!--        </el-col>-->

<!--        <el-col :span="8">-->
<!--          &lt;!&ndash; 测量汇报 &ndash;&gt;-->
<!--          <boxmeasure v-if="identity == '2'"></boxmeasure>-->
<!--          &lt;!&ndash; 前道饼状图 &ndash;&gt;-->
<!--          <boxChartPieQian v-if="identity == '3'"></boxChartPieQian>-->
<!--        </el-col>-->
<!--    </el-row>-->
<!--    <el-row :gutter="gutter" class="m-bottom10" v-if="identity == '4'">-->
<!--        <el-col :span="16">-->
<!--          &lt;!&ndash; 柱状图 &ndash;&gt;-->
<!--          <boxChartBar></boxChartBar>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          &lt;!&ndash; 后道饼状图 &ndash;&gt;-->
<!--          <boxChartPieHou></boxChartPieHou>-->
<!--        </el-col>-->
<!--    </el-row>-->
<!--    <el-row :gutter="gutter" class="m-bottom10" v-if="identity == '4'">-->
<!--        <el-col :span="16">-->
<!--          &lt;!&ndash; 后道日志 &ndash;&gt;-->
<!--          <boxcalendarHou></boxcalendarHou>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          &lt;!&ndash; 快捷菜单 &ndash;&gt;-->
<!--          <boxfast></boxfast>-->
<!--        </el-col>-->
<!--    </el-row>-->
<!--    <el-row :gutter="gutter" class="m-bottom10" v-if="identity == '5'">-->
<!--        <el-col :span="16">-->
<!--          &lt;!&ndash; 异常仓库 &ndash;&gt;-->
<!--          <boxAbnormal></boxAbnormal>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          &lt;!&ndash; 操作日志 &ndash;&gt;-->
<!--          <boxOperation></boxOperation>-->
<!--        </el-col>-->
<!--    </el-row>-->
<!--    <el-row :gutter="gutter" class="m-bottom10" v-if="identity == '5'">-->
<!--        <el-col :span="16">-->
<!--          &lt;!&ndash; 库龄统计 &ndash;&gt;-->
<!--          <boxStoreAge></boxStoreAge>-->
<!--        </el-col>-->
<!--        <el-col :span="8">-->
<!--          <boxfast></boxfast>-->
<!--        </el-col>-->
<!--    </el-row>-->
<!--    &lt;!&ndash; 售后问题趋势图 &ndash;&gt;-->
<!--    <el-row :gutter="gutter" class="m-bottom10" v-if="identity == '4'">-->
<!--        <el-col :span="24">-->
<!--          <boxProNumberEcharts></boxProNumberEcharts>-->
<!--        </el-col>-->
<!--    </el-row>-->
<!--    &lt;!&ndash; 商品出入库数量统计 &ndash;&gt;-->
<!--    <el-row :gutter="gutter" class="m-bottom10" v-if="identity == '5'">-->
<!--        <el-col :span="24">-->
<!--          <boxStoreNumEcharts></boxStoreNumEcharts>-->
<!--        </el-col>-->
<!--    </el-row>-->
<!--    &lt;!&ndash; 业绩趋势图  订单统计 &ndash;&gt;-->
<!--    <el-row :gutter="gutter" class="m-bottom10" v-if="identity == '1'|| identity == '2'||identity == '3'">-->
<!--        <el-col :span="24">-->
<!--          <boxAchievementEcharts></boxAchievementEcharts>-->
<!--        </el-col>-->
<!--    </el-row>-->
<!--    <el-row :gutter="gutter" class="m-bottom10" v-if="identity == '1'|| identity == '2'||identity == '3'">-->
<!--        <el-col :span="24">-->
<!--          <boxOrderEcharts></boxOrderEcharts>-->
<!--        </el-col>-->
<!--    </el-row>-->
<!--  </div>-->
</template>
<script>
  import breadcrumb from '@/views/components/breadcrumb';
  import pagination from '@/views/components/pagination';
  import bulletin from './component/bulletin';//工作简报
  import boxfast from './component/boxfast' //快捷菜单
  import boxstart from './component/boxstart' //签单捷报
  import boxcalendarQian from './component/boxcalendarQian'//前道日历
  import boxcalendarHou from './component/boxcalendarHou'//后道日志
  import boxmeasure from './component/boxmeasure'//测量汇报
  import boxChartBar from './component/boxChartBar'//柱状图
  import boxChartPieQian from './component/boxChartPieQian'//前道饼状图
  import boxChartPieHou from './component/boxChartPieHou'//后道饼状图
  import boxAbnormal from './component/boxAbnormal'//异常仓库
  import boxOperation from './component/boxOperation'//操作日志
  import boxStoreAge from './component/boxStoreAge'//库龄统计
  import boxhero from './component/boxhero'//英雄榜
  import boxProNumberEcharts from './component/boxProNumberEcharts'//售后问题趋势图
  import boxStoreNumEcharts from './component/boxStoreNumEcharts' //商品出入库数量统计
  import boxAchievementEcharts from './component/boxAchievementEcharts'//业绩趋势图
  import boxOrderEcharts from './component/boxOrderEcharts'//订单统计图
  import indexImg from '@/assets/index/index.jpg';
  export default {
    components: {
      breadcrumb,
      pagination,
      bulletin,//工作简报
      boxfast,//快捷菜单
      boxstart,//签单捷报
      boxcalendarQian,//前道日历
      boxcalendarHou,//后道日志
      boxmeasure,//测量汇报
      boxhero,//英雄榜
      boxChartBar,//柱状图
      boxChartPieQian,//前道饼状图
      boxChartPieHou,//后道饼状图
      boxAbnormal,//异常仓库
      boxOperation,//操作日志
      boxStoreAge,//库龄统计
      boxProNumberEcharts,//售后问题趋势图
      boxStoreNumEcharts,//商品出入库数量统计
      boxAchievementEcharts,//业绩趋势图
      boxOrderEcharts,//订单统计图
    },
    data() {
      return {
          indexImg,
          contain: 'contain',
          navList:[],//面包屑  
          gutter: 10,//栅格间距
          iconvis:false,//快捷入口弹框是否显示
          identity:'5',//登录人身份标识     1销售员 2设计师 3店长 4售后 5库房
      }
    },
    mounted() {
      this.navList = this.$route.meta;
      // this.identity =  this.$route.query.identity;//登录人身份标识     1销售员 2设计师 3店长 4售后 5库房
    },
    methods: {

    }
  }
</script>
<style scope lang='scss'>
.workbench_index{
    
}
  .indexImg{
    width: 100%;
    height: calc(100% - 70px);
    background-position: center;
    -webkit-background-size: cover;
    background-size: cover;
    background-repeat: no-repeat;
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    border-radius: 10px;
    overflow: hidden;
    opacity: 0.92;
  }
</style>

