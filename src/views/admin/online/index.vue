<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="用户名称" v-model="listQuery.username"> </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="id" width="57">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
      </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="用户名称"><template slot-scope="scope">
        <span>
          {{scope.row.username}}</span>
      </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="登录账号"><template slot-scope="scope">
        <span>
          {{scope.row.loginCode}}</span>
      </template>
      </el-table-column>
      <el-table-column width="220px" align="center" label="登录时间"><template slot-scope="scope">
        <span>
          {{scope.row.createDate}}</span>
      </template>

      </el-table-column>
      <el-table-column width="220px" align="center" label="最后访问"><template slot-scope="scope">
        <span>
          {{scope.row.lastTime}}</span>
      </template>

      </el-table-column>
      <el-table-column width="150px" align="center" label="客户主机"><template slot-scope="scope">
        <span>
          {{scope.row.loginIp}}</span>
      </template>

      </el-table-column>
      <el-table-column width="150px" align="center" label="用户类型"><template slot-scope="scope">
        <span>
          {{scope.row.userType}}</span>
      </template>

      </el-table-column>
      <el-table-column width="150px" align="center" label="设备类型"><template slot-scope="scope">
        <span>
          {{scope.row.toolType}}</span>
      </template>

      </el-table-column>       
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  page
} from 'api/admin/online/index';
export default {
  name: 'gateLog',
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        crtName: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      gateLogManager_btn_edit: '1',
      gateLogManager_btn_del: '1',
      gateLogManager_btn_add: '1',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      page(this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      })
    },
    handleFilter() {
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    }
  }
}
</script>
