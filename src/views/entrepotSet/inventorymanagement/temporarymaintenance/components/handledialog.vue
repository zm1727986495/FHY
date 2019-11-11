<template>
  <div class="handledialog">
    <el-dialog title="处理" :visible.sync="dialogVisible" width="80%" :before-close="handleClose"
               custom-class="customDialogTitle">
      <div>
        <span>处理方式：</span>

        <el-radio v-model="radio" label="1">转可用</el-radio>
        <el-radio v-model="radio" label="2">报废</el-radio>
        <el-radio v-model="radio" label="3" v-if="type == 'stockup'">内部销售</el-radio>
      </div>
      <div class="table_list attribute m-top20">
        <el-table border :row-class-name="tableRowClassName" :data="tableData">
          <!--          <el-table-column align="center" type="selection" width="50" fixed></el-table-column>-->
          <el-table-column align="center" prop="receiptsNum" label="商品名称" sortable width="200"></el-table-column>
          <el-table-column align="center" prop="receiptsNum" label="来源单号" width="200"></el-table-column>
          <el-table-column align="center" prop="receiptsNum" label="商品型号" width="200"></el-table-column>
          <el-table-column align="center" prop="receiptsNum" label="商品类型" width="200"></el-table-column>
          <el-table-column align="center" prop="receiptsnumber" label="商品材质" width="200"></el-table-column>
          <el-table-column align="center" prop="receiptsNum" label="商品颜色" width="200"></el-table-column>
          <el-table-column align="center" prop="receiptsNum" label="计量单位" width="200"></el-table-column>
          <el-table-column align="center" prop="receiptsNum" label="数量" width="200"></el-table-column>
          <el-table-column align="center" prop="contentText" label="处理数量" width="200">
            <template slot-scope="scope">
              <el-input v-model="scope.row.contentText" size="mini"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submission">确 认</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
    <Internalsales :internalVisible="internalVisible" @closeFun="closeFun"></Internalsales>
  </div>
</template>
<script>
  import Internalsales from "./Internalsales";

  export default {
    components: {
      Internalsales
    },
    props: {
      dialogVisible: Boolean,
      type: '',
      info: {
        type: Array,
        default: () => []
      }
    },
    created() {
    },
    data() {
      return {
        tableData: this.info,
        radio: "",
        internalVisible: false
      };
    },
    methods: {
      handleClose() {
        this.$emit("outerVisibleFun");
      },
      tableRowClassName({row, rowIndex}) {
        return rowIndex % 2 != 0 ? "el-f0" : "";
      },
      handleSelectionChange(val) {
      },
      submission() {
        if (this.radio == 3) {
          this.internalVisible = true;
        }
      },
      closeFun() {
        this.internalVisible = false;
      }
    }
  };
</script>
