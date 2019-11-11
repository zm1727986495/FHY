<template>
    <div class="boxOrderEcharts">
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
                            本月订单总数
                        </div>
                        <div class="line_num">
                            180
                        </div>
                        <div class="triangle1text">
                            <i class="triangle1"></i>
                            <span>
                                10%
                            </span>
                            <span>
                                同比上月
                            </span>
                        </div>
                    </div>
                    <div>
                        <div class="line_title">
                            本周订单总数
                        </div>
                        <div class="line_num">
                            300
                        </div>
                        
                        <div class="triangle2text">
                            <i class="triangle2"></i>
                            <span>
                                5%
                            </span>
                            <span>
                                同比上周
                            </span>
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
          option : {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true
            }]
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
.boxOrderEcharts{
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
                    margin: 50px 0px 15px 15px;
                    color: #999999;
                }
                .line_num{
                    font-size: 30px;
                    font-weight: 700;
                    margin-left: 30px;
                }  
                .triangle1text{
                    margin-left: 25px;
                    position: relative;
                    .triangle1 {
                        position: absolute;
                        width: 0;
                        height: 0;
                        border-style: solid;
                        transform: translateY(-50%);
                        top: 50%;
                        left: -18px;
                        border-width: 0 8px 8px 8px;
                        border-color: transparent transparent #00A950 transparent;
                    }
                    span{
                        &:nth-of-type(1){
                            color: #00A950;
                        }
                    }
                }
                .triangle2text{
                    margin-left: 25px;
                    position: relative;
                    .triangle2 {
                        position: absolute;
                        width: 0;
                        height: 0;
                        border-style: solid;
                        transform: translateY(-50%);
                        top: 50%;
                        left: -18px;
                        border-width: 8px 8px 0px 8px;
                        border-color: #F04844 transparent transparent  transparent;
                    }
                    span{
                        &:nth-of-type(1){
                            color: #F04844;
                        }
                    }
                }
            }
            .body_right{
                width: 100%;
            }
        }
    }
    
}
</style>

