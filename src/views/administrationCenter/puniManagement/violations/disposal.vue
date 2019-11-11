<template>
    <div class="measuredetails">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="lvs">
            <!-- 订单详情 -->
            <orderdetail></orderdetail>
            
            <!-- 合同详情 -->
            <contractdetails :contract-id="contractId"></contractdetails>

            <!-- 违规审核 -->
            <IllegalPunishment></IllegalPunishment>


            <!-- <ul class="orderlsit">
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
            </ul> -->

            <!-- <div>
                <div class="boxtit">违规信息</div>
                <div class="vioinfo">
                    <violainformation ></violainformation>
                </div>
            </div> -->
            
            <div v-if="isJudge">
                <div class="boxtit">申诉内容</div>
                <div class="addmeas">
                    <addcomplain></addcomplain>
                </div>
            </div>
            
            <div class="tapbox" v-if="!isView">
                <div></div>
                <!-- 判定人 -->
                <div v-if="isJudge">
                    <el-button type="primary" size="medium" @click="reback">撤销</el-button>
                    <el-button size="medium" @click="subminbtn('reject')">驳回</el-button>
                </div>
                <!-- 责任人处理 -->
                <div v-else> 
                    <el-button type="primary" size="medium" @click="subminbtn('appeal')">申诉</el-button>
                    <el-button size="medium" @click='acceptFun'>接受</el-button>
                </div>
            </div>

            <!-- 申诉内容 -->
            <el-dialog title="申诉内容" v-if="responVisible" custom-class="customDialogTitle" :visible.sync="visible"  :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
                <addcomplain ref="addcomplainappeal"></addcomplain> 
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="confirmFun('appeal')">确 定</el-button>
                    <el-button @click="responVisible = false">取 消</el-button>
                </div>
            </el-dialog>

             <!-- 生成处罚单 -->
			<el-dialog  v-if="dialogVisible" custom-class="customDialogTitle" title="处罚单" :visible.sync="visible" width="50%">
				<punishlist isPunish></punishlist>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="confirmFun('punish')">确 定</el-button>
                    <el-button @click="dialogVisible = false">取 消</el-button>
                </div>
			</el-dialog>

        </el-card>
    </div>
</template>

<script>
import breadcrumb from "@/views/components/breadcrumb";

import orderdetail from "@/views/order/components/orderdetail"; // 订单详情
import contractdetails from "@/views/administrationCenter/contractmanagement/components/contractdetails";   // 合同详情
import IllegalPunishment from '../components/IllegalPunishment'; // 输入框集合
import punishlist from "../components/punishlist"; // 生成处罚单 

import addcomplain from "../components/addcomplain";
import violainformation from "../components/violainformation";
import { log } from 'util';
import { 
    addIllegalAllege, // 申诉
    decisionPersonProcessing,  // 判定人处理
    complaintContent, // 申诉内容回显
    acceptPunishment, // 责任人处理接受

} from 'api/administrationCenter/puniManagement/punish';

export default {
    components: {
        breadcrumb,
        orderdetail, // 订单详情
        contractdetails,  // 合同详情
        IllegalPunishment, // 输入框集合
        punishlist, // 生成处罚单 
        addcomplain,
        violainformation
    },
    data() {
        return {
            contractId: Number(this.$route.query.contractId),
            orderId:Number(this.$route.query.orderId),
            isView: false,
            // storeId : Number(this.$router.query.storeId),
            // contractId: 1,
            // orderId: 1,
            // 弹出框
            visible: true,
            dialogVisible: false, // 申诉内容 and 生成处罚单的弹出框的 flag
            responVisible: false,// 申诉内容弹出框的 flag
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

            customerId: Number(this.$route.query.customerId),
            isShow: true,
            navList: [],
            punish: {},
            isJudge: false,
            addcomplaindata: {},
            compContent: {}, // 申诉内容回显
        };
    },
    props: [],
    created() {
        if(this.$route.path == "/puniManagement/judgedisposal") {
            this.isJudge = true;
            // this.complaintContent(); // 申诉内容回显
        }  
        if(this.$route.path == "/puniManagement/viewdisposal") {
            this.isView = true;
            // this.complaintContent(); // 申诉内容回显
        }  
    },
    mounted() {
        // 头部面包屑
        this.navList=this.$route.meta;
    },
    methods: {
        // 责任人的接受按钮
        acceptFun(){
            this.$confirm('是否确定接受?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let data = {
                    illegalBillId: Number(this.$route.query.illegalBillId),
                }

                acceptPunishment(data).then(res => {
                    if(res.status == 200) {
                        this.$message({
                            type: 'success',
                            message: '接受完成'
                        });
                        this.$router.push("/puniManagement/violations");
                    }
                }).catch(err => {
                    console.log('违规处罚管理:违规管理 接受按钮 administrationCenter/puniManagement/violations/disposllal.vue', err);
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消接受操作'
                }); 
            });

            // let data = {
            //     illegalBillId: Number(this.$route.query.illegalBillId),
            // }

            // acceptPunishment(data).then(res => {
            //     if(res.status == 200) {
            //         this.$message({
            //             type: 'success',
            //             message: '接受完成'
            //         });
            //     }
            // }).catch(err => {
            //     console.log('违规处罚管理:违规管理 接受按钮 administrationCenter/puniManagement/violations/disposllal.vue', err);
            // })
        },
        // 页面的申诉按钮 and 驳回按钮 // illegalBillStatus: 1, // 驳回   illegalBillStatus: 4, // 撤销
        subminbtn(type){
            if(type == 'appeal') { // 责任人的申诉按钮
                this.responVisible = true;
            }else if(type == 'reject') { // 判定人的驳回
                // this.dialogVisible = true;
                this.$confirm('是否确认驳回违规单？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // illegalBillStatus: 1, // 驳回   illegalBillStatus: 4, // 撤销
                    let data = {
                        illegalBillStatus: 1, // 驳回
                        illegalBillId: this.$route.query.illegalBillId,
                    }
                    this.decisionPersonProcessing('reject',data); // 驳回
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消驳回'
                    });
                });
            }
        },
        // 申诉内容 -- 回显
        complaintContent() {
            let data = {
                illegalBillId: this.$route.query.illegalBillId,
            }
            complaintContent(data).then(res => {
                if(res.status == 200) {
                    this.compContent = res.data;
                }
            }).catch(err => {
               console.log('违规处罚管理:违规管理 申诉内容 administrationCenter/puniManagement/violations/disposllal.vue', err);
            })
        },

        // 弹出框的确定按钮
        confirmFun(type) {
            if(type == 'appeal') { // 申诉 formName
                if(!this.$refs.addcomplainappeal.compContent.illegalAllege.allegeContent) {
                    this.$message({
                        type: 'warning',
                        message: '请填写申诉内容'
                    });
                    return;
                }
                // this.$refs.addcomplainappeal.$refs.dynamicValidateForm.validate((valid) => {
                //     if (valid) {
                        let fileList = this.$refs.addcomplainappeal.imgArr.map(item => {
                            return {
                                fileUrl: item.url,
                                sourceName: item.name,
                                dataSourceEnum: "AllegeImg",
                                //     let sourceName = '',targetName = '', fileUrl = '';
                                // sourceName = res.key;
                                // targetName = file.name;
                                // fileUrl = this.imgShow + res.key;
                                // this.orderFollowFile.push({
                                //     fileUrl: fileUrl, // 地址
                                //     sourceName: sourceName,// 上传源文件名称 
                                //     targetName: targetName, // 服务器名称
                                // });
                                // ...item,
                                // url: item.fileUrl
                            };
                        });
                        let data = {
                            illegalBillId: this.$route.query.illegalBillId,
                            allegeContent: this.$refs.addcomplainappeal.compContent.illegalAllege.allegeContent, // 申诉内容
                            // allegeContent: this.$refs.addcomplainappeal.addcomplaindata.allegeContent,
                            accessoryList: fileList,
                        };
                        addIllegalAllege(data).then(res => {
                            if(res.status == 200) {
                                this.$message({
                                    type: 'success',
                                    message: '申诉成功!'
                                });

                                this.$router.push("/puniManagement/violations");
                            }
                        }).catch(err => {
                            console.log('违规处罚管理:违规管理 administrationCenter/puniManagement/violations/disposllal.vue', err);
                        })
                //     } else {
                //         return false;
                //     }
                // });

                // console.log(this.$refs.addcomplainappeal.imgArr,"this.$refs.addcomplainappeal.imgArr 555");
                
                
            }else if(type == 'punish') {

            }
            this.responVisible = false;
            this.dialogVisible = false;
        },
        // 撤销 and 驳回接口
        decisionPersonProcessing(type,data) { 
            decisionPersonProcessing(data).then(res => {
                if(res.status == 200) {
                    if(type == 'reback') {
                        this.$message({
                            type: 'success',
                            message: '撤销成功!'
                        });
                        this.$router.push("/puniManagement/violations");
                    }else if(type ==  'reject') {
                        this.$message({
                            type: 'success',
                            message: '驳回成功!'
                        });
                        this.$router.push("/puniManagement/violations");
                    }
                }
            }).catch(error => {
                console.log('违规处罚管理:违规管理 administrationCenter/puniManagement/violations/disposal.vue', error);
            })
        },

        // 撤销按钮 // illegalBillStatus: 1, // 驳回   illegalBillStatus: 4, // 撤销
        reback() { 
            this.$confirm('是否确认撤销违规单？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // illegalBillStatus: 1, // 驳回   illegalBillStatus: 4, // 撤销
                let data = {
                    illegalBillStatus: 4, // 撤销
                    illegalBillId: this.$route.query.illegalBillId,
                }
                this.decisionPersonProcessing('reback',data); // 撤销
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消撤销'
                });          
            });
        }
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

