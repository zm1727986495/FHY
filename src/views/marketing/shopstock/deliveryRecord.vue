<template>
  <div class="wrapper lvs">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <!-- 查询条件组 -->
      <el-card class="m-bottom10">
        <div class="queryForm viewForm">
          <el-row :gutter="10">
            <el-col :span="span">
              <el-input v-model.trim="queryForm.text" clearable placeholder="领用单号 操作人" :size="size"></el-input>
            </el-col>
            <el-col :span="span">
              <el-button type="warning" class="button-fc" @click="searchFun" :size="size" :disabled="loading">查询</el-button>
              <el-button type="primary" @click="resetQueryForm" :size="size" :disabled="loading">重置</el-button>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <!-- 按钮-表格-分页-->
      <el-card>
        <div class="table_list" v-loading="loading">
          <el-table border :data="tableList" :row-class-name="tableRowClassName" :max-height="maxHeight">
            <el-table-column align="center" type="index" fixed="left"></el-table-column>
            <el-table-column align="center" prop="status" label="状态" show-overflow-tooltip sortable>
              <template slot-scope="scope">
                <span v-if="scope.row.status == 0">待派送</span>
                <span v-else-if="scope.row.status == 1">已派送</span>
                <span v-else-if="scope.row.status == 2">未派送</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="applyCode" label="领用单号" sortable show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="applyNumber"  label="派送数量" sortable></el-table-column>
            <el-table-column align="center" prop="arrivalTime" label="到店时间" sortable show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="appplyAt" label="操作人" sortable show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="applyTime" label="操作时间" sortable show-overflow-tooltip></el-table-column>
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
  import pagination from '@/views/components/pagination';
  import { giftToSend } from '@/api/marketing/shopStock/shopStock';
  import { mapGetters } from 'vuex';
  export default {
    components: {
      breadcrumb,
      pagination
    },
    data() {
      return {
        loading: true,
        navList: [],
        tableList: [],
        currentPage: 1,
        pageSize: 20,
        total: 0,
        queryForm: {
          text: '',
          storeId: this.$route.query.storeId
        }
      }
    },
    created() {
      this.getData();
    },
    mounted() {
      this.navList = this.$route.meta;
    },
    methods: {
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
      // 获取列表信息
      getData() {
        this.loading = true;
        let params = {
          text: this.queryForm.text,
          storeId: this.queryForm.storeId,
          page: this.currentPage,
          limit: this.pageSize
        };
        giftToSend(params)
          .then(response => {
            const result = response.data;
            this.tableList = result.rows;
            this.total = result.total;
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            console.log('views/marketing/shopstock/deliveryRecord.vue-getData:' + error);
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
        this.text = '';
        this.getData();
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

