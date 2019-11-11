<template>
  <div class="withdrawal">
    <el-dialog
      title="撤回转单"
      :visible.sync="isWithdrawal"
      top="1vh"
      width="50%"
      :before-close="handleClose"
      custom-class="customDialogTitle"
    >
      <div class="transferStyle">
        <div class="table_list lvs attribute">
          <el-table
            border
            :row-class-name="tableRowClassName"
            @selection-change="chooseDelete"
            :data="tableData"
          >
            <el-table-column fixed type="selection" width="40"></el-table-column>
            <el-table-column align="center" prop=".0" label="采购合同号" width="200" sortable></el-table-column>
            <el-table-column align="center" prop="source" label="转给部门" width="200"></el-table-column>
            <el-table-column
              align="center"
              prop="designateInstallationTime"
              label="指派安装次数"
              width="200"
            ></el-table-column>
            <el-table-column align="center" prop="customerName" label="客户姓名" width="200"></el-table-column>
            <el-table-column align="center" prop="customerPhone" label="客户电话" width="200"></el-table-column>
            <el-table-column
              align="center"
              prop="address"
              label="订单地址"
              width="200"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column align="center" prop="designer" label="设计师" width="200"></el-table-column>
            <el-table-column align="center" prop="timeCycle" label="时间周期" width="200"></el-table-column>
            <el-table-column
              align="center"
              prop="predictInstallationTime"
              label="预约安装时间"
              width="200"
            ></el-table-column>
            <el-table-column align="center" prop="isDelete" label="预约备注" width="200"></el-table-column>
            <el-table-column
              align="center"
              prop="logisticsDistributionTime"
              label="物流配送时间"
              width="200"
            ></el-table-column>
            <el-table-column align="center" prop="firstInstallationTime" label="首次安装时间" width="200"></el-table-column>
            <el-table-column align="center" prop="contractMoney" label="合同金额/元" width="200"></el-table-column>
            <el-table-column align="center" prop="presentStatus" label="礼品状态" width="200"></el-table-column>
            <el-table-column align="center" prop="predictInstallTime" label="合同安装时间" width="200"></el-table-column>
            <el-table-column align="center" prop="reportContent" label="安装汇报内容" width="200"></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="pagination_wrap">
        <pagination
          :current-page="currentPage"
          :pageSize="pageSize"
          :total="total"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
        ></pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="transferconfirmation">撤 回</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import {
  listTransfer,
  editTransferInstallationOrder
} from "api/Installation/dispatchcenter/dispatchcenter";
import { mapMutations } from "vuex";
export default {
  props:['isWithdrawal','installationType'],
  components: {
    pagination
  },
  data() {
    return {
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 0, //总条数
      choseArr: [],
      tableData: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapMutations(["SET_PAYMENT"]),
    //获取列表
    getData() {
      let data = {
        page: this.currentPage,
        limit: this.pageSize,
        installationType: this.installationType
      };
      listTransfer(data)
        .then(res => {
          this.tableData = res.data.rows;
          this.total = res.data.total;
        })
        .catch(error => {
          console.error("转单撤回", error);
        });
    },
    //确定
    transferconfirmation() {
      if (this.choseArr.length < 1) {
        this.$message.warning("至少勾选一个!");
        return;
      }
      let flag = true;
      let arr = this.choseArr.map(item => {
        return {
          installationOrderId: item.installationOrderId,
          serveGroupId: item.serveGroupId,
          installationAppointRecordId:item.installationAppointRecordId
        };
      });
      let data = {
        transfer: arr
      };
      editTransferInstallationOrder(data)
        .then(res => {
          if (res.status == 200) {
            this.$message.success("转单撤回成功!");
            this.SET_PAYMENT(`转单撤回${new Date().getTime()}`);
          }
        })
        .catch(error => {
          console.error("转单撤回", error);
        });
    },
    //取消
    handleClose() {
      this.$emit("handleClose");
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getData();
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //勾选
    chooseDelete(val) {
      this.choseArr = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.withdrawal {
  .transferStyle {
    max-height: 400px;
    overflow-y: auto;
  }
  .titlecalsreceipt {
    font-size: 18px;
  }
}
</style>
