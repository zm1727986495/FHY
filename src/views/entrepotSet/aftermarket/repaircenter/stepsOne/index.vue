<template>
  <div class="stepsOne">
    <!-- 查询条件组 -->
    <!-- :scroll-wheel-zoom="true"    /// 地图是否启用滚轮缩放-->
    <!-- keyboard键盘操作上下左右  double-click-zoom双击地图缩放 -->
    <baidu-map class="baidumap" :center="center" :zoom="12" :keyboard="true" :scroll-wheel-zoom="true" :double-click-zoom="false" v-if="mapShow">
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <bm-point-collection :points="points" shape="BMAP_POINT_SHAPE_SQUARE" color="red" size="BMAP_POINT_SIZE_BIG" 
      @click="clickHandler" @mouseover="mouseoverHandler"></bm-point-collection>
      <bm-info-window :position="position" title="订单信息" :height="0" :show="infoWindow.show" @close="infoWindowClose">
        <p v-html="infoWindow.contents" style="height:100px;"></p>
      </bm-info-window>
    </baidu-map>


    <!-- 按钮组 -->
    <div class="btn_list">
      <div v-for="(item,index) in actionBtnList" :key="index" >
        <el-button v-if="btnJurisdiction[item.codename]" type="default" size="small" class="button-96 m-left10 m-top5" @click="butGroupActions(item.id)">{{item.name}}</el-button>
      </div>
    </div>

    <!-- 转 单dia -->
    <orderchangedia v-if="orderchangedia_vis" :visible="orderchangedia_vis" :elsectVal="elsectVal" @close_order="closeAll" @getList_fun="getListfun"></orderchangedia>

    <!-- 转单撤回 -->
    <el-dialog :visible.sync="isWithdrawal" width="50%" :before-close="handleClose">
      <div class="titlecals">撤回转单</div>

      <withdrawal v-if="isWithdrawal" :installationType="installationType" ref="withdrawal"></withdrawal>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="determine">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 驳 回dia -->
    <rejectorder :isRejectorder="rejectdia_vis" :rejectData="rejectData" @closeall="closeAll"></rejectorder>

    <!-- 协同单查询 -->
    <el-dialog title="查看协同订单" :visible.sync="collabodia_vis" v-if="collabodia_vis" width="50%" :before-close="handleClose" custom-class="customDialogTitle">
      <collaborationsheet v-if="collabodia_vis" :choseArr="elsectVal"></collaborationsheet>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 预 约dia  -->
    <appointdia ref="appointdia" :visible="appointdia_vis" v-if="appointdia_vis" :customerName='customerName' :customerPhone='customerPhone' :elsectVal="elsectVal" @close_appoint="closeAll"></appointdia>

    <!-- 到货状态 -->
    <arrivalstatus :isArrivalstatus="isArrival_vis" :elsectVal="elsectVal" @closeall="closeAll"></arrivalstatus>

    <!-- 返厂 -->
    <returnfactory v-if="isReturnfactory" :isReturnfactory="isReturnfactory" :choseArr="elsectVal" @handleClose="closeAll"></returnfactory>

    <!-- table表格 -->
    <div class="table_list lvs attribute m-top20" v-loading='loading'>
      <el-table id="pathtabs_table1" ref="multipleTable" border :row-class-name="tableRowClassName" :max-height="maxHeight"
      @selection-change="handleSelectionChange" :data="tabList" style="width: 100%;">
        <el-table-column type="selection" fixed='left' width="40"></el-table-column>
        <el-table-column prop="purchaseContractCode" label="采购合同号" width="180" sortable fixed='left' align="center">
          <template slot-scope="scope">
            <div>
              <el-tooltip placement="right" visible-arrow>
                <div slot="content" class="tips tipFon">
                  <p class="operaItems" @click="info1(scope.row)">查看</p>
                  <p class="operaItems" @click="reject(scope.row)">驳回</p>
                  <p class="operaItems" @click="phoneFun(scope.row)">电话指导完成</p>
                </div>
                <img :src="spot" alt class="attributesTips" />
              </el-tooltip>
              <p class="table_action_span" @dblclick="info2(scope.row)">{{scope.row.purchaseContractCode}}</p>
            </div>
          </template>
        </el-table-column>


        <el-table-column prop="purchaseContractCode" label="订单标识" width="340" align="center">
          <template slot-scope="scope">
            <div>
              <i class="labelicon_1 labe_lI" v-if="scope.row.isSpeed=='1'">急</i>
              <i class="labelicon_2" v-if="scope.row.orderIsSpeed=='1'">急</i>
              <i class="labelicon_3" v-if="scope.row.synergyOrder=='1'">协</i>
              <i class="labelicon_4" v-if="scope.row.commodityPrepare=='0'">未到货</i>
              <i class="labelicon_5" v-if="scope.row.commodityPrepare=='1'">部分到货</i>
              <i class="labelicon_6" v-if="scope.row.commodityPrepare=='2'">货品到齐</i>
              <i class="labelicon_7 labe7_lI" v-if="scope.row.abnormalMaterial=='2'">有异常</i>
              <i class="labelicon_8" v-if="scope.row.orderType=='973'">退</i>
              <i class="labelicon_8" v-if="scope.row.orderType=='974'">样</i>
              <i class="labelicon_9" v-if="scope.row.secondQuesIcon">1+</i>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="installationOrderStatus" label="订单状态" width="160" align="center">
          <template slot-scope="scope">   
            <div>
              <p v-if="scope.row.installationOrderStatus==3">待处理</p>
              <p v-if="scope.row.installationOrderStatus==4">已通知未预约</p>
              <p v-if="scope.row.installationOrderStatus==5">派单已撤销</p>
              <p v-if="scope.row.installationOrderStatus==6">已预约待指派</p>
              <p v-if="scope.row.installationOrderStatus==7">维修中</p>
              <p v-if="scope.row.installationOrderStatus==8">汇报未完成</p>
              <p v-if="scope.row.installationOrderStatus==9">汇报已完成</p>
              <p v-if="scope.row.installationOrderStatus==10">回访中</p>
              <p v-if="scope.row.installationOrderStatus==11">回访驳回</p>
              <p v-if="scope.row.installationOrderStatus==12">已完成</p>
              <p v-if="scope.row.installationOrderStatus==13">已预约未确定</p>
              <p v-if="scope.row.installationOrderStatus==14">已指派待派单</p>
              <p v-if="scope.row.installationOrderStatus==15">待维修</p>
              <p v-if="scope.row.installationOrderStatus==16">已回访未结算</p>
              <p v-if="scope.row.installationOrderStatus==17">已回访已结算</p>
              <p v-if="scope.row.installationOrderStatus==18">汇报未完成已预约</p>
              <p v-if="scope.row.installationOrderStatus==19">回访驳回已预约</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="turnSource" label="转单来源" width="100"></el-table-column>

        <el-table-column align="center" prop="source" label="订单来源" width="80">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.source==1">销售</p>
              <p v-if="scope.row.source==2">上样</p>
              <p v-if="scope.row.source==3">转移</p>
              <p v-if="scope.row.source==4">售后</p>
              <p v-if="scope.row.source==5">400</p>
              <p v-if="scope.row.source==6">撤样</p>
              <p v-if="scope.row.source==7">第三方</p>
              <p v-if="scope.row.source==8">退货</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip prop="timeCycle" label="时间周期" width="160" sortable align="center"></el-table-column>

        <el-table-column show-overflow-tooltip prop="designateInstallationTime" label="维修次数" width="110" sortable align="center"></el-table-column>

        <el-table-column show-overflow-tooltip prop="customerName" label="客户姓名" width="110" align="center"></el-table-column>

        <el-table-column show-overflow-tooltip prop="customerPhone" label="客户电话" width="120" align="center"></el-table-column>

        <el-table-column show-overflow-tooltip prop="address" label="订单地址" width="300" align="center"></el-table-column>

        <el-table-column show-overflow-tooltip prop="designer" label="设计师" width="110" align="center"></el-table-column>

        <el-table-column show-overflow-tooltip prop="predictInstallTime" label="合同安装日期" width="160" sortable align="center"></el-table-column>

        <el-table-column show-overflow-tooltip prop="appointmentTime" label="预约上门时间" width="160" sortable align="center"></el-table-column>

        <el-table-column show-overflow-tooltip prop="appointmentRemakes" label="预约备注" width="240" align="center"></el-table-column>

        <el-table-column show-overflow-tooltip prop="againAbout" label="再约时间" width="160" sortable align="center"></el-table-column>

        <el-table-column show-overflow-tooltip prop="logisticsDistributionTime" label="物流送货时间" width="160" sortable align="center"></el-table-column>

        <el-table-column show-overflow-tooltip prop="firstInstallationTime" label="首次维修时间" width="160" sortable align="center"></el-table-column>

        <el-table-column show-overflow-tooltip prop="contractMoney" label="合同金额/元" width="120" sortable align="center"></el-table-column>

        <el-table-column show-overflow-tooltip prop="presentStatus" label="礼品状态" width="110" align="center">
           <template slot-scope="scope">
            <div>
              <p v-if="scope.row.presentStatus==0">无</p>
              <p v-if="scope.row.presentStatus==1">有</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip prop="reportContent" label="维修汇报内容" width="240" align="center"></el-table-column>

        <el-table-column align="center" prop="isReturn" label="返厂状态" width="100">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.isReturn==0">无</p>
              <p v-if="scope.row.isReturn==1">有</p>
            </div>
          </template>
        </el-table-column>

      </el-table>
    </div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import withdrawal from "@/views/Installation/dispatchcenter/stepsOne/components/withdrawal";
import orderchangedia from "@/views/Installation/dispatchcenter/components/orderchangedia"; //转单
import rejectorder from "@/views/Installation/dispatchcenter/components/rejectorder"; //驳回
import collaborationsheet from "@/views/Installation/dispatchcenter/components/collaborationsheet"; //协同单查询
import arrivalstatus from "@/views/Installation/dispatchcenter/components/arrivalstatus"; //到货状态
import returnfactory from "@/views/Installation/dispatchcenter/components/returnfactory";//返厂
import appointdia from "./components/appointdia";
import spot from "@/assets/images/spot.png";

import {
  editInformCustomer, //修改安装状态
  editUrgent, //加急和取消加急
  editPhoneSuccess,//电话指导完成
} from "@/api/entrepotSet/aftermarket/repaircenter/repaircenter";
import { mapMutations } from "vuex";
import { log } from 'util';
export default {
  props: ["tabList","mapShow","maxHeight",'loading'],
  components: {
    breadcrumb,
    pagination,
    orderchangedia, //转单
    rejectorder, //驳回
    collaborationsheet, //协同单查询
    arrivalstatus,//到货状态
    returnfactory,//返厂
    appointdia,
    withdrawal
  },
  // name: 'brandmanagement',
  data() {
    return {
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),//按钮权限
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 100, //总条数
      spot, //操作图片
      navList: [], //头部面包屑
      installationType: "",
      elsectVal: [], //选中框
      actionBtnList: [
        {name:"协同单查询",codename:'repaircentero_same',id:'1'},
        {name:"通知用户",codename:'repaircentero_',id:'2'},
        {name:"查货备注",codename:'repaircentero_remake',id:'3'},
        {name:"到货状态",codename:'repaircentero_status',id:'8'},
        {name:"预约上门",codename:'repaircentero_door',id:'4'},
        {name:"申请调拨",codename:'repaircentero_bo',id:'5'},
        {name:"指派出库",codename:'repaircentero_ku',id:'6'},
        {name:"派维修单",codename:'repaircentero_dan',id:'7'},
        {name:"加急",codename:'repaircentero_speed',id:'9'},
        {name:"取消加急",codename:'repaircentero_speeddel',id:'10'},
        {name:"返厂",codename:'repaircenter_fanchang',id:'11'},
        {name:"退货退款",codename:'repaircenter_tuitui',id:'12'},
      ],
      rejectData: {}, //驳回选中的数据
      i: 0,
      orderchangedia_vis: false, //转单弹框是否显示
      rejectdia_vis: false, //驳回弹框是否显示
      collabodia_vis: false, //协同单查询弹框是否显示
      appointdia_vis: false, //预约弹框是否显示
      isArrival_vis: false, //到货状态是否显示
      outStockdia_vis: false, //指派出库弹框是否显示
      isWithdrawal: false, //转单撤回弹框是否显示
      isReturnfactory: false,//返厂弹框是否显示
      isSpeed: "", //是否加急

      center: { lng: 116.404, lat: 39.915 }, //地图默认中心
      position: { lng: 116.404, lat: 39.915 }, //地图弹框的位置
      infoWindow: {
        show: false,
        contents: ""
      },
      points: [], //海量点数组
      customerName:'',//客户姓名
      customerPhone:'',//客户电话
    };
  },

  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  watch: {
    tabList: function(newList, oldList) {
      //处理返回数组  取出经纬度  做成新数组  海量点要使用
      let pointArr = [];
      pointArr = newList.map((item,index) => {
        return {
          lng: item.longitude,
          lat: item.latitude,
          id: item.installationOrderId,
          address:item.address,
          customerName:item.customerName,
          customerPhone:item.customerPhone,
          purchaseContractCode:item.purchaseContractCode,
          commodityNumber:item.commodityNumber,
        };
      });
      for (let i = 0; i < pointArr.length; i++) {
        this.$set(this.points, i, pointArr[i]);
      }
      // console.log(this.points,'pointssss');
    }
  },
  methods: {
    ...mapMutations(["SET_REPAIRCENTER"]),

    //跳转查看信息
    info1() {
      this.$router.push({ path: "/aftermarket/aftermarketdetails" });
    },

    //点击采购合同跳转
    info2(row) {
      // this.$router.push({
      //   path: "/aftermarket/tasktabs",
      //   query: {
      //     nums: "0",
      //     installationOrderId: row.installationOrderId,
      //     orderId: row.orderId
      //   }
      // });
      this.$router.push({path:'/ordermm/details',query:{orderId: row.orderId}})
    },

    //驳回
    reject(row) {
      if (row.installationOrderStatus == "1") {
        this.rejectData = row;
        this.rejectdia_vis = true;
      } else {
        this.$message.warning("只有转单状态可以驳回");
      }
    },

    //电话指导完成
    phoneFun(row){
      this.$confirm("进行电话指导完成?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            installationOrderId: row.installationOrderId,
            orderId: row.orderId,
            installationOrderStatus: 12
          };
          editPhoneSuccess(data).then(res => {
            if (res.status == "200") {
              this.$message.success("电话指导完成");
              this.SET_REPAIRCENTER(`电话指导完成${new Date().getTime()}`);
            } else {
              this.$message.console.error("请求超时");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消电话指导"
          });
        });
    },

    //地图海量点  点击事件
    clickHandler(e) {
      console.log(this.points);
      console.log(e.point,'e.point');
      // let ids=this.points.filter(item=>{
      //   return item.lat==e.point.lat&&item.lng==e.point.lng
      // })[0].id
      // console.log(ids);
      this.switchStatus(e.point.id);
      console.log(e.point.id);
      // this.switchStatus(ids);//地图勾选切换选列表的选中状态
    },

    //地图勾选切换选列表的选中状态
    switchStatus(id){
      //element切换选中对象方法
      this.$refs.multipleTable.toggleRowSelection(
        this.tabList.filter(item=>{ return item.installationOrderId == id })[0]
      );
    },

    //海量点鼠标移入
    mouseoverHandler(e) {
      this.position = { lng: e.point.lng, lat: e.point.lat };
      let obj = e.point;
      if(!obj.purchaseContractCode){
        obj.purchaseContractCode = '本订单无采购合同号' 
      }
      this.infoWindow.show = true;
      this.infoWindow.contents =  `<p>采购合同号：${obj.purchaseContractCode}</p> <p>商品数量：${obj.commodityNumber}</p> <p>客户姓名：${obj.customerName}</p> <p>客户电话：${obj.customerPhone}</p> <p>客户地址：${obj.address}</p>`;
    },

    //关闭弹框
    infoWindowClose(e) {
      this.infoWindow.show = false;
    },

    //关闭弹框
    handleClose() {
      this.isWithdrawal = false;
      this.collabodia_vis = false;
    },

    //确认按钮
    determine() {
      this.$refs.withdrawal.transferconfirmation();
      if (this.$refs.withdrawal.transferconfirmation()) {
        this.handleClose();
        this.SET_REPAIRCENTER(`转单撤回${new Date().getTime()}`);
      }
    },
    //查询获取
    getListfun() {
      this.$emit("getListfun");
    },

    butGroupActions(index) {
      //协同单查询
      if(index == '1'){
        if (this.canonlyFun()) {
          this.collabodia_vis = true;
        }
      }

      //通知客户  3
      if(index == '2'){
        if (this.canonlyFun()) {
          // if (this.elsectVal[0].installationOrderStatus == 3) {
            this.noticeFun();
          // } else {
            // this.$message.warning("订单状态无法通知客户");
          // }
        }
      }

      //查货备注
      if(index == '3'){
         if (this.canonlyFun()) {
           this.$router.push({ path: "/Installation/factoryinspection",query:{orderId:this.elsectVal[0].orderId} });
        }
      }

      //预约上门   4   13
      if(index == '4'){
        if (this.canonlyFun()) {
          let {installationOrderId,customerName,customerPhone} = this.elsectVal[0]
          // if (this.elsectVal[0].installationOrderStatus == 4 || this.elsectVal[0].installationOrderStatus == 13) {
            this.appointdia_vis = true;
            this.customerName = this.elsectVal[0].customerName;
            this.customerPhone = this.elsectVal[0].customerPhone;
            this.$nextTick(()=>{
              this.$refs.appointdia.getData(installationOrderId,customerName,customerPhone)
            })
          // } else {
            // this.$message.warning("订单状态无法预约上门");
          // }
        }
      }

      //申请调拨：2 3 6
      if(index == '5'){
        if (this.canonlyFun()) {
          // if (
          //   this.elsectVal[0].installationOrderStatus == 6 ||
          //   this.elsectVal[0].installationOrderStatus == 3 ||
          //   this.elsectVal[0].installationOrderStatus == 2
          // ) {
            this.$router.push({
              path: "/Installation/applyallocation",
              query: {
                orderId: this.elsectVal[0].orderId,
                installationOrderId: this.elsectVal[0].installationOrderId
              }
            });
          // } else {
          //   this.$message.warning("订单状态无法申请调拨");
          // }
        }
        
      }

      //指派出库   6
      if(index == '6'){
        if (this.canonlyFun()) {
          // if (this.elsectVal[0].installationOrderStatus == 6) {
            this.$router.push({
              path: "/Installation/designatetreasury",
              query: {
                orderId: this.elsectVal[0].orderId,
                installationOrderId: this.elsectVal[0].installationOrderId,
                istabs: "0",
                tabslist: "0"
              }
            });
          // } else {
            // this.$message.warning("订单状态无法指派出库");
          // }
        }
      }

      //派维修单
      if(index == '7'){
        if (this.canonlyFun()) {
          // if (this.elsectVal[0].installationOrderStatus == 14) {
            this.$router.push({
              path: "/Installation/pieinstallationlist",
              query: {
                orderId: this.elsectVal[0].orderId,
                installationOrderId: this.elsectVal[0].installationOrderId,
                installationType: 2
              }
            });
          // } else {
            // this.$message.warning("订单状态无法派维修单");
          // }
        }
      }

      //到货状态
      if(index == '8'){
        if (this.canonlyFun()) {
          this.isArrival_vis = true;
        }
      }

      //加急：3 4 6
      if(index == '9'){
        if (this.canonlyFun()) {
          // if (
          //   this.elsectVal[0].installationOrderStatus == 6 ||
          //   this.elsectVal[0].installationOrderStatus == 3 ||
          //   this.elsectVal[0].installationOrderStatus == 4
          // ) {
            this.editUrgentFun("1");
          // } else {
          //   this.$message.warning("订单状态无法加急");
          // }
        }
      }


      //取消加急
      if(index == '10'){
        if (this.canonlyFun()) {
          if (this.elsectVal[0].isSpeed == "1") {
            this.editUrgentFun("2");
          } else {
            this.$message.warning("订单状态无法取消加急");
          }
        }
      }

      //返厂
      if(index == '11'){
        if (this.canonlyFun()) {
          this.isReturnfactory = true;
        }
      }
      //退货退款
      if(index == '12'){
        if (this.canonlyFun()) {
          this.$router.push({path:'/regoodspermit/addapplication',query:{orderId:this.elsectVal[0].orderId}})
        }
      }


      
      // if (index == 0) {
      //   //转单    0 2
      //   if (this.canonlyFun()) {
      //     if (
      //       this.elsectVal[0].installationOrderStatus == 0 ||
      //       this.elsectVal[0].installationOrderStatus == 2
      //     ) {
      //       this.orderchangedia_vis = true;
      //     } else {
      //       this.$message.warning("订单状态无法转单");
      //     }
      //   }
      // } else if (index == 1) {
      //   this.installationType = "2";
      //   this.isWithdrawal = true;
      // } else if (index == 2) {
      //   if (this.canonlyFun()) {
      //     //通知客户  3
      //     if (this.elsectVal[0].installationOrderStatus == 3) {
      //       this.noticeFun();
      //     } else {
      //       this.$message.warning("订单状态无法通知客户");
      //     }
      //   }
      // } else if (index == 3) {
      //   if (this.canonlyFun()) {
      //     this.collabodia_vis = true;
      //   }
      // } else if (index == 4) {
      //   this.$router.push({ path: "/Installation/factoryinspection" });
      // } else if (index == 5) {
      //   //预约上门   4   13
      //   if (this.canonlyFun()) {
      //     // if (this.elsectVal[0].installationOrderStatus == 4 || this.elsectVal[0].installationOrderStatus == 13) {
      //       this.appointdia_vis = true;
      //     // } else {
      //       // this.$message.warning("订单状态无法预约上门");
      //     // }
      //   }
      // } else if (index == 6) {
      //   //指派出库   6
      //   if (this.canonlyFun()) {
      //     // if (this.elsectVal[0].installationOrderStatus == 6) {
      //       this.$router.push({
      //         path: "/Installation/designatetreasury",
      //         query: {
      //           orderId: this.elsectVal[0].orderId,
      //           installationOrderId: this.elsectVal[0].installationOrderId,
      //           istabs: "0",
      //           tabslist: "0"
      //         }
      //       });
      //     // } else {
      //       // this.$message.warning("订单状态无法指派出库");
      //     // }
      //   }
      // } else if (index == 7) {
      //   if (this.canonlyFun()) {
      //     // if (this.elsectVal[0].installationOrderStatus == 14) {
      //       this.$router.push({
      //         path: "/Installation/pieinstallationlist",
      //         query: {
      //           orderId: this.elsectVal[0].orderId,
      //           installationOrderId: this.elsectVal[0].installationOrderId,
      //           installationType: 2
      //         }
      //       });
      //     // } else {
      //       // this.$message.warning("订单状态无法派维修单");
      //     // }
      //   }
      // } else if (index == 8) {
      //   //加急：3 4 6
      //   if (this.canonlyFun()) {
      //     if (
      //       this.elsectVal[0].installationOrderStatus == 6 ||
      //       this.elsectVal[0].installationOrderStatus == 3 ||
      //       this.elsectVal[0].installationOrderStatus == 4
      //     ) {
      //       this.editUrgentFun("1");
      //     } else {
      //       this.$message.warning("订单状态无法加急");
      //     }
      //   }
      // } else if (index == 9) {
      //   //取消加急
      //   if (this.canonlyFun()) {
      //     if (this.elsectVal[0].isSpeed == "1") {
      //       this.editUrgentFun("2");
      //     } else {
      //       this.$message.warning("订单状态无法取消加急");
      //     }
      //   }
      // } else if (index == 10) {
      // } else if (index == 11) {
      //   if (this.canonlyFun()) {
      //     //申请调拨：2 3 6
      //     if (
      //       this.elsectVal[0].installationOrderStatus == 6 ||
      //       this.elsectVal[0].installationOrderStatus == 3 ||
      //       this.elsectVal[0].installationOrderStatus == 2
      //     ) {
      //       this.$router.push({
      //         path: "/aftermarket/applyallocation",
      //         query: {
      //           orderId: this.elsectVal[0].orderId,
      //           installationOrderId: this.elsectVal[0].installationOrderId
      //         }
      //       });
      //     } else {
      //       this.$message.warning("订单状态无法申请调拨");
      //     }
      //   }
      // }
    },
    //加急和取消加急
    editUrgentFun(isSpeed) {
      this.isSpeed = isSpeed;
      let data = {
        installationOrderId: this.elsectVal[0].installationOrderId,
        isSpeed: isSpeed
      };
      editUrgent(data).then(res => {
        if (res.status == 200) {
          if (this.isSpeed == "1") {
            this.$message.success("加急成功");
          } else {
            this.$message.success("取消加急成功");
          }
          this.SET_REPAIRCENTER(`加急${new Date().getTime()}`);
        } else {
          this.$message.error("网络接口异常成功");
        }
      });
    },

    //通知客户方法
    noticeFun() {
      if (this.canonlyFun()) {
        this.$confirm("是否通知客户?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let data = {
              installationOrderId: this.elsectVal[0].installationOrderId,
              installationOrderStatus: "4",
              source: this.elsectVal[0].source,
              installationType: "2" //type  安装1  售后2
            };
            editInformCustomer(data).then(res => {
              if (res.status == "200") {
                this.$message.success("通知客户成功");
                this.SET_REPAIRCENTER(`通知客户${new Date().getTime()}`);
              } else {
                this.$message.error("通知客户失败");
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消通知客户"
            });
          });
      }
    },

    //关闭弹框
    closeAll() {
      this.orderchangedia_vis = false; //转单弹框是否显示
      this.rejectdia_vis = false; //驳回弹框是否显示
      this.collabodia_vis = false; //协同单查询弹框是否显示
      this.appointdia_vis = false; //预约弹框是否显示
      this.isReturnfactory = false; //返厂弹框是否显示
      // this.outStockdia_vis = false; //指派出库弹框是否显示
      this.applyalldia_vis = false; //调拨申请弹框是否显示
      this.isArrival_vis = false; //到货状态是否显示
    },

    //多选内容改变
    handleSelectionChange(val) {
      this.elsectVal = val;
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },

    //判断是否勾选  且之勾选一条数据
    canonlyFun() {
      if (this.elsectVal.length < 1) {
        this.$message.warning("您未勾选!");
        return false;
      } else if (this.elsectVal.length > 1) {
        this.$message.warning("只能勾选一条!");
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>
<style scoped lang='scss'>
.stepsOne {
  .baidumap {
    height: 550px;
    width: 100%;
  }
  .btn_list{
    display: flex;
    flex-wrap: wrap;
  }
  .table_action_span {
    text-align: left !important;
    margin-left: 25px;
  }
}
</style>

