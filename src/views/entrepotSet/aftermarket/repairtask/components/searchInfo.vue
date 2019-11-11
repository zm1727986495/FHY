<template>
  <div class="searchInfo_repairtask">
    <div class="isnatllStyle">
      <div class="search_box">
        <div class="search_item">
          <el-input size="small" @keyup.enter.native="searchFun" v-model="searchForm.orderGroup" class="width-100" placeholder="订单号/采购合同号/到货单号/采购合同号/货主姓名/电话号/客户地址"></el-input>
        </div>

        <div class="search_item">
          <el-date-picker size="small" v-model="time1" @change="timeChange" class="width-100" style="width:100%" type="daterange"
            range-separator="至" start-placeholder="接单开始日期" end-placeholder="接单结束日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
        </div>

        <div class="search_item">
          <el-select size="small" class="width-100" clearable filterable v-model="searchForm.isReport" placeholder="请选择状态">
            <el-option v-for="item in isReportList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>

        <div class="search_item">
          <el-select size="small" class="width-100" clearable filterable v-model="searchForm.brandId" placeholder="请选择品牌">
            <el-option v-for="item in brandList" :key="item.brandId" :label="item.brandName" :value="item.brandId"></el-option>
          </el-select>
        </div>

        <div class="search_item" v-if="showInput">
          <el-select size="small" class="width-100" clearable filterable v-model="searchForm.source" placeholder="请选择来源">
            <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>

        <div class="search_item" v-if="showInput">
          <el-select size="small" class="width-100" clearable filterable v-model="searchForm.isRetreat" placeholder="请选择是否允许退货">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option> 
          </el-select>
        </div>

        <div class="search_item" v-if="showInput">
          <el-select size="small" class="width-100" clearable filterable v-model="searchForm.isRemould" placeholder="请选择是否改制">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </div>

        <div class="search_item" v-if="showInput">
          <el-select size="small" class="width-100" clearable filterable v-model="searchForm.chargeType" placeholder="请选择是否收费">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </div>

        <!-- <div class="search_item" v-if="showInput"></div> -->
      </div>
      <div class="search_item_btn">
        <span class="fontMore cursors" @click="fontClick()">{{showInput ? '收起' : '更多'}}</span>
        <el-button class="button-fc" type="warning" size="medium" @click="searchFun">查询</el-button>
        <el-button class="el-button--medium" type="primary" size="medium" @click="resetFun">重置</el-button>
        <el-button class="el-button--medium" type="success" size="medium" @click="exportFun">导出</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb"; //D:\agweb\src\api\common\common
import {
  listBrand //品牌
} from "@/api/common/common";

export default {
  data() {
    return {
      isShow: false, //隐藏展示条件
      searchForm: {
        
      },
      brandList: [],
      // 0待安装 1待汇报 2汇报未完成 3  汇报已完成4已撤销
      isReportList:[
        {
          value: "0",
          label: "待安装"
        },
        {
          value: "1",
          label: "待汇报"
        },
        {
          value: "2",
          label: "汇报未完成"
        },
        {
          value: "3",
          label: "汇报已完成"
        },
        {
          value: "4",
          label: "已撤销"
        },
      ],
      time1: [],
      options2: [
        //1.销售,2.上样,3.,4.售后,5.400
        {
          value: "1",
          label: "销售"
        },
        {
          value: "2",
          label: "上样"
        },
        {
          value: "3",
          label: "安装单转移"
        },
        {
          value: "4",
          label: "售后客户回访"
        },
        {
          value: "5",
          label: "400客户回访"
        }
      ],
      showInput:false
    };
  },
  methods: {
    //收起
    fontClick() {
      this.showInput = !this.showInput;
    },
    getlistBrand() {
      listBrand().then(res => {
        this.brandList = res.data;
      });
    },

    //时间改变
    timeChange() {
      this.searchForm.takeOrderStartTime = this.time1 ? this.time1[0] : "";
      this.searchForm.takeOrderEndTime = this.time1 ? this.time1[1] : "";
    },
    // 查询按钮
    searchFun() {
      this.$emit("get_List", this.searchForm);
    },

    // 重置按钮
    resetFun() {
      this.searchForm = {};
      this.time1 = [];
      this.searchFun();
    },

    //导出
    exportFun(){
      this.$emit("export_List");
    },
  },

  mounted() {
    this.getlistBrand();
  },

  components: {
    breadcrumb,
    pagination
  }
};
</script>

<style scope lang="scss">
.isnatllStyle{
  display: flex;
}
.fontMore {
  color: #d0cfcf;
  min-width: 40px;
  text-align: right;
}
.searchInfo_repairtask {
  .search_box {
    width: 100%;
     flex: 1;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }
  .search_box_btn {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
  }
  .search_item {
    width: 25%;
    margin:0 0 10px 0;
    padding: 0px 5px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

  }
  .search_item_btn{
    min-width: 280px;
    width: 280px;
    text-align:right;
  }
}
</style>
