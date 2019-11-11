<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <el-form label-width="130px" :model="formList" :rules="rules" ref="form" class="ruleForm">
                <el-form-item label="方案名称" style="width:32%;display:inline-block" prop="returnSchemeName">
                    <el-input clearable v-model="formList.returnSchemeName" @blur="methodsParams"></el-input>
                </el-form-item>
                <el-form-item label="当前状态" style="width:32%;display:inline-block" prop="isEnable">
                    <el-select clearable v-model="formList.isEnable" @change="methodsParams">
                        <el-option label="未启用" value="0"></el-option>
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="停用" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="适用范围" style="width:32%;display:inline-block" prop="organizationId">
                    <el-select clearable v-model="formList.organizationId" @change="methodsParams">
                        <el-option v-for="(item,idx) in systemArr" :key="idx" :label="item.label" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="生效时间" style="width:32%;display:inline-block" prop="returnSchemeStart">
                    <el-date-picker
                        v-model="formList.returnSchemeStart"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        @change="methodsParams"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="失效时间" style="width:32%;display:inline-block" prop="returnSchemeEnd">
                    <el-date-picker
                        v-model="formList.returnSchemeEnd"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        @change="methodsParams"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="附件" style="width:100%">
                    <div @click="upload">
                        <el-upload
                            action="string"
                            :http-request="uploadSectionFile"
                            list-type="picture-card"
                            :disabled="isDisabled"
                            >
                            <i class="el-icon-plus" ></i>
                        </el-upload>
                    </div>
                </el-form-item>
            </el-form>
            <div style="text-align:center;">
                <el-button type="primary" size="medium" v-if="!$route.query.onlyRead&&btnJurisdiction.save" :loading="saveLoading" @click="saveProject">保存</el-button>
                <el-button size="medium" @click="goBack">返回</el-button>
            </div>
            <div>
                <el-button size="small" class="button-96" v-if="!$route.query.onlyRead&&btnJurisdiction.addNewRule" @click="addNewRule">新增规则</el-button>
            </div>
            <div class="m-top20">
                <el-table :data="tableData" border :row-class-name="tableRowClassName" @row-click="rowClick" ref="table">

                    <el-table-column show-overflow-tooltip align="center" type="selection"></el-table-column>
                    <el-table-column show-overflow-tooltip align="center" prop="returnGradeName" label="返点等级">
                        <template slot-scope="scope">
                                <el-tooltip placement="right" visible-arrow v-if="!$route.query.onlyRead">
                                <div slot="content" class="tips tipFon">
                                    <p class="operaItems" @click="editRule(scope.row)">编辑</p>
                                    <p class="operaItems" @click="deleteRule(scope.row)">删除</p>
                                </div>
                                <img :src="spot" alt="" class=" attributesTips">
                            </el-tooltip>
                            <p>{{scope.row.returnGradeName}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="center" prop="remarks" label="描述"></el-table-column>
                    <el-table-column show-overflow-tooltip align="center" prop="returnTypeName" label="返点类型"></el-table-column>
                    <el-table-column show-overflow-tooltip align="center" prop="evaluationCriteria" label="评定标准"></el-table-column>
                    <el-table-column show-overflow-tooltip align="center" prop="returnStandard" label="返点标准（最高）"></el-table-column>
                    <el-table-column show-overflow-tooltip align="center" prop="brandName" label="关联品牌"></el-table-column>
                    <el-table-column show-overflow-tooltip align="center" prop="categoryName" label="关联品类"></el-table-column>
                    <el-table-column show-overflow-tooltip align="center" prop="isEnable" label="应用状态">
                        <template slot-scope="scope">
                            {{scope.row.isEnable==0?"启用":"停用"}}
                        </template>
                    </el-table-column>
                    <el-table-column show-overflow-tooltip align="center" prop="createTime" label="创建时间"></el-table-column>
                </el-table>
                <!-- <div class="pagination_wrap">
                    <pagination
                        :current-page="currentPage"
                        :pageSize="pageSize"
                        :total="total"
                        @sizeChange="sizeChange"
                        @currentChange="currentChange">
                    </pagination>
                </div> -->
            </div>
        </el-card>
        <el-dialog title="新增规则" :visible.sync="dialog" width="820px" custom-class="customDialogTitle" @close="close">
            <el-form label-width="130px" class="ruleForm">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="返点等级">
                            <el-select v-model="addFormList.returnGradeId">
                                <el-option v-for="(item,idx) in returnGradeArr" :label="item.dictName" :value="item.id" :key="idx"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="返点类型">
                            <el-select v-model="addFormList.returnTypeId">
                                <el-option v-for="(item,idx) in returnTypeArr" :label="item.dictName" :value="item.id" :key="idx"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="应用状态">
                            <el-select v-model="addFormList.isEnable">
                                <el-option label="启用" :value="0"></el-option>
                                <el-option label="停用" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="品牌" >
                            <el-select v-model="addFormList.brandIds" multiple collapse-tags>
                                <el-option v-for="(item,idx) in listBrandArr"   :key="idx" :label="item.brandName" :value="item.brandId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="供应商">
                            <el-select v-model="addFormList.companyIds" multiple collapse-tags>
                                <el-option v-for="(item,idx) in companyArr"  :key="idx" :label="item.companyName" :value="item.companyId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="品类" >
                            <el-select v-model="addFormList.categoryIds" multiple collapse-tags>
                                <el-option v-for="(item,idx) in listCategoryArr" :key="idx" :label="item.categoryName" :value="item.commodityCategoryId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="描述" class="block">
                            <el-input type="textarea" v-model="addFormList.remarks"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="评定标准" style="width:100%">
                            <div>
                                <span class="paddings">符合</span>
                                <el-select style="width:100px" size="medium" v-model="addFormList.evaluationCriteria.evaluationRule">
                                    <el-option v-for="typeItem in typeList" :key="typeItem.code" :value="typeItem.code" :label="typeItem.value"></el-option>
                                </el-select>
                                <span class="paddings">以下条件</span>
                            </div>
                            <div class="m-top20">
                                <div v-for="(item,index) in evaluationCriteria" :key="index" class="lists">  
                                    <div class="clearfix">
                                        <div class="fl">
                                            <div style="padding:10px;width:528px;">
                                                <div>
                                                    <el-select style="width:140px" v-model="item.evaluationType">
                                                        <el-option v-for="optionItem in orderOptionList" :key="optionItem.code" :value="optionItem.code" :label="optionItem.value"></el-option>
                                                    </el-select><span class="paddings">符合</span>
                                                    <el-select style="width:100px" v-model="item.evaluationLogic">
                                                        <el-option v-for="typeItem in typeList" :key="typeItem.code" :value="typeItem.code" :label="typeItem.value"></el-option>
                                                    </el-select><span class="paddings">以下条件</span>
                                                </div>
                                                <div v-for="rowItem in item.evaluationCriteriaDetails" :key="rowItem.rowId">
                                                    <el-select style="width:140px" v-model="rowItem.evaluationWhere">
                                                        <el-option v-for="judgeItem in judgingConditionList" :key="judgeItem.code" :value="judgeItem.code" :label="judgeItem.value"></el-option>
                                                    </el-select>
                                                    <div style="display:inline-block">
                                                        <el-input v-model="rowItem.evaluationValue" placeholder="请输入条件" style="width:160px"></el-input>
                                                    </div>
                                                    <div style="display:inline-block;padding:0 7px">
                                                        <el-button class="button-addOrdel" size="small" @click="addRow(index)"><span class="padding-right">+</span>添加</el-button>
                                                        <el-button class="button-addOrdel" size="small" @click="deleteRow(index,rowItem)" v-if="item.evaluationCriteriaDetails.length > 1"><span class="padding-right">-</span>减少</el-button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fr" style="width:100px;text-align:center">
                                            <div>
                                                <el-button class="button-addOrdel" size="small" @click="addModule"><span class="padding-right">+</span>添加</el-button>
                                            </div>
                                            <div>
                                                <el-button class="button-addOrdel" size="small" @click="deleteModule(item)" v-if="evaluationCriteria.length > 1"><span class="padding-right">-</span>减少</el-button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="20">
                        <el-form-item label="返点标准（最高）">
                            <ul class="lists" style="padding:10px;width:528px;">
                                <li v-for="(item,idx) in addFormList.returnCriteria" :key="idx">
                                    <el-select style="width:140px" v-model="item.returnType">
                                        <el-option :value="0" label="外购"></el-option>
                                        <el-option :value="1" label="非外购"></el-option>
                                    </el-select>
                                    <div style="display:inline-block">
                                        <el-input type="number"  placeholder="返点占比%" style="width:160px" v-model="item.returnProportion"></el-input>
                                    </div>
                                    <div style="display:inline-block;padding:0 7px">
                                        <el-button class="button-addOrdel" size="small" @click="addReturn"><span class="padding-right">+</span>添加</el-button>
                                        <el-button class="button-addOrdel" size="small" v-if="addFormList.returnCriteria.length>1" @click="subtractReturn(item)"><span class="padding-right">-</span>减少</el-button>
                                    </div>
                                </li>
                            </ul>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="dialogLoading" @click="addNewRules">确 定</el-button>
                <el-button @click="dialog = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from '@/views/components/breadcrumb';
import pagination from '@/views/components/pagination';
import { addAccessory, listOrganization, listBaseDict, listBrand, listCategory, listCompanyByAll,  } from '@/api/pulicJava';
import { addReturnScheme, addReturnRule, listReturnRule, getReturnScheme, getReturnRule, delReturnRule } from "@/api/systemcenter/recommendRebates";
import { put } from "@/utils/pubilcFn";
import spot from '@/assets/images/spot.png';
const evaluationCriteria = [
    {
        evaluationGroup: 1,
        evaluationType: '',
        evaluationLogic: '',
        evaluationRule:"",
        evaluationCriteriaDetails: [
            {
                rowId:1,
                evaluationWhere: '',
                evaluationValue: ''
            }
        ]
    }
]
export default {
    components:{
        breadcrumb,
        pagination
    },
    created() {
        if(this.$route.query.edit){
            this.projectId=this.$route.query.returnSchemeId
            getReturnScheme(
                {
                    returnSchemeId: this.projectId
                }
            ).then(res=>{
                for(let i in this.formList){
                    this.formList[i]=res.data[i]
                }
                this.formList["isEnable"]=String(res.data["isEnable"])
            })
            listReturnRule(
                {
                    returnSchemeId: this.projectId
                }
            ).then(res=>{
                this.tableData=res.data
            })
        }
    },
    data(){
        return{
            spot,
            rowIndex: 100,
            moduleIndex: 1000,
            tableData: [],
            evaluationCriteria,
            dialogImageUrl: '',
            dialogVisible: true,
            navList:[],
            dialog:false,
            currentPage:1,
            pageSize:20,
            total:10,
            isDisabled:false,
            systemArr:[],
            projectId:"",
            returnRuleId:"",
            formList:{
                returnSchemeName:"",
                isEnable:"",
                organizationId:"",
                returnSchemeStart:"",
                returnSchemeEnd:"",
                returnSchemeId:null
            },
            orderOptionList: [
                { code: 0, value: '累积订单金额' },
                { code: 1, value: '累积订单数量' }
            ],
            judgingConditionList: [
                { code: 0, value: '等于' },
                { code: 1, value: '不等于' },
                { code: 2, value: '大于' },
                { code: 3, value: '小于' },
                { code: 4, value: '大于等于' },
                { code: 5, value: '小于等于' }
            ],
            typeList: [
                { code: 0, value: '全部' },
                { code: 1, value: '任何' }
            ],
            rules:{
                returnSchemeName:[
                    {
                        required:true,
                        message:"请输入方案名称",
                        trigger:'blur'
                    }
                ],
                isEnable:[
                    {
                        required:true,
                        message:"请选择当前状态",
                        trigger:'change',
                    }
                ],
                organizationId:[
                    {
                        required:true,
                        message:"请选择适用范围",
                        trigger:'change',
                    }
                ],
                returnSchemeStart:[
                    {
                        required:true,
                        message:"请选择开始时间",
                        trigger:'change',
                    }
                ],
                returnSchemeEnd:[
                    {
                        required:true,
                        message:"请选择失效时间",
                        trigger:'change',
                    }
                ],
            },
            returnTypeArr:[],
            returnGradeArr:[],
            listBrandArr:[],
            listCategoryArr:[],
            companyArr:[],
            addFormList:{
                brandIds:[],                        // 品牌ID 
                categoryIds:[],                     // 品类ID
                companyIds:[],                      // 公司ID

                evaluationCriteria:{                // 评定标准 ,
                    evaluationCriteriaDetails:[     // 评定标准规则内容 ,
                        {
                            evaluationGroup:"",     // 规则组
                            evaluationLogic:"",     // 评定逻辑 0全部 1任何 ,
                            evaluationType:"",      // 规则类型 0累计订单金额 1累计订单数量 ,
                            evaluationValue:"",     // 规则值 ,
                            evaluationWhere :""      // 规则 0等于 1不等于 2大于 3小于 4大于等于 5小于等于
                        }
                    ],
                    evaluationRule:''               // 0全部，1任何
                },          

                isEnable:"",                        // 是否启用 0启用 1停用 ,
                remarks:"",                         // 描述 ,

                returnCriteria:[                    // 返点标准 ,
                    {
                        returnProportion:"",        // 返点比例
                        returnType:"",              // 返点类型0外购 1非外购
                        index:1
                    }
                ],                                  

                returnGradeId:"",                   // 返点等级ID ,
                // returnRuleId:"",                    // 方案规则主键（非必填） ,
                returnSchemeId:"",                  // 推荐返点方案主键 ,
                returnTypeId:""                     // 返点类型ID ,
                
            },
            returnModule:1000,
            btnJurisdiction:{
                save:false,
                addNewRule:false
            },
            saveLoading:false,
            dialogLoading:false
        }
    },
    mounted() {
        this.btnInit()
        this.navList = this.$route.meta;
        listOrganization().then(res=>{
            this.systemArr=res.data;
        })
        //返点类型
        listBaseDict(
            {
                dataType: "return_Type"
            }
        ).then(res=>{
            this.returnTypeArr=res.data;
        })
        //返点等级
        listBaseDict(
            {
                dataType: "return_Grade"
            }
        ).then(res=>{
            this.returnGradeArr=res.data;
        })
        //品牌
        listBrand().then(res=>{
            res.data.map((item,idx)=>{
                item.brandId=Number(item.brandId)
            })
            this.listBrandArr=res.data;
        })
        //品类
        listCategory().then(res=>{
            res.data.map((item,idx)=>{
                item.commodityCategoryId=Number(item.commodityCategoryId)
            })
            this.listCategoryArr=res.data;
        })
        //供应商
        listCompanyByAll(
            {
                companyType:1
            }
        ).then(res=>{
            this.companyArr=res.data;
        })
    },
    methods: {
        rowClick(row){
            this.$refs.table.toggleRowSelection(row)
        },
        btnInit(){
            this.btnJurisdiction.save=JSON.parse(this.$loca.getItem('element'))["recommendRebates:btn-save"];
            this.btnJurisdiction.addNewRule=JSON.parse(this.$loca.getItem('element'))["recommendRebates:btn_addNewRule"];
            
        },
        close(){
            this.evaluationCriteria=[
                {
                    evaluationGroup: 1,
                    evaluationType: '',
                    evaluationLogic: '',
                    evaluationRule:"",
                    evaluationCriteriaDetails: [
                        {
                            rowId:1,
                            evaluationWhere: '',
                            evaluationValue: ''
                        }
                    ]
                }
            ]
            this.addFormList={
                brandIds:[],                        // 品牌ID 
                categoryIds:[],                     // 品类ID
                companyIds:[],                      // 公司ID

                evaluationCriteria:{                // 评定标准 ,
                    evaluationCriteriaDetails:[     // 评定标准规则内容 ,
                        {
                            evaluationGroup:"",     // 规则组
                            evaluationLogic:"",     // 评定逻辑 0全部 1任何 ,
                            evaluationType:"",      // 规则类型 0累计订单金额 1累计订单数量 ,
                            evaluationValue:"",     // 规则值 ,
                            evaluationWhere :""      // 规则 0等于 1不等于 2大于 3小于 4大于等于 5小于等于
                        }
                    ],
                    evaluationRule:''               // 0全部，1任何
                },          

                isEnable:"",                        // 是否启用 0启用 1停用 ,
                remarks:"",                         // 描述 ,

                returnCriteria:[                    // 返点标准 ,
                    {
                        returnProportion:"",        // 返点比例
                        returnType:"",              // 返点类型0外购 1非外购
                        index:1
                    }
                ],                                  

                returnGradeId:"",                   // 返点等级ID ,
                // returnRuleId:"",                    // 方案规则主键（非必填） ,
                returnSchemeId:"",                  // 推荐返点方案主键 ,
                returnTypeId:""                     // 返点类型ID ,
                
            }
        },
        editRule(val){
            this.returnRuleId=val.returnRuleId
            getReturnRule(
                {
                    returnRuleId:val.returnRuleId
                }
            ).then(res=>{
                for(let i in this.addFormList){
                    this.addFormList[i]=res.data[i];
                }
                let evaluationGroupArr = []; // 定义一个分组（大模块）只存分组值
                let evaluationCriteria = []; // 定义一个分组（大模块）
                this.addFormList.evaluationCriteria.evaluationCriteriaDetails.forEach((item,index) => {
                    evaluationGroupArr.push(item.evaluationGroup);
                })
                evaluationGroupArr = Array.from(new Set(evaluationGroupArr));
                evaluationGroupArr.forEach((item,index) => {
                    let evaluationCriteriaItem = {
                        evaluationGroup: item,
                        evaluationCriteriaDetails: []
                    };
                    this.addFormList.evaluationCriteria.evaluationCriteriaDetails.forEach((item2,index2) => {
                        if (item2.evaluationGroup == item) {
                            evaluationCriteriaItem.evaluationCriteriaDetails.push(item2)
                        }
                    })
                    evaluationCriteriaItem.evaluationType = evaluationCriteriaItem.evaluationCriteriaDetails[0].evaluationType;
                    evaluationCriteriaItem.evaluationLogic = evaluationCriteriaItem.evaluationCriteriaDetails[0].evaluationLogic;
                    evaluationCriteriaItem.evaluationRule = evaluationCriteriaItem.evaluationCriteriaDetails[0].evaluationRule;
                    evaluationCriteria.push(evaluationCriteriaItem)
                })
                this.evaluationCriteria=evaluationCriteria;
                this.dialog=true;
            })
        },
        deleteRule(val){
            this.$confirm('删除后不可恢复，是否确定删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                
                delReturnRule(
                    {
                        returnRuleId:val.returnRuleId
                    }
                ).then(res=>{
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    listReturnRule(
                        {
                            returnSchemeId:this.projectId
                        }
                    ).then(res=>{
                        this.tableData=res.data
                    })
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        saveProject(){
            this.$refs.form.validate((valid) => {
                if(valid) {
                    this.saveLoading=true;
                    addReturnScheme(this.formList).then(res=>{
                        this.projectId=res.data;
                        this.formList.returnSchemeId=res.data;
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        this.saveLoading=false;
                        listReturnRule(
                            {
                                returnSchemeId:this.projectId
                            }
                        ).then(res=>{
                            this.tableData=res.data
                        })
                    })
                }else{
                    return false;
                }
            });
        },
        addReturn(){
            let obj={
                returnProportion:"",
                returnType:"", 
                index:this.returnModule++
            }
            this.addFormList.returnCriteria.push(obj)
        },
        subtractReturn(val){
            this.addFormList.returnCriteria.map((item,idx)=>{
                if(val.index==item.index){
                    this.addFormList.returnCriteria.splice(idx,1)
                }
            })
        },
        addNewRules(){
            let arr=this.evaluationCriteria;
            let brr=[];
            arr.map((item,idx)=>{
                item.evaluationCriteriaDetails.map((val,index)=>{
                    val.evaluationGroup = item.evaluationGroup;
                    val.evaluationType = item.evaluationType;
                    val.evaluationLogic = item.evaluationLogic;
                    brr.push(val);
                })
            })
            this.addFormList.evaluationCriteria.evaluationCriteriaDetails=brr;
            this.addFormList.returnSchemeId=this.projectId;
            this.addFormList.returnRuleId=this.returnRuleId;
            this.dialogLoading=true;
            addReturnRule(this.addFormList).then(res=>{
                this.dialog=false;
                this.dialogLoading=false;
                if(this.returnRuleId){
                    this.$message({
                        message: '编辑规则成功',
                        type: 'success'
                    });
                }else{
                    this.$message({
                        message: '新增规则成功',
                        type: 'success'
                    });
                }
                listReturnRule(
                    {
                        returnSchemeId:this.projectId
                    }
                ).then(res=>{
                    this.tableData=res.data
                })
            })
        },
        uploadSectionFile(val){
            put(val).then(res=>{

            })
        },
        methodsParams(){
            let arr=[];
            for(let i in this.formList){
                arr.push(this.formList[i])
            }
            if(arr.indexOf("")!=-1||arr.indexOf(null)!=-1){
                this.isDisabled=false
            }else{
                this.isDisabled=true
            }
        },
        upload(){
            if(!this.$route.query.onlyRead){
                this.$refs.form.validate((valid) => {
                    if(valid) {
                        addReturnScheme(this.formList).then(res=>{
                            this.projectId=res.data;
                        })
                    }else{
                        return false;
                    }
                });
            }
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        addNewRule(){
            if(this.projectId!==""){
                this.dialog=true;
            }else{
                this.$message({
                    message: '请保存方案信息',
                    type: 'warning'
                });
            }
        },
        currentChange(val) {
            this.currentPage = val;
        },
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
        },
        tableRowClassName({ row, rowIndex }) {
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        addRow(moduleIndex) {
            this.rowIndex++;
            let row = {
                rowId: this.rowIndex,
                evaluationWhere: '',
                evaluationValue: ''
            }
            this.evaluationCriteria[moduleIndex].evaluationCriteriaDetails.push(row)
        },
        addModule() {
            this.moduleIndex++;
            this.rowIndex++;
             let module = {
                evaluationGroup: this.moduleIndex,
                evaluationType: '',
                evaluationCriteriaDetails: [
                    {
                        rowId: this.rowIndex,
                        evaluationWhere: '',
                        evaluationValue: ''
                    }
                ]
            }
            this.evaluationCriteria.push(module);
        },
        deleteRow(moduleIndex,rowItem){
            console.log(rowItem)
            let index  = this.evaluationCriteria[moduleIndex].evaluationCriteriaDetails.indexOf(rowItem);
            this.evaluationCriteria[moduleIndex].evaluationCriteriaDetails.splice(index,1)
        },
        deleteModule(item) {
            let index  = this.evaluationCriteria.indexOf(item);
            this.evaluationCriteria.splice(index,1);
        },
        goBack(){
            this.$router.push({
                path:'recommendRebates'
            })
        }
    },
}
</script>
<style scoped>
.paddings{
    padding: 0 10px;
}
.padding-right{
    padding-right:10px;    
}
.button-addOrdel{
    background: #fff;
    color:skyblue;
    width: 90px;
    margin: 0;
}
.lists{
    border:1px solid #DCDFE6;
    border-bottom: none;
}
.lists:last-child{
    border-bottom: 1px solid #DCDFE6;
}
</style>
