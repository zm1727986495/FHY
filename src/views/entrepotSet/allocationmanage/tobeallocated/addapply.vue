<template>
  <!-- 领用管理页面的index -->
  <div class="addapply">
    <div class="apper">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

      <!-- 按钮组 -->
      <el-card>
        <div class="iconBox">
          <i class="Icon"></i>
          <span>新增调拨申请</span>
        </div>

        <!-- <div class="warehouse">
          <div class="m-right10">
            <span>调出仓库：</span>
            <el-select size="small" clearable v-model="bringUpTheLibraryId" placeholder="请选择调出仓库">
              <el-option v-for="item in options" :key="item.storageId" :label="item.storageName" :value="item.storageId"></el-option>
            </el-select>
          </div>
          <div class="m-right10">
            <span>调入仓库：</span>
            <el-select size="small" clearable v-model="theWarehousingId" placeholder="请选择调入仓库">
              <el-option v-for="item in options" :key="item.storageId" :label="item.storageName" :value="item.storageId"></el-option>
            </el-select>
          </div>
          <div class="m-right10">
            <span>提货时间：</span>
            <el-date-picker size="small" v-model="pickUpTime" placeholder="提货时间" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
          </div>
        </div> -->

        <!-- <div class="typesel">
          <el-button size="small" class="button-96" @click="selectPro">选择商品</el-button>
          <el-button size="small" class="button-96" @click="selectType">选择订单</el-button>
        </div> -->

        <!-- 商品 -->
        <!-- <div v-if="show == 1">
          <prolist :theWarehousingId="theWarehousingId" :bringUpTheLibraryId="bringUpTheLibraryId"></prolist>
        </div> -->

        <!-- 订单 -->
        <div v-if="show == 2">
          <orderlist
            :theWarehousingId="theWarehousingId"
            :bringUpTheLibraryId="bringUpTheLibraryId"
            :pickUpTime="pickUpTime"
          ></orderlist>
        </div>
      </el-card>

      <!-- </el-card> -->
    </div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import orderlist from "./orderlist";
import prolist from "./prolist";
import {
  getStorageList //仓库列表
} from "api/entrepotSet/allocationmanage/tobeallocated/tobeallocated";
import spot from "@/assets/images/spot.png";
export default {
  components: {
    breadcrumb,
    pagination,
    orderlist,
    prolist
  },
  // name: 'brandmanagement',
  data() {
    return {
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 0, //总条数
      spot, //操作图片
      navList: [], //头部面包屑

      elsectVal: [], //选中框
      tabList: [], //table数据
      options: [],
      theWarehousingId: "",
      bringUpTheLibraryId: "",
      pickUpTime:null,//
      show: "2",
    };
  },

  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.getStorageListFun();
  },
  methods: {
    //获取仓库列表
    getStorageListFun() {
      getStorageList()
        .then(res => {
          this.options = res.data;
        })
        .catch(error => {
          console.log("获取仓库列表" + error);
        });
    },
    // 选择商品
    selectPro() {
      this.show = 1;
    },

    // 选择订单
    selectType() {
      this.show = 2;
    },
    
    

    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getListData();
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getListData();
    },

    //勾选函数回调
    handleSelectionChange(val) {
      this.elsectVal = val;
      console.log(this.elsectVal);
    },

    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      return "height: 80px";
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style scoped lang='scss'>
.addapply {
  .warehouse {
    width: 100%;
    margin: 5px 0;
    display: flex;
    flex-wrap: nowrap;
    padding-bottom: 10px;
    border-bottom:1px solid #ccc;
    // justify-content: space-between;
    span {
      min-width: 120px;
    }
    
  }
  .typesel {
    width: 40%;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    margin-bottom: 50px;
  }
}
</style>

