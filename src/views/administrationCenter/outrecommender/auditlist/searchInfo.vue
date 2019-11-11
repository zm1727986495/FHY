<template>
  <!-- 搜索条件 -->
  <div>
    <el-card class="m-bottom">
      <div class="search_box">
        <!-- 第一行 -->
        <div class="search_item">
          <el-select class="width-100" v-model="searchForm.value" placeholder="请选择审核状态">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>

        <div class="search_item">
          <el-select class="width-100" v-model="searchForm.value" placeholder="请选择所属机构">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>

        <div class="search_item">
          <el-input
            class="width-100"
            placeholder="申请单号"
            v-model="searchForm.name"
            maxlength="50"
            style="display:inline-block;flex:1"
          ></el-input>
        </div>

        <div class="search_item">
          <el-input
            class="width-100"
            placeholder="申请人"
            v-model="searchForm.name"
            maxlength="50"
            style="display:inline-block;flex:1"
          ></el-input>
        </div>

        <!-- 第二行 -->

        <div class="search_item">
          <el-input
            class="width-100"
            placeholder="审核人"
            v-model="searchForm.name"
            maxlength="50"
            style="display:inline-block;flex:1"
          ></el-input>
        </div>

        <div class="search_item">
          <el-button class="button-fc" type="warning" size="medium" @click="searchFun">查询</el-button>
          <el-button class="el-button--medium" type="primary" size="medium" @click="resetFun">重置</el-button>
        </div>

        <div class="search_item"></div>
        <div class="search_item"></div>
      </div>
    </el-card>
  </div>
</template>
<script>
import pagination from "../../../components/pagination";
import breadcrumb from "../../../components/breadcrumb";

export default {
  data() {
    return {
      isShow: false, //隐藏展示条件
      searchForm: {
        //查询条件
        name: "",
        value: ""
      },
      options: [
        {
          value: "1",
          label: "审核通过"
        },
        {
          value: "2",
          label: "待审核"
        },
        {
          value: "3",
          label: "驳回"
        }
      ]
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
    }
  },

  components: {
    breadcrumb,
    pagination
  }
};
</script>

<style scope lang="scss">
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
</style>
