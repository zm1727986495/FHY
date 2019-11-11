<template>
  <div class="stockupform">
    <div class="table_list lvs attribute">
      <el-table border style="width: 100%" :row-class-name="tableRowClassName" :data="tableData">
        <el-table-column align="center" type="selection"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="库存状态" sortable>
          <template slot-scope="scope">
            <div>
              <el-tooltip placement="right" visible-arrow>
                <div slot="content" class="tips tipFon">
                  <p @click="editHandle(scope.row)" class="operaItems">查看</p>
                </div>
                <img :src="spot" alt class="attributesTips">
              </el-tooltip>
              <p class="operation">{{scope.row.receiptsNum}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="商品名称"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="商品规格"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="商品类型"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="计量单位"></el-table-column>
        <el-table-column align="center" prop="receiptsNum" label="实际库存总数"></el-table-column>
      </el-table>
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
    <div>
      <el-dialog :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
        <div class="titlecals">查看废品详情</div>
        <div>
          <scrapdetails></scrapdetails>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import pagination from "../../../../components/pagination";
import scrapdetails from "./scrapdetails";
import spot from "@/assets/images/spot.png";
export default {
  components: {
    pagination,
    scrapdetails
  },
  data() {
    return {
      tableData: [{ receiptsNum: "哈哈" }],
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 100, //总条数
      spot,
      dialogVisible: false
    };
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    sizeChange(val) {
      //翻页方法
      this.currentPage = 1;
      this.pageSize = val;
    },
    currentChange(val) {
      //翻页方法
      this.currentPage = val;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    editHandle() {
      this.dialogVisible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.stockupform {
  .nameFun {
    cursor: pointer;
  }
  .process_name {
    display: flex;
    justify-content: space-around;
    align-items: center;
    > p {
      flex: 1;
    }
    > div {
      width: 25px;
    }
  }
  .tradename {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #990000;
    color: #fff;
    line-height: 20px;
    text-align: center;
  }
  .borrow {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ffa847;
    color: #fff;
    line-height: 20px;
    text-align: center;
    cursor: pointer;
  }
  .labelicon {
    padding: 2px 0px;
    background: red;
    color: #ffffff;
    font-size: 12px;
    position: relative;
    width: 130px;
  }
  .labelI::after {
    display: block;
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-right: 15px solid transparent;
    border-left: 16px solid transparent;
    border-bottom: 10px solid #ff0000;
    bottom: 9px;
    right: -20px;
    transform: rotate(90deg);
  }
  .labelicon2 {
    padding: 2px 0px;
    background: #ffa847;
    color: #ffffff;
    font-size: 12px;
    position: relative;
    width: 130px;
  }
  .labelI2::after {
    display: block;
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-right: 15px solid transparent;
    border-left: 16px solid transparent;
    border-bottom: 10px solid #ffa847;
    bottom: 9px;
    right: -20px;
    transform: rotate(90deg);
  }
  .labelicon3 {
    padding: 2px 0px;
    background: #999999;
    color: #ffffff;
    font-size: 12px;
    position: relative;
    width: 130px;
  }
  .labelI3::after {
    display: block;
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-right: 15px solid transparent;
    border-left: 16px solid transparent;
    border-bottom: 10px solid #999999;
    bottom: 9px;
    right: -20px;
    transform: rotate(90deg);
  }
  .labelicon4 {
    padding: 2px 0px;
    background: #1abc9c;
    color: #ffffff;
    font-size: 12px;
    position: relative;
    width: 130px;
  }
  .labelI4::after {
    display: block;
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-right: 15px solid transparent;
    border-left: 16px solid transparent;
    border-bottom: 10px solid #1abc9c;
    bottom: 9px;
    right: -20px;
    transform: rotate(90deg);
  }
  .typeBg {
    display: flex;
    justify-content: center;
  }
}
</style>
