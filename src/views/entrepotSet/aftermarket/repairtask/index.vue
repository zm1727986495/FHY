<template>
  <div class="repairtask">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <searchinfo @get_List="getListFun" ref="searchinfo" @export_List='exportFun'></searchinfo>

      <div class="h-width"></div>

      <!-- 按钮组 -->
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

      <!-- 维修汇报日志弹框 -->
      <reportJournaldia :visible="report_vis" v-if="report_vis" :installationOrderId="installationOrderId" :designateInstallationId="designateInstallationId" 
      :isReport="isReport" @close_rep="closeAll" @close_rep_ok="closeAllGet"></reportJournaldia>

      <!-- 编辑维修任务弹框 -->
      <!-- <editreportdia :visible="edit_vis" @close_edit="closeAll"></editreportdia> -->

      <!-- 添加改制汇报弹框 -->
      <addreformdia :visible="addref_vis" v-if="addref_vis" :designateInstallationId="designateInstallationId" @close_addref="closeAll" @ok_addref="closeAllGet"></addreformdia>

      <!-- 撤销 -->
      <revokedia :visible="revokedia_vis" v-if="revokedia_vis" :installationOrderId="installationOrderId" 
      :designateInstallationId="designateInstallationId" @close_redia="closeAll" @closeok_redia="closeAllGet"></revokedia>

      <!-- 收费弹框 -->
      <chargedia :visible="charge_vis" v-if="charge_vis" :designateInstallationId="designateInstallationId" @close_charge="closeAll" @ok_charge="closeAllGet"></chargedia>

      <picPreviewDia :visible="pic_vis" :picList="picList" @close_pic="closeAll"></picPreviewDia>

      <!-- table表格 -->
      <div class="table_list lvs attribute m-top20">
        <el-table border :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" 
        :max-height="maxHeight" :row-key="getRowKeys" :data="tabList" style="width: 100%;">
          <el-table-column type="selection" width="40" fixed='left' :reserve-selection="true"></el-table-column>

          <el-table-column prop="purchaseContractCode" fixed='left' label="合同号" width="160" sortable align="center"></el-table-column>

          <el-table-column prop="isReport" label="状态" width="100" align="center">
            <!-- 0待安装 1待汇报 2汇报未完成 3  汇报已完成4已撤销 -->
            <template slot-scope="scope">
              <p v-if="scope.row.isReport == '0'">待安装</p>
              <p v-if="scope.row.isReport == '1'">待汇报</p>
              <p v-if="scope.row.isReport == '2'">汇报未完成</p>
              <p v-if="scope.row.isReport == '3'">汇报已完成</p>
              <p v-if="scope.row.isReport == '4'">已撤销</p>
            </template>
          </el-table-column>

          <el-table-column prop="appointmentTime" label="任务上门时间" width="160" sortable align="center"></el-table-column>

          <el-table-column prop="customerName" label="客户姓名" width="110" sortable align="center"></el-table-column>

          <el-table-column prop="customerPhone" label="客户电话" width="120" sortable align="center"></el-table-column>

          <el-table-column prop="address" label="订单地址" width="240" sortable show-overflow-tooltip align="center"></el-table-column>

          <el-table-column prop="designer" label="设计师" width="110" sortable align="center"></el-table-column>

          <el-table-column prop="reportName" label="汇报人姓名" width="110" align="center"></el-table-column>

          <el-table-column prop="reportContent" label="日志内容" width="240" align="center"></el-table-column>

          <el-table-column prop="leaderName" label="组长" width="120" sortable align="center"></el-table-column>

          <el-table-column prop="workerName" label="工人" width="120" sortable align="center"></el-table-column>

          <el-table-column prop="secondWorkerName" label="借调工人" width="120" sortable align="center"></el-table-column>

          <el-table-column prop="appointmentRemake" label="上门备注" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="deliveryNumber" label="派货数量" width="110" sortable align="center"></el-table-column>

          <el-table-column prop="assignedCADImg" label="CAD图" width="120" align="center">
            <template slot-scope="scope">
              <p class="table_action_span" @click="picPreview(scope.row.assignedCADImg)">图片预览</p>
            </template>
          </el-table-column>

          <el-table-column prop="designateInstallationPics" label="查看安装图片" width="120" align="center">
            <template slot-scope="scope">
              <p
                class="table_action_span"
                @click="picPreview(scope.row.designateInstallationPics)"
              >图片预览</p>
            </template>
          </el-table-column>

          <el-table-column prop="installationBeforPic" label="安装前照片" width="120" align="center">
            <template slot-scope="scope">
              <p class="table_action_span" @click="picPreview(scope.row.installationBeforPic)">图片预览</p>
            </template>
          </el-table-column>

          <el-table-column prop="installationAfterPic" label="安装后照片" width="120" align="center">
            <template slot-scope="scope">
              <p class="table_action_span" @click="picPreview(scope.row.installationAfterPic)">图片预览</p>
            </template>
          </el-table-column>

          <el-table-column prop="source" label="来源" width="80" align="center"></el-table-column>

          <el-table-column prop="isRetreat" label="是否允许退货" width="120" align="center">
            <template slot-scope="scope">
              <div>
                <p v-if="scope.row.isRetreat == 1">是</p>
                <p v-if="scope.row.isRetreat == 2">否</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="elementNumber" label="单元柜数量" width="120" sortable align="center"></el-table-column>

          <el-table-column prop="designateSource" label="安装单类型" width="110" align="center"></el-table-column>

          <el-table-column prop="designateInstallationTime" label="安装次数" width="110" sortable align="center"></el-table-column>

          <el-table-column prop="predictInstallationTime" label="预计安装日期" width="160" sortable align="center"></el-table-column>

          <el-table-column prop="firstInstallationTime" label="首次派工安装日期" width="160" sortable align="center"></el-table-column>

          <el-table-column prop="brandName" label="产品品牌" width="120" align="center"></el-table-column>

          <el-table-column prop="categoryName" label="产品类别" width="120" align="center"></el-table-column>

          <el-table-column prop="contractMoney" label="合同金额" width="120" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="派单员" width="110" align="center"></el-table-column>

          <el-table-column prop="designateInstallationNumber" label="任务编号" width="160" sortable align="center"></el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination_wrap">
        <pagination :current-page="currentPage" :pageSize="pageSize" :total="total" @sizeChange="sizeChange" @currentChange="currentChange"></pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import spot from "@/assets/images/spot.png";
import searchinfo from "./components/searchInfo"; //查询条件
import reportJournaldia from "./components/reportJournaldia"; //维修汇报
import editreportdia from "./components/editreportdia"; //编辑
import addreformdia from "./components/addreformdia"; //添加改制
import revokedia from "./components/revokedia";//撤销
import chargedia from "./components/chargedia"; //收费
import picPreviewDia from "@/views/components/picPreviewDia"; //图片预览
import module from "../../../../../config/index"; //导出文件
import { mapGetters,mapMutations } from "vuex";


import {
  listInstallJobs, //安装任务列表
  installationReportDetails, //安装任务回显
  editDesignateInstallation, //撤销
  chargeMoneyDetails //收费回显
} from "@/api/entrepotSet/aftermarket/repairtask/repairtask";

export default {
  components: {
    breadcrumb,
    pagination,
    searchinfo,
    reportJournaldia,
    editreportdia,
    addreformdia,
    picPreviewDia,
    revokedia,
    chargedia
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
      installationOrderId:"",//安装订单id
      designateInstallationId: "", //安装任务id
      isReport: "", //是否待汇报
      ruleForm: {}, //汇报回显信息
      ruleForm2: {}, //收费回显信息
      form:{},//查询条件的form
      elsectVal: [], //选中框
      picList: [], //照片集合
      tabList: [], //table数据
      actionBtnList: [
        //"导出", "维修汇报", "撤销", "添加改制", "收费", "定责"
        // {name:"导出",isShow:true,id:'1'},
        {name:"维修汇报",codename:'repairtaskl_hui',id:'2'},
        {name:"撤销",codename:'repairtaskl_del',id:'3'},
        {name:"收费",codename:'repairtaskl_add',id:'5'},
        {name:"定责",codename:'repairtaskl_duty',id:'6'},
        {name:"改制",codename:'repairtaskl_money',id:'4'},
      ],
      report_vis: false, //维修汇报日志弹框是否显示
      edit_vis: false, //编辑维修弹框是否显示
      addref_vis: false, //添加改制汇报弹框是否显示
      revokedia_vis: false,//撤销弹框是否显示
      charge_vis: false, //收费弹框是否显示
      pic_vis: false //照片预览弹框是否显示
    };
  },

  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.$refs["searchinfo"].searchFun();
  },
  computed: {
    ...mapGetters(["maxHeight"])
  },
  methods: {

    //导出方法
    exportFun(){
      if (this.elsectVal.length == 0) {
        this.$message.error("请勾选数据后再进行导出");
      } else {
        let data = this.elsectVal
          .map(item => {
            return item.designateInstallationId;
          })
          .join(",");
        window.location.href =
          module.dev.proxyTable["/api"].target +
          "/api/pc/designateInstallation/exportDesignateOutLibrary?designateInstallationIds=" +
          data;
      }
    },



    butGroupActions(index) {
      //导出
      if(index == '1'){
        if (this.elsectVal.length == 0) {
          this.$message.error("请勾选数据后再进行导出");
        } else {
          let data = this.elsectVal
            .map(item => {
              return item.designateInstallationId;
            })
            .join(",");
          window.location.href =
            module.dev.proxyTable["/api"].target +
            "/api/pc/designateInstallation/exportDesignateOutLibrary?designateInstallationIds=" +
            data;
        }
      }
      //维修汇报
      if(index == '2'){
        if (this.canonlyFun()) {
          this.getReportDetails();
        }
      }

      //撤销
      if(index == '3'){
        if (this.canonlyFun()) {
          this.editDesignate();
        }
      }

      //添加改制
      if(index == '4'){
        if (this.canonlyFun()) {
          //判断有没有安装（维修）汇报   待汇报无法添加改制
          if(this.elsectVal[0].isReport == "1"){
            this.$message.warning("待汇报无法添加改制");
            return;
          }
          //判断是否改制
          // if(this.elsectVal[0].isRemould != "1"){
          //   this.$message.warning("您维修汇报时选择了无需添加改制");
          //   return;
          // }
          this.designateInstallationId = this.elsectVal[0].designateInstallationId;
          this.addref_vis = true;
        }
      }

      //按钮收费
      if(index == '5'){
        if (this.canonlyFun()) {
          //判断有没有安装（维修）汇报   待汇报无法添加改制
          if(this.elsectVal[0].isReport == "1"){
            this.$message.warning("待汇报无法收费");
            return;
          }
          //判断是否收费
          // if(this.elsectVal[0].chargeType != "1"){
          //   this.$message.warning("您维修汇报时选择了无需收费");
          //   return;
          // }
          this.getChargeDetails();
        }
      }


      //定责
      if(index == '6'){
        if (this.canonlyFun()) {
          this.$router.push({
            path: "/duty/addduty",
            query: {
              orderId: this.elsectVal[0].orderId
            }
          });
        }
      }
    },

    //安装汇报
    getReportDetails() {
      this.installationOrderId = this.elsectVal[0].installationOrderId;
      this.designateInstallationId = this.elsectVal[0].designateInstallationId;
      this.isReport = this.elsectVal[0].isReport;
      this.report_vis = true;
    },

    //收费信息
    getChargeDetails() {
      this.designateInstallationId = this.elsectVal[0].designateInstallationId;
      this.charge_vis = true;
    },

    //撤销
    editDesignate() {
      if (this.canonlyFun()) {
        if (this.elsectVal[0].installationOrderStatus < 7) {
          this.installationOrderId = this.elsectVal[0].installationOrderId;
          this.designateInstallationId = this.elsectVal[0].designateInstallationId;
          this.revokedia_vis = true;
        } else {
          this.$message.error("该任务不能撤销");
        }
      }
    },

    //图片预览
    picPreview(list) {
      this.pic_vis = true;
      this.picList = list;
    },

    //获取任务列表
    getListFun(form) {
      this.currentPage = 1;
      this.form = form;
      this.getDataFun();
    },

    //获取任务列表
    getDataFun(){
      let data = {
        ...this.form,
        designateSource: "2", //来源  1安装  2售后
        page: this.currentPage,
        limit: this.pageSize
      };
      listInstallJobs(data).then(res => {
        this.total = res.data.total;
        this.tabList = res.data.rows;
      });
    },

    //关闭弹框
    closeAll() {
      this.report_vis = false;
      this.edit_vis = false;
      this.addref_vis = false;
      this.revokedia_vis = false;
      this.charge_vis = false;
      this.pic_vis = false;
    },
    closeAllGet() {
      this.closeAll();
      this.$refs["searchinfo"].searchFun();
    },

    //多选内容改变
    handleSelectionChange(val) {
      this.elsectVal = val;
    },
    getRowKeys(row) {
      return row.designateInstallationId;
    },
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
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
    },

    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getDataFun();
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getDataFun();
    }
  }
};
</script>
<style scoped lang='scss'>
.repairtask {
  .btn_list{
    display: flex;
    flex-wrap: wrap;
  }
}
</style>

