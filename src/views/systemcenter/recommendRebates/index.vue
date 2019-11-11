<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <div class="clearfix">
            <div class="fl">
                <el-card class="trees">
                    <div >
                        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                    </div>
                </el-card>
            </div>
            <el-card class="fr mains">
                <div>
                    <div class="queryForm">
                        <el-row :gutter="10">
                            <el-col :span="span">
                                <el-input placeholder="方案单号/方案名称/创建人" clearable v-model="formList.names"></el-input>
                            </el-col>
                            <el-col :span="span">
                                <el-date-picker
                                    v-model="formList.date"
                                    type="daterange"
                                    range-separator="-"
                                    start-placeholder="年/月/日"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    clearable
                                    end-placeholder="年/月/日">
                                </el-date-picker>
                            </el-col>
                            <el-col :span="span">
                                <el-select v-model="formList.isEnable" clearable>
                                    <el-option label="未启用" :value="0"></el-option>
                                    <el-option label="启用" :value="1"></el-option>
                                    <el-option label="停用" :value="2"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="span">
                                <el-button type="warning" class="button-fc" size="medium" @click="searchForm">查询</el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="m-top20">
                        <el-button size="small" class="button-96" v-if="btnJurisdiction.add" @click="addNews">新增</el-button>
                        <el-button size="small" class="button-96" v-if="btnJurisdiction.edit" @click="editRows">修改</el-button>
                        <el-button size="small" class="button-96" v-if="btnJurisdiction.startUse" @click="startOrBlock(1)">启用</el-button>
                        <el-button size="small" class="button-96" v-if="btnJurisdiction.stop" @click="startOrBlock(2)">停用</el-button>
                    </div>
                    <div class="m-top20">
                        <el-table :data="tableData" @row-click="rowClick" ref="table" border :row-class-name="tableRowClassName" @selection-change="selectChange">

                            <el-table-column align="center" type="selection"></el-table-column>
                            <!-- <el-table-column align="center" prop="returnSchemeNumber" label="方案单号" show-overflow-tooltip></el-table-column> -->
                            <el-table-column align="center" prop="returnSchemeName" label="方案名称" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <div>
                                        <p class="table_action_span" @click="onlyRead(scope.row)">{{scope.row.returnSchemeName}}</p>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="organizationName" label="适用范围" show-overflow-tooltip></el-table-column>
                            <el-table-column align="center" prop="createTime" label="创建日期" show-overflow-tooltip></el-table-column>
                            <el-table-column align="center" prop="isEnable" label="是否启用" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span v-if="scope.row.isEnable==0">未启用</span>
                                    <span v-else-if="scope.row.isEnable==1">启用</span>
                                    <span v-else>停用</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="returnSchemeStart" label="生效日期" show-overflow-tooltip></el-table-column>
                            <el-table-column align="center" prop="returnSchemeEnd" label="失效日期" show-overflow-tooltip></el-table-column>
                            <el-table-column align="center" prop="remarks" label="备注" show-overflow-tooltip></el-table-column>
                        </el-table>
                        <div class="pagination_wrap">
                            <pagination
                            :current-page="formList.page"
                            :pageSize="formList.limit"
                            :total="total"
                            @sizeChange="sizeChange"
                            @currentChange="currentChange">
                            </pagination>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>
<script>
import breadcrumb from '@/views/components/breadcrumb';
import pagination from '@/views/components/pagination';
import { listOrganization, IsEnable } from '@/api/pulicJava';
import { listReturnScheme } from "@/api/systemcenter/recommendRebates"
export default {
    components:{
        breadcrumb,
        pagination
    },
    // created() {
    //     listOrganization().then(res=>{
    //         this.data=res.data;
    //     })
    // },
    // mounted() {
    //     this.btnInit()
    //     this.navList = this.$route.meta;
    // },
    activated(){
        this.btnInit()
        this.navList = this.$route.meta;
        listOrganization().then(res=>{
            this.data=res.data;
        })
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    data(){
        return{
            categorys:[],
            formList:{
                isEnable:"",
                names:"",
                returnSchemeStart:"",
                returnSchemeEnd:"",
                limit:10,
                page:1,
                date:[],
                organizationId:"",
            },
            searchtext:"",
            total:10,
            navList:[],
            dialog:false,
            span:6,
            tableData:[],
            rowsData:[],
            data: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            params:{
                dataType:"return_scheme",
                ids:"",
                IsEnable:"0",
            },
            btnJurisdiction:{
                add:false,
                edit:false,
                startUse:false,
                stop:false,
                // save:false,
            }
        }
    },
    methods: {
        onlyRead(val){
            this.$router.push({
                path:"schemeRules",
                query:{
                    edit:true,
                    returnSchemeId:val.returnSchemeId,
                    onlyRead:1
                }
            })
        },
        rowClick(row){
            this.$refs.table.toggleRowSelection(row)
        },
        btnInit(){
            this.btnJurisdiction.add=JSON.parse(this.$loca.getItem('element'))["recommendRebates:btn_add"];
            this.btnJurisdiction.edit=JSON.parse(this.$loca.getItem('element'))["recommendRebates:btn_edit"];
            this.btnJurisdiction.startUse=JSON.parse(this.$loca.getItem('element'))["recommendRebates:btn_startUse"];
            this.btnJurisdiction.stop=JSON.parse(this.$loca.getItem('element'))["recommendRebates:btn_stop"];
        },
        startOrBlock(val){
            if(this.rowsData.length==0){
                this.$message({
                    message: '请选择后在进行操作',
                    type: 'warning'
                });
            }else{
                this.params.IsEnable=val;
                let arr=[];
                this.rowsData.map((item,idx)=>{
                    arr.push(item.returnSchemeId)
                })
                this.params.ids=arr.join(",");
                IsEnable(this.params).then(res=>{
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    this.pages()
                })
            }
        },
        searchForm(){
            this.formList.page=1;
            this.pages()
        },
        pages(){
            this.formList.returnSchemeStart=this.formList.date[0];
            this.formList.returnSchemeEnd=this.formList.date[1];
            let obj=this.formList;
            obj.date = [];
            listReturnScheme(obj).then(res=>{
                this.tableData=res.data.rows;
                this.total=res.data.total;
            })
        },
        currentChange(val) {
            this.formList.page = val;
            this.pages()
        },
        sizeChange(val) {
            this.formList.page = 1;
            this.formList.limit = val;
            this.pages()
        },
        handleNodeClick(data) {
            this.formList.organizationId=data.id;
            this.pages()
        },
        tableRowClassName({ row, rowIndex }) {
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        selectChange(val){
            this.rowsData=val;
        },
        addNews(){
            this.$router.push({
                path:"schemeRules",
                query:{
                    add:true
                }
            })
        },
        editRows(){
            if(this.rowsData.length==1){
                this.$router.push({
                    path:"schemeRules",
                    query:{
                        edit:true,
                        returnSchemeId:this.rowsData[0].returnSchemeId,
                    }
                })
            }else if(this.rowsData.length==0){
                this.$message({
                    showClose: true,
                    message: '请选择后再进行修改',
                    type: 'warning'
                });
            }else{
                this.$message({
                    showClose: true,
                    message: '只可修改一条',
                    type: 'warning'
                });
            }
        }
    }
}
</script>
<style scoped>
.centers{
    display: flex;
    justify-content: center;
    align-items: center;
}
.trees{
    width: 250px;
    /* min-height: calc(100vh - 106px); */
}
.mains{
    width: calc(100% - 260px);
}
</style>
