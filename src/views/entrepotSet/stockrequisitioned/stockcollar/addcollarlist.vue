<template>
  <div>
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card class="box-card">
      <div class="m-bottom paddingl-r">
        <el-radio v-model="radio" label="1">备货</el-radio>
        <el-radio v-model="radio" label="2">辅材</el-radio>
      </div>
      <div class="paddingl-r">
        <!-- 备货 -->
        <stockapplication ref="stockap" :recipientsNo="recipientsNo" v-if="radio==1"></stockapplication>

        <!-- 辅材 -->
        <auxiliarymaterials ref="auxiliary" :recipientsNo="recipientsNo" v-if="radio==2"></auxiliarymaterials>
      </div>
    </el-card>
    <div class="btn">
      <el-button type="primary" @click="submission">提 交</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import auxiliarymaterials from "./components/auxiliarymaterials";
import stockapplication from "./components/stockapplication";
import { addInstallationRecipients } from "api/entrepotSet/stockrequisitioned/stockcollar";
import { getUUID } from "api/pulicJava";
import { mapGetters } from "vuex";
import { resolve } from "path";
export default {
  components: {
    breadcrumb,
    auxiliarymaterials,
    stockapplication
  },
  data() {
    return {
      navList: [],
      radio: "1", //备货 辅材
      recipientsNo: ""
    };
  },
  created() {
    // this.recipientsNo = this.$route.query.recipientsNo;
  },
  mounted() {
    this.navList = this.$route.meta;
  },
  computed: {
    ...mapGetters(["id"])
  },
  methods: {
    submission() {
      /**
       * 添加物品
       *
       * @params
       * radio  1备货   2辅材
       *
       */

      let data = {};
      if (this.radio == 1) {
        if (!this.$refs.stockap.ruleForm.contractNumber) {
          this.$message.error("请输入合同号!");
          return;
        } else if (!this.$refs.stockap.ruleForm.applyTime) {
          this.$message.error("请输入申请时间!");
          return;
        } else if (!this.$refs.stockap.ruleForm.storageId) {
          this.$message.error("请选择仓库!");
          return;
        }
        let arr = [];
        this.$refs.stockap.tableData.forEach(item => {
          arr.push({
            commoditySKUId:item.skuGoodsId,
            storageId:item.storageId,
            recipientsNum: item.recipientsNum
          });
        });
        data = {
          ...this.$refs.stockap.ruleForm,
          // recipientsNo: this.$route.query.recipientsNo,
          recipientsType: this.radio,
          applyAt: this.id,
          commodityDTOS: arr
        };
      } else {
        if (!this.$refs.auxiliary.ruleForm.applyTime) {
          this.$message.error("请输入申请时间!");
          return;
        } else if (!this.$refs.auxiliary.ruleForm.storageId) {
          this.$message.error("请选择仓库!");
          return;
        }
        let arr = [];
        this.$refs.auxiliary.tableData.forEach(item => {
          arr.push({
            commoditySKUId:item.skuGoodsId,
            storageId:item.storageId,
            recipientsNum: item.recipientsNum
          });
        });
        data = {
          recipientsNo: this.$route.query.recipientsNo,
          recipientsType: this.radio,
          ...this.$refs.auxiliary.ruleForm,
          applyAt: this.id,
          commodityDTOS: arr
        };
      }
      new Promise((resolve, reject) => {
        getUUID({ serialNumber: "IR" }).then(res => {
          resolve(res);
        });
      }).then(res => {
        console.log(res);
        data.recipientsNo = res.data;
        addInstallationRecipients(data)
          .then(res => {
            if (res.status == 200) {
              this.$router.go(-1);
              this.$message.success(res.message);
            }
          })
          .catch(error => {
            console.error("添加物品领用", error);
          });
      });
    },
    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
.btn {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
