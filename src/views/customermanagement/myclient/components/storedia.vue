<template>
  <el-dialog title="选择门店" :visible="visible" width="70%" @close="storeDiaCallBack" custom-class="customDialogTitle" top="2vh">
    <div v-loading="storeLoading">
      <div class="queryForm">
        <el-row :gutter="10">
          <el-col :span="span">
            <el-input v-model.trim="queryFormStore.storeNumber" clearable placeholder="门店编号" :size="size"></el-input>
          </el-col>
          <el-col :span="span">
            <el-input v-model.trim="queryFormStore.groupName" clearable placeholder="门店名称" :size="size"></el-input>
          </el-col>
          <el-col :span="span">
            <el-input v-model.trim="queryFormStore.address" clearable placeholder="地址" :size="size"></el-input>
          </el-col>
          <el-col :span="span">
            <el-button type="warning" class="button-fc" @click="searchStore" :size="size">查询</el-button>
            <el-button type="primary" @click="resetQueryFormStore" :size="size">重置</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="table_list">
        <el-table border ref="multipleTable" :row-class-name="tableRowClassName" @selection-change="selectStoreChange" :data="storeList" height="400"  :row-key="getRowKeys">
          <el-table-column align="center" type="selection" width="40" fixed='left' :reserve-selection="reserve"></el-table-column>
          <el-table-column align="center" prop="storeNumber"  label="门店编码" show-overflow-tooltip sortable></el-table-column>
          <el-table-column align="center" prop="storeName"  label="门店名称" show-overflow-tooltip sortable></el-table-column>
          <el-table-column align="center" prop="storeLeader"  label="店长" show-overflow-tooltip sortable></el-table-column>
          <el-table-column align="center" prop="boothNumber"  label="所属摊位" show-overflow-tooltip sortable></el-table-column>
          <el-table-column align="center" prop="companyName"  label="所属建材城" show-overflow-tooltip sortable></el-table-column>
        </el-table>
        <div class="pagination_wrap">
          <pagination
            :current-page="currentPage"
            :pageSize="pageSize"
            :total="total"
            @sizeChange="sizeChange"
            @currentChange="currentChange"
          ></pagination>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="selectStoreConfirm">确 定</el-button>
      <el-button @click="storeDiaCallBack">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import pagination from '@/views/components/pagination';
import { listStorePage } from "api/common/common";
export default {
  props: {
    visible: {
      type: Boolean,
      default: () => false
    },
    multiple: { // 是否允许多选，默认单选
      type: Boolean,
      default: () => false
    },
    reserve: { // 保留之前选中数据
      type: Boolean,
      default: () => false
    },
    selection: { // 默认选中值
      type: Array,
      default: () => []
    }
  },
  components: {
    pagination
  },
  data() {
    return {
      storeLoading: false,
      size: 'medium',
      btnSize: 'small',
      span: 6,
      currentPage: 1,
      pageSize: 20,
      selectStore: [],
      storeList: [],
      total: 0,
      queryFormStore: {
        storeNumber: '',
        storeName: '',
        address: ''
      }
    };
  },
  created() {
    this.getStoreList();
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getStoreList();
    },
    currentChange(val) {
      this.currentPage = val;
      this.getStoreList();
    },
    getRowKeys(row) {
      return row.storeId;
    },
    // 重置筛选门店
    resetQueryFormStore() {
      this.currentPage = 1;
      for (let keys in this.queryFormStore) {
        this.queryFormStore[keys] = '';
      }
      this.getStoreList();
    },
    // 关闭回调
    storeDiaCallBack() {
      this.$emit("close_store");
    },
    // 选择门店 传递选中的门店信息
    selectStoreConfirm() {
      if (this.selectStore.length) {
        if (!this.multiple) {
          this.$emit("close_store", this.selectStore[0]);
        } else {
          this.$emit("close_store", this.selectStore);
        }
      } else {
        this.$message.warning("请选择门店!");
      }
    },
    // 查询门店
    searchStore() {
      this.currentPage = 1;
      this.getStoreList();
    },
    // 获取门店列表
    getStoreList() {
      this.storeLoading = true;
      let data = {
        page: this.currentPage,
        limit: this.pageSize,
        storeNumber: this.queryFormStore.storeNumber,
        storeName: this.queryFormStore.storeName,
        address: this.queryFormStore.address
      };
      listStorePage(data)
        .then(res => {
          if (res.status == "200") {
            this.storeList = res.data.rows;
            this.total = res.data.total;
            if (this.selection.length) {
              this.storeList.forEach(item => {
                this.selection.forEach(el => {
                  if (item.storeId == el) {
                    this.$refs.multipleTable.toggleRowSelection(item);
                  }
                })
              })
            }
          }
          this.storeLoading = false;
        })
        .catch(error => {
          this.storeLoading = false;
          console.error("获取门店列表 customermanagementcustomerqueryCustomerSharing:" + error);
        });
    },
    // 勾选函数回调
    selectStoreChange(val) {
      this.selectStore = val;
      if (!this.multiple) {
        if (this.selectStore.length > 1) {
          this.$refs.multipleTable.toggleRowSelection(this.selectStore[0]);
        }
      }
    }
  }
};
</script>

