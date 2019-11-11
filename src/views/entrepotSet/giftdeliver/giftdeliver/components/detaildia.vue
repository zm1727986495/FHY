<template>
  <!-- 礼品详情弹出框 -->
  <div class="detaildia">
    <el-dialog
      title="礼品详情"
      :visible.sync="visible"
      width="850px"
      :before-close="handleClose"
      custom-class="customDialogTitle"
    >
      <div class="detail_box">
        <div class="box_item">
          <span>领用编码：</span>
          <span>{{inFo.applyCode}}</span>
        </div>
        <div class="box_item">
          <span>审批时间：</span>
          <span>{{inFo.auditTime}}</span>
        </div>
        <div class="box_item">
          <span>领用门店：</span>
          <span>{{inFo.storeName}}</span>
        </div>
      </div>

      <div class="detail_box">
        <div class="box_item">
          <span>到店时间：</span>
          <span>{{inFo.arrivalTime}}</span>
        </div>
        <div class="box_item">
          <span>申请人：</span>
          <span>{{inFo.applyName}}</span>
        </div>
        <div class="box_item">
          <span>申请时间：</span>
          <span>{{inFo.applyTime}}</span>
        </div>
      </div>

      <div class="detail_box">
        <div class="box_item">
          <span>联系人：</span>
          <span>{{inFo.contactName}}</span>
        </div>
        <div class="box_item">
          <span>联系电话：</span>
          <span>{{inFo.contactPhone}}</span>
        </div>
        <div class="box_item">
          <span>审批人：</span>
          <span>{{inFo.auditUserName}}</span>
        </div>
      </div>

      <div class="detail_concent">
        <span>申请原因：</span>
        <span>{{inFo.applyReason}}</span>
      </div>
      <!-- table表格 -->
      <div class="table_list lvs attribute m-top20">
        <el-table border :row-class-name="tableRowClassName" :data="tabList" style="width: 100%;">
          <el-table-column prop="commodityCode" label="礼品编码" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="brandName" label="品牌" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="categoryName" label="品类" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="commodityName" label="商品名称" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="applyNumber" label="领用数量" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="storageName" label="所属仓库" width="240" sortable align="center"></el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination_wrap">
        <pagination
          :current-page="currentPage"
          :pageSize="pageSize"
          :total="total"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
        ></pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";

import {
  listSendCommodity,
  sendGiftDetails
} from "api/entrepotSet/giftdeliver/giftdeliver";

export default {
  props: ["visible", "sendGiftId"],
  components: {
    breadcrumb,
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {
      tabList: [],
      inFo: {}, //基本信息
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 100 //总条数
    };
  },

  mounted() {
    this.getDataFun();
  },

  methods: {
    //关闭方法
    handleClose() {
      this.$emit("close_detail");
    },

    getDataFun() {
      let data = {
        sendGiftId: this.sendGiftId
      };
      console.log(data);
      //获取礼品详情
      sendGiftDetails(data)
        .then(res => {
          this.inFo = res.data;
        })
        .catch(error => {
          console.log(
            error +
              "views/entrepotSet/giftdeliver/giftdeliver/components/detaildia"
          );
        });
      //获取列表
      this.pagetagFun();
    },

    pagetagFun() {
      let data = {
        sendGiftId: this.sendGiftId,
        page: this.currentPage,
        limit: this.pageSize
      };
      //获取礼品清单列表
      listSendCommodity(data)
        .then(res => {
          this.tabList = res.data.rows;
          this.total = res.data.total;
        })
        .catch(error => {
          console.log(
            error +
              "views/entrepotSet/giftdeliver/giftdeliver/components/detaildia"
          );
        });
    },

    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.pagetagFun();
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.pagetagFun();
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style scoped lang='scss'>
.detaildia {
  .detail_box {
    display: flex;
    flex-wrap: nowrap;
    // padding: 0px 20px;
    .box_item {
      width: 33%;
      margin-bottom: 10px;
      span:nth-child(1) {
        display: inline-block;
        min-width: 100px;
        text-align: right;
        font-weight: 700;
      }
    }
  }
  .detail_concent {
    span:nth-child(1) {
      display: inline-block;
      min-width: 100px;
      text-align: right;
      font-weight: 700;
    }
  }
}
</style>

