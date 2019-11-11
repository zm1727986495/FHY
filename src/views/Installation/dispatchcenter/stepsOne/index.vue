<template>
  <div class="missedorder">
    <!-- :scroll-wheel-zoom="true"    /// 地图是否启用滚轮缩放-->
    <!-- keyboard键盘操作上下左右  double-click-zoom双击地图缩放 -->

    <baidu-map class="baidumap" :center="center" :zoom="12" :keyboard="true" :double-click-zoom="true" v-if="mapShow">
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <bm-point-collection :points="points" shape="BMAP_POINT_SHAPE_STAR" color="red" size="BMAP_POINT_SIZE_BIG" 
      @click="clickHandler" @mouseover="mouseoverHandler"></bm-point-collection>
      <bm-info-window :position="position" title="订单信息" :height="0" :show="infoWindow.show" @close="infoWindowClose">
        <p v-html="infoWindow.contents" style="height:100px;"></p>
      </bm-info-window>
    </baidu-map>

    <div class="m-bottom10 m-top5 btn_list_1">
      <div v-for="(item,index) in actionBtnList" :key="index">
        <el-button
          v-if="btnJurisdiction[item.str]"
          size="small"
          class="button-96 m-left10"
          @click="butGroupAction(item.type)"
          type="default"
        >{{item.name}}</el-button>
      </div>
    </div>
    <!-- 转单 -->
    <orderchangedia v-if="isChangeorder" :visible="isChangeorder" :elsectVal="choseArr" @close_order="closeall"></orderchangedia>

    <!-- 转单撤回 -->
    <withdrawal @handleClose="handleClose" v-if="isWithdrawal" :isWithdrawal='isWithdrawal' :installationType="installationType"></withdrawal>
    <!-- 协同单查询 -->
    <el-dialog
      title="查看协同订单"
      :visible.sync="isCollaborationsheet"
      width="950px"
      :before-close="handleClose"
      custom-class="customDialogTitle"
    >
      <collaborationsheet v-if="isCollaborationsheet" :choseArr="choseArr"></collaborationsheet>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>

    <div class="table_list lvs attribute" v-loading='loading'>
      <el-table
        id="pathtabs_table"
        ref="multipleTable"
        border
        :row-class-name="tableRowClassName"
        @selection-change="chooseDelete"
        :data="tableData"
        :max-height="maxHeight"
      >
        <el-table-column fixed="left" type="selection" width="40"></el-table-column>
        <el-table-column align="center" prop="purchaseContractCode" label="合同号" width="160" fixed="left">
          <template slot-scope="scope">
            <div>
              <el-tooltip placement="right" visible-arrow>
                <div slot="content" class="tips tipFon">
                  <p @click="rejectFun(scope.row)" class="operaItems">驳回</p>
                  <p v-if="scope.row.source==4" @click="telephoneFn(scope.row)" class="operaItems">电话指导完成</p>
                  <p @click="queryDetails(scope.row)" class="operaItems" v-if="scope.row.source!=4||scope.row.source!=6">查看详情</p>
                  <p @click="queryProblem(scope.row)" class="operaItems" v-if="scope.row.source==4">查看问题</p>
                  <p @click="withdrawalFn(scope.row)" class="operaItems" v-if="scope.row.source==6">查看撤样</p>
                </div>
                <img :src="spot" alt class="attributesTips" />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :open-delay='300' :content="scope.row.purchaseContractCode" placement="top-start">
                <p class="table_action_span contractEllipsis"  @dblclick="contractFun(scope.row)">{{scope.row.purchaseContractCode}}</p>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="订单标识" width="340" align="center">
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
        <el-table-column align="center" prop="installationOrderStatus" label="订单状态" width="120">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.installationOrderStatus==0">未接单</p>
              <p v-if="scope.row.installationOrderStatus==1">已转单</p>
              <p v-if="scope.row.installationOrderStatus==2">转单被拒</p>
              <p v-if="scope.row.installationOrderStatus==3">已接单未通知</p>
              <p v-if="scope.row.installationOrderStatus==4">已通知未预约</p>
              <p v-if="scope.row.installationOrderStatus==5">派单已撤销</p>
              <p v-if="scope.row.installationOrderStatus==6">已预约待指派</p>
              <p v-if="scope.row.installationOrderStatus==7">安装中</p>
              <p v-if="scope.row.installationOrderStatus==8">汇报未完成</p>
              <p v-if="scope.row.installationOrderStatus==9">汇报已完成</p>
              <p v-if="scope.row.installationOrderStatus==10">回访中</p>
              <p v-if="scope.row.installationOrderStatus==11">回访驳回</p>
              <p v-if="scope.row.installationOrderStatus==12">已完成</p>
              <p v-if="scope.row.installationOrderStatus==13">已预约未确定</p>
              <p v-if="scope.row.installationOrderStatus==14">已指派待派单</p>
              <p v-if="scope.row.installationOrderStatus==15">待安装</p>
              <p v-if="scope.row.installationOrderStatus==16">已回访未结算</p>
              <p v-if="scope.row.installationOrderStatus==17">已回访已结算</p>
              <p v-if="scope.row.installationOrderStatus==18">汇报未完成已预约</p>
              <p v-if="scope.row.installationOrderStatus==19">回访未完成已预约</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="turnSource" label="转单来源" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="source" label="订单类型" width="80">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.source==1">销售</p>
              <p v-if="scope.row.source==2">上样</p>
              <p v-if="scope.row.source==3">转移</p>
              <p v-if="scope.row.source==4">售后</p>
              <p v-if="scope.row.source==5">400</p>
              <p v-if="scope.row.source==6">撤样</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="timeCycle" label="时间周期" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="designateInstallationTime" label="指派次数" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="customerName" label="客户姓名" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="customerPhone" label="客户电话" width="130" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="address" label="订单地址" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="designer" label="设计师" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="predictInstallTime" label="合同安装时间" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="appointmentTime" label="预约上门时间" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="againAbout" label="再约时间" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="appointmentRemakes" label="预约备注" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="serveGroupName" label="安装部" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="logisticsDistributionTime" label="物流配送时间" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="firstInstallationTime" label="首次安装时间" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="contractMoney" label="合同金额/元" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="presentStatus" label="礼品状态" width="80">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.presentStatus==0">无</p>
              <p v-if="scope.row.presentStatus==1">有</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="返厂状态" width="100">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.isReturn==0">无</p>
              <p v-if="scope.row.isReturn==1">有</p>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="reportContent" label="安装汇报内容" width="200"></el-table-column> -->
      </el-table>
    </div>

    <!-- 驳回 -->
    <rejectorder :isRejectorder="isRejectorder" :rejectData="rejectData" @closeall="closeall"></rejectorder>
  </div>
</template>
<script>
import orderchangedia from "../components/orderchangedia";
import withdrawal from "./components/withdrawal";
import collaborationsheet from "../components/collaborationsheet";
import rejectorder from "../components/rejectorder";
import spot from "@/assets/images/spot.png";

import { editInstallationOrder } from "api/Installation/dispatchcenter/dispatchcenter";
import {
  editPhoneSuccess //电话指导完成
} from "@/api/entrepotSet/aftermarket/repaircenter/repaircenter";
import { mapMutations } from "vuex";
export default {
  props: ["tableData", "maxHeight", "mapShow",'loading'],
  components: {
    withdrawal,
    collaborationsheet,
    rejectorder,
    orderchangedia
  },
  data() {
    return {
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 0, //总条数
      installationType: "",
      nu: "",
      actionBtnList: [
        { name: "协同单查询", type: 4, str: "dispatchcenter_Collaborative" },
        { name: "接单", type: 1, str: "dispatchcenter_Receipt" },
        { name: "转单", type: 2, str: "dispatchcenter_Changeorder" },
        { name: "转单撤回", type: 3, str: "dispatchcenter_Withdraw" }
        // { name: "退货退款", type: 5 }
      ],
      // 按钮权限***********
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
      spot,
      choseArr: [],
      isChangeorder: false, //转单弹框
      isWithdrawal: false, //转单撤回
      isCollaborationsheet: false, //协同单查询
      isRejectorder: false, //驳回
      rejectData: {},
      i: 0,

      //*****************地图
      center: { lng: 116.404, lat: 39.915 }, //地图默认中心
      position: { lng: 116.404, lat: 39.915 }, //地图弹框的位置
      infoWindow: {
        show: false,
        contents: "....."
      },
      points: [] //海量点数组
    };
  },
  mounted() {},
  watch: {
    tableData: function(newList, oldList) {
      //处理返回数组  取出经纬度  做成新数组  海量点要使用
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
    }
  },
  methods: {
    ...mapMutations(["SET_PAYMENT"]),

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
        this.tableData.filter(item=>{ return item.installationOrderId == id })[0]
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

    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
    },
    //查看问题
    queryProblem() {
      this.$router.push({ path: "/aftermarket/aftermarketdetails" });
    },
    //查看撤样
    withdrawalFn(row) {
      this.$router.push({
        path: "/samplemanagement/editcancle",
        query: {
          cancelSampleSingleId: row.orderId
        }
      });
    },
    //查看详情
    queryDetails(row) {
      this.$router.push({
        path: "viewdetails",
        query: { orderId: row.orderId, contractId:row.customerContractId }
      });
    },
    //电话指导完成
    telephoneFn(row) {
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
              this.SET_PAYMENT(`电话指导完成${new Date().getTime()}`);
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
    //驳回
    rejectFun(row) {
      if (row.installationOrderStatus == 1) {
        this.rejectData = row;
        this.isRejectorder = true;
      } else {
        this.$message.warning("只有已转单状态可以驳回!");
      }
    },
    //点击合同号跳转
    contractFun(row) {
      // this.$router.push({
      //   path: "/aftermarket/tasktabs",
      //   query: {
      //     nums: "1",
      //     installationOrderId: row.installationOrderId,
      //     orderId: row.orderId
      //   }
      // });
      this.$router.push({path:'/ordermm/details',query:{orderId: row.orderId}})
    },
    //关闭弹框
    handleClose() {
      this.isCollaborationsheet = false;
      this.isWithdrawal = false;
    },
    //关闭弹框
    closeall() {
      this.isChangeorder = false;
      this.isRejectorder = false;
    },
    canonlyFun() {
      if (this.choseArr.length < 1) {
        this.$message.warning("您未勾选!");
        return false;
      } else if (this.choseArr.length > 1) {
        this.$message.warning("只能勾选一条!");
        return false;
      } else {
        return true;
      }
    },
    //按钮组
    butGroupAction(type) {
      if (type == 1) {
        // if (this.canonlyFun()) {
          // if (
          //   this.choseArr[0].installationOrderStatus == 0 ||
          //   this.choseArr[0].installationOrderStatus == 2
          // ) {
          this.$confirm("确认接单?", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              let data=[]
              this.choseArr.forEach(item=>{
                data.push({
                   installationOrderId:item. installationOrderId
                })
              })
              // let data = {
              //   installationOrderId: this.choseArr[0].installationOrderId
              // };
              editInstallationOrder(data)
                .then(res => {
                  if (res.status == 200) {
                    this.SET_PAYMENT(`接单${new Date().getTime()}`);
                    this.$message.success("接单成功!")
                  }
                })
                .catch(error => {
                  console.error("接单", error);
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消操作"
              });
            });
          // } else {
          //   this.$message.warning("此单不能接!");
          // }
        // }
      }

      if (type == 2) {
        if (this.canonlyFun()) {
          // let { installationOrderStatus: status } = this.choseArr[0];
          // if (status == 0 || status == 2) {
          this.isChangeorder = true;
          // } else {
          // this.$message.error("当前状态不能转单!");
          // }
        }
      }
      if (type == 3) {
        this.installationType = "1";
        this.isWithdrawal = true;
      }
      if (type == 4) {
        if (this.canonlyFun()) {
          this.isCollaborationsheet = true;
        }
      }
      // if (type == 5) {
         
      // }
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //勾选
    chooseDelete(val) {
      this.choseArr = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.missedorder {
  
  .baidumap {
    height: 550px;
    width: 100%;
  }
  
  .btn_list_1 {
    display: flex;
    width: 88%;
    flex-wrap: wrap;
    > button {
      margin: 5px;
    }
  }
}
</style>
