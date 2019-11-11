<template>
    <div class="returnpoint">
        <el-form :label-position="labelPosition" 
            label-width="130px" 
            :disabled="true"
            :model="fromdata" 
            class="demo_form_inline">
            <el-form-item label="外部推荐人">
                <el-input v-model="fromdata.referrerName" size="medium" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="电话">
                <el-input v-model="fromdata.phone" size="medium" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="职位">
                <el-input v-model="fromdata.position" size="medium" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="所属公司">
                <el-input v-model="fromdata.companyName" size="medium" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="级别">
                <el-input v-model="fromdata.referrerLevelName" size="medium" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="银行卡号">
                <el-input v-model="fromdata.accountNumber" size="medium" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="外购商品金额">
                <el-input v-model="fromdata.purchasedGoodsMoney" size="medium" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="外购提成">
                <el-input v-model="fromdata.purchasedFee" size="medium" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="品牌金额">
                <el-input v-model="fromdata.brandMoney" size="medium" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="品牌提成">
                <el-input v-model="fromdata.brandFee" size="medium" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="返点金额">
                <el-input v-model="fromdata.rebatesMoney" size="medium" placeholder=""></el-input>
            </el-form-item>
<!--            <el-form-item label="推荐单数">-->
<!--                <el-input v-model="fromdata.customerName" size="medium" placeholder=""></el-input>-->
<!--            </el-form-item>-->
            <el-form-item label="备注" class="addressclas">
                <el-input type="textarea" v-model="fromdata.remake" size="medium" placeholder=""></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { 
    getReferrerInfo, //编辑订单回显
    } from 'api/order/order/orderdetails';
export default {
    data() {
        return {
            labelPosition: "right",
            fromdata: {},
            ywList: []
        }
    },
    created() {
        let data = {
            orderId: this.$route.query.orderId
        }
        getReferrerInfo(data).then(res => {
            if(res.status == 200 && res.data) {
                this.fromdata = res.data;
            }
        }).catch(error => {
            console.log('订单管理:订单列表 order/order/components/returnpoint.vue', error);
        })
    }
}
</script>
<style lang="scss">
    .returnpoint{
        padding-right: 50px;
        .demo_form_inline{
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            .selewi{
                width: 100%;
            }
        }
        .demo_form_inline>div{
            width: 40%;
        }
        .demo_form_inline .addressclas{
            width: 100%;
        }
    }
</style>
