<template>
    <div class="signcontractcompo">
        <ul class="ul_btn_list">
            <li :class="{'chanclas': defaultselectone === index}"
            v-for="(item,index) in tablistone"
            :key="index"
            @click="butGroupActions(index)">{{item}}</li>
        </ul>
        <div class="contenclas">
            <!-- 合同信息 -->
            <contractinfocompon v-if="defaultselectone == 0"></contractinfocompon>
            <!-- 商品清单 -->
            <commodity v-if="defaultselectone == 1" :order-id="orderId"></commodity>
            <!-- 合同拆单/采购合同 -->
            <PurchaseContract v-if="defaultselectone == 2"></PurchaseContract>
            <!-- 库取单 -->
            <WarehouseListTable v-if="defaultselectone == 3"></WarehouseListTable>
            <!-- 客盆 -->
            <guestbasincompon v-if="defaultselectone == 4"></guestbasincompon>
        </div>
    </div>
</template>
<script>
import PurchaseContract from '@/views/administrationCenter/contractmanagement/components/PurchaseContract';//合同拆单
import WarehouseListTable from '@/views/administrationCenter/contractmanagement/components/WarehouseListTable';//库取单
import commodity from '@/views/administrationCenter/contractmanagement/components/commodity';
import guestbasincompon from "./guestbasincompon"
import contractinfocompon from "./contractinfocompon"
export default {
    components: {
        PurchaseContract,
        guestbasincompon,
        WarehouseListTable,
        contractinfocompon,
        commodity,
    },
    data() {
        return {
            tablistone: ["合同信息", "商品清单", "采购合同", "库取单", "客盆"],
            defaultselectone: 0,
            orderId: this.$route.query.orderId
        }
    },
    methods: {
        activecli(val){
            
        },
        butGroupActions(index) {
            this.defaultselectone = index;
        },
    },
}
</script>
<style lang="scss">
    .signcontractcompo{
        .contenclas{
            margin-top: 20px;
        }
    }
</style>