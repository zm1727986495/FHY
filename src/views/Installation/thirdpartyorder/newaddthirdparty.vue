<template>
    <div class="newaddthirdparty">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="titlecals">新增第三方订单</div>
            <div class="orderfrom">
                <el-form :label-position="labelPosition" label-width="130px" class="demo_form_inline">
                    <el-form-item label="订单编号" required v-if="disaborder">
                        <el-input v-model="orderNumber" disabled size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="合同编号" required v-if="disaborder">
                        <el-input v-model="contractNumber" disabled size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="预计安装日期">
                        <el-date-picker v-model="installationTime" :disabled="disdetails" size="medium" type="date" prefix-icon="el-icon-date"
                            value-format='yyyy-M-dd HH:mm:ss' format='yyyy-M-dd' placeholder="请选择日期" class="selewi">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="客户姓名" required>
                        <el-input v-model="customerName" :disabled="disaborder" size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="客户电话" required>
                        <el-input v-model="customerPhone" :disabled="disaborder" size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="备用电话">
                        <el-input v-model="otherPhone" :disabled="disdetails" size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="客户地址" class="selewi">
                        <ul class="addresslist">
                            <li class="addresselec"><el-input placeholder='地图定位' :disabled="disaborder" v-model="maps" maxlength="50" readonly @focus='maplocation' size="medium"></el-input></li>
                            <li><el-input placeholder="楼号/区" :disabled="disaborder" v-model="buildingNumber" size="medium"></el-input><span>楼号/区</span></li>
                            <li><el-input placeholder="单元/号楼" :disabled="disaborder" v-model="unitNumber" size="medium"></el-input><span>单元/楼号</span></li>
                            <li><el-input placeholder="室" :disabled="disaborder" v-model="roomNumber" size="medium"></el-input><span>室</span></li>
                        </ul>
                    </el-form-item>
                    <el-form-item label="地址备注">
                        <el-input v-model="detailaddres" :disabled="disdetails" size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="安装品牌">
                        <el-select v-model="brandId" :disabled="disdetails" placeholder="请选择品牌" size="medium" class="selewi">
                            <el-option :label="itm.brandName" :value="itm.brandId" v-for="itm in Brandli" 
                            :key="itm.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="安装品类">
                        <el-select v-model="commodityCategoryId" :disabled="disdetails" placeholder="请选择品类" size="medium" class="selewi">
                            <el-option :label="itm.categoryName" :value="itm.commodityCategoryId" v-for="itm in commoditylsit" :key="itm.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单来源">
                        <el-input value="第三方订单" disabled size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="采购合同号" required>
                        <el-input size="medium" v-model="contractNumber" :disabled="disdetails" placeholder="请输入采购合同号"></el-input>
                    </el-form-item>

                    <el-form-item></el-form-item>

                    <el-form-item label="服务方式">
                        <ul class="fromlistclas">
                            <li>
                                <el-checkbox v-model="checked" :disabled="selechange||disdetails">仓储</el-checkbox>
                                <el-select v-model="fromdata.storehouseId" :disabled="!checked || selechange" placeholder="请选择仓储" size="medium">
                                    <el-option :label="item.storageName" :value="item.storageId" 
                                        v-for="item in storehouselist" :key="item.value"></el-option>
                                </el-select>
                            </li>
                            <li>
                                <el-checkbox v-model="checked2" :disabled="selechange||disdetails">安装</el-checkbox>
                                <el-select v-model="fromdata.installId" :disabled="!checked2 || selechange" placeholder="请选择安装" size="medium">
                                    <el-option :label="item.serveGroupName" :value="item.serveGroupId" 
                                        v-for="item in installist" :key="item.value"></el-option>
                                </el-select>
                            </li>
                            <li>
                                <el-checkbox v-model="checked3" :disabled="selechange||disdetails">售后</el-checkbox>
                                <el-select v-model="fromdata.aftermarketId" :disabled="!checked3 || selechange" placeholder="请选择售后" size="medium">
                                    <el-option :label="item.serveGroupName" :value="item.serveGroupId" 
                                        v-for="item in aftermarketlist" :key="item.value"></el-option>
                                </el-select>
                            </li>
                        </ul>
                    </el-form-item>

                    <el-form-item class="thirdBox">
                        <ul class="thirdStyle">
                            <li>
                                <p>结算方式</p>
                                <el-input v-model="paymentMethod" size="medium"></el-input>
                            </li>
                            <li>
                                <p>结算金额</p>
                                <el-input v-model="settlementAmount" size="medium"></el-input>
                            </li>
                            <li>
                                <p>延米/投影面积</p>
                                <el-input v-model="linearMeter" size="medium"></el-input>
                            </li>
                        </ul>
                    </el-form-item>

                    <el-form-item label="上传附件" class="selewi">
                        <el-upload list-type="picture-card" :disabled="disdetails" class="upload-demo" action="string" :accept="accept"
                            :http-request="uploadSectionFile1" :file-list="fileList1" :on-remove="handleRemove1">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="订单备注" class="selewi">
                        <el-input type="textarea" :disabled="disdetails" placeholder="请输入内容" v-model="orderRemark"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <!-- <stockTable :disdetails='disdetails' ref="stockTable"></stockTable> -->

        </el-card>
        <div class="bottombtn">
            <el-button type="primary" v-if="!disdetails" size="medium" @click="submitaddorder" :loading="loadingBtn">提 交</el-button>
            <el-button size="medium" @click="cancal">取 消</el-button>
        </div>

        <!-- 客户信息地址 -->
        <el-dialog title="地图定位" :visible.sync="mapDialogVisible" width="1000px" top="1vh" class="customDialogTitle" v-if="mapDialogVisible">
            <baidu-map class="map" :center="center" :zoom="15" :keyboard="true" :scroll-wheel-zoom="true" :double-click-zoom="true">
                <bm-marker :position="center" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                <bm-control>
                    <el-input type="text" v-model="keyword" size="medium" placeholder="请输入搜索关键字" style="width:300px"></el-input>
                    <bm-local-search class="map_searchinfo" :keyword="keyword" 
                        :auto-viewport="true" @infohtmlset="infohtmlsets" :panel="true">
                    </bm-local-search>
                </bm-control>
            </baidu-map>
            <div slot="footer" style="margin-top: 0px;">
                <el-button type="primary" size="medium" @click="confirm">保存</el-button>
                <el-button size="medium" @click="cancel">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from "../../components/breadcrumb";
import stockTable from "@/views/order/abandonorder/components/stockTable";
import {
  listLoginServeGroup, thirdPartyDetails, addThirdParty, 
  listBrand, listCategory, listStorageByLogin, editThirdParty
} from "api/Installation/thirdpartyorder/index";
import { put } from "@/utils/pubilcFn";
import { getUUID } from "api/pulicJava";
import { baiduMap } from 'src/api/pulicJava.js';
export default {
    components: {
        breadcrumb,
        stockTable,
    },
    data() {
        return {
            loadingBtn:false,
            paymentMethod:'',//结算方式
            settlementAmount:'',//结算金额
            linearMeter:'',//延米/投影面积
            Brandli: [],//安装品牌
            commoditylsit: [],//安装品类
            brandId: "",//品牌
            commodityCategoryId: "",//品类
            contractNumber: "",//采购合同号
            companyId: "",//订单来源
            orderGoodsType: "",//订单类型
            keyword: '',
            orderRemark: '',//订单备注
            detailaddres: '',//详细地址
            mapDialogVisible: false,
            installationTime: "",//预计安装日期
            customerPhone: "",//客户电话
            otherPhone: "",//备用电话
            maps: "",
            buildingNumber: "",
            unitNumber: "",
            roomNumber: "",
            navList: [],
            poiObj:{},
            category: [],//安装列表
            installist: [],//安装列表
            aftermarketlist: [],//售后列表
            storehouselist: [],//仓库
            labelPosition: 'right',
            orderNumber: "",
            contractNumber: "",
            thirdOrderDetailId: "",
            customerName: "",
            fromdata: {
                storehouseId: "",
                installId: "",
                aftermarketId: "",
            },
            center: {lng: 116.404, lat: 39.915},//经纬度
            checked: false,
            checked2: false,
            checked3: false,
            selechange: false,
            imgArr1: [],
            delImgArr: [],
            accept: "image/jpeg,image/jpg,image/gif,image/png,image/bmp,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
            fileList1: [],
            orderId: this.$route.query.orderId,
            disaborder: false,
            disdetails:true,
            editFlag:false
        }
    },
    watch: {
        // checked(val){
        //     if(val === false){
        //         this.fromdata.commodityCategoryId = "";
        //     }
        // }
    },
    created() {
        if(this.$route.query.isFlag==1){
            this.disaborder = true;
            this.disdetails = true;
        }else{
            if(this.orderId){
                this.disaborder = true;
                // this.editFlag = true;
            }else {
                this.disaborder = false;
            }
            this.disdetails = false;
        }
        if (this.orderId){
          this.thirdetil(this.orderId);
        }
    },
    mounted() {
        // 头部面包屑
        this.navList = this.$route.meta;
        //服务选项安装
        listLoginServeGroup({dataCode: "INSTALL_DEPARTMENT"}).then(res =>{
            if(res.status == 200){
                this.installist = res.data;
            }
        }).catch(error =>{
            console.log('服务选项安装', error);
        })
        // 售后
        listLoginServeGroup({dataCode: "MAINTENANCE_DEPARTMENT"}).then(res =>{
            if(res.status == 200){
                this.aftermarketlist = res.data;
            }
        }).catch(error =>{
            console.log('售后', error);
        })
        // 仓库
        listStorageByLogin().then(res =>{
            if(res.status == 200){
                this.storehouselist = res.data;
            }
        }).catch(error =>{
            console.log('仓库', error);
        })
        // 品牌
        listBrand().then(res =>{
            if(res.status == 200){
                this.Brandli = res.data;
            }
        }).catch(error =>{
            console.log('品牌', error);
        })
        // 品类
        listCategory().then(res =>{
            if(res.status == 200){
                this.commoditylsit = res.data;
            }
        }).catch(error =>{
            console.log('品类', error);
        })
    },
    methods: {
        // 截取地址信息方法
        addsplicfun(val){
            if(val){
                return val.substring(val.indexOf("#")+1).split('#')
            }
        },
        // 编辑回显
        thirdetil(val){
            thirdPartyDetails({orderId: val}).then(res =>{
                if(res.status == 200){
                    console.log(res, "回显");
                    let detilsdata = res.data;
                    this.orderNumber = detilsdata.orderNumber;//订单编号
                    this.thirdOrderDetailId = detilsdata.thirdOrderDetailId;//订单编号
                    this.contractNumber = detilsdata.contractNumber;//合同编号
                    this.customerPhone = detilsdata.customerPhone;//客户手机号
                    this.customerName = detilsdata.customerName;//客户姓名
                    this.installationTime = detilsdata.installationTime;//预计安装日期
                    this.orderRemark = detilsdata.orderRemark;//订单备注
                    this.otherPhone = detilsdata.otherPhone;//客户备用手机
                    this.contractNumber = detilsdata.contractNumber;//采购合同号
                    this.brandId = detilsdata.brandId+"";//品牌
                    this.paymentMethod = detilsdata.thirdOrderDetail.paymentMethod;//结算方式
                    this.settlementAmount = detilsdata.thirdOrderDetail.settlementAmount;//结算金额
                    this.linearMeter = detilsdata.thirdOrderDetail.linearMeter;//延米/投影面积
                    this.commodityCategoryId = detilsdata.commodityCategoryId+"";//品列
                    this.fileList1 = detilsdata.accessoryList.map(item => {
                        return {...item,url: item.fileUrl}
                    });//上传图片
                    if(detilsdata.processModes.length !== 0){
                        this.selechange = true;
                        detilsdata.processModes.forEach(item =>{
                            if(item.processMode == 1){
                                this.checked = true;
                                this.fromdata.storehouseId = item.sourceId
                            }
                            if(item.processMode == 2){
                                this.checked2 = false;
                                this.fromdata.installId = item.sourceId
                            }
                            if(item.processMode == 3){
                                this.checked3 = false;
                                this.fromdata.aftermarketId = item.sourceId
                            }
                        })
                    }
                    //地址输入框信息转化展示
                    let adddata = detilsdata.address
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
                console.log('订单管理:订单列表 order/order/order.vue', error);
            })
        },
        funshengc(){
            // 生成订单号
            getUUID({serialNumber: "SO"}).then(dastas =>{
                if(dastas.status == 200){
                    orderdata.orderNumber = dastas.data
                    
                }
            }).catch(error =>{
                console.log('订单管理:获取订单id order/justOrder/addJustOrder.vue', error);
            })
            // 生成合同号
            getUUID({serialNumber: "CC"}).then(dastas =>{
                if(dastas.status == 200){
                    orderdata.contractNumber = dastas.data
                }
            }).catch(error =>{
                console.log('订单管理:获取订单id order/justOrder/addJustOrder.vue', error);
            })
        },
        fuwufun(){
            let testphot = /^1(3|4|5|7|8)\d{9}$/;
            if(this.customerName == ""){
                this.$message.error("请输入客户姓名");
                return false
            }else if(!testphot.test(this.customerPhone)){
                this.$message.error("客户电话格式有误");
                return false
            }else if(this.brandId == ""){
                this.$message.error("请选择品牌");
                return false
            }else if(this.commodityCategoryId == ""){
                this.$message.error("请选择品类");
                return false
            }else if(this.maps == ""&&(!this.disaborder)){ 
                this.$message.error("尚未地图选取位置，请在弹出的地图界面点击确认操作")
                return false;
            }else if(this.buildingNumber == ""&&(!this.disaborder) ){ 
                this.$message.error("请输入客户地址楼号")  
                return false;
            }else if(this.unitNumber == ""&&(!this.disaborder) ){
                this.$message.error("请输入客户地址单元号")  
                return false;
            }else if(this.roomNumber == ""&&(!this.disaborder) ){
                this.$message.error("请输入客户地址门牌号")  
                return false;
            }else if(this.contractNumber == ""){
                this.$message.error("请输入采购合同号")  
                return false;
            }

            if(this.checked && this.fromdata.storehouseId == ""){
                this.$message.error("请选择仓储");
                return false
            }
            if(this.checked2 && this.fromdata.installId == ""){
                this.$message.error("请选择安装");
                return false
            }
            if(this.checked3 && this.fromdata.aftermarketId == ""){
                this.$message.error("请选择售后");
                return false
            }
            return true
        },
        // 新增第三方订单
        submitaddorder(){
            // 服务选项
            if(!this.fuwufun()){
                return false
            }
            // 商品判断
            // if(!this.testing()){
            //     return false
            // }
            let imglist = []
            this.imgArr1.forEach(item => {
                let obj = {
                    sourceName: item.name,
                    fileUrl: item.url,
                }
                imglist.push(obj);
            })//图片信息
            // let tabledata = this.$refs.stockTable.tabList;
            let orderCommodityList = []
            // tabledata.forEach(item => {
            //     let obj = {}
            //     obj.commodityId = item.commodityId;//商品Id
            //     obj.width = item.commodityWide;//宽
            //     obj.high = item.commodityHigh;//高
            //     obj.deep = item.commodityLong;//深
            //     obj.thick = item.commodityThick;//厚
            //     obj.colourId = item.commodityColourId;//颜色id
            //     obj.seriesId = item.commoditySeriesId;//系列Id
            //     obj.materialId = item.commodityMaterialId;//材质Id
            //     obj.amount = item.purchaseNumber;//数量
            //     obj.commoditySkuId = item.commoditySkuId;//商品skuID
            //     orderCommodityList.push(obj)
            // });//商品信息
            let data = {
                orderSourceId: 1076,//第三方订单
                customerPhone: this.customerPhone,//客户电话
                customerName: this.customerName,//客户姓名
                otherPhone: this.otherPhone,//备用电话
                contractNumber: this.contractNumber,//备用电话
                brandId: this.brandId,//品牌id
                paymentMethod:this.paymentMethod,//结算方式
                settlementAmount:this.settlementAmount,//结算金额
                linearMeter:this.linearMeter,//延米/投影面积
                commodityCategoryId: this.commodityCategoryId,//品类id
                thirdOrderDetails: {//合同信息
                    thirdOrderDetailId: "",//第三方订单id
                    contractNumber: "",//合同号
                    installationTime: this.installationTime,//预计安装时间
                    orderRemark: this.orderRemark,//订单备注
                },
                orderRemark: this.orderRemark,//订单备注
                orderCommodityList: orderCommodityList,
                processModes: [],//服务信息
                orderAcc: imglist,//图片列表
                customerAddressOne: {
                    address: this.maps+"#"+this.buildingNumber+"#"+this.unitNumber+"#"+this.roomNumber
                }
            }
            if(this.checked){
                let objs = {
                    processMode: 1,
                    sourceId: this.fromdata.storehouseId
                }
                data.processModes.push(objs)
            }
            if(this.checked2){
                let objs = {
                    processMode: 2,
                    sourceId: this.fromdata.installId
                }
                data.processModes.push(objs)
            }
            if(this.checked3){
                let objs = {
                    processMode: 3,
                    sourceId: this.fromdata.aftermarketId
                }
                data.processModes.push(objs)
            }
            console.log(data);
            // 编辑
            if(this.disaborder){
                data.orderId = this.orderId
                data.orderNumber = this.orderNumber
                data.thirdOrderDetails.contractNumber = this.contractNumber
                data.thirdOrderDetails.thirdOrderDetailId = this.thirdOrderDetailId
                this.loadingBtn = true;
                editThirdParty(data).then(res =>{
                    if(res.status == 200){
                        this.$message.success("编辑第三方订单成功");
                        this.loadingBtn = false;
                        this.$router.push({path: "/Installation/thirdpartyorder"})
                    }else{
                        this.loadingBtn = false;
                    }
                }).catch(error =>{
                    this.loadingBtn = false;
                    console.log('订单管理:订单列表 order/order/order.vue', error);
                })
            }else{
                // 生成订单号
                getUUID({serialNumber: "SO"}).then(dastas =>{
                    if(dastas.status == 200){
                        data.orderNumber = dastas.data
                        // 生成合同号
                        getUUID({serialNumber: "CC"}).then(datas =>{
                            if(datas.status == 200){
                                data.thirdOrderDetails.contractNumber = datas.data
                                // 新增第三方订单
                                this.loadingBtn = true;
                                addThirdParty(data).then(res =>{
                                    if(res.status == 200){
                                        console.log(res);
                                        this.$message.success("新增第三方订单成功");
                                        this.loadingBtn = false;
                                        this.$router.push({path: "/Installation/thirdpartyorder"})
                                    }else{
                                        this.loadingBtn = false;
                                    }
                                }).catch(error =>{
                                    this.loadingBtn = false;
                                    console.log('订单管理:订单列表 order/order/order.vue', error);
                                })
                            }
                        }).catch(error =>{
                            console.log('订单管理:获取订单id order/justOrder/addJustOrder.vue', error);
                        })
                    }
                }).catch(error =>{
                    console.log('订单管理:获取订单id order/justOrder/addJustOrder.vue', error);
                })
            }
            
        },
        // 取消
        cancal(){
            this.$router.push({path: "/Installation/thirdpartyorder"})
        },
        testing(){
            // if(this.$refs.stockTable.tabList.length == 0) {
            //     this.$message.warning("请选择商品");
            //     return false;
            // }
            // let flag = this.$refs.stockTable.tabList.every(item => {
            //     let flag1 = false;
            //     let flag2 = false;
            //     let flag3 = false;
            //     if(item.commoditycolourList.length != 0) { // 颜色
            //         if(item.commodityColourId) {
            //             flag1 = true;
            //         }
            //     }else {
            //         flag1 = true;
            //     }
            //     if(item.commoditymaterialList.length != 0) { // 材质
            //         if(item.commodityMaterialId) {
            //             flag2 = true;
            //         }
            //     }else {
            //         flag2 = true;
            //     }
            //     if(item.commodityseriesList.length != 0) { // 系列
            //         if(item.commoditySeriesId) {
            //             flag3 = true;
            //         }
            //     }else {
            //         flag3 = true;
            //     }
            //     return flag1 && flag2 && flag3;
            // })

            // if(!flag) { // 每一个商品的材质颜色系列有可选项并且选中了
            //     this.$message.warning("请添加商品的材质颜色系列");
            //     return false;
            // }
            return true
        },
        //文件成功操作  //addAccessory编辑的新增接口
        uploadSectionFile1(res) {
            put(res).then(data => {
                this.imgArr1.push(data);
                console.log(this.imgArr1);
            });
        },
        //文件删除操作
        handleRemove1(file, fileList) {
            if (file.dataSourceId) {
                //console.log("旧图片删除");
                let delobj = {
                    accessoryId: file.accessoryId,
                    dataSourceId: file.dataSourceId,
                    dataSourceEnum: file.dataSourceEnum
                };
                this.delImgArr.push(delobj);
            } else {
                //console.log("新增图片删除");
                let lengs = String(file.raw.uid).length;
                this.imgArr1 = this.imgArr1.filter(item => {
                    let str = item.name.substring(0, lengs);
                    return str !== String(file.raw.uid);
                });
            }
        },
        //点击所搜索红点
        infohtmlsets(poi) {
            this.poiObj = poi;
            this.center = poi.point;
        },
        //取消
        cancel() {
            this.keyword = ""
            this.mapDialogVisible = false
        },
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
                    this.keyword = "";
                    this.mapDialogVisible=false
                }).catch(error =>{
                    console.log(error)
                })
            }
        },
        //弹出地图框
        maplocation(){
            this.mapDialogVisible=true
        },
    },
}
</script>
<style lang="scss">
    .newaddthirdparty{
        .el-dialog__body{
            padding: 0 20px;
        }
        .el-dialog__footer{
            padding: 10px 20px 10px;
        }
        .el-form-item{
            margin-bottom:10px;
        }
        .thirdBox{
            .el-form-item__content{
                margin-left:60px !important;
            }
        }
        .thirdStyle{
            li{
                display: flex;
                margin-bottom: 5px;
                p{
                    min-width: 90px;
                    color: #606266;
                    font-weight: bold;
                }
            }
        }

        .titlecals{
            top: 0px;
        }
        .orderfrom{
            padding: 10px 70px 10px 20px;
            border-top: none;
            .demo_form_inline{
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                >div{
                    width: 40%;
                }
                .selewi{
                    width: 100%;
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
                    margin: 0px 5px;
                }
                +li{
                    // margin-right: 5px;
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
            color: #1ABC9C;
            position: absolute;
            right: -65px;
        }
        .frombox{
            padding-right: 30px;
        }
        .map {
            width: 100%;
            height: 550px;
            .map_input{
                width:350px;
                height:30px;
            }
            .map_searchinfo{
                width:350px;
                max-height:450px;
                overflow:auto;
            }
        }
        .fromlistclas{
            li{
                margin: 10px 0px;
            }
        }
        .bottombtn{
            margin: 20px 0 10px;
            display: flex;
            justify-content: center;
        }
    }
</style>
