<template>
    <div class="orderdetail">
        <el-input
            placeholder="定责单"
            v-model="taskDutyNumber"
            size="medium"
            maxlength="50"
            @focus="orderdialog"
            style="width:560px"
        ></el-input>
        <!-- <el-card class="m-bottom"> -->
        <!-- 查询条件组 -->
        <div class="orderdetails">
            <div class="orderbox">
                <ul class="orderlsit">
                    <li>订单编号</li>
                    <li>{{orderNumber}}</li>
                    <li>合同编号</li>
                    <li>{{detaiInfo.contractSerialNumber}}</li>
                    <li>客户姓名</li>
                    <li>{{detaiInfo.customerName}}</li>
                    <li>联系电话</li>
                    <li>{{detaiInfo.customerPhone}}</li>
                </ul>

                <ul class="orderlsit">
                    <li>定责人</li>
                    <li>{{detaiInfo.dutyName}}</li>
                    <li>定责原因</li>
                    <li>{{detaiInfo.dutyCause}}</li>
                    <li>定责时间</li>
                    <li>{{detaiInfo.sponsorTime}}</li>
                    <!-- <el-tooltip class="item" effect="dark" content="超期定责巴啦啦" placement="top">
                            <li>超期定责巴啦啦</li>
                    </el-tooltip>-->
                    <li>定责状态</li>
                    <li>{{dzstatus}}</li>
                </ul>

                <ul class="orderlsit">
                    <li>发起人</li>
                    <li>{{detaiInfo.initiateName}}</li>
                    <li>下单部下单时间</li>
                    <li>{{detaiInfo.orderTime}}</li>
                    <li>合同签字时间</li>
                    <li>{{detaiInfo.givenTime}}</li>
                    <li>合同安装时间</li>
                    <li>{{detaiInfo.predictInstallTime}}</li>
                </ul>

                <ul class="orderlsit">
                    <li>设计师提交时间</li>
                    <li>{{detaiInfo.designCommitTime}}</li>
                    <li>入库时间</li>
                    <li>{{detaiInfo.putStorageTime}}</li>
                    <li>首次安装时间</li>
                    <li>{{detaiInfo.firstInstallationTime}}</li>
                    <li>安装完成时间</li>
                    <li>{{detaiInfo.installationCompletionTime}}</li>
                </ul>
            </div>
        </div>
        <!-- </el-card> -->

        <!-- 订单 -->
        <el-dialog
            v-if="dialogVisible"
            custom-class="customDialogTitle"
            title="处罚单"
            :visible.sync="visible"
            width="80%"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :show-close="false"
        >
            <dutylist @selectionChange="selectionChange" ref="selectedCommodities"></dutylist>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmFun">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    echoByTaskDutyDetails // 选择定责单回显信息
} from "api/entrepotSet/compensationmanage/index";

import dutylist from "./dutylist";
import { log } from "util";

export default {
    data() {
        return {
            dialogVisible: false,
            visible: true, // 订单弹框是否显示
            selectedVal: [
                {
                    orderNumber: ""
                }
            ],
            taskDutyId: "", // 定责id
            taskDutyNumber: "", // 定责Num值
            orderNumber: '',
            detaiInfo: {
                contractSerialNumber: "",
                status: ""
            },
            dzstatus:''
            // selStatus:' ',
        };
    },

    watch: {
        "detaiInfo.status"(val) {
            // console.log(this.detaiInfo.status,typeof(this.detaiInfo.status),val,typeof(val),"this.detaiInfo.status 5444");

            let status = "";
            switch (val) {
                case 1:
                    status = "待处理";
                    break;
                case 2:
                    status = "处理中";
                    break;
                case 3:
                    status = "处理完成";
                    break;
                case 4:
                    status = "全部接受";
                    break;
                default:
                    status = "";
            }
            console.log(status, "status 66666");


            this.dzstatus = status;
            
        }
    },
    components: {
        dutylist
    },
    created() {
        // this.getDetails();
    },

    methods: {
        // 选择定责单 单选框
        selectionChange(val) {
            this.selectedVal = val;

            console.log(this.selectedVal, "this 5555");
        },
        confirmFun() {
            this.orderNumber = this.selectedVal[0].orderNumber;
            this.orderId = this.selectedVal[0].orderId;
            this.taskDutyId = this.selectedVal[0].taskDutyId;
            this.taskDutyNumber = this.selectedVal[0].taskDutyNumber;

            this.getDetails();
        },
        // 选择订单 -- input框
        orderdialog() {
            this.dialogVisible = true;
        },

        getDetails() {
            let data = {
                taskDutyId: this.selectedVal[0].taskDutyId
            };
            echoByTaskDutyDetails(data)
                .then(res => {
                    if (res.status == 200) {
                        if (res.data) {
                            this.detaiInfo = res.data;
                            this.$emit(
                                "get_CollectMoneyDetails",
                                this.detaiInfo.customerId
                            );
                        } else {
                            this.detaiInfo = this.detaiInfo;
                        }
                        this.dialogVisible = false;
                    }
                })
                .catch(err => {
                    console.log(
                        "仓储中心:赔偿管理 views/entrepotSet/compensationmanage/components/listdetail.vue",
                        err
                    );
                });
        }
    },
    computed: {}
};
</script>

<style lang="scss" scoped>
.orderdetail {
    .orderdetails {
        margin-top: 20px;
        width: 100%;
        border-radius: 2px;
        .orderbox {
            width: 100%;
            font-size: 14px;
            border-top: 1px solid #e4e4e4;
            border-left: 1px solid #e4e4e4;
            .orderlsit {
                display: flex;
                li {
                    padding: 0px 10px;
                    display: flex;
                    align-items: center;
                    border-right: 1px solid #e4e4e4;
                    border-bottom: 1px solid #e4e4e4;
                    line-height: 2.2;
                    &:nth-child(odd) {
                        width: 120px;
                        text-align: center;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }
                    &:nth-child(even) {
                        flex: 1;
                        color: #999;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        display: block;
                    }
                }
            }
        }
    }
}
</style>

