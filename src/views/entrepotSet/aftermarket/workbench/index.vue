<template>
  <div class="wrapper lvs workbench">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <!-- 查询条件组 -->
      <el-row :gutter="gutter" class="m-bottom10">
        <el-col :span="24">
          <el-card class="box-card workReport">
            <div slot="header" class="clearfix box-card-header">
              <span class="title">工作简报</span>
              <div class="fr btnList">
                <el-button round :size="btnSize">本日</el-button>
                <el-button round :size="btnSize">本月</el-button>
                <el-button round :size="btnSize">本年</el-button>
              </div>
            </div>
            <ul class="box-card-content">
              <li class="clearfix contentItem">
                <i class="fl icon"></i>
                <div class="fl">
                  <p class="title">问题接单总量</p>
                  <p class="number">
                    <span class="numberVal">25</span>单
                  </p>
                </div>
              </li>
              <li class="clearfix contentItem">
                <i class="fl icon"></i>
                <div class="fl">
                  <p class="title">已约上门单量</p>
                  <p class="number">
                    <span class="numberVal">25</span>单
                  </p>
                </div>
              </li>
              <li class="clearfix contentItem">
                <i class="fl icon"></i>
                <div class="fl">
                  <p class="title">已派单量</p>
                  <p class="number">
                    <span class="numberVal">25</span>单
                  </p>
                </div>
              </li>
              <li class="clearfix contentItem">
                <i class="fl icon"></i>
                <div class="fl">
                  <p class="title">已汇报单量</p>
                  <p class="number">
                    <span class="numberVal">25</span>单
                  </p>
                </div>
              </li>
              <li class="clearfix contentItem">
                <i class="fl icon"></i>
                <div class="fl">
                  <p class="title">回访完成单量</p>
                  <p class="number">
                    <span class="numberVal">25</span>单
                  </p>
                </div>
              </li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="gutter" class="m-bottom10">
        <el-col :span="16">
          <el-card class="box-card">
            <div slot="header" class="clearfix box-card-header">
              <span class="title">售后问题跟踪一览</span>
            </div>
            <div id="myChartBar" ref="myChartBar"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix box-card-header">
              <span class="title">问题类型占比</span>
              <div class="fr btnList">
                <el-button round :size="btnSize">本月</el-button>
                <el-button round :size="btnSize">本年</el-button>
              </div>
            </div>
            <div id="myChartPie" ref="myChartPie"></div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="gutter" class="m-bottom10">
        <el-col :span="16">
          <el-card class="box-card calendar">
            <div slot="header" class="clearfix box-card-header">
              <span class="title">售后维修日程表</span>
            </div>
            <Calendar
              v-on:choseDay="clickDay"
              v-on:changeMonth="changeDate"
              v-on:isToday="clickToday"
            ></Calendar>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card tools">
            <div slot="header" class="clearfix box-card-header">
              <span class="title">快捷入口</span>
              <i class="el-icon-s-tools" style="font-size: 16px; margin-left: 5px"></i>
            </div>
            <ul class="box-card-content">
              <li>新增售后问题</li>
              <li>新增维修任务</li>
              <li>售后问题处理</li>
              <li>售后派单</li>
              <li>售后预约</li>
              <li>查看售后任务安排表</li>
              <li>进行中维修</li>
              <li>售后赔偿汇报</li>
              <li>标记售后任务完成</li>
              <li>查看已关闭任务</li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="gutter" class="m-bottom10">
        <el-col :span="24">
          <el-card class="box-card issuesTrendy">
            <div slot="header" class="clearfix box-card-header">
              <span class="title">售后问题趋势图</span>
              <div class="fr btnList">
                <el-button round :size="btnSize">本日</el-button>
                <el-button round :size="btnSize">本周</el-button>
                <el-button round :size="btnSize">本月</el-button>
                <el-button round :size="btnSize">本年</el-button>
              </div>
            </div>
            <div class="content">
              <ul class="lineLeft">
                <li>
                  <p class="title">本周问题统计</p>
                  <p class="numberVal">180</p>
                </li>
                <li>
                  <p class="title">本月问题统计</p>
                  <p class="numberVal">350</p>
                </li>
                <li>
                  <p class="title">本年问题统计</p>
                  <p class="numberVal">500</p>
                </li>
              </ul>
              <div id="myChartLine" ref="myChartLine"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import breadcrumb from '@/views/components/breadcrumb';
  import pagination from '@/views/components/pagination';
  import echarts from 'echarts';
  import Calendar from 'vue-calendar-component';
  export default {
    components: {
      breadcrumb,
      pagination,
      Calendar
    },
    data() {
      return {
        span: 6,
        gutter: 10,
        size: 'medium',
        btnSize: 'mini',
        navList: [],
        myChartLine: null,
        myChartPie: null,
        myChartBar: null,
        echartsOptionPie: {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          color: ['#6AD9DD', '#CBD1D2'],
          series: [
            {
              type: 'pie',
              radius: '55%',
              data: [
                { value: 200, name: '设计' },
                { value: 800, name: '维护' }
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        },
        echartsOptionBar: {
          grid: {
            left: '3%',
            top: '10px',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            show: false
          },
          yAxis: {
            type: 'category',
            data: ['待指派', '维修未汇报', '维修未完成', '维修完成待确定'],
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          },
          series: [
            {
              type: 'bar',
              barWidth: 20,
              data: [18203, 23489, 29034, 104970],
              itemStyle: {
                normal: {
                  color(params) {
                    var colorList = [
                      '#E6A23C', '#EECA5F', '#EAB974', '#E6A23C'
                    ];
                    return colorList[params.dataIndex]
                  },
                  label: {
                    show: true,
                    position: 'right',
                    formatter: '{c}单'
                  }
                }
              }
            }
          ]
        },
        echartsOptionLine: {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            orient: 'vertical',
            data: ['新报问题量', '处理问题量'],
            right: '5px'
          },
          dataZoom: [{
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            left: '5%',
            bottom: -8,
            start: 0,
            end: 100
          }],
          grid: {
            left: '3%',
            right: '10px',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '新报问题量',
              type: 'line',
              stack: '总量',
              data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
              name: '处理问题量',
              type: 'line',
              stack: '总量',
              data: [220, 182, 191, 234, 290, 330, 310]
            }
          ]
        }
      }
    },
    activated(){
      this.getData();
      this.navList = this.$route.meta;
      this.initEchartsLine();
      setTimeout(() => {
        let wh_content = document.querySelectorAll('.wh_content')[1];
        let wh_item_date = wh_content.querySelectorAll('.wh_item_date');
        wh_item_date.forEach((item,index) => {
          let statusDom = document.createElement('div');
          statusDom.className = 'status';
          statusDom.innerText = '已派单： 18';
          item.appendChild(statusDom);
        })
      }, 500)
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    // created() {

    // },
    // mounted() {
    //   this.getData();
    //   this.navList = this.$route.meta;
    //   this.initEchartsLine();
    //   setTimeout(() => {
    //     let wh_content = document.querySelectorAll('.wh_content')[1];
    //     let wh_item_date = wh_content.querySelectorAll('.wh_item_date');
    //     wh_item_date.forEach((item,index) => {
    //       let statusDom = document.createElement('div');
    //       statusDom.className = 'status';
    //       statusDom.innerText = '已派单： 18';
    //       item.appendChild(statusDom);
    //     })
    //   }, 500)
    // },
    updated() {
      this.drawEcharts();
    },
    methods: {
      getData() {

      },
      initEchartsLine() {
        // 线状图
        let domLine = this.$refs.myChartLine;
        this.myChartLine = echarts.init(domLine);
        this.myChartLine.setOption(this.echartsOptionLine);
        // 饼状图
        let domPie = this.$refs.myChartPie;
        this.myChartPie = echarts.init(domPie);
        this.myChartPie.setOption(this.echartsOptionPie);
        // 柱状图
        let domBar = this.$refs.myChartBar;
        this.myChartBar = echarts.init(domBar);
        this.myChartBar.setOption(this.echartsOptionBar);
      },
      drawEcharts() {
        this.myChartLine.setOption(this.echartsOptionLine);
        this.myChartPie.setOption(this.echartsOptionPie);
        this.myChartBar.setOption(this.echartsOptionBar);
      },
      // 选中某天
      clickDay(data) {
      },
      // 左右点击切换月份
      changeDate(data) {
        // console.log(data);
      },
      // 跳到今天
      clickToday(data) {
        // console.log(data);
      }
    }
  }
</script>
<style>
  #myChartBar,#myChartPie{
    width: 100%;
    height: 280px;
  }
  #myChartLine{
    width: 100%;
    height: 450px;
  }
  .is-selected {
    color: #1989FA;
  }
  .calendar .wh_container{
    max-width: 100%;
    margin-top: -70px;
  }
  .calendar .wh_content{
    padding: 0;
  }
  .calendar .wh_content_all{
    background-color: transparent;
  }
  .calendar .wh_content_item, .calendar .wh_content_item_tag{
    color: #000;
  }
  .calendar .wh_content_item{
    height: auto;
    width: 14.2%;
    font-size: 16px;
  }
  .calendar .wh_item_date{
    width: 100%;
    height: 50px;
    line-height: 20px;
    display: block;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 5px 0;
  }
  .calendar .wh_content_item .wh_isToday{
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;
    background-color: #f2f8fe;
  }
  .calendar .wh_content_item .wh_chose_day {
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;
    background-color: #71c7a5;
    color: #fff;
  }
  .calendar .wh_top_changge{
    justify-content: flex-end;
    padding-right: 5px;
    height: 60px;
  }
  .calendar .wh_top_changge .wh_content_li{
    flex: none;
    padding: 0 5px;
  }
  .calendar .wh_top_changge li{
    flex: 0;
    color: #71c7a5;
    font-size: 14px;
  }
  .calendar .wh_jiantou1,
  .calendar .wh_jiantou2 {
    border-color: #71c7a5;
    width: 10px;
    height: 10px;
    border-width: 1px;
  }
  .calendar .status{
    font-size: 12px;
    color: #666;
  }
  .calendar .wh_other_dayhide .status {
    color: #bfbfbf;
  }
  .calendar .wh_chose_day .status{
    color: #fff;
  }
</style>

