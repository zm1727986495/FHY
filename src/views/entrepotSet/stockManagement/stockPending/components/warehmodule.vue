<template>
  <div>
    <div class="iconBox">
      <i class="Icon"></i>
      <span>入库</span>
    </div>
    <div class="collapse_cell_div">
      <div class="collapse_input_cell_box">
        <span class="input_befor_text">所属仓库：</span>
        <div class="input_after_div">
          <!-- <span>{{storageName}}</span> -->
          <el-select
            clearable filterable
            style="width:100%"
            :disabled="isFlag"
            v-model="bindInfo.storageId"
            placeholder="请选择"
            @change="warehouseChange"
          >
            <el-option
              v-for="item in options"
              :key="item.storageId"
              :label="item.storageName"
              :value="item.storageId"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="collapse_input_cell_box">
        <span class="input_befor_text">记账日期：</span>
        <div class="input_after_div">
          <!-- <span>{{datePicker}}</span> -->
          <el-date-picker
            v-model="bindInfo.expectedArrivalDate"
            style="width:100%"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-M-dd"
            format="yyyy-M-dd"
            :default-value="bindInfo.expectedArrivalDate"
          ></el-date-picker>
        </div>
      </div>
      <div class="collapse_input_cell_box">
        <span class="input_befor_text">入库人：</span>
        <div class="input_after_div">
          <span>{{name}}</span>
        </div>
      </div>
      <div class="collapse_input_cell_box">
        <span class="input_befor_text">到货单号：</span>
        <div class="input_after_div">
          <span>{{arrivalNoticeCode}}</span>
        </div>
      </div>

      <div class="collapse_input_cell_box_area">
        <span class="input_befor_text">入库备注：</span>
        <div class="input_after_div">
          <!-- <el-input
            placeholder
            type="textarea"
            resize="none"
            v-model="bindInfo.processRemarks"
            maxlength="200"
          ></el-input> -->
          <el-input placeholder v-model="bindInfo.processRemarks" size="small"></el-input>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getStorageList } from "api/entrepotSet/stockManagement/stockPending/stockPending.js";
export default {
  data() {
    return {
      bindInfo: {}, //信息
      options: [], //仓库
      isFlag: false,
      value: "",
      datePicker: "",
      storageName: "",
      arrivalNoticeCode:this.$route.query.arrivalNoticeCode
    };
  },
  computed: {
    ...mapGetters(["name", "id"])
  },
  created() {
    // this.storageName = this.$route.query.storageName;
  },
  mounted() {
    this.getList();
    this.getNowFormatDate();
  },
  methods: {
    //补0
    repair(str) {
      return str < 10 ? "0" + str : str;
    },
    //时间
    getNowFormatDate() {
      let dateTime = new Date();
      let hour = dateTime.getHours();
      let min = dateTime.getMinutes();
      let sec = dateTime.getSeconds();
      let yy = dateTime.getFullYear();
      let dd = dateTime.getDate();
      let mm = dateTime.getMonth() + 1;

      let time =
        yy +
        "-" +
        this.repair(mm) +
        "-" +
        this.repair(dd) +
        " " +
        this.repair(hour) +
        ":" +
        this.repair(min) +
        ":" +
        this.repair(sec);
      this.$set(this.bindInfo, "expectedArrivalDate", time);
    },
    //获取仓库
    getList() {
      getStorageList().then(res => {
          if(res.status == 200){
            this.options = res.data;
            // 判断当前是否仓库id
            if (this.$route.query.storageId) {
              this.isFlag = true;
              this.$set(this.bindInfo,"storageId",parseFloat(this.$route.query.storageId));
              this.$emit("getStorageId", this.$route.query.storageId);
            } else {
              this.$set(this.bindInfo, "storageId", this.options[0].storageId);
              this.$emit("getStorageId", this.bindInfo.storageId);
              this.isFlag = false;
            }
          }
        })
        .catch(error => {
          console.error("获取所属仓库", error);
        });
    },
    //仓库change
    warehouseChange() {
      this.$emit("getStorageId", this.bindInfo.storageId);
    }
  }
};
</script>
<style lang="scss" scoped>
.page_head_div {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  height: 50px;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
}
.collapse_cell_div {
  display: flex;
  overflow: hidden;
  flex-wrap: wrap;
  padding: 10px 0;
}
.collapse_input_cell_box {
  width: 270px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  padding:0 10px;
}
.collapse_input_cell_box .input_befor_text {
  min-width: 80px;
  text-align: right;
}
.input_befor_text {
  width: 84px;
  text-align: right;
}
.collapse_input_cell_box_area {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  padding: 0 10px;
  margin-top: 10px;
}
.input_after_div {
  width: 100%;
}
.collapse_input_cell_box_area .input_after_div {
  width: 100%;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
