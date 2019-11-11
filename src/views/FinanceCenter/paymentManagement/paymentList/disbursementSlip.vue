<template>
    <div>
        <el-card>
            <div class="iconBox"><i class='Icon'></i><span>支出单</span></div>
            <div style="border-bottom:1px solid #cccccc;padding-bottom:20px;">
                <ul class="dialogList clearfloat">
                    <li><span>支出单号：</span>ZC2326226262</li>
                    <li><span>支出金额：</span>2026545元</li>
                    <li><span>创建人：</span>张三 2019-02-01 13:11:35</li>
                </ul>
                <div style="text-align:right">共1笔</div>
            </div>
            <div>
                <div style="border-bottom:1px solid #cccccc;padding-bottom:20px;margin-top:20px">
                    <div class="iconBox"><i class='Icon'></i><span>退款号：123456789</span></div>
                    <ul class="dialogMessage clearfloat">
                        <li><span>客户名称：</span>张三</li>
                        <li><span>联系电话：</span>13912345678</li>
                        <li><span>退款方式：</span>汇款</li>
                        <li><span>开户名：</span>张三</li>
                        <li><span>退款银行：</span>招商银行</li>
                        <li><span>退款账号：</span>2262231321 变更</li>
                        <li><span>退款金额：</span>20956元</li>
                    </ul>
                </div>
                <div>
                    <ul class="isNo clearfloat">
                        <li><span>是否已开发票：</span>是</li>
                        <li><span>是否已归还发票：</span>是</li>
                    </ul>
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    }
}
</script>
<style scoped>
.clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
.clearfloat{zoom:1}
.dialogList{
    width: 100%;
    
}
.dialogList>li>span{
    text-align: right;
    display: inline-block;
    width: 120px;;
}
.dialogList>li{
    width: 33.3%;
    float: left;;
    height: 50px;
    line-height: 50px;
}
.dialogMessage{
    width: 100%;
}
.dialogMessage>li{
    width: 33.3%;
    float: left;;
    height: 50px;
    line-height: 50px;
}
.dialogMessage>li>span{
    text-align: right;
    display: inline-block;
    width:150px;;
}
.isNo{
    width: 100%;
    margin-top:20px;
}
.isNo>li{
    float: left;
    width: 33.5%;
}
.isNo>li>span{
    display: inline-block;
    text-align: right;
    width:150px;
}
</style>

