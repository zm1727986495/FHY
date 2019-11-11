<template>
  <!-- 领用管理页面的搜索条件 -->
  <div class="gift_apply_se">
    <div class="search_box">
      <!-- 第一行 -->
      <div class="search_item">
        <el-input class="width-100" @keyup.enter.native="searchFun" v-model="searchForm.names" placeholder="申请单号/申请人/审核人"></el-input>
      </div>

      <div class="search_item">
        <el-date-picker v-model="time1" class="width-100" style="width:100%" type="daterange" range-separator="至"
          start-placeholder="申请开始时间" end-placeholder="申请结束时间" @change="time1Change" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
        ></el-date-picker>
      </div>

      <div class="search_item">
        <el-date-picker v-model="time2" class="width-100" style="width:100%" type="daterange" range-separator="至"
          start-placeholder="审核开始时间" end-placeholder="审核结束时间" @change="time2Change" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
        ></el-date-picker>
      </div>

      <div class="search_item">
        <el-select class="width-100" clearable filterable v-model="searchForm.giftCollarStatus" placeholder="请选择审核状态">
          <el-option v-for="item in giftCollarStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>

      <div class="search_item">
        <el-select class="width-100" v-model="searchForm.storeId" filterable  clearable placeholder="请选择所属门店">
          <el-option v-for="item in storeOptions" :key="item.storeId" :label="item.storeName" :value="item.storeId"></el-option>
        </el-select>
      </div>

      <div class="search_item">
        <el-button class="button-fc" type="warning" size="medium" @click="searchFun">查询</el-button>
        <el-button class="el-button--medium" type="primary" size="medium" @click="resetFun">重置</el-button>
      </div>

      <div class="search_item"></div>
      <div class="search_item"></div>
    </div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import { listStore } from "@/api/pulicJava";
export default {
  data() {
    return {
      searchForm: {},
      giftCollarStatusOptions: [
        {
          value: "0",
          label: "待审核"
        },
        {
          value: "1",
          label: "审核通过"
        },
        {
          value: "2",
          label: "驳回"
        }
      ],
      storeOptions: [],
      time1: [], //时间选择器
      time2: [] //时间选择器
    };
  },
  methods: {
    // 查询按钮
    searchFun() {
      this.$emit("get_List", this.searchForm);
    },

    // 重置按钮
    resetFun() {
      this.searchForm = {};
      this.searchFun();
    },

    //申请时间
    time1Change() {
      this.searchForm.applyStartTime = this.time1 ? this.time1[0] : "";
      this.searchForm.applyEndTime = this.time1 ? this.time1[1] : "";
    },

    //审核时间
    time2Change() {
      this.searchForm.auditStartTime = this.time1 ? this.time1[0] : "";
      this.searchForm.auditEndTime = this.time1 ? this.time1[1] : "";
    },

    //获取门店
    getStoreFun() {
      listStore().then(res => {
        this.storeOptions = res.data;
      });
    }
  },
  mounted() {
    this.getStoreFun();
  },

  components: {
    breadcrumb,
    pagination
  }
};
</script>

<style scope lang="scss">
.gift_apply_se {
  .search_box {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }
  .search_item {
    width: calc(((94vw - 250px)) / 4);
    margin-bottom: 20px;
    cursor: pointer;
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    span {
      min-width: 80px;
      text-align: right;
    }
    .fontMore {
      color: #d0cfcf;
    }
  }
}
</style>
