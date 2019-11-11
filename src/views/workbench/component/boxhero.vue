<template>
    <div class="boxhero_h">
        <el-card class="box-card-8">
            <div slot="header" class="header_box">
                <div class="iconBox">
                    <i class="Icon"></i>
                    <span>英雄榜</span>
                </div>
                <div class="btnlist">
                    <el-button round size="mini">本日</el-button>
                    <el-button round size="mini">本周</el-button>
                    <el-button round size="mini">本月</el-button>
                    <el-button round size="mini">本年</el-button>
                    <el-button round size="mini" @click="showtime">自定义</el-button>
                    <timepick class="timepick" v-if="showtimepick" @close_time="tiemClose"></timepick>
                </div>
            </div>
            <ul class="box_fast">
                <li>排名</li>
                <li>导购姓名</li>
                <li>回款额</li>
                <li>全国排名</li>
            </ul>

            <ul class="box_fast_item" v-for="(item,index) in 5" :key="index">
                <li>
                    <i class="medal_icon"></i>
                </li>
                <li>王丽丽</li>
                <li>654354</li>
                <li>12</li>
            </ul>
        </el-card>
    </div>
</template>
<script>
import timepick from './timepick'//时间选择器

export default {
    components: {
        timepick//时间选择器
    },
    data() {
      return {
          showtimepick:false,//时间选择器是否显示
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
    }
  }
</script>
<style scope lang='scss'>
.boxhero_h{
    .box-card-8{
        .header_box{
            .iconBox{
                min-width: 150px;
            }
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
        }
        .btnlist{
            display: flex;
            flex-wrap: nowrap;
            position: relative;
            .timepick{
                position: absolute;
                top: 40px;
                right: 0px;
            }
        }
        .box_fast{
            display: flex;
            flex-wrap: nowrap;
            li{
                flex: 1;
                border: 1px solid #F6F6F6;
                background: #F6F6F6;
                text-align: center;
                line-height: 36px;
            }
        } 
        .box_fast_item{
            display: flex;
            flex-wrap: nowrap;
            position: relative;
            li{
                flex: 1;
                border: 1px solid #F6F6F6;
                text-align: center;
                line-height: 44px;
            }
            &:nth-of-type(2){
                li {
                    position: relative;
                    .medal_icon{
                        display: block;
                        position: absolute;
                        width: 18px;
                        height: 22px;
                        top: 50%;
                        left: 50%;
                        transform: translateY(-50%) translateX(-50%);
                        content: '';
                        background: url(../../../assets/images/medal1.png) center no-repeat;
                        background-size: 100%;
                    }
                }
            }

            &:nth-of-type(3){
                li {
                    position: relative;
                    .medal_icon{
                        display: block;
                        position: absolute;
                        width: 18px;
                        height: 22px;
                        top: 50%;
                        left: 50%;
                        transform: translateY(-50%) translateX(-50%);
                        content: '';
                        background: url(../../../assets/images/medal2.png) center no-repeat;
                        background-size: 100%;
                    }
                }
            }

            &:nth-of-type(4){
                li {
                    position: relative;
                    .medal_icon{
                        display: block;
                        position: absolute;
                        width: 18px;
                        height: 22px;
                        top: 50%;
                        left: 50%;
                        transform: translateY(-50%) translateX(-50%);
                        content: '';
                        background: url(../../../assets/images/medal3.png) center no-repeat;
                        background-size: 100%;
                    }
                }
            }

            &:nth-of-type(5){
                li {
                    position: relative;
                    .medal_icon{
                        display: block;
                        position: absolute;
                        width: 18px;
                        height: 18px;
                        top: 50%;
                        left: 50%;
                        transform: translateY(-50%) translateX(-50%);
                        content: '';
                        background: url(../../../assets/images/medal4.png) center no-repeat;
                        background-size: 100%;
                    }
                }
            }

            &:nth-of-type(6){
                li {
                    position: relative;
                    .medal_icon{
                        display: block;
                        position: absolute;
                        width: 18px;
                        height: 18px;
                        top: 50%;
                        left: 50%;
                        transform: translateY(-50%) translateX(-50%);
                        content: '';
                        background: url(../../../assets/images/medal5.png) center no-repeat;
                        background-size: 100%;
                    }
                }
            }

        }
    }
    
}
</style>

