<template>
  <div class="customeradd" v-cloak>
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <el-card class="m-bottom">
        <div class="iconBox">
          <i class="Icon"></i>
          <span>客户编辑</span>
        </div>
        <div class="collapse_cell_div">
          <div class="collapse_input_cell_box">
            <span class="input_befor_text">
              <span class="colred">*</span>
              客户姓名：
            </span>
            <div class="input_after_div">
              <el-input placeholder="请输入客户姓名" v-model="bindInfo.customerName" maxlength="50"></el-input>
            </div>
          </div>
          <div class="collapse_input_cell_box">
            <span class="input_befor_text">
              <span class="colred">*</span>
              客户电话：
            </span>
            <div class="input_after_div">
              <el-input placeholder="请输入客户电话" v-model.trim="bindInfo.customerPhone" maxlength="50" :disabled="isreadonly"></el-input>
            </div>
          </div>

          <div class="collapse_input_cell_box">
            <span class="input_befor_text">备用电话：</span>
            <div class="input_after_div">
              <el-input placeholder="请输入备用电话" v-model.trim="bindInfo.otherPhone" maxlength="50"></el-input>
            </div>
          </div>
          <div class="collapse_input_cell_box">
            <span class="input_befor_text">性别：</span>
            <div class="input_after_div">
              <el-radio v-model="bindInfo.customerSex" label="1">男</el-radio>
              <el-radio v-model="bindInfo.customerSex" label="2">女</el-radio>
            </div>
          </div>
          <div class="collapse_input_cell_box">
            <span class="input_befor_text">年龄段：</span>
            <div class="input_after_div">
              <el-select v-model="bindInfo.ageGroupId" placeholder="请选择年龄段">
                <el-option v-for="item in styleAge" :key="item.id" :label="item.dictName" :value="item.id"></el-option>
              </el-select>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="m-bottom">
        <div class="collapse_cell_div">
          <!-- 查询条件组 -->
          <div class="warp_head_list">
            <div class="iconBox">
              <i class="Icon"></i>
              <span>客户地址</span>
            </div>
            <div class="head_nav_btn">
              <el-button type="primary" v-if="addShow" @click="addHandle">新增</el-button>
              <el-button type="default" @click="delAddress(checklist)">删除</el-button>
            </div>
          </div>
          <!-- 表格 -->
          <div class="table_list attribute lvs">
            <el-table border :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" :data="addressData">
              <el-table-column sortable align="center" type="selection" width="40"></el-table-column>
              <el-table-column sortable align="center" prop="id" label="操作" width="100">
                <template slot-scope="scope">
                  <span class="table_action_span" v-if="scope.row.add!==1" @click="editAddress(scope.row)">编辑</span>
                  <span class="table_action_span" @click="delAddressOne(scope.row)">删除</span>
                </template>
              </el-table-column>

              <el-table-column sortable align="center" prop="isDefault" label="是否默认" width="120">
                <template slot-scope="scope">
                  <div>
                    <p v-if="scope.row.isDefault == 1">是</p>
                    <p v-else>否</p>
                  </div>
                </template>
              </el-table-column>

              <el-table-column prop="add" label="地址">
                <template slot-scope="scope">
                  <div v-if="scope.row.add != 1">
                    {{scope.row.adddetails}}{{scope.row.addressArr?scope.row.addressArr[0]:''}} 楼号/区 {{scope.row.addressArr?scope.row.addressArr[1]:''}} 单元/号楼 {{scope.row.addressArr?scope.row.addressArr[2]:''}} 室
                  </div>
                  <div v-else class="table_edit_column">
                    <div class="input_box_input">
                      <el-input placeholder="地图定位" v-model="maps" readonly @focus="maplocation" :title="maps"></el-input>
                    </div>
                    <div class="input_box">
                      <el-input placeholder="楼号/区" v-model="buildingNumber"></el-input>
                      <div class="input_box_lou">楼号/区</div>
                    </div>
                    <div class="input_box">
                      <el-input placeholder="单元/号楼" v-model="unitNumber"></el-input>
                      <div class="input_box_lou">单元/号楼</div>
                    </div>
                    <div class="input_box">
                      <el-input placeholder="室" v-model="roomNumber"></el-input>
                      <div class="input_box_lou">室</div>
                    </div>
                    <div class="input_box">
                      <el-checkbox v-model="isAddressDefault" value="false">是否默认</el-checkbox>
                    </div>
                    <div>
                      <span class="saveHandle_class" @click="saveHandle()">提交</span>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination_wrap">
              <pagination :current-page="currentPage" :pageSize="pageSize" :total="total" @sizeChange="sizeChange" @currentChange="currentChange"></pagination>
            </div>
          </div>
        </div>
      </el-card>
      <el-card>
        <div class="bottom_box">
          <div class="bottom_form">
            <div class="collapse_input_cell_box_area">
              <div class="input_befor_text">客户来源：</div>
              <div class="disflex">
                <el-select v-model="bindInfo.customerSourceId" placeholder="请选择客户来源" @change="storeSourceChange">
                      <el-option v-for="item in styleList" :key="item.value"
                          :label="item.sourceName" :value="item.storeSourceId">
                      </el-option>
                  </el-select>
                  <el-select v-model="bindInfo.storeSourceId" placeholder="请选择" v-if="storeSourceIdList.length">
                      <el-option v-for="item in storeSourceIdList" :key="item.value"
                          :label="item.sourceName" :value="item.storeSourceId">
                      </el-option>
                  </el-select>
                  <el-select v-model="companyId" placeholder="选择渠道商" size="medium" v-if="sourceswath == 50 || sourceswath == 51 || sourceswath == 52">
                      <el-option v-for="item in channellist" :key="item.value"
                          :label="item.companyName" :value="item.companyId">
                      </el-option>
                  </el-select>
                  <div class="labclas" v-if="sourceswath == 2">
                    <span>组织机构</span>
                    <el-input size="medium" v-model="showStoreName" @focus="openDia" placeholder="请选择组织机构"></el-input>
                  </div>
                  <div class="labclas" v-if="sourceswath == 2">
                    <span class="daogouclass">人员</span>
                    <el-select v-model="bindInfo.insideReferee" placeholder="请选择人员" v-if="sourceswath == 2">
                        <el-option v-for="item in userList" :key="item.id"
                          :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                  </div>
                  <el-input v-if="sourceswath == 53" maxlength="10" placeholder="请输入10字以内" v-model="otherChannel"></el-input>
                  <div><el-button v-if="sourceswath == 3" type="primary" size="mini" @click="addrem" class="addrem m-right20">新 增</el-button></div>
                  <div class="labclas" v-if="sourceswath == 3">
                    <span>外部推荐人</span>
                    <el-input size="medium" @focus="openredia" v-model="externalReferee" placeholder="外部推荐人"></el-input>
                  </div>
                  <div class="labclas" v-if="sourceswath == 3">
                    <span>推荐人所属公司</span>
                    <el-input v-if="sourceswath == 3" size="medium" disabled v-model="externalRecommendCompany" placeholder="推荐人所属公司"></el-input>
                  </div>
                  <div class="labclas" v-if="sourceswath == 3">
                    <span>手机</span>
                    <el-input v-if="sourceswath == 3" size="medium" disabled v-model="externalRecommendPhone" placeholder="手机"></el-input>
                  </div>
              </div>
            </div>
            <!-- 备注 -->
            <div class="collapse_input_cell_box_area" style="margin: 20px 0 20px 0;">
              <span class="input_befor_text">备注：</span>
              <div class="input_after_div">
                <el-input type="textarea" v-model="bindInfo.customerDesc" maxlength="50"></el-input>
              </div>
            </div>
          </div>

          <div class="foot_btn_box">
            <el-button type="primary" @click="sendJava()">提交</el-button>
            <el-button @click="cancelCustomer">取 消</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 地图弹框 -->
    <el-dialog title="地图" :visible.sync="centerDialogVisible" v-if="centerDialogVisible" custom-class="customDialogTitle" width="58%">
      <baidu-map class="map" :center="center" :zoom="15" :keyboard="true" :scroll-wheel-zoom="true" :double-click-zoom="true">
        <bm-marker :position="center" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <bm-control>
          <input type="text" v-model="keyword" placeholder="请输入搜索关键字" class="map_input"/>
          <bm-local-search class="map_searchinfo" :keyword="keyword" :auto-viewport="true" @infohtmlset = "infohtmlsets" :panel="true"></bm-local-search>
        </bm-control>
      </baidu-map>
      <div slot="footer" style="margin-top: 0px;">
        <el-button @click="cancel" class="el-button--medium" type="primary" size="medium">取消</el-button>
        <el-button @click="confirm" class="button-fc" type="warning" size="medium">确定</el-button>
      </div>
    </el-dialog>
    <!-- 门店列表弹框 -->
    <storedia :visible="store_visible" v-if="store_visible" @close_store="closeStore"></storedia>

    <!-- 所属机构组件 -->
    <organizationdia :visible="organizationdia_vis" v-if="organizationdia_vis" :defaultOpenArr="defaultOpenArr" @close_org="closetree"></organizationdia>

    <!-- 推荐人弹框 -->
    <recommenderdia :visible="re_visible" v-if="re_visible" @add_recomm="addrecomm" @close_recomm="closerecomm"></recommenderdia>
  </div>
</template>


<script>
import pagination from "@/views/components/pagination";
import organizationdia from "@/views/systemcenter/department/components/organizationdia";
import breadcrumb from "@/views/components/breadcrumb";
import { baiduMap } from "src/api/pulicJava.js";
import recommenderdia from "@/views/customermanagement/myclient/components/recommenderdia"; //外部推荐人弹框组件
import storedia from "@/views/customermanagement/myclient/components/storedia"; //门店弹框组件
import { getUUID } from "api/pulicJava";//生成编码 
import { 
    listOrganizationStaff,//获取组织机构人员
} from 'api/order/order/order';
import { 
    listParentOrganizedId, // 组织机构 根据当前节点获取所有父节点（含自己）
} from 'api/pulicJava';
    
import { listStore, listStoreUser } from "api/common/common";
import {
  listBaseDict, //字典
  listCompanyByAll
} from 'api/order/order/order';
import {
  insertCustomer,
  getCustomerInfo,
  listCustomerAddress,
  updateCustomerAddress,
  insertCustomerAddress,
  updateCustomerInfo //编辑客户信息——提交信息
} from "api/customermanagement/myclient/myclient";

import { listStoreSource } from '@/api/systemcenter/storemanagement';

export default {
  components: {
    pagination,
    recommenderdia, //外部推荐人弹框组件
    storedia, //门店弹框组件
    breadcrumb,
    organizationdia,
  },
  // name: 'brandmanagement',
  data() {
    return {
      channellist: [],
      companyId: "",
      organizationdia_vis: false,//组织机构
      defaultOpenArr: [], //组织机构默认展开的数组
      customerId: "", //客户id
      mapText: "",
      currentPage: 1,
      pageSize: 10,
      total: 1,
      customerAddressId: "", //客户地址id  编辑客户地址信息时使用
      changeAddress: "", //判断是编辑还是修改地址信息
      // 百度地图
      centerDialogVisible: false,
      keyword: "",
      center: { lng: 116.404, lat: 39.915 }, //经纬度
      indexAdd: 0,
      editAddressIndex: "",
      // 百度地图


      re_visible: false, //推荐人弹框是否显示
      store_visible: false, //门店弹框是否显示
      showStoreName: "",
      storeList: [],
      storeName: "",
      storeNumber: "",
      externalReferee: "", //外部推荐人姓名
      externalRecommendCompany: "", //外部推荐人公司
      externalRecommendPhone: "", //外部推荐人电话
      userList: [],//来源列表
      storeSourceIdList: [],//二级来源列表
      otherChannel: "",//其他渠道备注

      //头部面包屑导航
      navList: [],
      bindInfo: {
        insideReferee: "",//人员
        customerName: "",//客户姓名
        customerPhone: "",//客户电话
        customerSex: "",//客户性别
        otherPhone: "",//客户备注电话
        ageGroupId: "",//年龄段
        customerDesc: "",//备注
        customerSourceId: "",
        storeSourceId: "",
      }, //新增数据
      maps: "", //地图信息
      addShow: true,

      //imglogosrc
      imglogosrc: "",
      //文件上传
      upLoadList: [],

      tabList: [],
      storeList: [],
      storeUserList: [],
      //状态查询
      statuestyle: "",
      statueage: "",
      sourceswath: "",
      styleList: [],
      //年龄段
      styleAge: [],
      //分页
      currentPage3: 1,
      totle: 100,
      //查询内容
      searchtext: "",
      readonly: true, //只读
      addressData: [],
      isAddressDefault: "", //添加地址是否默认
      checklist: [],
      buildingNumber: "", //楼号
      unitNumber: "", //单元
      roomNumber: "", //室
      mapData: {},
      poiObj:{},
      isreadonly: false
    };
  },
  mounted() {
    this.getSource();//获取客户来源 
    this.getageList();//字典获取年龄下拉
    this.navList = this.$route.meta;
    if (this.$route.query.ids) {
      this.getAddress();//获取地址列表
      //获取客户信息
      let data = {
        storeCustomerId: this.$route.query.ids
      };
      this.isreadonly = true;
      getCustomerInfo(data)
        .then(res => {
          let datas = res.data;
          this.bindInfo.customerName = datas.customerName;//客户姓名
          this.bindInfo.customerPhone = datas.customerPhone;//客户电话
          this.bindInfo.customerSex = datas.customerSex+"";//客户性别
          this.bindInfo.otherPhone = datas.otherPhone;//客户备用电话
          this.bindInfo.ageGroupId = datas.ageGroupId ? Number(datas.ageGroupId) : "";//年龄段
          this.bindInfo.customerDesc = datas.customerDesc;//备注
          if(res.data.map){
            this.bindInfo.customerSourceId = res.data.map.customerSourcePid*1
            this.getSource(res.data.map.customerSourcePid*1)
            this.bindInfo.storeSourceId = res.data.map.customerSourceId*1
            if (this.bindInfo.customerSourceId == 2) {
              // this.getStoreUser(datas.map.organizationId);
              this.listOrganizaFun(datas.map.organizationId);
              this.showStoreName = datas.map.organizationName;
              this.bindInfo.insideReferee = datas.insideReferee;
              let data = {
                organizedId:datas.map.organizationId
              }
              listParentOrganizedId(data).then(res=>{
                this.defaultOpenArr =res.data.split(',').map(item=>{
                  return Number(item);
                }).sort(function(a, b) {
                  return a - b;
                })
              })
            }else if(this.bindInfo.customerSourceId == 3){
              this.externalReferee = datas.map.externalReferee
              this.externalReferee = datas.map.externalRecommendCompany;
              this.externalRecommendCompany = datas.map.externalRecommendCompany;
              this.externalRecommendPhone = datas.map.externalRecommendPhone;
            }else if(this.bindInfo.customerSourceId == 50 || this.bindInfo.customerSourceId == 51 || this.bindInfo.customerSourceId == 52){
              this.companyId = datas.map.companyId
            }else if(this.bindInfo.customerSourceId == 53){
              this.otherChannel = datas.map.otherChannel
            }
          }

          console.log(res.data,"客户回显信息");
          
        })
        .catch(error => {
          console.error(error);
        });
    }
    
    //渠道商
    listCompanyByAll({companyType: 1}).then(res =>{
        if(res.status == 200){
            console.log(res,"渠道商列表");
            this.channellist = res.data;
        }
    }).catch(error =>{
        console.log('订单管理:获取门店列表 order/justOrder/addJustOrder.vue', error);
    })
  },
  methods: {
    //跳转推荐人新增页面
    addrem() {
      this.$confirm("是否跳转新增推荐人页面?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$router.push({ path: "/recommender/addrecommender" });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消新增推荐人"
          });
        });
    },

    //获取年龄段字典内容
    getageList(){
      let data = {
        dataType:"AGE_GROUP"
      }
      listBaseDict(data).then(res=>{
        this.styleAge = res.data;
      })
    },

    //获取订单来源
    getSource(val){
      // 订单来源
        listStoreSource({pid: 0,page: 1,limit: 99}).then(res =>{
            if(res.status == 200){
                this.styleList = res.data.rows;
                if(val){
                  this.storeSourceChange(val, true);
                }else{
                  // this.storeSourceChange(1);
                }
            }
        }).catch(error =>{
            console.log('订单管理:基础字典查询订单来源 order/justOrder/addJustOrder.vue', error);
        })
    }, 
    // 获取订单来源二级
    storeSourceChange(val, bools){
        if(!bools){
          this.bindInfo.storeSourceId = ""//清空二级来源id
          this.showStoreName = ""//请选择门店
          this.bindInfo.insideReferee = ""//导购人
          this.externalReferee = ""//外部推荐人
          this.externalRecommendCompany = ""//推荐人所属公司
          this.externalRecommendPhone = ""//手机
          this.otherChannel = ""//其他渠道备注
          this.storeSourceIdList = []
        }
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
    //勾选一个推荐人   然后选择确认按钮  将所选推荐人信息填进页面
    addrecomm(obj) {
      this.re_visible = false;
      console.log(obj);
      this.bindInfo.externalReferee = obj.referrerId;
      this.externalReferee = obj.referrerName;
      this.externalRecommendCompany = obj.companyName;
      this.externalRecommendPhone = obj.phone;
    },

    //关闭推荐人弹框
    closerecomm() {
      this.re_visible = false;
    },
    //打开推荐人弹框
    openredia() {
      this.re_visible = true;
    },

    //打开门店列表弹出层
    openDia() {
      this.organizationdia_vis = true;
    },

    //关闭门店列表弹出层    有val说明有选择门店  根据门店id获取门店下面导购人
    // closeStore(val) {
    //   if (val) {
    //     this.showStoreName = val.storeName;
    //     this.bindInfo.insideRecommendStore = val.storeId;
    //     this.bindInfo = { ...this.bindInfo, insideReferee: "" }; //清空导购人选中内容
    //     this.organizationdia_vis = false;
    //     // this.getStoreUser(val.storeId);
    //   } else {
    //     this.organizationdia_vis = false;
    //   }
    // },
    //关闭组织机构树弹框
    closetree(obj, arr) {
      console.log(arr);
      if (obj) {
          this.bindInfo.insideReferee = ""
          this.showStoreName = obj.label;//展示在页面用的组织机构的名字
          this.bindInfo.insideRecommendStore = obj.id;
          this.defaultOpenArr = arr;
          this.listOrganizaFun(obj.id);
      }
      this.organizationdia_vis = false;
    },

    //根据组织机构id获取工人列表
    listOrganizaFun(id){
      let data = {
          organizationId: id
      }
      listOrganizationStaff(data).then(res => {
          console.log(res);
          if (res.status == "200") {
              this.userList = res.data.staff;
          }
      }).catch(error => {
          console.error("获取人员列表  -----  customermanagementcustomerqueryCustomerSharing",error);
      });

    },
    //根据门店id获取门店导购人
    // getStoreUser(id) {
    //   let data = {
    //     storeId: id
    //   };
    //   listStoreUser(data)
    //     .then(res => {
    //       if (res.status == "200") {
    //         this.userList = res.data;
    //       } else {
    //         this.$message.error("获取门店负责人失败");
    //       }
    //     })
    //     .catch(error => {
    //       console.error(
    //         "获取门店人员列表  -----  customermanagementcustomerqueryCustomerSharing",
    //         error
    //       );
    //     });
    // },
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

    //弹出地图层
    maplocation() {
      this.centerDialogVisible = true;
    },
    //退回按钮
    cancelCustomer() {
      this.$router.go(-1);
    },
    verification(){
      if (!/^[0-9\-\/]{8,11}$/.test(this.bindInfo.customerPhone)) {
        this.$message.error("手机号码格式输入有误");
        return false;
      } else if (this.bindInfo.customerName=="") {
        this.$message.error("姓名不能为空");
        return false;
      }else{
        return true;
      }
    },
    sendJava() {
      if(this.bindInfo.otherPhone&&this.bindInfo.otherPhone.length>11){
        this.$message.warning("备用电话长度不能超过11位")
        return ;
      }
      let reg = /^(\d{8}|\d{11})$/g;
      if(!reg.test(this.bindInfo.customerPhone)){
        this.$message.error('当前电话只能是8位或者11位');
        return
      }
      // 判断二级来源有的时候赋值二级来源
      if(this.bindInfo.storeSourceId != ""){
        this.bindInfo.customerSourceId = this.bindInfo.storeSourceId
      }else{
        this.bindInfo.customerSourceId = this.bindInfo.customerSourceId
      }
      if(this.sourceswath == 53){
        this.bindInfo.otherChannel = this.otherChannel
      }
      if(this.sourceswath == 50 || this.sourceswath == 51 || this.sourceswath == 52){
        this.bindInfo.companyId = this.companyId
      }
      //提交数据
      if (this.$route.query.ids) {
        if (this.bindInfo.customerName == "") {
          this.$message.error("姓名格式输入有误");
          return false;
        } else {
          this.bindInfo.customerAddresses = this.addressData;
          this.bindInfo.storeCustomerId = this.$route.query.ids;
          updateCustomerInfo(this.bindInfo)
            .then(res => {
              if (res.status == 200) {
                this.$router.go(-1);
              } else {
                this.$message.error(res.message);
              }
            })
            .catch(error => {});
        }
      } else {
        //新增客户
        if(this.verification()) {
          this.bindInfo.storeId = JSON.parse(window.localStorage.getItem("activeStoreId")).storeId,
          this.bindInfo.customerAddresses = this.addressData;
          if (this.$route.query.id !== undefined) {
            this.bindInfo.storePassengerFlowId = this.$route.query.id;
          }
          console.log(this.bindInfo,"提交客户信息参数");
          new Promise((resolve, reject) => {
            getUUID({ serialNumber: "C" }).then(res => {
              resolve(res);
            });
          }).then(res => {
            this.bindInfo.customerCode = res.data;
            insertCustomer(this.bindInfo).then(res => {
              if (res.status == 200) {
                this.$router.go(-1);
              } else {
                this.$message.error(res.message);
              }
            }).catch(error => {});
          });
        }
      }
    },
    //勾选函数回调
    handleSelectionChange(val) {
      this.checklist = val;
    },
    //编辑地址信息
    editAddress(val) {
      this.changeAddress = "编辑";
      this.centerDialogVisible = true;
      if (this.addShow) {
        this.addressData.push({ add: 1 });
        this.buildingNumber = val.addressArr[0];
        this.unitNumber = val.addressArr[1];
        this.roomNumber = val.addressArr[2];
        this.maps = val.adddetails
        this.center = {};
        this.center.lng = val.longitude;
        this.center.lat = val.latitude;
        this.customerAddressId = val.customerAddressId;
        this.editAddressIndex = val.indexAdd;
        this.isAddressDefault = val.isDefault == 1 ? true : false;
      } else {
        this.$message.error("提交完当前编辑项后才能进行其他数据的编辑操作");
      }
      this.addShow = false;
    },

    //新增地址
    addHandle() {
      this.addressData.push({ add: 1 });
      this.changeAddress = "新增";
      this.addShow = false;
      this.centerDialogVisible = true;
    },

    //批量删除
    delAddress(val) {
      //如果有客户id  删除数据库中数据
      if (this.$route.query.ids) {
        if (val.length == "0") {
          this.$message.error("请勾选后再进行批量操作");
        } else {
          if (val[val.length - 1].add == undefined) {
            //选中数据都是对象
          } else {
            //选中最后的一项是删除的操作框
            this.addressData.splice(this.addressData.length - 1, 1);
            this.addShow = true;
            this.mapData = {};
            this.buildingNumber = "";
            this.unitNumber = "";
            this.roomNumber = "";
            this.isAddressDefault = false;
            this.center = { lng: 116.404, lat: 39.915 };
            this.keyword = "";
            this.maps = "";
          }

          let arr = val.filter(item => {
            return !item.add;
          });

          arr = arr.map(item => {
            return item.customerAddressId;
          });
          let data = {
            customerAddressIds: arr,
            isDelete: 1
          };
          console.log(data);
          updateCustomerAddress(data)
            .then(res => {
              if (res.status == "200") {
                this.$message.success("删除数据成功");
                this.getAddress();
              } else {
                this.$message.error("删除数据失败");
              }
            })
            .catch(error => {
              console.error(
                "客户地址_删除 customermanagementmyclientcustomeradd",
                error
              );
            });
        }
      } else {
        //没有客户id  删除本地储存的地址信息  根据indexadd删除
        if (val.length == "0") {
          this.$message.error("勾选地址后再进行删除操作");
        } else {
          // this.addressData.splice(this.addressData.length-1,1)

          for (var j = 0; j < val.length; j++) {
            for (var i = 0; i < this.addressData.length; i++) {
              if (val[j].indexAdd) {
                if (val[j].indexAdd === this.addressData[i].indexAdd) {
                  this.addressData.splice(i, 1);
                }
              } else {
                if (val[j].add === this.addressData[i].add) {
                  this.addressData.splice(i, 1);
                  this.mapData = {};
                  this.buildingNumber = "";
                  this.unitNumber = "";
                  this.roomNumber = "";
                  this.isAddressDefault = false;
                  this.center = { lng: 116.404, lat: 39.915 };
                  this.keyword = "";
                  this.maps = "";
                }
              }
            }
          }

          this.$message.success("批量删除数据成功");
          this.checklist = [];
          this.addShow = true;
        }
      }
    },
    //单个删除
    delAddressOne(val) {
      //如果有客户id  删除数据库中数据
      if (this.$route.query.ids) {
        if (val.add == undefined) {
          console.log(val);
          let arr = [];
          arr.push(val.customerAddressId);
          let data = {
            customerAddressIds: arr,
            isDelete: 1
          };
          console.log(data);
          updateCustomerAddress(data)
            .then(res => {
              if (res.status == "200") {
                this.$message.success("删除数据成功");
                this.getAddress();
              } else {
                this.$message.error("删除数据失败");
              }
            })
            .catch(error => {
              console.error(
                "客户地址_删除 customermanagementmyclientcustomeradd",
                error
              );
            });
        } else {
          this.addressData.splice(this.addressData.length - 1, 1);
          this.addShow = true;
        }
      } else {
        //没有客户id  删除本地储存的地址信息  根据indexadd删除
        console.log(this.addShow);
        if (this.addShow) {
          this.addressData.splice(val.indexAdd, 1);
        } else {
          //console.log("删除最后");
          this.addressData.splice(this.addressData.length - 1, 1);
          this.mapData = {};
          this.buildingNumber = "";
          this.unitNumber = "";
          this.roomNumber = "";
          this.isAddressDefault = false;
          this.center = { lng: 116.404, lat: 39.915 };
          this.keyword = "";
          this.maps = "";
          this.addShow = true;
        }
      }
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },

    //获取客户地址
    getAddress() {
      let data = {
        customerId: this.$route.query.customerId,
        page:this.currentPage,
        limit:this.pageSize
      };
      listCustomerAddress(data)
        .then(res => {
          if(res.status==200){
            this.addressData = res.data.rows;
            this.total = res.data.total;
            for (let i = 0; i < this.addressData.length; i++) {
              let start;
              if(this.addressData[i].address){
                start = this.addressData[i].address.indexOf("#");
                this.addressData[i]["adddetails"] = this.addressData[i].address.substring(0, start);
                this.addressData[i]["addressArr"] = this.addressData[i].address.substring(start + 1).split("#");
              }
            }
          }
        })
        .catch(error => {
          console.error(
            "客户地址_获取列表 customermanagementmyclientcustomeradd",
            error
          );
        });
    },

    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getAddress();
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getAddress();
    },
    //提交地址
    saveHandle() {
      if(this.buildingNumber == "" || this.unitNumber == "" || this.roomNumber == ""){
        this.$message.warning("请填写楼号，单元号，门牌号");
        return;
      }
      if(this.maps == "" ){
        this.$message.warning("请根据地图搜索位置选地址");
        return;
      }
      new Promise((resolve, reject)=>{
        baiduMap(this.center.lng, this.center.lat).then(res => { 
          resolve(res)
        })
      }).then(res=>{
          this.mapData = res;
          this.addressHandle();//提交处理地图的数据
      })
    },
    //提交处理地图的数据
    addressHandle(){
      //如果有客户id时  直接根据客户id添加地址信息到后台数据
      if (this.$route.query.ids) {
        this.addressData.splice(this.addressData.length - 1, 1);
        this.addShow = true;
        if (this.changeAddress == "新增") {
          let str = this.maps + "#" + this.buildingNumber +"#" + this.unitNumber + "#" +this.roomNumber;
          let data = {
            customerId: this.$route.query.customerId,
            storeCustomerId: this.$route.query.ids,
            provinceId: Number(this.mapData.addressComponent.adcode.substring(0, 2) + "0000"),
            cityId:this.mapData.addressComponent.adcode.substring(0, 4) + "00",
            areaId: Number(this.mapData.addressComponent.adcode),
            address: str,
            longitude: this.center.lng,
            latitude: this.center.lat,
            isDefault: this.isAddressDefault ? 1 : 0
          };
          insertCustomerAddress(data)
            .then(res => {
              if (res.status == "200") {
                this.$message.success("添加地址成功");
                this.getAddress();
                this.addressData.splice(this.addressData.length - 1, 1);
                this.mapData = {};
                this.poiObj = {};
                this.keyword = "";
                this.buildingNumber = "";
                this.unitNumber = "";
                this.roomNumber = "";
                this.isAddressDefault = false;
                this.addShow = true;
              } else {
                this.$message.error("添加地址失败");
              }
            })
            .catch(error => {
              console.error(
                "客户地址_新增 customermanagementmyclientcustomeradd",
                error
              );
            });
        } else {
          let str = this.maps + "#" + this.buildingNumber +"#" + this.unitNumber + "#" +this.roomNumber;
          let arr = [];
          arr.push(this.customerAddressId);
          let data = {
            customerId: this.$route.query.customerId,
            storeCustomerIds: this.$route.query.ids,
            provinceId: parseInt(
              this.mapData.addressComponent.adcode.substring(0, 2) + "0000"
            ),
            cityId: parseInt(
              this.mapData.addressComponent.adcode.substring(0, 4) + "00"
            ),
            areaId: parseInt(this.mapData.addressComponent.adcode),
            address: str,
            longitude: this.center.lng,
            latitude: this.center.lat,
            customerAddressIds: arr,
            isDefault: this.isAddressDefault ? 1 : 0
          };
          updateCustomerAddress(data)
            .then(res => {
              if (res.status == "200") {
                this.$message.success("编辑地址成功");
                this.addShow = true;
                this.isAddressDefault = false;
                this.getAddress();
                this.addressData.splice(this.addressData.length - 1, 1);
                this.mapData = {};
                this.poiObj = {};
                this.isAddressDefault = false;
                this.unitNumber = "";
                this.roomNumber = "";
                this.buildingNumber = "";
                this.center = { lng: 116.404, lat: 39.915 };
                this.keyword = "";
                this.addShow = true;
              }
            })
            .catch(error => {
              console.error(
                "客户地址_编辑 customermanagementmyclientcustomeradd",
                error
              );
            });
        }
      } else {
        // 如果没有客户id时  为新增用户时添加的地址  将客户地址信息存储到本地数据中   点击发送按钮时一起传给后台
        if (this.changeAddress == "新增") {
          this.addressData.splice(this.addressData.length - 1, 1);
          let str = this.maps + "#" + this.buildingNumber +"#" + this.unitNumber + "#" +this.roomNumber;
          let localAddress = {
            provinceId: Number(
              this.mapData.addressComponent.adcode.substring(0, 2) + "0000"
            ),
            cityId:
              this.mapData.addressComponent.adcode.substring(0, 4) + "00",
            areaId: Number(this.mapData.addressComponent.adcode),
            address: str,
            longitude: this.center.lng,
            latitude: this.center.lat,
            indexAdd: this.indexAdd++,
            isDefault: this.isAddressDefault ? 1 : 0
          };
          if (localAddress.isDefault == 1) {
            this.addressData.forEach(item => {
              item.isDefault = 0;
            });
          }
          //console.log(localAddress);
          this.addressData.push(localAddress);

          for (let i = 0; i < this.addressData.length; i++) {
            let start;
            start = this.addressData[i].address.indexOf("#");
            this.addressData[i]["adddetails"] = this.addressData[i].address.substring(0, start);
            this.addressData[i]["addressArr"] = this.addressData[i].address.substring(start + 1).split("#");
          }
          console.log(this.addressData);
          this.addShow = true;
          this.mapData = {};
          this.poiObj = {};
          this.isAddressDefault = false;
          this.buildingNumber = "";
          this.unitNumber = "";
          this.roomNumber = "";
          this.center = { lng: 116.404, lat: 39.915 };
          this.keyword = "";
          // this.addressData.push(localAddress)
          // console.log(addressData);
        } else {
          this.addressData.splice(this.addressData.length - 1, 1);
          let str = this.maps + "#" + this.buildingNumber +"#" + this.unitNumber + "#" +this.roomNumber;
          let localAddress = {
            provinceId: Number(
              this.mapData.addressComponent.adcode.substring(0, 2) + "0000"
            ),
            cityId:
              this.mapData.addressComponent.adcode.substring(0, 4) + "00",
            areaId: Number(this.mapData.addressComponent.adcode),
            address: str,
            longitude: this.center.lng,
            latitude: this.center.lat,
            indexAdd: this.indexAdd++,
            isDefault: this.isAddressDefault ? 1 : 0
          };
          if (localAddress.isDefault == 1) {
            this.addressData.forEach(item => {
              item.isDefault = 0;
            });
          }
          console.log(localAddress);
          this.addressData.splice(this.editAddressIndex, 1, localAddress);
          for (let i = 0; i < this.addressData.length; i++) {
            let start;
            start = this.addressData[i].address.indexOf("#");
            this.addressData[i]["adddetails"] = this.addressData[
              i
            ].address.substring(0, start);
            this.addressData[i]["addressArr"] = this.addressData[i].address
              .substring(start + 1)
              .split("#");
          }
          this.addShow = true;
          this.mapData = {};
          this.buildingNumber = "";
          this.unitNumber = "";
          this.roomNumber = "";
          this.center = { lng: 116.404, lat: 39.915 };
          this.keyword = "";
          this.isAddressDefault = false;
        }
      }
    },
  },
};
</script>
<style scoped lang="scss">
.customeradd{

  .pagination_wrap {
    text-align: center;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .collapse_cell_div {
    display: flex;
    overflow: hidden;
    flex-wrap: wrap;
    padding: 10px 0;
  }
  .warp_head_list {
    justify-content: space-between;
    width: 100%;
  }
  .map {
    width: 100%;
    height: 400px;
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
  .table_edit_column {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    .input_box_input{
      flex: 2;
    }
    .input_box {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      text-align: center;
      flex: 1;
      .input_box_lou {
        min-width: 68px;
        margin-left: 10px;
      }
    }
  }


  .collapse_cell_div .ImgBox {
    width: 100%;
    display: flex;
    margin-bottom: 10px;
  }
  .collapse_input_cell_box {
    display: flex;
    flex-wrap: nowrap;
  }
  .collapse_input_cell_box_area {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    .input_after_div {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
      .input_after_div_right {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        .input_after_div_right_no {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
        }
      }
    }
  }
  .collapse_input_cell_box_area .input_after_div {
    width: 84%;
  }
  .el-input {
    flex: 1;
    width: 80%;
  }

  .collapse_input_cell_box {
    width: 50%;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    height: 50px;
  }
  .collapse_input_cell_box .input_befor_text {
    width: 8em;
  }
  .collapse_input_cell_box .input_after_div {
    flex: 1;
  }
  .table_list {
    width: 100%;
    margin-top: 10px;
  }
  .head_nav_search_t {
    margin-right: 20px;
    display: flex;
    align-items: center;
  }
  .head_nav_select_t {
    margin-right: 20px;
    display: flex;
    align-items: center;
  }
  .input_befor_text {
    width: 120px;
    text-align: right;
    .colred{
      color: red;
    }
  }
  .foot_btn_box {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .collapse_input_cell_box_area .input_after_div {
    width: 88%;
  }
  .el-collapse-item__header {
    background-color: #dddddd;
    padding: 0 10px;
  }
  .table_edit_column .input_box .el-input {
    width: 60%;
  }
  .table_edit_column .input_box:first-child .el-input {
    width: 90%;
  }
  .saveHandle_class {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #fff;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: 0.1s;
    transition: 0.1s;
    font-weight: 500;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    background-color: #409eff;
    border-color: #409eff;
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
      .labclas{
        display: flex;
        align-items: center;
        >span{
          display: block;
          white-space: normal;
          margin-right: 5px;
        }
        .daogouclass{
          width: 50px;
        }
      }
  }
}
</style>
