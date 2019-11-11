<template>
    <!-- 头部工作简报 -->
    <div class="work_bulletin">
        <el-card>
            <div class="header_box">
                <div class="iconBox">
                    <i class="Icon"></i>
                    <span>工作简报</span>
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
            <div class="card_box">
                <div class="card_item" v-for="(item,index) in 8" :key="index">
                    <div class="card_pic"></div>
                    <div class="card_text">
                        <div>收款金额</div>
                        <div>999,999,999</div>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>
import { getSalesAchievements } from "api/workbench/index"
import timepick from './timepick'//时间选择器

  export default {
    components: {
      timepick,//时间选择器
    },
    data() {
      return {
          showtimepick:false,//时间选择器是否显示
      }
    },
    mounted() {
      this.navList = this.$route.meta;
      getSalesAchievements().then(res=>{
          console.log(res);
      })
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
.work_bulletin{
    .header_box{
        .iconBox{
            min-width: 150px;
        }
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
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
    }
    .card_box{
        height: 120px;
        margin: 10px 20px;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        overflow-x: auto;
        .card_item{
            display: flex;
            flex-wrap: nowrap;
            background: #FFB588;
            border-radius: 8px; 
            min-width: 200px;
            height: 80px;
            margin-left: 15px;
            justify-content:space-between;
            align-items: center;
            .card_pic{
                display: block;
                margin-left: 10px;
                width: 50px;
                height: 50px;
                text-align: center;
                background: url(../../../assets/images/qian.png) center no-repeat;
                // background-size: 100%;
            }
            .card_text{
                padding-left: 10px;
                width: 150px;
                color: #ffffff;
            }
        }
    }
}
</style>

