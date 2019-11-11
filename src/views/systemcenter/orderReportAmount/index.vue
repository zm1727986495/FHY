<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="queryForm">
                <el-row :gutter="10">
                    <el-col :span="span">
                        <el-input placeholder="流程名称/组织机构" v-model="formList.names"></el-input>
                    </el-col>
                    <el-col :span="span">
                        <el-select v-model="formList.brandId" placeholder="品牌">
                            <el-option v-for="(item,idx) in listBrandArr" :key="idx" :label="item.brandName" :value="item.brandId"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="span">
                        <el-select v-model="formList.categoryId" placeholder="品类">
                            <el-option v-for="(item,idx) in listCategoryArr"  :key="idx" :label="item.categoryName" :value="item.commodityCategoryId"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="span">
                         <el-button type="warning" class="button-fc" size="medium" @click="search">查询</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <div class="m-top20">
            <el-card>
                <div>
                    <el-button size="small" class="button-96" v-if="btnJurisdiction.add" @click="addNew">新增</el-button>
                    <el-button size="small" class="button-96" v-if="btnJurisdiction.delete" @click="deleteRow">删除</el-button>
                    <el-button size="small" class="button-96" v-if="btnJurisdiction.copy" @click="copy">复制</el-button>
                    <el-button size="small" class="button-96" v-if="btnJurisdiction.start" @click="startOrBlock(1)">启用</el-button>
                    <el-button size="small" class="button-96" v-if="btnJurisdiction.stop" @click="startOrBlock(2)">停用</el-button>
                </div>
                <div class="m-top20">
                    <el-table :data="tableData" @row-click="rowClick" ref="table" style="width: 100%;" border :row-class-name="tableRowClassName" @selection-change="selectChange">

                        <el-table-column align="center" type="selection"></el-table-column>
                        <el-table-column align="center" prop="isEnable" width="180" label="状态">
                            <template slot-scope="scope">
                                <el-tooltip placement="right" visible-arrow v-if="btnJurisdiction.edit">
                                    <div slot="content" class="tips tipFon">
                                        <p class="operaItems" @click="editRows(scope.row)">编辑</p>
                                    </div>
                                    <img :src="spot" alt="" class=" attributesTips">
                                </el-tooltip>
                                <p v-if="scope.row.isEnable==0">未启用</p>
                                <p v-else-if="scope.row.isEnable==1">启用</p>
                                <p v-else>停用</p>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="orderReportAmountNumber" label="编码" show-overflow-tooltip></el-table-column>
                        <el-table-column align="center" prop="orderReportAmountName" label="名称" show-overflow-tooltip></el-table-column>
                        <el-table-column align="center" prop="organizationName" label="组织机构" show-overflow-tooltip></el-table-column>
                        <el-table-column align="center" prop="brandName" label="品牌" show-overflow-tooltip></el-table-column>
                        <el-table-column align="center" prop="categoryName" label="品类" show-overflow-tooltip></el-table-column>
                        <el-table-column align="center" prop="minimumAmount" label="金额限制" show-overflow-tooltip></el-table-column>
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
        <el-dialog title="新增订单报备类型金额配置" :visible.sync="dialog" width="700px" custom-class="customDialogTitle"  @close="close">
            <el-form label-width="170px" size="medium" class="ruleForm">
                <el-form-item label="名称">
                    <el-input placeholder="请输入特批名称" style="width:280px" v-model="orderReportAmountDTO.orderReportAmountName" clearable></el-input>
                </el-form-item>
                <el-form-item label="选择组织机构">
                    <el-input @focus="focusIpts" @change="changeOrganization" placeholder="请选择组织机构" style="width:280px" v-model="orderReportAmountDTO.organizationName" clearable></el-input>
                </el-form-item>
                <el-form-item label="品牌">
                    <el-select v-model="orderReportAmountDTO.brandIds" placeholder="品牌" style="width:280px" clearable multiple collapse-tags>
                        <el-option v-for="(item,idx) in listBrandArr" :key="idx" :label="item.brandName" :value="item.brandId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品类">
                    <el-select v-model="orderReportAmountDTO.categoryIds" placeholder="品类" style="width:280px" clearable multiple collapse-tags>
                        <el-option v-for="(item,idx) in listCategoryArr"  :key="idx" :label="item.categoryName" :value="item.commodityCategoryId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订单商品金额最低限制" label-width="280px">
                    <el-input style="width:80px" v-model="orderReportAmountDTO.minimumAmount"></el-input><span style="margin-left:10px">元</span>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="orderReportAmountDTO.remarks"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addNewOrder(0)">保存</el-button>
                <el-button type="primary" @click="addNewOrder(1)">启用</el-button>
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
import { listOrderReportAmountByPage, addOrderReportAmount, getOrderReportAmount, editOrderReportAmount, delOrderReportAmount } from "@/api/systemcenter/orderReportAmount";
import spot from '@/assets/images/spot.png';
import { listBrand, listCategory, listOrganization, IsEnable } from '@/api/pulicJava';
export default {
    components:{
        breadcrumb,
        pagination
    },
    data(){
        return{
            span:6,
            spot,
            navList:[],
            formList:{
                names:"",
                brandId:"",
                categoryId:"",
                pate:1,
                limit:10
            },
            tableData:[],
            rowsData:[],
            total:10,
            listBrandArr:[],
            listCategoryArr:[],
            organizationTree:[],
            dialog:false,
            orderReportAmountId :"",
            organizationDialogVisible:false,
            organizationName:"",
            organizationId:"",
            orderReportAmountDTO:{
                brandIds :[],
                categoryIds :[],
                orderReportAmountName:"",
                organizationId :"",
                remarks :"",
                minimumAmount :"",
                organizationName:"",
                isEnable:0,
            },
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            status:0,
            isEnable:"",
            params:{
                dataType:"order_report_amount",
                ids:"",
                IsEnable:"0",
            },
            btnJurisdiction:{
                add:false,
                edit:false,
                start:false,
                stop:false,
                copy:false,
                delete:false
            }
        }
    },
    // mounted() {
    //     this.btnInit()
    //     this.navList = this.$route.meta;
    //     this.pages()
    //     listBrand().then(res=>{
    //         res.data.map((item,idx)=>{
    //             item.brandId=Number(item.brandId)
    //         })
    //         this.listBrandArr=res.data;
    //     })
    //     //品类
    //     listCategory().then(res=>{
    //         res.data.map((item,idx)=>{
    //             item.commodityCategoryId=Number(item.commodityCategoryId)
    //         })
    //         this.listCategoryArr=res.data;
    //     })
    //     listOrganization().then(res=>{
    //         this.organizationTree=res.data;
    //     })
    // },
    activated(){
        this.btnInit()
        this.navList = this.$route.meta;
        this.pages()
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
    // deactivated () {
    //     this.$destroy(true)
    // },
    methods: {
        rowClick(row){
            this.$refs.table.toggleRowSelection(row)
        },
        btnInit(){
            this.btnJurisdiction.add=JSON.parse(this.$loca.getItem('element'))["orderReportAmount:btn_add"];
            this.btnJurisdiction.copy=JSON.parse(this.$loca.getItem('element'))["orderReportAmount:btn_copy"];
            this.btnJurisdiction.start=JSON.parse(this.$loca.getItem('element'))["orderReportAmount:btn_start"];
            this.btnJurisdiction.stop=JSON.parse(this.$loca.getItem('element'))["orderReportAmount:btn_stop"];
            this.btnJurisdiction.edit=JSON.parse(this.$loca.getItem('element'))["orderReportAmount:btn_edit"];
            this.btnJurisdiction.delete=JSON.parse(this.$loca.getItem('element'))["orderReportAmount:btn_delete"];
        },
        startOrBlock(val){
            if(this.rowsData.length==0){
                this.$message({
                    message: '请选择后再进行操作',
                    type: 'warning'
                });
            }else{
                this.params.IsEnable=val;
                let arr=[];
                this.rowsData.map((item,idx)=>{
                    arr.push(item.orderReportAmountId);
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
        deleteRow(){
            if(this.rowsData.length==0){
                this.$message({
                    message: '请选择后再进行删除',
                    type: 'warning'
                });
            }else if(this.rowsData.length==1){
                if(this.rowsData[0].isEnable==1){
                    this.$message({
                        message: '启用状态下不可删除',
                        type: 'warning'
                    });
                }else{
                    delOrderReportAmount(
                        {
                            orderReportAmountId:this.rowsData[0].orderReportAmountId
                        }
                    ).then(res=>{
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.pages()
                    })
                }
                
            }else{
                this.$message({
                    message: '每次只可删除一条',
                    type: 'warning'
                });
            }
        },
        copy(){
            if(this.rowsData.length==0){
                this.$message({
                    message: '请选择后再进行复制',
                    type: 'warning'
                });
            }else if(this.rowsData.length==1){
                getOrderReportAmount(
                    {
                        orderReportAmountId:this.rowsData[0].orderReportAmountId
                    }
                ).then(res=>{
                    for(let i in this.orderReportAmountDTO){
                        this.orderReportAmountDTO[i]=res.data[i];
                    }
                    this.dialog=true;
                    this.status=0;
                })
            }else{
                this.$message({
                    message: '只可选择一条',
                    type: 'warning'
                });
            }
        },
        selectOrganizationConfirm(){
            if (this.organizationId) {
                this.orderReportAmountDTO.organizationName = this.organizationName;
                this.orderReportAmountDTO.organizationId = this.organizationId;
                this.organizationDialogVisible = false;
                return;
            }
            this.$message.warning('请选择组织机构');
        },
        changeOrganization(){
            this.organizationName="";
            this.organizationId="";
            this.orderReportAmountDTO.organizationId="";
            this.orderReportAmountDTO.organizationName="";
        },
        addNew(){
            this.status=0;
            this.dialog=true;
        },
        addNewOrder(val){
            if(this.status==0){
                this.orderReportAmountDTO.isEnable=val;
                addOrderReportAmount(this.orderReportAmountDTO).then(res=>{
                    if(val==0){
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                    }else{
                        this.$message({
                            message: '启用成功',
                            type: 'success'
                        });
                    }
                    this.pages()
                    this.dialog=false;
                })
            }else if(this.status==1){
                this.orderReportAmountDTO.orderReportAmountId=this.orderReportAmountId;
                if(this.isEnable==2){
                    this.orderReportAmountDTO.isEnable=this.isEnable;
                }else{
                    this.orderReportAmountDTO.isEnable=val;
                }
                editOrderReportAmount(this.orderReportAmountDTO).then(res=>{
                    this.$message({
                        message: '编辑成功',
                        type: 'success'
                    });
                    this.pages()
                    this.dialog=false;
                })
            }
            
        },
        close(){
            for(let i in this.orderReportAmountDTO){
                this.orderReportAmountDTO[i] = "";
            }
        },
        focusIpts(){
            this.organizationDialogVisible = true;
        },
        search(){
            this.formList.page=1;
            this.pages()
        },
        pages(){
            listOrderReportAmountByPage(this.formList).then(res=>{
                this.tableData=res.data.rows;
                this.total=res.data.total;
            })
        },
        handleNodeClick(data) {
            this.organizationName = data.label;
            this.organizationId = data.id;
        },
        editRows(val){
            if(val.isEnable!=1){
                if(val.isEnable==2){
                    this.isEnable==val.isEnable;
                }else{
                    this.isEnable==""
                }
                this.status=1;
                this.orderReportAmountId=val.orderReportAmountId;
                getOrderReportAmount(
                    {
                        orderReportAmountId:val.orderReportAmountId
                    }
                ).then(res=>{
                    for(let i in this.orderReportAmountDTO){
                        this.orderReportAmountDTO[i]=res.data[i];
                    }
                    this.dialog=true;
                })
            }else{
                this.$message({
                    message: '启用中，不可编辑',
                    type: 'warning'
                });
            }
            
        },
        tableRowClassName({ row, rowIndex }) {
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        selectChange(val){
            this.rowsData=val;
        },
        sizeChange(val){
            this.formList.page=1;
            this.formList.limit=val;
            this.pages()
        },
        currentChange(val){
            this.formList.page=val;
            this.pages()
        }
    },
}
</script>
<style scoped>

</style>
