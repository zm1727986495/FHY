<template>
    <!-- 客增单新增修改 -->
    <div class="operateorder">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="lvs marbtn">
            <div class="tapbox">
                <div></div>
                <div>
                    <el-button type="primary" size="medium" @click="submitbtn">保存</el-button>
                    <el-button size="medium" @click="canclego">取消</el-button>
                </div>
            </div>
        </el-card>
        <!-- 订单详情 -->
        <orderdetail></orderdetail>
        <el-card class="lvs">
            <!-- 客户信息组件 -->
            <clientinformation 
                ref="clientindata" 
                :clientinfromdata="clientinfromdata" 
                @changeaddressdata="changeaddressdata">
            </clientinformation>
            <!-- 需求信息 -->
            <div class="froms demandbox">
                <span class="explaintxt">需求信息</span>
                <div class="borclas">
                    <demandassembly :customerDemand="customerDemand"></demandassembly>
                </div>
                <span class="explaintxttwo table_action_span" @click="demandfun">需求管理</span>
            </div>
        </el-card>
        <!-- 需求管理 -->
        <el-dialog class="customDialogTitle"
            title="需求管理"
            :visible.sync="demandswitch"
            width="60%">
            <div class="lvs">
                <el-table border
                    :row-style="tableBodycolor" 
                    :row-class-name="tableRowClassName" 
                    @selection-change="handleSelectionChangexq" 
                    :data="xqtabledata" style="width: 100%;" >
                    <el-table-column type="selection" width="40" align="center"></el-table-column>
                    <el-table-column prop="housingTypeId" align="center" label="需求标题" sortable></el-table-column>
                    <el-table-column prop="createAt" align="center"  label="操作人" sortable></el-table-column>
                    <el-table-column prop="createTime" align="center"  label="操作时间"></el-table-column>
                </el-table>
                <div class="pagination_wrap">
                    <pagination
                        :current-page="currentPage"
                        :pageSize="pageSize"
                        :total="total"
                        @sizeChange="sizeChange"
                        @currentChange="currentChange">
                    </pagination>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="xqlistclick">确 定</el-button>
                <el-button @click="demandswitch = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import clientinformation from '../components/clientinformation'
import orderdetail from "../components/orderdetail";
import demandassembly from '../components/demandassembly';
import pagination from '../../components/pagination';
import { 
    addInvalidOrderCancel,//新增客增单成功
    editOrder, //编辑订单_提交
    getOrderInfo,//编辑订单
    listCustomerDemand,//获取客户需求列表
    listBaseDict, //基础字典查询
    getCustomerDemand,//获取客户需求信息
     } from 'api/order/order/order';
import { getUUID } from "api/pulicJava";

export default {
    components: {
        breadcrumb,
        clientinformation,
        orderdetail,
        demandassembly,
        pagination,
    },
    data() {
        return {
            navList: [],
            clientinfromdata: {},
            khaddressdata: {},
            customerId: "",
            storeCustomerId: "",
            customerDemandId: "",
            customerDemand: {
                customerDemandId: "",//客户需求id
                housingTypeId: "",//房屋类型
                housingBuildTypeId: "",//房屋户型
                handoverDate: "",//交房日期,
                estimatedDecorationTime: "",//预计装修时间
                totalAreaOfHousingId: "",//房屋总面积
                decoratedHousingAreaId: "",//装修房屋面积
                decorationProgressId: "",//装修进度
                finishingTimeOfDecoration: "",//装修完成时间
                productId: [],//意向产品
                styletId: [],//意向风格
                remarks: "",//备注
            },
            xqtabledata: [],
            demandswitch: false,//需求管理开关
            currentPage: 1,//当前页数
            pageSize: 5,//每页显示个数
            total: 10,//总条数
            xqdatas: [],
            sourcestatus: false,
        }
    },
    mounted() {
        // 头部面包屑
        this.navList = this.$route.meta;
        // console.log(this.$route,"===================")
    },
    created() {
        if(this.$route.query.type){
            this.sourcestatus = true
        }
        let data = {
            orderId: this.$route.query.orderId 
        }
        getOrderInfo(data).then(res =>{
            console.log(res);
            if(res.status == 200){
                // 订单及客户信息
                this.clientinfromdata = {
                    ...res.data,
                    ...res.data.map,
                    ...res.data.customer
                }

                // 地址id
                this.customerAddressId = res.data.customerAddressId;
                this.customerId = res.data.customerId;
                this.storeCustomerId = res.data.storeCustomerId;

                let adddata = res.data.address;
                // if(adddata){
                //     //地址输入框信息转化展示
                //     this.clientinfromdata.maps = adddata.substring(0,adddata.indexOf("#"));
                //     this.clientinfromdata.buildingNumber = this.addsplicfun(adddata)[0];
                //     this.clientinfromdata.unitNumber = this.addsplicfun(adddata)[1];
                //     this.clientinfromdata.roomNumber = this.addsplicfun(adddata)[2];
                // }

                this.khaddressdata = {
                    provinceId: parseInt(res.data.provinceId),//省
                    cityId: parseInt(res.data.cityId),//市
                    areaId: parseInt(res.data.areaId),//区
                    longitude: res.data.longitude+"",//经度
                    latitude: res.data.latitude+"",//纬度
                    address: res.data.address,//地址
                }
                console.log(this.khaddressdata,"this.khaddressdata")
                // 需求信息回显
                if(res.data.customerDemandVO){
                    this.customerDemand = res.data.customerDemandVO;
                }
                this.customerDemand.customerDemandId = res.data.customerDemandId;
                if(this.customerDemand.productId){
                    this.customerDemand.productId = this.customerDemand.productId.split(',').map(Number);//意向产品转化格式
                }else{
                    this.customerDemand.productId = []
                }
                if(this.customerDemand.styletId){
                    this.customerDemand.styletId = this.customerDemand.styletId.split(',').map(Number);//意向风格转化格式
                }else{
                    this.customerDemand.styletId = []
                }
            }
        }).catch(error =>{
            console.log('订单管理:修改订单 order/order/getorder.vue', error);
        })
    },
    methods: {
        canclego(){
            history.back()
        },
        // 截取地址信息方法
        addsplicfun(val){
            if(val){
                return val.substring(val.indexOf("#")+1).split('#')
            }
        },
        changeaddressdata(data){
            this.khaddressdata = data
        },
        // 客户信息校验
        customcheckfun(){
            if(this.clientinfromdata.maps == ""){ 
                this.$message.error("尚未地图选取位置，请在弹出的地图界面点击确认操作")  
                return false;
            }else if(this.buildingNumber == "" ){ 
                this.$message.error("楼号格式输入有误,必须为数字")  
                return false;
            }else if(this.unitNumber == "" ){
                this.$message.error("单元号格式输入有误,必须为数字")  
                return false;
            }else if(this.roomNumber == "" ){
                this.$message.error("门牌号格式输入有误,必须为数字")  
                return false;
            }
            return true;
        },
        submitbtn(){
            // 从订单详情组件获取信息
            let fromdata = this.$refs.clientindata.clientinfromdata
            
            let custdata = {
                customerDemandId: this.customerDemand.customerDemandId,
                housingTypeId: this.customerDemand.housingTypeId,
                housingBuildTypeId: this.customerDemand.housingBuildTypeId,
                handoverDate: this.customerDemand.handoverDate,
                estimatedDecorationTime: this.customerDemand.estimatedDecorationTime,
                totalAreaOfHousingId: this.customerDemand.totalAreaOfHousingId,
                decoratedHousingAreaId: this.customerDemand.decoratedHousingAreaId,
                decorationProgressId: this.customerDemand.decorationProgressId,
                finishingTimeOfDecoration: this.customerDemand.finishingTimeOfDecoration,
                projectId: this.customerDemand.productId,
                styletId: this.customerDemand.styletId,
                remarks: this.customerDemand.remarks,//备注
                customerId: this.customerId,
                storeCustomerId: this.storeCustomerId,
            }
            let str = "";
            let fromdata2 = this.$refs.clientindata
            str+=fromdata2.maps+"#"+fromdata2.buildingNumber+"#"+fromdata2.unitNumber+"#"+fromdata2.roomNumber;
            this.khaddressdata.address = str
            let data = {
                ...this.khaddressdata,//地址信息
                ...custdata,//客户需求相关信息
                orderId: this.$route.query.orderId,//订单编号
                commodityCategoryId: fromdata.commodityCategoryId,//品类
                brandId: fromdata.brandId,//品牌
                customerAddressId: this.customerAddressId,//地址id
                orderRemark: fromdata.orderRemark,//备注
                contractState: fromdata.contractState,//
                countOrderBudget: fromdata.countOrderBudget,//
            }
            let objs = {
                orderId: this.$route.query.orderId,//订单编号
                orderType: 452,
                orderRemark: fromdata.orderRemark,//备注
                ...custdata,//客户需求相关信息
            }
            // 判断是否为新增客增单
            if(this.sourcestatus){
                getUUID({serialNumber: "IO"}).then(datas =>{
                    if(datas.status == 200){
                        objs.orderNumber = datas.data;
                        addInvalidOrderCancel(objs).then(res =>{
                            if(res.status == 200){
                                this.$confirm('新增客增单成功 是否跳转至签合同？').then(_ => {
                                    let routes = this.$route.query
                                    let orderGoodsType = routes.orderGoodsType
                                    let brandId = routes.brandId
                                    let commodityCategoryId = routes.commodityCategoryId
                                    this.$router.push({
                                        path: "/ordermm/signcontract",
                                        query:{
                                            orderId: res.data, 
                                            orderGoodsType: orderGoodsType, 
                                            brandId: brandId, 
                                            commodityCategoryId: commodityCategoryId,
                                            signGoodsType: orderGoodsType, 
                                        }
                                    })
                                }).catch(_ => {
                                    window.history.go(-1)
                                });
                            }
                        }).catch(error =>{
                            console.log('订单管理:新增客增单 order/customerorder/index.vue', error);
                        })
                    }
                }).catch(error =>{
                    console.log('订单管理:新增订单 order/justOrder/addJustOrder.vue', error);
                })
            }else{
                console.log(data)
                editOrder(data).then(res =>{
                    if(res.status == 200){
                        this.$message.success("修改订单成功")
                        window.history.go(-1)
                    }
                }).catch(error =>{
                    console.log('订单管理:编辑订单提交 order/order/getorder.vue', error);
                })
            }

        },
        //选择提交需求管理
        xqlistclick(){
            if(this.xqdatas.length > 1){
                this.$message({
                    message: '只能选择一个需求信息',
                    type: 'warning'
                });
            }else if(this.xqdatas.length === 0){
                this.$message({
                    message: '请选择需求信息',
                    type: 'warning'
                });
            }else{
                let datas = {
                    customerDemandId: this.xqdatas[0].customerDemandId
                }
                getCustomerDemand(datas).then(res =>{
                    console.log(res,"获取客户需求信息");
                    if(res.status == 200){
                        this.customerDemand = res.data;
                        this.customerDemand.productId = res.data.productId.split(',').map(Number);
                        this.customerDemand.styletId = res.data.styletId.split(',').map(Number);
                        this.demandswitch = false;
                        this.xqdatas = [];
                    }
                }).catch(error =>{
                    console.log('订单管理:获取客户需求信息 order/order/getorder.vue', error);
                })
            }
        },
        //需求管理
        demandfun(){
            //获取客户需求列表
            let data = {
                customerId: this.customerId,
                page: this.currentPage,
                limit: this.pageSize
            };
            listCustomerDemand(data).then(res =>{
                console.log(res,"获取客户需求列表");
                if(res.status == 200){
                    this.xqtabledata = res.data.rows;
                    this.total = res.data.total;
                    this.demandswitch = true;
                }
            }).catch(error =>{
                console.log('订单管理:获取客户需求列表 order/order/getorder.vue', error);
            })
        },
        // 改变tablebody颜色
        tableBodycolor({ row, rowIndex }) {
            // return "height: 80px"
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
           return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        handleSelectionChangexq(val){
            // this.xqdataid = val[0].customerDemandId;
            this.xqdatas = val;
        },
        sizeChange(val) {//翻页方法
            this.currentPage = 1;
            this.pageSize = val;
        },
        currentChange(val) {//翻页方法
            this.currentPage = val;
            // this.getListData();
        },
    },
    
}
</script>
<style lang="scss">
.operateorder{
    .marbtn{
        margin-bottom: 20px;
    }
    .tapbox{
        display: flex;
        justify-content: space-between;
    }
    .demandbox{
        &.froms{
            position: relative;
            display: flex;
            margin: 10px 70px 10px 0px;
        }
        .explaintxt{
            font-size: 14px;
            width: 130px;
            min-width: 130px;
            padding-right: 10px;
            text-align: right;
            font-weight: 700;
            color: #606266;
        }
        .explaintxttwo{
            font-size: 14px;
            margin-left: 20px;
            position: absolute;
            right: -65px;
        }
        .borclas{
            border: 1px solid #dcdfe6;
        }
    }
}
</style>