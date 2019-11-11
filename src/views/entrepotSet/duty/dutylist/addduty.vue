<template>
    <div class="adddutywrapper">
        <div class="head_nav">
            <!-- 导航栏 -->
            <breadcrumb :navList="navList"></breadcrumb>
        </div>

        <!--组织结构弹出层-->
        <el-dialog
            title="组织结构"
            :visible.sync="organizationDialogVisible"
            width="540px"
            custom-class="customDialogTitle"
        >
            <div class="dialogBody">
                <el-tree
                    :data="organizationTree"
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                    node-key="id"
                ></el-tree>
                <el-tree
                    :data="organizationStaffTree.staff"
                    :props="defaultProps1"
                    @node-click="handleNodeClick1"
                    node-key="id"
                ></el-tree>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="selectOrganizationConfirm">确 定</el-button>
                <el-button @click="organizationDialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-card style="marginBottom: 54px;">
            <div class="iconBox m-bottom">
                <i class="Icon"></i>
                <span>发起定责</span>
            </div>
            <div class="add_head_list">
                <el-form
                    :model="duty" :label-position="labelPosition"
                    ref="ruleForm"
                    class="demo-form-inline"
                    :rules="rules"
                    label-width="140px"
                >
                <el-form-item label="发起类型" class="search_item"  prop="sponsorType">
                    <el-radio-group v-model="duty.sponsorType">
                        <el-radio :label="1">订单</el-radio>
                        <el-radio :label="2">盘点</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="发起部门" class="search_item"  prop="groupName">
                    <el-input v-model="duty.groupName" :size="size" :readonly="readonly" placeholder="发起部门"></el-input>
                </el-form-item>

                <el-form-item label="发起人" class="search_item"  prop="sponsorName">
                    <el-input v-model="duty.sponsorName" :size="size" :readonly="readonly" placeholder="发起人"></el-input>
                </el-form-item>

                <el-form-item label="发起时间" class="search_item" prop="sponsorTime">
                    <el-date-picker   :size="size"
                        class="width-100"
                        v-model="duty.sponsorTime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:dd:ss" format="yyyy-MM-dd HH:dd:ss"
                        placeholder="发起时间"
                        :readonly="readonly"
                    ></el-date-picker>
                </el-form-item>

                <el-form-item label="定责来源" class='search_item' prop="source">
                    <el-select
                        v-model="duty.source"
                        placeholder="定责来源"
                        size="medium"
                        style="width:220px"
                    >
                        <el-option
                            v-for="item in sourceList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="订单号/采购合同号" class="search_item" prop="orderNumber">
                    <el-input
                        placeholder="订单号/采购合同号"
                        v-model="duty.orderNumber"
                        size="medium"
                        :readonly="disabled"
                        maxlength="50"
                        @focus="orderdialog"
                    ></el-input>
                </el-form-item>

                <el-form-item label="上传附件" class="search_item width_100" prop="fileList">
                    <el-upload
                        list-type="text"
                        :limit="5"
                        class="upload-demo"
                        action="string"
                        :http-request="uploadSectionFile"
                        :file-list="fileList"
                        :on-remove="handleRemove">
                            <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>

                <el-form-item label="定责原因" class="search_item width_100" prop="dutyCause">
                    <el-input type="textarea" v-model="duty.dutyCause"></el-input>
                </el-form-item>

            </el-form>


                <div class="addduty">
                    <ul class="addlist">
                        <!-- <li>
                            <div class="duty_item">
                                <label class="labelEx">发起部门</label>
                                <el-input
                                    v-model="groupName"
                                    :size="size"
                                    :readonly="readonly"
                                    placeholder="发起部门"
                                ></el-input>
                            </div>
                        </li>
                        <li>
                            <div class="duty_item">
                                <label class="labelEx">发起人</label>
                                <el-input
                                    v-model="sponsorName"
                                    :size="size"
                                    :readonly="readonly"
                                    placeholder="发起人"
                                ></el-input>
                            </div>
                        </li>
                        <li>
                            <div class="duty_item">
                                <label class="labelEx">发起时间</label>
                                <el-input
                                    v-model="sponsorTime"
                                    :size="size"
                                    :readonly="readonly"
                                    placeholder="发起时间"
                                ></el-input>
                            </div>
                        </li>
                        <li>
                            <div class="duty_item head_nav_status">
                                <label class="labelEx">定责来源</label>
                                <el-select
                                    v-model="duty.source"
                                    placeholder="定责来源"
                                    size="medium"
                                    style="width:220px"
                                >
                                    <el-option
                                        v-for="item in sourceList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </div>
                        </li>
                        <li>
                            <label class="labelEx">订单号/采购合同号</label>
                            <el-input
                                placeholder="订单号/采购合同号"
                                v-model="duty.orderNumber"
                                size="medium"
                                :readonly="disabled"
                                maxlength="50"
                                @focus="orderdialog"
                                style="width:560px"
                            ></el-input>
                        </li> -->
                        <!-- <li class="width_100">
                            <div class="dutyPhoto">
                            <label class="labelEx">上传附件</label>
                                    <el-upload
                                        list-type="text"
                                        :limit="5"
                                        class="upload-demo"
                                        action="string"
                                        :http-request="uploadSectionFile"
                                        :file-list="fileList"
                                        :on-remove="handleRemove">
                                            <el-button size="small" type="primary">点击上传</el-button>
                                    </el-upload>
                            </div>
                        </li>
                        <li class="width_100">
                            <div class="duty_item">
                                <label class="labelEx">定责原因</label>
                                <el-input type="textarea" v-model="duty.dutyCause"></el-input>
                            </div>
                        </li> -->
                        <!-- <li class="width_100">
                            <div class="duty_item">
                                <span>备注</span>
                                <el-input type="textarea" v-model="duty.remake"></el-input>
                            </div>
                        </li> -->
                    </ul>
                </div>

                <!-- <dutytable></dutytable> -->
                <div class="h-width"></div>
                <div class="btn_list_1">
                    <el-button size="small" class="button-96" @click="deleteHandle">删除</el-button>
                    <el-button size="small" class="button-96" @click="addHandle">添加</el-button>
                </div>

                <div class="table_list lvs attribute m-top20 dutytables">
                    <el-table
                        border
                        ref="multipleTable"
                        :row-class-name="tableRowClassName"
                        :data="dutyBaseUsers"
                        @selection-change="handleSelectionChange"
                        style="width: 100%;"
                    >
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column label="被定责人" prop="dutyer" align="center">
                            <template slot-scope="scope">
                                <el-input
                                    v-model="scope.row.dutyer"
                                    placeholder="请选择被定责人"
                                    clearable
                                    @focus="selectOrganization(scope.row)"
                                ></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="部门" prop="organizationName" align="center"></el-table-column>
                        <el-table-column label="电话" prop="mobilePhone" sortable align="center"></el-table-column>
                        <el-table-column label="处罚方式" prop="punishType" align="center">
                            <template slot-scope="scope">
                                <el-select
                                    v-model="scope.row.punishType"
                                    placeholder="请选择处罚方式"
                                    size="medium"
                                >
                                    <el-option
                                        v-for="item in typeList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品详情" align="center">
                            <template slot-scope="scope">
                                <div>
                                    <p class="operation table_action_span" @click="ViewGoods(scope.row)">查看商品</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="处罚金额计算公式"
                            prop="punishMoneyCountType"
                            sortable
                            align="center"
                        >
                            <template slot-scope="scope">
                                <el-input
                                    class="width-100"
                                    placeholder="请填写处罚金额计算公式"
                                    v-model="scope.row.punishMoneyCountType"
                                    maxlength="50"
                                ></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="处罚金额" prop="punishMoney" sortable align="center">
                            <template slot-scope="scope">
                                <el-input-number class="width-100" :controls="false" placeholder="请填写处罚金额" v-model="scope.row.punishMoney" :precision="2" :min="0" ></el-input-number>
                                <!-- <el-input
                                    class="width-100"
                                    placeholder
                                    v-model="scope.row.punishMoney"
                                    maxlength="50"
                                ></el-input> -->
                            </template>
                        </el-table-column>
                        <el-table-column label="说明" prop="remake" align="center">
                            <template slot-scope="scope">
                                <el-input
                                    class="width-100"
                                    placeholder="请填写说明"
                                    v-model="scope.row.remake"
                                    maxlength="50"
                                ></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>

            <div class="backButton">
                <el-button type="primary" @click="submission('ruleForm')" :loading="btnLoading">确认发起</el-button>
                <el-button @click="colseBtn">取消</el-button>
            </div>
        </el-card>

        <!-- 订单 -->
        <!-- <div v-if="visible">
                <orderlist></orderlist>

                <el-dialog title="" :visible.sync="visible" >
                    <orderlist></orderlist>
                </el-dialog>
        </div>-->
        <!-- 订单 -->
        <ordercomponent
            v-if="centerDialogVisible"
            :centerDialogVisible="centerDialogVisible"
            @orderclosefun="orderclosefun"
            :orderId="duty.orderId"
        ></ordercomponent>

        <!-- 盘点 -->
        <inventorycomponent
            v-if="inventoryDialogVisible"
            :centerDialogVisible="inventoryDialogVisible"
            @orderclosefun="inventoryclosefun"
        ></inventorycomponent>




        <!-- 暂扣 -->
        <el-dialog top='2vh' title="查看商品" :visible.sync="withholdVisible" width="50%" :before-close="handleClose">
            <div>
                <div class="table_list lvs attribute">
                    <el-table
                        border
                        style="width: 100%"
                        :max-height="maxHeight"
                        :row-class-name="tableRowClassName"
                        :data="tableData"
                        @selection-change="handleChange"
                        >
                        <el-table-column align="center" type="selection" fixed="left"></el-table-column>
                        <el-table-column align="center" prop="factoryContractNo" label="商品编码" width="200" sortable></el-table-column>
                        <el-table-column align="center" prop="orderNumber" label="商品名称" width="150" sortable></el-table-column>
                        <el-table-column align="center" prop="createTime" label="品牌" width="170" show-overflow-tooltip></el-table-column>
                        <el-table-column align="center" prop="storeName" label="品类" width="150" show-overflow-tooltip></el-table-column>
                        <el-table-column align="center" prop="totality" label="总数量" width="120" show-overflow-tooltip sortable></el-table-column>
                        <el-table-column align="center" prop="paidInCount" label="实际库存" width="120" show-overflow-tooltip sortable></el-table-column>
                        <!-- <el-table-column align="center" prop="settlementCost" label="订单成本" width="200"></el-table-column>
                        <el-table-column align="center" prop="initialCost" label="订单收入" width="200"></el-table-column>-->
                        <el-table-column align="center" prop="storageName" label="所属仓库" width="140"></el-table-column>
                        <el-table-column align="center" prop="libraryOfAge" label="库龄" width="120"></el-table-column>
                        <el-table-column align="center" prop="loading" label="备注" width="200" show-overflow-tooltip></el-table-column>
                    </el-table>
                </div>
                <div class="pagination_wrap">
                    <pagination
                    :current-page="currentPage"
                    :pageSize="pageSize"
                    :total="total"
                    @sizeChange="sizeChange"
                    @currentChange="currentChange"
                    ></pagination>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="withholdFn">确 定</el-button>
                <el-button @click="handleClose">取 消</el-button>
            </span>
        </el-dialog>

        

    </div>
</template>
<script>
import { put } from "@/utils/pubilcFn";
import pagination from "@/views/components/pagination";
import { getUUID } from "api/pulicJava";
import breadcrumb from "@/views/components/breadcrumb";
import orderlist from "../components/orderlist";
import spot from "@/assets/images/spot.png";

import ordercomponent from "@/views/components/ordercomponent";
import inventorycomponent from "../components/inventorycomponent";
import { mapGetters } from "vuex";
import { getUpToken } from "@/utils/auth";
import { orderDetails } from 'api/order/order/order';

import {
    addTaskDuty, // 添加定责
    taskDutyDetails, // 回显
    listOrganizationStaff, // 获取组织人员
    listOrderChargeBack  //定责 暂扣查看商品
} from "api/entrepotSet/duty/index";

import { listOrganization } from "api/pulicJava";


export default {
    components: {
        breadcrumb,
        pagination,
        // pagination,
        orderlist,
        ordercomponent, // 订单
        inventorycomponent, // 盘点
        // prolist,
        // choseord
    },

    name: "addduty",

    data() {
        return {
            withholdVisible:false,
            disabled: false,
            size: 'medium',
            labelPosition: 'right',
            readonly: true,
            taskDutyNumber: '',
            btnLoading: false, // 按钮的loading Flag
            //头部面包屑导航
            navList: [],
            centerDialogVisible: false, // 订单弹出框
            inventoryDialogVisible: false, // 盘点弹出框
            duty: {
                source: "", //   来源
                orderNumber: "", //  订单号/采购合同号
                orderId: "", //  订单号/采购合同号
                dutyCause: "", //   定责原因
                remake: "", //  备注
                sponsorName: '', // 发起人
                sponsorTime: '', // 发起时间
                groupName: '', // 发起部门
                sponsorAt: '',
                groupId: '',
                sponsorType: 1, // 发起类型
            },
            dutyBaseUsers: [], // 表格数据
            // 条件
            sourceList: [
                {
                    // 来源条件
                    label: "安装",
                    value: "1"
                },
                {
                    label: "维修",
                    value: "2"
                },
                {
                    label: "入库",
                    value: "3"
                },
                {
                    label: "出库",
                    value: "4"
                },
                {
                    label: "物流",
                    value: "5"
                }
            ],
            typeList: [
                {
                    // 处罚方式
                    label: "罚款",
                    value: "1"
                },
                {
                    label: "暂扣",
                    value: "2"
                },
                {
                    label: "不处罚",
                    value: "4"
                },
                {
                    label: "其他",
                    value: "3"
                }
            ],
            id: 0, // 被定责人列表
            // 组织机构树
            idSel: {}, // 组织机构那一行的信息
            organizationDialogVisible: false, // 组织机构弹出框的显示
            organizationTree: [], // 组织机构数据
            organizationStaffTree: [], //  组织机构人员数据
            defaultProps: {
                children: "children",
                label: "label"
            },
            defaultProps1: {
                children: "children",
                label: "name"
            },
			organizationName: "", // 组织结构点击节点
            organizationId: '',
            staffName: '', // 组织结构人员name
            staffId: '', // 组织结构人员id
            mobilePhone: '',// 组织结构人员电话
            // 上传
            uptoken: {
                //上传参数
                token: "",
                key: ""
            },

            imgShow: "http://file.xczhihui.com/", //文件上传域名
            action: "http://up-z2.qiniup.com",
            accept: "image/jpeg,image/jpg,image/gif,image/png,image/bmp",
            fileList: [],
            // 分页
            currentPage: 1, //当前页数
            pageSize: 20, //总页数
            total: 0, //总条数
            visible: false,
            elsectVal: [],
            dutyType: "",
			desc: "",
			sponsorName: '', // 发起人
			sponsorTime: '', // 发起时间
			groupName: '', // 发起部门
			sponsorAt: '',
            groupId: '',
            // 上传
            fileList: [],
            imgArr: [],
            ruleForm: {
                stryppedPic: [],
            },
            rules: {
                orderNumber: [
                    { required: true, message: '请选择订单号/采购合同号', trigger: 'change' }
                ],
            },
            tableSelectList:[],
            tableData:[]
        };
    },

    mounted() {
        // 头部面包屑
        this.navList = this.$route.meta;
        this.uptoken.token = getUpToken();
    },
     computed: {
        ...mapGetters(["maxHeight"])
    },
    created() {
        this.getOrganization(); // 获取组织机构
        let data = {
            page: this.currentPage,
            limit: this.pageSize
        };
		// this.getList(data);
        this.gettaskDutyDetails(); // 回显
        
        if(this.$route.query.orderId) {
            // if(data.orderId){
            let data = {
                orderId: this.$route.query.orderId
            }
            orderDetails(data).then(res =>{
                if(res.status == 200){
                    this.detaildata = res.data;
                    this.duty.orderNumber = this.detaildata.orderNumber;
                    this.duty.orderId = this.$route.query.orderId;
                    this.disabled = true;
                    this.$store.dispatch('SET_ORDER_DETAILS', res.data);
                    
                }
            }).catch(error =>{
                console.log('订单管理:订单相关信息获取 addduty order/order/order.vue', error);
            })

        }else {
            this.disabled = false;
        }

	},
	filters: {
        // 千分号过滤方法
        fenge(val){
            return val ? (val+"").replace(/(?=(?!\b)(\d{3})+$)/g, ',') : 0;
        }
    },
    watch: {
        'duty.sponsorType' (val) {
            this.duty.orderNumber = '';
            this.dutyBaseUsers = [];
            if(val == 1) { // 订单
                this.typeList.splice(1,0,{
                    label: "暂扣",
                    value: "2"
                })

                // this.typeList.push({
                //     label: "暂扣",
                //     value: "2"
                // })
            }else if(val == 2) { // 盘点
                this.typeList.splice(1,1);


                // this.typeList = this.typeList.filter(item => {
                //     return item.value != "2";
                // })
            }
        },



    },

    methods: {
        //获取查看商品列表
        getData(){
            let data = {
                orderId: this.duty.orderId
            }
            listOrderChargeBack(data).then(res=>{
                if(res.status == 200){
                    console.log(res);
                    
                }
            }).catch(error=>{
                console.error('',error);
                
            })
        },
        // 查看商品确定
        withholdFn(){

        },
        ViewGoods(row) { // 点击查看商品详情按钮
            if(row.punishType == 2) { // 处罚方式为暂扣
                this.getData()
                this.withholdVisible = true;
            }else {
                this.$message.error("请更改处罚方式为暂扣")
            }
        },
        // 关闭查看商品
        handleClose(){
            this.withholdVisible = false;
        },
        handleChange(val) {
            this.tableSelectList = val;
        },
        //文件成功操作
		uploadSectionFile(res) {
			put(res).then(data => {
				// this.imgArr.push(data);
				this.fileList.push(data);
			});
		},

		//刪除图片
		handleRemove(file) {
			// console.log(file);
			let lengs = String(file.raw.uid).length;
			this.fileList = this.fileList.filter(item => {
				let str = item.name.substring(0, lengs);
				return str !== String(file.raw.uid);
			});
        },
        
        
		// 回显
        gettaskDutyDetails() {
            taskDutyDetails().then(res => {
                    if (res.status == 200) {
						this.duty.sponsorName = res.data.sponsorName;
						this.duty.groupName = res.data.groupName;  // 发起部门
						this.duty.sponsorTime = res.data.sponsorTime;  // 发起部门
						this.duty.sponsorAt = res.data.sponsorAt;
						this.duty.groupId = res.data.groupId
                    }
                    console.log(this.organizationId,"this.organizationId 8322");
					
                }).catch(err => {
                    console.log("定责管理:定责列表 添加定责 定责回显 duty/dutylist/addduty.vue",error);
                });
        },

        // 订单
        orderclosefun(val) {
            if (val && val.length > 0) {
                // 确定按钮
                console.log(val, "val order");

                this.duty.orderNumber = val[0].orderNumber;
                this.duty.orderId = val[0].orderId;
                this.centerDialogVisible = false;
                this.$message.success("选择订单号/采购合同号成功");
            } else {
                // 取消按钮
                this.centerDialogVisible = false;
            }
        },

        inventoryclosefun(val) {
            if (val && val.length > 0) {
                // 确定按钮
                this.duty.orderNumber = val[0].orderNumber;
                this.duty.orderId = val[0].orderId;
                this.centerDialogVisible = false;
                this.$message.success("选择订单号/采购合同号成功");
            } else {
                // 取消按钮
                this.centerDialogVisible = false;
            }
        },

        //文件删除操作
        // handleRemove(file, fileList) {
        //     this.fileList = fileList;
        // },
        //文件上传成功
        handleAvatarSuccess(res, file, fileList) {
            this.fileList = fileList;
        },
        //文件上传失败
        handError(err) {
            this.$message.error("文件上传失败，可尝试退出登录重新操作");
        },
        //文件上传前操作
        beforeAvatarUpload(file) {
            //console.log(this.imgShow+file.lastModified+".jpg");
            this.uptoken.key = `${file.lastModified}.jpg`;
        },

        // 选择组织结构
        selectOrganization(idSel) {
            this.idSel = idSel; // 行数据
            this.organizationDialogVisible = true;
        },
        // 组织结构点击节点
        handleNodeClick(data) {
            this.organizationName = data.label; // 被定责人组织机构
            this.organizationId = data.id; // 被定责人组织机构id
            this.listOrganizationStaff(this.organizationId);
        },
        // 组织结构人员点击节点
        handleNodeClick1(data) {
            this.staffName = data.name; // 被定责人
            this.staffId = data.id; // 被定责人ID
            this.mobilePhone = data.mobilePhone;  // 被定责人电话
        },
        // 选择组织结构确认
        selectOrganizationConfirm() {
            if (this.staffId) {
                this.dutyBaseUsers.forEach(item => {
                    if (item.id == this.idSel.id) { // table行数据变成选择的数据
                        // item.dutyer = this.organizationName;
                        // item.dutyAt = this.organizationId;
                        item.organizationName = this.organizationName; // 被定责人组织机构
                        item.dutyer = this.staffName; // 被定责人
                        item.dutyAt = this.staffId; // 被定责人ID
                        item.mobilePhone = this.mobilePhone; // 被定责人电话

                    }
                });

                // this.ruleForm.organizationName = this.organizationName;
                // this.ruleForm.organizationId = this.organizationId;
                this.organizationDialogVisible = false;
                return;
            }
            this.$message.warning("请选择组织机构人员");
        },
        // 获取组织机构
        getOrganization() {
            listOrganization().then(response => {
                if(response.status == 200) {
                    const result = response.data;
                    this.organizationTree = result;
                }
            }).catch(error => {
                console.log("定责管理:定责列表 获取组织机构 duty/dutylist/addduty.vue",error);
            });
        },
        // 获取组织人员
        listOrganizationStaff(id) {
            let data = {
                organizationId: id
            }
            listOrganizationStaff(data).then(res => {
                if(res.status == 200) {
                    this.organizationStaffTree = res.data;
                }
            }).catch(error => {
                console.log("定责管理:定责列表 获取组织人员 duty/dutylist/addduty.vue",error);
            });
        },

        // 选择订单 -- input框
        orderdialog() {
            if(this.disabled) {
                return;
            }

            if(this.duty.sponsorType == 1) { // 订单弹出框的打开
                this.centerDialogVisible = true;
            }else if(this.duty.sponsorType == 2) { // 盘点弹出框的打开
                this.inventoryDialogVisible = true;
            }

        },
        // 表格选中警示信息 -- 只能选择一个订单并且必须选择
        warnMessage() {
            if (this.elsectVal.length > 1) {
                this.$message({
                    message: "只能选择一个订单",
                    type: "warning"
                });
                return;
            } else if (this.elsectVal.length < 1) {
                this.$message({
                    message: "抱歉， 请进行选择",
                    type: "warning"
                });
                return;
            }
            return true;
        },
        // 删除操作按钮
        deleteHandle() {
			if (this.elsectVal.length == 0) {
                this.$message({
                    message: "请进行选择",
                    type: "warning"
                });
                return;
            }
            this.elsectVal.forEach((attr, idx) => {
                this.dutyBaseUsers=this.dutyBaseUsers.filter(item => {
                    return attr.id !== item.id;
                });
            });
        },
        // 添加操作按钮
        addHandle() {
            if (this.elsectVal.length >= 1) {
                this.$message({
                    message: "请勿选择",
                    type: "warning"
                });
                return;
            }

            if(!this.duty.orderId) {
                this.$message({
                    message: "请选择订单号/采购合同号",
                    type: "warning"
                });
                return;
            }

            this.id = this.id + 1;

            this.dutyBaseUsers.push({
                id: this.id,
                dutyer: "",
            });
        },
        // 表格勾选函数回调
        handleSelectionChange(val) {
            this.elsectVal = val;
            console.log(this.elsectVal, "elsectVal");
        },

        // 取消操作按钮
        colseBtn() {
            this.$router.push("/duty/dutylist");
        },
        // getUUID(type) {
		// 	let data = {
		// 		serialNumber: 'DO'
		// 	}
		// 	getUUID(data).then(res => {
		// 		if(res.status == 200) {
		// 			this.taskDutyNumber = res.data;
		// 			this.submission();
		// 		}
		// 	}).catch(err => {
		// 		console.log('报废管理:报废管理 增加报废 entrepotSet/scrapmanagement/addScrap.vue', err);	
		// 	})
		// },
        // 确认发起操作按钮
        submission(formName) {
            
            // orderID为空的限制
            if(!this.duty.orderId) {
                this.$message({
                    message: "请选择订单号/采购合同号",
                    type: "warning"
                });
                return;
            }

            // 在没有点击添加操作按钮的前提下点击确认发起
            if(this.dutyBaseUsers.length == 0 ){
                this.$message({
                    message: "请添加被定责人和处罚方式",
                    type: "warning"
                });
                return;
            }
            // 添加的定责每一个只要没有定责人或者处罚方式或者处罚金额计算公式
            let flag = this.dutyBaseUsers.every(item => {
                return !(item.dutyer) || !(item.punishType) || !(item.punishMoneyCountType);
            })

            if(flag) {
                this.$message({
                    message: "请选择被定责人和处罚方式和处罚金额计算公式",
                    type: "warning"
                });
                return;
            }

            for(let i = 0; i < this.dutyBaseUsers.length; i++){
                // 有被定责人但是没有处罚方式
                if(this.dutyBaseUsers[i].dutyer && !this.dutyBaseUsers[i].punishType) {
                    this.$message({
                        message: "请选择被定责人的处罚方式",
                        type: "warning"
                    });
                    return;
                }
                 // 没有被定责人但是有处罚方式
                if(!this.dutyBaseUsers[i].dutyer && this.dutyBaseUsers[i].punishType) {
                    this.$message({
                        message: "有定责已选处罚方式但是没有选择定责人",
                        type: "warning"
                    });
                    return;
                }
            }


			let dutyBaseUsers = this.dutyBaseUsers.filter(item => {
                return item.dutyer && item.punishType
            });

            // 图片
            this.ruleForm.stryppedPic = this.fileList.map(item => {
                return {
                    fileUrl: item.url,
                    sourceName: item.name,
                };
            }); 

            // if(this.ruleForm.stryppedPic.length == 0) {
            //     this.$message({
            //         message: '清上传凭证',
            //         type: 'warning'
            //     });
            //     return;
            // }
            

            let data = {
                source: this.duty.source, // 来源
                sourceId: this.duty.orderId, //  订单号/采购合同号
                dutyCause: this.duty.dutyCause, //  定责原因
                remake: this.duty.remake, //  备注
                // taskDutyPics: this.fileList.map(item => {
                //     return { fileUrl: this.imgShow + item.response.key };
                // }),
                taskDutyPics: this.ruleForm.stryppedPic, // 图片
				dutyBaseUsers, // 表格
				
				sponsorName: this.duty.sponsorName, // 发起人
				groupName:	this.duty.groupName, // 发起时间
				sponsorTime: this.duty.sponsorTime, // 发起部门
				sponsorAt:  this.duty.sponsorAt,
				organizationId:  this.duty.groupId,
				
                // dutyBaseUsers: [{
                // 	dutyer: '', // 被定责人
                // 	organizationName: '', // 部门名称
                // 	mobilePhone: '', // 电话
                // 	dutyType: '', // 处罚方式
                // 	punishMoneyCountType: '', // 处罚金额计算公式
                // 	punishMoney: '', // 处罚金额
                // 	desc: '', // 说明
                // }]
            };

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.btnLoading = true;

                    getUUID({ serialNumber: 'DO' }).then(res => {
                        if(res.status == 200) {
                            data.taskDutyNumber = res.data;
                            
                            addTaskDuty(data)
                                .then(res => {
                                    if (res.status == 200) {
                                        this.$message({
                                            message: "定责发起成功",
                                            type: "success"
                                        });
                                        this.btnLoading = false;
                                        this.$router.push({
                                            path: "/duty/dutylist"
                                        });
                                    }
                                })
                                .catch(err => {
                                    this.btnLoading = false;
                                    console.log(
                                        "定责管理:定责列表 添加定责 duty/dutylist/addduty.vue",
                                        err
                                    );
                                });
                        }
                    }).catch(err => {
                        this.btnLoading = false;
                        console.log('定责管理:定责列表 添加定责 duty/dutylist/addduty.vue', err);	
                    })
                } else {
                    return false;
                }
            });

            
			
        },

        // 搜索条件获取
        searchdatas() {
            return {
                // names: this.names,
                // searchData: this.searchData[0],
                // dutyReason: this.dutyReason[0],
                // dutyType: this.dutyType[0],
                // goodsSource: this.goodsSource[0],

                page: this.currentPage,
                limit: this.pageSize
            };
        },

        // 分页函数回调
        currentChange(val) {
            this.currentPage = val;
            this.getData()
            // let data = this.searchdatas();
            // this.getList(data);
        },
        // 单页条数改变
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
            this.getData()
            // let data = this.searchdatas();
            // this.getList(data);
        },

        // 获取表格数据
        getList(data) {
            // listOrder(data).then(res =>{
            //     console.log(res);
            //     if(res.status == 200){
            //         this.total = res.data.total;
            //         this.tableData = res.data.rows;
            //     }
            // }).catch(error =>{
            //     console.log('订单管理:订单列表 order/order/order.vue', error);
            // })
        },

        tableRowClassName({ row, rowIndex }) {
            //表格斑马线设置
            return rowIndex % 2 != 0 ? "el-f0" : "";
        },
    }
};
</script>
<style scoped lang='scss'>
.adddutywrapper{
    .dialogBody{
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-around;
        // align-items: center;
    }
}

.add_head_list {
    width: 84%;
    .demo-form-inline {
        display: flex;
        flex-wrap: wrap;
        .search_item {
            width: 50%;
        }
        .width_100 {
            width: 100%;
        }
    }

    .addduty {
        .addlist {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            li {
                width: 50%;    
                margin: 10px 0px;
                padding: 0px 5px;
                .duty_item {
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: center;
                    .labelEx {
                        width: 120px;
                        font-size: 14px;
                        color: #606266;
                        padding-right: 12px;
                        text-align: right;
                        white-space: nowrap;
                    }
                }
            }
            .width_100 {
                width: 100%;
            }
        }
    }
}

// .add_head_list {
//     .addduty {
//         .addlist {
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             flex-wrap: wrap;
//             li {
//                 width: 28%;
//                 margin: 20px 0px;
//                 display: flex;
//                 flex-wrap: nowrap;
//                 justify-content: center;
//                 align-items: center;
//                 div {
//                     display: flex;
//                     flex-wrap: nowrap;
//                     justify-content: center;
//                     align-items: center;
//                     span {
//                         width: 120px;
//                         display: inline-block;
//                         white-space: nowrap;
//                         text-align: right;
//                         padding-right: 12px;
//                         box-sizing: border-box;
//                         &:nth-of-type(even) {
//                             text-align: left;
//                         }
//                     }
//                 }
//                 &:nth-of-type(n + 4) {
//                     width: 42%;
//                     justify-content: flex-start;
//                 }
//                 &:nth-of-type(n + 6) {
//                     width: 100%;
//                     justify-content: flex-start;
//                 }
//                 .dutyPhoto {
//                     display: flex;
//                     flex-wrap: nowrap;
//                     align-items: center;
//                     span {
//                         width: 250px;
//                         display: inline-block;
//                         white-space: nowrap;
//                         text-align: right;
//                         padding-right: 12px;
//                         box-sizing: border-box;
//                     }
//                 }
//             }
//             .remarks {
//                 width: 100%;
//                 .duty_item {
//                     display: flex;
//                     flex-wrap: nowrap;
//                     justify-content: center;
//                     align-items: center;
//                     width: 100%;
//                     .el-textarea {
//                         width: 80%;
//                     }
//                 }
//             }
//         }
//     }
//     .dutytables {
//         .el-input-number {
//             line-height: 23px;
//         }
//     }
// }

.backButton {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}
</style>

<style lang="scss">
.dutytables {
    .el-input__inner {
        height: 23px;
        line-height: 23px;
        border: 0px;
        appearance: none;
        background: transparent;
    }
    .el-input__suffix {
        display: none;
    }
}
</style>