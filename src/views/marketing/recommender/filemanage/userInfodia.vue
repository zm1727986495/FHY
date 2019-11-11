<template>
  <!-- 信息弹出框 -->
  <div class="userInfo_dia">
    <el-dialog title :visible.sync="visible" top="2vh" width="60%" :before-close="handleClose">
        <div class="titlecals">外部推荐人信息</div>
        <div class="maxStyle">
        <div class="infoBody">
          <el-form ref="form" :model="ruleForm" label-width="120px">
            <el-form-item label="公司">
              <el-input :disabled="true" v-model="ruleForm.companyName"></el-input>
            </el-form-item>
            <el-form-item label="外部推荐人">
              <el-input :disabled="true" v-model="ruleForm.referrerName"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input :disabled="true" v-model="ruleForm.phone"></el-input>
            </el-form-item>
            <!-- 外部推荐人类型 -->
            <el-form-item label="外部推荐人类型">
              <el-select
                :disabled="true"
                v-model="ruleForm.outsidetReferrerType"
                placeholder="外部推荐人类型"
                class="width-100"
              >
                <el-option label="家装工长" value="0"></el-option>
                <el-option label="家装设计师" value="1"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="状态">
              <el-radio :disabled="true" v-model="ruleForm.jobState" label="1">在职</el-radio>
              <el-radio :disabled="true" v-model="ruleForm.jobState" label="2">离职</el-radio>
            </el-form-item>
            <div class="recommendNumber">
              <div class="recommendNumber_box">
                <div class="recommendNumber_title">推荐订单总数</div>
                <div
                  class="recommendNumber_content pointer"
                  @click="openinner"
                >{{ruleForm.recommendNumber}}</div>
              </div>
              <div class="recommendNumber_box">
                <div class="recommendNumber_title">返点总金额</div>
                <div
                  class="recommendNumber_content pointer"
                  @click="openinner"
                >{{ruleForm.totalMoney}}</div>
              </div>
            </div>

            <el-form-item label="岗位">
              <el-input :disabled="true" v-model="ruleForm.position"></el-input>
            </el-form-item>

            <el-form-item label="户名">
              <el-input :disabled="true" v-model="ruleForm.accountName"></el-input>
            </el-form-item>

            <el-form-item label="开户行">
              <el-input :disabled="true" v-model="ruleForm.openingBank"></el-input>
            </el-form-item>

            <el-form-item label="账号">
              <el-input :disabled="true" v-model="ruleForm.accountNumber"></el-input>
            </el-form-item>

            <el-form-item label="身份证复印件">
              <ul class="flex_box">
                <li v-for="(file,index) in ruleForm.fileList1" :key="index">
                  <img :src="file.fileUrl" alt class="flex_box_img" />
                </li>
              </ul>
            </el-form-item>

            <el-form-item label="银行卡复印件">
              <ul class="flex_box">
                <li v-for="(file,index) in ruleForm.fileList2" :key="index">
                  <img :src="file.fileUrl" alt class="flex_box_img" />
                </li>
              </ul>
            </el-form-item>

            <el-form-item label="名片附件">
              <ul class="flex_box">
                <li v-for="(file,index) in ruleForm.fileList3" :key="index">
                  <img :src="file.fileUrl" alt class="flex_box_img" />
                </li>
              </ul>
            </el-form-item>

            <el-form-item label="推荐协议">
              <ul class="flex_box">
                <li v-for="(file,index) in ruleForm.fileList4" :key="index">
                  <img :src="file.fileUrl" alt class="flex_box_img" />
                </li>
              </ul>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </span>
      <el-dialog width="55%" :visible.sync="innerVisible" append-to-body>
        <div class="titlecals">推荐人订单详情</div>
        <!-- table表格 -->
        <div class="table_list lvs attribute m-top20">
          <el-table border :data="tabList" style="width: 100%;">
            <el-table-column
              prop="createOrderTime"
              label="订单创建时间"
              width="240"
              sortable
              align="center"
            ></el-table-column>

            <el-table-column prop="orderNumber" label="订单号" width="240" sortable align="center"></el-table-column>

            <el-table-column prop="signingTime" label="合同签订时间" width="240" sortable align="center"></el-table-column>

            <el-table-column
              prop="contractSerialNumber"
              label="客户合同号"
              width="240"
              sortable
              align="center"
            ></el-table-column>

            <el-table-column prop="rebatesMoney" label="返点金额" width="240" sortable align="center"></el-table-column>
          </el-table>
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
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>

import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import { getNames } from "src/utils/pubilcFn.js";
import {
  recommendedOrderInfo //查询
} from "@/api/order/recommender/filemanage";
export default {
  props: ["visible", "ruleForm"],
  components: {
    breadcrumb,
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {
      innerVisible: false,
      fileList1: [],
      fileList2: [],
      fileList3: [],
      fileList4: [],
      currentPage: 1,
      pageSize: 10,
      total: 100,
      tabList: []
    };
  },
  mounted() {},
  methods: {
    //关闭回调函数
    handleClose() {
      this.$emit("close_user");
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.openinner();
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.openinner();
    },
    openinner() {
      this.innerVisible = true;
      let data = {
        referrerId: this.ruleForm.referrerId,
        page: this.currentPage,
        limit: this.pageSize
      };
      recommendedOrderInfo(data)
        .then(res => {
          console.log(res);
          this.tabList = res.data.rows;
          this.total = res.data.total;
        })
        .catch(error => {
          console.error("recommendedOrderInfo获取推荐人订单详情" , error);
        });
    }
  }
};
</script>
<style scoped lang='scss'>
.userInfo_dia {
  .maxStyle{
    max-height: 600px;
    overflow-y: auto;
  }
  .infoBody {
    width: 90%;
    // max-height:500px;
    // overflow-y: auto;

    // border: 1px solid red;
    margin: 0 auto;
  }
  .dialog-footer {
    margin-right: 5%;
  }
  .el-upload--picture-card {
    display: none;
  }
  .flex_box {
    display: flex;
    flex-wrap: wrap;
    .flex_box_img {
      margin: 5px 5px;
      display: inline;
      width: 120px;
      height: 120px;
      border-radius: 8px;
    }
  }
  .el-upload .el-upload--picture-card {
    display: none !important;
  }
  .recommendNumber {
    display: flex;
    flex-wrap: nowrap;
    .recommendNumber_box {
      display: flex;
      flex-wrap: nowrap;
      width: 50%;
      .recommendNumber_title {
        display: inline-block;
        width: 120px;
        text-align: right;
        font-weight: 700;
        padding-right: 12px;
        margin-bottom: 20px;
      }
      .recommendNumber_content {
        color: #6492ff;
      }
    }
  }
}
</style>

