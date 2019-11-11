<template>
    <div class="destory_message">
        <div class="destory_nav">基础信息</div>
        <p class="destory_textMessage">需求信息：</p>
        <div class="demandInformation">
            <ul>
                <li>房屋类型：</li>
                <li>日交新房：</li>
                <li>预计装修时间：</li>
                <li>房屋户型</li>
                <li>房屋总面积：</li>
                <li>装修房屋面积：</li>
                <li>装修进度：</li>
                <li>装修完成时间：</li>
                <li>意向产品</li>
                <li>意向风格</li>
                <li>进店时间</li>
                <li>进店时长</li>
                <li>进店次数</li>
            </ul>
        </div>
        <p class="destory_textMessage">订单信息：</p>
        <div class="demandInformation">
            <ul>
                <li>订单渠道：</li>
                <li>订单来源：</li>
                <li>预计装修时间：</li>
                <li>推荐人：</li>
                <li>推荐人电话：</li>
                <li>订单货品类型：</li>
                <li>品牌：</li>
                <li>产品类型：</li>
                <li>预算金额：</li>
                <li>订单地址：</li>
                <li>礼品名称：</li>
                <li>赠送方式：</li>
                <li>订单备注</li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="">
    .destory_message{
        font-size:14px;
    }
    .destory_nav{
        background:#ccc;
        font-size:16px;
    }
    .destory_textMessage{
        margin-top:20px;
    }
    .demandInformation{
        width:100%;
        height:140px;
        border:1px solid #ccc;
        padding:10px 0 10px 70px;
    }
    .demandInformation:nth-child(1){
        margin-bottom:20px;
    }
    .demandInformation li{
        width:25%;
        height:30px;
        float:left;
    }
    .destory_table{
        width:99.7%;
    }
</style>