<template>
  <div class="pendingdisposal">
    <!-- :scroll-wheel-zoom="true"    /// 地图是否启用滚轮缩放-->
    <!-- keyboard键盘操作上下左右  double-click-zoom双击地图缩放 -->
    <baidu-map
      class="baidumap"
      :center="center"
      :zoom="12"
      :keyboard="true"
      :double-click-zoom="true"
      v-if="mapShow"
    >
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <bm-point-collection
        :points="points"
        shape="BMAP_POINT_SHAPE_STAR"
        color="red"
        size="BMAP_POINT_SIZE_BIG"
        @click="clickHandler"
        @mouseover="mouseoverHandler"
      ></bm-point-collection>
      <bm-info-window
        :position="position"
        title="订单信息"
        :height="0"
        :show="infoWindow.show"
        @close="infoWindowClose"
      >
        <p v-html="infoWindow.contents" style="height:100px;"></p>
      </bm-info-window>
    </baidu-map>

    <!-- 按钮组 -->
    <div class="m-bottom10 btn_list_1">
      <div v-for="(item,index) in actionBtnList" :key="index">
        <el-button
          v-if="btnJurisdiction[item.str]"
          size="small"
          class="button-96"
          @click="butGroupAction(item.type)"
          type="default"
        >{{item.name}}</el-button>
      </div>
    </div>
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

    <!-- 预约上门 -->
    <el-dialog title :visible.sync="isAppointmentdoor" width="800px" :before-close="handleClose">
      <div class="titlecals">预约上门</div>
      <appointmentdoor :choseArr="choseArr" v-if="isAppointmentdoor" ref="appointmentdoor"></appointmentdoor>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="appointmentFun">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 到货状态 -->
    <arrivalstatus :isArrivalstatus="isArrivalstatus" :elsectVal="choseArr" @closeall="closeall"></arrivalstatus>

    <!-- 返厂 -->
    <returnfactory
      v-if="isReturnfactory"
      :isReturnfactory="isReturnfactory"
      :choseArr="choseArr"
      @handleClose="handleClose"
    ></returnfactory>

    <!-- 列表 -->
    <div class="table_list lvs attribute" v-loading='loading'>
      <el-table
        ref="multipleTable"
        id="pathtabs_table"
        border
        :row-class-name="tableRowClassName"
        @selection-change="chooseDelete"
        :data="tableData"
        :max-height="maxHeight"
      >
        <el-table-column fixed="left" type="selection" width="40"></el-table-column>
        <el-table-column prop="purchaseContractCode" label="合同号" width="160" align="center" fixed="left">
          <template slot-scope="scope">
            <div>
              <el-tooltip placement="right" visible-arrow>
                <div slot="content" class="tips tipFon">
                  <p v-if="scope.row.source==4" class="operaItems" @click="seeFun(scope.row)">查看问题</p>
                  <p v-if="scope.row.source==4" @click="telephoneFn(scope.row)" class="operaItems">电话指导完成</p>
                  <p @click="queryDetails(scope.row)" class="operaItems">查看详情</p>
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
              <i class="labelicon_8" v-if="scope.row.transfersType!='0'">调</i>
              <i class="labelicon_9" v-if="scope.row.secondQuesIcon">1+</i>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="installationOrderStatus" label="订单状态" width="120">
          <template slot-scope="scope">
            <div class="conetnBox">
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
              <p v-if="scope.row.installationOrderStatus==19">回访驳回已预约</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="turnSource" label="转单来源" width="120"></el-table-column>
        <el-table-column align="center" prop="source" label="订单类型" width="120">
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
        <el-table-column align="center" prop="timeCycle" label="时间周期" width="80"></el-table-column>
        <el-table-column align="center" prop="designateInstallationTime" label="指派次数" width="100"></el-table-column>
        <el-table-column align="center" prop="customerName" label="客户姓名" width="100"></el-table-column>
        <el-table-column align="center" prop="customerPhone" label="客户电话" width="130"></el-table-column>
        <el-table-column align="center" prop="address" label="订单地址" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="designer" label="设计师" width="100"></el-table-column>
        <el-table-column align="center" prop="predictInstallTime" label="合同安装时间" width="160"></el-table-column>
        <el-table-column align="center" prop="appointmentTime" label="预约上门时间" width="160"></el-table-column>
        <el-table-column align="center" prop="againAbout" label="再约时间" width="160"></el-table-column>
        <el-table-column align="center" prop="appointmentRemakes" label="预约备注" width="120"></el-table-column>
        <el-table-column align="center" prop="serveGroupName" label="安装部" width="120"></el-table-column>
        <el-table-column align="center" prop="logisticsDistributionTime" label="物流配送时间" width="160"></el-table-column>
        <el-table-column align="center" prop="firstInstallationTime" label="首次安装时间" width="160"></el-table-column>
        <el-table-column align="center" prop="contractMoney" label="合同金额/元" width="150"></el-table-column>
        <el-table-column align="center" prop="presentStatus" label="礼品状态" width="80">
           <template slot-scope="scope">
            <div>
              <p v-if="scope.row.presentStatus==0">无</p>
              <p v-if="scope.row.presentStatus==1">有</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="isReturn" label="返厂状态" width="100">
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
  </div>
</template>
<script>
import spot from "@/assets/images/spot.png";
import appointmentdoor from "./components/appointmentdoor";
import arrivalstatus from "../components/arrivalstatus";
import returnfactory from "../components/returnfactory";
import collaborationsheet from "../components/collaborationsheet";
import { mapMutations } from "vuex";
import {
  editPhoneSuccess //电话指导完成
} from "@/api/entrepotSet/aftermarket/repaircenter/repaircenter";
import {
  editInformCustomer,
  editUrgent,
  editInformUser
} from "api/Installation/dispatchcenter/dispatchcenter";

export default {
  props: ["tableData", "maxHeight", "mapShow",'loading'],
  components: {
    collaborationsheet,
    appointmentdoor,
    arrivalstatus,
    returnfactory
  },
  data() {
    return {
      spot,
      //按钮集合
      actionBtnList: [
        { name: "协同单查询", type: 2, str: "dispatchcenter_Collaborative" },
        { name: "通知用户", type: 1, str: "dispatchcenter_Notice" },
        { name: "查货备注", type: 3, str: "dispatchcenter_Checkgoods" },
        { name: "到货状态", type: 11, str: "dispatchcenter_Arrivalstatus" },
        { name: "预约上门", type: 4, str: "dispatchcenter_Appointment" },
        { name: "申请调拨", type: 6, str: "dispatchcenter_Apply" },
        { name: "指派出库", type: 5, str: "dispatchcenter_Designated" },
        { name: "派安装单", type: 12, str: "dispatchcenter_Distribute" },
        { name: "加急", type: 7, str: "dispatchcenter_Urgent" },
        { name: "取消加急", type: 8, str: "dispatchcenter_Cancel" },
        { name: "退回接单", type: 14, str: "dispatchcenter_Returnreceipt" },
        { name: "返厂", type: 13, str: "dispatchcenter_Returnfactory" },
        { name: "退货退款", type: 10, str: "dispatchcenter_Receipt" },
        { name: "修改外购产品", type: 9, str: "dispatchcenter_Instalstatus" }
      ],
      // 按钮权限***********
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
      choseArr: [],
      i: 0, //状态
      //列表数据
      isCollaborationsheet: false, //协同单查询
      isAppointmentdoor: false, //预约上门
      isArrivalstatus: false, //到货状态
      isReturnfactory: false, //返厂

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
      pointArr = newList.map((item, index) => {
        return {
          lng: item.longitude,
          lat: item.latitude,
          id: item.installationOrderId,
          address: item.address,
          customerName: item.customerName,
          customerPhone: item.customerPhone,
          purchaseContractCode: item.purchaseContractCode
        };
      });
      for (let i = 0; i < pointArr.length; i++) {
        this.$set(this.points, i, pointArr[i]);
      }
    }
  },
  methods: {
    //vuex控制状态重新获取数据
    ...mapMutations(["SET_PAYMENT"]),
    //地图海量点  点击事件
    clickHandler(e) {
      console.log(this.points);
      console.log(e.point, "e.point");
      // let ids=this.points.filter(item=>{
      //   return item.lat==e.point.lat&&item.lng==e.point.lng
      // })[0].id
      // console.log(ids);
      this.switchStatus(e.point.id);
      console.log(e.point.id);
      // this.switchStatus(ids);//地图勾选切换选列表的选中状态
    },
    //地图勾选切换选列表的选中状态
    switchStatus(id) {
      //element切换选中对象方法
      this.$refs.multipleTable.toggleRowSelection(
        this.tableData.filter(item => {
          return item.installationOrderId == id;
        })[0]
      );
    },
    //海量点鼠标移入
    mouseoverHandler(e) {
      this.position = { lng: e.point.lng, lat: e.point.lat };
      let obj = e.point;
      if (!obj.purchaseContractCode) {
        obj.purchaseContractCode = "本订单无采购合同号";
      }
      this.infoWindow.show = true;
      this.infoWindow.contents = `<p>采购合同号：${obj.purchaseContractCode}</p> <p>客户姓名：${obj.customerName}</p> <p>客户电话：${obj.customerPhone}</p> <p>客户地址：${obj.address}</p>`;
    },
    //关闭弹框
    infoWindowClose(e) {
      this.infoWindow.show = false;
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
      this.isReturnfactory = false;
      this.isAppointmentdoor = false;
    },
    //关闭弹框
    closeall() {
      this.appointmentdoor = false;
      this.isArrivalstatus = false;
    },
    //查看
    seeFun(row) {
      this.$router.push({ path: "/aftermarket/aftermarketdetails" });
    },
    //预约上门确定
    appointmentFun() {
      this.$refs.appointmentdoor.handleok();
      if (this.$refs.appointmentdoor.flag) {
        this.handleClose();
      }
    },
    //验证
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
    //查看详情
    queryDetails(row) {
      this.$router.push({
        path: "viewdetails",
        query: { orderId: row.orderId,contractId:row.customerContractId }
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
    //按钮组
    butGroupAction(type) {
      if (type == 1) {
        //通知用户
        if (this.choseArr[0].installationOrderStatus == 3) {
          this.notifycustomers();
        } else {
          this.$message.error("当前状态无法通知!");
        }
      }
      if (type == 2) {
        //协同单查询
        if (this.canonlyFun()) {
          this.isCollaborationsheet = true;
        }
      }
      if (type == 3) {
        //查货备注
        if (this.canonlyFun()) {
          this.$router.push({ path: "factoryinspection",query:{orderId:this.choseArr[0].orderId} });
        }
      }
      if (type == 4) {
        //预约上门
          if (this.canonlyFun()) {
          let { installationOrderStatus,installationOrderId,customerName,customerPhone } = this.choseArr[0];
          if (installationOrderStatus > 3) {
            this.isAppointmentdoor = true;
            this.$nextTick(()=>{
              this.$refs.appointmentdoor.getData(installationOrderId,customerName,customerPhone)
            })
          }else {
            this.$message.error("当前状态无法预约上门!");
          }
        } 
      }
      if (type == 5) {
        //指派出库
        if (this.canonlyFun()) {
          let { appointmentTime } = this.choseArr[0];
          
          if (appointmentTime) {
            this.$router.push({
              path: "designatetreasury",
              query: {
                installationOrderId: this.choseArr[0].installationOrderId,
                orderId: this.choseArr[0].orderId
              }
            });
          } else {
            this.$message.error("当前没有预约上门!");
          }

          // if (this.choseArr[0].installationOrderStatus == 6) {

          // } else {
          //   this.$message.error("当前状态不能指派出库!");
          // }
        }
      }
      if (type == 6) {
        //申请调拨
        if (this.canonlyFun()) {
          this.$router.push({
            path: "applyallocation",
            query: { orderId: this.choseArr[0].orderId,str:'安装' }
          });
          // if (
          //   this.choseArr[0].installationOrderStatus == 6 ||
          //   this.choseArr[0].installationOrderStatus == 3 ||
          //   this.choseArr[0].installationOrderStatus == 2
          // ) {

          // } else {
          //   this.$message.error("当前状态无法调拨!");
          // }
        }
      }
      if (type == 7) {
        //加急
        if (this.canonlyFun()) {
          this.urgentFun("1");
        }
      }
      if (type == 8) {
        //取消加急
        if (this.canonlyFun()) {
          this.urgentFun("2");
        }
      }
      if (type == 9) {
        //修改安装状态
        if (this.canonlyFun()) {
          this.$router.push({
            path: "installationstatus",
            query: {
              orderId: this.choseArr[0].orderId
            }
          });
        }
      }
      if (type == 10) {
        //退货退款
        console.log("退货退款");
        if (this.canonlyFun()) {
          this.$router.push({path:'/regoodspermit/addapplication',query:{orderId:this.choseArr[0].orderId}})
        }
      }
      if (type == 11) {
        //到货状态
        if (this.canonlyFun()) {
          this.isArrivalstatus = true;
        }
      }
      if (type == 12) {
        //派安装单
        if (this.canonlyFun()) {
          let { appointmentTime } = this.choseArr[0];
          if (appointmentTime) {
            this.$router.push({
              path: "pieinstallationlist",
              query: {
                installationOrderId: this.choseArr[0].installationOrderId,
                orderId: this.choseArr[0].orderId,
                installationType: "1"
              }
            });
          } else {
            this.$message.error("当前没有预约上门!");
          }
        }
      }
      if (type == 13) {
        //返厂
        if (this.canonlyFun()) {
          this.isReturnfactory = true;
        }
      }
      if (type == 14) {
        //退回接单
        if (this.canonlyFun()) {
          //结构
          // let { installationOrderStatus: status } = this.choseArr[0];
          // if (status == 3 || status == 4 || status == 6) {
          this.returnreceipt();
          // } else {
          //   this.$message.error("当前状态不可退单！");
          // }
        }
      }
    },
    //修改安装状态接口
    installationstatusFun(data) {
      editInformCustomer(data)
        .then(res => {
          if (res.status == 200) {
            this.SET_PAYMENT(`修改安装状态${new Date().getTime()}`);
          }
        })
        .catch(error => {
          console.error("退回接单", error);
        });
    },
    //退回接单
    returnreceipt() {
      let data = {
        installationOrderId: this.choseArr[0].installationOrderId,
        installationOrderStatus: "0",
        source: this.choseArr[0].source,
        installationType: 1
      };
      this.$confirm("是否退回接单?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.installationstatusFun(data);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    //通知客户
    notifycustomers() {
      let arr = [];
      this.choseArr.forEach(item => {
        if (item.installationOrderStatus == 3) {
        }
        arr.push({
          installationOrderId: item.installationOrderId,
          installationOrderStatus: "4",
          customerPhone: item.customerPhone
        });
      });

      this.$confirm("确认通知客户?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        editInformUser(arr)
          .then(res => {
            if (res.status == 200) {
              this.$message.success("通知用户成功!");
              this.SET_PAYMENT(`通知用户${new Date().getTime()}`);
            }
          })
          .catch(error => {
            this.$message.error("通知用户", error);
          });
      });
    },
    //增加返厂
    returnconfirmation() {
      this.$refs.returnfactory.handleok();
      if (this.$refs.returnfactory.flag) {
        this.handleClose();
      }
    },
    //加急或取消加急
    urgentFun(sum) {
      let data = {
        installationOrderId: this.choseArr[0].installationOrderId,
        isSpeed: sum
      };
      editUrgent(data)
        .then(res => {
          if (res.status == 200) {
            this.SET_PAYMENT(`待处理加急${new Date().getTime()}`);
            if (sum == "1") {
              this.$message.success("加急成功！");
            } else {
              this.$message.success("取消加急成功！");
            }
          }
        })
        .catch(error => {
          console.error("加急和取消加急", error);
        });
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
.pendingdisposal {
  .table_action_span {
    text-align: left;
    margin-left: 25px;
  }
  .conetnBox {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .labelicon {
    padding: 2px 0px;
    background: #ff9900;
    color: #ffffff;
    font-size: 12px;
    width: 20px;
    height: 15px;
    line-height: 13px;
    margin: 10px 0 0 5px;
    font-style: normal;
    position: absolute;
    right: 28px;
    top: 9px;
  }
  .labelI::after {
    display: block;
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-right: 15px solid transparent;
    border-left: 16px solid transparent;
    border-bottom: 10px solid #ff9900;
    bottom: 13px;
    right: -6px;
    transform: rotate(0deg);
  }

  // 地图样式
  .baidumap {
    height: 550px;
    width: 100%;
  }
  .map_btn {
    position: absolute;
    z-index: 2;
    right: 105px;
    top: 15px;
  }
  .btn_list_1 {
    display: flex;
    width: 88%;
    flex-wrap: wrap;
    button {
      margin: 5px;
    }
  }
}
</style>
