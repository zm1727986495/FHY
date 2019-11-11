<template>
    <div class="boxstart_h">
        <el-card class="box-card-8">
            <div slot="header" class="header_box">
                <div class="iconBox">
                    <i class="Icon"></i>
                    <span>签单捷报</span>
                </div>
            </div>
            <ul class="box_start">
                <li v-for="(item,index) in 8" :key='index'>
                    <div>
                        <span>
                            张三
                        </span>
                        <span>
                            京北橱柜店
                        </span>
                        <span>
                            成交一单
                        </span>
                    </div>
                    <div>
                        <span>
                            ￥8,955,642
                        </span>
                        <span>
                            2019-08-19
                        </span>
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
      }
    },
    methods: {
    }
  }
</script>
<style scope lang='scss'>
.boxstart_h{
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
                        margin-bottom: 10px;
                        span{
                            line-height: 20px;
                            &:nth-of-type(1){
                                font-size: 20px;
                            }
                            &:nth-of-type(2){
                                font-size: 16px;
                                margin-left: 10px;
                            }
                            &:nth-of-type(3){
                                font-size: 14px;
                                color: #A7A7A7;
                                margin-left: 10px;
                            }
                        }
                        
                    }
                    &:nth-of-type(2){
                        display: flex;
                        flex-wrap: nowrap;
                        justify-content: space-between;
                        span{
                            &:nth-of-type(1){
                                color: #F97C3F;
                                font-size: 16px;
                            }
                            &:nth-of-type(2){
                                color: #A7A7A7;
                                padding-right: 45px;
                                font-size: 16px;
                            }
                        }

                    }
                }
            }
        }
    }
    
}
</style>

