<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <div class="clearfix">
            <el-card class="fl trees">
                <div>
                    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                </div>
            </el-card>
            <el-card class="fr mains">
                <div>
                    <div class="queryForm">
                        <el-row :gutter="10">
                            <el-col :span="span">
                                <el-input placeholder="方案单号/方案名称/创建人" v-model="formList.names"></el-input>
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
                                <el-button type="warning" class="button-fc" size="medium">查询</el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="m-top20">
                        <el-button size="small" class="button-96" v-if="btnJurisdiction.add" @click="addNews">新增</el-button>
                        <el-button size="small" class="button-96" v-if="btnJurisdiction.copy" @click="copy">复制</el-button>
                        <el-button size="small" class="button-96" v-if="btnJurisdiction.startUse" @click="startOrBlock(1)">启用</el-button>
                        <el-button size="small" class="button-96" v-if="btnJurisdiction.stop" @click="startOrBlock(2)">停用</el-button>
                    </div>
                    <div class="m-top20">
                        <el-table :data="tableData" @row-click="rowClick" ref="table" style="width: 100%;" border :row-class-name="tableRowClassName" @selection-change="selectChange">

                            <el-table-column align="center" type="selection"></el-table-column>
                            <el-table-column align="center" width="180" prop="achievementShareNumber" label="方案单号" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-tooltip placement="right" visible-arrow v-if="btnJurisdiction.edit">
                                        <div slot="content" class="tips tipFon">
                                            <p class="operaItems" @click="editRows(scope.row)">编辑</p>
                                        </div>
                                        <img :src="spot" alt="" class=" attributesTips">
                                    </el-tooltip>
                                    <p class="operation table_action_span" style="padding-left:10px">{{scope.row.achievementShareNumber}}</p>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="achievementShareName" label="方案名称" show-overflow-tooltip></el-table-column>
                            <el-table-column align="center" prop="organizationName" label="关联机构" show-overflow-tooltip></el-table-column>
                            <el-table-column align="center" prop="createTime" label="创建日期" show-overflow-tooltip></el-table-column>
                            <el-table-column align="center" prop="createName" label="操作人" show-overflow-tooltip></el-table-column>
                            <el-table-column align="center" prop="isEnable" label="是否启用">
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
                            :current-page="formList.pages"
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
import { listAchievementShareByPage } from "@/api/systemcenter/resultsShared";
import spot from '@/assets/images/spot.png';
export default {
    components:{
        breadcrumb,
        pagination
    },
    // created() {
    //     this.btnInit()
    //     listOrganization().then(res=>{
    //         this.data=res.data;
    //     })
    // },
    // mounted() {
    //     this.navList = this.$route.meta;
    // },
    activated(){
        this.btnInit()
        listOrganization().then(res=>{
            this.data=res.data;
        })
        this.navList = this.$route.meta;
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    data(){
        return{
            spot,
            total:10,
            navList:[],
            dialog:false,
            span:6,
            tableData:[],
            rowsData:[],
            formList:{
                page:1,
                limit:10,
                organizationId:'',
                names:'',
                returnSchemeStart:'',
                returnSchemeEnd:'',
                isEnable:'',
                date:[]
            },
            data: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            params:{
                dataType:"achievement_share",
                ids:"",
                IsEnable:"0",
            },
            btnJurisdiction:{
                add:false,
                edit:false,
                startUse:false,
                stop:false,
                copy:false,
            }
        }
    },
    
    methods: {
        rowClick(row){
            this.$refs.table.toggleRowSelection(row)
        },
        btnInit(){
            this.btnJurisdiction.add=JSON.parse(this.$loca.getItem('element'))["resultsShared:btn_add"];
            this.btnJurisdiction.copy=JSON.parse(this.$loca.getItem('element'))["resultsShared:btn_copy"];
            this.btnJurisdiction.startUse=JSON.parse(this.$loca.getItem('element'))["resultsShared:btn_startUse"];
            this.btnJurisdiction.stop=JSON.parse(this.$loca.getItem('element'))["resultsShared:stop_stop"];
            this.btnJurisdiction.edit=JSON.parse(this.$loca.getItem('element'))["resultsShared:btn_edit"];
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
                    arr.push(item.achievementShareId)
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
        editRows(val){
            this.$router.push({
                path:"addResultsShared",
                query:{
                    edit:true,
                    achievementShareId:val.achievementShareId
                }
            })
        },
        selectChange(val){
            this.rowsData=val;
        },
        copy(){
            if(this.rowsData.length==0){
                this.$message({
                    message: '请选择后在进行复制',
                    type: 'warning'
                });
            }else if(this.rowsData.length==1){
                this.$router.push({
                    path:"addResultsShared",
                    query:{
                        copy:true,
                        achievementShareId:this.rowsData[0].achievementShareId
                    }
                })
            }else{
                this.$message({
                    message: '只可选择一条',
                    type: 'warning'
                });
            }
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
        pages(){
            this.formList.returnSchemeStart=this.formList.date[0];
            this.formList.returnSchemeEnd=this.formList.date[1];
            let obj=this.formList;
            obj.date = [];
            listAchievementShareByPage(this.formList).then(res=>{
                this.tableData=res.data.rows;
                this.total=res.data.total;
            })
        },
        tableRowClassName({ row, rowIndex }) {
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        addNews(){
            this.$router.push({
                path:"addResultsShared"
            })
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
    /* height: calc(100vh - 106px); */
}
.mains{
    width: calc(100% - 260px);
}
</style>
