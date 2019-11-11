<template>
  <div class="failurelist">
    <div class="head_nav" ref="topInfo">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <div class="action_btn m-bottom10">
        <el-button type="default" size="small" class="button-96" @click="butGroupAction">导出</el-button>
        <el-upload
          action="/api/pc/commodity/importCommodity"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          class="upload-demo"
          multiple
          :headers="headers"
          :show-file-list="false"
          :before-upload="beforeUploat"
          :on-success="uploadSuccess"
          style="display:inline-block;margin-left:10px"
        >
          <el-button class="button-96" size="small">重新导入</el-button>
        </el-upload>
      </div>

      <div class="table_list lvs attribute" v-loading="loading">
        <el-table border :data="tabList" :row-class-name="tableRowClassName">
          <el-table-column prop="returnReason" label="失败原因" width="220" align="center"></el-table-column>
          <el-table-column prop="commodityCode" label="商品编码" width="220" align="center"></el-table-column>
          <el-table-column
            prop="commodityName"
            label="商品名称"
            width="220"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="brandName" label="品牌名称" width="220" align="center" sortable></el-table-column>
          <el-table-column prop="categoryName" label="品类名称" width="220" align="center"></el-table-column>
          <el-table-column
            prop="classifyFirstName"
            label="分类名称"
            width="220"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="commodityModel" label="商品型号" width="220" align="center"></el-table-column>
          <el-table-column prop="valuationMethod" label="计价方式" width="220" align="center"></el-table-column>
          <el-table-column prop="status" label="状态" width="220" align="center"></el-table-column>
          <el-table-column prop="commodityLong" label="深" width="220" align="center"></el-table-column>
          <el-table-column prop="commodityWide" label="宽" width="220" align="center"></el-table-column>
          <el-table-column prop="commodityHigh" label="高" width="220" align="center"></el-table-column>
          <el-table-column prop="commodityThick" label="厚" width="220" align="center"></el-table-column>
          <el-table-column prop="is_warehousing" label="是否入库" width="220" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.is_warehousing==0">否</span>
              <span v-else>是</span>
            </template>
          </el-table-column>
          <el-table-column prop="isUnpacking" label="是否拆包" width="220" align="center"></el-table-column>
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
    </el-card>
    <div class="btn">
      <el-button size="medium" @click="cancel">返 回</el-button>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import { listFailImportByPage } from "api/productmanage/goodsmanage/goodsmanage";
import module from "../../../../config/index"; //导出文件
import { getToken } from "utils/auth";
export default {
  components: {
    breadcrumb,
    pagination
  },
  data() {
    return {
      navList: [], //导航栏
      tabList: [], //商品列表
      loading: false,
      headers: {
        Authorization: getToken()
      },
      currentPage: 1, //当前页数
      pageSize: 20, //当前页最大条数
      total: 0 //总条数
    };
  },
  mounted() {
    this.navList = this.$route.meta;
    this.getData();
  },
  methods: {
    getData() {
      listFailImportByPage()
        .then(res => {
          if (res.status == 200) {
            this.tabList = res.data.rows;
            this.total = res.data.total;
          }
        })
        .catch(error => {
          console.error("获取失败列表", error);
        });
    },
    //导入之前
    beforeUploat(file) {},
    //导入成功
    uploadSuccess(file) {
      if (file.status == 200) {
        this.getData();
      }
    },
    //导出
    butGroupAction() {
      let str =
        module.dev.proxyTable["/api"].target +
        "/api/pc/commodity/exportCost?token=" +
        getToken();
      window.location.href = str;
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
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
    //返回
    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
.failurelist {
  .btn {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
  .action_btn {
    display: flex;
  }
}
</style>
