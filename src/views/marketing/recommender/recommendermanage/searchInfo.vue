<template>
  <!-- 搜索条件 -->
  <div class="searchInfo_recommend">
    <div class="search_box">
      <div class="search_item">
        <el-input class="width-100" @keyup.enter.native="searchFun" placeholder="申请单号/姓名/身份证号/开户行/银行卡号/电话" v-model="searchForm.searchText"></el-input>
      </div>
      <div class="search_item">
        <el-select class="width-100" v-model="searchForm.referrerStatus" placeholder="请选择状态" clearable>
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="search_item">
        <el-date-picker style="width:100%" v-model="timeArr" @change="dataChange" type="daterange" range-separator="至"
          value-format="yyyy-MM-dd" format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </div>
      <div class="search_item">
        <el-select class="width-100" v-model="searchForm.outsidetReferrerType" placeholder="请选择外部推荐人类型" clearable>
          <el-option v-for="item in orOptions" :key="item.id" :label="item.dictName" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="search_item">
        <el-select class="width-100" v-model="searchForm.referrerLevel" placeholder="级别" clearable>
          <el-option v-for="item in levelList" :key="item.id" :label="item.dictName" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="search_item">
        <div class="search_box_btn">
          <el-button class="button-fc" type="warning" size="medium" @click="searchFun">查询</el-button>
          <el-button class="el-button--medium" type="primary" size="medium" @click="resetFun">重置</el-button>
        </div>
      </div>
      <div class="search_item"></div>
      <div class="search_item"></div>
      
      <!-- <div class="search_box_line m-bottom20">
        
      </div> -->
    </div>
  </div>
</template>
<script>

import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import {
  listBaseDict //字典
} from "api/order/order/order";
export default {
  data() {
    return {
      timeArr: [],
      searchForm: {}, //查询条件
      options: [
        {
          value: "0",
          label: "待提交"
        },
        {
          value: "1",
          label: "待审核"
        },
        {
          value: "2",
          label: "审核通过"
        },
        {
          value: "3",
          label: "驳回"
        },
        {
          value: "4",
          label: "驳回待审核"
        },
      ],
      levelList:[],
      orOptions: []
    };
  },
  mounted() {
    this.getlistBaseDict();
    this.getlevel()
  },
  methods: {
    // 查询按钮
    searchFun() {
      this.$emit("get_List", this.searchForm);
    },
    getlevel(){
      listBaseDict({dataType:'return_Grade'}).then(res=>{
        if(res.status == 200){
          this.levelList = res.data
        }
      })
    },
    getlistBaseDict() {
      let data = {
        dataType: "OUTSIDET_REFERRER_TYPE"
      };
      listBaseDict(data).then(res => {
        if (res.status == "200") {
          this.orOptions = res.data;
        } else {
          this.$message.error("获取推荐人类型失败");
        }
      });
    },

    // 重置按钮
    resetFun() {
      this.searchForm = {};
      this.timeArr = [];
      this.searchFun();
    },

    // 时间的数据处理
    dataChange() {
      console.log(this.timeArr,"this.timeArr");
      
      this.searchForm.startTime = this.timeArr ? this.timeArr[0] : "";
      this.searchForm.endTime = this.timeArr ? this.timeArr[1] : "";
    }
  },

  components: {
    breadcrumb,
    pagination
  }
};
</script>

<style scope lang="scss">
.searchInfo_recommend {
  .search_box {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }
  .search_box_line{
    width: 100%;
  }
  .search_box_btn {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
  }
  .search_item {
    width: calc(((94vw - 250px)) / 4);
    margin-bottom: 10px;
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
