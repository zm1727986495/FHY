<template>
    <div class="thirdpartyorder">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="lvs">
            <!-- 查询条件组 -->
            <div class="warp_head_list">
                <div class="list_top">
                    <el-input placeholder="订单号/采购合同号/客户姓名/客户电话" v-model="befoin.orderGroup" size="medium" maxlength="50"></el-input>
                    <el-date-picker prefix-icon="el-icon-date" size="medium" v-model="searchData" type="daterange" 
                        value-format='yyyy-M-dd' format='yyyy-M-dd'  range-separator="-"
                        start-placeholder="选择创建订单时间" end-placeholder="选择创建订单时间">
                    </el-date-picker>
                    <el-select v-model="befoin.brandId" clearable placeholder="请选择品牌" size="medium">
                        <el-option
                            v-for="item in brandList" :key="item.value"
                            :label="item.brandName" :value="item.brandId">
                        </el-option>
                    </el-select>
                    <el-select v-model="befoin.commodityCategoryId" multiple placeholder="请选择品类" size="medium">
                        <el-option
                            v-for="item in commodityCategoryList" :key="item.value"
                            :label="item.categoryName" :value="item.commodityCategoryId">
                        </el-option>
                    </el-select>
                </div>
                <div class="head_nav_btn">
                    <el-button @click="search" type="warning" class="button-fc" size="medium" :loading='loading'>查询</el-button>
                    <el-button @click="resetFun" type='primary' size="medium">重置</el-button>
                </div>
            </div>
            <div class="h-width"></div>
            <div class="order_btn_list">
                <el-button size="small" class="button-96" v-if="btnJurisdiction.thirdpartyorder_Import" @click="addimport">导入</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.thirdpartyorder_export" @click="exportfun">导出</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.thirdpartyorder_newadd" @click="newaddfun">新增</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.thirdpartyorder_edit" @click="eidertreen">编辑</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.thirdpartyorder_cancal" @click="cancellation">作废</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.thirdpartyorder_assign" @click="appointfun">服务方式</el-button>
            </div>
            <div class="order_table" v-loading='loading'>
                <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                    :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" align="center" width="55"></el-table-column>
                    <el-table-column prop="orderNumber" align="center" label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button type="text" v-if="scope.row.orderNumber" @click="orderdetails(scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" prop="companyName" label="外接品牌公司" width="150" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderNumber" align="center" label="订单号" sortable width="160"></el-table-column>
                    <el-table-column prop="contractNumber" align="center" label="采购合同号" width="160"></el-table-column>
                    <el-table-column prop="orderStatusName" align="center" label="订单状态" width="100">
                        <template slot-scope="scope">
                            <div v-if="scope.row.orderStatusName == 0">待入库</div>
                            <div v-if="scope.row.orderStatusName == 1">已入库</div>
                            <div v-if="scope.row.orderStatusName == 2">待安装</div>
                            <div v-if="scope.row.orderStatusName == 3">安装中</div>
                            <div v-if="scope.row.orderStatusName == 4">已完成</div>
                            <div v-if="scope.row.orderStatusName == 5">待处理</div>
                            <div v-if="scope.row.orderStatusName == 6">处理中</div>
                            <div v-if="scope.row.orderStatusName == 7">处理完成</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="brandName" align="center" label="商品品牌" width="100"></el-table-column>
                    <el-table-column prop="categoryName" align="center" label="商品品类" width="100"></el-table-column>
                    <el-table-column prop="customerName" align="center" label="客户姓名" width="120"></el-table-column>
                    <el-table-column prop="customerPhone" align="center" label="客户电话" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="订单地址" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="designerName" align="center" label="设计师" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="contractMoney" align="center" label="合同金额/元" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="giftStatus" align="center" label="礼品状态" width="80" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div v-if="scope.row.giftStatus == 1">有</div>
                            <div v-if="scope.row.giftStatus == 0">无</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="reportContent" align="center" label="汇报内容" width="180" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="processMode" align="center" label="服务方式" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="processDuty" align="center" label="服务部门" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderRemark" align="center" label="备注" width="150" show-overflow-tooltip></el-table-column>
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

        <!-- 作废 -->
        <el-dialog :visible.sync="dialogVisible" width="600px" title="作废" class="customDialogTitle">
            <div class="zuopclas">确定作废？</div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 指派部门 -->
        <appointorder v-if="appointdialogVisible" 
            :appointdialogVisible="appointdialogVisible" 
            :orderId="orderId" @appointclosefun="appointclosefun">
        </appointorder>

        <el-dialog :visible.sync="importVisible" width="600px" title="导入" class="customDialogTitle">
            <!-- <el-form label-position="right" label-width="100px">
                <el-form-item> -->
                    <el-upload class="upload-demo" action="string" :accept="accept" :limit="limit"
                        :http-request="uploadSectionFile1" :on-remove="handleRemove1">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                <!-- </el-form-item>
            </el-form> -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="importsubmit" :loading='btnLoading'>确 定</el-button>
                <el-button @click="importVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from "../../components/breadcrumb";
import pagination from '@/views/components/pagination'
import appointorder from './components/appointorder'
import { put } from "@/utils/pubilcFn";
import {
    listThirdParty,
    editCancellation,
    addBatchImport,
    listBrand,
    listCategory
} from "api/Installation/thirdpartyorder/index";
import module from '../../../../config/index.js';
export default {
    components: {
        breadcrumb,
        pagination,
        appointorder,
    },
    data(){
        return {
            orderId: "",
            befoin:{},
            commodityCategoryList: [],
            brandList:[],
            btnLoading:false,
            loading:true,
            names: '', // 条件搜索
            searchData: [],// 创建订单时间
            importVisible: false,//导入
            dialogVisible: false,
            appointdialogVisible: false,
            accept: "bmp,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
            fileList1: [],
            limit: 1,
            imgArr1: [],
            delImgArr: [],
            navList: [],
            tableData:[],
            tableSelectList: [],
            total: 0,    // 总数
            pageSize: 10,  // 单页条数
            currentPage: 1, // 当前页
            fromdata: {
                storehouseId: "",
                installId: "",
                aftermarketId: "",
            },
            btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
        }
    },
    // activated(){
    //      // 头部面包屑
    //     this.navList=this.$route.meta;

    //     this.search()
    // },
    // deactivated () {
    //     this.$destroy(true)
    // },
    mounted() {
        // 头部面包屑
        this.navList=this.$route.meta;
    },
    created() {
       this.search()
       this.getListBrand()
       this.getCommodityCategoryList()
    },
    methods: {
        getListBrand(){
            listBrand().then(res=>{
                if(res.status == 200){
                    this.brandList = res.data;
                }
            })
        },
        getCommodityCategoryList(){
            listCategory().then(res=>{
                if(res.status == 200){
                    this.commodityCategoryList = res.data;
                }
            })
        },
        //文件成功操作  //addAccessory编辑的新增接口
        uploadSectionFile1(res) {
            this.imgArr1 = res;
            console.log(this.imgArr1);
            
            // if(this.imgArr1.length<1){
            //     put(res).then(data => {
            //         this.imgArr1.push(data);
            //         console.log(this.imgArr1);
            //     });
            // }else{
            //     this.$message.error('只能上传一个!')
            // }
        },
        //文件删除操作
        handleRemove1(file, fileList) {
           this.imgArr1={}
        },
        importsubmit(){
           let formData = new FormData();
           formData.append('file',this.imgArr1.file);
           this.btnLoading = true;
            addBatchImport(formData).then(res =>{
                if(res.status == 200){
                    this.$message.success("操作成功");
                    this.importVisible = false;
                    this.btnLoading = false;
                    this.$router.push({path:'orderImport'})
                }else{
                    this.btnLoading = false;
                    this.$message.error(res.message)
                }
            }).catch(error =>{
                this.btnLoading = false;
                console.log('第三方订单:导入', error);
            })
        },
        //订单详情
        orderdetails(val){
            // this.$router.push({path: "/ordermm/details", query:{orderId: val.orderId}})
            this.$router.push({path: "/Installation/newaddthirdparty", query: {orderId: val.orderId, orderType: 1,isFlag:1}})
        },
        //服务方式
        appointclosefun(){
            this.appointdialogVisible = false;
        },
        //服务方式
        appointfun(){
            if(this.changefun()){
                this.orderId = this.tableSelectList[0].orderId;
                this.appointdialogVisible = true;
            }
        },
        // 作废
        cancellation(){
            if(this.tableSelectList.length < 1){
                this.$message.warning("请选择订单");
            }else{
                let data = []
                this.tableSelectList.forEach(item =>{
                    data.push(item.orderId)
                })
                editCancellation({orderIds: data}).then(res =>{
                    if(res.status == 200){
                        this.$message.success(res.message);
                        this.search()
                    }else{
                        this.$message.success(res.message);
                    }
                }).catch(error =>{
                    console.log('第三方订单:作废 order/order/order.vue', error);
                })
            }
        },
        //导出
        exportfun(){
            if(this.tableSelectList.length < 1){
                this.$message.warning("请选择订单");
            }else{
                let data = []
                this.tableSelectList.forEach(item =>{
                    data.push(item.orderId)
                })
                let str = module.dev.proxyTable['/api'].target + '/api/pc/thirdParty/exportThirdParty?thirdPartyIds='+data.join(',');
                window.location.href = str
            }
        },
        //导入
        addimport(){
            this.importVisible = true;
            
            return
            if(this.tableSelectList.length < 1){
                this.$message.warning("请选择订单");
            }else{
                let data = []
                this.tableSelectList.forEach(item =>{
                    data.push(item.orderId)
                })
                addBatchImport({orderIds: data}).then(res =>{
                    if(res.status == 200){
                        this.$message.success("操作成功");
                    }
                }).catch(error =>{
                    console.log('第三方订单:导入 order/order/order.vue', error);
                })
            }
        },
        // 修改第三方订单
        eidertreen(){
            if(this.changefun()){
                let {orderId} = this.tableSelectList[0];
                this.$router.push({path: "/Installation/newaddthirdparty", query: {orderId, orderType: 1}})
            }
        },
        // 新增第三方订单
        newaddfun(){
            this.$router.push({path: "/Installation/newaddthirdparty"})
        },
        changefun(){
            if(this.tableSelectList.length > 1){
                this.$message({
                    message: '只能选择一个订单 新增预算清单',
                    type: 'warning'
                });
                return false;
            } else if (this.tableSelectList.length < 1){
                this.$message({
                    message: '抱歉， 请选择订单',
                    type: 'warning'
                });
                return false;
            } else {
                return true;
            }
        },
        search(){
            let data = {
                ...this.befoin,
                startTime:this.searchData?this.searchData[0]:'',
                endTime:this.searchData?this.searchData[1]:'',
                page: this.currentPage,
                limit: this.pageSize,
            };
            this.orderdatafun(data);
        },
        orderdatafun(data){
            this.loading = true;
            listThirdParty(data).then(res =>{
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tableData = res.data.rows;
                    this.loading = false;
                }else{
                    this.loading = false;
                }
            }).catch(error =>{
                this.loading = false;
                console.log('订单管理:订单列表 order/order/order.vue', error);
            })
        },
        resetFun(){
            this.befoin = {};
            this.searchData = []
        },
        handleSelectionChange(val){
            this.tableSelectList = val;
            console.log(this.tableSelectList);
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        currentChange(val) {
            this.currentPage = val;
             this.search()
        },
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
             this.search()
        },
    }
}
</script>
<style scoped lang="scss">
.thirdpartyorder{
    .warp_head_list{
        width: 100%;
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        .list_top{
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            >div{
                margin: 10px 0px;
                padding: 0px 10px;
                width: 25%;
                >div{
                    width: 100%;
                }
            }
        }
        .head_nav_btn{
            width: 200px;
            text-align: center;
            margin-bottom: 0px;
        }
    }
    .order_btn_list{
        margin-bottom: 20px;
    }
}
</style>