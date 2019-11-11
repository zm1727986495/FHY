<template>
  <div class="wrapper">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <!-- <div class="pageTitle">查询条件</div> -->
        <!-- 查询条件组 -->
        <el-card class="m-bottom">
            <!-- 查询条件组 -->
            <div class="warp_head_list">
                <div class="list_top">
                    <div class="search_item">
                        <el-input placeholder="订单号/合同号/到货单/采购单/客户姓名/电话" v-model="formline.orderGroup" size="medium" maxlength="50" @keydown.enter.native="onSearch"></el-input>
                    </div>
                    <div class="search_item">
                        <el-date-picker
                            size="medium" v-model="searchData" type="daterange" 
                            value-format='yyyy-MM-dd' format='yyyy-MM-dd' 
                            range-separator="-"
                            start-placeholder="接单开始时间" end-placeholder="接单结束时间">
                        </el-date-picker>
                    </div>
                    <div class="search_item">
                        <el-date-picker
                            size="medium" v-model="engagement" type="daterange" 
                            value-format='yyyy-MM-dd' format='yyyy-MM-dd' 
                            range-separator="-"
                            start-placeholder="再约时间开始" end-placeholder="再约时间结束">
                        </el-date-picker>
                    </div>
                    <div class="search_item">
                        <el-select v-model="formline.source"  placeholder="订单来源" size="medium" clearable filterable >
                            <el-option
                                v-for="item in orderList" :key="item.value"
                                :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="search_item">
                        <el-select v-model="formline.status" multiple placeholder="处理情况" size="medium" clearable filterable >
                            <el-option
                                v-for="item in typeList" :key="item.value"
                                :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
					<!-- <div class="search_item"  v-if="status == 1">
                        <el-select v-model="processType"  placeholder="评价情况" size="medium">
                            <el-option
                                v-for="item in evaluationList" :key="item.value"
                                :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div> -->
                <p class="head_nav_btn">
                    <el-button class="button-fc" type="warning" size="medium"  @click="onSearch">查询</el-button>
                    <el-button class="el-button--medium" type="primary" size="medium"   @click="resetFun">重置</el-button>
                </p>
                </div>
            </div>

			<div class="h-width"></div> 

        	<div class="btn_list_1"> 
                <div v-for="(item,index) in actionBtnList" :key="index" style="marginLeft: 10px;">
                    <el-button
                        v-if="btnJurisdiction[item.str]"
                        :type="item.style"
                        size="small" class="button-96"
                        @click="butGroupActions(item.url,item.type)"
                    >{{item.name}}</el-button>
                </div>
        	</div>

			<div class="table_list lvs attribute m-top20" v-loading="loading">
				<el-table max-height="462" border :row-class-name="tableRowClassName"
					:data="tableList" style="width: 100%" ref="tableMulti" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" fixed='left'></el-table-column>
				<el-table-column label="合同号"  prop="customerContractNumber" align="center" width="170" fixed='left' show-overflow-tooltip>
                    <template slot-scope="scope">
						<div>
                            <!-- @click="operaButton(scope.row)" -->
							<p class="table_action_span">{{ scope.row.customerContractNumber }}</p >
						</div>
					</template>
                </el-table-column>
                <el-table-column label="订单号" prop="orderNumber" align="center"  width="150">
                    <template slot-scope="scope">
                        <div>
                             <p class="table_action_span" @click="orderDetails(scope.row)">{{scope.row.orderNumber}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="安装部" prop="serveGroupName" align="center" width="120" show-overflow-tooltip></el-table-column>
                <el-table-column  label="状态" prop="statusName"  width="100"  align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
						<div>
                            <!-- 0待回访 订单完成 2驳回 3回访未完成 -->
							<p v-if="scope.row.statusName == 0">待回访</p>
							<p v-if="scope.row.statusName == 1">订单完成</p>
							<p v-if="scope.row.statusName == 2">驳回</p>
							<p v-if="scope.row.statusName == 3">回访中</p>
						</div>
					</template>
                </el-table-column>
				<el-table-column label="操作时间" prop="operationTime" align="center" width="160" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作人" prop="operationName" align="center" width="80" show-overflow-tooltip></el-table-column>
				<el-table-column label="订单完成时间" prop="completionTime" align="center" width="160" show-overflow-tooltip></el-table-column>
				<el-table-column label="订单类型" prop="orderTypeName" align="center" width="120" show-overflow-tooltip></el-table-column>
                <el-table-column label="所属门店" prop="storeName" width="130" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column label="客户姓名" prop="customerName" align="center" width="100" show-overflow-tooltip></el-table-column>
				<el-table-column label="客户电话" prop="customerPhone" align="center" width="120"></el-table-column>
				<el-table-column label="订单地址" prop="address" align="center" width="150" show-overflow-tooltip></el-table-column>
                <el-table-column label="地址备注" prop="addressRemark" width="200" align="center" show-overflow-tooltip></el-table-column>                
                <el-table-column label="首次上门时间" prop="appointmentTime" width="160" align="center" show-overflow-tooltip></el-table-column>               
                <el-table-column label="再约时间" prop="againRecordTime" width="160" align="center" show-overflow-tooltip></el-table-column>               
                <el-table-column label="预计安装日期" prop="predictInstallTime" width="160" align="center" show-overflow-tooltip></el-table-column>  
				<el-table-column label="安装完成时间" prop="installCompleteTime" align="center" width="160"></el-table-column>    
                <el-table-column label="第一次出库时间" prop="firstOutboundOrderTime" width="160" align="center" show-overflow-tooltip></el-table-column> 
                <el-table-column label="是否当天完成" prop="orderEvaluateStatus" width="110" align="center">
                    <template slot-scope="scope">
                        <div>
                            <p v-if="scope.row.orderEvaluateStatus==1">是</p>
                            <p v-if="scope.row.orderEvaluateStatus==0">否</p>
                        </div>
                    </template>
                </el-table-column> 
                <el-table-column label="时间周期" prop="timeCycle" align="center" width="100"></el-table-column>
                <el-table-column label="设计师" prop="designerName"  width="100"  align="center" show-overflow-tooltip></el-table-column>                
                <el-table-column label="销售" prop="salesmanName"  width="100"  align="center" show-overflow-tooltip></el-table-column>              
				<el-table-column label="设计师评分" prop="designerGrade"  align="center" width="100"></el-table-column>
				<el-table-column label="销售评分" prop="sellGrade"  align="center" width="100"></el-table-column>
				<el-table-column label="安装评分" prop="installGrade"  align="center" width="100"></el-table-column>
				<el-table-column label="反馈意见" prop="clientEvaluation"  align="center" width="180" show-overflow-tooltip> </el-table-column>
                <el-table-column label="订货产品类别" prop="categoryName"  width="130"  align="center" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column label="创建人" prop="createName"  width="120"  align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" prop="createTime"  width="160"  align="center" show-overflow-tooltip></el-table-column> -->
				</el-table>
			</div>
			
			<div class="pagination_wrap">
				<pagination
					:current-page="currentPage"
					:pageSize="pageSize"
					:total="total"
					@sizeChange="sizeChange"
					@currentChange="currentChange">
				</pagination>
			</div>
        </el-card>

		<!-- 评价弹框 -->
        <el-dialog :title="'填写评价 (时间周期:' + timeCycle + ')'" custom-class="customDialogTitle" :visible.sync="dialogFormVisible" :close-on-click-modal='false' top="0" width="50%" class="custDia">
            <div class="dialogStyle">
                <el-form :model="ruleForm" ref="ruleForm" label-width="212px" class="demo-ruleForm dialogRate-form" :label-position="labelPosition">
                    <!-- 0 安装 -->
                    <div v-if="source == 0">
                        <el-row v-for="(item,index) in ruleForm.installOrderEvaluates" :key="index">
                            <el-col :span="span" v-if="item.evaluateType != 8">
                                <el-form-item v-if="item.evaluateType == 1" class="rateItem" :label="item.evaluateLabel" :rules="rulesObj1"  :prop="'installOrderEvaluates.' + index + '.evaluateStatus'">
                                    <el-radio-group @change="installStatusFn(1)" v-model="item.evaluateStatus" :disabled="editdonly">
                                        <el-radio :label="1">已完成</el-radio>
                                        <el-radio :label="0">未完成</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item v-else class="rateItem" :label="item.evaluateLabel" :rules="rulesObj"  :prop="'installOrderEvaluates.' + index + '.evaluateStatus'">
                                    <el-radio-group v-if="item.evaluateType == 2 || item.evaluateType == 3 || item.evaluateType == 4 || item.evaluateType == 5" v-model="item.evaluateStatus" :disabled="readonly">
                                        <el-radio :label="1">是</el-radio>
                                        <el-radio :label="0">否</el-radio>
                                    </el-radio-group>

                                    <el-input-number v-if="item.evaluateType == 6 || item.evaluateType == 7  || item.evaluateType == 9"
                                        style="width:120px;"
                                        :controls="false"
                                        v-model="item.evaluateStatus"
                                        :precision="1" :min="0" :max="5"
                                        :disabled="readonly"
                                        size="small"
                                    ></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :span="span" v-if="item.evaluateType != 8">
                                <el-form-item v-if="item.evaluateType==1" label="备注" label-width="60px">
                                    <el-input placeholder="请输入内容" maxlength='255' v-model="item.remake"></el-input>
                                </el-form-item>
                                <el-form-item v-else label="备注" label-width="60px">
                                    <el-input size="small" maxlength='255' :readonly="readonly" placeholder="请输入内容" v-model="item.remake" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="16"  v-if="item.evaluateType == 8">
                                <el-form-item label="反馈意见" >
                                    <el-input v-model="item.remake" type="textarea" placehoder="请输入反馈意见" :readonly="readonly"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                    <!-- 1 售后 -->
                    <div v-if="source == 1"> 
                        <el-row v-for="(item,index) in ruleForm.saleOrderEvaluates" :key="index">
                            <el-col :span="span" v-if="item.evaluateType != 8">
                                <el-form-item v-if="item.evaluateType == 1" class="rateItem" :label="item.evaluateLabel"  :rules="rulesObj1" :prop="'saleOrderEvaluates.' + index + '.evaluateStatus'">
                                    <el-radio-group @change="installStatusFn(2)"  v-model="item.evaluateStatus" :disabled="readonly">
                                        <el-radio :label="1">已完成</el-radio>
                                        <el-radio :label="0">未完成</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item v-else class="rateItem" :label="item.evaluateLabel"  :rules="rulesObj" :prop="'saleOrderEvaluates.' + index + '.evaluateStatus'">
                                    <el-input-number  v-if="item.evaluateType == 10 || item.evaluateType == 7"
                                        class="width-98"
                                        :controls="false"
                                        v-model="item.evaluateStatus"
                                        :precision="1" :min="0"  :max="5"
                                        :disabled="readonly"
                                        size="medium"
                                    ></el-input-number>
                                    <el-radio-group v-else v-model="item.evaluateStatus"  :disabled="readonly">
                                        <el-radio :label="1">是</el-radio>
                                        <el-radio :label="0">否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="span"  v-if="item.evaluateType != 8">
                                <el-form-item label="备注" label-width="60px">
                                    <el-input :readonly="readonly" maxlength='255' size="small" placeholder="请输入内容" v-model="item.remake" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="16" v-if="(item.evaluateType == 8)">
                                <el-form-item label="反馈意见">
                                    <el-input v-model="item.remake" type="textarea" placehoder="请输入反馈意见" :readonly="readonly"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>

                </el-form>
            </div>
			<div slot="footer" class="dialog-footer backButton">
				<el-button type="primary" @click="submission('ruleForm')" :loading="btnLoading" v-if="!editdonly">提交</el-button>
				<el-button  @click="colseBtn('ruleForm')">取消</el-button>
			</div>
        </el-dialog>

        <!-- 处理问题详情 -->
        <el-dialog title="沟通记录" top='2vh' custom-class="customDialogTitle" :visible.sync="dialogDealVisible" width="700px" >
			<div class="head_list">
                <el-form :model="valueForm" ref="valueForm" label-width="100px" class="demo-ruleForm">

                    <el-form-item 
                        label="再约时间" 
                        prop="againRecordTime"
                        :rules="{
                            required: true, message: '不能为空', trigger: 'trigger'
                        }">
                        <el-date-picker
                            size="medium" v-model="valueForm.againRecordTime" type="datetime" 
                            value-format='yyyy-MM-dd HH:mm:ss' format='yyyy-MM-dd HH:mm:ss' 
                            range-separator="-"
                            start-placeholder="年/月/日 时/分/秒" end-placeholder="年/月/日 时/分/秒">
                        </el-date-picker>
                    </el-form-item>
                
                    <el-form-item label="备注"  prop="remark">
                        <el-input type='textarea' placeholder="请输入内容" v-model="valueForm.remark" clearable></el-input>
                    </el-form-item>
            </el-form>
			</div>
			<div slot="footer" class="dialog-footer backButton">
				<el-button type="primary" @click="subDealmission('valueForm')" :loading="btnLoading">提交</el-button>
				<el-button  @click="colseDealBtn('valueForm')">取消</el-button>
			</div>
        </el-dialog>
    </div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import { mapGetters,mapMutations } from 'vuex';
import serveTable from "./components/serveTable";
// import scrapTable from "./components/scrapTable";
// import scrapDetails from "./components/scrapDetails";
import { getToken } from '@/utils/auth';
import module from '../../../../../config/index.js';
import {
  listCustomerService, // table数据
} from 'api/administrationCenter/administrativeservice/index';

import spot from '@/assets/images/spot.png';
import {
  listInstallOrderEvaluate, // 回显评价
  editInstallOrderEvaluate, // 修改评价
  addInstallOrderEvaluate,  // 修改评价
  addCustomerSeviceRecord, // 提交再约时间
  editCustomerService, // 处理问题
  customerServiceRecord,//再约时间回显
} from 'api/administrationCenter/administrativeservice/index';


export default {
	components: {
		breadcrumb,
		pagination,
		serveTable
		// scrapTable,
		// scrapDetails
	},
	data() {
		return {
            rulesObj:{ required: true, message: '不能为空', trigger: 'change' },
            rulesObj1:{ required: true, message: '不能为空', trigger: 'change' },
            valueForm: {
                recordTime: '', // 
                againRecordTime: '',
                recordAt: '', // 回访人
                remark: '',
            },
            readonly: false,
            editdonly: true,
            remake: '',
            dealForm: {
                status: '',
                remake: '',
            },
            btnLoading: false, // 按钮的loading Flag
			navList: [],
			spot,
            labelPosition: 'left',
            searchData: [],// 创建订单时间
            engagement:[],//再约时间
			formline : {
				orderGroup: '', // 条件搜索
				source: '', // 订单来源
				status: [], // 处理情况
			},
			downFile: '',
			sourceOrder: '',
			processType: '', 
            source: 0, // 0 安装 1 售后
            timeCycle: '', // 时间周期
			// 分页
			currentPage: 1,//当前页数
			pageSize: 20,//总页数
            total: 0,//总条数
            btnJurisdiction: JSON.parse(this.$loca.getItem('element')),
			actionBtnList: [
				{ name: "导出", style: "default", url: "/addbrand", type: 1, str: 'custservice_export'},
				{ name: "填写评价", style: "default", url: "/addbrand", type: 2, str: 'custservice_write' },
				{ name: "沟通记录", style: "default", url: "/addbrand", type: 3, str: 'custservice_deal' },
            ],
            dialogDealVisible: false,
			tableList: [], // 表格数据
			loading: true, // table的loading控制
			// 条件
			orderList:[
				{value: "1", label: "售后"},
				{ value: "0" , label: "安装"},
			],  // 订单来源数据
            // 0待回访 1订单完成 2驳回 3回访未完成
			typeList:[
				{value: "0", label: "待回访"},
				{value: "1", label: "订单完成"},
				{ value: "2" , label: "驳回"},
				{ value: "3" , label: "回访中"},
			],   // 处理情况数据
			evaluationList: [
				{value: "1", label: "已评价"},
				{ value: "0" , label: "未评价"},
				{ value: "2" , label: "部分评价"},
			],
			elsectVal: [], // table表单 勾选属性

			// 填写评价
            span: 12,
            evaluate: [],
			dialogFormVisible: false,
			ruleForm: {
                installOrderEvaluates: [
                    {
                        evaluateStatus: '',
                        evaluateLabel: '安装状态',
                        evaluateType: 1,
                        remake: ''
                    },
                    {
                        evaluateStatus: '',
                        evaluateLabel: '是否当天完成',
                        evaluateType: 2,
                        remake: ''
                    },
                    {
                        evaluateStatus: '',
                        evaluateLabel: '安装师傅上门前是否提前联系',
                        evaluateType: 3,
                        remake: ''
                    },
                    {
                        evaluateStatus: '',
                        evaluateLabel: '安装师傅是否有穿工服和鞋套',
                        evaluateType: 4,
                        remake: ''
                    },
                    {
                        evaluateStatus: '',
                        evaluateLabel: '货品是否有损坏',
                        evaluateType: 5,
                        remake: ''
                    },
                    {
                        evaluateStatus: 0,
                        evaluateLabel: '设计师评分',
                        evaluateType: 6,
                        remake: ''
                    },
                    {
                        evaluateStatus: 0,
                        evaluateLabel: '安装服务评分',
                        evaluateType: 7,
                        remake: ''
                    },
                    {
                        evaluateStatus: 0,
                        evaluateLabel: '销售评分',
                        evaluateType: 9,
                        remake: ''
                    },
                    {
                        evaluateStatus: '',
                        evaluateLabel: '反馈意见',
                        evaluateType: 8,
                        remake: ''
                    },
                ],
                saleOrderEvaluates: [
                    {
                        evaluateStatus: '',
                        evaluateLabel: '维修状态',
                        evaluateType: 1,
                        remake: ''
                    },{
                        evaluateStatus: '',
                        evaluateLabel: '是否当天完成',
                        evaluateType: 2,
                        remake: ''
                    },
                    {
                        evaluateStatus: 0,
                        evaluateLabel: '维修服务满意程度',
                        evaluateType: 7,
                        remake: ''
                    },
                    {
                        evaluateStatus: 0,
                        evaluateLabel: '客服评价',
                        evaluateType: 10,
                        remake: ''
                    },
                    {
                        evaluateStatus: 0,
                        evaluateLabel: '反馈意见',
                        evaluateType: 8,
                        remake: ''
                    }
                ]
            },

		}
    },
    // activated(){
    //     // 头部面包屑
    //     this.navList = this.$route.meta;
        
    //     this.downFile = module.dev.proxyTable['/api'].target + '/api/pc/customerService/exportCustomerService?customerServiceIds=';
	// 	let data = {
	// 		page: this.currentPage,
	// 		limit: this.pageSize,
	// 	};
	// 	this.getList(data);
    // },
    created() {
        this.downFile = module.dev.proxyTable['/api'].target + '/api/pc/customerService/exportCustomerService?customerServiceIds=';
        let {orderGroup,source,statusStr,takeOrderStartTime,takeOrderEndTime,againStartTime,againEndTime} = this.returnvisit;

        this.formline.orderGroup = orderGroup;
        this.formline.source = source;
        this.formline.status = statusStr?statusStr.split(','):[];
        this.searchData[0] = takeOrderStartTime?takeOrderStartTime:'';
        this.searchData[1] = takeOrderEndTime?takeOrderEndTime:'';
        this.engagement[0] = againStartTime?againStartTime:'';
        this.engagement[1] = againEndTime?againEndTime:'';
		let data = {
            ...this.returnvisit,
			page: this.currentPage,
			limit: this.pageSize,
		};
		this.getList(data);
	},
    mounted() {
		// 头部面包屑
		this.navList = this.$route.meta;
	},
    computed: {
        ...mapGetters(['returnvisit'])
    },
    methods: {
        //安装状态
        installStatusFn(type){
            let evaluateStatus = '';
            let remake = '';
            if(type==1){
                let ary = this.ruleForm.installOrderEvaluates.filter(item=>{
                    return item.evaluateType == 1;
                })
                evaluateStatus = ary[0].evaluateStatus;
                remake = ary[0].remake;
            }
            if(type==2){
                let arr = this.ruleForm.saleOrderEvaluates.filter(item=>{
                    return item.evaluateType == 1;
                })
                evaluateStatus = arr[0].evaluateStatus;
                remake = arr[0].remake;
            }


            if(evaluateStatus == 0){
                this.readonly = true;
                this.evaluaTereset(type,evaluateStatus,remake);
                this.rulesObj.required = false;
            }else{
                this.readonly = false;
            }
        },
        //重置评价
        evaluaTereset(flag,status,str){
            this.ruleForm={
                installOrderEvaluates: [
                    {
                        evaluateStatus: status,
                        evaluateLabel: '安装状态',
                        evaluateType: 1,
                        remake: str
                    },
                    {
                        evaluateStatus: '',
                        evaluateLabel: '是否当天完成',
                        evaluateType: 2,
                        remake: ''
                    },
                    {
                        evaluateStatus: '',
                        evaluateLabel: '安装师傅上门前是否提前联系',
                        evaluateType: 3,
                        remake: ''
                    },
                    {
                        evaluateStatus: '',
                        evaluateLabel: '安装师傅是否有穿工服和鞋套',
                        evaluateType: 4,
                        remake: ''
                    },
                    {
                        evaluateStatus: '',
                        evaluateLabel: '货品是否有损坏',
                        evaluateType: 5,
                        remake: ''
                    },
                    {
                        evaluateStatus: 0,
                        evaluateLabel: '设计师评分',
                        evaluateType: 6,
                        remake: ''
                    },
                    {
                        evaluateStatus: 0,
                        evaluateLabel: '安装服务评分',
                        evaluateType: 7,
                        remake: ''
                    },
                    {
                        evaluateStatus: 0,
                        evaluateLabel: '销售评分',
                        evaluateType: 9,
                        remake: ''
                    },
                    {
                        evaluateStatus: '',
                        evaluateLabel: '反馈意见',
                        evaluateType: 8,
                        remake: ''
                    },
                ],
                saleOrderEvaluates: [
                    {
                        evaluateStatus: '',
                        evaluateLabel: '维修状态',
                        evaluateType: 1,
                        remake: ''
                    },{
                        evaluateStatus: '',
                        evaluateLabel: '是否当天完成',
                        evaluateType: 2,
                        remake: ''
                    },
                    {
                        evaluateStatus: 0,
                        evaluateLabel: '维修服务满意程度',
                        evaluateType: 7,
                        remake: ''
                    },
                    {
                        evaluateStatus: 0,
                        evaluateLabel: '客服评价',
                        evaluateType: 10,
                        remake: ''
                    },
                    {
                        evaluateStatus: 0,
                        evaluateLabel: '反馈意见',
                        evaluateType: 8,
                        remake: ''
                    }
                ]
            }
        },
        //订单详情
        orderDetails(row) {
        this.$router.push({
            path: "/ordermm/details",
            query: { orderId: row.orderId }
        });
        },
        subDealmission(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        customerServiceId: this.elsectVal[0].customerServiceId,
                        againRecordTime:  this.valueForm.againRecordTime, //再约回访时间
                        remark:  this.valueForm.remark,
                    }
                    // this.btnLoading = true;
                    
                    addCustomerSeviceRecord(data).then(res => {
                        if(res.status == 200) {
                            this.$message({
                                message: '添加再约时间',
                                type: 'success'
                            });
                            // this.btnLoading = false;
                            this.dialogDealVisible = false;
                            this.onSearch()
                            
                            this.$refs[formName].resetFields();
                        }
                    }).catch(error => { 
                        this.btnLoading = false;
                        console.log('行政中心:客服回访 添加再约时间 views/administrationCenter/administrativeservice/custservice/components/reviewcontent', error);
                    })
                } else {
                    return false;
                }
            });
        },
		getRowKeys(row) {
            return row.customerServiceId;
        },
        rowClick(row, column, event) {
            if(column.property == 'customerContractNumber') { 
                let source = row.source;

                this.$router.push({
                    path: "backinstall",
                    query:{
                        customerServiceId: row.customerServiceId,
                        orderId: row.orderId,
                        installationOrderId: row.installationOrderId,
                        source: row.source,
                        status: row.statusName,
                    }
                });
                return;
            }

            // this.$refs.tableMulti.toggleRowSelection(row)
        },
        //来源 0安装 1售后
        sourceformatter(row) {
            let source = '';

            if(row.source == 0) {
                source = "安装";
            }else if(row.status == 1) {
                source = "售后";
            }
            return source;
        },
        
        // 分页函数回调
        currentChange(val) {
            this.currentPage = val;

            let data = this.searchdatas();
            this.getList(data);
        },
        // 单页条数改变
        sizeChange(val){
            this.currentPage = 1;
            this.pageSize = val;

            let data = this.searchdatas();
            this.getList(data);
		},

        // 查看操作按钮
        operaButton(val) {
            // console.log(val);
            let source = val.source;

            this.$router.push({
				path: "backinstall",
				query:{
					customerServiceId: val.customerServiceId,
					orderId: val.orderId,
                    installationOrderId: val.installationOrderId,
                    source: val.source
				}
			});
            
            // this.$router.push({path: "strateDetails", query:{id: id}});
        },

        //按钮组函数
		butGroupActions(url, type) {
			if (type == 1) {
                let token = getToken()
                if(this.elsectVal.length == 0){
                    let takeOrderStartTime = this.searchData[0]?this.searchData[0]:'';
                    let takeOrderEndTime = this.searchData[1]?this.searchData[1]:'';
                    let againStartTime = this.engagement[0]?this.engagement[0]:'';
                    let againEndTime = this.engagement[1]?this.engagement[1]:'';

                    let {orderGroup,source,status} = this.formline;
                    let orderGroup1 = orderGroup?orderGroup:'';
                    let source1 = source?source:'';
                    let status1 = status.join(',')?status.join(','):'';
                    window.location.href = `${module.dev.proxyTable['/api'].target}/api/pc/customerService/exportCustomerService?token= ${token}&orderGroup=${orderGroup1}&takeOrderStartTime=${takeOrderStartTime}&takeOrderEndTime=${takeOrderEndTime}&againStartTime=${againStartTime}&againEndTime=${againEndTime}&source=${source1}&statusStr=${status1}`
					// this.$refs.tableMulti.clearSelection();
                }else{
                    let data = this.elsectVal.map(item => {
                        return item.customerServiceId
                    }).join(",");
                    window.location.href = this.downFile + data + "&token=" + token;
					// this.$refs.tableMulti.clearSelection();
                }
			}else if( type == 2 ) { // 填写评价
				if (this.elsectVal.length < 1) {
					this.$message.warning("请勾选数据后再进行操作");
				}else if(this.elsectVal.length > 1) {
					this.$message.warning("请勿勾选多余一个")
				}else {
                    this.evaluaTereset()
					this.evalFun();
				}
			}else if(type == 3) { // 处理问题
                if (this.elsectVal.length < 1) {
					this.$message.warning("请勾选数据后再进行导出");
				}else if(this.elsectVal.length > 1) {
					this.$message.warning("请勿勾选多余一个")
				}else {
                    customerServiceRecord({customerServiceId:this.elsectVal[0].customerServiceId}).then(res=>{
                        if(res.status==200){
                            if(res.data){
                                this.valueForm.againRecordTime = res.data.againRecordTime;
                                this.valueForm.remark = res.data.remark;
                            }
                        }
                        this.submitForm();
                    }).catch(error=>{
                        console.error('再约时间回显',error);
                        
                    })
				}
            }
        },
        // 处理问题的打开操作按钮
        submitForm(formName) {
            
            // 0待回访 1回访已完成 2驳回 3回访未完成
            // this.dealForm.status = Number(this.elsectVal[0].statusName);
            this.dialogDealVisible = true;
        },
        // 处理问题的关闭按钮
        colseDealBtn(formName) {
            // this.$refs.tableMulti.clearSelection();
            // let data = this.searchdatas();
            // this.getList(data);
            
            this.dialogDealVisible = false;
            // this.$refs[formName].resetFields();
        },
        // 指派责任部门 -- 确定
        // subDealmission(formName) {
        //     let data = {
        //         status: this.dealForm.status,
        //         // status: 3,
        //         remake: this.dealForm.remake,
        //         customerServiceId: this.elsectVal[0].customerServiceId,

        //     };
        //     this.btnLoading = true;
        //     editCustomerService(data).then(res => {
        //         if(res.status == 200) {
        //             this.$message({
        //                 message: '处理问题成功',
        //                 type: 'success'
        //             });
        //             this.btnLoading = false;
        //             this.$refs.tableMulti.clearSelection();
        //             let data = this.searchdatas();
        //             this.getList(data);
        //             this.dialogDealVisible = false;
                    
        //             this.$refs[formName].resetFields();
        //         }
        //     }).then(err => {
        //         this.btnLoading = false;
        //         this.dialogDealVisible = false;
        //         console.log('行政中心:客服回访 指派责任部门 views/administrationCenter/administrativeservice/custservice/reviewcontent', err);	
        //     })
        // },

		// 回显评价
        listInstallOrderEvaluate() {
            let data = {
                customerServiceId: this.elsectVal[0].customerServiceId,

            }
            listInstallOrderEvaluate(data).then(res => {
                if(res.status == 200) {
                    this.evaluate = res.data.rows;
                    if(res.data.rows && res.data.rows.length > 0) {
                        this.readonly = true;
                        this.editdonly = true
                    }else{
                        this.readonly = false;
                        this.editdonly = false
                    }
                    if(this.evaluate && this.evaluate.length != 0) {
                        this.dealEvalute();
                    }
                }
            }).catch(error => {
                console.log('行政中心:客服回访 views/administrationCenter/administrativeservice/custservice/components/reviewcontent', error);
            })
        },
		// 点击填写评价按钮
        evalFun() {
            // 回显评价
	        this.listInstallOrderEvaluate();
            this.dialogFormVisible = true;
        },
		// 填写评价弹出框的取消按钮
        colseBtn(formName){
            // this.$refs.tableMulti.clearSelection();
            // let data = this.searchdatas();
            // this.getList(data);
            
            this.dialogFormVisible = false;
            // this.$refs[formName].resetFields();
		},
		// 处理回显的评价
        dealEvalute() {
            this.evaluate.forEach(item => {
                // source: 0, // 0 安装 1 售后
                if(this.source == 0) { // 0 安装
                    this.ruleForm.installOrderEvaluates.forEach(item2 => {
                        if (item.evaluateType == item2.evaluateType) {
                            item2.evaluateStatus = Number( item.evaluateStatus );
                            item2.remake = item.remake;
                            item2.installOrderEvaluateId = item.installOrderEvaluateId;
                        }
                    })
                }else if(this.source == 1) { // 1 售后
                    this.ruleForm.saleOrderEvaluates.forEach(item2 => {
                        if (item.evaluateType == item2.evaluateType) {
                            item2.evaluateStatus = Number( item.evaluateStatus );
                            item2.remake = item.remake;
                            item2.installOrderEvaluateId = item.installOrderEvaluateId;
                        }
                    })
                }

            })
            
            console.log(this.ruleForm.installOrderEvaluates, "this.ruleForm.installOrderEvaluates");
        },
		
		// 1安装状态 2是否当天完成 3安装师傅上门前是否提前联系 4安装师傅是否有穿工服和鞋套 5货品是否有损坏 6设计师满意程度 7安装服务满意程度 8客户评价
        // 填写评价弹出框的提交
        submission(formName){
            this.ruleForm.installOrderEvaluates.map(item => {
                return {
                    customerServiceId:  this.elsectVal[0].customerServiceId,

                }
            })
            // if(this.readonly) {
            //     this.$message.warning("请勿重复评价");
            //     return;
            // }

             this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {};
                    this.btnLoading = true;

                    if(this.source == 0) { // 0 安装 
                        let flag = this.ruleForm.installOrderEvaluates.every(item => {  
                            if(item.evaluateType == 6 || item.evaluateType == 7  || item.evaluateType == 9) {
                                if(!item.evaluateStatus) {
                                    return true;
                                }
                            }
                        })
                        
                        if(flag) {
                            this.$message.warning("请填写满意程度");
                            return;
                        }


                        this.ruleForm.installOrderEvaluates.forEach(item => {
                            item.customerServiceId = this.elsectVal[0].customerServiceId;
                        })

                        data.installOrderEvaluates = this.ruleForm.installOrderEvaluates;
                        data.installationOrderId = this.elsectVal[0].installationOrderId;
                        
                    }else if(this.source == 1) { // 1 售后
                        let flag = this.ruleForm.installOrderEvaluates.every(item => {  
                            if(item.evaluateType == 10 || item.evaluateType == 7) {
                                if(!item.evaluateStatus) {
                                    return true;
                                }
                            }
                        })
                        console.log(flag,"flag");
                        
                        if(flag) {
                            this.$message.warning("请选择满意程度");
                            return;
                        }

                        this.ruleForm.saleOrderEvaluates.forEach(item => {
                            item.customerServiceId = this.elsectVal[0].customerServiceId;
                        })

                        data.installOrderEvaluates = this.ruleForm.saleOrderEvaluates;
                        data.installationOrderId = this.elsectVal[0].installationOrderId;
                        
                    }

                    addInstallOrderEvaluate(data).then(res =>{
                        if(res.status == 200) {
                            this.$message({
                                message: '填写评价成功',
                                type: 'success'
                            });
                            this.btnLoading = false;
                            
                            // this.$refs.tableMulti.clearSelection();
                            let data = this.searchdatas();
                            this.getList(data);
                            this.dialogFormVisible = false;
                            
                            this.$refs[formName].resetFields();
                            // this.listInstallOrderEvaluate();
                        }
                    }).catch(err =>{
                        this.btnLoading = false;
                        console.log('行政中心:客服回访 修改评价 views/administrationCenter/administrativeservice/custservice/components/reviewcontent', err);
                    })
                } else {
                    return false;
                }
            });  
		},
		
        // table 颜色切换
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },

        //勾选函数回调
		handleSelectionChange(val) {
			this.elsectVal = val;
            console.log(this.elsectVal,"this.elsectVal");
            
            if(val && val.length != 0) {
                this.source = val[0].source;
                this.timeCycle = val[0].timeCycle;
                console.log(this.source,"这个是 source");
            }
            
		},

        // 获取表格数据
		getList(data){
            this.loading = true;
            listCustomerService(data).then(res =>{
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tableList = res.data.rows;

                    this.tableList.forEach(item => {
                        if(!item.appointmentTime){
                            item.timeCycle = "无";
                        }
    
                        if (item.appointmentTime && item.installCompleteTime) {
                            item.timeCycle = Math.ceil(
                            (new Date(item.installCompleteTime).getTime() -new Date(item.appointmentTime).getTime()) / 86400000 / 7);
                        } else if (item.appointmentTime &&!item.installCompleteTime) {
                            item.timeCycle = Math.ceil(
                            (new Date().getTime() -new Date(item.appointmentTime).getTime()) / 86400000 / 7);
                        }
                    })


					this.loading = false;
                }
            }).catch(error =>{
					this.loading = false;
                console.log('行政中心:客服回访 views/administrationCenter/administrativeservice/custservice/index', error);
            })
        },

        // 搜索条件获取
        searchdatas(){
            return {
                orderGroup: this.formline.orderGroup, 
				takeOrderStartTime: this.searchData ? this.searchData[0] : '',
                takeOrderEndTime:  this.searchData ? this.searchData[1] : '',
                againStartTime:this.engagement ? this.engagement[0] : '',
                againEndTime:this.engagement ? this.engagement[1] : '',
                source: this.formline.source,
                statusStr: this.formline.status.join(','),
                page: this.currentPage,
                limit: this.pageSize,
            };
		},
        ...mapMutations(['SET_RETURNVISIT']),
        // 查询
        onSearch(){
			this.currentPage = 1;
			let data = this.searchdatas();
            this.SET_RETURNVISIT(data)
            this.getList(data);
		},
		
        // 重置
        resetFun(){     
			this.formline.orderGroup = "";
            this.searchData = [];
            this.engagement = [];
            this.formline.source = '';
            this.formline.status = [];
		
			this.currentPage = 1;

            let data = this.searchdatas();
            this.SET_RETURNVISIT(data)
            this.getList(data);
		},
		
		


  }
};
</script>
<style scoped lang='scss'>
    .dialogStyle{
        max-height: 450px;
        padding: 0 10px;
        overflow-y: auto;
    }
	.warp_head_list {
        width: 100%;
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        .list_top{
            flex: 1;
            display: flex;
            flex-wrap: nowrap;
            >div{
                margin-bottom: 10px;
                padding: 0px 5px;
                width:17%;
                >div{
                    width: 100%;
                }
            }
            .fontMore{
                color:#d0cfcf;
            }
            .margright{
                margin-right: 5px;
            }
        }
        .head_nav_btn{
            min-width: 155px;
            // text-align: center;
            margin-bottom: 0px;
            .fontMore{
                color:#d0cfcf;
            }
            button+button{
                margin-left: 10px;
            }
        }

    }
	.btn_list_1 {
        display: flex;
        flex-wrap: nowrap;
	}
</style>

<style lang="scss">
.wrapper{
    .el-form-item{
        margin-bottom:5px;
    }
    .el-dialog__body{
        padding: 0px 20px;
    }
}
.custDia {
    >div {
        min-width: 880px;
    }
}
.dialogRate-form {
    .el-radio-group {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        height: 40px;
        line-height: 40px;
    }
    .el-form-item__content {
        
        vertical-align: middle;
    }
    .el-rate {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        vertical-align: middle;
        height: 40px;
        line-height: 40px;
    }
    .el-rate__icon {
        vertical-align: middle;
    }
    .el-input-number .el-input__inner {
        text-align: left;
    }
}
</style>