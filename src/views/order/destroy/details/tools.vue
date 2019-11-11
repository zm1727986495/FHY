<template>
    
    <div>
        <div class="buttonList clearfloat">
            <el-button size="small">订单编号：{{orderNum}}</el-button>
            <el-button size="small">礼品信息</el-button>
            <el-button size="small">活动信息</el-button>
            <el-button size="small">订单跟进记录</el-button>
            <el-button size="small">售后信息</el-button>
            <el-button size="small">返点信息</el-button>
            <el-button size="small">违规信息</el-button>
        </div>
        <div class="orderProgressBar">
            <el-steps :space="200" :active="3" finish-status="success" align-center class="DestorySteps">
                <el-step title="1"></el-step>
                <el-step title="2"></el-step>
                <el-step title="3"></el-step>
                <el-step title="4"></el-step>
                <el-step title="5"></el-step>
                <el-step title="6"></el-step>
                <el-step title="7"></el-step>
                <el-step title="8"></el-step>
                <el-step title="9"></el-step>
                <el-step title="10"></el-step>
                <el-step title="11"></el-step>
            </el-steps>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            orderNum:"Sq12341560"
        }
    }
}
</script>
<style>
    .clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
    .clearfloat{zoom:1}
    .buttonList{
        margin-top:20px;
    }
    .buttonList>button{
        float:left;
        background:#96bdde;
        border:#96bdde;
        color:#fff;
    }
    .orderProgressBar{
        margin-top:20px;
        border:1px solid #ccc;
        height:110px;
    }
    .DestorySteps{
        margin-top:20px;
    }
</style>