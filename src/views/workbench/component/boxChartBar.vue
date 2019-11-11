<template>
    <div class="boxChartBar">
        <el-card class="box-card">
            <div slot="header" class="clearfix box-card-header">
                <div class="iconBox">
                    <i class="Icon"></i>
                    <span>售后问题跟踪一览</span>
                </div>
            </div>
            <div id="myChartBar" ref="myChartBar"></div>
        </el-card>
        
    </div>
</template>

<script>
import echarts from 'echarts';
export default {
    components: {
    },
    mounted(){
        let domBar = this.$refs.myChartBar;
        this.myChartBar = echarts.init(domBar);
        this.myChartBar.setOption(this.echartsOptionBar);
    },
    updated() {
        this.drawEcharts();
    },
    data() {
        return {
            myChartBar:null,
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
            
        }
    },
    methods: {
        drawEcharts() {
            this.myChartBar.setOption(this.echartsOptionBar);
        },
    }
  }
</script>
<style scope lang='scss'>
 #myChartBar{
    width: 100%;
    height: 280px;
  }
</style>

