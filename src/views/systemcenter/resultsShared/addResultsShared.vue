<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <el-form label-width="120px" ref="form" class="ruleForm" :model="formList" :rules="rules">
                <el-row :gutter="10">
                    <el-col :span="span">
                        <el-form-item label="方案名称" prop="achievementShareName">
                            <el-input v-model="formList.achievementShareName" clearable></el-input>
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
                        <el-form-item label="关联机构" prop="organizationName">
                            <el-input @focus="focusIpts" v-model="formList.organizationName" clearable @change="changeOrganization"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注">
                            <el-input type="textarea" v-model="formList.remarks"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="centers">
                <el-button type="primary" size="medium" @click="saveList">保存</el-button>
                <el-button size="medium" @click="goBack">返回</el-button>
            </div>
            <div class="m-top20">
                <el-button size="small" class="button-96" @click="addNewRow">新增业绩共享</el-button>
            </div>
            <div class="m-top20">
                <el-table :data="tableData" border :row-class-name="tableRowClassName">
                    <el-table-column align="center" prop="tapeBrandName" label="带单门店品牌">
                        <template slot-scope="scope">
                                <el-tooltip placement="right" visible-arrow >
                                <div slot="content" class="tips tipFon">
                                    <p class="operaItems" @click="editRule(scope.row)">编辑</p>
                                </div>
                                <img :src="spot" alt="" class=" attributesTips">
                            </el-tooltip>
                            <p class="table_action_span">{{scope.row.tapeBrandName}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="tapeCommodityCategoryName" label="带单门店品类"></el-table-column>
                    <el-table-column align="center" prop="receiptBrandName" label="接单门店品牌"></el-table-column>
                    <el-table-column align="center" prop="receiptCommodityCategoryName" label="接单门店品类"></el-table-column>
                    <el-table-column align="center" prop="lowestAmount" label="带单门店订单商品金额最低限制"></el-table-column>
                    <el-table-column align="center" prop="isShare" label="是否业绩共享">
                        <template slot-scope="scope">
                            {{scope.row.isShare==0?"否":"是"}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="remarks" label="描述"></el-table-column>
                </el-table>
            </div>
        </el-card>
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
        <el-dialog title="新增业绩共享" :visible.sync="dialog" width="700px" custom-class="customDialogTitle" @close="close">
            <el-form label-width="100px" class="ruleForm">
                <el-row :gutter="10">
                    <el-col :span="12">
                         <el-form-item label="带单门店">
                            <label>
                                品牌：
                            </label>
                            <el-select multiple collapse-tags v-model="achievementShareRuleDTO.tapeBrandIds">
                                <el-option v-for="(item,idx) in listBrandArr" :key="idx" :label="item.brandName" :value="item.brandId"></el-option>
                            </el-select>
                            <label>
                                品类：
                            </label>
                            <el-select multiple collapse-tags v-model="achievementShareRuleDTO.tapeCommodityCategoryIds">
                                <el-option v-for="(item,idx) in listCategoryArr"  :key="idx" :label="item.categoryName" :value="item.commodityCategoryId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="接单门店">
                            <label>
                                品牌：
                            </label>
                            <el-select multiple collapse-tags v-model="achievementShareRuleDTO.receiptBrandIds">
                                <el-option v-for="(item,idx) in listBrandArr" :key="idx" :label="item.brandName" :value="item.brandId"></el-option>
                            </el-select>
                            <label>
                                品类：
                            </label>
                            <el-select multiple collapse-tags v-model="achievementShareRuleDTO.receiptCommodityCategoryIds">
                                <el-option v-for="(item,idx) in listCategoryArr"  :key="idx" :label="item.categoryName" :value="item.commodityCategoryId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="业绩共享机制" prop="dateUp">
                            带单门店订单商品金额最低限制<el-input v-model="achievementShareRuleDTO.lowestAmount"></el-input>元
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="是否业绩共享" prop="dateUp">
                            <el-radio v-model="achievementShareRuleDTO.isShare" :label="1">是</el-radio>
                            <el-radio v-model="achievementShareRuleDTO.isShare" :label="0">否</el-radio>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="描述">
                            <el-input type="textarea" v-model="achievementShareRuleDTO.remarks"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addNewRules">确 定</el-button>
                <el-button @click="dialog = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from '@/views/components/breadcrumb';
import pagination from '@/views/components/pagination';
import { listBrand, listCategory, listOrganization } from '@/api/pulicJava';
import { listAchievementShareRule, editAchievementShare, getAchievementShareRule, getAchievementShare, addAchievementShare, addAchievementShareRule } from "@/api/systemcenter/resultsShared";
import spot from '@/assets/images/spot.png';
export default {
    components:{
        breadcrumb,
        pagination
    },
    data(){
        return{
            spot,
            navList:[],
            span:6,
            achievementShareId:"",
            achievementShareRuleId:"",
            formList:{
                achievementShareName:"",
                organizationId:"",
                organizationName:"",
                returnSchemeStart:"",
                returnSchemeEnd:"",
                remarks:""
            },
            tableData:[],
            listBrandArr:[],
            listCategoryArr:[],
            dialog:false,
            status:0,
            organizationDialogVisible:false,
            organizationName:"",
            organizationId:"",
            organizationTree:[],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            rules:{
                achievementShareName:[
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
            achievementShareRuleDTO:{
                tapeBrandIds :"",
                tapeCommodityCategoryIds :"",
                receiptBrandIds :"",
                receiptCommodityCategoryIds :"",
                lowestAmount :"",
                isShare :1,
                achievementShareId :"",
            }
        }
    },
    created() {
        if(this.$route.query.edit||this.$route.query.copy){
            this.achievementShareId=this.$route.query.achievementShareId;
            getAchievementShare(
                {
                    achievementShareId:this.achievementShareId
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
    methods: {
        close(){
            for(let i in this.achievementShareRuleDTO){
                this.achievementShareRuleDTO[i]=""
            }
        },
        handleNodeClick(data) {
            this.organizationName = data.label;
            this.organizationId = data.id;
        },
        addNewRow(){
            if(this.achievementShareId){
                this.dialog=true;
                this.status=0;
            }else{
                this.$message({
                    message: '请先保存再进行新增',
                    type: 'warning'
                });
            }
        },
        focusIpts(){
            this.organizationDialogVisible = true;
        },
        changeOrganization(){
            this.organizationName="";
            this.organizationId="";
            this.formList.organizationId="";
            this.formList.organizationName="";
        },
        addNewRules(){
            if(this.status==0){
                this.achievementShareRuleDTO.achievementShareId=this.achievementShareId;
                addAchievementShareRule(this.achievementShareRuleDTO).then(res=>{
                    this.rulesListPage()
                    this.$message({
                        message: '新增成功',
                        type: 'success'
                    });
                    this.dialog=false;
                })
            }else if(this.status==1){
                this.achievementShareRuleDTO.achievementShareId=this.achievementShareId;
                this.achievementShareRuleDTO.achievementShareRuleId=this.achievementShareRuleId;
                addAchievementShareRule(this.achievementShareRuleDTO).then(res=>{
                    this.rulesListPage()
                    this.$message({
                        message: '编辑成功',
                        type: 'success'
                    });
                    this.dialog=false;
                    delete this.achievementShareRuleDTO.achievementShareRuleId
                })
            }
            
        },
        editRule(val){
            this.status=1;
            this.achievementShareRuleId=val.achievementShareRuleId;
            getAchievementShareRule(
                {
                    achievementShareRuleId:this.achievementShareRuleId
                }
            ).then(res=>{
                this.dialog=true;
                for(let i in this.achievementShareRuleDTO){
                    this.achievementShareRuleDTO[i]=res.data[i]
                }
            })
        },
        saveList(){
            this.$refs.form.validate((valid) => {
                if(valid) {
                    if(this.$route.query.edit){
                        let obj=this.formList;
                        obj.achievementShareId=this.achievementShareId
                        editAchievementShare(this.formList).then(res=>{
                            this.$message({
                                message: '编辑成功',
                                type: 'success'
                            });
                        })
                    }else {
                        if(this.onOff){ // 编辑
                            let obj=this.formList;
                            obj.achievementShareId=this.achievementShareId
                            editScheduleUrgent(this.formList).then(res=>{
                                this.$message({
                                    message: '编辑成功',
                                    type: 'success'
                                });
                            })
                        }else{ // 复制新增
                            addAchievementShare(this.formList).then(res=>{
                                this.achievementShareId=res.data;
                                this.onOff = true;
                                this.$message({
                                    message: '保存成功',
                                    type: 'success'
                                });
                            })
                        }
                    }
                    
                }else{
                    return false;
                }
            });
        },
        rulesListPage(){
            listAchievementShareRule(
                {
                    achievementShareId:this.achievementShareId
                }
            ).then(res=>{
                this.tableData=res.data.rows;
            })
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
        tableRowClassName({ row, rowIndex }) {
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        goBack(){
            this.$router.push({
                path:'resultsShared'
            })
        }
    },
}
</script>
<style scoped>
.centers{
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>