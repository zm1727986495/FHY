<template>
    <!-- 订单基本信息组件 -->
    <div class="basicinformation">
        <!-- <ul class="btn_list_details">
            <li :class="{'chanclas': listindex === index}"
            v-for="(item,index) in tablistone"
            :key="index"
            @click="butGroupActions(index)">
                {{item}}
                <div class="hoverdiv">
                    <div v-if="index == 0">
                        <div>信息完善度</div>
                        <el-progress :percentage="70"></el-progress>
                    </div>
                    <ul class="designclas" v-if="index == 1">
                        <li>收费条数 <span>1条</span></li>
                        <li>退费条数 <span>2条</span></li>
                    </ul>
                    <ul class="designclas" v-if="index == 2">
                        <li>测量汇报 <span>已汇报</span></li>
                        <li>设计汇报 <span>已汇报</span></li>
                    </ul>
                </div>
            </li>
        </ul> -->
        <!-- 基础信息 -->
        <foundation></foundation>
        
        <div class="detailscontent">
            <!-- 基础信息 -->
            <foundation v-if="listindex == 0"></foundation>
            <!-- 收/退费信息、合同审核、结算信息、送货信息、安装信息、回访信息组件 -->
            <div v-if="listindex == 1 || listindex == 5 ||
                listindex == 7 || listindex == 8 ||
                listindex == 9 || listindex == 10">
                <basicson :defaultselectone="listindex">
                </basicson>
            </div>
            <!-- 测量设计 -->
            <surveydesign v-if="listindex == 2"></surveydesign>
            <!-- 申请信息 -->
            <applicainformation v-if="listindex == 3"></applicainformation>

            <!-- 签合同 -->
            <signcontractcompo v-if="listindex == 4"></signcontractcompo>

            <!-- 合同拆单/采购合同 -->
            <PurchaseContract v-if="listindex == 6"></PurchaseContract>
            <!-- 合同拆单/库取单 -->
            <div class="martop" v-if="listindex == 6">
                <WarehouseListTable></WarehouseListTable>
            </div>
        </div>
    </div>
</template>
<script>
import basicson from "./basicson"//收/退费信息、合同审核、结算信息、送货信息、安装信息、回访信息组件
import foundation from "./foundation"//基础信息
import surveydesign from "./surveydesign"//测量设计
import applicainformation from "./applicainformation"//申请信息
import PurchaseContract from '@/views/administrationCenter/contractmanagement/components/PurchaseContract';//合同拆单
import WarehouseListTable from '@/views/administrationCenter/contractmanagement/components/WarehouseListTable';//库取单
import signcontractcompo from "./signcontractcompo"//签合同

export default {
    components: {
        basicson,
        foundation,
        surveydesign,
        applicainformation,
        PurchaseContract,
        WarehouseListTable,
        signcontractcompo,
    },
    data() {
        return {
            tablistone: ["基础信息", "收/退费信息", "测量设计", "申请信息", "签合同", "合同审核", "合同拆单", "结算信息", "送货信息", "安装信息", "回访信息"],
            listindex: -1,
        }
    },
    methods: {
        activecli(val){
            
        },
        butGroupActions(index) {
            this.listindex = index;
        }
    },
}
</script>
<style lang="scss">
    .basicinformation{
        .martop{
            margin-top: 20px;
        }
        .detailscontent{
            padding: 55px 20px 20px 20px;
        }
    }
</style>