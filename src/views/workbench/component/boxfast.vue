<template>
    <div class="boxfast_h">
        <el-card class="box-card-8">
            <div slot="header" class="header_box">
                <div class="iconBox">
                    <i class="Icon"></i>
                    <span>快捷入口</span>
                </div>
                <div @click="openIconDia">
                    <i class="el-icon-s-tools"></i>
                </div>
            </div>
            <ul class="box_fast">
                <li>新增售后问题</li>
                <li>新增维修任务</li>
                <li>售后问题处理</li>
                <li>售后派单</li>
                <li>售后预约</li>
                <li>查看售后任务安排表</li>
                <li>进行中维修</li>
                <li>售后赔偿汇报</li>
            </ul>
        </el-card>
        <!-- 弹出框自定义快捷入口 -->
        <fastenterdia :visible="iconvis" @close_fast='closeAll'></fastenterdia>
    </div>
</template>
<script>
import fastenterdia from './fastenterdia' //编辑快捷入口弹框
  export default {
    components: {
      fastenterdia, //编辑快捷入口弹框
    },
    data() {
      return {
          iconvis:false,
      }
    },
    methods: {
        //打开选择菜单弹出层
        openIconDia(){
            this.iconvis = true;
        },
        closeAll(){
            this.iconvis = false;
        },
    }
  }
</script>
<style scope lang='scss'>
.boxfast_h{
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
        .box_fast{
            display: flex;
            flex-wrap: wrap;
            li{
                width: 50%;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
                padding: 15px 0px 15px 35px;
                border-bottom: 1px solid #eee;
                cursor: pointer;
                &:hover{
                    background: #eee;
                }
            }
        } 
    }
    
}
</style>

