<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <el-form label-width="120px" ref="form" class="ruleForm" :model="formList" :rules="rules">
                <el-row :gutter="10">
                    <el-col :span="span">
                        <el-form-item label="方案名称" prop="scheduleUrgentName">
                            <el-input v-model="formList.scheduleUrgentName" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="span">
                        <el-form-item label="创建日期" prop="createTime">
                            <el-date-picker
                                v-model="formList.createTime"
                                type="date"
                                range-separator="-"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="创建日期"
                                clearable
                                >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="span">
                        <el-form-item label="生效日期" prop="returnSchemeStart">
                            <el-date-picker
                                v-model="formList.returnSchemeStart"
                                type="date"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="生效日期"
                                clearable
                                >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="span">
                        <el-form-item label="失效日期" prop="returnSchemeEnd">
                            <el-date-picker
                                v-model="formList.returnSchemeEnd"
                                type="date"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="失效日期"
                                clearable
                                >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="span">
                        <el-form-item label="品牌" prop="brandId">
                            <el-select v-model="formList.brandId" clearable>
                                <el-option v-for="(item,idx) in listBrandArr" :key="idx" :label="item.brandName" :value="item.brandId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="span">
                        <el-form-item label="品类" prop="commodityCategoryId">
                            <el-select v-model="formList.commodityCategoryId" clearable>
                                <el-option v-for="(item,idx) in listCategoryArr"  :key="idx" :label="item.categoryName" :value="item.commodityCategoryId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="span">
                        <el-form-item label="关联机构" prop="organizationName">
                            <el-input @focus="focusIpts" v-model="formList.organizationName" clearable @change="changeOrganization"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div style="display:flex;justify-content:center;align-items:center">
                <el-button size="medium" type="primary" @click="saveSchedule">保存</el-button>
                <el-button size="medium" @click="goBack">返回</el-button>
            </div>
            <div class="m-top20">
                <el-button size="small" class="button-96" @click="addNewRow">新增特批</el-button>
            </div>
            <div class="m-top20">
                <el-table :data="tableData" border :row-class-name="tableRowClassName">
                    <el-table-column align="center" prop="specialName" label="特批名称">
                        <template slot-scope="scope">
                                <el-tooltip placement="right" visible-arrow >
                                <div slot="content" class="tips tipFon">
                                    <p class="operaItems" @click="editRule(scope.row)">编辑</p>
                                </div>
                                <img :src="spot" alt="" class=" attributesTips">
                            </el-tooltip>
                            <p class="table_action_span">{{scope.row.specialName}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="scheduleNumber" label="特批次数"></el-table-column>
                    <el-table-column align="center" prop="scheduleUpper" label="工期上线"></el-table-column>
                    <el-table-column align="center" prop="remarks" label="描述"></el-table-column>
                </el-table>
            </div>
        </el-card>
        <el-dialog title="新增特批" :visible.sync="dialog" width="700px" custom-class="customDialogTitle" @close="close">
            <el-form label-width="100px" class="ruleForm" :model="scheduleUrgentRule">
                <el-row :gutter="10">
                    <el-col :span="12">
                         <el-form-item label="特批名称">
                            <el-input placeholder="请输入特批名称" v-model="scheduleUrgentRule.specialName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="应用状态">
                            <el-select v-model="scheduleUrgentRule.isEnable">
                                <el-option label="未启用" :value="0"></el-option>
                                <el-option label="启用" :value="1"></el-option>
                                <el-option label="停用" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item 
                            label="工期上限" 
                            prop="dateUp"
                            :rules="{ type: 'number',message: '请输入数字', trigger: ['blur','change']}">
                            <el-input placeholder="请输入工期上限" v-model.number="scheduleUrgentRule.scheduleUpper"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                         <el-form-item label="特批次数" :rules="{ type: 'number',message: '请输入数字', trigger: ['blur','change'] }">
                            <el-input placeholder="请输入次数" v-model.number="scheduleUrgentRule.scheduleNumber"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="描述">
                            <el-input type="textarea" v-model="scheduleUrgentRule.remarks"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addNewRules">确 定</el-button>
                <el-button @click="dialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="组织机构" :visible.sync="organizationDialogVisible" width="540px" custom-class="customDialogTitle">
            <div class="dialogBody">
                <el-tree
                :data="organizationTree"
                :props="defaultProps"
                @node-click="handleNodeClick"
                node-key="id"
                ref="organizationTree"
                auto-expand-parent
                check-strictly>
                </el-tree>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="selectOrganizationConfirm">确 定</el-button>
                <el-button @click="organizationDialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from '@/views/components/breadcrumb';
import pagination from '@/views/components/pagination';
import { listBrand, listCategory, listOrganization } from '@/api/pulicJava';
import { addScheduleUrgent, listScheduleUrgentRule, addScheduleUrgentRule, getScheduleUrgentRule, editScheduleUrgent, editScheduleUrgentRule, getScheduleUrgent } from "@/api/systemcenter/timeLimtUrgent";
import spot from '@/assets/images/spot.png';
import { setTimeout } from 'timers';
export default {
    components:{
        breadcrumb,
        pagination
    },
    created() {
        if(this.$route.query.edit||this.$route.query.copy){
            this.scheduleUrgentId=this.$route.query.scheduleUrgentId;
            getScheduleUrgent(
                {
                    ScheduleUrgentId:this.scheduleUrgentId
                }
            ).then(res=>{
                for(let i in this.formList){
                    this.formList[i]=res.data[i];
                }
            })
            this.rulesListPage();
        }
    },
    mounted() {
        this.navList = this.$route.meta;
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
        listOrganization().then(res=>{
            this.organizationTree=res.data;
        })
        
    },
    data(){
        return{
            navList:[],
            span:6,
            spot,
            organizationTree:[],
            organizationDialogVisible:false,
            dialog:false,
            listBrandArr:[],
            listCategoryArr:[],
            organizationName:'',
            organizationId:'',
            scheduleUrgentId:"",
            scheduleUrgentRuleId:"",
            formList:{
                brandId:"",
                commodityCategoryId:"",
                createTime:"",
                returnSchemeStart:"",
                returnSchemeEnd:"",
                scheduleUrgentName:"",
                organizationId:"",
                organizationName:"",
            },
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            tableData:[],
            scheduleUrgentRule:{
                specialName:'',
                scheduleUpper:"",
                isEnable:"",
                scheduleNumber:"",
                remarks:"",
                scheduleUrgentId:"",
            },
            rules:{
                scheduleUrgentName:[
                    {
                        required:true,
                        message:"请输入方案名称",
                        trigger:'blur'
                    }
                ],
                organizationName:[
                    {
                        required:true,
                        message:"请选择关联机构",
                    }
                ],
                brandId:[
                    {
                        required:true,
                        message:"请选择品牌",
                        trigger:'change',
                    }
                ],
                commodityCategoryId:[
                    {
                        required:true,
                        message:"请选择品类",
                        trigger:'change',
                    }
                ],
                createTime:[
                    {
                        required:true,
                        message:"请选择创建时间",
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
            status:0,
            onOff: false
        }
    },
    methods: {
        close(){
            for(let i in this.scheduleUrgentRule){
                this.scheduleUrgentRule[i]="";
            }
        },
        editRule(val){
            this.status=1;
            this.scheduleUrgentRuleId=val.scheduleUrgentRuleId;
            getScheduleUrgentRule(
                {
                    scheduleUrgentRuleId:this.scheduleUrgentRuleId
                }
            ).then(res=>{
                this.dialog=true;
                for(let i in this.scheduleUrgentRule){
                    this.scheduleUrgentRule[i]=res.data[i]
                }
            })
        },
        addNewRules(){
            if(this.status==0){
                this.scheduleUrgentRule.scheduleUrgentId=this.scheduleUrgentId;
                addScheduleUrgentRule(this.scheduleUrgentRule).then(res=>{
                    this.rulesListPage()
                    this.$message({
                        message: '新增成功',
                        type: 'success'
                    });
                    this.dialog=false;
                })
            }else if(this.status==1){
                this.scheduleUrgentRule.scheduleUrgentId=this.scheduleUrgentId;
                this.scheduleUrgentRule.scheduleUrgentRuleId=this.scheduleUrgentRuleId;
                editScheduleUrgentRule(this.scheduleUrgentRule).then(res=>{
                    this.rulesListPage()
                    this.$message({
                        message: '编辑成功',
                        type: 'success'
                    });
                    this.dialog=false;
                })
            }
            
        },
        saveSchedule(){
            this.$refs.form.validate((valid) => {
                if(valid) {
                    if(this.$route.query.edit){
                        let obj=this.formList;
                        obj.scheduleUrgentId=this.scheduleUrgentId
                        editScheduleUrgent(this.formList).then(res=>{
                            this.$message({
                                message: '编辑成功',
                                type: 'success'
                            });
                            this.$router.push({
                                path:'timeLimtUrgent'
                            })
                        })
                    }else {
                        if(this.onOff){ // 编辑
                            let obj=this.formList;
                            obj.scheduleUrgentId=this.scheduleUrgentId
                            editScheduleUrgent(this.formList).then(res=>{
                                this.$message({
                                    message: '编辑成功',
                                    type: 'success'
                                });
                                this.$router.push({
                                    path:'timeLimtUrgent'
                                })
                            })
                        }else{ // 复制新增
                            addScheduleUrgent(this.formList).then(res=>{
                                this.scheduleUrgentId=res.data;
                                this.onOff = true;
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });
                                this.$router.push({
                                    path:'timeLimtUrgent'
                                })
                            })
                        }
                    }
                    
                }else{
                    return false;
                }
            });
        },
        rulesListPage(){
            listScheduleUrgentRule({
                scheduleUrgentId:this.scheduleUrgentId
            }).then(res=>{
                this.tableData=res.data;
            })
        },
        changeOrganization(){
            this.organizationName="";
            this.organizationId="";
            this.formList.organizationId="";
            this.formList.organizationName="";
        },
        selectOrganizationConfirm(){
            if (this.organizationId) {
                this.formList.organizationName = this.organizationName;
                this.formList.organizationId = this.organizationId;
                this.organizationDialogVisible = false;
                return;
            }
            this.$message.warning('请选择组织机构');
        },
        handleNodeClick(data) {
            this.organizationName = data.label;
            this.organizationId = data.id;
        },
        focusIpts(){
            this.organizationDialogVisible = true;
        },
        addNewRow(){
            this.$refs.form.validate((valid) => {
                if(valid) {
                    this.dialog=true;
                    this.status=0;
                    if(this.$route.query.edit){
                        let obj=this.formList;
                        obj.scheduleUrgentId=this.scheduleUrgentId
                        editScheduleUrgent(this.formList).then(res=>{
                        })
                    }else {
                        if(this.onOff){ // 编辑
                            let obj=this.formList;
                            obj.scheduleUrgentId=this.scheduleUrgentId
                            editScheduleUrgent(this.formList).then(res=>{
                            })
                        }else{ // 复制新增
                            addScheduleUrgent(this.formList).then(res=>{
                                this.scheduleUrgentId=res.data;
                                this.onOff = true;
                            })
                        }
                    }
                    
                }else{
                    return false;
                }
            });
        },
        tableRowClassName({ row, rowIndex }) {
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        goBack(){
            this.$router.push({
                path:'timeLimtUrgent'
            })
        }
    },
}
</script>
<style scoped>

</style>
