<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <el-form label-width="130px" class="ruleForm" :model="formList" :rules="rules" ref="form">
                <el-row :gutter="10">
                    <el-col :span="span">
                        <el-form-item label="方案名称" prop="discountSpecialName">
                            <el-input placeholder="请输入方案名称" v-model="formList.discountSpecialName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="span">
                        <el-form-item label="关联机构" prop="organizationName">
                            <el-input @focus="focusIpts" placeholder="关联机构" v-model="formList.organizationName" clearable @change="changeOrganization"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="span">
                        <el-form-item label="品牌" prop="brandId">
                            <el-select placeholder="请选择品牌" v-model="formList.brandId">
                                <el-option v-for="(item,idx) in listBrandArr" :key="idx" :label="item.brandName" :value="item.brandId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="span">
                        <el-form-item label="品类" prop="commodityCategoryId">
                            <el-select placeholder="请选择品类" v-model="formList.commodityCategoryId">
                                <el-option v-for="(item,idx) in listCategoryArr"  :key="idx" :label="item.categoryName" :value="item.commodityCategoryId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="span">
                        <el-form-item label="生效日期" prop="returnSchemeStart">
                            <el-date-picker type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择生效日期" v-model="formList.returnSchemeStart"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="span">
                        <el-form-item label="截止日期" prop="returnSchemeEnd">
                            <el-date-picker type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择截止日期" v-model="formList.returnSchemeEnd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="center m-top20">
                <el-button size="medium" type="primary" @click="saveList">保存</el-button>
                <el-button size="medium" @click="goBack">返回</el-button>
            </div>
            <div class="m-top20">
                <el-button size="small" class="button-96" @click="addNewRow">新增规则</el-button>
            </div>
            <div class="m-top20">
                <el-table :data="tableData" border :row-class-name="tableRowClassName">
                    <el-table-column align="center" prop="discountSpecialRuleName" label="特批名称">
                        <template slot-scope="scope">
                                <el-tooltip placement="right" visible-arrow >
                                <div slot="content" class="tips tipFon">
                                    <p class="operaItems" @click="editRule(scope.row)">编辑</p>
                                </div>
                                <img :src="spot" alt="" class=" attributesTips">
                            </el-tooltip>
                            <p class="table_action_span">{{scope.row.discountSpecialRuleName}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="dictName" label="岗位"></el-table-column>
                    <el-table-column align="center" prop="userName" label="人员"></el-table-column>
                    <el-table-column align="center" prop="discountNumber" label="每月特批次数"></el-table-column>
                    <el-table-column align="center" prop="data" label="折扣区间">
                        <template slot-scope="scope">
                            {{scope.row.discountStart + " - " + scope.row.discountEnd}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="remarks" label="描述"></el-table-column>
                </el-table>
            </div>
            
        </el-card>
        <el-dialog title="新增规则" :visible.sync="dialog" width="700px" custom-class="customDialogTitle"  @close="close">
            <el-form label-width="100px" size="medium" class="ruleForm">
                <el-form-item label="特批名称">
                    <el-input placeholder="请输入特批名称" v-model="discountSpecialRule.discountSpecialRuleName"></el-input>
                </el-form-item>
                <el-form-item label="岗位">
                    <el-select placeholder="请选择岗位" v-model="discountSpecialRule.dictId" @change="changePost">
                        <el-option v-for="(item,idx) in dictArr" :key="idx" :label="item.dictName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="人员" >
                    <el-select placeholder="请选择人员" v-model="discountSpecialRule.userIds" multiple>
                        <el-option v-for="item in memberList" :value="item.id" :label="item.name" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="折扣区间" >
                    <el-col :span="11">
                        <el-input placeholder="折扣区间" v-model="discountSpecialRule.discountStart"></el-input>
                    </el-col>
                    <el-col :span="2" class="line">-</el-col>
                    <el-col :span="11">
                        <el-input placeholder="折扣区间" v-model="discountSpecialRule.discountEnd"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="特批次数">
                    <el-input placeholder="请输入特批次数" v-model="discountSpecialRule.discountNumber"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="discountSpecialRule.remarks"></el-input>
                </el-form-item>
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
import { addDiscountSpecial, editDiscountSpecialRule, addDiscountSpecialRule, editDiscountSpecial, getDiscountSpecial, getDiscountSpecialRule, listDiscountSpecialRule } from "@/api/systemcenter/specialDiscount";
import { listBrand, listCategory, listOrganization, listBaseDict, getPostUser } from '@/api/pulicJava';
import spot from '@/assets/images/spot.png';
export default {
    components:{
        breadcrumb,
        pagination
    },
    created() {
        if(this.$route.query.edit||this.$route.query.copy){
            this.discountSpecialId=this.$route.query.discountSpecialId;
            getDiscountSpecial(
                {
                    discountSpecialId:this.discountSpecialId
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
        listBaseDict(
            {
                dataType:"POST_DICT"
            }
        ).then(res=>{
            this.dictArr=res.data;
        })
    },
    data(){
        return{
            spot,
            navList:[],
            span:6,
            dialog:false,
            organizationName:"",
            organizationId:"",
            organizationTree:[],
            organizationDialogVisible:false,
            listCategoryArr:[],
            listBrandArr:[],
            discountSpecialId:"",
            discountSpecialRuleId:"",
            tableData:[],
            dictArr:[],
            formList:{
                brandId:"",
                commodityCategoryId:"",
                discountSpecialName :"",
                returnSchemeStart :"",
                returnSchemeEnd :"",
                organizationId :"",
                organizationName:"",
            },
            discountSpecialRule:{
                discountSpecialId:'',
                discountSpecialRuleName:"",
                dictId:"",
                userIds:"",
                discountStart:"",
                discountEnd:"",
                discountNumber:"",
                remarks:""
            },
            startTime: '',
            endTime: '',
            memberId: [],
            memberList: [
            ],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            rules:{
                discountSpecialName:[
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
            onOff:false,
            status:0,
        }
    },
    methods: {
        changePost(val){
            getPostUser(
                {
                    postId:val
                }
            ).then(res=>{
                this.memberList=res.data;
            })
        },
        close(){
            for(let i in this.discountSpecialRule){
                this.discountSpecialRule[i]="";
            }
        },
        addNewRow(){
            this.$refs.form.validate((valid) => {
                if(valid) {
                    this.dialog=true;
                    this.status=0;
                    if(this.$route.query.edit){
                        let obj=this.formList;
                        obj.discountSpecialId=this.discountSpecialId
                        editDiscountSpecial(this.formList).then(res=>{
                        })
                    }else {
                        if(this.onOff){ // 编辑
                            let obj=this.formList;
                            obj.discountSpecialId=this.discountSpecialId
                            editDiscountSpecial(this.formList).then(res=>{
                            })
                        }else{ // 复制新增
                            addDiscountSpecial(this.formList).then(res=>{
                                this.discountSpecialId=res.data;
                                this.onOff = true;
                            })
                        }
                    }
                }else{
                    return false;
                }
            });
        },
        editRule(val){
            this.status=1;
            this.discountSpecialRuleId=val.discountSpecialRuleId;
            getDiscountSpecialRule(
                {
                    discountSpecialRuleId:this.discountSpecialRuleId
                }
            ).then(res=>{
                this.dialog=true;
                for(let i in this.discountSpecialRule){
                    this.discountSpecialRule[i]=res.data[i]
                }
            })
        },
        addNewRules(){
            if(this.status==0){
                this.discountSpecialRule.discountSpecialId=this.discountSpecialId;
                addDiscountSpecialRule(this.discountSpecialRule).then(res=>{
                    this.rulesListPage()
                    this.$message({
                        message: '新增成功',
                        type: 'success'
                    });
                    this.dialog=false;
                })
            }else if(this.status==1){
                this.discountSpecialRule.discountSpecialId=this.discountSpecialId;
                this.discountSpecialRule.discountSpecialRuleId=this.discountSpecialRuleId;
                editDiscountSpecialRule(this.discountSpecialRule).then(res=>{
                    this.rulesListPage()
                    this.$message({
                        message: '编辑成功',
                        type: 'success'
                    });
                    this.dialog=false;
                })
            }
            
        },
        saveList(){
            this.$refs.form.validate((valid) => {
                if(valid) {
                    if(this.$route.query.edit){
                        let obj=this.formList;
                        obj.discountSpecialId=this.discountSpecialId
                        editDiscountSpecial(this.formList).then(res=>{
                            this.$message({
                                message: '编辑成功',
                                type: 'success'
                            });
                            this.$router.push({
                                path:"specialDiscount"
                            })
                        })
                    }else {
                        if(this.onOff){ // 编辑
                            let obj=this.formList;
                            obj.discountSpecialId=this.discountSpecialId
                            editDiscountSpecial(this.formList).then(res=>{
                                this.$message({
                                    message: '编辑成功',
                                    type: 'success'
                                });
                                this.$router.push({
                                    path:"specialDiscount"
                                })
                            })
                        }else{ // 复制新增
                            addDiscountSpecial(this.formList).then(res=>{
                                this.discountSpecialId=res.data;
                                this.onOff = true;
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });
                                this.$router.push({
                                    path:"specialDiscount"
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
            listDiscountSpecialRule(
                {
                    discountSpecialId:this.discountSpecialId
                }
            ).then(res=>{
                this.tableData=res.data;
            })
        },
        focusIpts(){
            this.organizationDialogVisible = true;
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
        changeOrganization(){
            this.organizationName="";
            this.organizationId="";
            this.formList.organizationId="";
            this.formList.organizationName="";
        },
        tableRowClassName({ row, rowIndex }) {
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        goBack(){
            this.$router.push({
                path:'specialDiscount'
            })
        }
    },
}
</script>
<style scoped>

</style>
