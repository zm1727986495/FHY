<template>
    <div class="boxChartPieHou">
        <el-card class="box-card">
            <div slot="header" class="header_box">
                <div class="iconBox">
                    <i class="Icon"></i>
                    <span>北京地区问题类型占比</span>
                </div>
                <div class="btnlist">
                    <el-button round size="mini">本日</el-button>
                    <el-button round size="mini">本年</el-button>
                </div>
            </div>
            <div id="myChartPie" ref="myChartPie"></div>
        </el-card>
        
    </div>
</template>

<script>
import echarts from 'echarts';
export default {
    mounted(){
        let domPie = this.$refs.myChartPie;
        this.myChartPie = echarts.init(domPie);
        this.myChartPie.setOption(this.echartsOptionPie);
    },
    data() {
        return {
            myChartPie:null,
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
                        { value: 200, name: '东城区' },
                        { value: 800, name: '朝阳区' }
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
        }
    },
    methods: {
    }
  }
</script>
<style scope lang='scss'>
.boxChartPieHou{
    .header_box{
        .iconBox{
            min-width: 200px;
        }
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        .btnlist{
            display: flex;
            flex-wrap: nowrap;
        }
    }
    #myChartPie{
        width: 100%;
        height: 280px;
    }
}
</style>

