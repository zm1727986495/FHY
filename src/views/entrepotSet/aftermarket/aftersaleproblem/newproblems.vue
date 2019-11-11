<template>
    <div class="newproblems">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <!-- 新增问题单 -->
            <div>
                <div class="padd20">
                    <el-button type="primary" @click="orderfun" size="medium">选择订单</el-button>
                    <el-button type="primary" @click="addOrder" size="medium">生成订单</el-button>
                </div>
                <el-form
                    label-width="130px" 
                    :model="fromdata" 
                    class="demo_form_inline">
                    <el-form-item label="订单号" required>
                        <el-input v-model="fromdata.orderNumber" disabled size="medium" required></el-input>
                    </el-form-item>
                    <el-form-item label="客户姓名" required>
                        <el-input v-model="fromdata.customerName" size="medium" :disabled="customerdisabled" placeholder="客户姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="联系方式" required>
                        <el-input v-model="fromdata.customerPhone" size="medium" :disabled="customerdisabled" placeholder="联系方式"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" class="widmax" required>
                        <ul class="addresslist">
                            <li class="addresselec"><el-input placeholder='地图定位' :disabled="customerdisabled" v-model="maps" maxlength="50" readonly @focus='openMap' size="medium"></el-input></li>
                            <li><el-input placeholder="楼号 / 区" v-model="buildingNumber" size="medium"></el-input><span> 楼号 / 区 </span></li>
                            <li><el-input placeholder="单元 / 号楼" v-model="unitNumber" size="medium"></el-input><span> 单元 / 楼号 </span></li>
                            <li><el-input placeholder="室" v-model="roomNumber" size="medium"></el-input><span> 室 </span></li>
                        </ul>
                    </el-form-item>
                    <el-form-item label="合同号">
                        <el-input v-model="fromdata.customerContractNumber" disabled size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="合同签订日期">
                        <el-date-picker size="medium" disabled class="widmax" 
                            v-model="fromdata.contractGivenTime" placeholder="请选择合同签订日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="首次安装时间">
                        <el-date-picker size="medium" disabled class="widmax" 
                            v-model="fromdata.firstInstallationTime" placeholder="请选择合同签订日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="销售人员">
                        <el-input v-model="fromdata.salesman" disabled size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="设计师">
                        <el-input v-model="fromdata.stylist" disabled size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="安装部">
                        <el-input v-model="fromdata.installationDeptName" disabled size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="安装时间">
                        <el-date-picker size="medium" class="widmax" disabled
                            v-model="fromdata.installationTime" placeholder="请选择安装时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="安装完成日期">
                        <el-date-picker size="medium" class="widmax"
                            v-model="fromdata.completeTheInstallation" disabled placeholder="请选择安装完成日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="所属门店">
                        <el-select v-model="fromdata.storeId" disabled placeholder="选择所属门店" size="medium" class="widmax">
                            <el-option v-for="item in dotList" :key="item.value"
                                :label="item.storeName" :value="item.storeId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="安装完成距今时长">
                        <el-input v-model="fromdata.businessId" disabled size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="保质期">
                        <el-select v-model="fromdata.expirationDate" placeholder="选择保质期" size="medium" class="widmax">
                            <el-option v-for="item in orderq" :key="item.value"
                                :label="item.dictName" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="希望上门时间">
                        <el-date-picker size="medium" class="widmax" 
                            v-model="fromdata.expectedVisitTime" placeholder="请选择希望上门时间">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="紧急程度" size="medium">
                        <el-radio-group v-model="fromdata.emergencyDegree">
                            <el-radio :label="0">普通</el-radio>
                            <el-radio :label="1">紧急</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <!-- <el-form-item label="地址" required>
                        <el-input v-model="fromdata.address" @focus="opMap" size="medium"></el-input>
                    </el-form-item> -->

                </el-form>
                <el-form
                    label-width="130px" 
                    :model="fromdata" 
                    class="demo_form_inline">
                    <el-form-item label="问题描述" class="widmax">
                        <el-input type="textarea" v-model="fromdata.remake"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="subclas">
                <el-button type="primary" @click="handleSubmitnewproblems" :loading="loadingBtn">提 交</el-button>
                <!-- <el-button type="primary" @click="handle">处理</el-button> -->
                <el-button @click="goBack">取 消</el-button>
            </div>
            <!-- 弹框页面 -->
            <ordercomponentbackroad v-if="newcenterDialogVisible"
                :centerDialogVisible="newcenterDialogVisible" 
                @orderclosefun="orderclosefun">
            </ordercomponentbackroad>
        </el-card>
        <el-dialog title="指派责任部门" custom-class="customDialogTitle" :visible.sync="dialogVisible" width="400">
            <ul class="changeselect">
                <li>
                  <el-radio v-model="disposeKind " :label="1">电话指导完成</el-radio></li>
                <li>
                  <el-radio v-model="disposeKind " :label="2">指派安装</el-radio>
                </li>
                <li>
                  <el-radio v-model="disposeKind " :label="3">指派维修</el-radio>
                  <el-select v-model="afterDutyGroupId" v-show="disposeKind ==3" size="medium" placeholder="请选择售后责任部门">
                    <el-option v-for="item in serveGroupList" :label="item.serveGroupName" :value="item.serveGroupId" :key="item.serveGroupId"></el-option>
                  </el-select>
                </li>
            </ul>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitnewproblems">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 地图弹框 -->
        <el-dialog title="地图" :visible.sync="centerDialogVisible" v-if="centerDialogVisible" custom-class="customDialogTitle" width="80%" top="2vh">
            <baidu-map class="map" :center="center" :zoom="15" :keyboard="true" :scroll-wheel-zoom="true" :double-click-zoom="true">
                <bm-marker :position="center" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
                <bm-control>
                    <input type="text" v-model="keyword" placeholder="请输入搜索关键字" class="map_input"/>
                    <bm-local-search class="map_searchinfo" :keyword="keyword" :auto-viewport="true" @infohtmlset = "infohtmlsets" :panel="true"></bm-local-search>
                </bm-control>
            </baidu-map>
            <div slot="footer" style="margin-top: 0px;">
              <el-button @click="confirm" type="primary">确定</el-button>
              <el-button @click="cancel">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { log } from 'util';
import breadcrumb from "@/views/components/breadcrumb";
import { baiduMap } from "src/api/pulicJava.js";
import ordercomponentbackroad from "@/views/components/ordercomponentbackroad";
import { addQuestionnaire, orderDetails, commitQuestionnaire, exportQuestionnaire } from "api/entrepotSet/aftermarket/aftermarket/aftersaleproblem";
import { listStore } from 'api/order/order/order';
import { listServeGroup, getUUID } from 'src/api/pulicJava';
export default {
    components: {
        ordercomponentbackroad,
        breadcrumb,
    },
    data() {
        return {
            customerdisabled: false,
            loadingBtn:false,
            navList: [],
            dotList: [],//门店
            newcenterDialogVisible: false,
            dialogVisible: false,
            fromdata: {
                storeId: "",
                orderNumber: "",
                installationTime: "",
                completeTheInstallation: "",
                expectedVisitTime: "",
                contractGivenTime: "",
                firstInstallationTime: "",
            },
            orderq: [
                {dictName: "三年内", id: 1},
                {dictName: "三个月", id: 2},
            ],
            submitType: '', // 提交类型 1 提交 2 处理提交
            disposeKind : '',
            serveGroupList: [], // 售后部门
            afterDutyGroupId: '', // 售后责任部
            questionnaireNumber: '',
            //地图参数
            keyword:'',//地图关键字搜索
            centerDialogVisible:false,//地图弹框是否显示
            center: { lng: 116.404, lat: 39.915 }, //经纬度
            buildingNumber: "", //楼号
            unitNumber: "", //单元
            roomNumber: "", //室
            mapData: {},
            poiObj:{},
            maps:"",
        }
    },
    mounted() {
        // 头部面包屑
        this.navList = this.$route.meta;
    },
    created() {
        listStore().then(res =>{
            if(res.status == 200){
                this.dotList = res.data;
            }
        }).catch(error =>{
            console.log('订单管理:获取门店 order/order/order.vue', error);
        })
    },
    methods: {
        goBack() {
            this.$router.history.go(-1);
        },
        handle(){
            this.submitType = 2;
            this.disposeKind = '';
            this.afterDutyGroupId = '';
            this.dialogVisible = true;
            let params = {
              dataCode: 'MAINTENANCE_DEPARTMENT'
            };
            listServeGroup(params)
              .then(response => {
                this.serveGroupList = response.data.rows;
              })
              .catch(error => {
                console.log('views/entrepotSet/aftermarket/aftersaleproblem/newproblems.vue-handle:' + error);
              })
        },
        // 截取地址信息方法
        addsplicfun(val){
            if(val){
                return val.substring(val.indexOf("#")+1).split('#')
            }
        },
        orderclosefun(val){
            if(val && val.length > 0){
                // orderDetails({orderNumber: 201507270001}).then(res =>{
                orderDetails({orderId: val[0].orderId}).then(res =>{
                    if(res.status == 200){
                        this.newcenterDialogVisible = false;
                        this.customerdisabled = true;
                        this.fromdata.orderId = res.data.orderId;
                        this.fromdata.orderNumber = res.data.orderNumber;//订单号
                        // this.fromdata.orderNumber = 201507270001;
                        this.fromdata.customerName = res.data.customerName;//客户姓名
                        this.fromdata.customerPhone = res.data.customerPhone;//客户电话
                        this.fromdata.address = res.data.address;//地址
                        this.fromdata.customerContractNumber = res.data.customerContractNumber;//合同号
                        this.fromdata.contractGivenTime = res.data.contractGivenTime;//合同签订日期
                        this.fromdata.firstInstallationTime = res.data.firstInstallationTime;//合同签订日期
                        this.fromdata.salesman = res.data.salesman;//销售人员
                        this.fromdata.stylist = res.data.stylist;//设计师
                        this.fromdata.installationDeptName = res.data.installationDeptName;//安装部
                        this.fromdata.installationTime = res.data.installationTime;//安装时间
                        this.fromdata.completeTheInstallation = res.data.completeTheInstallation;//安装完成日期
                        if(res.data.completeTheInstallation != ""){
                            this.fromdata.businessId = Math.ceil((new Date().getTime()-new Date(res.data.completeTheInstallation).getTime())/24/60/60/1000)
                        }
                        this.fromdata.storeName = res.data.storeName;//所属门店
                        this.fromdata.storeId = res.data.storeId;//所属门店
                        // this.fromdata.remake = res.data.remake;
                        this.fromdata.installationOrderId = res.data.installationOrderId;
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
                    console.log('售后问题:新增问题 src/views/entrepotSet/aftermarket/aftersaleproblem/components/newproblems.vue', error);
                })
            }else{
                this.newcenterDialogVisible = false;
            }
        },
        orderfun(){
            this.newcenterDialogVisible = true;
        },
        // 点击生成订单
        addOrder() {
            if(this.fromdata.orderNumber != ""){
                this.$message.warning("已有订单！不可重复生成")
            }else if(!this.fromdata.customerName || this.fromdata.customerName == ""){
                this.$message.warning("客户姓名不能为空！")
            }else if(!this.fromdata.customerPhone || this.fromdata.customerPhone == ""){
                this.$message.warning("客户电话不能为空！")
            }else if (this.maps == ""){
                this.$message.warning("地址不能为空！")
            }else{
                let params = {
                    serialNumber: 'SO'
                }
                getUUID(params).then(response => {
                    // this.fromdata = {};
                    this.fromdata.orderNumber = response.data;
                    this.customerdisabled = true;
                })
                .catch(error => {
                    console.log('公共接口生成编码：' + error);
                })
            }
        },
        // 点击提交
        handleSubmitnewproblems() {
            this.submitType = 1;
            if(this.buildingNumber == ""){
                this.$message.warning("请填写地址信息");
                return;
            }
            baiduMap(this.center.lng, this.center.lat).then(res=>{
                this.mapData = res;
              this.fromdata.customerAddressOne = {
                provinceId:Number(this.mapData.addressComponent.adcode.substring(0, 2) + "0000"),//provinceId  省
                cityId:Number(this.mapData.addressComponent.adcode.substring(0, 4) + "00"),//cityId  市
                areaId:Number(this.mapData.addressComponent.adcode),//areaId  区
                address : this.maps + "#" + this.buildingNumber +"#" + this.unitNumber + "#" +this.roomNumber,  //address
                longitude : this.center.lng, //经度
                latitude : this.center.lat  //纬度
              }
              this.fromdata.address = this.maps + "#" + this.buildingNumber +"#" + this.unitNumber + "#" +this.roomNumber;  //address
                this.submitnewproblems();
            })
        },
        //打开地图弹框
        openMap(){
            this.centerDialogVisible = true;
        },
        //地图搜索出来的红点点击事件
        infohtmlsets(poi) {
            this.poiObj = poi;
            this.center = poi.point;
        },
        //地图点击确认
        confirm() {
            if(this.poiObj.address == undefined){
                this.$message.warning("请通过地图搜索位置")
            }else{
                this.maps = this.poiObj.address +"_"+ this.poiObj.title;
                this.centerDialogVisible = false;
                this.keyword = "";
            }
        },
        //点击取消
        cancel() {
            this.centerDialogVisible = false;
            this.keyword = "";
        },
        // 提交问题
        submitnewproblems(){
            if(!this.fromdata.orderNumber){
                this.$message.warning("订单号不能为空！")
            }else if(!this.fromdata.customerName || this.fromdata.customerName == ""){
                this.$message.warning("客户姓名不能为空！")
            }else if(!this.fromdata.customerPhone || this.fromdata.customerPhone == ""){
                this.$message.warning("客户电话不能为空！")
            }else if (!this.fromdata.address || this.fromdata.address == ""){
                this.$message.warning("地址不能为空！")
            }else{
              let params = {
                serialNumber: 'QU'
              }
              getUUID(params)
                .then(response => {
                  let data = {
                    ...this.fromdata,
                    questionnaireNumber: response.data
                  }
                  if (this.submitType == 1) {
                    this.loadingBtn = true;
                    commitQuestionnaire(data).then(res =>{
                      if(res.status == 200){
                        this.$message.success('提交成功');
                        this.loadingBtn = false;
                        this.goBack();
                      } else {
                        this.$message.error(res.message || '提交失败');
                        this.loadingBtn = false;
                      }
                    }).catch(error => {
                        this.loadingBtn = false;
                      console.log('售后问题:新增问题 src/views/entrepotSet/aftermarket/aftersaleproblem/components/newproblems.vue-submitnewproblems:', error);
                    })
                  } else {
                    if (this.disposeKind  == '') {
                      this.$message.warning("请选择处理方式！");
                    } else if (this.disposeKind  == 3 && this.afterDutyGroupId ==''){
                      this.$message.warning("请选择售后责任部门！");
                    } else {
                      data.disposeKind = this.disposeKind;
                      data.afterDutyGroupId = this.afterDutyGroupId;
                      addQuestionnaire(data).then(res =>{
                        if(res.status == 200){
                          this.$message.success('处理成功');
                          this.goBack();
                        } else {
                          this.$message.error(res.message || '处理失败');
                        }
                      }).catch(error =>{
                        console.log('售后问题:新增问题 src/views/entrepotSet/aftermarket/aftersaleproblem/components/newproblems.vue-submitnewproblems:', error);
                      })
                    }
                  }
                })
                .catch(error => {
                  console.log('公共接口生成编码：' + error);
                })
            }
        }
    }
}
</script>
<style lang="scss">
.newproblems{
    .padd20{
        padding: 0px 70px 20px;
    }
    .demo_form_inline{
        display: flex;
        flex-wrap: wrap;
        justify-content: end;
        .widmax{
            width: 100%;
        }
        >div{
            width: 33%;

        }
    }
    .subclas{
        display: flex;
        justify-content: center;
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
}
</style>
