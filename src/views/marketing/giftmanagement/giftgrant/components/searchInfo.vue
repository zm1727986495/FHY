<template>
  <!-- 礼品发放管理 -->
  <div class="gift_search">
    <div class="list_top">
      <div class="head_nav_search">
        <el-input placeholder="礼品名称/订单号/赠送人/客户姓名/电话/地址" @keyup.enter.native="searchFun" v-model="queryForm.names" size="medium" maxlength="50"></el-input>
      </div>
      <div class="head_nav_datapick">
        <el-date-picker v-model="searchData" class="width-100" style="width:100%" type="daterange" range-separator="至"
          start-placeholder="赠送开始时间" end-placeholder="赠送结束时间" @change="timeChange" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
      </div>
      <div class="head_nav_select">
        <el-select v-model="queryForm.sendWay" placeholder="选择赠送方式" clearable filterable size="medium">
          <el-option v-for="item in sendWayOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="head_nav_select">
        <el-select v-model="queryForm.giftStatus" placeholder="选择礼品状态" clearable filterable size="medium">
          <el-option v-for="item in giftStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="head_nav_select">
        <el-select v-model="queryForm.storeId" clearable filterable  placeholder="选择门店" size="medium">
          <el-option v-for="item in storeOptions" :key="item.storeId" :label="item.storeName" :value="item.storeId"></el-option>
        </el-select>
      </div>

      <div class="head_nav_select">
        <el-button class="button-fc" type="warning" size="medium" @click="searchFun">查询</el-button>
        <el-button class="el-button--medium" type="primary" size="medium" @click="resetFun">重置</el-button>
      </div>
      <div class="head_nav_select"></div>
      <div class="head_nav_select"></div>
    </div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import { listStore } from "@/api/pulicJava";
import { getNames } from "src/utils/pubilcFn.js";
export default {
  components: {
    breadcrumb,
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {
      navList: [], //面包屑
      searchData: [],
      queryForm: {}, //查询条件
      storeOptions: [], //门店下拉
      sendWayOptions: [
        {
          label: "随车",
          value: "1"
        },
        {
          label: "自提",
          value: "2"
        }
      ],
      giftStatusOptions: [
        {
          label: "已赠送",
          value: "0"
        },
        {
          label: "已退回",
          value: "1"
        },
        {
          label: "已退款",
          value: "2"
        }
      ]
    };
  },

  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.getStoreFun();
  },
  methods: {
    searchFun() {
      this.$emit("search_fun", this.queryForm);
    },

    //重置方法
    resetFun() {
      this.queryForm = {};
      this.searchData = [];
      this.searchFun();
    },
    // 显示隐藏搜索
    hideSearch() {
      this.isShow = !this.isShow;
    },
    //时间改变
    timeChange() {
      this.queryForm.createTimeStart = this.searchData
        ? this.searchData[0]
        : "";
      this.queryForm.createTimeEnd = this.searchData ? this.searchData[1] : "";
    },
    //获取门店
    getStoreFun() {
      listStore().then(res => {
        this.storeOptions = res.data;
      });
    }
  }
};
</script>
<style scoped lang='scss'>
.gift_search {
  .list_top {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    > div {
      margin: 10px 0px;
      // width: calc(((92.5vw - 250px))/4);
      width: 23%;
      > div {
        width: 100%;
      }
    }
    .head_nav_btn {
      width: 100%;
      text-align: center;
      .fontMore {
        color: #d0cfcf;
      }
      .btnone {
        margin-left: 10px;
      }
    }
  }
}
</style>

