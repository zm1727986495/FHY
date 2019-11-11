<template>
    <div class="boxStoreNumEcharts">
        <el-card class="box-card-8">
            <div slot="header" class="header_box">
                <div class="iconBox">
                    <i class="Icon"></i>
                    <span>商品出入库数量统计</span>
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
                    <el-select v-model="value" placeholder="请选择仓库">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>



            <div class="linebody">
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
          options: [
              { value: '仓库1号', label: '仓库1号'}, 
              { value: '仓库2号', label: '仓库2号'}
          ],
          value: '',
          showtimepick:false,//时间选择器是否显示
          body_right:null,
          option:{
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['入库统计','出库统计']
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
                        name:'入库统计',
                        type:'line',
                        stack: '总量',
                        data:[120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name:'出库统计',
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
.boxStoreNumEcharts{
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
            .body_right{
                width: 100%;
            }
        }
    }
    
}
</style>

