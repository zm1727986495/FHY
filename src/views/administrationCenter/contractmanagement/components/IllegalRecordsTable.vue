<template>
  <div>
    <div class="table_list" v-loading="loading">
      <el-table border :data="tableList" :row-class-name="tableRowClassName" :max-height="maxHeight">、
        <el-table-column type="index" width="50" :align="columnAlign" fixed="left"></el-table-column>
        <el-table-column prop="name" label="状态" :align="columnAlign" width="150" sortable v-if="type == 1" fixed="left">
          <template slot-scope="scope">
            <div>
              <el-tooltip placement="right" visible-arrow><!--v-if="scope.row.illegalTypeId == 234 || scope.row.illegalTypeId == 235 || scope.row.illegalTypeId == 238"-->
                <div slot="content" class="tips tipFon">
                  <p class="operaItems" @click="handleEdit(scope.row)">编辑</p>
                  <p class="operaItems" @click="handleSubmit(scope.row)">提交</p>
                </div>
                <img :src="spot" alt="" class="attributesTips">
              </el-tooltip>
              <p class="operation">待处理</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="illegalBillSn" label="违规单号" :align="columnAlign" width="150" sortable show-overflow-tooltip>
<!--          <template slot-scope="scope">-->
<!--            <el-link type="primary" href="http://www.baidu.com" target="_blank">{{ scope.row.illegalBillSn }}</el-link>-->
<!--          </template>-->
        </el-table-column>
        <el-table-column prop="illegalTypeName" label="违规处罚类型" :align="columnAlign" width="150" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="illegalLevel" label="违规等级" :align="columnAlign" width="180" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="illegalDescribe" label="违规描述" :align="columnAlign" width="250" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="违规单生成时间" :align="columnAlign" width="180" sortable show-overflow-tooltip></el-table-column>
        <!-- <el-table-column prop="name" label="二次违规单审核时间" :align="columnAlign" width="180" sortable show-overflow-tooltip></el-table-column>-->
        <el-table-column prop="orderNumber" label="订单编号" :align="columnAlign" width="150" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="contractSerialNumber" label="客户合同号" :align="columnAlign" width="150" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="customerName" label="客户姓名" :align="columnAlign" width="150" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="customerPhone" label="客户电话" :align="columnAlign" width="150" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="otherPhone" label="备用电话" :align="columnAlign" width="150" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="address" label="订单地址" :align="columnAlign" width="300" sortable show-overflow-tooltip></el-table-column>
        <el-table-column prop="storeName" label="所属网点" :align="columnAlign" width="250" sortable show-overflow-tooltip></el-table-column>
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
    <el-dialog title="系统判定处罚" :visible.sync="editPunishDialog" width="960px" class="customDialogTitle">
      <IllegalPunishment :illegalInfo="illegalInfo" :header="false" ref="illegalPunishment" v-if="editPunishDialog" :edit="true" @successFn="successFn"></IllegalPunishment>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSubmit">确 定</el-button>
        <el-button @click="editPunishDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import spot from '@/assets/images/spot.png';
  import pagination from '@/views/components/pagination';
  import IllegalPunishment from '@/views/administrationCenter/contractmanagement/components/IllegalPunishment';
  import { mapGetters } from 'vuex';
  import { insertSystemIllegalBill, listIllegalBillByPage } from 'api/administrationCenter/contractmanagement/contractmanagement';
  export default {
    components: {
      IllegalPunishment,
      pagination
    },
    props: {
      type: {
        default: 0
      },
      page: {
        type: Number,
        default: () => 1
      },
      limit: {
        type: Number,
        default: () => 10
      }
    },
    data() {
      return {
        spot,
        tableList: [],
        columnAlign: 'center',
        currentPage: this.page,
        pageSize: this.limit,
        total: 0,
        editPunishDialog: false,
        illegalInfo: {},
        loading: false
      };
    },
    created() {
      this.getData();
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
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
      // 获取表格数据
      getData() {
        this.loading = true;
        const params = {
          orderId: this.$route.query.orderId,
          systemDetermine: this.type,
          page: this.currentPage,
          limit: this.pageSize
        }
        listIllegalBillByPage(params)
          .then(response => {
            this.tableList = response.data.rows;
            this.total = response.data.total;
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            console.log('views/administrationcenter/contractmanagement/components/IllegalRecordsTable.vue:getData' + error)
          })
      },
      // 点击编辑
      handleEdit(row) {
        this.illegalInfo.illegalBillId = row.illegalBillId;
        this.illegalInfo.illegalType = row.illegalTypeId;
        this.editPunishDialog = true;
      },
      // 编辑提交
      editSubmit() {
        this.$refs.illegalPunishment.insertIllegalBillSubmit('ruleForm');
      },
      // 成功或失败回调
      successFn(val) {
        if (val) {
          this.getData();
          this.editPunishDialog = false;
        }
      },
      // 系统判定-提交
      handleSubmit(row) {
        this.$confirm('一旦提交不可修改，确定提交?', '提示', {
          type: 'warning'
        }).then(() => {
          const params = {
            illegalBillId: row.illegalBillId
          };
          insertSystemIllegalBill(params)
            .then(response => {
              if (response.status == 200) {
                this.$message.success('提交成功');
              } else {
                this.$message.error(response.message || '提交失败');
              }
            })
            .catch(error => {
              console.log('views/administrationcenter/contractmanagement/components/IllegalPunishment.vue:handleSubmit' + error)
            })
        }).catch(() => {});
      }
    },
    computed: {
      ...mapGetters([
        'maxHeight'
      ])
    }
  };
</script>
