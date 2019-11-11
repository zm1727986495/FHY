<template>
  <div class="recommenman">
    <!-- 导航栏 -->
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <el-row :gutter="10" class="queryForm">
        <el-col :span="6">
          <el-input placeholder="违规单号/订单编号/客户合同号/判罚人/客户姓名/客户电话/订单地址" v-model="formline.names" size="medium" @keydown.enter.native="onSearch" clearable></el-input>
        </el-col>
        <el-col :span="5">
          <el-date-picker
            size="medium" v-model="searchData" type="daterange"
            value-format='yyyy-MM-dd' format='yyyy-MM-dd'
            start-placeholder="年/月/日" end-placeholder="年/月/日">
          </el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-select v-model="formline.illegalBillStatus" placeholder="违规单状态" size="medium" clearable filterable>
            <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="formline.illegalType" placeholder="违规类型" size="medium" clearable filterable @change="getRateList">
            <el-option v-for="item in illegalTypeList" :key="item.id" :label="item.dictName" :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="formline.illegalLevel" placeholder="违规等级" size="medium" clearable filterable>
            <el-option v-for="item in illegalLevelList" :key="item.id" :label="item.dictName" :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button class="button-fc" type="warning" size="medium" @click="onSearch">查询</el-button>
          <el-button type="primary" size="medium" @click="resetFun">重置</el-button>
        </el-col>
      </el-row>
      <div class="m-bottom10">
        <el-button size="small" class="button-96" @click="exportFun" :loading="exportLoading">
          导出
        </el-button>
        <el-button size="small" class="button-96" @click="resDisposal" v-if="btnJurisdiction.violations_resDisposal">
          责任人处理
        </el-button>
        <el-button size="small" class="button-96" @click="judgeDisposal"
                   v-if="btnJurisdiction.violations_judgeDisposal">判定人处理
        </el-button>
<!--        <el-button size="small" class="button-96" @click="flowChart" v-if="btnJurisdiction.violations_flowChart">查看流程图-->
<!--        </el-button>-->
        <el-button size="small" class="button-96" @click="auditRecords" v-if="btnJurisdiction.violations_record">审核记录
        </el-button>
        <el-button size="small" class="button-96" @click="penaGenerate" v-if="btnJurisdiction.violations_penaGenerate">
          生成处罚单
        </el-button>
        <el-button size="small" class="button-96" @click="penaltyRecord" v-if="btnJurisdiction.violations_record">
          处罚单记录
        </el-button>
      </div>
      <div class="table_list lvs attribute" v-loading="loading">
        <el-table max-height="460"
                  border
                  @row-click="rowClick"
                  :row-key="getRowKeys"
                  :row-class-name="tableRowClassName"
                  @selection-change="handleSelectionChange"
                  :data="tabList"
                  ref="multipleTable">
          <el-table-column type="selection" width="50" fixed='left'
                           align="center" :reserve-selection="true"></el-table-column>
          <el-table-column prop="illegalBillStatus" label="状态" width="120" sortable align="center"
                           :formatter="statusformatter" fixed='left'></el-table-column>
          <el-table-column prop="illegalBillSn" label="违规单号" width="140" sortable align="center" show-overflow-tooltip
                           fixed='left'>
            <template slot-scope="scope">
              <p class="operation table_action_span" @click="clickIlleaCode(scope.row)">{{scope.row.illegalBillSn}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="illegalTypeName" label="违规处罚类型" width="140" sortable align="center"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="illegalLevel" label="违规等级" width="140" sortable align="center"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="illegalDescribe" label="违规描述" width="240" sortable align="center"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" label="违规单判罚时间" width="180" sortable align="center"></el-table-column>
          <el-table-column prop="punishName" label="责任人" width="140" sortable align="center"
                           :formatter="punishformatter" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createName" label="判定人" width="140" sortable align="center"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="groupName" label="营销部门" width="120" sortable align="center"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="orderNumber" label="订单编号" show-overflow-tooltip width="140" sortable
                           align="center">
            <template slot-scope="scope">
              <p class="table_action_span" @click="orderdetails(scope.row)">{{scope.row.orderNumber}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="contractSerialNumber" label="客户合同号" show-overflow-tooltip width="140" sortable align="center">
            <template slot-scope="scope">
              <p class="table_action_span" @click="handleViewContract(scope.row)">{{ scope.row.contractSerialNumber }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="customerName" label="客户姓名" width="120" sortable align="center"></el-table-column>
          <el-table-column prop="customerPhone" label="客户电话" width="120" sortable align="center"></el-table-column>
          <el-table-column prop="otherPhone" label="备用电话" width="120" sortable align="center"></el-table-column>
          <el-table-column prop="address" label="订单地址" show-overflow-tooltip width="200" sortable
                           align="center"></el-table-column>
          <el-table-column prop="storeName" label="所属网点" show-overflow-tooltip width="150" sortable
                           align="center"></el-table-column>
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
    </el-card>
    <!-- 审核记录弹出框 -->
    <el-dialog title="审核管理" custom-class="customDialogTitle" :visible.sync="auditdialogVisible" width="50%">
      <div class="table_list lvs attribute m-top20">
        <el-table border :row-class-name="tableRowClassName" :data="tableData" style="width: 100%">
          <el-table-column prop="createName" label="操作人"></el-table-column>
          <el-table-column prop="createTime" label="操作时间"></el-table-column>
          <el-table-column prop="approveResult" show-overflow-tooltip label="操作结果"></el-table-column>
          <el-table-column prop="approveOpinion" show-overflow-tooltip label="备注"></el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="pagination_wrap">
        <pagination
          :current-page="currentPage1"
          :pageSize="pageSize1"
          :total="total1"
          @sizeChange="sizeChange1"
          @currentChange="currentChange1">
        </pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmAudit">确 定</el-button>
        <el-button @click="auditdialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="seeannexval" width="960px">
      <accessory
        v-if="seeannexval"
        :orderId="orderId"
        :accessoryTypes="accessoryTypes">
      </accessory>
    </el-dialog>
    <!-- 生成处罚单 -->
    <el-dialog v-if="punishVisible" custom-class="customDialogTitle" title="处罚单" :visible.sync="visible" width="50%"
               :close-on-press-escape="false"
               :close-on-click-modal="false"
               :show-close="false">
      <punishlist isPunish :elsectVal="elsectVal" ref="punishlist"></punishlist>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmFun">确 定</el-button>
        <el-button @click="punishVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import accessory from "@/views/administrationCenter/contractmanagement/components/accessory"//附件管理组件引入
  import pagination from "@/views/components/pagination";
  import breadcrumb from "@/views/components/breadcrumb";
  import seeannex from "../../../components/seeannex"; //查看附件
  import punishlist from "../components/punishlist"; // 生成处罚单
  import { getUUID, listBaseDict } from 'src/api/pulicJava';
  import {
    listIllegalBillByPage, // 获取违规单列表
    listPunishPeople, // 生成处罚单下的处罚人
    createPunishBill, // 生成处罚单
    auditRecords, // 申诉记录
  } from 'api/administrationCenter/puniManagement/punish';
  import module from '../../../../../config/index.js';
  import { getToken } from "utils/auth";
  export default {
    components: {
      breadcrumb,
      pagination,
      seeannex,
      punishlist,
      accessory
    },
    // name: 'puniManagement',
    data() {
      return {
        exportLoading: false,
        navList: [],//头部面包屑
        // 附件
        accessoryTypes: 1,
        orderId: 1,
        seeannexval: false,
        searchData: [], // 查询条件--时间
        formline: {
          names: '',
          illegalBillStatus: '', // 违规单状态
          illegalType: '', // 违规类型
          illegalLevel: '' // 违规等级
        },
        // 条件
        //  1 待处理 2 处理中 3 已确认 4 已撤销
        // 违规单状态 0 待处理 1 已确认 2 已申诉 3 已撤销
        stateList: [{
          label: '待处理', value: 0
        }, {
          label: '已确认', value: 1
        }, {
          label: '已申诉', value: 2
        }, {
          label: '已撤销', value: 3
        }],
        // 违规等级
        illegalLevelList: [],
        illegalTypeList: [],
        punisherlist: [],  // 生成处罚单的数据
        visible: true,
        auditdialogVisible: false, // 审核记录弹出框
        punishVisible: false, // 生成处罚单
        tableData: [], // 审核弹出框的表格数据
        btnJurisdiction: JSON.parse(this.$loca.getItem('element')),
        elsectVal: [], // 表格选中的数据
        tabList: [],  // table表格数据
        loading: true, // table的loading控制
        currentPage1: 1,
        pageSize1: 10,
        total1: 0,
        currentPage: 1,
        pageSize: 20,
        total: 0,
      };
    },
    activated(){
      let data = {
        page: this.currentPage,
        limit: this.pageSize
      };
      this.getList(data);
      // 获取违规等级
      this.getIllegalTypeList();
      this.navList = this.$route.meta;
      // this.getRateList();
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    // mounted() {
    //   // 头部面包屑
    //   this.navList = this.$route.meta;
    // },
    // created() {
    //   let data = {
    //     page: this.currentPage,
    //     limit: this.pageSize
    //   };
    //   this.getList(data);
    //   // 获取违规等级
    //   this.getIllegalTypeList();
    //   // this.getRateList();
    // },
    methods: {
      clickIlleaCode(rowData) {
        this.$router.push({
          path: 'viewdisposal',
          query: {
            contractId: rowData.customerContractId, // 合同详情
            orderId: rowData.orderId, // 订单详情
            illegalBillId: rowData.illegalBillId, // 违规id
            // illegalType: this.elsectVal[0].illegalTypeId, // 违规类型
          }
        });
      },
      getRowKeys(row) {
        return row.illegalBillId;
      },
      rowClick(row) {
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      // 生成处罚单下的处罚人
      listPunishPeople() {
        let data = {
          illegalBillId: this.elsectVal[0].illegalBillId,
        }
        listPunishPeople(data).then(res => {
          if (res.status == 200) {
            this.punisherlist = res.data;
            this.punishVisible = true; // 生成处罚单弹出框的flag
          }
        }).catch(error => {
          console.log('违规处罚管理:违规管理 生成处罚单 order/puniManagement/violations/index.vue', error);
        })
      },
      // 生成处罚单弹出框的确定操作按钮
      confirmFun() {
        let data = {
          illegalBillId: this.elsectVal[0].illegalBillId,
          punishId: this.$refs.punishlist.punishUserinfo.punishId,
          punishReason: this.$refs.punishlist.punishUserinfo.punishReason, // 处罚理由（详细）
          punishFormula: this.$refs.punishlist.punishUserinfo.punishFormula, // 处罚金额计算公式
          punishMoney: this.$refs.punishlist.punishUserinfo.punishMoney, // 处罚金额
          punishJob: this.$refs.punishlist.punishUserinfo.jobType, //  选择处罚人
          contractSerialNumber: this.elsectVal[0].contractSerialNumber, // 客户合同号
          punishDept: this.elsectVal[0].storeId // 被处罚部门    storeName
        };
        getUUID({serialNumber: 'PU'}).then(res => {
          if (res.status == 200) {
            data.punishBillSn = res.data; // 处罚单号
            createPunishBill(data).then(res => {
              if (res.status == 200) {
                this.$message({
                  message: '处罚单生成成功',
                  type: 'success'
                });
                this.punishVisible = false; // 生成处罚单弹出框关闭
              }
            }).catch(error => {
              this.punishVisible = false; // 生成处罚单弹出框关闭
              console.log('违规处罚管理:违规管理 order/puniManagement/components/punishlist.vue', error);
            })
          }
        })
        // "illegalBillId":"违规单ID",
        // "punishBillSn": "处罚单号",
        // "createTime": "开单日期",
        // "punishDept": "被处罚部门",
        // "punishId": "被处罚人ID",
        // "punishJob": "被处罚人职位",
        // "contractSerialNumber": "客户合同号",
        // "punishReason": "处罚理由（详细）",
        // "punishFormula": "处罚金额计算公式",
        // "punishMoney": "处罚金额"

      },
      // 获取违规类型
      getIllegalTypeList() {
        let data = {
          dataType: 'ILLEGAL_TYPE'
        }
        listBaseDict(data).then(res => {
          if (res.status == 200) {
            this.illegalTypeList = res.data;
          }
        }).catch(err => {
          console.log('违规处罚管理:违规管理 order/puniManagement/violations/index.vue', err);
        })
      },
      // 获取违规等级
      getRateList() {
        this.formline.illegalLevel = '';
        this.illegalLevelList = [];
        let data = {
          dataType: 'ILLEGAL_LEVEL'
        };
        if (this.formline.illegalType == 233) {
          data.belongId = 233;
        }
        listBaseDict(data).then(res => {
          if (res.status == 200) {
            this.illegalLevelList = res.data;
          }
        }).catch(err => {
          console.log('违规处罚管理:违规管理 order/puniManagement/violations/index.vue', err);
        })
      },
      // 状态
      statusformatter(row) {
        let status = '';
        //  1 待处理 2 处理中 3 已确认 4 已撤销
        switch (row.illegalBillStatus) {
          case "1" :
            status = '待处理';
            break;
          case "2" :
            status = '处理中';
            break;
          case "3" :
            status = '已确认';
            break;
          case "4" :
            status = '已撤销';
            break;
          default:
            status = '';
        }
        return status;
      },
      // 判罚人的格式进行处理
      punishformatter(row) {
        if (row.punishName) {
          return row.punishName.split(",").join("/");
        }
      },
      // 责任人处理
      resDisposal() {
        if (!this.warnMessage()) {
          return;
        }
        if (!(this.elsectVal[0].punishLogo == 1)) {
          this.$message({
            message: '抱歉，只有相关责任人才可进行处理',
            type: 'warning'
          });
          return;
        }
        this.$router.push({
          path: 'respondisposal',
          query: {
            contractId: this.elsectVal[0].customerContractId, // 合同详情
            orderId: this.elsectVal[0].orderId, // 订单详情
            illegalBillId: this.elsectVal[0].illegalBillId, // 违规id
            // illegalType: this.elsectVal[0].illegalTypeId, // 违规类型
          }
        });
      },
      // 判定人处理
      judgeDisposal() {
        if (!this.warnMessage()) {
          return;
        }
        if (!(this.elsectVal[0].proportionalLogo == 2)) {
          this.$message({
            message: '抱歉，只有相关判定人才可进行处理',
            type: 'warning'
          });
          return;
        }
        this.$router.push({
          path: 'judgedisposal',
          query: {
            contractId: this.elsectVal[0].customerContractId, // 合同详情
            orderId: this.elsectVal[0].orderId, // 订单详情
            illegalBillId: this.elsectVal[0].illegalBillId, // 违规id
            // illegalType: this.elsectVal[0].illegalTypeId, // 违规类型
          }
        });
      },
      // 审核记录弹出框的table
      auditRecords() {
        if (!this.warnMessage()) {
          return;
        }
        let data = {
          illegalBillId: this.elsectVal[0].illegalBillId,
          page: this.currentPage1,
          limit: this.pageSize1
        }
        auditRecords(data).then(res => {
          if (res.status == 200) {
            this.tableData = res.data.rows;
            this.total1 = res.data.total;
            this.auditdialogVisible = true;
          }
        }).catch(error => {
          console.log('违规处罚管理:违规管理  审核记录弹出框 administrationCenter/puniManagement/violations/index.vue', error);
        })
      },
      // 审核记录弹出框的确定按钮
      confirmAudit() {
        this.auditdialogVisible = false;
      },
      // 查看流程图的操作按钮1
      flowChart() {

      },
      // 附件管理
      attachManagement() {
        if (!this.warnMessage()) {
          return;
        } else {
          this.orderId = this.elsectVal[0].orderId;
          // console.log(this.orderId,"orderid 89899696");

          this.seeannexval = true;
        }
      },
      // 生成处罚单
      penaGenerate() {
        if (!this.warnMessage()) { // 选择的订单不是有且仅有一个
          return;
        }
        this.punishVisible = true; // 生成处罚单弹出框的flag
        // 生成处罚单的处罚人
        // this.listPunishPeople();
      },
      penaltyRecord() {
        if (this.elsectVal.length > 0) {
          this.$message.warning("请勿选择");
          return;
        }
        this.$router.push({
          path: 'punishment'
        });
      },
      // 搜索条件获取
      searchdatas() {
        return {
          names: this.formline.names,//订单编号
          decisionStartTime: this.searchData && this.searchData.length ? this.searchData[0] : '',//创建时间
          decisionEndTime: this.searchData && this.searchData.length ? this.searchData[1] : '',
          illegalBillStatus: this.formline.illegalBillStatus, // 违规单状态
          illegalType: this.formline.illegalType,
          illegalLevel: this.formline.illegalLevel, // 违规等级
          page: this.currentPage,
          limit: this.pageSize,
          token: getToken()
        };
      },
      onSearch() {    //搜索
        this.currentPage = 1;
        let data = this.searchdatas();
        this.getList(data);
      },
      // 重置
      resetFun() {
        this.currentPage = 1;
        this.formline = {
          names: '',
          illegalBillStatus: '', // 违规单状态
          illegalLevel: '' // 违规等级
        };
        this.searchData = [];
        let data = this.searchdatas();
        this.getList(data);
      },
      // 获取表格数据
      getList(data) {
        this.loading = true;
        listIllegalBillByPage(data).then(res => {
          if (res.status == 200) {
            this.total = res.data.total;
            this.tabList = res.data.rows;
            this.loading = false;
          }
        }).catch(error => {
          this.loading = false;
          console.log('违规处罚管理:违规管理 administrationCenter/puniManagement/violations/index.vue', error);
        })
      },
      // 分页函数回调
      currentChange(val) {
        this.currentPage = val;

        let data = this.searchdatas();
        this.getList(data);
      },
      // 单页条数改变
      sizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        let data = this.searchdatas();
        this.getList(data);
      },
      // 分页函数回调
      currentChange1(val) {
        this.currentPage1 = val;
        this.auditRecords();
      },
      // 单页条数改变
      sizeChange1(val) {
        this.currentPage1 = 1;
        this.pageSize1 = val;
        this.auditRecords();
      },
      // 表格勾选函数回调
      handleSelectionChange(val) {
        this.elsectVal = val;
      },
      // 表格选中警示信息 -- 只能选择一个订单并且必须选择
      warnMessage() {
        if (this.elsectVal.length > 1) {
          this.$message({
            message: '只能选择一个',
            type: 'warning'
          });
          return false;
        } else if (this.elsectVal.length < 1) {
          this.$message({
            message: '抱歉， 请进行选择',
            type: 'warning'
          });
          return false;
        }
        return true;
      },
      // 表格斑马线设置
      tableRowClassName({row, rowIndex}) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      // 导出
      exportFun() {
        this.exportLoading = true;
        let params = {
          names: this.formline.names,//订单编号
          decisionStartTime: this.searchData && this.searchData.length ? this.searchData[0] : '',//创建时间
          decisionEndTime: this.searchData && this.searchData.length ? this.searchData[1] : '',
          illegalBillStatus: this.formline.illegalBillStatus, // 违规单状态
          illegalType: this.formline.illegalType,
          illegalLevel: this.formline.illegalLevel, // 违规等级
          token: getToken()
        };
        if (this.elsectVal.length) {
          params.illegalBillIds = this.elsectVal.map(item => {
            return item.illegalBillId;
          }).join(',');
        }
        let paramsStr = '';
        for (let keys in params) {
          paramsStr += (keys + '=' + params[keys] + '&');
        }
        paramsStr = paramsStr.substr(0, paramsStr.length - 1);
        let URLS = module.dev.proxyTable['/api'].target + '/api/pc/illegalBill/exportIllegalBillList?' + paramsStr;
        window.location.href = URLS;
        this.exportLoading = false;
      },
      // 订单详情
      orderdetails(val){
        this.$router.push({path: "/ordermm/details", query:{orderId: val.orderId, orderNumber: val.orderNumber}})
      },
      // 查看合同信息
      handleViewContract(row) {
        this.$router.push({
          path: '/contractmanagement/contractView',
          query: {
            contractId: row.customerContractId,
            orderId: row.orderId
          }
        })
      }
    }
  };
</script>

