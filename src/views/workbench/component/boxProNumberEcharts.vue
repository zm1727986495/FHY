<template>
    <div class="boxGoodNumberEcharts">
        <el-card class="box-card-8">
            <div slot="header" class="header_box">
                <div class="iconBox">
                    <i class="Icon"></i>
                    <span>售后问题趋势图</span>
                </div>
                <div class="btnlist">
                    <div class="heightmini">
                        <el-button round size="mini">本日</el-button>
                        <el-button round size="mini">本周</el-button>
                        <el-button round size="mini">本月</el-button>
                        <el-button round size="mini">本年</el-button>
                        <el-button round size="mini" @click="showtime">自定义</el-button>
                        <timepick class="timepick" v-if="showtimepick" @close_time="tiemClose"></timepick>
                    </div>
                </div>
            </div>



            <div class="linebody">
                <div class="body_left">
                    <div>
                        <div class="line_title">
                            本周问题统计
                        </div>
                        <div class="line_num">
                            180
                        </div>
                    </div>
                    <div>
                        <div class="line_title">
                            本月题统计
                        </div>
                        <div class="line_num">
                            300
                        </div>
                    </div>
                    <div>
                        <div class="line_title">
                            本年问题统计
                        </div>
                        <div class="line_num">
                            560
                        </div>
                    </div>
                </div>
                <div class="body_right" id='body_right' ref="body_right"></div>
            </div>

        </el-card>
    </div>
</template>
<script>
import timepick from './timepick'//时间选择器
import echarts from 'echarts';

export default {
    components: {
        timepick//时间选择器
    },
    mounted(){
        let domPie = this.$refs.body_right;
        this.body_right = echarts.init(domPie);
        this.body_right.setOption(this.option);
    },
    data() {
      return {
          showtimepick:false,//时间选择器是否显示
          body_right:null,
          option:{
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['新报问题量','处理问题量']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['周一','周二','周三','周四','周五','周六','周日']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'新报问题量',
                        type:'line',
                        stack: '总量',
                        data:[120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name:'处理问题量',
                        type:'line',
                        stack: '总量',
                        data:[220, 182, 191, 234, 290, 330, 310]
                    }
                ]
          }
      }
    },
    methods: {
        //打开日期选择器
        showtime(){
            this.showtimepick = !this.showtimepick;
        },
        //关闭日期选择器
        tiemClose(){
            this.showtimepick = false;
        },
    },
  }
</script>
<style scope lang='scss'>
.boxGoodNumberEcharts{
    .box-card-8{
        .header_box{
            padding: 0;
            .iconBox{
                min-width: 230px;
            }
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            .btnlist{
                display: flex;
                flex-wrap: nowrap;
                align-items: center;
                .heightmini{
                    height: 25px;
                    margin-right: 10px;
                    position: relative;
                    .timepick{
                        position: absolute;
                        top: 40px;
                        right: 0px;
                    }
                }
            }
        }
        .linebody{
            display: flex;
            height: 500px;
            border: 1px solid #F6F6F6;
            .body_left{
                min-width: 135px;
                border-right:1px solid #808488; 
                display: flex;
                flex-direction: column;
                >div{
                    flex: 1;
                }  
                .line_title{
                    font-size: 15px;
                    margin: 50px 0px 15px 30px;
                    color: #999999;
                }
                .line_num{
                    font-size: 30px;
                    font-weight: 700;
                    margin-left: 30px;
                }  
            }
            .body_right{
                width: 100%;
            }
        }
    }
    
}
</style>

