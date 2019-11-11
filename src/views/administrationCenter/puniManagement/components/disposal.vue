<template>
    <div class="measuredetails">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="lvs">
            <!-- 订单详情 -->
            <!-- <orderdetail></orderdetail> -->
            
            <!-- 合同详情 -->
            <contractdetails :contract-id="contractId"></contractdetails>

            <!-- 输入框集合 -->
            <IllegalPunishment></IllegalPunishment>


            <ul class="orderlsit">
                <li>违规单号</li>
                <li>30247525000</li>
                <li>处罚类型</li>
                <li>
                    <el-select v-model="punish.type" placeholder="请选择" size="medium" style="min-width:222px;padding:2px 10px;">
                        <el-option
                            v-for="item in typeList" :key="item.value"
                            :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </li>
                <li>违规等级</li>
                <li>
                    <el-select v-model="punish.rate" placeholder="请选择" size="medium" style="min-width:222px;padding:2px 10px;">
                        <el-option
                            v-for="item in rateList" :key="item.value"
                            :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </li>
            </ul>

            <div>
                <div class="boxtit">违规信息</div>
                <div class="vioinfo">
                    <violainformation ></violainformation>
                </div>
            </div>
            
            <div v-if="isJudge">
                <div class="boxtit">申诉内容</div>
                <div class="addmeas">
                    <addcomplain></addcomplain>
                </div>
                
            </div>
            
            <div class="tapbox">
                <div></div>
                <div v-if="isJudge">
                    <el-button type="primary" size="medium" @click="subminbtn">撤销</el-button>
                    <el-button size="medium" @click='cancel'>驳回并开具罚单</el-button>
                </div>
                <div v-else>
                    <el-button type="primary" size="medium" @click="subminbtn">申诉</el-button>
                    <el-button size="medium" @click='cancel'>接受</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import breadcrumb from "@/views/components/breadcrumb";

import orderdetail from "@/views/order/components/orderdetail"; //订单详情
import contractdetails from "@/views/administrationCenter/contractmanagement/components/contractdetails";   // 合同详情
import IllegalPunishment from './IllegalPunishment'; // 输入框集合


import addcomplain from "./addcomplain"; // 申诉内容
import violainformation from "./violainformation";
import { editOrderAssignedMeasure } from 'api/order/measuremanage/measuremanage';

export default {
    components: {
        breadcrumb,
        orderdetail,
        contractdetails,
        IllegalPunishment,

        addcomplain, // 申诉内容
        violainformation
    },
    data() {
        return {
            
            contractId: this.$route.query.contractId,
            orderId: this.$route.query.orderId,


            addmeasurereportdata: {
                assignedMeasureId: this.$route.query.id,
                customerId: this.$route.query.customerId,
                dealResult: "",
                reportTime:"",
                isRetest: "",
                isScene: "",
                customerAddressId: "",
                taskResult: "",
                enclosures: [],
                oldCustomerAddressId:this.$route.query.customerAddressId,
                customerAddress:{}
            },
            rateList: [
                {label: "张海霞",value:"1"},
                {label: "王就就",value:"2"},
            ],
            typeList:  [
                {label: "张海霞",value:"1"},
                {label: "王就就",value:"2"},
            ],
            orderId:Number(this.$route.query.orderId),
            customerId:Number(this.$route.query.customerId),
            isShow: true,
            navList: [],
            punish: {},
            isJudge: false,
            addcomplaindata: {},
        };
    },
    props: [],
    created() {
        if(this.$route.path == "/ordermm/judgedisposal") {
            this.isJudge = true;
        }
    },
    mounted() {
        // 头部面包屑
        this.navList=this.$route.meta;
    },
    methods: {
        cancel(){
            this.$router.go(-1)
        },
        subminbtn(addmeasurereportdata){
           this.$refs.address.confirm(true)  
        },
        
    },
    computed: {}
};
</script>

<style lang="scss" scoped>
    .measuredetails{
        .tapbox{
            padding: 10px 200px;
            border-radius: 2px;
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .addmeas{
            padding: 0px 200px;
        }
        .boxtit{
            background: #f5f5f5;
            padding: 10px 20px;
            color: #333333;
            font-size: 14px;
            margin: 20px 0px;
        }
    }

     .orderlsit{
            display: flex;
            li{
                padding: 0px 10px;
                display: flex;
                align-items: center;
                text-align:center;
                vertical-align: middle;
                border: 1px solid #e4e4e4;
                line-height: 2.2;
                &:nth-child(odd){
                    width: 120px;
                    text-align: center;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                &:nth-child(even){
                    flex: 1;
                    color: #999;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    display: block;
                }
                // 关联附属订单样式
                &.orderclas{
                    display: flex;
                    align-items: center;
                    span{
                        &:nth-child(odd){
                            color: #5F71E7;
                        }
                        &:nth-child(even){
                            color: #E50E0F;
                            margin-right: 10px;
                        }
                    }
                }
            }
        }
    
</style>

