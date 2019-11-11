<template>
  <div class="gift_examine">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>

    <el-card>
      <el-form :model="ruleForm" label-width="135px">
        <div class="search_box">
          <el-form-item label="申请单号：">
            <el-input v-model="ruleForm.applyOdd" disabled></el-input>
          </el-form-item>
          <el-form-item></el-form-item>
          <el-form-item></el-form-item>
        </div>

        <div class="search_box">
          <el-form-item label="门店：">
            <el-input v-model="ruleForm.storeName" style="width:100%" disabled></el-input>
          </el-form-item>

          <el-form-item label="门店人员：">
            <el-input v-model="ruleForm.contactName" style="width:100%" disabled></el-input>
          </el-form-item>

          <el-form-item label="联系人电话：" class="width-100">
            <el-input placeholder="联系人电话" disabled v-model="ruleForm.contactPhone"></el-input>
          </el-form-item>
        </div>
        <div class="search_box">
          <el-form-item label="预计到货时间：">
            <el-date-picker
              disabled
              style="width:100%"
              v-model="ruleForm.estimatedTimeOfArrival"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="品牌：">
            <el-input v-model="ruleForm.brandName" disabled style="width:100%"></el-input>
          </el-form-item>

          <el-form-item label="品类：">
            <el-input v-model="ruleForm.categoryName" disabled style="width:100%"></el-input>
          </el-form-item>
        </div>
        <div class="search_item_area">
          <el-form-item label="申请原因：" class="width-100">
            <el-input
              disabled
              type="textarea"
              placeholder="申请原因"
              v-model="ruleForm.applyReason"
              class="width-100"
            ></el-input>
          </el-form-item>
        </div>

        <div>
          <div class="iconBox">
            <i class="Icon"></i>
            <span>申领清单</span>
          </div>

          <div class="search_item_list table_list lvs attribute">
            <el-table border :row-class-name="tableRowClassName" :data="ruleForm.storeGiftsList">
              <el-table-column
                width="240"
                prop="commodityCode"
                align="center"
                label="礼品编码"
                sortable
              ></el-table-column>
              <el-table-column width="240" prop="brandName" align="center" label="礼品品牌" sortable></el-table-column>
              <el-table-column width="240" prop="categoryName" align="center" label="礼品品类" sortable></el-table-column>
              <el-table-column
                width="240"
                prop="commodityName"
                align="center"
                label="礼品名称"
                sortable
              ></el-table-column>
              <el-table-column width="240" prop="colourName" align="center" label="颜色" sortable></el-table-column>
              <el-table-column width="240" prop="seriesName" align="center" label="选择系列" sortable></el-table-column>
              <el-table-column width="240" prop="materialName" align="center" label="选择材质" sortable></el-table-column>
              <!-- <el-table-column
                width="240"
                prop="sumInventoryNumber"
                align="center"
                label="库存数"
                sortable
              ></el-table-column> -->
              <el-table-column
                width="240"
                prop="inventoryGoodsDTOList"
                align="center"
                label="申请数量"
                sortable
              >
                <template slot-scope="scope">
                  <p @click="distribution(scope.row)" class="table_action_span">查看数量</p>
                </template>
              </el-table-column>
              <el-table-column
                width="240"
                prop="collarNumber"
                align="center"
                label="领用到店数量"
                sortable
              ></el-table-column>
            </el-table>
          </div>
        </div>

        <div class="btn_btq">
          <el-button class="el-button--medium" type="primary" @click="sendJava(0)">通过</el-button>
          <el-button class="el-button--medium" type="primary" @click="sendJava(1)">驳回</el-button>
          <el-button class="el-button--medium" type="primary" size="info" @click="backFun">取消</el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 礼品数量选择 -->
    <stockLook :visible="stockNum_vis" :rowObj="rowObj" @close_num="closeNum"></stockLook>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import stockLook from "./components/stockLook"; //库存数量弹框
import { getNoNumber } from "api/entrepotSet/inventorymanagement/storeInventory/storeInventory"; //礼品库存数量查询
import { getUUID } from "api/pulicJava"; //生成编码

import {
  getUserStore, //获取登录人所属门店
  auditGiftRecipientsInfo, //回显信息
  auditRecipients //审核
} from "@/api/order/giftmanagement/giftmanagement";
import { resolve } from "url";
import { log } from "util";

export default {
  data() {
    return {
      navList: [], //头部面包屑
      ruleForm: {
        // storeGiftList: []
        contactName: "",
        contactPhone: "",
        storeGiftsList: []
      },
      stockNum_vis: false, //库存数量弹框是否显示
      rowObj: [] //库存数量要用对象信息
    };
  },
  activated(){
    this.navList = this.$route.meta;
    this.auditGiftRecipientsInfo(); //回显信息
  },
  // deactivated () {
  //     this.$destroy(true)
  // },

  // mounted() {
  //   this.navList = this.$route.meta;
  //   this.auditGiftRecipientsInfo(); //回显信息
  // },

  methods: {
    //回显信息
    auditGiftRecipientsInfo() {
      let data = {
        giftCollarId: this.$route.query.giftCollarId
      };
      auditGiftRecipientsInfo(data)
        .then(res => {
          this.ruleForm = res.data;
        })
        .catch(error => {
          console.log(
            error + "views/marketing/giftmanagement/giftapply/examine"
          );
        });
    },
    //通过  驳回  审核状态
    sendJava(val) {
      new Promise((resolve, reject) => {
        getUUID({ serialNumber: "AD" }).then(res => {
          resolve(res);
        });
      }).then(res => {
        let data = {
          applyCode:res.data,
          auitStatus: val,
          storeId: this.ruleForm.storeId,
          estimatedTimeOfArrival: this.ruleForm.estimatedTimeOfArrival,
          giftCollarId: this.$route.query.giftCollarId
        };
        auditRecipients(data)
          .then(res => {
            if (res.status == "200") {
              this.$message.success("审核礼品成功");
              this.$router.go(-1);
            }
          })
          .catch(error => {
            console.log(
              error + "views/marketing/giftmanagement/giftapply/examine"
            );
          });
      });
    },

    //取消按钮
    backFun() {
      this.$router.go(-1);
    },

    //根据仓库填数量
    distribution(obj) {
      this.rowObj = obj;
      this.stockNum_vis = true;
    },

    //关闭仓库的数量分配弹框
    closeNum() {
      this.stockNum_vis = false;
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      return "height: 50px";
    }
  },
  computed: {
    commodityIds() {
      let arr = [];
      this.storeGiftsList.forEach(item => {
        arr.push(item.commodityId);
      });
      return arr;
    }
  },

  components: {
    breadcrumb,
    pagination,
    stockLook //库存数量弹框
  }
};
</script>

<style scope lang="scss">
.gift_examine {
  .search_box {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    width: 97%;
    > div {
      width: 33%;
    }
  }

  .search_item_area {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    padding-bottom: 25px;
    width: 97%;
    // div {
    //   width: 97%;
    // }
  }
  .search_item_list {
    margin-top: 20px;
    display: flex;
    flex-wrap: nowrap;
    > span {
      min-width: 100px;
      text-align: right;
    }
  }

  .btn_list_2 {
    width: 100%;
    text-align: right;
  }
  .btn_btq {
    width: 300px;
    margin: 20px auto;
  }
}
</style>
