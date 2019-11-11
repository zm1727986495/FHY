<template>
  <div class="assignmeasure">
    <!-- <el-dialog
            :visible.sync="isorderList"
            :before-close="handleDialogClose" 
            width="65%">
            <div>
                <div class="warp_head_list">
                <div class="list_top">
                    <div class="head_nav_search">
                        <el-input
                            placeholder="订单编号/客户合同号/客户姓名/客户电话/订单地址"
                            v-model="searchtext"
                            size="medium"
                            maxlength="50">
                        </el-input>
                    </div>
                    <div class="head_nav_datapick">
                         <el-date-picker 
                            v-model="searchData"
                            size="medium" 
                            type="daterange"
                            range-separator="-"
                            start-placeholder="创建订单时间"
                            end-placeholder="创建订单时间"
                            value-format='yyyy-M-dd'
                            format='yyyy-M-dd'
                            ></el-date-picker>
                    </div>
                    <div class="head_nav_select">
                        <el-select v-model="switchState" multiple placeholder="选择状态" size="medium">
                            <el-option
                            v-for="item in stateList"
                            :key="item.id"
                            :label="item.dictName"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                
                    <div class="head_nav_btn">
                        <el-button size="medium" type="warning" class="button-fc" @click="searchFun">查询</el-button>
                        <el-button type='primary' size="medium" @click="resetFun">重置</el-button>
                    </div>
                </div>
            </div>


               <div class="order_table">
                <el-table border
                    ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                    :row-class-name="tableRowClassName" :row-style="tableRowStyle" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" align="center" width="55"></el-table-column>
                    <el-table-column prop="orderStatus" align="center" label="订单状态" width="280" sortable>
                        <template slot-scope="scope">
                            <div>
                               
                            </div>
                            <p class="text">{{scope.row.state}}</p>
                            <p v-if="scope.row.emergency" class="emergency" >{{scope.row.emergency ? '急' : ''}}</p>
                            <p v-if="scope.row.isDiscount" class="discount" >{{scope.row.isDiscount ? '折' : ''}}</p>        
                        </template>
                    </el-table-column>
                    <el-table-column prop="orderNumber" align="center" label="订单号" width="200" sortable></el-table-column>
                    <el-table-column prop="orderType" align="center" label="订单类型" width="200" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderGoodsType" align="center" label="订单货品类型" width="200" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column prop="brandName" align="center" label="产品品牌" width="200" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderExpectMoney" align="center" label="合同金额/元" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div>{{scope.row.orderExpectMoney | fenge}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="paymentAmount" align="center" label="实收金额/元" width="200" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <div>{{scope.row.paymentAmount | fenge}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="giftName" align="center" label="礼品名称" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="giftAmount" align="center" label="礼品数量" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="sendWay" align="center" label="赠送方式" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="reportedType" align="center" label="报备类型" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="creported" align="center" label="c类报备" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerName" align="center" label="客户名称" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="customerPhone" align="center" label="客户电话" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="otherPhone" align="center" label="备用电话" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="address" align="center" label="订单地址" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="salesmanName" align="center" label="销售员" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="businessName" align="center" label="业务员" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="surveyorName" align="center" label="测量员" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="designerName" align="center" label="设计师" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="storeName" align="center" label="所属网点" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderChannel" align="center" label="订单渠道" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderSourceId" align="center" label="订单来源" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createOrderTime" align="center" label="创建订单时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="surveyor_assigned_time" align="center" label="指派测量时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="designer_assigned_time" align="center" label="指派设计时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="visit_time" align="center" label="自定义回访时间" width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="orderRemark" align="center" label="备注" width="200" show-overflow-tooltip></el-table-column>
                </el-table>
            </div>
            </div>
            <div class="pagination_wrap">
                    <pagination
                    :current-page="currentPage"
                    :pageSize="pageSize"
                    :total="total"
                    @sizeChange="sizeChange"
                    @currentChange="currentChange">
                    </pagination>
                </div>
                
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subminbtntask">提 交</el-button>
                <el-button @click="subminbtn">取 消</el-button>
            </span>
    </el-dialog>-->

    <ordercomponent
      v-if="isorderList"
      :centerDialogVisible="isorderList"
      @orderclosefun="orderclosefun"
    ></ordercomponent>
  </div>
</template>

<script>
import { listOrder, listBaseDict } from "api/order/order/order";
import ordercomponent from "@/views/components/ordercomponent";
import pagination from "@/views/components/pagination";
export default {
  components: {
    pagination,
    ordercomponent
  },
  data() {
    return {
      currentPage: 1, //当前页数
      pageSize: 10, //当前页最大条数
      total: 0, //总条数
      searchtext: null, //搜索姓名
      searchData: [], //日期时间
      switchState: [],
      switchType: null, // 类别搜索
      stateList: [], //选择状态
      tableData: [],
      tableSelectList: [],
      isShow: false
    };
  },
  props: {
    isorderList: Boolean,
    dialogvisibletwo: Boolean
  },
  created() {
    // this.getlistOrder();
    // this.orderstatus();
  },
  mounted() {},
  methods: {
    //收起
    hideSearch() {
      this.isShow = !this.isShow;
    },
    //搜索
    searchFun() {
      this.getlistOrder();
    },
    // 重置
    resetFun() {
      this.searchtext = null; // 条件搜索
      // 时间搜索
      this.searchData = [];
      this.switchState = []; // 状态
    },

    //订单弹框选择的数据
    orderclosefun(val) {
      if (val) {
        let obj = {
          assignedMeasureId: val[0].assignedMeasureId || null,
          orderId: val[0].orderId
        };
        this.$emit("orderListfun");
        this.$emit("assignmeasure", obj);
      } else {
        this.$emit("orderListfun");
      }
    },
    //提交
    subminbtntask() {
      if (this.tableSelectList.length == 0) {
        this.$message({
          message: "请选择订单",
          type: "warning"
        });
      } else if (this.tableSelectList.length > 1) {
        this.$message({
          message: "只能选择一条数据",
          type: "warning"
        });
      } else {
        let obj = {
          assignedMeasureId: this.tableSelectList[0].assignedMeasureId || null,
          orderId: this.tableSelectList[0].orderId
        };

        this.$emit("orderListfun");
        this.$emit("assignmeasure", obj);
      }
    },
    subminbtn() {
      //取消
      this.$emit("orderListfun");
    },
    getlistOrder() {
      //获取订单列表
      let data = {
        names: this.searchtext,
        createTimeStart: this.searchData[0],
        createTimeEnd: this.searchData[1],
        orderStatusIds: this.switchState.join(","),
        page: this.currentPage,
        limit: this.pageSize,
        orderType: 0
      };
      listOrder(data)
        .then(res => {
          console.log(res);
          if (res.status == 200) {
            this.total = res.data.total;
            this.tableData = res.data.rows;
          }
        })
        .catch(error => {
          console.log("订单管理:订单列表 order/order/order.vue", error);
        });
    },
    orderstatus() {
      listBaseDict({ dataType: "ORDER_STATUS" })
        .then(res => {
          console.log(res);
          this.stateList = res.data;
        })
        .catch(error => {
          console.error("订单状态", error);
        });
    },
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    // 表格行样式
    tableRowStyle({ row, rowIndex }) {
      // return row.isTovoid != '-' ? 'color:#e1a6ac' : '';
    },
    handleSelectionChange(val) {
      //勾选
      this.tableSelectList = val;
    },
    handleDialogClose() {
      this.$emit("orderListfun");
    },
    sizeChange(val) {
      //翻页方法
      this.currentPage = 1;
      this.pageSize = val;
      this.getlistOrder();
    },
    currentChange(val) {
      //翻页方法
      this.currentPage = val;
      this.getlistOrder();
    }
  },
  filters: {
    fenge(val) {
      return (val + "").replace(/(?=(?!\b)(\d{3})+$)/g, ",");
    }
  }
};
</script>

<style lang="scss" scoped>
.pagination_wrap {
  text-align: center;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.warp_head_list {
  flex-wrap: wrap;
}
.list_top,
.list_bottom {
  width: 100%;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
}
.list_top {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  > div {
    margin: 10px 0px;
    // width: calc(((92.5vw - 250px))/4);
    width: 24%;
    > div {
      width: 100%;
    }
  }
  .head_nav_btn {
    // width: 100%;
    text-align: center;
    .fontMore {
      color: #d0cfcf;
    }
    .btnone {
      margin-left: 10px;
    }
  }
}
.head_nav_search {
  width: 400px;
}
.head_nav_datapick {
  width: 100%;
}
.head_nav_select {
  width: 170px;
  margin: 5px;
}

.assignmeasure {
  .orderfrom {
    margin-top: 10px;
    padding: 0px 70px 0px 20px;
  }
  .fromtwo {
    padding: 0px 70px 0px 20px;
  }
  .orderfrom .el-form-item__label {
    font-weight: 400;
  }

  .orderfrom .demo-form-inline {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .orderfrom .demo-form-inline > div {
    width: 45%;
  }
  .reason {
    display: flex;
    margin-top: 10px;
  }
  .reason .explatxt {
    font-size: 14px;
    width: 100px;
    padding-right: 20px;
    text-align: right;
  }
  .textareabox {
    flex: 1;
  }
  .selewi {
    width: 100%;
  }
}
</style>

