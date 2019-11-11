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
                                <el-input placeholder="订单编号/客户合同号/客户姓名/客户电话/订单地址"></el-input>
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
                            <el-col :span="span" class="centers">
                                <el-button type="warning" class="button-fc" size="medium">查询</el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="m-top20">
                        <el-button size="small" class="button-96" v-if="btnJurisdiction.add" @click="addNews">新增</el-button>
                        <el-button size="small" class="button-96" v-if="btnJurisdiction.copy" @click="copyRow">复制</el-button>
                        <el-button size="small" class="button-96" v-if="btnJurisdiction.startUse" @click="startOrBlock(1)">启用</el-button>
                        <el-button size="small" class="button-96" v-if="btnJurisdiction.stop" @click="startOrBlock(2)">停用</el-button>
                    </div>
                    <div class="m-top20">
                        <el-table :data="tableData" @row-click="rowClick" ref="table" style="width: 100%;" border :row-class-name="tableRowClassName" @selection-change="selectChange">

                            <el-table-column align="center" type="selection"></el-table-column>
                            <el-table-column align="center" prop="scheduleUrgentNumber" width="180" label="方案单号" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-tooltip placement="right" visible-arrow v-if="btnJurisdiction.edit">
                                        <div slot="content" class="tips tipFon">
                                            <p class="operaItems"  @click="editRows(scope.row)">编辑</p>
                                        </div>
                                        <img :src="spot" alt="" class=" attributesTips">
                                    </el-tooltip>
                                    <p style="padding-left:20px">{{scope.row.scheduleUrgentNumber}}</p>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="scheduleUrgentName" label="方案名称" show-overflow-tooltip></el-table-column>
                            <el-table-column align="center" prop="organizationName" label="关联机构" show-overflow-tooltip></el-table-column>
                            <el-table-column width="200px" align="center" prop="createTime" label="创建日期" show-overflow-tooltip></el-table-column>
                            <el-table-column align="center" prop="updateAt" label="调整人" show-overflow-tooltip></el-table-column>
                            <el-table-column align="center" prop="isEnable" label="是否启用">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.isEnable==0">未启用</span>
                                    <span v-else-if="scope.row.isEnable==1">启用</span>
                                    <span v-else>停用</span>
                                </template>
                            </el-table-column>
                            <el-table-column width="200px" align="center" prop="returnSchemeStart" label="生现日期" show-overflow-tooltip></el-table-column>
                            <el-table-column width="200px" align="center" prop="returnSchemeEnd" label="失效日期" show-overflow-tooltip></el-table-column>
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
import { listScheduleUrgentByPage, getScheduleUrgent, addScheduleUrgent } from "@/api/systemcenter/timeLimtUrgent";
import { listOrganization, IsEnable } from '@/api/pulicJava';
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
            currentPage:1,
            pageSize:20,
            total:10,
            navList:[],
            dialog:false,
            span:6,
            formList:{
                page:1,
                limit:10,
                names:"",
                returnSchemeStart:"",
                returnSchemeEnd:"",
                isEnable:"",
                organizationId:"",
                date:[],
            },
            tableData:[],
            data: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            rowsData:[],
            params:{
                dataType:"schedule_urgent",
                ids:"",
                IsEnable:"0",
            },
            btnJurisdiction:{
                add:false,
                copy:false,
                startUse:false,
                stop:false,
                edit:false
            }
        }
    },
    methods: {
        rowClick(row){
            this.$refs.table.toggleRowSelection(row)
        },
        btnInit(){
            this.btnJurisdiction.add=JSON.parse(this.$loca.getItem('element'))["timeLimtUrgent:add"];
            this.btnJurisdiction.copy=JSON.parse(this.$loca.getItem('element'))["timeLimtUrgent:btn_copy"];
            this.btnJurisdiction.startUse=JSON.parse(this.$loca.getItem('element'))["timeLimtUrgent:btn-startUse"];
            this.btnJurisdiction.stop=JSON.parse(this.$loca.getItem('element'))["timeLimtUrgent:btn_stop"];
            this.btnJurisdiction.edit=JSON.parse(this.$loca.getItem('element'))["timeLimtUrgent:btn_edit"];
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
                    arr.push(item.scheduleUrgentId)
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
        selectChange(val){
            this.rowsData=val;
        },
        copyRow(){
            if(this.rowsData.length==0){
                this.$message({
                    message: '请选择后在进行复制',
                    type: 'warning'
                });
            }else if(this.rowsData.length==1){
                this.$router.push({
                    path:"addNewProjectTimeRule",
                    query:{
                        copy:true,
                        scheduleUrgentId:this.rowsData[0].scheduleUrgentId
                    }
                })
            }else{
                this.$message({
                    message: '只可选择一条',
                    type: 'warning'
                });
            }
        },
        editRows(val){
            this.$router.push({
                path:"addNewProjectTimeRule",
                query:{
                    edit:true,
                    scheduleUrgentId:val.scheduleUrgentId
                }
            })
        },
        pages(){
            this.formList.returnSchemeStart=this.formList.date[0];
            this.formList.returnSchemeEnd=this.formList.date[1];
            let obj=this.formList;
            obj.date = [];
            listScheduleUrgentByPage(this.formList).then(res=>{
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
            this.formList.organizationId=data.id
            this.pages()
        },
        tableRowClassName({ row, rowIndex }) {
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        addNews(){
            this.$router.push({
                path:"addNewProjectTimeRule"
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
