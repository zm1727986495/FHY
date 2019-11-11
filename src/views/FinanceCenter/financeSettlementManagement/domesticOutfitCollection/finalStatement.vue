<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="iconBox"><i class='Icon'></i><span>收款信息</span>
                <span style="font-size:14px;color:#000;display:inline-block;margin-left:50px">
                    {{formList.paymentName}}
                </span>
            </div>
            <!-- <div style="text-align:right">
                共2笔收款
            </div> -->
            <div>
                <ul class="formList clearfloat">
                    <li class="list">
                        <span>付款方：</span>
                        <div>{{formList.paymentName}}</div>
                    </li>
                    <li class="list">
                        <span>收款方式：</span>
                        <div>{{formList.receivablesType==0?"支票":"汇款"}}</div>
                    </li>
                    <li class="list">
                        <span>收款账号：</span>
                        <div>{{formList.bankCardNumber}}</div>
                    </li>
                    <li class="list">
                        <span>汇款金额：</span>
                        <div>{{formList.receivablesMoney}} 元</div>
                    </li>
                    <li class="list">
                        <span>结算门店：</span>
                        <div>{{formList.storeName}}</div>
                    </li>
                    <li class="list">
                        <span>费用月份：</span>
                         <div class="head_nav_datapick">
                            <el-date-picker
                                size="medium" v-model="formList.receivablesDate" type="date"
                                value-format='yyyy-MM' format='yyyy-MM'
                                style="width:100%"
                                start-placeholder="选择创建订单时间" end-placeholder="选择创建订单时间">
                            </el-date-picker>
                        </div>
                    </li>
                    <li class="list">
                        <span>收款日期：</span>
                        <div>{{formList.receivablesDate}}</div>
                    </li>
                    <li class="list">
                        <span>结算类型：</span>
                        <div>
                            <el-radio  v-model="radios" :label="0">建材城</el-radio>
                        </div>
                    </li>
                    <li style="padding-left:40px;">
                        <el-checkbox v-model="isTallOrder">是否有结算订单明细</el-checkbox>
                        <el-checkbox v-model="isCost">是否有费用明细</el-checkbox>
                    </li>
                </ul>
            </div>
        </el-card>
        <BillingDetails :isShow="true" :storeId="storeId" :bmcReceivablesId="bmcReceivablesId" :radio=radios :isTallOrder="isTallOrder" :isCost="isCost"></BillingDetails>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import spot from '@/assets/images/spot.png';
import BillingDetails from 'views/components/billingDetails';
import { getBuildingMaterialsCity } from '@/api/FinanceCenter/financeSettlementManagement/domesticOutfitCollection/index';
import { formatAmount } from '@/utils/pubilcFn'
export default {
    components:{
        breadcrumb,
        pagination,
        BillingDetails,

    },
    created() {

    },
    mounted() {
        this.navList = this.$route.meta;
        getBuildingMaterialsCity(
            {
                bmcReceivablesId:this.$route.query.bmcReceivablesId
            }
        ).then(res=>{
            this.storeId=res.data.storeId;
            console.log(this.storeId)
            res.data.receivablesMoney=formatAmount(res.data.receivablesMoney);
            for(let i in this.formList){
                this.formList[i]=res.data[i];
            }
        })
    },
    data(){
        return{
            radios:0,
            navList:[],
            spot:spot,
            searchtext:'',
            currentPage:1,
            pageSize:10,
            total:10,
            dialog:false,
            bmcReceivablesId:this.$route.query.bmcReceivablesId,
            isTallOrder:true,
            isCost:true,
            searchData:'',
            storeId:'',
            formList:{
                paymentName:"",
                receivablesType:"",
                bankCardNumber:"",
                receivablesMoney:0,
                storeName:"",
                costMonth:"",
                receivablesDate:"",
            },
            collectionDays:'',
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        currentChange(val) {
            this.currentPage = val;
        //   this.getListData();
        },
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
        //   this.getListData();
        },
    },
}
</script>
<style scoped>
.clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
.clearfloat{zoom:1}
.formList>li{
    width:33.3%;
    height: 50px;;
    float: left;
    display: flex;
    align-items: center;
}
.list>span{
    display: inline-block;
    width: 120px;;
    text-align: right;
}
.list>div{
    display: inline-block;
}
</style>
