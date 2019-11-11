<template>
    <!-- 发起赔偿 -->
    <div class="wrapper">
        <div class="head_nav">
            <!-- 导航栏 -->
            <breadcrumb :navList="navList"></breadcrumb>
        </div>

        <el-card style="marginBottom: 54px;"  ref="print">
            <div class="iconBox m-bottom">
                <i class="Icon"></i>
                <span>发起赔偿</span>
            </div>
            <div class="add_head_list">
                <!-- <el-input placeholder="定责单" v-model="compensa.taskDutyNumber" size="medium" maxlength="50" @focus="orderdialog" style="width:560px"></el-input> -->

                <!-- 定责详情table -->
                <listdetail
                    :selectedVal="selectedVal"
                    ref="detailInfos"
                    @get_CollectMoneyDetails="getorderCollectMoneyDetails"
                ></listdetail>

                <div class="compensa_item">
                    <span>赔偿原因</span>
                    <el-input type="textarea" v-model="compensa.compensationCause"></el-input>
                </div>

                <div class="dutyList">
                    <div class="iconBox m-bottom">
                        <i class="Icon"></i>
                        <span>转账信息</span>
                    </div>
                    <el-form
                        :model="compensa"
                        ref="compensa"
                        label-width="120px"
                        class="demo-compensa"
                    >
                        <el-form-item label="赔偿方式" prop="compensationWay">
                            <el-select v-model="compensa.compensationWay" placeholder="赔偿方式">
                                <el-option
                                    v-for="item in compensationList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="户名" prop="username" v-if="isShow == '2'">
                            <el-input v-model="compensa.username" placeholder="户名"></el-input>
                        </el-form-item>

                        <el-form-item label="银行信息" prop="customerBankCardId" v-if="isShow == '1'">
                            <el-select v-model="compensa.customerBankCardId" placeholder="银行信息">
                                <el-option
                                    v-for="item in bankInfo"
                                    :key="item.customerBankCardId"
                                    :label="item.customerBankCard"
                                    :value="item.customerBankCardId"
                                    class="optionSelf"
                                >
                                    <span>用户名: {{ item.accountName }}</span>
                                    <span>开户行:{{ item.affiliatedBank }}</span>
                                    <span>卡号:{{ item.bankCardNumber }}</span>
                                </el-option>
                                <!-- 用户名:${item.accountName} 开户行:${item.affiliatedBank} 卡号: ${item.bankCardNumber} -->
                            </el-select>
                        </el-form-item>

                        <el-form-item
                            label="备注"
                            prop="remake"
                            v-if="isShow == '3'"
                            style="width: 100%"
                        >
                            <el-input type="textarea" v-model="compensa.remake"></el-input>
                        </el-form-item>

                        <!-- <el-form-item label="开户行" prop="householdsbank">
							<el-input v-model="compensa.householdsbank" placeholder="开户行"></el-input>
						</el-form-item>

						<el-form-item label="银行卡号" prop="householdsnum">
							<el-input v-model="compensa.householdsnum" placeholder="银行卡号"></el-input>
                        </el-form-item>-->

                        <el-form-item label="赔偿金额" prop="compensationMoney">
                            <el-input-number
                                :controls="false"
                                placeholder="赔偿金额"
                                v-model="compensa.compensationMoney"
                                :precision="2"
                                :min="0"
                            ></el-input-number>
                            <!-- <el-input v-model="compensa.compensationMoney" placeholder="赔偿金额"></el-input> -->
                        </el-form-item>

                        <el-form-item label="减收金额" prop="reduceMoney">
                            <el-input-number
                                :controls="false"
                                placeholder="减收金额"
                                v-model="compensa.reduceMoney"
                                :precision="2"
                                :min="0"
                            ></el-input-number>
                            <!-- <el-input v-model="compensa.reduceMoney" placeholder="减收金额"></el-input> -->
                        </el-form-item>

                        <el-form-item label="客户签字" prop="customer" style="fontSize: 18px;">
                            <!-- <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入申诉内容" v-model="compensa.desc"> </el-input> -->
                            <!-- <el-input v-model="compensa.customer" placeholder="客户确认签字"></el-input> -->
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="btn_btn">
                <el-button type="primary" @click="emitPrint" :loading="btnLoading">发起并打印</el-button>
                <el-button @click="colseBtn">返回</el-button>
            </div>
        </el-card>
        <!-- 申诉弹框 -->
        <!-- <appealdia :visible="diaVisible" @close_dialog="closedialog" @send_dialog="senddialog"></appealdia> -->

        <!-- 定责列表 -->
        <el-dialog
            v-if="dialogVisible"
            custom-class="customDialogTitle"
            title="定责列表"
            :visible.sync="visible"
            width="80%"
            
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
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import listdetail from "./components/listdetail";
// import appealdia from "./components/appealdia";
import dutylist from "./components/dutylist";

import {
    listCustomer,
    orderCollectMoneyDetails, // 客户银行信息表
    addDutyCompensation,
    dutyCompensationDeatil // 查看回显
} from "api/entrepotSet/compensationmanage/index";

import spot from "@/assets/images/spot.png";
import { getNames } from "src/utils/pubilcFn.js";
import { getUUID } from 'api/pulicJava';
// import { getPdf } from "@/utils/htmlToPdf";

export default {
    components: {
        breadcrumb,
        listdetail,
        pagination,
        dutylist
        // appealdia
    },

    name: "addcompensation",

    data() {
        return {
            spot,
            btnLoading: false, // 按钮的loading Flag
            compensationNumber: '',
            //头部面包屑导航
            navList: [],
            customerId: '', // 客户id
            dialogVisible: false,
            visible: true, // 订单弹框是否显示
            selectedVal: [], // 选择的定责单
            bankInfo: [], // 银行信息
            isShow: "2", // 显示那个 现金-转账-其他
            ordernum: "", // 定责单input值
            compensa: {
                taskDutyId: "", // 定责id
                taskDutyNumber: "", // 定责Num值
                compensationCause: "", // 赔偿原因
                username: "", // 户名
                remake: "", // 备注
                customerBankCardId: "", // 银行信息
                accountName: "", // 用户名
                affiliatedBank: "", // 开户行
                bankCardNumber: "", // 卡号

                // householdsnum: '',
                compensationWay: "2", // 赔偿方式
                compensationMoney: "", // 赔偿金额
                reduceMoney: "" // 减收金额
            },
            // 条件
            compensationList: [
                {
                    label: "现金",
                    value: "2"
                },
                {
                    label: "转账",
                    value: "1"
                },
                {
                    label: "其他",
                    value: "3"
                }
            ],

            rules: {
                // households: [
                // 	{ required: true, message: '请输入户名', trigger: 'blur' },
                // ],
                // compensationMoney: [
                // 	{ required: true, message: '请输入赔偿金额', trigger: 'blur' },
                // ],
                // reduceMoney : [
                // 	{ required: true, message: '请输入减收金额', trigger: 'blur' },
                // ],
                // obj: [
                // 	{ required: true, message: '请选择申诉对象', trigger: 'change' }
                // ],
                // pics : [
                // 	{ required: true, message: '请上传图片', trigger: 'change' }
                // ],
            }
        };
    },

    mounted() {
        // 头部面包屑
        this.navList = this.$route.meta;
        // 获取银行信息
        // this.getorderCollectMoneyDetails();
    },

    watch: {
        "compensa.compensationWay"(val) {
            if (this.compensa.compensationWay == "2") {
                // 现金
                this.isShow = "2";
                this.compensa.customerBankCardId = ""; // 转账方式的销毁
                this.compensa.accountName = ""; // 用户名
                this.compensa.affiliatedBank = ""; // 开户行
                this.compensa.bankCardNumber = ""; // 卡号

                this.compensa.remake = "";
            } else if (this.compensa.compensationWay == "1") {
                // 转账
                this.isShow = "1";
                this.compensa.username = "";

                this.compensa.remake = "";
            } else if (this.compensa.compensationWay == "3") {
                // 其他
                this.isShow = "3";

                this.compensa.username = "";
                this.compensa.customerBankCardId = ""; // 转账方式的销毁
                this.compensa.accountName = ""; // 用户名
                this.compensa.affiliatedBank = ""; // 开户行
                this.compensa.bankCardNumber = ""; // 卡号
            }
        }
    },

    created() {},

    methods: {
        confirmFun() {
            this.compensa.taskDutyId = this.selectedVal[0].taskDutyId;
            this.compensa.taskDutyNumber = this.selectedVal[0].taskDutyNumber;

            this.dialogVisible = false;
        },
        // 选择定责单 单选框
        selectionChange(val) {
            this.selectedVal = val;

            console.log(this.selectedVal, "this 5555");
        },

        getorderCollectMoneyDetails(customerId) { // 子组件带过来的customerId
            this.customerId = customerId;

            let data = {
                customerId
            };

            orderCollectMoneyDetails(data)
                .then(res => {
                    if (res.status == 200) {
                        this.bankInfo = res.data.rows;

                        this.bankInfo = this.bankInfo.map(item => {
                            item.customerBankCard = `用户名:${item.accountName} 开户行:${item.affiliatedBank} 卡号: ${item.bankCardNumber}`;
                            return item;
                        });
                    }
                })
                .catch(err => {
                    console.log(
                        "仓储中心:赔偿管理 views/entrepotSet/compensationmanage/index.vue",
                        err
                    );
                });
        },

        // 选择订单 -- input框
        orderdialog() {
            this.dialogVisible = true;
        },
        // 预 览
        submission() {},
        // 发起并打印
        emitPrint() {
            if (
                !this.$refs.detailInfos.taskDutyId ||
                !this.$refs.detailInfos.taskDutyNumber
            ) {
                // 定责id  定责Num值
                this.$message({
                    message: "请选择定责单",
                    type: "warning"
                });
                return;
            }

            if (!this.compensa.compensationWay) {
                this.$message({
                    message: "请选择赔偿方式",
                    type: "warning"
                });
                return;
            }

            this.bankInfo.map(item => {
                if (
                    item.customerBankCardId == this.compensa.customerBankCardId
                ) {
                    this.compensa.accountName = item.accountName; // 用户名
                    this.compensa.affiliatedBank = item.affiliatedBank; // 开户行
                    this.compensa.bankCardNumber = item.bankCardNumber; // 卡号

                    // this.compensa.compensationMoney = item.compensationMoney;  // 赔偿金额

                    // this.compensa.reduceMoney  = item.reduceMoney ;  // 减收金额
                }
            });

            if (this.compensa.compensationWay == "1") {
                // 1转账
                if (
                    !this.compensa.accountName ||
                    !this.compensa.affiliatedBank ||
                    !this.compensa.bankCardNumber
                ) {
                    this.$message({
                        message: "请选择银行信息",
                        type: "warning"
                    });
                    return;
                }
                if (
                    this.compensa.compensationMoney < 0 ||
                    this.compensa.reduceMoney < 0
                ) {
                    // 赔偿金额  减收金额
                    this.$message({
                        message: "请填写赔偿金额,减收金额",
                        type: "warning"
                    });
                    return;
                }
            }

            if (this.compensa.compensationWay == "2") {
                // 2现金
                if (!this.compensa.username) {
                    this.$message({
                        message: "请填写用户信息",
                        type: "warning"
                    });
                    return;
                }
                if (
                    this.compensa.compensationMoney < 0 ||
                    !this.compensa.reduceMoney < 0
                ) {
                    // 赔偿金额  减收金额
                    this.$message({
                        message: "请填写赔偿金额,减收金额",
                        type: "warning"
                    });
                    return;
                }
            }
            this.btnLoading = true;

            let data = {
                compensationNumber: this.compensationNumber,
                taskDutyId: this.$refs.detailInfos.taskDutyId,
                customerId: this.customerId, // 客户id
                compensationWay: this.compensa.compensationWay, // 赔偿方式
                compensationCause: this.compensa.compensationCause, // 赔偿原因
                compensationMoney: this.compensa.compensationMoney, // 赔偿金额
                reduceMoney: this.compensa.reduceMoney, // 减收金额
                remake: this.compensa.remake, // 备注
                username: this.compensa.username, // 户名
                customerBankCard: {
                    
                    // customerBankCardId: this.compensa.customerBankCardId, // 银行信息

                    customerBankCardId: this.compensa.customerBankCardId, // 所选的客户银行id
                    accountName: this.compensa.accountName, // 用户名
                    affiliatedBank: this.compensa.affiliatedBank, // 开户行
                    bankCardNumber: this.compensa.bankCardNumber // 卡号
                }
            };
            getUUID({serialNumber:'CO'}).then(res=>{
                data.compensationNumber = res.data;
                addDutyCompensation(data)
                    .then(res => {
                        if (res.status == 200) {
                            this.$message({
                                message: "发起赔偿成功",
                                type: "success"
                            });
                            // this.getPdf();
                            this.$print(this.$refs.print); // 打印
                            // this.$router.push("/compensationmanage/index");
                            this.btnLoading = false;
                        }
                    })
                    .catch(err => {
                        this.btnLoading = false;
                        console.log(
                            "仓储中心:赔偿管理 views/entrepotSet/compensationmanage/index.vue",
                            err
                        );
                    });
            })
            
        },

        colseBtn() {
            this.$router.go(-1);
        },

       
			


    }
};
</script>
<style scoped lang='scss'>
.add_head_list {
    .compensa_item {
        margin-top: 20px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
        span {
            width: 120px;
            text-align: right;
            padding-right: 12px;
            white-space: nowrap;
        }
    }
    .dutyList {
        .demo-compensa {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            width: 80%;
            > div {
                width: 50%;
                > div {
                    // > div.el-input {
                    //     width: 32%;
                    // }
                }
                .el-input-number {
                    width: 100%;
                }
                .el-select {
                    width: 100%;
                }
            }
        }
    }
}

.btn_btn {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
}
</style>

<style lang="scss">
.optionSelf {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 6px;
    span {
        text-align: left;
        display: inline-block;
        &:nth-of-type(1) {
            padding: 0 8px 0 0;
        }
        &:nth-of-type(2) {
            padding: 0 8px 0 0;
        }
        &:nth-of-type(3) {
            flex: 1;
        }
    }
}


.el-input-number .el-input__inner {
    text-align: left;
}
</style>


