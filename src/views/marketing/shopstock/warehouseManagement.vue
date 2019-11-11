<template>
  <div class="wrapper lvs">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <!-- 查询条件组 -->
      <el-card class="m-bottom10">
        <el-row :gutter="10" class="queryForm">
          <el-col :span="querySpan">
            <el-input v-model.trim="queryForm.text" clearable placeholder="订单号 客户姓名 电话 地址" :size="size"></el-input>
          </el-col>
          <el-col :span="querySpan">
            <el-select v-model="queryForm.outboundStatus" placeholder="出库状态" clearable filterable :size="size">
              <el-option v-for="item in statusList" :value="item.code" :label="item.value" :key="item.code"></el-option>
            </el-select>
          </el-col>
          <el-col :span="querySpan">
            <el-date-picker :size="size"
              v-model="queryForm.dateRange"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-col>
          <el-col :span="querySpan">
            <el-button type="warning" class="button-fc" @click="searchFun" :size="size">查询</el-button>
            <el-button type="primary" @click="resetQueryForm" :size="size">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
      <!-- 按钮-表格-分页-->
      <el-card class="attribute">
        <div class="m-bottom15">
          <el-button v-for="(item,index) in actionBtnList" :type="item.style" class="button-96" @click="butGroupAction(item.url,item.type)" :key="index" :size="btnSize" v-if="item.isHasAuthority">{{item.name}}</el-button>
        </div>
        <div class="table_list" v-loading="loading">
          <el-table border :data="tableData" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" ref="multipleTable">
            <el-table-column align="center" type="selection" width="50" :selectable="selectable" fixed="left"></el-table-column>
            <el-table-column align="center" prop="outboundStatusStr" label="出库状态" width="140" fixed sortable show-overflow-tooltip>
              <template slot-scope="scope">
                <div>
                  <el-tooltip placement="right" visible-arrow >
                    <div slot="content" class="tips tipFon">
                      <p @click="handleView(scope.row)" class="operaItems">查看</p>
                    </div>
                    <img :src="spot" alt="" class="attributesTips">
                  </el-tooltip>
                  <p class="operation" v-if="scope.row.outboundStatus == 1">待出库</p>
                  <p class="operation" v-if="scope.row.outboundStatus == 2">待交接</p>
                  <p class="operation" v-if="scope.row.outboundStatus == 3">已出库</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="outboundNumber" label="出库单号" width="150" sortable  show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="createName" label="出库人" width="120" sortable  show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="updateTime" label="出库时间" width="170" sortable  show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="typeStr" label="类型" width="120" sortable></el-table-column>
            <el-table-column align="center" prop="orderNumber" label="订单号" width="150" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                <p class="table_action_span" @click="orderdetails(scope.row)">{{ scope.row.orderNumber }}</p>
                <el-button type="text"></el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="storeName" label="所属门店" width="200" sortable show-overflow-tooltip></el-table-column>
<!--            <el-table-column align="center" prop="createName" label="销售员" width="120" sortable show-overflow-tooltip></el-table-column>-->
            <el-table-column align="center" prop="customerName" label="客户姓名" width="120" sortable show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="customerPhone" label="电话" width="120" sortable show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="address" label="地址" width="200" sortable show-overflow-tooltip></el-table-column>
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
    <el-dialog title="出库详情" :visible.sync="dialogVisible" width="70%" custom-class="customDialogTitle" append-to-body :close-on-click-modal="false" top="5vh">
      <div class="dialogBody" v-loading="loadingDialog">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" :size="size" class="clearfix queryForm infoForm">
          <el-col :span="span">
            <el-form-item label="出库单号">
              {{ selectedInfo.outboundNumber }}
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="供应商：">
              <p v-if="row.companyName">{{ row.companyName }}</p>
              <p v-if="multipleSelection.length">{{ multipleSelection[0].companyName }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="出库类型：">
              <p v-if="row.typeStr">{{ row.typeStr }}</p>
              <p v-if="multipleSelection.length">{{ multipleSelection[0].typeStr }}</p>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="所属门店：">
              {{ selectedInfo.storeName }}
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="出库状态：">
              <p v-if="selectedInfo.outboundStatus == 1">待出库</p>
              <p v-if="selectedInfo.outboundStatus == 2">待交接</p>
              <p v-if="selectedInfo.outboundStatus == 3">已出库</p>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="出库人：">
              {{ selectedInfo.userName }}
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="入库仓：">
              {{ selectedInfo.storageName }}
            </el-form-item>
          </el-col>
<!--          <el-col :span="span">-->
<!--            <el-form-item label="出库数量：" prop="num">-->
<!--              <el-input v-model.number="ruleForm.num" :controls="false" clearable placeholder="请输入出库数量"></el-input>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
        </el-form>
        <div class="moduleHeader">
          <div class="title">商品清单</div>
        </div>
        <div class="table_list lvs">
          <el-table border :data="selectedInfo.cancelList" height="350">
            <el-table-column type="index" align="center" width="50" fixed></el-table-column>
            <el-table-column label="商品编码" prop="commodityCode" align="center" width="140" sortable></el-table-column>
            <el-table-column label="商品名称" prop="commodityName" align="center" width="200" sortable show-overflow-tooltip></el-table-column>
            <el-table-column label="品牌" prop="brandName" align="center" width="120" sortable show-overflow-tooltip></el-table-column>
            <el-table-column label="品类" prop="categoryName" align="center" width="120" sortable show-overflow-tooltip></el-table-column>
            <el-table-column label="型号" prop="commodityModel" align="center" width="150" sortable show-overflow-tooltip></el-table-column>
            <el-table-column label="系列" prop="seriesName" align="center" width="120" sortable></el-table-column>
            <el-table-column label="材质" prop="materialName" align="center" width="120" sortable></el-table-column>
            <el-table-column label="颜色" prop="colourName" align="center" width="160" sortable></el-table-column>
            <el-table-column label="单位" prop="commodityUnit" align="center" width="120" sortable></el-table-column>
            <el-table-column label="宽" prop="commodityWide" align="center" width="100" sortable></el-table-column>
            <el-table-column label="高" prop="commodityHigh" align="center" width="100" sortable></el-table-column>
            <el-table-column label="深" prop="commodityLong" align="center" width="100" sortable></el-table-column>
            <el-table-column label="厚" prop="commodityThick" align="center" width="100" sortable></el-table-column>
            <el-table-column label="数量" prop="amount" align="center" width="100" sortable></el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer" v-if="!isView">
        <el-button type="primary" @click="warehouseOutSubmit" :loading="loadingBtn">确认出库</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import breadcrumb from '@/views/components/breadcrumb';
  import pagination from '@/views/components/pagination';
  import spot from '@/assets/images/spot.png';
  import { listStore } from 'api/pulicJava';
  import { outboundSamplePage, getByOutboundOrderId, outboundGoods } from "@/api/marketing/shopStock/shopStock";
  export default {
    components: {
      breadcrumb,
      pagination
    },
    data() {
      return {
        spot,
        querySpan: 6,
        span: 8,
        size: 'medium',
        btnSize: 'small',
        currentPage: 1,
        pageSize: 20,
        total: 0,
        navList: [],
        tableData: [], // 出库单列表
        actionBtnList: [
          { name: '出库', style: 'default', url: '', type: 1, isHasAuthority: false }
        ],
        statusList: [
          { code: 1, value: '待出库' },
          { code: 2, value: '待交接' },
          { code: 3, value: '已出库' }
        ],
        dialogVisible: false,
        queryForm: {
          text: '', // 模糊查询
          dateRange: '', // 时间
          outboundStatus: '', // 出库状态
          storeId: '' // 门店
        },
        ruleForm: {
          num: 1 // 出库数量
        },
        rules: {
          num: [
            { required: true, message: '请输入出库数量' },
            { type: 'number', message: '请输入数字' }
          ]
        },
        storeList: [], // 门店列表
        multipleSelection: [], // 选择的表格数据
        selectedInfo: {}, // 选择的出库商品基本信息详情
        row: {}, // 选择的出库商品基本信息详情-点击查看
        loading: false,
        loadingDialog: true, // 加载详情
        loadingBtn: false, // 出库按钮
        isView: false // 是否是查看
      }
    },
    activated(){
      this.getData();
      this.initBtnElements();

      this.navList = this.$route.meta;
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    // created() {
    //   this.getData();
    //   this.initBtnElements();
    //   // this.getStoreList();
    // },
    // mounted() {
    //   this.navList = this.$route.meta;
    // },
    methods: {
      // 获取按钮权限
      initBtnElements() {
        let element = JSON.parse(this.$loca.getItem('element'));
        this.actionBtnList[0].isHasAuthority = element['warehouseManagement:btn_out'];
      },
      resetForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
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
      // 获取门店列表
      getStoreList() {
        listStore()
          .then(response => {
            this.storeList = response.data;
          })
          .catch(error => {
            console.log('views/marketing/shopstock/deliveryRecord.vue-getStoreList:' + error);
          })
      },
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      // 获取列表信息
      getData() {
        this.loading = true;
        let params = {
          text: this.queryForm.text,
          startTime: this.queryForm.dateRange ? this.queryForm.dateRange[0] : '',
          endTime: this.queryForm.dateRange ? this.queryForm.dateRange[1] : '',
          storeId: this.queryForm.storeId,
          outboundStatus: this.queryForm.outboundStatus,
          page: this.currentPage,
          limit: this.pageSize
        };
        outboundSamplePage(params)
          .then(response => {
            this.loading = false;
            this.tableData = response.data.rows;
            this.total = response.data.total;
          })
          .catch(error => {
            this.loading = false;
            console.log('views/marketing/shopstock/warehouseManagement.vue-getData:' + error);
          })
      },
      // 查询按钮点击
      searchFun() {
        this.currentPage = 1;
        this.getData();
      },
      // 重置
      resetQueryForm() {
        this.currentPage = 1;
        for (let keys in this.queryForm) {
          this.queryForm[keys] = '';
        }
        this.getData();
      },
      // 设置是否可选
      selectable(row) {
        return row.outboundStatus == 1;
      },
      // 按钮组函数
      butGroupAction(url, type) {
        if (type === 1) { // 终止门店
          this.handleOut();
        }
      },
      // 勾选函数回调
      handleSelectionChange(val) {
        this.multipleSelection = val;
        if (this.multipleSelection.length > 1) {
          this.$refs.multipleTable.toggleRowSelection(this.multipleSelection[0]);
        }
      },
      // 查看详情
      handleView(row) {
        this.row = row;
        this.selectedInfo = {};
        this.isView = true;
        this.dialogVisible = true;
        let params = {
          id: row.outboundOrderId,
          type: row.type
        };
        this.getDetails(params);
      },
      // 获取出库详情
      getDetails(params) {
        this.selectedInfo = {};
        this.loadingDialog = true;
        getByOutboundOrderId(params)
          .then(response => {
            this.loadingDialog = false;
            this.selectedInfo = response.data;
          })
          .catch(error => {
            this.loadingDialog = false;
            console.log('views/marketing/shopstock/warehouseManagement.vue-handleOut:' + error);
          })
      },
      // 点击出库
      handleOut() {
        if (this.multipleSelection.length == 1) {
          this.row = {};
          this.selectedInfo = {};
          this.isView = false;
          this.dialogVisible = true;
          let params = {
            id: this.multipleSelection[0].outboundOrderId,
            type: this.multipleSelection[0].type
          };
          this.getDetails(params);
        } else {
          this.$message.error('请选择数据')
        }
      },
      // 确认出库
      warehouseOutSubmit() {
        this.$confirm('确认出库?', '提示', {
          type: 'warning'
        }).then(() => {
          this.loadingBtn = true;
          let params = {
            outboundOrderId: this.multipleSelection[0].outboundOrderId,
            storeId: this.multipleSelection[0].storeId,
            goodsList: this.getCommodities
          };
          outboundGoods(params)
            .then(response => {
              this.loadingBtn = false;
              this.dialogVisible = false;
              if (response.status == 200) {
                this.$message.success('出库成功');
                this.getData();
              } else {
                this.$message.error('出库失败');
              }
            })
            .catch(error => {
              this.loadingDialog = false;
              this.loadingBtn = false;
              console.log('views/marketing/shopstock/warehouseOutSubmit.vue-handleOut:' + error);
            })
        }).catch(() => {});
      },
      // 跳到订单详情
      orderdetails(val){
        this.$router.push({path: "/ordermm/details", query:{orderId: val.orderId}});
      }
    },
    computed: {
      // 确认出库获取商品
      getCommodities() {
        let arr = [];
        if (this.selectedInfo.cancelList.length){
          this.selectedInfo.cancelList.forEach(item => {
            arr.push({
              // inventoryGoodsId: item.inventoryGoodsId || '',
              // inventoryNumber: item.inventoryNumber,
              outboundOrderId: this.multipleSelection[0].outboundOrderId,
              storeId: this.multipleSelection[0].storeId,
              skuGoodsId: item.skuGoodsId
            })
          })
        }
        return arr;
      }
    }
  }
</script>

