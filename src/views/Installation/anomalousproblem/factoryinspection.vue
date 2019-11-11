<template>
    <div class="factoryinspection">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="lvs">
            <!-- 查询条件组 -->
            <div class="warp_head_list">
                <div class="list_top">
                    <div class="head_nav_select">
                        <el-input placeholder="客户合同号/采购合同号" v-model="beofIn.contractNumber" size="medium"></el-input>
                    </div>
                    <div class="head_nav_datapick">
                        <el-date-picker
                            size="medium" v-model="factoryDate" type="daterange" 
                            value-format='yyyy-M-dd' format='yyyy-M-dd'
                            start-placeholder="工厂接单开始时间"
                            end-placeholder="工厂接单结束时间"
                            range-separator="-"
                            @change="factoryFn"
                            >
                        </el-date-picker>
                    </div>
                    <div class="head_nav_datapick">
                        <el-date-picker
                            size="medium" v-model="appointmentDate" type="daterange" 
                            value-format='yyyy-M-dd' format='yyyy-M-dd'
                            start-placeholder="预约上门开始时间"
                            end-placeholder="预约上门结束时间"
                            range-separator="-"
                            @change="appointmentFn"
                            >
                        </el-date-picker>
                    </div>
                    <div class="head_nav_datapick">
                        <el-date-picker
                            size="medium" v-model="predictedDate" type="daterange" 
                            value-format='yyyy-M-dd' format='yyyy-M-dd'
                            start-placeholder="预计安装开始时间"
                            end-placeholder="预计安装结束时间"
                            range-separator="-"
                            @change="predictedFn"
                            >
                        </el-date-picker>
                    </div>
                    <div class="head_nav_select">
                        <el-select v-model="beofIn.factoryDeliveryStatus" placeholder="工厂交货状态" size="medium">
                            <el-option
                                v-for="item in stateList"
                                :key="item.id"
                                :label="item.name" 
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <!-- <div class="head_nav_select">
                        <el-select v-model="orderChannel" placeholder="选择货品产地" size="medium">
                            <el-option
                                v-for="item in channelList" :key="item.value"
                                :label="item.dictName" :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    
                    
                    <div class="head_nav_select">
                        <el-select v-model="workshop" placeholder="选择生成车间" size="medium">
                            <el-option
                                v-for="item in typeList" :key="item.value"
                                :label="item.categoryName" :value="item.commodityCategoryId">
                            </el-option>
                        </el-select>
                    </div> -->
                    
                    <div class="head_nav_datapick">
                        <el-button @click="searchFun" class="button-fc" type="warning" size="medium">查询</el-button>
                        <el-button @click="resetFun" type='primary' size="medium">重置</el-button>
                    </div>
                </div>
            </div>
            <div class="h-width"></div>
            <div class="order-btn-list">
                <el-button size="small" class="button-96" v-if="btnJurisdiction.factoryinspection_remarks" @click="remarksfun">填写备注</el-button>
                <el-button size="small" class="button-96" v-if="btnJurisdiction.factoryinspection_export" @click="invitation">导出</el-button>
            </div>
            <div class="order_table">
                <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                    :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" align="center" width="55"></el-table-column>
                    <el-table-column prop="factoryDeliveryStatus" align="center" label="工厂交货状态" width="200" sortable>
                        <template slot-scope="scope">
                            <div class="tabcomclas">
                                <div>{{scope.row.factoryDeliveryStatus}}</div>
                                <div class="taberrclas" v-if="scope.row.abnormalMaterial == 1">材料异常</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="purchaseNumber" align="center" label="采购单号" width="200" sortable></el-table-column>
                    <el-table-column prop="purchaseContractCode" align="center" label="采购合同号" width="200" sortable></el-table-column>
                    <el-table-column prop="orderStatus" align="center" label="客户合同号" width="200" sortable></el-table-column>
                    <el-table-column prop="factoryTakeTime" align="center" label="工厂接单日期" width="200" sortable></el-table-column>
                    <el-table-column prop="predictInstallationTime" align="center" label="预计安装日期" width="200" sortable></el-table-column>
                    <el-table-column prop="visitTime" align="center" label="预约上门时间" width="200" sortable></el-table-column>
                    <el-table-column prop="factoryDeliveryTime" align="center" label="工厂交货日期" width="200" sortable></el-table-column>
                    <el-table-column prop="deliveryRemakes" align="center" label="交货备注" width="200" show-overflow-tooltip></el-table-column>
                </el-table>
            </div>
            <div class="pagination_wrap">
                <el-pagination 
                background 
                @current-change="handleCurrentChange" 
                :current-page="currentPage" 
                :page-size="pageSize"
                @size-change="handleSizeChange" 
                :page-sizes="[10, 20, 30, 40]" 
                layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </el-card>

        <el-dialog center :visible.sync="dialogVisible" width="500px">
            <div class="titlecals">作废</div>
            <div class="zuopclas">确定作废？</div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 填写备注 -->
        <el-dialog :visible.sync="remarksval" title="填写备注" class="customDialogTitle" width="900px">
            <div class="blameclas">
                <el-form class="frombox" label-width="100px">
                    <el-form-item label="采购单号">
                        <div>{{remakedata.purchaseNumber}}</div>
                    </el-form-item>
                    <el-form-item label="工厂接单日期">
                        <el-date-picker size="medium" class="tablebox" v-model="remakedata.factoryTakeTime" 
                            type="date" value-format='yyyy-M-dd' format='yyyy-M-dd' placeholder="交货日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="交货日期">
                        <el-date-picker size="medium" class="tablebox" v-model="remakedata.factoryDeliveryTime" 
                            type="date" value-format='yyyy-M-dd' format='yyyy-M-dd' placeholder="交货日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="交货状态" class="fromlistbox">
                        <el-radio-group v-model="factoryDeliveryStatus">
                            <el-radio :label="0">待确认</el-radio>
                            <el-radio :label="1">正常交货</el-radio>
                            <el-radio :label="2">交期异常</el-radio>
                            <el-checkbox v-model="abnormalMaterials" v-if="factoryDeliveryStatus == 2">材料异常</el-checkbox>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="交货备注" class="fromlistbox">
                        <el-input type="textarea" v-model="remakedata.deliveryRemakes"></el-input>
                    </el-form-item>
                </el-form>
                <div class="titlecals">打包信息</div>
                <!-- <div class="displclas">
                    <el-button type="primary" size="medium" @click="selectTemplate">选择到货单模板</el-button>
                </div> -->
                <div v-if="pachlist.length != 0">
                    <el-form class="frombox" label-width="100px" 
                        v-for="(itm, idx) in pachlist" :key="idx">
                        <el-form-item :label="itm.name">
                            <el-input v-model="itm.number"></el-input>
                        </el-form-item>
                        <el-form-item label="产地车间">
                            <el-input v-model="itm.workshop"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="remarkssubmit">确 定</el-button>
                <el-button @click="remarksval = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 选择到货单模板 -->
        <!-- <el-dialog append-to-body title="模板下载" :visible.sync="down" width="760px" custom-class="customDialogTitle">
            <download :isShow="false" ref="download" v-if="down" :checklist="checklist" :bindInfo="bindInfo"></download>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmFun">确 定</el-button>
                <el-button @click="down = false">取 消</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>
<script>
import download from "../../entrepotSet/stockManagement/arrivalNotice/downLoad";
import breadcrumb from "../../components/breadcrumb";
import { 
    listInspectionReportRemake, 
    InspectionReportRemakeDetails, 
    getListById, 
    editInspectionReportRemake, 
    } from "api/Installation/anomalousproblem/factoryinspection";
import {
  listAogByPage,
  exportListAogTemplate
} from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";

export default {
    components: {
        breadcrumb,
        download,
    },
    data(){
        return {
            btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
            pachlist: [],//打包列表
            inspectionpachlist: [],//回显打包列表
            templateArr: [],//到货单模板勾选
            purchaseOrderId: "",//
            installationOrderIds: "",//安装id
            bindInfo: {},//品牌品类
            checklist: true, //状态
            down: false,//到货单模板
            checked: false,
            remarksval: false,
            textareaval: '', // 备注
            contractNumber:'',//客户合同号/采购合同号
            searchData: [],// 创建订单时间
            factoryDate: [],// 工厂接单时间
            appointmentDate: [],// 预约上门时间 
            predictedDate: [],// 预计安装时间
            orderStatus: "", // 工厂交货状态搜索
            stateList: [{
                name:'待确认',
                id:0
            },{
                name:'正常交货',
                id:1
            },{
                name:'有异常',
                id:2
            },],  // 状态条件
            workshop: '', // 类别搜索
            typeList: [], // 类别条件
            orderChannel: "", //渠道选择
            channelList: [], //渠道条件
            isShow: false,
            abnormalMaterials: false,
            remakedata: {
                factoryTakeTime: "",
                factoryDeliveryTime: "",
                deliveryRemakes: "",
            },//填写备注回显信息
            factoryDeliveryStatus: 2,//交货状态
            resource: "",
            dialogVisible: false,
            navList: [],
            tableData:[],//表格
            tableSelectList: [],
            total: 0,    // 总数
            pageSize: 20,  // 单页条数
            currentPage: 1, // 当前页
            beofIn:{}//时间
        }
    },
    activated(){
         // 头部面包屑
        this.navList=this.$route.meta;

        let data = {};
        if(this.$route.query.orderId){
            data.orderId = this.$route.query.orderId;
        }else{
            data.page = this.currentPage;
            data.limit = this.pageSize;
        }

        this.orderdatafun(data);
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    // mounted() {
    //     // 头部面包屑
    //     this.navList=this.$route.meta;
    // },
    // created() {
    //     let data = {};
    //     if(this.$route.query.orderId){
    //         data.orderId = this.$route.query.orderId;
    //     }else{
    //         data.page = this.currentPage;
    //         data.limit = this.pageSize;
    //     }

    //     this.orderdatafun(data);

    // },
    methods: {
        //工厂接单
        factoryFn(){
            this.beofIn.factoryTakeStartTime = this.factoryDate ? this.factoryDate[0] : '';
            this.beofIn.factoryTakeEndTime = this.factoryDate ? this.factoryDate[1] : '';
        },
        //预约上门
        appointmentFn(){
            this.beofIn.predictInstallationStartTime = this.appointmentDate ? this.appointmentDate[0] : '';
            this.beofIn.predictInstallationEndTime = this.appointmentDate ? this.appointmentDate[1] : '';
        },
        //预计安装
        predictedFn(){
            this.beofIn.predictVisitStartTime = this.predictedDate ? this.predictedDate[0] : '';
            this.beofIn.predictVisitEndTime = this.predictedDate ? this.predictedDate[1] : '';
        },
        selectTemplate(){
            this.down = true;
        },
        //模板弹框确认
        confirmFun() {
            if (this.$refs.download.choseArr.length < 1) {
                this.$message.warning("只少勾选一个模板!");
                this.down = true;
            } else if (this.$refs.download.choseArr.length > 1) {
                this.$message.warning("只能勾选一个模板!");
                this.down = true;
            } else {
                this.templateArr = this.$refs.download.choseArr;
                this.down = false;
                let data = {
                    aogId: this.templateArr[0].aogId
                }
                this.pachlist = []
                getListById(data).then(res =>{
                    console.log(res);
                    if(res.status == 200){
                        res.data.forEach(item =>{
                            let obj = {
                                name: item.aogTemplateName,
                                number: "",
                                workshop: "",
                            }
                            this.pachlist.push(obj)
                        })
                    }
                }).catch(error =>{
                    console.log('工厂查货:到货单号获取打包信息 order/order/order.vue', error);
                })
            }
        },
        statusfun(idx, val){
            console.log(idx, val);
        },
        // 提交备注信息
        remarkssubmit(){
            let data = {
                purchaseOrderId: this.purchaseOrderId,
                installationOrderId: this.installationOrderIds,
                factoryDeliveryStatus: this.factoryDeliveryStatus,//交货状态
                factoryTakeTime: this.remakedata.factoryTakeTime,
                abnormalMaterial: this.abnormalMaterials ? 1 : 0,
                deliveryRemakes: this.remakedata.deliveryRemakes,
                factoryDeliveryTime: this.remakedata.factoryDeliveryTime,
                list: this.pachlist
            }
            editInspectionReportRemake(data).then(res =>{
                console.log(res);
                if(res.status == 200){
                    this.$message.success("操作成功")
                    this.remarksval = false;
                }
            }).catch(error =>{
                console.log('工厂查货:提交备注信息 order/order/order.vue', error);
            })
        },
        remarksfun(){
            if(!this.changefun()){
                return false
            }
            this.bindInfo.brandId = this.tableSelectList[0].brandId
            this.bindInfo.categoryId = this.tableSelectList[0].categoryId
            this.purchaseOrderId = this.tableSelectList[0].purchaseOrderId
            this.installationOrderIds = this.tableSelectList[0].installationOrderId
            // this.tableSelectList[0].brandId
            // this.tableSelectList[0].categoryId
            this.remarksval = true;
            InspectionReportRemakeDetails({purchaseOrderId: this.purchaseOrderId}).then(res =>{
                console.log(res);
                if(res.status == 200){
                    this.remakedata = res.data;
                    this.inspectionpachlist = res.data.inspectionReportRemakeDetails;
                    if(this.inspectionpachlist.length == 0){
                        this.caigoufun()
                    }else{
                        this.pachlist = res.data.inspectionReportRemakeDetails
                    }
                    // this.remakedata.abnormalMaterials = res.data.abnormalMaterial == 1;
                    this.factoryDeliveryStatus = res.data.factoryDeliveryStatus*1
                    this.abnormalMaterials = res.data.abnormalMaterials == 1
                }
            }).catch(error =>{
                console.log('工厂查货:获取备注信息 order/order/order.vue', error);
            })
        },
        caigoufun(){
            let data = {
                brandId: this.bindInfo.brandId,
                categoryId: this.bindInfo.categoryId,
                page: 1,
                limit: 10
            }
            listAogByPage(data).then(res => {
                this.templateArr = res.data.rows;
                this.down = false;
                let datas = {
                    aogId: this.templateArr[0].aogId
                }
                this.pachlist = []
                getListById(datas).then(res =>{
                    console.log(res);
                    if(res.status == 200){
                        res.data.forEach(item =>{
                            let obj = {
                                name: item.aogTemplateName,
                                number: "",
                                workshop: "",
                            }
                            this.pachlist.push(obj)
                        })
                    }
                }).catch(error =>{
                    console.log('工厂查货:到货单号获取打包信息 order/order/order.vue', error);
                })
            }).catch(error => {
                console.error("到货模板", error);
            });
        },
        // 显示隐藏搜索
        hideSearch(){
            this.isShow = !this.isShow;
        },
        tolocotion(){
            this.$router.push({path: "/Installation/exceptiondetails"})
        },
        invitation(){
            if (this.tableSelectList.length < 1){
                this.$message({
                    message: '抱歉， 请选择订单',
                    type: 'warning'
                });
            }else{
                // this.dialogVisible = true;
            }
        },
        changefun(){
            if(this.tableSelectList.length > 1){
                this.$message({
                    message: '只能选择一个订单',
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
        // 获取列表数据
        orderdatafun(){
            let data = {
                ...this.beofIn,
                orderId:this.$route.query.orderId,
                page: this.currentPage,
                limit: this.pageSize
            }
            listInspectionReportRemake(data).then(res =>{
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tableData = res.data.rows;
                }
            }).catch(error =>{
                console.log('订单管理:订单列表 order/order/order.vue', error);
            })
        },
        searchFun(){    //搜索
            // let data = this.searchdatas();
            this.orderdatafun()
        },
        resetFun(){// 重置
           this.orderStatus = '';
           this.contractNumber = '';
           this.factoryDate = [];
           this.appointmentDate = [];
           this.predictedDate = [];
           this.beofIn = {};
        },
        handleSelectionChange(val){
            this.tableSelectList = val;
            console.log(this.tableSelectList);
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        //分页函数回调
        handleCurrentChange(val) {
            this.currentPage = val;
            this.orderdatafun();
        },
        // 单页条数改变
        handleSizeChange(val){
            this.pageSize = val;
            this.orderdatafun();
        }
    }
}
</script>
<style lang="scss">
.factoryinspection{
    .warp_head_list{
        flex-wrap: wrap;
    }
    .list_top{
        width: 100%;
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
    }
    .list_top{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        >div{
            margin: 10px 0px;
            padding: 0px 5px;
            width: 25%;
            >div{
                width: 100%;
            }
        }
        .fontMore{
            color:#d0cfcf;
        }
        .btnone{
            margin-left: 10px;
        }
        .head_nav_btn{
            width: 100%;
            text-align: center;
            .fontMore{
                color:#d0cfcf;
            }
            .btnone{
                margin-left: 10px;
            }
        }
    }
    .head_nav_datapick{
        width: 100%;
    }
    .reset_btn{
        background: none;
        color: #f2c27b;
        border: 1px solid #f2c27b;
    }
    .order-btn-list{
        margin-top: 20px;
    }
    .order_table{
        margin-top: 20px;
        width: 100%;
        .tabcomclas{
            display: flex;
            justify-content: space-around;
        }
        .taberrclas{
            background: red;
            color: #ffffff;
            padding: 0px 3px;
            border-radius: 3px;
        }
    }
    .order_table .el-tooltip{
        text-align: center;
    }
    .order_table .cell{
        text-align: center;
    }
    .titlecals{
        top: 0;
    }
    .zuopclas{
        margin: 20px 0px 10px 0px;
        font-size: 16px;
        font-weight: 600;
        text-align: center;
    }
    .tablebox{
        width: 100%;
    }

    .blameclas{
        max-height: 500px;
        overflow: auto;
        .frombox{
            padding-right: 30px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            >div{
                width: 45%;
            }
            .fromlistbox{
                width: 100%;
            }
        }
        .fromboxs{
            padding-right: 30px;
        }
        .fromboxtree{
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            >div{
                width: 30%;
            }
        }
        .frombotm{
            padding: 0px 30px;
        }
        
    }
    .fromlismax{
        width: 100%;
    }
    .displclas{
        display: flex;
        align-items: center;
    }

}
.tabmagess{
    display: flex;
    border: 1px solid #d0cfcf {
        right: 0px;
        bottom: 0px;
    }
    >div{
        flex: 1.5;
    }
    .pricebox{
        flex: 1;
    }
    .tabtitle{
        background: #eeeeee;
        text-align: center;
        padding: 3px 0px;
        border: 1px solid #d0cfcf{
            left: 0px;
            top: 0px;
        }
    }
    .tabcontent{
        width: 100%;
        display: flex;
        ul{
            text-align: center;
            flex: 1;
        }
        li{
            padding: 3px 0px;
            border: 1px solid #d0cfcf{
                left: 0px;
                top: 0px;
            }
        }
    }
}
</style>