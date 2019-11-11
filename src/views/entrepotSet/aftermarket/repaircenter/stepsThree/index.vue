<template>
  <div class="stepsThree">
    <!-- 查询条件组 -->
    <baidu-map class="baidumap" :center="center" :zoom="12" :keyboard="true" :scroll-wheel-zoom="true" :double-click-zoom="false" v-if="mapShow">
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <bm-point-collection :points="points" shape="BMAP_POINT_SHAPE_SQUARE" color="red" size="BMAP_POINT_SIZE_BIG" 
      @click="clickHandler" @mouseover="mouseoverHandler"></bm-point-collection>
      <bm-info-window :position="position" title="订单信息" :height="0" :show="infoWindow.show" @close="infoWindowClose">
        <p v-html="infoWindow.contents" style="height:100px;"></p>
      </bm-info-window>
    </baidu-map>

    <!-- 按钮 -->
    <!-- <div class="btn_list_1">
      <div v-for="(item,index) in actionBtnList" :key="index">
        <el-button class="button-96" size="small" v-if="item.isShow" @click="butGroupActions(item.id)">{{item.name}}</el-button>
      </div>
    </div> -->

    <div class="btn_list">
      <div v-for="(item,index) in actionBtnList" :key="index" >
        <el-button
        v-if="btnJurisdiction[item.codename]"
        type="default"
        size="small"
        class="button-96 m-left10 m-top5"
        @click="butGroupActions(item.id)"
        >{{item.name}}</el-button>
      </div>
    </div>

    <!-- 协同单查询 -->
    <el-dialog title="查看协同订单" :visible.sync="collabodia_vis" width="50%" :before-close="handleClose" custom-class="customDialogTitle">
      <collaborationsheet v-if="collabodia_vis" :choseArr="elsectVal"></collaborationsheet>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 返厂 -->
    <returnfactory v-if="isReturnfactory" :isReturnfactory="isReturnfactory" :choseArr="elsectVal" @handleClose="handleClose"></returnfactory>

    <!-- table表格 -->
    <div class="table_list lvs attribute m-top20" v-loading='loading'>
      <el-table id="pathtabs_table1" ref="multipleTable" border :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" 
      :max-height="maxHeight" :data="tabList" style="width: 100%;">
        <el-table-column type="selection" width="40" fixed='left'></el-table-column>
        <el-table-column prop="purchaseContractCode" fixed='left' label="采购合同号" width="180" sortable align="center">
          <template slot-scope="scope">
            <div>
              <el-tooltip placement="right" visible-arrow>
                <div slot="content" class="tips tipFon">
                  <p class="operaItems" @click="info1(scope.row)">查看</p>
                  <p class="operaItems" @click="phoneFun(scope.row)">电话指导完成</p>
                </div>
                <img :src="spot" alt class="attributesTips" />
              </el-tooltip>
              <p
                class="table_action_span"
                @dblclick="info2(scope.row)"
              >{{scope.row.purchaseContractCode}}</p>
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
        
        <el-table-column align="center" prop="installCompleteTime" label="完成时间" width="160"></el-table-column>

        <el-table-column align="center" prop="completionTime" label="回访时间" width="160"></el-table-column>

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
import collaborationsheet from "@/views/Installation/dispatchcenter/components/collaborationsheet"; //协同单查询
import returnfactory from "@/views/Installation/dispatchcenter/components/returnfactory";//返厂

import { mapMutations } from "vuex";

import spot from "@/assets/images/spot.png";
import { totalmem } from 'os';
export default {
  props: ["tabList","mapShow","maxHeight",'loading'],
  components: {
    breadcrumb,
    pagination,
    returnfactory,
    collaborationsheet
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

      elsectVal: [], //选中框
      // tabList: [], //table数据
      actionBtnList: [
        {name:"协同单查询",codename:'repaircentero_same',id:'1'},
        {name:"赔偿",codename:'repaircentero_pei',id:'2'},
        {name:"返厂",codename:'repaircenter_fanchang',id:'3'},
        {name:"退货退款",codename:'repaircenter_tuitui',id:'4'}
      ],
      collabodia_vis: false, //协同单查询弹框是否显示
      isReturnfactory: false, //返厂弹框是否显示

      center: { lng: 116.404, lat: 39.915 }, //地图默认中心
      position: { lng: 116.404, lat: 39.915 }, //地图弹框的位置
      infoWindow: {
        show: false,
        contents: "....."
      },
      points: [], //海量点数组
    };
  },

  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {
    ...mapMutations(["SET_REPAIRCENTER"]),
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

    //跳转查看信息
    info1() {
      this.$router.push({ path: "/aftermarket/aftermarketdetails" });
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

    //查询按钮获取
    getListFun(form) {
      console.log(form);
    },
    butGroupActions(index) {
      //协同单查询
      if(index == '1'){
        if (this.canonlyFun()) {
          this.collabodia_vis = true;
        }
      }

      //发起赔偿
      if(index == '2'){
        if (this.canonlyFun()) {
          this.$router.push({
            path: "/compensationmanage/addcompensation",
            query: {
              orderId: this.elsectVal[0].orderId
            }
          });
        }
      }

      //返厂
      if(index == '3'){
        if (this.canonlyFun()) {
          this.isReturnfactory = true;
        }
      }

      


      if (index == '4') {
        if (this.canonlyFun()) {
          this.$router.push({path:'/regoodspermit/addapplication',query:{orderId:this.elsectVal[0].orderId}})
        }
      }
    },

    //关闭弹框
    handleClose() {
      this.collabodia_vis = false; //协同单查询弹框是否显示
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
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },

    //多选内容改变
    handleSelectionChange(val) {
      this.elsectVal = val;
    }
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
  }
};
</script>
<style scoped lang='scss'>
.stepsThree {
  .baidumap {
    height: 550px;
    width: 100%;
  }
  .map_btn {
    position: absolute;
    z-index: 2;
    right: 105px;
    top: 36px;
  }
  .btn_list{
    display: flex;
    flex-wrap: wrap;
  }
  .table_action_span {
    text-align: left;
    margin-left: 25px;
  }
}
</style>

