<template>
    <div class="contractdetails">
        <div class="titlecals martop">合同信息</div>
        <div class="contract">
            <div class="contractcon">
                <ul class="customerlist">
                    <li>客户合同号：jz201807170674</li>
                    <li>订单生成时间：2018.07.17</li>
                    <li>合同签订日期：2018.07.17</li>
                    <li>预计安装时间：2018.07.17</li>
                    <li>设计提交时间：2018.07.17</li>
                    <li>首笔预付款时间：2018.01.18</li>
                    <li>首笔预付款金额：32198</li>
                    <li>生产周期：60 天</li>
                    <li>产品售价：2018年售价</li>
                    <li>合同原价：68880</li>
                    <li>合同金额：68880</li>
                    <li>活动计算方式：</li>
                    <li>优惠券：</li>
                    <li>活动：</li>
                    <li>特批折扣：</li>
                    <li>抹零金额：</li>
                </ul>
                <div class="labeliconbox">
                    <ul class="labelicon">
                        <li>急</li>
                        <li>客</li>
                        <li>抹</li>
                    </ul>
                </div>
                <div class="violationbox">
                    <div class="violation">
                        <span>违规单</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    data() {
        return {
            isShow: true,
            
        };
    },
    props: [],
    mounted() {
        
    },
    methods: {
        hideSearch(){
            this.isShow = !this.isShow;
            // console.error('111', this.isShow);
        },
    },
    computed: {}
  };
</script>

<style lang="scss" scoped>
    .contractdetails{
        .martop{
            transform: translateY(40px);
        }
        .contract{
            margin: 30px 0px;
        }
        .boxtit{
            background: #f5f5f5;
            padding: 10px 20px;
            color: #333333;
            font-size: 14px;
        }
        .contractcon{
            padding: 20px 0px 20px 50px;
            position: relative;
        }

        /* 合同信息标签组 */
        .labelicon{
            width: 100px;
            display: flex;
        }
        .labelicon li{
            padding: 10px 6px 15px;
            background: red;
            color: #ffffff;
            font-size: 12px;
            position: relative
        }
        .labelicon li+li{
            margin-left: 15px;
        }
        .labelicon li::after{
            display: block;
            content: "";
            position: absolute;
            width:0;
            height:0;
            border-right:14px solid transparent;
            border-left:14px solid transparent;
            border-bottom:10px solid white;
            left: -2px;
            bottom: 0px;
        }
        .labelicon li:nth-of-type(1){
            background: #F26660;
        }
        .labelicon li:nth-of-type(2){
            background: #70D5A6;
        }
        .labelicon li:nth-of-type(3){
            background: #71B4FA;
        }
        .labeliconbox{
            position: absolute;
            left: 240px;
            top: 0px;
        }
        .violationbox{
            position: absolute;
            right: -33px;
            top: -7px;
        }
        .violation{
            position: relative;
            width:0;
            height:0;
            border-right:50px solid transparent;
            border-left:50px solid transparent;
            border-bottom:50px solid #FF9933;
            transform: rotate(45deg);
        }
        .violation span{
            font-size: 16px;
            position: absolute;
            left: -22px;
            bottom: -45px;
            width: 100px;
            display: block;
            color: #ffffff;
        }
        .customerlist{
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            font-size: 13px;
            color: #333333;
        }
        .customerlist li {
            width: 25%;
            line-height: 30px;
        }
    }
</style>

