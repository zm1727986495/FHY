<template>
  <div class="price_pop">
    <el-dialog
      :title="title"
      custom-class="customDialogTitle"
      :visible.sync="visible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <!-- <div class="titlecals">{{title}}</div> -->
      <el-form>
        <el-form-item label="价格类型:" :label-width="formLabelWidth">
          <el-select
            @change="priceTypeFun"
            v-model="type"
            placeholder="价格类型"
            clearable
            class="input_width"
          >
            <el-option
              v-for="item in pricetypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择公司:" :label-width="formLabelWidth" v-if="type==1">
          <el-select v-model="companyIds" placeholder="选择公司" multiple clearable class="input_width">
            <el-option
              v-for="item in choosingList"
              :key="item.companyId"
              :label="item.companyName"
              :value="item.companyId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格策略名称:" :label-width="formLabelWidth">
          <el-input
            v-model="curName"
            autocomplete="off"
            placeholder="请输入价格策略名称"
            class="input_width"
          ></el-input>
        </el-form-item>
        <el-form-item label="有效期:" :label-width="formLabelWidth" class="date_picker_input">
          <el-date-picker
            v-model="curDate"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            @change="dataChange($event)"
            range-separator="-"
            start-placeholder="年-月-日"
            end-placeholder="年-月-日"
            width="100%"
            class="input_width"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注:" :label-width="formLabelWidth">
          <el-input v-model="remarks" autocomplete="off" placeholder="请输入备注" class="input_width"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitBtn">提交</el-button>
        <el-button @click="colseBtn">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  addPriceTactics,
  listPriceStrategy,
  listStore,
  editPriceStrategyById,
  deletePriceStrategy,
  inlistStore, // 价格策略下的门店列表
  editPriceStrategyStatus, // 发布撤回功能
  listCompanyByAll //公司
} from "api/price/price";

export default {
  props: ["title", "dateDate", "datapop", "id", "arr", "organId"],

  data() {
    return {
      curDate: [],
      curName: "",
      remarks: "",
      startTime: "",
      endTime: "",
      formLabelWidth: "120px",
      // 控制弹出框是否显示
      visible: true,
      choosingList: [],
      companyIds: [],
      type: "",
      pricetypeList: [
        {
          name: "标准销售价",
          id: 0
        },
        {
          name: "渠道销售价",
          id: 1
        }
      ]
    };
  },
  created() {
    this.visible = true;
    setTimeout(() => {
      this.curDate = this.dateDate;
      if (this.title == "修改价格策略") {
        this.curName = this.datapop.priceStrategyName;
        this.remarks = this.datapop.remarks;
        this.type = this.datapop.type;
        if (this.type == 1) {
          this.companyIds = this.datapop.companyIds.split(",").map(item => {
            return Number(item);
          });
        }
      }
    }, 0);
    if (this.id != 0) {
      // this.getinStoreList(this.id); // 获取价格策略下的门店列表
      this.curId = 0;
      this.$emit("edit-id", 0);
    } else {
      // this.randomTitle = "新增价格策略"; // 修改弹出框名字
      this.curDate = [];
    }
  },
  mounted() {
    this.getCompanyByAll();
  },
  methods: {
    //获取公司列表
    getCompanyByAll() {
      let data = {
        companyType: "1"
      };
      listCompanyByAll(data)
        .then(res => {
          this.choosingList = res.data;
        })
        .catch(error => {
          console.error("获取公司列表", error);
        });
    },

    dataChange(dates) {
      this.startTime = dates ? dates[0] : "";
      this.endTime = dates ? dates[1] : "";
      this.$emit("data-change", "pop", this.curDate);
    },
    colseBtn() {
      this.$emit("submint-change", "");
    },
    //价格类型改变执行
    priceTypeFun(val) {
      if (val == 0) {
        this.companyIds = [];
      }
    },
    // 提交按钮
    submitBtn() {
      if (!this.curName || this.curDate.length == 0) {
        this.$message.error("价格策略名称和有效期不能为空");
        return;
      }

      if (!this.startTime) {
        this.startTime = this.curDate[0];
        this.endTime = this.curDate[1];
      }

      let data = {
        // ...this.datapop,
        // organizationStructureIds: this.arr,
        organizationStructureId: this.organId,
        priceStrategyName: this.curName,
        remarks: this.remarks,
        startTime: this.startTime,
        endTime: this.endTime,
        type: this.type,
        priceStrategyId: this.datapop.priceStrategyId // edit
      };
      if (this.type == 1) {
        data.companyIds = this.companyIds;
      }
      // 调用接口
      if (this.title == "新增价格策略") {
        this.addStra(data);
      } else if (this.title == "修改价格策略") {
        this.editStra(data);
      }
    },

    // 新增价格策略接口
    addStra(data) {
      addPriceTactics(data)
        .then(res => {
          if (res.status == 200) {
            this.$message({
              message: "新增价格策略成功",
              type: "success"
            });

            this.$emit("list_data");
            this.$emit("submint-change");
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(error => {
          console.log("销售价格 销售价格维护 views/price/price", error);
        });
    },
    // 修改价格策略接口
    editStra(data) {
      editPriceStrategyById(data)
        .then(res => {
          if (res.status == 200) {
            this.$emit("list_data");
            this.$emit("submint-change");
            this.$message({
              message: "修改价格策略成功",
              type: "success"
            });

            // this.editPrices.priceStrategyName = "";
            // this.editDate = [];
            // (this.editPrices.remarks = ""),
            //   (this.editPrices.startTime = ""),
            //   (this.editPrices.endTime = "");
          }
        })
        .catch(error => {
          console.error(
            "销售价格 销售价格维护 修改价格策略 views/price/price",
            error
          );
        });
    }
  }
};
</script>
<style scoped lang="scss">
.input_width {
  width: 60%;
}
</style>