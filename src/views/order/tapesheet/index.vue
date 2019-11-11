<template>
  <div class="wrapper lvs">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <!-- 查询条件组 -->
      <el-card>
        <el-row class="queryForm" :gutter="10">
            <el-col :span="6">
              <el-input placeholder="订单编号 客户合同号 客户姓名 客户电话 订单地址 带单人 接单人" v-model.trim="queryForm.names" clearable :size="size" @keyup.enter.native="searchFun"></el-input>
            </el-col>
            <el-col :span="6">
              <el-date-picker :size="size"
                v-model="queryForm.dateRange"
                type="daterange"
                :start-placeholder="tabActive == 'tab1' ? '带单开始日期' : '接单开始日期'"
                :end-placeholder="tabActive == 'tab1' ? '带单结束日期' : '接单结束日期'"
                value-format="yyyy-MM-dd"
                @change="timeFn">
              </el-date-picker>
            </el-col>
            <el-col :span="span">
              <el-select v-model="queryForm.assistStatus" placeholder="选择状态" clearable :size="size" filterable>
                <el-option v-for="item in statusList" :key="item.code" :label="item.value" :value="item.code"></el-option>
              </el-select>
            </el-col>
            <el-col :span="span">
              <el-select v-model="queryForm.storeId" placeholder="选择门店" clearable :size="size" filterable>
                <el-option v-for="item in storeList" :key="item.storeId" :label="item.storeName" :value="item.storeId"></el-option>
              </el-select>
            </el-col>
            <el-col :span="span">
              <el-button @click="searchFun" class="button-fc" type="warning" :size="size" :disabled="loading">查询</el-button>
              <el-button @click="resetQueryForm" type="primary" :size="size" :disabled="loading">重置</el-button>
            </el-col>
          </el-row>
        <el-tabs type="border-card" v-model="tabActive" @tab-click="tabClick">
          <el-tab-pane label="带单管理" name="tab1" :lazy="true">
            <div class="m-bottom15">
              <el-button v-for="(item,index) in actionBtnList" :type="item.style" size="small" class="button-96" @click="butGroupAction(item.url,item.type)" :key="index" v-if="item.isHashAuthority">{{item.name}}</el-button>
            </div>
            <div class="table_list" v-loading="loading">
              <el-table border :data="assistOrderList" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" :max-height="maxHeight">
                <el-table-column type="selection" align="center" width="55" fixed="left" :selectable="selectable"></el-table-column>
                <el-table-column align="center" label="带单状态" width="120" sortable fixed="left">
                  <template slot-scope="scope">
                    <span v-if="scope.row.assistStatus == 1">待接单</span>
                    <span v-else-if="scope.row.assistStatus == 2">已接单</span>
                    <span v-else-if="scope.row.assistStatus == 3">已拒绝</span>
                    <span v-else>-</span>
                  </template>
                </el-table-column>
                <el-table-column prop="assistOrderNo" align="center" label="带单订单号" width="150" sortable>
                  <template slot-scope="scope">
                    <el-button type="text" @click="toOrderDetail(scope.row.orderId,scope.row.assistOrderNo)">{{ scope.row.assistOrderNo }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="assistNo" align="center" label="带单号" width="150" sortable>
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleView(scope.row,1)">{{ scope.row.assistNo }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="assistTime" align="center" label="带单时间" width="180" sortable></el-table-column>
                <el-table-column prop="assistStoreName" align="center" label="带单门店" width="220" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="assistName" align="center" label="带单人" width="120" sortable></el-table-column>
                <el-table-column prop="customerName" align="center" label="客户姓名" width="120" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="customerPhone" align="center" label="客户电话" width="120" sortable></el-table-column>
                <el-table-column prop="address" align="center" label="地址" width="250" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="assistBrandName" align="center" label="带单品牌" width="120" sortable></el-table-column>
                <el-table-column prop="assistCommodityCategoryName" align="center" label="带单品类" width="120" sortable></el-table-column>
                <el-table-column prop="acceptTime" align="center" label="接单时间" width="180" sortable></el-table-column>
                <el-table-column prop="acceptStoreName" align="center" label="接单门店" width="220" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="acceptOrderNo" align="center" label="接单订单号" width="150" sortable>
                  <template slot-scope="scope">
                    <el-button type="text" @click="toOrderDetail(scope.row.acceptOrderId,scope.row.acceptOrderNo)">{{ scope.row.acceptOrderNo }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="acceptName" align="center" label="接单人" width="120" sortable></el-table-column>
                <el-table-column prop="acceptBrankName" align="center" label="接单品牌" width="120" sortable></el-table-column>
                <el-table-column prop="acceptCategoryName" align="center" label="接单品类" width="120" sortable></el-table-column>
                <el-table-column prop="isSharePerformance" align="center" label="是否共享业绩" width="140" sortable>
                  <template slot-scope="scope">
                    <p v-if="scope.row.isSharePerformance == 1">是</p>
                    <p v-else-if="scope.row.isSharePerformance == 0">否</p>
                    <p v-else></p>
                  </template>
                </el-table-column>
                <el-table-column prop="performanceAmount" align="center" label="共享业绩金额" width="140" sortable></el-table-column>
                <el-table-column prop="assistRemarks" align="center" label="备注" width="250" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
            <div class="pagination_wrap">
              <pagination
                :current-page="currentPageTab1"
                :pageSize="pageSizeTab1"
                :total="totalTab1"
                @sizeChange="sizeChangeTab1"
                @currentChange="currentChangeTab1">
              </pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="接单管理" name="tab2" :lazy="true">
            <div class="m-bottom15">
              <el-button v-for="(item,index) in actionBtnList2" :type="item.style" size="small" class="button-96" @click="butGroupAction2(item.url,item.type)" :key="index" v-if="item.isHashAuthority">{{item.name}}</el-button>
            </div>
            <div class="table_list" v-loading="loading">
              <el-table border :data="acceptOrderList" ref="acceptOrderList" :row-class-name="tableRowClassName" @selection-change="selectAcceptOrder" :max-height="maxHeight">
                <el-table-column type="selection" align="center" width="55" fixed="left" :selectable="selectable"></el-table-column>
                <el-table-column prop="assistStatus" align="center" label="接单状态" width="120" sortable>
                  <template slot-scope="scope">
                    <span v-if="scope.row.assistStatus == 1">待接单</span>
                    <span v-else-if="scope.row.assistStatus == 2">已接单</span>
                    <span v-else-if="scope.row.assistStatus == 3">已拒绝</span>
                    <span v-else>-</span>
                  </template>
                </el-table-column>
                <el-table-column prop="acceptOrderNo" align="center" label="接单订单号" width="150" sortable>
                  <template slot-scope="scope">
                    <el-button type="text" @click="toOrderDetail(scope.row.acceptOrderId,scope.row.acceptOrderNo)">{{ scope.row.acceptOrderNo }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="acceptNo" align="center" label="接单号" width="150" sortable>
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleView(scope.row,2)">{{ scope.row.acceptNo }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="assistTime" align="center" label="带单时间" width="180" sortable></el-table-column>
                <el-table-column prop="assistStoreName" align="center" label="带单门店" width="220" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="assistOrderNo" align="center" label="带单订单号" width="150" sortable>
                  <template slot-scope="scope">
                    <el-button type="text" @click="toOrderDetail(scope.row.orderId,scope.row.assistOrderNo)">{{ scope.row.assistOrderNo }}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="assistName" align="center" label="带单人" width="120" sortable></el-table-column>
                <el-table-column prop="customerName" align="center" label="客户姓名" width="120" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="customerPhone" align="center" label="客户电话" width="120" sortable></el-table-column>
                <el-table-column prop="address" align="center" label="地址" width="250" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="assistBrandName" align="center" label="带单品牌" width="120" sortable></el-table-column>
                <el-table-column prop="assistCommodityCategoryName" align="center" label="带单品类" width="120" sortable></el-table-column>
                <el-table-column prop="acceptTime" align="center" label="接单时间" width="180" sortable></el-table-column>
                <el-table-column prop="acceptStoreName" align="center" label="接单门店" width="220" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="acceptName" align="center" label="接单人" width="120" sortable></el-table-column>
                <el-table-column prop="acceptBrankName" align="center" label="接单品牌" width="120" sortable></el-table-column>
                <el-table-column prop="acceptCategoryName" align="center" label="接单品类" width="120" sortable></el-table-column>
                <el-table-column prop="acceptRemarks" align="center" label="备注" width="250" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
            <div class="pagination_wrap">
              <pagination
                :current-page="currentPageTab2"
                :pageSize="pageSizeTab2"
                :total="totalTab2"
                @sizeChange="sizeChangeTab2"
                @currentChange="currentChangeTab2">
              </pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 新增带单 -->
      <el-dialog :title="isAdd ? '新增带单' : '编辑带单'" :visible.sync="orderFormDialog" custom-class="customDialogTitle orderDialog" :close-on-click-modal="false">
        <el-form label-width="120px" :model="orderForm" :rules="rules" ref="orderForm" :size="size" class="ruleForm">
          <el-form-item label="原订单号" prop="orderNumber">
            <el-input placeholder="选择订单" v-model="orderForm.orderNumber" readonly @focus="orderTableDialog = true"></el-input>
          </el-form-item>
          <el-form-item label="被推介门店" prop="acceptStoreId">
            <el-select v-model="orderForm.acceptStoreId" @change="getBrandAndCategoryList" clearable filterable>
              <el-option v-for="item in recommendedStores" :key="item.storeId" :label="item.storeName" :value="item.storeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="被推介门店品牌" prop="acceptBrank">
            <el-select v-model="orderForm.acceptBrank" clearable filterable>
              <el-option v-for="item in brandList" :key="item.brandId" :label="item.brandName" :value="item.brandId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="被推介门店品类" prop="acceptCategory">
            <el-select v-model="orderForm.acceptCategory" clearable filterable>
              <el-option v-for="item in categoryList" :key="item.commodityCategoryId" :label="item.categoryName" :value="item.commodityCategoryId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="orderForm.assistRemarks" type="textarea" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('orderForm')" :loading="loadingBtn">确 定</el-button>
          <el-button @click="orderFormDialog = false">取 消</el-button>
        </div>
      </el-dialog>
      <ordercomponent
        v-if="orderTableDialog"
        :centerDialogVisible="orderTableDialog"
        @orderclosefun="orderclosefun">
      </ordercomponent>
    </div>
  </div>
</template>
<script>
  import breadcrumb from '../../components/breadcrumb'
  import pagination from '../../components/pagination';
  import ordercomponent from "@/views/components/ordercomponent";
  import { mapGetters } from 'vuex';
  import { listLoginUserStore, getUUID } from '@/api/pulicJava';
  import { listAssistOrder, recommendedStores, recommendedStoreBrand, recommendedStoreCategory, addAssistOrder, editAssistOrderInfo, getAssistOrderInfo, deleteAssistOrder } from 'api/order/tapesheet/tapesheet';
  import { formatDate } from '@/utils/index';
  import ElLink from "element-ui/packages/link/src/main";
  export default {
    components: {
      ElLink,
      breadcrumb,
      pagination,
      ordercomponent
    },
    data() {
      return {
        btn_add: false,
        btn_edit: false,
        btn_del: false,
        btn_view: false,
        btn_receive: false,
        loading: true,
        loadingBtn: false,
        columnAlign: 'center',
        columnWidth: '200',
        actionBtnList: [
          { name: '新建带单', style: 'default', url: '', type: 1, isHashAuthority: false },
          { name: '修改带单', style: 'default', url: '', type: 2, isHashAuthority: false },
          { name: '删除带单', style: 'default', url: '', type: 3, isHashAuthority: false }
        ],
        actionBtnList2: [
          { name: '接单', style: 'default', url: '/ordermm/orderReceiving', type: 1, isHashAuthority: false }
        ],
        statusList: [
          { code: 1, value: '待接单' },
          { code: 2, value: '已接单' },
          { code: 3, value: '已拒绝' }
        ], // 状态列表
        tabActive: 'tab1', // 选项卡选中
        navList: [],
        tableSelectList: [],
        selectAcceptOrderList: [],
        isShow: false,
        totalTab1: 0,    // 总数 带单
        pageSizeTab1: 20,  // 单页条数 带单
        currentPageTab1: 1, // 当前页 带单
        totalTab2: 0,    // 总数 接单
        pageSizeTab2: 20,  // 单页条数 接单
        currentPageTab2: 1, // 当前页 接单
        orderFormDialog: false,
        orderTableDialog: false,
        assistOrderList: [],
        acceptOrderList: [],
        isAdd: 1, // 1新增 0编辑
        storeList: [],
        brandList: [],
        categoryList: [],
        recommendedStores: [],
        orderSelection: [],
        orderForm: {
          orderNumber: '',
          customerId: '',
          assistOrderId: '',
          orderId: '',
          acceptStoreId: '',
          acceptBrank: '',
          acceptCategory: '',
          assistRemarks: '',
          assistNo: ''
        },
        rules: {
          orderNumber: [
            { required: true, message: '请选择订单', trigger: 'change' }
          ],
          acceptStoreId: [
            { required: true, message: '请选择门店', trigger: 'change' }
          ],
          acceptBrank: [
            { required: true, message: '请选择品牌', trigger: 'change' }
          ],
          acceptCategory: [
            { required: true, message: '请选择品类', trigger: 'change' }
          ]
        },
        queryForm: {
          names: '',
          dateRange: [],
          assistStatus: '',
          storeId: ''
        }
      }
    },
    activated(){
      this.getStoreList();
      this.getAssistOrderList();
      this.initBtnElements();

      // 头部面包屑
      this.navList = this.$route.meta;
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    // created() {
    //   this.getStoreList();
    //   this.getAssistOrderList();
    //   this.initBtnElements();
    //   // this.setDefaultDate();
    // },
    // mounted() {
    //   // 头部面包屑
    //   this.navList = this.$route.meta;
    // },
    methods: {
      timeFn(){
        if(!this.queryForm.dateRange){
          this.queryForm.dateRange = [];
        }
      },
      setDefaultDate() {
        let start = new Date();
        start.setTime(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1));
        this.queryForm.dateRange = [formatDate(start), formatDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))];
      },
      // 获取按钮权限
      initBtnElements() {
        let element = JSON.parse(this.$loca.getItem('element'));
        this.actionBtnList[0].isHashAuthority = element['tapesheet:btn_add']; // 新建带单
        this.actionBtnList[1].isHashAuthority = element['tapesheet:btn_edit']; // 编辑带单
        this.actionBtnList[2].isHashAuthority = element['tapesheet:btn_del']; // 删除带单
        this.btn_view = element['tapesheet:btn_view']; // 查看带单
        this.actionBtnList2[0].isHashAuthority = element['tapesheet:btn_receive']; // 接单
      },
      resetForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
      },
      currentChangeTab1(val) {
        this.currentPageTab1 = val;
        this.getAssistOrderList();
      }, // 接单
      sizeChangeTab1(val) {
        this.currentPageTab1 = 1;
        this.pageSizeTab1 = val;
        this.getAssistOrderList();
      }, // 接单
      currentChangeTab2(val) {
        this.currentPageTab2 = val;
        this.getAcceptOrderList();
      }, // 带单
      sizeChangeTab2(val) {
        this.currentPageTab2 = 1;
        this.pageSizeTab2 = val;
        this.getAcceptOrderList();
      }, // 带单
      // 表格斑马线设置
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      // 是否可选
      selectable(row, index) {
        return row.assistStatus == 1
      },
      // 标签点击事件
      tabClick() {
        if (this.tabActive == 'tab1') {
          this.getAssistOrderList();
        } else {
          this.getAcceptOrderList();
        }
      },
      // 检索
      searchFun() {
        if (this.tabActive == 'tab1') {
          this.getAssistOrderList();
        } else {
          this.getAcceptOrderList();
        }
      },
      // 重置
      resetQueryForm() {
        this.currentPageTab1 = 1;
        this.currentPageTab2 = 1;
        this.queryForm.names = '';
        this.queryForm.assistStatus = '';
        this.queryForm.storeId = '';
        this.queryForm.dateRange = '';
        if (this.tabActive == 'tab1') {
          this.getAssistOrderList();
        } else {
          this.getAcceptOrderList();
        }
      },
      // 表格复选框选择
      handleSelectionChange(val) {
        this.tableSelectList = val;
      },
      // 表格上部按钮列表点击（带单）
      butGroupAction(url, type) {
        if (type == 1) {
          // 新建带单
          this.handleAdd();
        } else if (type == 2) {
          // 编辑带单
          if (!this.tableSelectList.length) {
            this.$message.error('请先选择');
          } else if (this.tableSelectList.length > 1) {
            this.$message.error('只能选择一个');
          } else {
            this.handleEdit();
          }
        } else {
          // 删除带单
          if (this.tableSelectList.length) {
            this.$confirm('确定删除?', '提示', {
              type: 'warning'
            }).then(() => {
              const assistOrderIds = [];
              this.tableSelectList.forEach(item => {
                assistOrderIds.push(item.assistOrderId);
              })
              this.handleDelete(assistOrderIds);
            }).catch(() => {});
          } else {
            this.$message.error('请先选择');
          }
        }
      },
      // 表格上部按钮列表点击（接单）
      butGroupAction2(url, type) {
        if (type === 1) {
          // 接单
          if (this.selectAcceptOrderList.length) {
            let acceptOrder = this.selectAcceptOrderList[0];
            this.$router.push({
              path: url,
              query: {
                assistOrderId: acceptOrder.assistOrderId,
                storeId: acceptOrder.acceptStoreId,
                acceptStoreId: acceptOrder.acceptStoreId,
                acceptBrank: acceptOrder.acceptBrank,
                acceptCategory: acceptOrder.acceptCategory
              }
            })
          } else {
            this.$message.error('请先选择数据');
          }
        }
      },
      // 点击删除按钮
      handleDelete(ids) {
        let params = {
          assistOrderIds: ids
        }
        deleteAssistOrder(params)
          .then(response => {
            this.$message.success('删除成功');
            this.getAssistOrderList();
          })
          .catch(error => {
            console.log('获取接单列表views/order/tapesheet/index:handleDelete' + error);
          });
      },
      // 查看带单详情
      handleView(row,tabIndex) {
        let routerPath = tabIndex == 1 ? '/ordermm/tapesheetDetails' : '/ordermm/acceptOrderDetails';
        this.$router.push({
          path: '/ordermm/tapesheetDetails',
          query: {
            assistOrderId: row.assistOrderId,
            orderId: row.orderId
          }
        })
      },
      // 获取全部门店
      getStoreList() {
        listLoginUserStore()
          .then(response => {
            this.storeList = response.data;
          })
          .catch(error => {
            console.log('获取带单列表views/order/tapesheet/index:getStoreList' + error);
          });
      },
      // 获取带单列表
      getAssistOrderList() {
        this.loading = true;
        const params = {
          names: this.queryForm.names,
          assistTimeStart: this.queryForm.dateRange.length ? this.queryForm.dateRange[0] : '',
          assistTimeEnd: this.queryForm.dateRange.length ? this.queryForm.dateRange[1] : '',
          assistStatus: this.queryForm.assistStatus,
          storeId: this.queryForm.storeId,
          page: this.currentPageTab1,
          limit: this.pageSizeTab1,
          status: 1
        }
        listAssistOrder(params)
          .then(response => {
            this.loading = false;
            if (response.data.rows) {
              this.assistOrderList = response.data.rows;
              this.totalTab1 = response.data.total;
            } else {
              this.assistOrderList = [];
              this.totalTab1 = 0;
            }
          })
          .catch(error => {
            this.loading = false;
            console.log('获取带单列表views/order/tapesheet/index:getAssistOrderList' + error);
          });
      },
      // 获取接单列表
      getAcceptOrderList() {
        this.loading = true;
        const params = {
          names: this.queryForm.names,
          acceptTimeStart: this.queryForm.dateRange.length ? this.queryForm.dateRange[0] : '',
          acceptTimeEnd: this.queryForm.dateRange.length ? this.queryForm.dateRange[1] : '',
          assistStatus: this.queryForm.assistStatus,
          storeId: this.queryForm.storeId,
          page: this.currentPageTab2,
          limit: this.pageSizeTab2,
          status: 2
        }
        listAssistOrder(params)
          .then(response => {
            this.loading = false;
            if (response.data.rows) {
              this.acceptOrderList = response.data.rows;
              this.totalTab2 = response.data.total;
            } else {
              this.acceptOrderList = [];
              this.totalTab2 = 0;
            }
          })
          .catch(error => {
            this.loading = false;
            console.log('获取接单列表views/order/tapesheet/index:getAcceptOrderList' + error);
          });
      },
      // 获取被推介门店列表
      getRecommendedStores() {
        recommendedStores()
          .then(response => {
            this.recommendedStores = response.data;
          })
          .catch(error => {
            console.log('获取带单列表views/order/tapesheet/index:getRecommendedStores' + error);
          })
      },
      // 根据门店获取品牌和品类
      getBrandAndCategoryList(val) {
        this.orderForm.acceptCategory = '';
        this.orderForm.acceptBrank = '';
        this.brandList = [];
        this.categoryList = [];
        if (val) {
          let params = {
            storeId: val
          }
          recommendedStoreBrand(params)
            .then(response => {
              this.brandList = response.data.rows;
            })
            .catch(error => {
              console.log('获取接单列表views/order/tapesheet/index:getBrandAndCategoryList' + error);
            });
          recommendedStoreCategory(params)
            .then(response => {
              this.categoryList = response.data.rows;
            })
            .catch(error => {
              console.log('获取接单列表views/order/tapesheet/index:getBrandAndCategoryList' + error);
            });
        }
      },
      // 点击添加按钮（带单）
      handleAdd() {
        this.getRecommendedStores();
        this.isAdd = 1;
        this.orderForm = {
          orderNumber: '',
          customerId: '',
          assistOrderId: '',
          orderId: '',
          acceptStoreId: '',
          acceptBrank: '',
          acceptCategory: '',
          remarks: '',
          assistNo: ''
        };
        this.resetForm('orderForm');
        this.orderFormDialog = true;
        let uuidParams = {
          serialNumber: 'RD'
        }
        getUUID(uuidParams)
          .then(response => {
            this.orderForm.assistNo = response.data;
          })
          .catch(error => {
            console.log('views/order/tapesheet/index.vue-getUUID:' + error);
          })
      },
      // 点击编辑按钮（带单）
      handleEdit() {
        this.getRecommendedStores();
        this.isAdd = 0;
        this.orderFormDialog = true;
        let assistOrderInfo = this.tableSelectList[0];
        this.getBrandAndCategoryList(assistOrderInfo.acceptStoreId);
        let newOrderForm = {
          orderNumber: assistOrderInfo.assistOrderNo,
          assistOrderId: assistOrderInfo.assistOrderId,
          acceptStoreId: assistOrderInfo.acceptStoreId,
          acceptBrank: assistOrderInfo.acceptBrank + '',
          acceptCategory: assistOrderInfo.acceptCategory + '',
          assistRemarks: assistOrderInfo.assistRemarks
        };
        Object.assign(this.orderForm, newOrderForm);
      },
      // 新增编辑带单
      submitForm(formName){
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.loadingBtn = true;
            let fn = this.isAdd ? addAssistOrder : editAssistOrderInfo;
            let statusText = this.isAdd ? '添加' : '编辑';
            let params = {
              ...this.orderForm
            };
            fn(params)
              .then(response => {
                this.loadingBtn = false;
                this.$message.success(statusText + '成功');
                this.orderFormDialog = false;
                if (this.isAdd) {
                  this.currentPageTab1 = 1;
                }
                this.getAssistOrderList();
              })
              .catch(error => {
                this.loadingBtn = false;
                console.log('获取接单列表views/order/tapesheet/index-submitForm:' + error);
              });
          } else {
            return false;
          }
        });
      },
      // 新增带单 选择原订单
      selectAcceptOrder(val) {
        this.selectAcceptOrderList = val;
        if (this.selectAcceptOrderList.length > 1) {
          this.$refs.acceptOrderList.toggleRowSelection(this.selectAcceptOrderList[0]);
        }
      },
      orderclosefun(val){
        if (val && val.length > 0){
          this.orderForm.orderId = val[0].orderId;
          this.orderForm.orderNumber = val[0].orderNumber;
          this.orderForm.customerId = val[0].customerId;
        }
        this.orderTableDialog = false;
      },
      toOrderDetail(orderId, orderNumber) {
        this.$router.push({
          path: '/ordermm/details',
          query: {
            orderId: orderId,
            orderNumber: orderNumber
          }
        });
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
