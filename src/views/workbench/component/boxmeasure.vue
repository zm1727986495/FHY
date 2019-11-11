<template>
    <div class="boxmeasure_h">
        <el-card class="box-card-8">
            <div slot="header" class="header_box">
                <div class="iconBox">
                    <i class="Icon"></i>
                    <span>测量管理</span>
                </div>
            </div>

            <ul class="box_start">
                <li v-for="(item,index) in 8" :key="index">
                    <div>
                        <span>
                            <span style="color:#000;">预派测量时间:</span>
                            2018-09-12（明天）10：30
                        </span>
                        <span>待汇报</span>                        
                    </div>
                </li>
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
.boxmeasure_h{
    .box-card-8{
        .header_box{
            .iconBox{
                min-width: 150px;
            }
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
        }
        .box_start {
            height: 272px;
            overflow-y: auto;
            li{
                width: 100%;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                padding: 10px 0 10px 25px;
                border-bottom: 1px solid #eee;
                cursor: pointer;
                &:hover{
                    background: #eee;
                }
                div{
                    display: flex;
                    flex-wrap: nowrap;
                    &:nth-of-type(1){
                        display: flex;
                        flex-wrap: nowrap;
                        justify-content: space-between;
                        span{
                            &:nth-of-type(1){
                                color: #A7A7A7;
                                font-size: 14px;
                            }
                            &:nth-of-type(2){
                                color: #F97C3F;
                                padding-right: 45px;
                                font-size: 14px;
                            }
                        }
                    }
                }
            }
        } 
    }
}
</style>

