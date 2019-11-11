<template>
    <div class="reviewcontent">
        <div class="titleTop">
            <!-- <div class="titlecals martop">回访内容</div> -->
            <div class="iconBox">
                <i class="Icon"></i>
                <span>回访内容</span>
            </div>
            <div class="eval">
                <!-- <el-button type="primary" size="medium" @click="evalFun">填写评价</el-button> -->
                <!-- <el-button type="primary" @click="submitForm">沟通记录</el-button>
                <el-button type="primary" size="medium" @click="invitionFun">添加再约时间</el-button> -->
            </div>
        </div>
        
        <div class="contract">
            <div class="contractcon">
                <!-- 0 安装 -->
                <div class="orderbox" v-if="source == 0">
                    <ul class="orderlsit">
                        <li>安装状态</li>
                        <li>
                            <!-- {{install.evaluateStatus ? '已完成' : '未完成'}} -->
                            <span v-if="install.evaluateStatus == 1">已完成</span>
                            <span v-if="install.evaluateStatus == 0">未完成</span>      
                        </li>
                        <li>备注</li>
                        <el-tooltip v-if="install.remake != ''" class="item" effect="dark" :content="install.remake" placement="top">
                            <li>{{install.remake}}</li>
                        </el-tooltip>
                        <li v-else></li>
                        <li>是否当天完成</li>  
                        <li>
                            <!-- {{isFinish.evaluateStatus ? '是' : '否'}} -->
                            <span v-if="isFinish.evaluateStatus == 1">是</span>
                            <span v-if="isFinish.evaluateStatus == 0">否</span>  
                        </li>
                        <li>备注</li>
                        <el-tooltip class="item" v-if="isFinish.remake != ''" effect="dark" :content="isFinish.remake" placement="top">
                            <li>{{isFinish.remake}}</li>
                        </el-tooltip>
                        <li v-else></li>
                    </ul>

                    <ul class="orderlsit">
                        <li>安装师傅上门前是否提前联系</li>
                        <li>
                            <!-- {{iscontact.evaluateStatus ? '是' : '否'}} -->
                            <span v-if="iscontact.evaluateStatus == 1">是</span>
                            <span v-if="iscontact.evaluateStatus == 0">否</span>  
                        </li>
                        <li>备注</li>
                        <el-tooltip class="item" v-if="iscontact.remake !=''" effect="dark" :content="iscontact.remake" placement="top">
                            <li>{{iscontact.remake}}</li>
                        </el-tooltip>
                        <li v-else></li>
                        <li>安装师傅是否有穿工服和鞋套</li>  
                        <li>
                            <!-- {{iswear.evaluateStatus ? '是' : '否'}} -->
                            <span v-if="iswear.evaluateStatus == 1">是</span>
                            <span v-if="iswear.evaluateStatus == 0">否</span>  
                        </li>
                        <li>备注</li>
                        <el-tooltip class="item" v-if="iswear.remake != ''" effect="dark" :content="iswear.remake" placement="top">
                            <li>{{iswear.remake}}</li>
                        </el-tooltip>
                        <li v-else></li>
                    </ul>
                    <ul class="orderlsit">
                        <li>货品是否有损坏</li>
                        <li>
                            <!-- {{isgoods.evaluateStatus ? '是' : '否'}} -->
                            <span v-if="isgoods.evaluateStatus == 1">是</span>
                            <span v-if="isgoods.evaluateStatus == 0">否</span>  
                        </li>
                        <li>备注</li>
                        <el-tooltip v-if="isgoods.remake != ''" class="item" effect="dark" :content="isgoods.remake" placement="top">
                            <li>{{isgoods.remake}}</li>
                        </el-tooltip>
                        <li v-else></li>
                        <li>销售满意程度</li>
                        <li>{{saledegree.evaluateStatus+'分'}}</li>
                        <li>备注</li>
                        <el-tooltip v-if="saledegree.remake !=''" class="item" effect="dark" :content="saledegree.remake" placement="top">
                            <li>{{saledegree.remake}}</li>
                        </el-tooltip>
                        <li v-else></li>
                    </ul>
                    <ul class="orderlsit">
                        <li>设计师满意程度</li>
                        <li>{{designdegree.evaluateStatus+'分'}}</li>
                        <li>备注</li>
                        <el-tooltip v-if="designdegree.remake !=''" class="item" effect="dark" :content="designdegree.remake" placement="top">
                            <li>{{designdegree.remake}}</li>
                        </el-tooltip>
                        <li v-else></li>
                        <li>安装服务满意程度</li>
                        <li>{{installdegree.evaluateStatus+'分'}}</li>
                        <li>备注</li>
                        <el-tooltip v-if="installdegree.remake != ''" class="item" effect="dark" :content="installdegree.remake" placement="top">
                            <li>{{installdegree.remake}}</li>
                        </el-tooltip>
                        <li v-else></li>
                    </ul>
                    <!-- <ul class="orderlsit">
                        <li>客户评价</li>
                        <li>{{customerdegree.evaluateStatus+'分'}}</li>
                        <li>备注</li>
                        <el-tooltip class="item" effect="dark" :content="customerdegree.remake" placement="top">
                            <li>{{customerdegree.remake}}</li>
                        </el-tooltip>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul> -->
                </div>
                <!-- 1 售后 -->
                <div class="orderbox" v-if="source == 1">

                    <ul class="orderlsit">
                        <li>维修状态</li>
                        <li>
                            <!-- {{maintain.evaluateStatus ? '已完成' : '未完成'}} -->
                            <span v-if="maintain.evaluateStatus == 1">已完成</span>
                            <span v-if="maintain.evaluateStatus == 0">未完成</span>      
                        </li>
                        <li>备注</li>
                        <el-tooltip v-if="maintain.remake !=''" class="item" effect="dark" :content="maintain.remake" placement="top">
                            <li>{{maintain.remake}}</li>
                        </el-tooltip>
                        <li v-else></li>
                        <li>是否当天完成</li>  
                        <li>
                            <!-- {{isSaleFinish.evaluateStatus ? '是' : '否'}} -->
                            <span v-if="isSaleFinish.evaluateStatus == 1">是</span>
                            <span v-if="isSaleFinish.evaluateStatus == 0">否</span>  
                        </li>
                        <li>备注</li>
                        <el-tooltip v-if=" isSaleFinish.remake !=''" class="item" effect="dark" :content="isSaleFinish.remake" placement="top">
                            <li>{{isSaleFinish.remake}}</li>
                        </el-tooltip>
                        <li v-else></li>
                    </ul>

                    <ul class="orderlsit">
                        <li>维修服务满意程度</li>
                        <li>{{salesdegree.evaluateStatus+'分'}}</li>
                        <li>备注</li>
                        <el-tooltip v-if="salesdegree.remake !=''" class="item" effect="dark" :content="salesdegree.remake" placement="top">
                            <li>{{salesdegree.remake}}</li>
                        </el-tooltip>
                        <li v-else></li>
                        <li>客服评价</li>
                        <li>{{servercedegree.evaluateStatus+'分'}}</li>
                        <li>备注</li>
                        <el-tooltip v-if="servercedegree.remake != ''" class="item" effect="dark" :content="servercedegree.remake" placement="top">
                            <li>{{servercedegree.remake}}</li>
                        </el-tooltip>
                        <li v-else></li>
                    </ul>
                </div>
                <!-- <ul class="customerlist">

                    <li>货品是否有损坏{{isgoods.evaluateStatus}}</li>
                    <li>备注：{{isgoods.remake}}</li>
                    <li>货品是否有损坏{{isgoods.evaluateStatus}}</li>
                    <li>备注：{{isgoods.remake}}</li>
                    <li>设计师满意程度{{evaluate.evaluateStatus}}</li>
                    <li>备注：{{evaluate.remake}}</li>
                    <li>安装服务满意程度{{evaluate.evaluateStatus}}</li>
                    <li>备注：{{evaluate.remake}}</li>
                    <li>客户评价{{evaluate.evaluateStatus}}</li>
                    <li>备注：{{evaluate.remake}}</li>
                </ul> -->
                <!-- <div class="labeliconbox">
                    <ul class="labelicon">
                        <li>急</li>
                        <li>客</li>
                        <li>抹</li>
                    </ul>
                </div>
                <div class="violationbox">
                    <div class="violation">
                        <span>违规单</span>
                    </div>
                </div> -->
            </div>
        </div>

        
        <div class="search_item"> 
            <!-- <div class="titlecals martop">备注:</div> -->
            <div class="iconBox">
                <i class="Icon"></i>
                <span>备注</span>
            </div>
            <el-input type="textarea" resize='none' v-model="remake"></el-input>
        </div>

        <!-- 评价弹框 -->
        <el-dialog title="填写评价" custom-class="customDialogTitle" :visible.sync="dialogFormVisible" width="50%">
            <el-form :model="ruleForm" ref="ruleForm" label-width="210px" class="demo-ruleForm">
                <el-row v-for="(item,index) in ruleForm.installOrderEvaluates" :key="index">
                    <el-col :span="span">
                        <el-form-item 
                            :label="item.evaluateLabel" 
                            :prop="'installOrderEvaluates.' + index + '.evaluateStatus'"
                            :rules="{
                                required: true, message: '不能为空', trigger: 'change'
                            }">
                            <el-rate v-if="item.evaluateType == 6 || item.evaluateType == 7 || item.evaluateType == 8"
                                v-model="item.evaluateStatus"
                                show-text>
                            </el-rate>
                            <el-radio-group v-model="item.evaluateStatus" v-else>
                                <el-radio :label="1" v-if="item.evaluateType == 1">已完成</el-radio>
                                <el-radio :label="1" v-else>是</el-radio>
                                <el-radio :label="0" v-if="item.evaluateType == 1">未完成</el-radio>
                                <el-radio :label="0" v-else>否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="span">
                        <el-form-item label="备注" label-width="60px">
                            <el-input
                                placeholder="请输入内容"
                                v-model="item.remake"
                                clearable>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
			<div slot="footer" class="dialog-footer backButton">
				<el-button type="primary" @click="submission('ruleForm')" :loading="btnLoading">提交</el-button>
				<el-button  @click="colseBtn('ruleForm')">取消</el-button>
			</div>

        </el-dialog>

        <!-- 再约时间弹框 -->
        <el-dialog title="再约时间" custom-class="customDialogTitle" :visible.sync="dialogVisible" width="50%">
            <el-form :model="valueForm" ref="valueForm" label-width="180px" class="demo-ruleForm">
                
                        <el-form-item 
                            label="本次回访时间" 
                            prop="recordTime"
                            :rules="{
                                required: true, message: '不能为空', trigger: 'trigger'
                            }">
                            <el-date-picker
                                size="medium" v-model="valueForm.recordTime" type="datetime" 
                                value-format='yyyy-MM-dd HH:mm:ss' format='yyyy-MM-dd HH:mm:ss' 
                                range-separator="-"
                                start-placeholder="年/月/日 时/分/秒" end-placeholder="年/月/日 时/分/秒">
                            </el-date-picker>
                        </el-form-item>
                    
                        <el-form-item label="回访人" prop="recordAt">
                            <el-input
                                placeholder="回访人"
                                v-model="name"
                                clearable readonly>
                            </el-input>
                        </el-form-item>

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
                            <el-input
                                placeholder="请输入内容"
                                v-model="valueForm.remark"
                                clearable >
                            </el-input>
                        </el-form-item>

            </el-form>
			<div slot="footer" class="dialog-footer backButton">
				<el-button type="primary" @click="submiFun('valueForm')" :loading="btnLoading">提交</el-button>
				<el-button  @click="colseFun('valueForm')">取消</el-button>
			</div>

        </el-dialog>

        <!-- 处理问题详情 -->
        <el-dialog title="处理问题详情" custom-class="customDialogTitle" :visible.sync="dialogDealVisible" width="30%" >
			<div class="head_list">
				<el-form :model="dealForm" ref="dealForm" label-width="100px" class="demo-ruleForm">
					<el-form-item label="" class="radioLine">
						<el-radio-group v-model="dealForm.status">
							<el-radio :label="1">回访已完成</el-radio>
							<el-radio :label="3">回访未完成</el-radio>
							<el-radio :label="2">驳回</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>
			</div>
			<div slot="footer" class="dialog-footer backButton">
				<el-button type="primary" @click="subDealmission" :loading="btnLoading">提交</el-button>
				<el-button  @click="colseDealBtn">取消</el-button>
			</div>
        </el-dialog>

    </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  listInstallOrderEvaluate, // 回显评价
  editInstallOrderEvaluate, // 修改评价
  addInstallOrderEvaluate,  // 修改评价
  addCustomerSeviceRecord, // 提交再约时间
  editCustomerService, // 处理问题
  customerServiceDatails, // 沟通记录回显
} from 'api/administrationCenter/administrativeservice/index';


  export default {
    
    data() {
        return {
            btnLoading: false, // 按钮的loading Flag
            isShow: true,
            review: {},
            dialogFormVisible: false,
            dialogVisible: false,
            evalu: {},
            evaluate: [],
            span: 12,
            offset: 0,
            valueForm: {
                recordTime: '', // 
                againRecordTime: '',
                recordAt: '', // 回访人
                remark: '',
            },
            remake: '',
            dealForm: {
                status: '',
            },
            dialogDealVisible: false,
            dialogVisible: false,
            source: this.$route.query.source, // 0 安装 1 售后
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
                        evaluateStatus: '',
                        evaluateLabel: '设计师满意程度',
                        evaluateType: 6,
                        remake: ''
                    },
                    {
                        evaluateStatus: '',
                        evaluateLabel: '安装服务满意程度',
                        evaluateType: 7,
                        remake: ''
                    },
                    {
                        evaluateStatus: '',
                        evaluateLabel: '客户评价',
                        evaluateType: 8,
                        remake: ''
                    }
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
                        evaluateStatus: '',
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
                ]
            },
            installOrderEvaluateId: '',
            // 安装状态
            install: {
                evaluateStatus: 1,
                remake:"",
            },
            // 是否当天完成
            isFinish: {
                evaluateStatus: 1,
                remake:"",
            },
            // 安装师傅上门前是否提前联系
            iscontact: { 
                evaluateStatus: 1,
                remake:"",
            },
            // 安装师傅是否有穿工服和鞋套
            iswear: {
                evaluateStatus: 1,
                remake:"",
            },
            // 货品是否有损坏
            isgoods: {
                evaluateStatus: 1,
                remake:"",
            },
            // 销售满意程度
            saledegree: {
                evaluateStatus: 5,
                remake:"",
            },
            // 设计师满意程度
            designdegree: {
                evaluateStatus: 5,
                remake:"",
            },
           // 安装服务满意程度
            installdegree: {
                evaluateStatus: 5,
                remake:"",
            },
           // 客户评价
            customerdegree: {
                evaluateStatus: 5,
                remake:"",
            },
            // 售后问题
            // 维修状态
            maintain: {
                evaluateStatus: 1,
                remake:"",
            },

            // 是否当天完成
            isSaleFinish: {
                evaluateStatus: 2,
                remake:"",
            },

            // 维修服务满意程度
            salesdegree: {
                evaluateStatus: 7,
                remake:"",
            },

            // 客服评价
            servercedegree: {
                evaluateStatus: 10,
                remake:"",
            },

            
            // installOrderEvaluates:[{
            //     customerServiceId: this.$route.query.customerServiceId,
            //     evaluateType: 1,
            //     evaluateStatus: 1,
            //     remake:"备注",
                
            // },{
            //     evaluateStatus:1,
            //     evaluateType:2,
            //     remake:"备注",
            //     customerServiceId:"1"
            // },{
            //     evaluateStatus:1,
            //     evaluateType:3,
            //     remake:"备注",
            //     customerServiceId:"1"
            // },{
            //     evaluateStatus:1,
            //     evaluateType:4,
            //     remake:"备注",
            //     customerServiceId:"1"
            // },{
            //     evaluateStatus:1,
            //     evaluateType:5,
            //     remake:"备注",
            //     customerServiceId:"1"
            // },{
            //     evaluateStatus:1,
            //     evaluateType:6,
            //     remake:"备注",
            //     customerServiceId:"1"
            // },{
            //     evaluateStatus:1,
            //     evaluateType:7,
            //     remake:"备注",
            //     customerServiceId:"1"
            // },{
            //     evaluateStatus:1,
            //     evaluateType:8,
            //     remake:"备注",
            //     customerServiceId:"1"
            // }],
           

        };
    },
    computed: {
        ...mapGetters(["name", "id"])
    },
    props: [],

    created() {
	  // 回显评价
      this.listInstallOrderEvaluate();
      // 沟通记录回显
	  this.customerServiceDatails();
    },
    methods: {
        submitForm(formName) {
            this.dealForm.status = Number(this.$route.query.status);
            this.dialogDealVisible = true;
        },
        colseDealBtn() {
            this.dialogDealVisible = false;
        },
        // 沟通记录回显
        customerServiceDatails() {
            let data = {
                customerServiceId: this.$route.query.customerServiceId,
            }
            customerServiceDatails(data).then(res => {
                if(res.status == 200) {
                    if(res.data.remake) {
                        this.remake = res.data.remake;
                    }
                }
            }).catch(error => {
                console.log('行政中心:客服回访 沟通记录回显 views/administrationCenter/administrativeservice/custservice/reviewcontent', error);
            })
        },
        // 指派责任部门 -- 确定
        subDealmission() {
            let data = {
                status: this.dealForm.status,
                remake: this.remake,
                customerServiceId: this.$route.query.customerServiceId,
            };
            this.btnLoading = true;
            editCustomerService(data).then(res => {
                if(res.status == 200) {
                    this.$message({
                        message: '处理问题成功',
                        type: 'success'
                    });
                    this.btnLoading = false;
                    this.dialogDealVisible = false;
                    this.$router.push("/administrativeservice/servicereturn");
                }
            }).then(err => {
                this.btnLoading = false;
                console.log('行政中心:客服回访 指派责任部门 views/administrationCenter/administrativeservice/custservice/reviewcontent', err);	
            })
        },
        // 回显评价
        listInstallOrderEvaluate() {
            let data = {
                customerServiceId: this.$route.query.customerServiceId,
            }
            listInstallOrderEvaluate(data).then(res => {
                if(res.status == 200) {
                    this.evaluate = res.data.rows;
                    
                    this.dealEvalute();
                }
            }).catch(error => {
                console.log('行政中心:客服回访 views/administrationCenter/administrativeservice/custservice/components/reviewcontent', error);
            })
        },
        // 处理回显的评价
        dealEvalute() {
            this.evaluate.forEach(item => {
                if(this.source == 0) { // 0 安装
                    this.ruleForm.installOrderEvaluates.forEach(item2 => {
                        if (item.evaluateType == item2.evaluateType) {
                            item2.evaluateStatus = Number(item.evaluateStatus);
                            item2.remake = item.remake;
                            item2.installOrderEvaluateId = item.installOrderEvaluateId;
                        }
    
                        if(item.evaluateType == 1) {
                            // 安装状态
                            this.install.evaluateStatus = item.evaluateStatus;
                            this.install.remake =  item.remake;
                            this.installOrderEvaluateId = item.installOrderEvaluateId;
                            
                        }else if(item.evaluateType == 2) {
                            // 是否当天完成
                            this.isFinish.evaluateStatus = item.evaluateStatus;
                            this.isFinish.remake = item.remake;
                            this.installOrderEvaluateId = item.installOrderEvaluateId;
                        }else if(item.evaluateType == 3) {
                            // 安装师傅上门前是否提前联系
                            this.iscontact.evaluateStatus = item.evaluateStatus;
                            this.installOrderEvaluateId = item.installOrderEvaluateId;
                            this.iscontact.remake = item.remake;
                        }else if(item.evaluateType == 4) {
                            // 安装师傅是否有穿工服和鞋套
                            this.iswear.evaluateStatus = item.evaluateStatus;
                            this.iswear.remake = item.remake;
                            this.installOrderEvaluateId = item.installOrderEvaluateId;
                        }else if(item.evaluateType == 5) {
                            // 货品是否有损坏
                            this.isgoods.evaluateStatus = item.evaluateStatus;
                            this.isgoods.remake = item.remake;
                            this.installOrderEvaluateId = item.installOrderEvaluateId;
                        }else if(item.evaluateType == 6) {
                            // 设计师满意程度
                            this.designdegree.evaluateStatus = Number(item.evaluateStatus);
                            this.designdegree.remake = item.remake;
                            this.installOrderEvaluateId = item.installOrderEvaluateId;
                        }else if(item.evaluateType == 7) {
                            // 安装服务满意程度
                            this.installdegree.evaluateStatus = Number(item.evaluateStatus);
                            this.installdegree.remake = item.remake;
                            this.installOrderEvaluateId = item.installOrderEvaluateId;
                        }else if(item.evaluateType == 8) {
                            // 客户评价
                            this.customerdegree.evaluateStatus = Number(item.evaluateStatus);
                            this.customerdegree.remake = item.remake;
                            this.installOrderEvaluateId = item.installOrderEvaluateId;
                        }else if(item.evaluateType == 9) {
                            // 销售满意程度
                            this.saledegree.evaluateStatus = Number(item.evaluateStatus);
                            this.saledegree.remake = item.remake;
                            this.installOrderEvaluateId = item.installOrderEvaluateId;
                        }
    
                    })
                }else if(this.source == 1) { // 1 售后
                    this.ruleForm.saleOrderEvaluates.forEach(item2 => {
                        if (item.evaluateType == item2.evaluateType) {
                            item2.evaluateStatus = Number(item.evaluateStatus);
                            item2.remake = item.remake;
                            item2.installOrderEvaluateId = item.installOrderEvaluateId;
                        }

                        if(item.evaluateType == 1) {
                            // 维修状态
                            this.maintain.evaluateStatus = item.evaluateStatus;
                            this.maintain.remake =  item.remake;
                            this.installOrderEvaluateId = item.installOrderEvaluateId;
                            
                        }else if(item.evaluateType == 2) {
                            // 是否当天完成
                            this.isSaleFinish.evaluateStatus = item.evaluateStatus;
                            this.isSaleFinish.remake = item.remake;
                            this.installOrderEvaluateId = item.installOrderEvaluateId;
                        }else if(item.evaluateType == 7) {
                            // 维修服务满意程度
                            this.salesdegree.evaluateStatus = Number(item.evaluateStatus);
                            this.salesdegree.remake = item.remake;
                            this.installOrderEvaluateId = item.installOrderEvaluateId;
                        }else if(item.evaluateType == 10) {
                            // 客服评价
                            this.servercedegree.evaluateStatus = Number(item.evaluateStatus);
                            this.servercedegree.remake = item.remake;
                            this.installOrderEvaluateId = item.installOrderEvaluateId;
                        }

                    })

                }
                
            })
        },
        hideSearch() {
            this.isShow = !this.isShow;
            // console.error('111', this.isShow);
        },
        // 点击填写评价
        evalFun() {
            // 回显评价
	        this.listInstallOrderEvaluate();
            this.dialogFormVisible = true;
        },
        invitionFun() {
            this.dialogVisible = true;
        },
        // 填写评价弹出框的取消按钮
        colseBtn(formName){
            this.dialogFormVisible = false;
            this.$refs[formName].resetFields();
        },
        // 添加再约时间弹框的确定按钮
        submiFun(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = {
                        customerServiceId: this.$route.query.customerServiceId,
                        recordTime: this.valueForm.recordTime, //回访时间
                        againRecordTime:  this.valueForm.againRecordTime, //再约回访时间
                        remark:  this.valueForm.remark,
                    }
                    this.btnLoading = true;
                    addCustomerSeviceRecord(data).then(res => {
                        if(res.status == 200) {
                            this.$message({
                                message: '添加再约时间',
                                type: 'success'
                            });
                            this.btnLoading = false;
                            this.dialogVisible = false;
                            
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
        colseFun(formName) {
            this.dialogVisible = false;
            this.$refs[formName].resetFields();
        },

        // 1安装状态 2是否当天完成 3安装师傅上门前是否提前联系 4安装师傅是否有穿工服和鞋套 5货品是否有损坏 6设计师满意程度 7安装服务满意程度 8客户评价
        // 填写评价弹出框的提交
        submission(formName){
            // installOrderEvaluates.map(item => {
            //     return {
            //         customerServiceId:  this.$route.query.customerServiceId,

            //     }
            // })

             this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.ruleForm.installOrderEvaluates.forEach(item => {
                        item.customerServiceId = this.$route.query.customerServiceId;
                    })

                    let data = {
                        installOrderEvaluates: this.ruleForm.installOrderEvaluates,
                        installationOrderId: this.$route.query.installationOrderId
                    }
                    this.btnLoading = true;
                    addInstallOrderEvaluate(data).then(res =>{
                        if(res.status == 200) {
                            this.$message({
                                message: '填写评价成功',
                                type: 'success'
                            });
                            this.btnLoading = false;
                            this.dialogFormVisible = false;
                            this.listInstallOrderEvaluate();
                            
                            this.$refs[formName].resetFields();
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

    },

  };
</script>

<style lang="scss" scoped>
    .reviewcontent{
        .titlecals {
            line-height: 36px;
        }
        .titleTop {
            display: flex;
            justify-content: space-between;
            // align-items: center;
        }
        .martop{
            transform: translateY(20px);
        }
        .contract{
            margin: 5px 0px;
            .contractcon{
                // padding: 5px 0;
                position: relative;
            }
        }

        /* 合同信息标签组 */
        .labeliconbox{
            position: absolute;
            left: 240px;
            top: 0px;
            .labelicon{
                width: 100px;
                display: flex;
                li{
                    padding: 10px 6px 15px;
                    background: red;
                    color: #ffffff;
                    font-size: 12px;
                    position: relative;
                    &::after {
                        display: block;
                        content: "";
                        position: absolute;
                        width:0;
                        height:0;
                        border-right:14px solid transparent;
                        border-left:14px solid transparent;
                        border-bottom:10px solid white;
                        left: -2px;
                        bottom: 0px;
                    }
                    &:nth-of-type(1){
                        background: #F26660;
                    }
                    &:nth-of-type(2){
                        background: #70D5A6;
                    }
                    &:nth-of-type(3){
                        background: #71B4FA;
                    }
                }
                li+li{
                    margin-left: 15px;
                }

            }
        }
        .violationbox{
            position: absolute;
            right: -33px;
            top: -7px;
            .violation{
                position: relative;
                width:0;
                height:0;
                border-right:50px solid transparent;
                border-left:50px solid transparent;
                border-bottom:50px solid #FF9933;
                transform: rotate(45deg);
                span{
                    font-size: 16px;
                    position: absolute;
                    left: -22px;
                    bottom: -45px;
                    width: 100px;
                    display: block;
                    color: #ffffff;
                }
            }
        }
        
        
        .customerlist{
            display: flex;
            // justify-content: space-between;
            flex-wrap: wrap;
            font-size: 13px;
            color: #333333;
            li {
                width: 25%;
                line-height: 30px;
            }
        }
    }
    
    .orderbox{
        width: 100%;
        font-size: 14px;
        border-top: 1px solid #e4e4e4;
        border-left: 1px solid #e4e4e4;
        .orderlsit{
            display: flex;
            li{
                padding: 0px 10px;
                display: flex;
                align-items: center;
                border-right: 1px solid #e4e4e4;
                border-bottom: 1px solid #e4e4e4;
                line-height: 2.2;
                text-align: center;
                &:nth-child(1){
                    width: calc(70% / 4);
                    white-space: nowrap;
                    // width: 240px;
                    text-align: center;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                &:nth-child(5){
                    width: calc(70% / 4);
                    white-space: nowrap;
                    // width: 240px;
                    text-align: center;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                &:nth-child(3){
                    width: calc(32% / 4);
                    white-space: nowrap;
                    // width: 240px;
                    text-align: center;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                &:nth-child(7){
                    width: calc(32% / 4);
                    white-space: nowrap;
                    // width: 240px;
                    text-align: center;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                &:nth-child(even){
                    flex: 1;
                    // width: calc(70% / 4);
                    color: #999;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    display: block;
                }
                // &:nth-child(1),&:nth-child(3),&:nth-child(5){
                //     width: calc(24% / 3);
                //     white-space: nowrap;
                //     // width: 240px;
                //     text-align: center;
                //     display: -webkit-box;
                //     -webkit-box-orient: vertical;
                //     overflow: hidden;
                // }
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
    }

    .add_head_list {
        // display: flex;
        .evalitem {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: space-around;
            margin-bottom: 20px;
            >span {
                width: 25%;
                text-align: right;
                white-space: nowrap;
            }
            >div {
                width: 38%;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-wrap: nowrap;
            }
            .remakes {
                align-items: center;
                span {
                    white-space: nowrap;
                    width: 60px;
                }
            }
        }
    }

.remakes {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    span {
        white-space: nowrap;
        min-width: 60px;
        text-align: right;
        padding-right: 12px;
    }
}

</style>

<style lang="scss">
.reviewcontent{
    .el-rate{
        height: 40px;
    }
}

</style>


