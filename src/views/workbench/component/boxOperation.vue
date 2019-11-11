<template>
    <div class="boxOperation">
        <el-card class="box-card-8">
            <div slot="header" class="header_box">
                <div class="iconBox">
                    <i class="Icon"></i>
                    <span>操作日志</span>
                </div>
            </div>
            <ul class="box_start">
                <li v-for="(item,index) in 8" :key="index">
                    <div>
                        <span>办理出库:</span>
                        <span>订单编号:201924354534</span>
                    </div>
                    <div>
                        <span>操作人：张三</span>
                        <span>2018-10-18</span>
                    </div>
                </li>
            </ul>
        </el-card>
    </div>
</template>
<script>
export default {
    components: {
    },
    data() {
      return {
          iconvis:false,
      }
    },
    methods: {
    }
}
</script>
<style scope lang='scss'>
.boxOperation{
    .box-card-8{
        .header_box{
            .iconBox{
                min-width: 150px;
            }
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            .el-icon-s-tools{
                font-size:24px;
                color:#006ED1;
                cursor: pointer;
            }
        }
        .box_start {
            height: 200px;
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
                    height: 20px;
                    &:nth-of-type(1){
                        display: flex;
                        flex-wrap: nowrap;
                        justify-content: space-between;
                        span{
                            &:nth-of-type(1){
                                font-size: 14px;
                            }
                            &:nth-of-type(2){
                                padding-right: 45px;
                                font-size: 14px;
                            }
                        }
                    }
                    &:nth-of-type(2){
                        display: flex;
                        flex-wrap: nowrap;
                        justify-content: space-between;
                        span{
                            &:nth-of-type(1){
                                font-size: 14px;
                            }
                            &:nth-of-type(2){
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

