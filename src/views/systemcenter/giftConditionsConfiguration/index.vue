<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <el-select v-model="selectStatus">
                <el-option v-for="(item,idx) in optionStatus" :key="idx" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <div class="fr">
                <el-button size="medium" class="button-fc" type="warning">查询</el-button>
            </div>
        </el-card>
        <div class="m-top20">
            <el-card>
                <div class="btnList">
                    <el-button size="small" class="button-96" @click="addNewRows">新增</el-button>
                    <el-button size="small" class="button-96" @click="editRows">编辑</el-button>
                    <el-button size="small" class="button-96" @click="startUsing">启用</el-button>
                    <el-button size="small" class="button-96" @click="disabled">停用</el-button>
                    <el-button size="small" class="button-96" @click="deleteRows">删除</el-button>
                </div>
                <div class="m-top20">
                    <el-table border :data="tableData" :row-class-name="tableRowClassName">
                        <el-table-column align="center" type="selection"></el-table-column>
                        <el-table-column align="center" prop="data" label="状态"></el-table-column>
                        <el-table-column align="center" prop="data" label="状态"></el-table-column>
                        <el-table-column align="center" prop="data" label="状态"></el-table-column>
                        <el-table-column align="center" prop="data" label="状态"></el-table-column>
                        <el-table-column align="center" prop="data" label="状态"></el-table-column>
                        <el-table-column align="center" prop="data" label="状态"></el-table-column>
                        <el-table-column align="center" prop="data" label="状态"></el-table-column>
                        <el-table-column align="center" prop="data" label="状态"></el-table-column>
                        <el-table-column align="center" prop="data" label="状态"></el-table-column>
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
        </div>
        <el-dialog title="新增礼品赠送条件" :visible.sync="addGiftDialog" width="700px" custom-class="customDialogTitle">
            <div>
                <el-form :model="ruleForm"  :rules="rules" ref="ruleForm" label-width="150px" class="ruleForm" >
                    <el-form-item label="礼品赠送条件" prop="gift">
                        <el-select v-model="ruleForm.gift"></el-select>
                    </el-form-item>
                    <el-form-item label="收款下限" prop="floor">
                        <el-input v-model="ruleForm.floor"></el-input>
                    </el-form-item>
                    <el-form-item label="礼品成本上限" prop="costLimit">
                        <el-input v-model="ruleForm.costLimit"></el-input>
                    </el-form-item>
                    <el-form-item label="有效订单时间">
                       <div class="head_nav_datapick">
                            <el-date-picker
                                size="medium"
                                v-model="ruleForm.date"
                                type="daterange"
                                value-format="yyyy-MM"
                                format="yyyy-MM"
                                range-separator="-"
                                start-placeholder="年-月"
                                end-placeholder="年-月-"
                                width='100%'
                                >
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="关联品牌" prop="brand">
                        <el-input v-model="ruleForm.brand"></el-input>
                    </el-form-item>
                    <el-form-item label="关联品类" prop="category">
                        <el-input v-model="ruleForm.category"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="ruleForm.status"></el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="saveForm('ruleForm')">保存</el-button>
                <el-button @click="addGiftDialog = false">取消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="批量修改" :visible.sync="EnablesOrDisablesDialog" width="500px" custom-class="customDialogTitle">
            <el-form label-width="100px" class="ruleForm" >
                <el-form-item label="修改项">
                   <el-input v-model="modifyItem" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="修改值">
                    <el-select v-model="modifiedValue">
                        <el-option label="启用" :value="1"></el-option>
                        <el-option label="禁用" :value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" @click="saveStatus">保存</el-button>
                <el-button @click="EnablesOrDisablesDialog = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from '@/views/components/breadcrumb';
import pagination from '@/views/components/pagination'
export default {
    components:{
        breadcrumb,
        pagination
    },
    mounted() {
        this.navList = this.$route.meta;
    },
    data(){
        return{
            currentPage:1,
            pageSize:20,
            total:10,
            EnablesOrDisablesDialog:false,
            addGiftDialog:false,
            deleteDialog:false,
            navList:[],
            selectStatus:'',
            optionStatus:[
                {
                    name:'启用',
                    id:'1'
                },
                {
                    name:'停用',
                    id:'0'
                }
            ],
            tableData:[
                {
                    data:'1'
                },
                {
                    data:'2'
                }
            ],
            rules:{
                gift:{ required: true, message: '请输入礼品赠送条件', trigger: 'blur' },
                floor:{ required: true, message: '请输入下限', trigger: 'blur' },
                costLimit:{ required: true, message: '请输入礼品成本上限', trigger: 'blur' },
                brand:{ required: true, message: '请输入关联品牌', trigger: 'blur' },
                category:{ required: true, message: '请输入关联品类', trigger: 'blur' },
                status:{ required: true, message: '请输入状态', trigger: 'blur' }
            },
            ruleForm:{
                gift:'',
                floor:'',
                date:'',
                costLimit:'',
                brand:'',
                category:'',
                status:''
            },
            modifyItem:'状态',
            modifiedValue:'',
        }
    },
    methods: {
        saveForm(val){
            this.$refs[val].validate((valid) => {
                if (valid) {
                    alert('submit!');
                    this.addGiftDialog=false;
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        saveStatus(){
            this.EnablesOrDisablesDialog=false;
        },
        saveDelete(){
            this.deleteDialog=false;
        },
        tableRowClassName({ row, rowIndex }) {
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        currentChange(val) {
            this.currentPage = val;
        },
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
        },
        addNewRows(){
            this.addGiftDialog=true;
        },
        editRows(){
            
        },
        startUsing(){
            this.EnablesOrDisablesDialog=true;
        },
        disabled(){
            this.EnablesOrDisablesDialog=true;
        },
        deleteRows(){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                type: 'warning'
                }).then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                }).catch(() => {        
            });
        },
        
    },
}
</script>
<style scoped>

</style>
