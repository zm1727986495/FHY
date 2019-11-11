<template>
    <div>
        <el-card class="box-card">
            <div class="destory_top ">
                <div class="clearfloat orderForm">   
                    <div class="destory_orderIpt">
                        <el-input
                            placeholder="订单编号/客户合同号/客户姓名/客户电话/订单地址"
                            v-model="input1"
                            size="medium">
                            <i slot="suffix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </div>
                    <div class="destory_time">
                        <el-date-picker
                            size="medium"
                            v-model="dataValue"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="年/月/"
                            end-placeholder="年/月/"
                            style="width:275px">
                        </el-date-picker>
                    </div>
                    <div class="margin-form">
                        <el-select v-model="value" placeholder="请选择" size="medium">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="margin-form">
                        <el-select v-model="value" placeholder="请选择" size="medium">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="margin-form">
                        <el-select v-model="value" placeholder="请选择" size="medium">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="margin-form">
                        <el-select v-model="value" placeholder="请选择" size="medium">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="margin-form">
                        <el-select v-model="value" placeholder="请选择" size="medium">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="margin-form">
                        <el-select v-model="value" placeholder="请选择" size="medium">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="clearfloat orderButton">
                    <div class="destory_float">
                        <span>更多</span>
                        <el-button class="button-fc" type="warning" size="medium" >查询</el-button>
                        <el-button size="medium">重置</el-button>
                    </div>
                </div>
            </div>
            <div class="destory_btn">
                <el-button size="small" class="checkOrder">恢复订单</el-button>
                <el-button size="small" @click="viewDetails" class="checkDetails">查看详情</el-button>
                <el-button size="small" class="accessory">附件管理</el-button>
                <el-button size="small" class="export">导出</el-button>
            </div>
            <div class="destory_table lvs">
                <el-table
                :data="tableData"
                border
                :row-class-name="tableRowClassName"
                style="width: 100%">
                    <el-table-column
                    type="selection"
                    fixed
                    align="center"
                    width="55">
                    </el-table-column>
                    <el-table-column
                    align="center"
                    prop="status"
                    label="订单状态"
                    width="220"
                    :filters=status
                    :filter-method="filterHandler"
                    >
                        <template
                        ></template>
                    </el-table-column>
                    <el-table-column
                    prop="orderNum"
                    align="center"
                    label="订单号"
                    width="170"
                    :filters=orderNum
                    :filter-method="filterHandler"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="orderType"
                    align="center"
                    label="订单类型"
                    width="170"
                    :filters=orderType
                    :filter-method="filterHandler"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="itemType"
                    align="center"
                    label="订单货品类型"
                    width="170"
                    :filters=itemType
                    :filter-method="filterHandler"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="brand"
                    align="center"
                    label="产品品牌"
                    width="170"
                    :filters=brand
                    :filter-method="filterHandler"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="productClass"
                    align="center"
                    label="产品类别"
                    width="170"
                    :filters=productClass
                    :filter-method="filterHandler"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="contractAmount"
                    align="center"
                    label="合同金额/元"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="actualReceipt"
                    align="center"
                    label="实收金额/元"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="discountCouponNum"
                    align="center"
                    label="优惠券编码"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="discountCouponMoney"
                    align="center"
                    label="优惠券/金额"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="giftName"
                    align="center"
                    label="礼品名称"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="giftNum"
                    align="center"
                    label="礼品数量"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="giveWay"
                    align="center"
                    label="赠送方式"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="ContractDeductions"
                    align="center"
                    label="合同扣款/元"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="ContractDeductions"
                    align="center"
                    label="合同扣款/元"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="ContractDeductions"
                    align="center"
                    label="合同扣款/元"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="ContractDeductions"
                    align="center"
                    label="合同扣款/元"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="ContractDeductions"
                    align="center"
                    label="合同扣款/元"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="ContractDeductions"
                    align="center"
                    label="合同扣款/元"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="ContractDeductions"
                    align="center"
                    label="合同扣款/元"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="ContractDeductions"
                    align="center"
                    label="合同扣款/元"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="ContractDeductions"
                    align="center"
                    label="合同扣款/元"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="ContractDeductions"
                    align="center"
                    label="合同扣款/元"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="ContractDeductions"
                    align="center"
                    label="合同扣款/元"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="ContractDeductions"
                    align="center"
                    label="合同扣款/元"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="ContractDeductions"
                    align="center"
                    label="合同扣款/元"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="ContractDeductions"
                    align="center"
                    label="合同扣款/元"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="ContractDeductions"
                    align="center"
                    label="合同扣款/元"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="ContractDeductions"
                    align="center"
                    label="合同扣款/元"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="ContractDeductions"
                    align="center"
                    label="合同扣款/元"
                    width="170"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="ContractDeductions"
                    align="center"
                    label="合同扣款/元"
                    width="170"
                    >
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination_wrap">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage3"
                    :page-sizes="[100, 200, 300, 400]"
                    :page-size="15"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="1000">
                </el-pagination>
            </div>  
        </el-card>
    </div>
</template>
<script>
import { getNames } from '../../../utils/pubilcFn'
export default {
   data() {
        return {
            dataValue:"",
            status:[],
            orderNum:[],
            orderType:[],
            itemType:[],
            brand:[],
            productClass:[],
            searchData:"",
            input1: '',
            input2: '50',
            pageNum:50,
            pageList:500,
            options: [{
                value: '选项1',
                label: '黄金糕'
                }, {
                value: '选项2',
                label: '双皮奶'
                }, {
                value: '选项3',
                label: '蚵仔煎'
                }, {
                value: '选项4',
                label: '龙须面'
                }, {
                value: '选项5',
                label: '北京烤鸭'
                }],
            value: '',
            tableData: [{
                date: '2016-05-02',
                status:"作废",
                orderNum:"123165131",
                orderType:"正单",
                itemType:"定制",
                brand:"欧派",
                productClass:"橱柜",
                contractAmount:"1231.4141",
                actualReceipt:"1111",
                discountCouponNum:"-",
                discountCouponMoney:"-",
                giftName:"-",
                giftNum:"-",
                giveWay:"-",
                ContractDeductions:"-"
                },
                {
                date: '2016-05-02',
                status:"作废",
                orderNum:"123165131",
                orderType:"正单",
                itemType:"定制",
                brand:"欧派",
                productClass:"橱柜",
                contractAmount:"1231.4141",
                actualReceipt:"1111",
                discountCouponNum:"-",
                discountCouponMoney:"-",
                giftName:"-",
                giftNum:"-",
                giveWay:"-",
                ContractDeductions:"-"
                },
                {
                date: '2016-05-02',
                status:"作废",
                orderNum:"123165131",
                orderType:"正单",
                itemType:"定制",
                brand:"欧派",
                productClass:"橱柜",
                contractAmount:"1231.4141",
                actualReceipt:"1111",
                discountCouponNum:"-",
                discountCouponMoney:"-",
                giftName:"-",
                giftNum:"-",
                giveWay:"-",
                ContractDeductions:"-"
                },
                {
                date: '2016-05-02',
                status:"作废",
                orderNum:"123165131",
                orderType:"正单",
                itemType:"定制",
                brand:"欧派",
                productClass:"橱柜",
                contractAmount:"1231.4141",
                actualReceipt:"1111",
                discountCouponNum:"-",
                discountCouponMoney:"-",
                giftName:"-",
                giftNum:"-",
                giveWay:"-",
                ContractDeductions:"-"
                },
                {
                date: '2016-05-02',
                status:"作废",
                orderNum:"123165131",
                orderType:"正单",
                itemType:"定制",
                brand:"欧派",
                productClass:"橱柜",
                contractAmount:"1231.4141",
                actualReceipt:"1111",
                discountCouponNum:"-",
                discountCouponMoney:"-",
                giftName:"-",
                giftNum:"-",
                giveWay:"-",
                ContractDeductions:"-"
                },
                {
                date: '2016-05-02',
                status:"作废",
                orderNum:"123165131",
                orderType:"正单",
                itemType:"定制",
                brand:"欧派",
                productClass:"橱柜",
                contractAmount:"1231.4141",
                actualReceipt:"1111",
                discountCouponNum:"-",
                discountCouponMoney:"-",
                giftName:"-",
                giftNum:"-",
                giveWay:"-",
                ContractDeductions:"-"
                },
                {
                date: '2016-05-02',
                status:"作废",
                orderNum:"123165131",
                orderType:"正单",
                itemType:"定制",
                brand:"欧派",
                productClass:"橱柜",
                contractAmount:"1231.4141",
                actualReceipt:"1111",
                discountCouponNum:"-",
                discountCouponMoney:"-",
                giftName:"-",
                giftNum:"-",
                giveWay:"-",
                ContractDeductions:"-"
                },
                {
                date: '2016-05-02',
                status:"作废",
                orderNum:"123165131",
                orderType:"正单",
                itemType:"定制",
                brand:"欧派",
                productClass:"橱柜",
                contractAmount:"1231.4141",
                actualReceipt:"1111",
                discountCouponNum:"-",
                discountCouponMoney:"-",
                giftName:"-",
                giftNum:"-",
                giveWay:"-",
                ContractDeductions:"-"
            }],
            currentPage1: 5,
            currentPage2: 5,
            currentPage3: 5,
            currentPage4: 4
        }
   },
   created(){
        this.status=getNames("status",this.tableData)
        this.orderNum=getNames("orderNum",this.tableData)
        this.orderType=getNames("orderType",this.tableData)
        this.itemType=getNames("itemType",this.tableData)
        this.brand=getNames("brand",this.tableData)
        this.productClass=getNames("productClass",this.tableData)
   },
   methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
        viewDetails(){
            this.$router.push({path:'/orderDetails'}); 
        },
        datapickChange(){

        },
        filterHandler(value, row, column){
            const property = column['property'];
            return row[property] === value;
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
    },
}
</script>
<style scoped>
    .clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
    .clearfloat{zoom:1}
    .destory_top {
        padding:20px 0;
    }
    .orderForm{
        height:40px;
        line-height:40px;
        display: flex;
        justify-content: space-between;
        /* width:1645px; */
    }
    .destory_btn{
        height:50px;
        line-height:50px;
    }
    .destory_btn>button{
        background:#96bdde;
        border:#96bdde;
        color:#fff;
    }
    .orderButton{
        line-height:30px;
        height:40px;
        margin-top:15px;
        /* width:1645px; */
    }
    .destory_top{
        border-bottom:1px solid #ccc;
        border-top:1px solid #ccc;
    }
    .destory_orderIpt{
        width:374px;
    }
    .destory_orderIpt,.destory_time,.destory_select{
        float:left
    }
    .destory_time{
        margin-left:20px;
    }
    .margin-form{
        margin-left:20px;
    }
    .destory_select>div{
        width:128px;
        margin-left:19px;
    }
    .destory_float{
        float:right;
    }
    .destory_float span{
        font-size:12px;
        margin-right:10px;
    }
    .destory_table{
        width:calc(100vw - 275px);
    }
    .listNum{
        width:120px;
        font-size:14px;
    }
    .listNum>.destory_iptNum{
        width:50px;
        display:inline-block;
    }
    .pagination_wrap .btn-prev{
        background: #efefef;
    }
    .pagination_wrap .el-pagination .btn-next,
    .pagination_wrap .el-pagination .btn-prev{
        background: #efefef;
    }
    .pagination_wrap .el-pager li{
        background: #efefef;
        margin: 0 5px;
        border-radius: 4px;
    }
    .pagination_wrap .el-pager li.active{
        background: #96bdde;
        color: #fff;
    }
    
    
</style>
