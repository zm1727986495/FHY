<template>
  <div class="editInformation">
    <!-- <div class="iconBox">
      <i class="Icon"></i>
      <span>到货单信息</span>
    </div> -->
    <div class="titlecals">到货单信息</div>
    <div class="information">
      <div class="collapse_cell_div">
        <div class="collapse_input_cell_box">
          <span class="input_befor_text">到货单号：</span>
          <div class="input_after_div">
            <span>{{bindInfo.arrivalNoticeCode}}</span>
          </div>
        </div>

        <div class="collapse_input_cell_box">
          <span class="input_befor_text">入库仓库：</span>
          <div>
            <span>{{bindInfo.storageName}}</span>
          </div>
        </div>
        <div class="collapse_input_cell_box">
          <span class="input_befor_text">品牌：</span>
          <div class="input_after_div">
            <span>{{bindInfo.brandName}}</span>
          </div>
        </div>

        <div class="collapse_input_cell_box">
          <span class="input_befor_text">仓库地址：</span>
          <div class="input_after_div">
            <span>{{bindInfo.address}}</span>
          </div>
        </div>

        <div class="collapse_input_cell_box">
          <span class="input_befor_text">生成时间：</span>
          <span>{{bindInfo.createTime}}</span>
        </div>

        <div class="collapse_input_cell_box">
          <span class="input_befor_text">品类：</span>
          <div class="input_after_div">
            <span>{{bindInfo.categoryName}}</span>
          </div>
        </div>

        <div class="collapse_input_cell_box">
          <span class="input_befor_text">总包数：</span>
          <div class="input_after_div">
            <span>{{totalquantity}}</span>
          </div>
        </div>

        <div class="collapse_input_cell_box">
          <span class="input_befor_text">下单人：</span>
          <div class="input_after_div">
            <span>{{bindInfo.createName}}</span>
          </div>
        </div>

        <div class="collapse_input_cell_box">
          <span class="input_befor_text">发货日期：</span>
          <el-date-picker
            :disabled="isShow"
            v-model="bindInfo.deliveryDate"
            style="width:60%"
            size="small"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-M-dd"
            format="yyyy-M-dd"
          ></el-date-picker>
        </div>

        <div class="collapse_input_cell_box">
          <span class="input_befor_text">预计到货日期：</span>
          <el-date-picker
            :disabled="isShow"
            v-model="bindInfo.expectedArrivalDate"
            style="width:60%"
            size="small"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-M-dd"
            format="yyyy-M-dd"
          ></el-date-picker>
        </div>

        <div class="collapse_input_cell_box">
          <span class="input_befor_text">选择装卸工：</span>
          <el-input
            :disabled="isShow"
            v-model="bindInfo.stevedoreName"
            size="small"
            style="width:60%"
          ></el-input>
        </div>
        <div class="collapse_input_cell_box">
          <span class="input_befor_text">到货方式：</span>
          <el-radio :disabled="isShow" v-model="bindInfo.type" label="0">自提</el-radio>
          <el-radio :disabled="isShow" v-model="bindInfo.type" label="1">非自提</el-radio>
        </div>

        <div class="collapse_input_cell_box" v-if="bindInfo.type==1">
          <span class="input_befor_text">提货车辆：</span>
          <el-input :disabled="isShow" v-model="bindInfo.cardNum" size="small" style="width:60%"></el-input>
        </div>
        <div class="collapse_input_cell_box" v-if="bindInfo.type==1">
          <span class="input_befor_text">司机：</span>
          <el-input
            :disabled="isShow"
            v-model="bindInfo.deliveryMotorman"
            size="small"
            style="width:60%"
          ></el-input>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getById,
  getStorageList
} from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";
export default {
  components: {},
  props: ["arrivalId","totalquantity"],
  data() {
    return {
      input: "",
      searchData: "",
      stateList: [],
      switchState: "",
      arrival: "",
      isShow: false,
      bindInfo:{}
    };
  },
  created() {
    this.isShow = this.$route.query.isShow == 0;
  },
  mounted() {
    this.getQuery();
    this.getWarehouse();
  },
  methods: {
    getQuery() {
      //到货单信息
      let data = {
        arrivalNoticeId: this.arrivalId
      };
      getById(data).then(res => {
          if(res.status == 200){
            this.bindInfo = res.data;
            this.bindInfo.type = String(res.data.type);
          }
        }).catch(error => {
          console.error("到货单信息", error);
        });
    },
    getWarehouse() {
      //仓库
      getStorageList()
        .then(res => {
          this.stateList = res.data;
        })
        .catch(error => {
          console.error("获取仓库", error);
        });
    }
  }
};
</script>
<style lang='scss' scoped>
.editInformation{
  padding:0 10px; 
  .titlecals{
    top:0;
    padding-top: 2px;
  }
}
.information {
  .collapse_input_cell_box {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    padding: 5px;
    width: 25%;

    .input_befor_text {
      font-weight: bold;
      font-size: 14px;
      text-align: right;
      width: 6em;
      min-width: 100px;
    }
  }
}
.collapse_cell_div {
  display: flex;
  overflow: hidden;
  flex-wrap: wrap;

  padding: 10px 0;
}
</style>