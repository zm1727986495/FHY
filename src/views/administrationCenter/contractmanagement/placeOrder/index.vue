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
            <el-input placeholder="订单编号 采购合同号 姓名 电话 地址 采购单号 门店" v-model.trim="queryForm.searchText" clearable :size="size" @keyup.enter.native="searchFun"></el-input>
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
<!--          <el-col :span="5" v-show="isShow">-->
<!--            <el-select v-model="queryForm.storeId" clearable placeholder="所属门店" :size="size">-->
<!--              <el-option v-for="item in storeList" :value="item.storeId" :label="item.storeName" :key="item.code"></el-option>-->
<!--            </el-select>-->
<!--          </el-col>-->
          <el-col :span="5">
            <span class="more" @click="isShow=!isShow">{{isShow ? '收起' : '更多'}}</span>
            <el-button type="warning" class="button-fc" @click="searchFun" :size="size" :disabled="loading">查询</el-button>
            <el-button @click="resetQueryForm" type="primary" :size="size" :disabled="loading">重置</el-button>
          </el-col>
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
          <el-col :span="3" v-show="isShow">
            <el-select v-model="queryForm.contractType" clearable placeholder="单据类型" :size="size">
              <el-option v-for="item in contractTypeList" :value="item.code" :label="item.value" :key="item.code"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <div class="table_list" v-loading="loading">
          <el-table border :data="tableList" ref="multipleTable" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" :max-height="maxHeight">
            <!--<el-table-column align="center" type="selection" :selectable="selectable" fixed></el-table-column>-->
            <el-table-column align="center" type="index" fixed="left"></el-table-column>
            <el-table-column align="center" label="是否下单完成" width="140" show-overflow-tooltip sortable fixed="left">
              <template slot-scope="scope">
                <div>
                  <el-tooltip placement="right" visible-arrow >
                    <div slot="content" class="tips tipFon">
                      <p @click="handlePlaceOrder(scope.row)" class="operaItems" v-if="btn_placeOrder">下单</p>
                      <p @click="handleViewRecords(scope.row)" class="operaItems" v-if="btn_view">查看审核记录</p>
                      <p @click="handleViewAccessory(scope.row)" class="operaItems" v-if="btn_accessory">附件管理</p>
                      <p @click="handleAudit(scope.row)" class="operaItems">审核</p> <!-- v-if="scope.row.auditStatus == 3 && btn_audit"-->
                    </div>
                    <img :src="spot" alt="" class="attributesTips">
                  </el-tooltip>
                  <p class="operation">{{ scope.row.isSignOrder == 1 ? '是' : '否' }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="是否拆单" width="120" show-overflow-tooltip sortable fixed="left">
              <template slot-scope="scope">
                <p>{{ scope.row.isSplitOrder == 1 ? '是' : '否' }}</p>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="purchaseContractCode" label="采购合同号" width="160" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="customerName" label="客户姓名" width="140" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="customerPhone" label="客户电话" width="140" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="address" label="订单地址" width="250" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="urgentGq" label="工期加急" width="120" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="storeName" label="所属门店" width="200" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="brandName" label="品牌" width="120" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="categoryName" label="品类" width="120" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="orderNumber" label="订单号" width="140" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <el-button type="text" size="medium" @click="orderdetails(scope.row)">{{ scope.row.orderNumber }}</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="contractSerialNumber" label="客户合同号" width="150" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <el-button type="text" @click="handleViewContract(scope.row)">{{ scope.row.contractSerialNumber }}</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="orderType" label="订单类型" width="120" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="contractMoney" label="合同金额/元" width="150" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="specialDiscountName" label="折扣特批" width="120" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="otherPhone" label="备用电话" width="140" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="orderGoodsType" label="订单货品类型" width="140" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <p v-if="scope.row.orderGoodsType == 1">成品</p>
                <p v-else-if="scope.row.orderGoodsType == 2">定制品</p>
                <p v-else></p>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="salesmanName" label="销售员" width="120" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="designerName"  label="设计师" width="120" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="auditStatus" label="审核状态" width="140" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <p v-if="scope.row.auditStatus == 0">待审核</p>
                <p v-else-if="scope.row.auditStatus == 1">审核通过</p>
                <p v-else-if="scope.row.auditStatus == 2">图纸驳回</p>
                <p v-else-if="scope.row.auditStatus == 3">整单驳回</p>
                <p v-else-if="scope.row.auditStatus == 4">同意整单驳回</p>
                <p v-else-if="scope.row.auditStatus == 5">不同意整单驳回</p>
                <p v-else>-</p>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="auditClerkAt"  label="审单人" width="120" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="splitOrderAt"  label="拆单人" width="120" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="auditClerkTime" label="审单时间" width="170" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="splitOrderTime" label="拆单时间" width="170" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="drawingAuditStatus" label="图纸审核状态" width="140" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <p v-if="scope.row.drawingAuditStatus == 1">通过</p>
                <p v-if="scope.row.drawingAuditStatus == 2">图纸驳回</p>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="signingTime" label="签合同日期" width="170" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="predictInstallTime" label="预计安装日期" width="170" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="predictGq" label="设计签单工期" width="140" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="createAt" label="工期差/天" width="120" show-overflow-tooltip sortable></el-table-column>
            <el-table-column align="center" prop="settlementStatus" label="款清状态" width="120" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <p v-if="scope.row.settlementStatus == 1">款未清</p>
                <p v-else-if="scope.row.settlementStatus == 2">收费款清</p>
                <p v-else-if="scope.row.settlementStatus == 3">财务款清</p>
                <p v-else-if="scope.row.settlementStatus == 4">家装款清</p>
                <p v-else>-</p>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="orderRemark" label="备注" width="200" show-overflow-tooltip sortable></el-table-column>
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
    <el-dialog title="审核" :visible.sync="auditVisible" custom-class="customDialogTitle" :close-on-click-modal="closeOnClickModal" @before-close="closeModalFn">
      <el-form :model="auditForm" ref="auditForm" label-width="100px">
        <el-form-item label="审核">
          <el-radio-group v-model="auditForm.auditStatus">
            <el-radio :label="1">同意整单驳回</el-radio>
            <el-radio :label="2">不同意整单驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注">
          <el-input v-model="auditForm.auditOpinion" type="textarea" placehoder="请输入驳回原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="auditSubmit">确 定</el-button>
        <el-button @click="auditVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import breadcrumb from '@/views/components/breadcrumb';
  import pagination from '@/views/components/pagination';
  import { mapGetters } from 'vuex';
  import accessory from '@/views/administrationCenter/contractmanagement/components/accessory';
  import AuditRecords from '@/views/administrationCenter/contractmanagement/components/audit/AuditRecords';
  import spot from '@/assets/images/spot.png';
  import { listCustomerContractByPage, updateCustomerContract, auditDismissContract } from 'src/api/administrationCenter/contractmanagement/contractmanagement';
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
        btn_placeOrder: false,
        btn_view: false,
        btn_accessory: false,
        btn_audit: true,
        loading: true,
        isShow: false,
        spot,
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
          // { code: 0, value: '待审核' },
          { code: 1, value: '审核通过' },
          { code: 3, value: '整单驳回' },
          { code: 4, value: '同意整单驳回' },
          { code: 5, value: '不同意整单驳回' }
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
        contractTypeList: [
          { code: 1, value: '正单' },
          { code: 2, value: '上样单' }
        ],
        storeList: [],
        recordsVisible: false,
        accessoryVisible: false,
        queryForm: {
          searchText: '',
          signingTime: '',
          auditClerkTime: '',
          contractState: '',
          settlementStatus: '',
          isCheckBill: '',
          isSignOrder: '',
          isSplitOrder: '',
          drawingAuditStatus: '',
          contractType: 1
        },
        auditForm: {
          auditStatus: 1,
          auditOpinion: ''
        },
        orderId: '',
        contractId: '',
        btns: [4, 5, 6],
        auditVisible: false, // 审核弹出层
        closeOnClickModal: false
      }
    },
    // created() {
    //   this.getData();
    //   this.initBtnElements();
    //   // this.getStoreList();
    // },
    // mounted() {
    //   this.navList = this.$route.meta;
    // },
    activated(){
      this.getData();
      this.initBtnElements();
      // this.getStoreList();
      this.navList = this.$route.meta;
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    methods: {
      orderdetails(val){
        this.$router.push({path: "/ordermm/details", query:{orderId: val.orderId}})
      },
      // 获取按钮权限
      initBtnElements() {
        let element = JSON.parse(this.$loca.getItem('element'));
        this.btn_placeOrder = element['placeOrderContract:btn_placeOrder'];
        this.btn_view = element['placeOrderContract:btn_view'];
        this.btn_accessory = element['placeOrderContract:btn_accessory'];
        this.btn_audit = element['placeOrderContract:btn_audit'];
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
          auditType: 2,
          page: this.currentPage,
          limit: this.pageSize,
          contractType: this.queryForm.contractType
        };
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
        if (this.multipleSelection.length > 1) {
          this.$refs.multipleTable.toggleRowSelection(this.multipleSelection[0]);
        }
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
      // 下单
      handlePlaceOrder(row) {
        this.$router.push({
          path: '/contractmanagement/contractPlaceOrder',
          query: {
            contractId: row.customerContractId,
            orderId: row.orderId,
            storeId: row.storeId,
            contractType: row.contractType || '',
            auditType: 2,
            brandId: row.brandId,
            commodityCategoryId: row.commodityCategoryId
          }
        })
      },
      // 主管点击审核
      handleAudit(row) {
        this.auditForm.auditStatus = 1;
        this.auditForm.auditOpinion = '';
        this.orderId = row.orderId;
        this.contractId = row.customerContractId;
        this.auditVisible = true;
      },
      // 审核提交（主管）
      auditSubmit() {
        let params = {
          customerContractId: Number(this.contractId),
          auditStatus: this.auditForm.auditStatus,
          auditOpinion: this.auditForm.auditOpinion,
          orderId: this.orderId
        };
        auditDismissContract(params)
          .then(response => {
            if (response.status == 200) {
              this.$message.success('操作成功');
              this.auditVisible = false;
              this.getData();
            } else {
              this.$message.error(response.message || '操作失败');
            }
          })
          .catch(error => {
            console.log('views/administrationCenter/contractmanagement/components/audit/AuditInformation:auditSubmit' + error);
          });
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
        this.contractId = '';
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
