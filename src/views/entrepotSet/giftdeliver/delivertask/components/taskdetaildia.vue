<template>
  <div class="delivertaskdia">
    <el-dialog
      title="指派派送任务"
      :visible.sync="visible"
      width="1050px"
      :before-close="handleClose"
      custom-class="customDialogTitle"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="提货时间：">{{inFo.pickUpTime}}</el-form-item>
          </div>
          <div class="infoform_item"></div>
        </div>

        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="选择组长：">
              {{inFo.leaderName}}
              <!-- <el-input v-model="ruleForm.companyName"></el-input> -->
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="司机：">
              {{inFo.driver}}
              <!-- <el-input v-model="ruleForm.referrerName"></el-input> -->
            </el-form-item>
          </div>
        </div>

        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="选择工人：">{{inFo.workerName}}</el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="司机电话：" prop="referrerName">{{inFo.driverPhone}}</el-form-item>
          </div>
        </div>

        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="借调工人：">{{inFo.secondWorkerName}}</el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="派车车牌号：" prop="referrerName">{{inFo.sendCarNumber}}</el-form-item>
          </div>
        </div>
        <el-form-item label="备注：">{{inFo.reportRemark}}</el-form-item>
      </el-form>

      <!-- table表格 -->
      <div class="table_list lvs attribute m-top20" v-for="(item,index) in inFo.sendGifts" :key="index">
        <div class="headerdiv">
          <div>
            <span>联系人：</span>
            <span>{{item.contactName}}</span>
          </div>
          <div>
            <span>电话：</span>
            <span>{{item.contactPhone}}</span>
          </div>
          <div>
            <span>领用门店：</span>
            <span>{{item.storeName}}</span>
          </div>
          <div>
            <span>领用编码：</span>
            <span>{{item.applyCode}}</span>
          </div>
          <div>
            <span>要求到店时间：</span>
            <span>{{item.arrivalTime}}</span>
          </div>
        </div>
        <el-table border :row-class-name="tableRowClassName" :data="item.sendCommodities" style="width: 100%;">
          <el-table-column prop="commodityCode" label="礼品编码" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="brandName" label="品牌" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="categoryName" label="品类" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="commodityName" label="商品名称" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="applyNumber" label="领用数量" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="storageName" label="所属仓库" width="240" sortable align="center"></el-table-column>
        </el-table>
      </div>
      <div class="btn_list m-top5">
        <el-button @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import { giftSendDetails } from "api/entrepotSet/giftdeliver/giftdeliver";
export default {
  props: ["visible", "giftSendId"],
  components: {
    breadcrumb,
    pagination
  },
  mounted() {
    let data = {
      giftSendId: this.giftSendId
    };
    giftSendDetails(data)
      .then(res => {
        if (res.status == "200") {
          this.inFo = res.data;
        }
      })
      .catch(error => {
        console.log(
          error +
            "views/entrepotSet/giftdeliver/delivertask/components/taskdetaildia"
        );
      });
  },
  data() {
    return {
      ruleForm: {}, //发送表单
      rules: {
        time: [{ required: true, message: "请选择日期", trigger: "change" }]
      },
      tabList: [],
      inFo: {}
    };
  },

  methods: {
    //关闭方法
    handleClose() {
      this.$emit("close_task");
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    submitForm() {},
    resetForm() {}
  }
};
</script>
<style scoped lang='scss'>
.delivertaskdia {
  .infoform {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    .infoform_item {
      width: 50%;
    }
  }
  .headerdiv {
    width: 100%;
    height: 35px;
    padding: 0 5px;
    background: #f2f2f2;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    > div {
      span:nth-child(1) {
        font-weight: 700;
      }
    }
  }
  .btn_list {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

