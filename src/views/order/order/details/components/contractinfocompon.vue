<template>
    <div class="contractinfocompon">
        <div class="titlecals disclass">
            <div>合同信息</div>
            <el-button type="text" @click="preview" v-if="this.customerContractId != ''">合同预览</el-button>
        </div>
        
        <el-form :label-position="labelPosition" label-width="130px" class="demoforminline">
            <el-form-item label="客户合同号">
                <el-input size="medium" disabled v-model="contractSerialNumber"></el-input>
            </el-form-item>
            <el-form-item label="产品售价">
                <el-input size="medium" disabled v-model="goodsAmount"></el-input>
            </el-form-item>
            <el-form-item label="商品原价">
                <el-input size="medium" disabled v-model="goodsOriginalPrice"></el-input>
            </el-form-item>
            <el-form-item label="合同签订日期">
                <el-input size="medium" disabled v-model="signingTime"></el-input>
            </el-form-item>
            <el-form-item label="商品金额">
                <el-input size="medium" disabled v-model="goodsAmount"></el-input>
            </el-form-item>
            <el-form-item label="其他费用金额">
                <el-input size="medium" disabled v-model="otherCost"></el-input>
            </el-form-item>
            <el-form-item label="合同金额">
                <div class="flexdis inpdis">
                    <el-input size="medium" disabled v-model="contractMoney"></el-input>
                    <!-- <span class="texcol">抹额:</span>
                    <el-input size="medium" disabled v-model="maLingAmount"></el-input> -->
                </div>
            </el-form-item>
            <el-form-item label="预计安装日期">
                <el-input size="medium" disabled v-model="predictInstallTime"></el-input>
            </el-form-item>
            <el-form-item label="合同金额备注" class="widmax">
                <el-input type="textarea" size="medium" disabled v-model="contractMoneyRemark"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { 
    getPreviewContract,//预览合同
    getCustomerContract,//查询合同基本信息
    } from 'api/order/contract/contract';
export default {
    data() {
        return {
            labelPosition: 'right',
            orderId: this.$route.query.orderId,
            signingTime: '',//合同签订日期
            productWarrantyContent: '',//产品保修日期
            contractMoneyRemark: '',//合同金额备注
            predictInstallTime: '',//预计安装时间
            goodsOriginalPrice: '',//商品原价
            goodsAmount: '',//商品金额
            predictGq: '',//预计工期
            minPeriod: '',//最快工期
            otherCost: '0.00',//其他费用
            maLingAmount: "",//抹额
            contractMoney: '',//合同金额
            contractSerialNumber: '',//合同编号
            customerContractId: '',//合同id
        }
    },
    created() {
        this.getcustomer()
    },
    methods: {
        // 预览合同
        preview(){
            let data = {
                orderId: this.orderId,
                customerContractId: this.customerContractId,
            }
            getPreviewContract(data).then(res =>{
                if(res.status == 200){
                    console.log(res);
                    window.open("https://fanhuayiju.oss-cn-beijing.aliyuncs.com/"+ res.data)
                }else{
                    this.$message.warning(res.message);
                }
            }).catch(error =>{
                console.log('订单管理:合同预览 order/contract/index.vue', error);
            })
        },
        // 获取合同信息接口
        getcustomer(){
            let orderId = this.orderId
            getCustomerContract({orderId: orderId}).then(res =>{
                if(res.status == 200){
                    // 合同id有的时候回显
                    if(res.data.customerContractId){
                        this.customerContractId= res.data.customerContractId;
                        this.contractSerialNumber = res.data.contractSerialNumber;//合同流水号
                        this.budgetId = res.data.orderBudgetId;//预算清单ID
                        this.signingTime = res.data.signingTime;//合同签订日期
                        this.contractMoney = res.data.contractMoney;//合同金额
                        this.predictGq = res.data.predictGq;//预计工期
                        this.contractMoneyRemark = res.data.contractMoneyRemark;//合同金额备注
                        this.goodsAmount = res.data.goodsAmount;//商品金额
                        // this.urgentGq = res.data.urgentGq;//加急工期回显
                        this.goodsOriginalPrice = res.data.goodsOriginalPrice;//商品原价
                        this.predictInstallTime = res.data.predictInstallTime;//预计安装时间
                        this.maLingAmount = res.data.maLingAmount;//抹零金额
                    }
                }
            }).catch(error =>{
                console.log('合同详情:获取合同信息 order/order/order.vue', error);
            })
        },
    },
}
</script>
<style lang="scss">
.contractinfocompon{
    .disclass{
        display: flex;
        align-items: center;
        button{
            margin-left: 20px;
        }
    }
    .titlecals{
        top: 0;
    }
    .demoforminline{
        margin-top: 10px;
        padding-right: 70px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        >div{
            // &:nth-child(odd){
            //     width: 40%
            // }
            // &:nth-child(even){
            //     width: 55%;
            // }
            width: 40%;
        }
        .widmax{
            width: 100% !important;
        }
    }
    .flexdis{
        display: flex;
        justify-content: space-around;
        
    }
    .inpdis{
        >span{
            width: 40px;
            text-align: right;
            margin: 0px 10px;
        }
        >div{
            flex: 1;
        }
        .texwidbox{
            width: 80px;
        }
    }
}
</style>