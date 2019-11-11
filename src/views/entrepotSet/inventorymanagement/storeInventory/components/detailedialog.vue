<template>
  <div class="detailedialog">
    <el-dialog :visible.sync="outerVisible" width="900px" title="明细" class="customDialogTitle" :before-close="handleClose">
       <div class="detailedlist">
        <div>
          <ul class="customerlist">
            <li><span class="fw">名称：</span><span>{{storedata.storeName}}</span></li>
            <li><span class="fw">店长：</span><span>{{storedata.shopManager}}</span></li>
            <li><span class="fw">联系方式：</span><span>{{storedata.phone}}</span></li>
            <li><span class="fw">地址：</span><span>{{storedata.address}}</span></li>
            <li><span class="fw">备注：</span><span>{{storedata.remark}}</span></li>
          </ul>
        </div>
        <div class="m-top10">
          <span class="fw">店面库存列表：</span>
          <div class="table_list lvs attribute m-top10">
            <el-table border style="width: 100%" :row-class-name="tableRowClassName" :data="tableData">
              <el-table-column align="center" prop="commodityCode" label="商品编码" sortable width="200"></el-table-column>
              <el-table-column align="center" prop="commodityName" label="商品名称" width="200"></el-table-column>
              <el-table-column align="center" prop="commodityUnit" label="计量单位" width="200"></el-table-column>
              <el-table-column align="center" prop="orderNum" label="来源" width="200"></el-table-column>
              <el-table-column align="center" prop="warehouse" label="来源单号" width="200"></el-table-column>
              <el-table-column align="center" prop="driver" label="门店数量" width="200"></el-table-column>
              <el-table-column align="center" prop="deliverGoods" label="在途数量" width="200"></el-table-column>
              <el-table-column align="center" prop="noNumber" label="未提数量" width="200">
                <template slot-scope="scope">
                  <div class="table_action_span" @click="unknownFun(scope.row)">{{scope.row.noNumber}}</div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="department" label="成本金额" width="200"></el-table-column>
            </el-table>
          </div>
          <div class="pagination_wrap">
            <pagination
              :current-page="currentPage" :pageSize="pageSize" :total="total"
              @sizeChange="sizeChange" @currentChange="currentChange">
            </pagination>
          </div>
        </div>
        <div>
          <el-dialog width="40%" :visible.sync="innerVisible" append-to-body>
            <div class="titlecals">库存</div>
            <div class="table_list lvs attribute m-top10">
            <el-table border style="width: 100%" :row-class-name="tableRowClassName" :data="dataList">
              <el-table-column align="center" prop="receiptsNum" label="商品名称" sortable width="200"></el-table-column>
              <el-table-column align="center" prop="receiptsType" label="类型" width="200"></el-table-column>
              <el-table-column align="center" prop="getStorageType" label="所属仓库" width="200"></el-table-column>
              <el-table-column align="center" prop="orderNum" label="数量" width="200"></el-table-column>
              <el-table-column align="center" prop="warehouse" label="货位" width="200"></el-table-column>
            </el-table>
          </div>
          </el-dialog>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import detailedlist from './detailedlist'
import pagination from "@/views/components/pagination";
import { getStoreById, storeInventoryGoodsByPage, getNoNumber } from "api/entrepotSet/inventorymanagement/storeInventory/storeInventory";
export default {
  components:{
    detailedlist,
    pagination
  },
  props: {
    outerVisible: Boolean,
    storeids: Number
  },
  data() {
    return {
      storeId: this.storeids,
      input:'',
      storedata: {},
      tableData: [],
      innerVisible:false,
      dataList:[{}],
      currentPage: 1,//当前页数
      pageSize: 5,//每页显示个数
      total: 0,//总条数
    };
  },
  created() {
    // 获取门店信息
    getStoreById({storeId: this.storeId}).then(res => {
      if(res.status == 200){
        this.storedata = res.data;
      }
    }).catch(error => {
      console.error("获取店面库存列表", error);
    });

    this.datafun()
  },
  methods: {
    datafun(){
      // 门店id获取门店-店面库存列表信息
      let data = {
        storeId: this.storeId,
        page: this.currentPage,
        limit: this.pageSize
      }
      storeInventoryGoodsByPage(data).then(res => {
        if(res.status == 200){
          this.tableData = res.data.rows;
          this.total = res.data.total
        }
      }).catch(error => {
        console.error("获取店面库存列表", error);
      });
    },
    handleClose(){
      this.$emit('closeFun')
    },
    searchFun(){//查询

    },
    Reset(){//重置

    },
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    // 店面库存-未提数量
    unknownFun(data) {
      this.innerVisible = true;
      let val = {
        skuGoodsId: data.skuGoodsId,
        storeId: this.storeId,
      }
      getNoNumber(val).then(res => {
        if(res.status == 200){
          this.tableData = res.data;
          this.total = res.total
        }
      }).catch(error => {
        console.error("获取店面库存列表", error);
      });
    },
    sizeChange(val) {//翻页方法
      this.currentPage = 1;
      this.pageSize = val;
      this.datafun()
    },
    currentChange(val) {//翻页方法
      this.currentPage = val;
      this.datafun()
    },
  },
};
</script>
<style lang="scss" scoped>
.detailedialog {
  .contentS{
    padding: 0 20px;
  }
  .query{
    display: flex;
    padding: 0 20px;
    justify-content:space-between;
  }

  .detailedlist {
    .outgoingremarks {
      display: flex;
      .inputStyle {
        width: 100%;
      }
    }
    .customerlist {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 33%;
        line-height: 30px;
        span {
          font-weight: none !important;
        }
      }
    }
    .unknown {
      cursor: pointer;
    }
  }
}
</style>
