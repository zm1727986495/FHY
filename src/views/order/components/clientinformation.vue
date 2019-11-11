<template>
    <div class="operateorder">
        <div class="orderfrom">
            <div class="titlecals">订单信息</div>
            <el-form :label-position="labelPosition" label-width="130px" :model="clientinfromdata" class="demo-form-inline">
                <el-form-item label="客增单编号" v-if="orderType == 1">
                    <el-input v-model="clientinfromdata.orderNumber" size="medium" disabled placeholder="请输入订单编号"></el-input>
                </el-form-item>
                <el-form-item label="补货单编号" v-if="orderType == 2">
                    <el-input v-model="clientinfromdata.orderNumber" size="medium" disabled placeholder="请输入订单编号"></el-input>
                </el-form-item>
                <el-form-item label="遗留单编号" v-if="orderType == 3">
                    <el-input v-model="clientinfromdata.orderNumber" size="medium" disabled placeholder="请输入订单编号"></el-input>
                </el-form-item>
                <el-form-item label="订单日期">
                    <el-date-picker disabled prefix-icon="el-icon-date" v-model="clientinfromdata.orderDate"
                        value-format='yyyy-M-dd HH:mm:ss' format='yyyy-M-dd HH:mm:ss' 
                        size="medium" type="datetime" placeholder="选择日期"  class="selewi">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="客户姓名" class="posirkeh">
                    <el-input v-model="clientinfromdata.customerName" size="medium" disabled placeholder="请输入客户姓名"></el-input>
                </el-form-item>
                <el-form-item label="客户电话">
                    <el-input v-model="clientinfromdata.customerPhone" disabled size="medium" placeholder="请输入客户电话"></el-input>
                </el-form-item>
                <el-form-item label="备用电话">
                    <el-input v-model="clientinfromdata.otherPhone" disabled disabled size="medium" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="客户地址">
                    <el-input v-model="clientinfromdata.address" disabled size="medium" placeholder="请输入客户地址"></el-input>
                </el-form-item>
                <el-form-item label="所属门店">
                    <el-input v-model="clientinfromdata.storeName" disabled size="medium"></el-input>
                </el-form-item>
                <el-form-item label="预计订单金额">
                    <el-input v-model="clientinfromdata.orderExpectMoney" disabled size="medium" placeholder="请输入订单金额"></el-input>
                </el-form-item>
                <el-form-item label="业务员" v-if="sourceswath == 4 || sourceswath == 5 || sourceswath == 6 || sourceswath == 50 || sourceswath == 51 || sourceswath == 52">
                    <el-input v-model="clientinfromdata.businessName" size="medium" disabled></el-input>
                </el-form-item>
                <el-form-item label="销售员" v-else>
                    <el-input v-model="clientinfromdata.salesmanName" size="medium" disabled></el-input>
                </el-form-item>
                <el-form-item label="品类" required>
                    <el-select v-model="clientinfromdata.commodityCategoryId+''" disabled placeholder="请选择产品类别" class="selewi">
                        <el-option :label="itm.categoryName" :value="itm.commodityCategoryId" v-for="itm in category" :key="itm.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌" required>
                    <el-select v-model="clientinfromdata.brandId+''" disabled placeholder="请选择品牌" class="selewi">
                        <el-option :label="itm.brandName":value="itm.brandId" v-for="itm in Brandli" :key="itm.brandId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订单来源" required class="selewi">
                    <div class="disflex">
                        <el-select v-model="clientinfromdata.orderSourcePid" placeholder="请选择订单来源" disabled class="selewi" @change="storeSourceChange">
                            <el-option v-for="item in orderl" :key="item.value"
                                :label="item.sourceName" :value="item.storeSourceId">
                            </el-option>
                        </el-select>
                        <el-select v-model="clientinfromdata.orderSourceId" placeholder="请选择" class="selewi" disabled v-if="clientinfromdata.orderSourceId">
                            <el-option v-for="item in storeSourceIdList" :key="item.value"
                                :label="item.sourceName" :value="item.storeSourceId">
                            </el-option>
                        </el-select>
                        <el-input v-if="sourceswath == 2" size="medium" v-model="clientinfromdata.map.organizationName" disabled placeholder="请选择组织机构"></el-input>
                        <el-input v-if="sourceswath == 2" size="medium" v-model="clientinfromdata.referrerName" disabled placeholder="请选择人员"></el-input>
                        <el-input v-if="sourceswath == 3" size="medium" disabled v-model="clientinfromdata.referrerName"></el-input>
                        <el-input v-if="sourceswath == 3" size="medium" disabled v-model="clientinfromdata.companyName"></el-input>
                        <el-input v-if="sourceswath == 3" size="medium" disabled v-model="clientinfromdata.phone"></el-input>
                        <el-input v-if="sourceswath == 53" maxlength="10" placeholder="请输入10字以内" v-model="clientinfromdata.otherChannel" size="medium"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="渠道商" required v-if="sourceswath == 50 || sourceswath == 51 || sourceswath == 52">
                    <el-input v-model="clientinfromdata.companyName" disabled placeholder="选择渠道商" size="medium"></el-input>
                </el-form-item>
                <el-form-item label="订单地址" class="selewi" required>
                    <ul class="addresslist">
                        <li class="addresselec"><el-input placeholder='地图定位' :disabled="sourcestatus" v-model="maps" maxlength="50" readonly @focus='maplocation'></el-input></li>
                        <li><span>楼号/区</span><el-input placeholder="楼号/区" :disabled="sourcestatus" v-model="buildingNumber"></el-input></li>
                        <li><span>单元/楼号</span><el-input placeholder="单元/号楼" :disabled="sourcestatus" v-model="unitNumber"></el-input></li>
                        <li><span>室</span><el-input placeholder="室" :disabled="sourcestatus" v-model="roomNumber"></el-input></li>
                        <div class="explaintxttwo heicenter" v-if="!sourcestatus">
                            <span @click="addressaler" class="table_action_span">地址管理</span>
                        </div>
                    </ul>
                </el-form-item>
                <el-form-item label="订单备注" class="selewi">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="clientinfromdata.orderRemark"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <!-- 客户信息地址 -->
        <el-dialog title="地图定位" class="customDialogTitle" :visible.sync="mapDialogVisible" width="800px" v-if="mapDialogVisible">
            <baidu-map class="map" :center="center" :zoom="15" :keyboard="true"
                :scroll-wheel-zoom="true" :double-click-zoom="true">
                <bm-marker :position="center" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                <bm-control>
                    <input type="text" v-model="keyword" placeholder="请输入搜索关键字" style="width:350px;">
                    <bm-local-search :keyword="keyword" class="map_searchinfo" 
                        :auto-viewport="true" @infohtmlset="infohtmlsets" :panel="true">
                    </bm-local-search>
                </bm-control>
            </baidu-map>
            <div slot="footer" style="margin-top: 0px;">
                <el-button type="primary" size="medium" @click="confirm">保存</el-button>
                <el-button size="medium" @click="cancel">取消</el-button>
            </div>
        </el-dialog>
        <!-- 地址弹框 -->
        <el-dialog class="customDialogTitle" :visible.sync="dialogVisible" title="地址管理" width="50%">
            <div><addresselection ref="adddatas" :customerId="customerId" v-if="dialogVisible"></addresselection></div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subminaddchange">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { baiduMap } from 'src/api/pulicJava.js';
import addresselection from '../../components/addresselection';
import pagination from '../../components/pagination';
import { 
    listStoreCustomer,
    getOrderInfo, //编辑订单
    listCategory, //获取品类列表
    listBrand, //获取品牌
    editOrder, //编辑订单_提交
    listBaseDict, //基础字典查询
    getCustomerAddress,//查询地址信息
    listCustomerDemand,//获取客户需求列表
    getCustomerDemand,//获取客户需求信息
    getDesignerList,//获取本门店下所有的设计员、销售员
     } from 'api/order/order/order';
import { log } from 'util';
import { listStoreSource } from '@/api/systemcenter/storemanagement';

export default {
    components: {
        addresselection,
        pagination,
    },
    data() {
        return {
            orderType: "",
            mapDialogVisible: false,
            dialogVisible: false,
            mapData: {},//省市区
            keyword: '',
            poiObj: {},
            center: {lng: 116.404, lat: 39.915},//经纬度
            customerId: this.$route.query.customerId,
            maps:'',//地图信息
            buildingNumber:'',//楼号
            unitNumber:'',//单元
            roomNumber:'',//室
            mapText:'',
            orderl: [],//订单来源列表
            orderSourceId: "",//订单来源选中
            category: [],//品类列表
            commodityCategoryId: "",//品类
            Brandli: [],//品牌列表
            brandId: "",//品牌
            labelPosition: 'right',
            sourceswath: "",
            storeSourceIdList: [],
            sourcestatus: false,
        }
    },
    props:{
        clientinfromdata: {
            type: Object,
            default: {}
        },
    },
    watch: {
        "clientinfromdata.orderSourcePid"(val){
            this.storeSourceChange(val)
        },
        clientinfromdata(val){
            if(val.address){
                let addremount = val.address
                if(addremount.indexOf("#") != -1){
                    this.maps = addremount.substring(0,addremount.indexOf("#"));
                    this.buildingNumber = this.addsplicfun(addremount)[0];
                    this.unitNumber = this.addsplicfun(addremount)[1];
                    this.roomNumber = this.addsplicfun(addremount)[2];
                }else{
                    this.maps = addremount
                }
            }
        }
    },
    // orderType订单类型： 0正单 1增单 2补单 3遗留单 4备货采购单 5挑拨入库单 6退货入库单 7上样 8撤样 9手动 10退款 11换货
    created() {
        if(this.$route.query.type){
            this.sourcestatus = true
        }
        this.orderType = this.$route.query.orderType
        //获取品牌
        listBrand().then(res =>{
            if(res.status == 200){
                this.Brandli = res.data;
            }
        }).catch(error =>{
            console.log('订单管理:获取品牌列表 order/order/getorder.vue', error);
        })
        // 订单来源
        listStoreSource({pid: 0,page: 1,limit: 99}).then(res =>{
            if(res.status == 200){
                this.orderl = res.data.rows;
            }
        }).catch(error =>{
            console.log('订单管理:基础字典查询订单来源 order/justOrder/addJustOrder.vue', error);
        })
        // 获取品类列表
        listCategory().then(res =>{
            console.log(res,"获取品类列表");
            if(res.status == 200){
                this.category = res.data;
            }
        }).catch(error =>{
            console.log('订单管理:获取品类列表 order/order/getorder.vue', error);
        })
    },
    methods: {
        // 获取订单来源二级
        storeSourceChange(val){
            this.sourceswath = val
            console.log(val);
            listStoreSource({pid: val}).then(res =>{
                if(res.status == 200){
                    this.storeSourceIdList = res.data.rows;
                }
            }).catch(error =>{
                console.log('订单管理:基础字典查询订单来源 order/justOrder/addJustOrder.vue', error);
            })
        },
        // 截取地址信息方法
        addsplicfun(val){
            if(val){
                return val.substring(val.indexOf("#")+1).split('#')
            }
        },
        // 选择客户
        selectcustomers(){
            this.selectcustomersmass = true;
        },
        // 提交勾选地址列表
        subminaddchange(){
            let addarr = this.$refs.adddatas.selections
            if(addarr.length > 1){
                this.$message({
                    message: '只能选择一个地址信息',
                    type: 'warning'
                });
            }else if(addarr.length < 0){
                this.$message({
                    message: '请选择地址信息',
                    type: 'warning'
                });
            }else{
                this.dialogVisible = false;
                let datas = {
                    customerAddressId: addarr[0].customerAddressId
                }
                console.log(datas,"地址详情请求");
                getCustomerAddress(datas).then(res =>{
                    console.log(res);
                    if(res.status == 200){
                        this.customerAddressId = addarr[0].customerAddressId
                        this.khaddressdata = {
                            provinceId: parseInt(res.data.provinceId),//省
                            cityId: parseInt(res.data.cityId),//市
                            areaId: parseInt(res.data.areaId),//区
                            longitude: res.data.longitude+"",//经度
                            latitude: res.data.latitude+"",//纬度
                            address: res.data.address,//地址
                        }
                        this.$emit("changeaddressdata",this.khaddressdata)
                        let adddata = res.data.address
                        if(adddata.indexOf("#") != -1){
                            this.maps = adddata.substring(0,adddata.indexOf("#"));
                            this.buildingNumber = this.addsplicfun(adddata)[0];
                            this.unitNumber = this.addsplicfun(adddata)[1];
                            this.roomNumber = this.addsplicfun(adddata)[2];
                        }else{
                            this.maps = adddata
                        }
                    }
                }).catch(error =>{
                    console.log(error,'订单管理:根据客户姓名获取客户信息 order/order/getorder.vue');
                })
            }
        },
        addressaler(){
            this.dialogVisible = true;
        },
        //地图确认按钮  
        confirm() {
            if(this.poiObj.address == undefined){
                this.$message.warning("请通过地图搜索位置")
            }else{
                this.maps = this.poiObj.address +"_"+ this.poiObj.title;
                baiduMap(this.center.lng, this.center.lat).then(res=>{
                    this.mapData = res;
                    this.khaddressdata = {
                        provinceId: parseInt(this.mapData.addressComponent.adcode.substring(0,2)+"0000"),//省
                        cityId: parseInt(this.mapData.addressComponent.adcode.substring(0,4)+"00"),//市
                        areaId: parseInt(this.mapData.addressComponent.adcode),//区
                        longitude: this.center.lng+"",//经度
                        latitude: this.center.lat+"",//纬度
                    }
                    this.$emit("changeaddressdata",this.khaddressdata)
                    this.keyword = ""
                    this.mapDialogVisible = false
                }).catch(error =>{
                    console.log(error)
                })
            }
        },
        //点击所搜索红点
        infohtmlsets(poi){
            this.poiObj = poi;
            this.center = poi.point;
        },
        //取消
        cancel() {
            this.keyword = ""
            this.mapDialogVisible = false
        },
        //弹出地图框
        maplocation(){
            this.mapDialogVisible=true
        },
        // 改变tablebody颜色
        tableBodycolor({ row, rowIndex }) {
            return "height: 80px"
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
           return rowIndex%2 != 0 ? 'el-f0' : '';
        },
    },
}
</script>
<style lang="scss">
.operateorder{
    .orderfrom{
        padding: 10px 70px 10px 0px;
        border-top: none;
        .demo-form-inline{
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            >div{
                width: 40%;
            }
            .selewi{
                width: 100%;
            }
            .posirkeh{
                position: relative;
            }
            .posiakeh{
                position: absolute;
                right: -60px;
                top: 0px;
            }
            .disflex{
                display: flex;
                align-items: center;
                >div{
                    max-width: 250px;
                }
                >div+div{
                    margin-left: 10px;
                }
            }
        }
    }
    .addresslist{
        display: flex;
        position: relative;
        flex-wrap: wrap;
        .addresselec{
            width: 100% !important;
        }
        >li{
            width: calc((100% - 10px)/3);
            display: flex;
            align-items: center;
            box-sizing: border-box;
            span{
                display: block;
                white-space: nowrap;
                margin-right: 5px;
            }
            +li{
                margin-right: 5px;
                margin-top: 10px;
            }
            >div{
                min-width: 80px;
            }
        }
        li:last-of-type{
            margin-right: 0px;
        }
    }
    .explaintxttwo{
        font-size: 14px;
        margin-left: 20px;
        position: absolute;
        right: -65px;
    }
    .heicenter{
        top: 50%;
        transform: translateY(-50%);
    }
    .map {
        width: 100%;
        height: 550px;
        .map_input{
        width:350px;
        height:30px;
        }
        .map_searchinfo{
        width:350px;max-height:450px;overflow:auto;
        }
    }
    .titlecals{
        top: 0;
        margin-bottom: 20px;
    }
}
</style>