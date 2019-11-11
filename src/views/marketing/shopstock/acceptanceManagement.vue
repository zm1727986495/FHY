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
            <el-input v-model.trim="queryForm.text" clearable placeholder="采购单号 采购合同号上样单号 礼品领用单号" :size="size"></el-input>
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
            <el-select v-model="queryForm.status" placeholder="验收状态" clearable filterable :size="size">
              <el-option v-for="item in statusList" :value="item.code" :label="item.value" :key="item.code"></el-option>
            </el-select>
          </el-col>
          <el-col :span="querySpan">
            <el-button type="warning" class="button-fc" @click="searchFun" :size="size" :disabled="loading">查询</el-button>
            <el-button type="primary" @click="resetQueryForm" :size="size" :disabled="loading">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
      <!-- 按钮-表格-分页-->
      <el-card class="attribute">
        <div class="m-bottom15">
          <el-button v-for="(item,index) in actionBtnList" :type="item.style" class="button-96" @click="butGroupAction(item.url,item.type)" :key="index" :size="btnSize" v-if="item.isHasAuthority">{{item.name}}</el-button>
        </div>
        <div class="table_list" v-loading="loading">
          <el-table border :data="tableList" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" ref="multipleTable">
            <el-table-column align="center" type="selection" width="40" fixed="left" :selectable="selectable"></el-table-column>
            <el-table-column align="center" prop="status" label="验收状态" width="120" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                <p v-if="scope.row.status == 1">部分完成</p>
                <p v-else-if="scope.row.status == 0">未完成</p>
                <p v-else-if="scope.row.status == 2">已完成</p>
                <p v-else>-</p>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="storeLeader" label="采购单号" width="150" sortable show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="organizationName" label="单据类型" width="150" sortable  show-overflow-tooltip>
              <template slot-scope="scope">
                <p v-if="scope.row.acceptanceType == 1">上样单</p>
                <p v-else-if="scope.row.acceptanceType == 2">礼品领用单</p>
                <p v-else>-</p>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="status" label="采购合同号" width="150" sortable></el-table-column>
            <el-table-column align="center" prop="oddNumbers" label="上样/礼品领用单号" width="180" sortable show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="companyName" label="供应商" width="200" sortable show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="brandName" label="品牌" width="120" sortable show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="categoryName" label="品类" width="120" sortable show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="receivableNumber" label="应收数量" width="120" sortable show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="storeAcceptanceTime" label="验收时间" width="180" sortable show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="acceptanceNumber" label="验收数量" width="120" sortable show-overflow-tooltip></el-table-column>
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
  </div>
</template>
<script>
  import breadcrumb from '@/views/components/breadcrumb';
  import pagination from '@/views/components/pagination'
  import { listStoreAcceptance } from '@/api/marketing/shopStock/shopStock';
  export default {
    components: {
      breadcrumb,
      pagination
    },
    data() {
      return {
        loading: true,
        querySpan: 6,
        span: 8,
        size: 'medium',
        btnSize: 'small',
        currentPage: 1,
        pageSize: 20,
        total: 0,
        navList: [],
        tableList: [],
        actionBtnList: [
          { name: '验收', style: 'default', url: '', type: 1, isHasAuthority: false }
        ],
        statusList: [
          { code: 0, value: '未完成' },
          { code: 1, value: '部分完成' },
          { code: 2, value: '已完成' }
        ],
        dialogVisible: false,
        queryForm: {
          text: '',
          dateRange: '',
          status: '',
          storeId: ''
        },
        ruleForm: {
          num: 1
        },
        rules: {
          num: [
            { required: true, message: '请输入出库数量' },
            { type: 'number', message: '请输入数字' }
          ]
        },
        storeList: [], // 门店列表
        multipleSelection: [], // 选择的表格数据
        selectedInfo: {}, // 选择的出库商品
        commodityData: [], // 出库商品清单
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
        this.actionBtnList[0].isHasAuthority = element['acceptanceManagement:btn_check'];
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
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      selectable(row) {
        return row.status != 2;
      },
      // 获取列表信息
      getData() {
        this.loading = true;
        let params = {
          page: this.currentPage,
          limit: this.pageSize,
          text: this.queryForm.text,
          startTime: this.queryForm.dateRange ? this.queryForm.dateRange[0] : '',
          endTime: this.queryForm.dateRange ? this.queryForm.dateRange[1] : '',
          status: this.queryForm.status
        };
        listStoreAcceptance(params)
          .then(response => {
            const result = response.data;
            this.tableList = result.rows;
            this.total = result.total;
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            console.log('store/listStore:' + error);
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
        for (let keys in this.queryForm) {
          this.queryForm[keys] = '';
        }
        this.getData();
      },
      // 按钮组函数
      butGroupAction(url, type) {
        if (type === 1) { // 验收
          this.handleCheck();
        }
      },
      // 勾选函数回调-设置单选
      handleSelectionChange(val) {
        this.multipleSelection = val;
        if (this.multipleSelection.length > 1) {
          this.$refs.multipleTable.toggleRowSelection(this.multipleSelection[0]);
        }
      },
      // 点击验收
      handleCheck() {
        if (this.multipleSelection.length) {
          this.$router.push({
            path: '/shopstock/acceptanceRecords',
            query: {
              storeAcceptanceId: this.multipleSelection[0].storeAcceptanceId,
              sourceId: this.multipleSelection[0].sourceId,
              acceptanceType: this.multipleSelection[0].acceptanceType,
              acceptanceNumber: this.multipleSelection[0].acceptanceNumber,
              receivableNumber: this.multipleSelection[0].receivableNumber,
              oddNumbers: this.multipleSelection[0].oddNumbers,
              storeAcceptanceTime: this.multipleSelection[0].storeAcceptanceTime,
              status: this.multipleSelection[0].status
            }
          })
        } else {
          this.$message.error('请先选择数据');
        }
      }
    }
  }
</script>

