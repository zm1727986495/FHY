<template>
    <div class="contractdetails">
        <div class="titlecals martop">合同信息</div>
        <div class="contract">
            <div class="contractcon">
                <ul class="customerlist">
                    <li>客户合同号：{{ contractDetails.contractSerialNumber }}</li>
                    <li>合同签订日期：{{ contractDetails.signingTime }}</li>
                    <li>预计安装时间：{{ contractDetails.predictInstallTime }}</li>
                    <li>活动：{{ contractDetails.activityName }}</li>
                    <li>商品原价：{{ contractDetails.goodsOriginalPrice }}</li>
                    <li>商品金额：{{ contractDetails.goodsAmount }}</li>
                    <li>其他费用合计：{{ contractDetails.otherCost}}</li>
                    <li>合同金额：{{ contractDetails.contractMoney }}</li>
                    <li>抹零金额：{{ contractDetails.maLingAmount }}</li>
                    <li>特批折扣：{{ contractDetails.specialDiscountName }}</li>
                    <li>合同金额备注：{{ contractDetails.contractMoneyRemark }}</li>
                    <li>预计工期：{{ contractDetails.predictGq }}</li>
                    <li>加急工期：{{ contractDetails.urgentGq }}</li>
                </ul>
                <!-- <div class="labeliconbox">
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
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
import { 
    getCustomerContract,//查询合同基本信息
    } from 'api/order/contract/contract';
  export default {
    data() {
        return {
            // isShow: true,
            orderId: this.$route.query.orderId,
            contractDetails: {}
        };
    },
    props: [],
    mounted() {
        this.getcustomer();
    },
    methods: {
        // hideSearch(){
        //     this.isShow = !this.isShow;
        // },
        // 获取合同信息接口
        getcustomer(){
            let orderId = this.orderId
            getCustomerContract({orderId: orderId}).then(res =>{
                if(res.status == 200){
                    // 合同id有的时候回显
                    this.contractDetails = res.data;
                    // if(res.data.customerContractId){
                    //     this.customerContractId = res.data.customerContractId;
                    //     this.contractSerialNumber = res.data.contractSerialNumber;//合同流水号
                    //     this.budgetId = res.data.orderBudgetId;//预算清单ID
                    //     this.signingTime = res.data.signingTime;//合同签订日期
                    //     this.contractMoney = res.data.contractMoney;//合同金额
                    //     this.predictGq = res.data.predictGq;//预计工期
                    //     this.contractMoneyRemark = res.data.contractMoneyRemark;//合同金额备注
                    //     this.goodsAmount = res.data.goodsAmount;//商品金额
                    //     this.urgentGq = res.data.urgentGq;//加急工期回显
                    //     this.goodsOriginalPrice = res.data.goodsOriginalPrice;//商品原价
                    //     this.predictInstallTime = res.data.predictInstallTime;//预计安装时间
                    //     this.maLingAmount = res.data.maLingAmount;//抹零金额
                    //     this.$refs.editbudgetlistdata.getData({budgetId: res.data.orderBudgetId})
                    //     this.otherCost = res.data.otherCost;//其他费用
                    // }
                }
            }).catch(error =>{
                console.log('合同详情:获取合同信息 order/order/order.vue', error);
            })
        },
    },
  }
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
            // background: red;
            background: transparent;
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

