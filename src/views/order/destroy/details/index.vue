<template>
    <div>
        <el-card class="box-card">
            <Orderdetail></Orderdetail>
            <OrderNumber></OrderNumber>
            <Tools></Tools>
            <BasicInFormation></BasicInFormation>
            <Quotation></Quotation>
        </el-card>
    </div>
</template>
<script>
import Orderdetail from '../../components/orderdetail'
import OrderNumber from './orderNumber';
import BasicInFormation from "./basicInFormation";
import Tools from './tools';
import Quotation from './quotation'
export default {
    components:{
        Orderdetail,
        OrderNumber,        //订单编号
        Tools,              //节点
        BasicInFormation,   //基础信息
        Quotation           //报价单
    }
}
</script>
<style lang="">
    
</style>