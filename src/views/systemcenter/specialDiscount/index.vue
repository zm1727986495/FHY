<template>
    <div class="wrapper lvs">
        <div class="apper">
            <div class="head_nav">
                <breadcrumb :navList="navList"></breadcrumb>
            </div>
            <div class="content_body_warp">
                <el-card class="trees content_body_warp_left" style="position:initial;width:250px">
                    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                </el-card>
                <div class=" lvs" style="width:calc(100% - 260px)">
                    <el-card>
                        <div class="queryForm">
                            <el-row :gutter="10">
                                <el-col :span="span">
                                    <el-input placeholder="方案单号/方案名称/创建人" v-model="formList.names"></el-input>
                                </el-col>
                                <el-col :span="span">
                                    <el-date-picker
                                        v-model="formList.date"
                                        type="monthrange"
                                        range-separator="-"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                    </el-date-picker>
                                </el-col>
                                <el-col :span="span">
                                    <el-select v-model="formList.isEnable">
                                        <el-option label="未启用" value="0"></el-option>
                                        <el-option label="启用" value="1"></el-option>
                                        <el-option label="停用" value="2"></el-option>
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
                            <el-table :data="tableData" style="width: 100%;" @row-click="rowClick" ref="table" border :row-class-name="tableRowClassName" @selection-change="selectChange">

                                <el-table-column align="center" type="selection"></el-table-column>
                                <el-table-column align="center" prop="discountSpecialNumber" label="方案单号" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <el-tooltip placement="right" visible-arrow v-if="btnJurisdiction.edit">
                                            <div slot="content" class="tips tipFon">
                                                <p class="operaItems"  @click="editRows(scope.row)">编辑</p>
                                            </div>
                                            <img :src="spot" alt="" class=" attributesTips">
                                        </el-tooltip>
                                        <p style="padding-left:20px">{{scope.row.discountSpecialNumber}}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="discountSpecialName" label="方案名称" show-overflow-tooltip></el-table-column>
                                <el-table-column align="center" prop="organizationName" label="关联机构" show-overflow-tooltip></el-table-column>
                                <el-table-column align="center" prop="createTime" label="创建日期" show-overflow-tooltip></el-table-column>
                                <el-table-column align="center" prop="updateAt" label="调整人" show-overflow-tooltip></el-table-column>
                                <el-table-column align="center" prop="isEnable" label="是否启用">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.isEnable==0">未启用</span>
                                        <span v-else-if="scope.row.isEnable==1">启用</span>
                                        <span v-else>停用</span>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" prop="returnSchemeStart" label="生现日期" show-overflow-tooltip></el-table-column>
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
                    </el-card>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import breadcrumb from '@/views/components/breadcrumb';
import pagination from '@/views/components/pagination';
import { listOrganization, IsEnable } from '@/api/pulicJava';
import { listDiscountSpecialByPage } from "@/api/systemcenter/specialDiscount";
import spot from '@/assets/images/spot.png';
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
        listOrganization().then(res=>{
            this.data=res.data;
        })
        this.btnInit()
        this.navList = this.$route.meta;
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    data(){
        return{
            total:10,
            navList:[],
            dialog:false,
            span:6,
            spot,
            formList:{
                page:1,
                limit:10,
                organizationId:'',
                names:"",
                returnSchemeStart:"",
                returnSchemeEnd:"",
                isEnable:"",
                date:[]
            },
            tableData:[],
            data: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            rowsData:[],
            params:{
                dataType:"discount_special",
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
            this.btnJurisdiction.add=JSON.parse(this.$loca.getItem('element'))["specialDiscount:btn_add"];
            this.btnJurisdiction.copy=JSON.parse(this.$loca.getItem('element'))["specialDiscount:btn_copy"];
            this.btnJurisdiction.startUse=JSON.parse(this.$loca.getItem('element'))["specialDiscount:btn_startUse"];
            this.btnJurisdiction.stop=JSON.parse(this.$loca.getItem('element'))["specialDiscount:btn_stop"];
            this.btnJurisdiction.edit=JSON.parse(this.$loca.getItem('element'))["specialDiscount:btn_edit"];
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
                    arr.push(item.discountSpecialId)
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
        editRows(val){
            this.$router.push({
                path:"addSpecialDiscount",
                query:{
                    edit:true,
                    discountSpecialId:val.discountSpecialId
                }
            })
        },
        copy(){
            if(this.rowsData.length==0){
                this.$message({
                    message: '请选择后在进行复制',
                    type: 'warning'
                });
            }else if(this.rowsData.length==1){
                this.$router.push({
                    path:"addSpecialDiscount",
                    query:{
                        copy:true,
                        discountSpecialId:this.rowsData[0].discountSpecialId
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
            this.currentPage = val;
        },
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
        },
        handleNodeClick(data) {
            this.formList.organizationId=data.id;
            this.pages()
        },
        pages(){
            this.formList["returnSchemeStart"]=this.formList.date[0];
            this.formList["returnSchemeEnd"]=this.formList.date[1];
            listDiscountSpecialByPage(this.formList).then(res=>{
                this.tableData=res.data.rows;
                this.total=res.data.total;
            })
        },
        tableRowClassName({ row, rowIndex }) {
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        addNews(){
            this.$router.push({
                path:"addSpecialDiscount"
            })
        }
    }
}
</script>