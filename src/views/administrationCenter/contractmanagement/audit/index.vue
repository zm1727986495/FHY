<template>
  <div class="wrapper lvs">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <!-- 查询条件组 -->
      <el-card>
        <el-row :gutter="10" class="queryForm">
          <el-col :span="7">
            <el-input placeholder="订单编号 采购合同号 姓名 电话 地址 门店" v-model.trim="queryForm.searchText" clearable :size="size" @keyup.enter.native="searchFun"></el-input>
          </el-col>
          <el-col :span="6">
            <el-date-picker
              :size="size"
              v-model="queryForm.signingTime"
              type="daterange"
              start-placeholder="签订开始日期"
              end-placeholder="签订结束日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-col>
          <el-col :span="6">
            <el-date-picker
              :size="size"
              v-model="queryForm.auditClerkTime"
              type="daterange"
              start-placeholder="审核开始日期"
              end-placeholder="审核结束日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-col>
          <el-col :span="5">
            <span class="more" @click="isShow=!isShow">{{isShow ? '收起' : '更多'}}</span>
            <el-button type="warning" class="button-fc" @click="searchFun" :size="size" :disabled="loading">查询</el-button>
            <el-button @click="resetQueryForm" type="primary" :size="size" :disabled="loading">重置</el-button>
          </el-col>
<!--          <el-col :span="5" v-show="isShow">-->
<!--            <el-select v-model="queryForm.storeId" clearable placeholder="所属门店" :size="size">-->
<!--              <el-option v-for="item in storeList" :value="item.storeId" :label="item.storeName" :key="item.code"></el-option>-->
<!--            </el-select>-->
<!--          </el-col>-->
          <el-col :span="3" v-show="isShow">
            <el-select v-model="queryForm.contractState" clearable placeholder="合同审核状态" :size="size">
              <el-option v-for="item in contractStateList" :value="item.code" :label="item.value" :key="item.code"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3" v-show="isShow">
            <el-select v-model="queryForm.drawingAuditStatus" clearable placeholder="图纸审核状态" :size="size">
              <el-option v-for="item in drawingAuditStatusList" :value="item.code" :label="item.value" :key="item.code"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3" v-show="isShow">
            <el-select v-model="queryForm.settlementStatus" clearable placeholder="款清状态" :size="size">
              <el-option v-for="item in settlementStatusList" :value="item.code" :label="item.value" :key="item.code"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3" v-show="isShow">
            <el-select v-model="queryForm.isCheckBill" clearable placeholder="对账完成状态" :size="size">
              <el-option v-for="item in radioList" :value="item.code" :label="item.value" :key="item.code"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3" v-show="isShow">
            <el-select v-model="queryForm.isSignOrder" clearable placeholder="下单完成状态" :size="size">
              <el-option v-for="item in radioList" :value="item.code" :label="item.value" :key="item.code"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3" v-show="isShow">
            <el-select v-model="queryForm.isSplitOrder" clearable placeholder="是否拆单" :size="size">
              <el-option v-for="item in radioList" :value="item.code" :label="item.value" :key="item.code"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <div class="m-bottom10">
          <el-button type="primary" class="button-96" size="small" @click="exportCustomerContractData" :loading="exportLoading">导出</el-button>
        </div>
        <div class="table_list" v-loading="loading">
          <el-table border :data="tableList" ref="multipleTable" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" :max-height="maxHeight" id="out-table">
            <el-table-column align="center" type="selection" fixed></el-table-column>
            <el-table-column align="center" type="index" fixed="left" width="40"></el-table-column>
            <el-table-column align="center" prop="settlementStatus" label="款清状态" width="120" show-overflow-tooltip sortable fixed="left">
              <template slot-scope="scope">
                <div>
                  <el-tooltip placement="right" visible-arrow >
                    <div slot="content" class="tips tipFon">
                      <p @click="handleAudit(scope.row)" class="operaItems" v-if="btn_audit">审核</p>
                      <p @click="handleViewRecords(scope.row)" class="operaItems" v-if="btn_view">查看审核记录</p>
                      <p @click="handleViewAccessory(scope.row)" class="operaItems" v-if="btn_accessory">附件管理</p>
                    </div>
                    <img :src="spot" alt="" class="attributesTips">
                  </el-tooltip>
                  <p class="operation">
                    <span v-if="scope.row.settlementStatus == 1">款未清</span>
                    <span v-if="scope.row.settlementStatus == 2">收费款清</span>
                    <span v-if="scope.row.settlementStatus == 3">财务款清</span>
                    <span v-if="scope.row.settlementStatus == 4">家装款清</span>
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="auditStatus" label="审核状态" width="140" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <p class="operation">
                  <span v-if="scope.row.auditStatus == 0">待审核</span>
                  <span v-else-if="scope.row.auditStatus == 1">审核通过</span>
                  <span v-else-if="scope.row.auditStatus == 2">图纸驳回</span>
                  <span v-else-if="scope.row.auditStatus == 3">整单驳回</span>
                  <span v-else-if="scope.row.auditStatus == 4">同意整单驳回</span>
                  <span v-else-if="scope.row.auditStatus == 5">不同意整单驳回</span>
                  <span v-else></span>
                </p>
              </template>
            </el-table-column>
            <el-table-column align="center" label="是否拆单" width="120" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <p>{{ scope.row.isSplitOrder == 1 ? '是' : '否' }}</p>
              </template>
            </el-table-column>
            <el-table-column align="center" label="是否违规" width="120" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <p>{{ scope.row.existIllegalBill == 1 ? '是' : '否' }}</p>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="storeName" label="所属门店" width="200" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="signingMode" label="合同签署方式" width="150" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <p v-if="scope.row.signingMode == 1">公众号</p>
                <p v-if="scope.row.signingMode == 2">销售代签</p>
                <p v-if="scope.row.signingMode == 3">App代签</p>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="customerName" label="客户姓名" width="140" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="customerPhone" label="客户电话" width="140" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="address" label="订单地址" width="250" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="contractMoney" label="合同金额/元" width="150" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="activityName" label="活动" width="150" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="specialDiscountName" label="折扣特批" width="120" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="urgentGq" label="工期加急" width="120" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="createAt" label="工期差/天" width="120" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" label="是否下单完成" width="140" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <p>{{ scope.row.isSignOrder == 1 ? '是' : '否' }}</p>
              </template>
            </el-table-column>
            <el-table-column align="center" label="是否对账完成" width="140" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <p>{{ scope.row.isCheckBill == 1 ? '是' : '否' }}</p>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="contractSerialNumber" label="客户合同号" width="150" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <p class="table_action_span" @click="handleViewContract(scope.row)">{{ scope.row.contractSerialNumber }}</p>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="brandName" label="品牌" width="120" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="categoryName" label="品类" width="120" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="orderNumber" label="订单号" width="140" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <p class="table_action_span" @click="orderdetails(scope.row)">{{ scope.row.orderNumber }}</p>
<!--                <el-button type="text" size="medium">{{ scope.row.orderNumber }}</el-button>-->
              </template>
            </el-table-column>
            <el-table-column align="center" prop="orderType" label="订单类型" width="120" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="otherPhone" label="备用电话" width="140" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="orderGoodsType" label="订单货品类型" width="140" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <p v-if="scope.row.orderGoodsType == 1">成品</p>
                <p v-else-if="scope.row.orderGoodsType == 2">定制品</p>
                <p v-else>-</p>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="salesmanName" label="销售员" width="120" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="designerName"  label="设计师" width="120" show-overflow-tooltip sortable></el-table-column>
<!--            <el-table-column align="center" prop="auditAtName"  label="审核人" width="120" show-overflow-tooltip sortable></el-table-column>-->
            <el-table-column align="center" prop="auditClerkAt"  label="审单人" width="120" show-overflow-tooltip sortable></el-table-column>
<!--            <el-table-column align="center" prop="auditTime" label="审核时间" width="170" show-overflow-tooltip sortable></el-table-column>-->
            <el-table-column align="center" prop="auditClerkTime" label="审单时间" width="170" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="drawingAuditStatus" label="图纸审核状态" width="140" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <p v-if="scope.row.drawingAuditStatus == 1">通过</p>
                <p v-else-if="scope.row.drawingAuditStatus == 2">图纸驳回</p>
                <p v-else>-</p>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="signingTime" label="签合同日期" width="170" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="settlementTime" label="款清时间" width="170" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="predictInstallTime" label="预计安装日期" width="170" show-overflow-tooltip sortable></el-table-column>
            <!--            <el-table-column align="center" prop="predictGq" label="设计签单工期" width="140" show-overflow-tooltip sortable></el-table-column>-->
            <el-table-column align="center" prop="orderRemark" label="备注" width="200" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="contractAuditRecord" label="审核备注" width="200" show-overflow-tooltip sortable></el-table-column>
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
    </div>
    <el-dialog title="附件管理" :visible.sync="accessoryVisible" width="960px" class="customDialogTitle" @before-close="closeModalFn">
      <accessory :accessory-types="5" :btns="btns" :is-dialog="true" :orderId="orderId" :contractId="contractId" v-if="accessoryVisible"></accessory>
    </el-dialog>
    <el-dialog title="审核记录" :visible.sync="recordsVisible" width="960px" custom-class="customDialogTitle" @before-close="closeModalFn">
      <AuditRecords class="unsortable" :orderId="orderId" :contractId="contractId" v-if="recordsVisible"></AuditRecords>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="recordsVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import breadcrumb from '@/views/components/breadcrumb';
  import pagination from '@/views/components/pagination';
  import accessory from "@/views/administrationCenter/contractmanagement/components/accessory";
  import AuditRecords from "@/views/administrationCenter/contractmanagement/components/audit/AuditRecords";
  import spot from '@/assets/images/spot.png';
  import { mapGetters } from 'vuex';
  import module from '../../../../../config/index';
  import { listCustomerContractByPage, dismissCustomerContract, updateCustomerContract, verifyDirector, exportCustomerContract } from 'src/api/administrationCenter/contractmanagement/contractmanagement';
  import { getToken } from "utils/auth";
  import { listLoginUserStore } from '@/api/pulicJava';
  export default {
    components: {
      breadcrumb,
      pagination,
      accessory,
      AuditRecords
    },
    data() {
      return {
        btn_audit: false,
        btn_view: false,
        btn_accessory: false,
        loading: true,
        isShow: false, // 搜索条件 更多
        exportLoading: false,
        spot,
        columnWidth: 180,
        closeOnClickModal: false,
        navList: [],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 3600 * 24 * 1000;
          }
        },
        status: [],
        tableList: [],
        currentPage: 1,
        pageSize: 20,
        total: 0,
        multipleSelection: [],
        actionBtnList: [
          { name: '审核', style: 'default', url: '/contractmanagement/contractAudit', type: 1 },
          { name: '查看审核记录', style: 'default', url: '', type: 2 },
          { name: '附件管理', style: 'default', url: '', type: 3 }
        ],
        contractStateList: [
          { code: 0, value: '待审核' },
          { code: 1, value: '审核通过' },
          { code: 3, value: '整单驳回' }
        ],
        drawingAuditStatusList: [
          { code: 1, value: '通过' },
          { code: 2, value: '图纸驳回' }
        ],
        radioList: [
          { code: 1, value: '是' },
          { code: 0, value: '否' }
        ],
        settlementStatusList: [
          { code: 1, value: '款未清' },
          { code: 2, value: '收费款清' },
          { code: 3, value: '财务款清' },
          { code: 4, value: '家装合同款清' }
        ],
        storeList: [],
        recordsVisible: false,
        accessoryVisible: false,
        auditVisible: false,
        queryForm: {
          searchText: '',
          signingTime: '',
          auditClerkTime: '',
          contractState: 0,
          settlementStatus: '',
          isCheckBill: '',
          isSignOrder: '',
          isSplitOrder: '',
          drawingAuditStatus: ''
        },
        auditForm: {
          auditStatus: 1,
          remarks: ''
        },
        isDirector: this.$loca.getItem('userRole'),
        orderId: '', // 订单id,
        contractId: '', // 合同id
        btns: [6, 5, 4]
      }
    },
    // created() {
    //   // this.getRole();
    //   this.getData();
    //   this.initBtnElements();
    //   // this.getStoreList();
    // },
    // mounted() {
    //   this.navList = this.$route.meta;
    // },
    activated(){
      this.navList = this.$route.meta;
      // this.getRole();
      this.getData();
      this.initBtnElements();
      // this.getStoreList();
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    methods: {
      // 获取按钮权限
      initBtnElements() {
        let element = JSON.parse(this.$loca.getItem('element'));
        this.btn_audit = element['auditContract:btn_audit'];
        this.btn_view = element['auditContract:btn_view'];
        this.btn_accessory = element['auditContract:btn_accessory'];
      },
      currentChange(val) {
        this.currentPage = val;
        this.getData();
      },
      sizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        this.getData();
      },
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      // 按钮组函数
      butGroupAction(url, type) {
        if (type === 1) {
          // 审核
        }
        if (type == 2) {
          // 查看审核记录
        }
        if (type == 3) {
          // 附件管理
        }
      },
      // 获取角色
      getRole() {
        verifyDirector().then(response => {
          this.$loca.setItem('userRole', response.message);
        })
          .catch(error => {
            console.log('views/login/index.vue:verifyDirector' + error);
          });
      },
      // 获取全部门店
      getStoreList() {
        listLoginUserStore()
          .then(response => {
            this.storeList = response.data;
          })
          .catch(error => {
            console.log('views/administrationcenter/contractmanagement/audit/index:getStoreList' + error);
          });
      },
      // 获取列表信息
      getData() {
        this.loading = true;
        let params = {
          searchText: this.queryForm.searchText,
          signingTimeStart: this.queryForm.signingTime ? this.queryForm.signingTime[0] : '',
          signingTimeEnd: this.queryForm.signingTime ? this.queryForm.signingTime[1] : '',
          auditClerkTimeStart: this.queryForm.auditClerkTime ? this.queryForm.auditClerkTime[0] : '',
          auditClerkTimeEnd: this.queryForm.auditClerkTime ? this.queryForm.auditClerkTime[1] : '',
          auditStatus: this.queryForm.contractState,
          settlementStatus: this.queryForm.settlementStatus,
          isCheckBill: this.queryForm.isCheckBill,
          isSignOrder: this.queryForm.isSignOrder,
          isSplitOrder: this.queryForm.isSplitOrder,
          drawingAuditStatus: this.queryForm.drawingAuditStatus,
          auditType: 1,
          page: this.currentPage,
          limit: this.pageSize,
          contractType: 1
        };
        if (this.isDirector == 1) {
          params.isDirector = 1;
        }
        listCustomerContractByPage(params)
          .then(response => {
            this.loading = false;
            const result = response.data;
            this.tableList = result.rows;
            this.total = result.total;
          })
          .catch(error => {
            this.loading = false;
            console.log('views/administrationcenter/contractmanagement/audit/index.vue:getData' + error);
          });
      },
      // 查询按钮点击
      searchFun() {
        this.currentPage = 1;
        this.getData();
      },
      // 重置
      resetQueryForm() {
        this.currentPage = 1;
        this.queryForm.searchText = '';
        this.queryForm.signingTime = '';
        this.queryForm.auditClerkTime = '';
        this.queryForm.contractState = '';
        this.queryForm.settlementStatus = '';
        this.queryForm.isCheckBill = '';
        this.queryForm.isSignOrder = '';
        this.queryForm.isSplitOrder = '';
        this.queryForm.drawingAuditStatus = '';
        this.getData();
      },
      // 是否可选
      selectable(row, index) {
        return true
      },
      // 勾选函数回调
      handleSelectionChange(val) {
        this.multipleSelection = val;
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
      },
      // 审核
      handleAudit(row) {
        // if (this.isDirector == 1 && row.auditStatus == 3) {
        //   this.contractId = row.customerContractId;
        //   this.auditVisible = true;
        // } else {
        //   this.$router.push({
        //     path: '/contractmanagement/contractAudit',
        //     query: {
        //       contractId: row.customerContractId,
        //       orderId: row.orderId,
        //       storeId: row.storeId,
        //       billType: row.billType || '',
        //       auditType: 1
        //     }
        //   })
        // }
        this.$router.push({
          path: '/contractmanagement/contractAudit',
          query: {
            contractId: row.customerContractId,
            orderId: row.orderId,
            storeId: row.storeId,
            billType: row.billType || '',
            auditType: 1
          }
        })
      },
      // 附件管理
      handleViewAccessory(row) {
        this.orderId = row.orderId;
        this.contractId = row.customerContractId;
        this.accessoryVisible = true;
      },
      // 查看审核记录
      handleViewRecords(row) {
        this.orderId = row.orderId;
        this.contractId = row.customerContractId;
        this.recordsVisible = true;
        this.tabActive = 1;
      },
      // 关闭列表页所有弹出层
      closeModalFn() {
        this.orderId = '';
      },
      // 导出
      exportCustomerContractData() {
        this.exportLoading = true;
        let params = {
          searchText: this.queryForm.searchText,
          signingTimeStart: this.queryForm.signingTime ? this.queryForm.signingTime[0] : '',
          signingTimeEnd: this.queryForm.signingTime ? this.queryForm.signingTime[1] : '',
          auditClerkTimeStart: this.queryForm.auditClerkTime ? this.queryForm.auditClerkTime[0] : '',
          auditClerkTimeEnd: this.queryForm.auditClerkTime ? this.queryForm.auditClerkTime[1] : '',
          auditStatus: this.queryForm.contractState,
          settlementStatus: this.queryForm.settlementStatus,
          isCheckBill: this.queryForm.isCheckBill,
          isSignOrder: this.queryForm.isSignOrder,
          isSplitOrder: this.queryForm.isSplitOrder,
          drawingAuditStatus: this.queryForm.drawingAuditStatus,
          auditType: 1,
          page: this.currentPage,
          limit: this.pageSize,
          contractType: 1,
          token: getToken()
        };
        if (this.multipleSelection.length) {
          params.customerContractIds = this.multipleSelection.map(item => {
            return item.customerContractId;
          }).join(',');
        }
        let paramsStr = '';
        for (let keys in params) {
          paramsStr += (keys + '=' + params[keys] + '&');
        }

        paramsStr = paramsStr.substr(0, paramsStr.length - 1);
        let URLS = module.dev.proxyTable['/api'].target + '/api/pc/customerContract/exportCustomerContract?' + paramsStr;
        window.location.href = URLS;
        this.exportLoading = false;
      },
      // 跳到订单详情
      orderdetails(val){
        this.$router.push({path: "/ordermm/details", query:{orderId: val.orderId}})
      }
    },
    computed: {
      ...mapGetters([
        'maxHeight',
        'size',
        'btnSize',
        'span'
      ])
    }
  }
</script>

