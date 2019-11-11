<template>
  <!-- 搜索条件 -->
  <div>
    <div class="search_box">
      <!-- 第一行 -->
      <div class="queryStyle">
        <div class="search_item">
          <el-input class="width-100" @keyup.enter.native="searchFun" placeholder="调拨申请单号/发起人/安装部" v-model.trim="searchForm.text" maxlength="50"></el-input>
        </div>

        <div class="search_item">
          <el-date-picker style="width:100%" v-model="time2" @change="dataChange2" type="daterange" range-separator="至" 
          start-placeholder="提货开始时间" end-placeholder="提货结束时间" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd"></el-date-picker>
        </div>

        <div class="search_item">
          <el-date-picker style="width:100%" v-model="time3" @change="dataChange3" type="daterange" range-separator="至" 
          start-placeholder="预计上门开始时间" end-placeholder="预计上门结束时间" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd"></el-date-picker>
        </div>

         <div class="search_item">
          <el-select class="width-100" clearable filterable v-model="searchForm.status" placeholder="状态">
            <el-option v-for="item in statusList" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </div>


         <!-- 第二行 -->
        <div class="search_item" v-if="showInput">
          <el-select class="width-100"  clearable v-model="searchForm.brandId" placeholder="品牌">
            <el-option
              v-for="item in brandList"
              :key="item.brandId"
              :label="item.brandName"
              :value="item.brandId"
            ></el-option>
          </el-select>
        </div>
        <div class="search_item" v-if="showInput">
          <el-select class="width-100" clearable v-model="searchForm.categoryId" placeholder="品类">
            <el-option
              v-for="item in categoryList"
              :key="item.commodityCategoryId"
              :label="item.categoryName"
              :value="item.commodityCategoryId"
            ></el-option>
          </el-select>
        </div>
        <div class="search_item" v-if="showInput">
          <el-select class="width-100" clearable filterable v-model="searchForm.theWarehousingId" placeholder="调入仓库">
            <el-option v-for="item in options" :key="item.storageId" :label="item.storageName" :value="item.storageId"></el-option>
          </el-select>
        </div>
        <div class="search_item" v-if="showInput">
          <el-select class="width-100" clearable filterable v-model="searchForm.bringUpTheLibraryId" placeholder="调出仓库">
            <el-option v-for="item in options" :key="item.storageId" :label="item.storageName" :value="item.storageId"></el-option>
          </el-select>
        </div>
      </div>

      <div class="btnSty">
        <span class="fontMore cursors" @click="fontClick()">{{showInput ? '收起' : '更多'}}</span>
        <el-button class="button-fc" type="warning" size="medium" @click="searchFun">查询</el-button>
        <el-button class="el-button--medium" type="primary" size="medium" @click="resetFun">重置</el-button>
      </div>

      
    </div>
  </div>
</template>
<script>
import pagination from "../../../components/pagination";
import breadcrumb from "../../../components/breadcrumb";
import {
  listBrand,
  listCategory
} from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";
import {
  getStorageList //仓库列表
} from "api/entrepotSet/allocationmanage/tobeallocated/tobeallocated";
export default {
  data() {
    return {
      showInput:false,//条件显示隐藏
      time2: [],//提货
      time3: [],//预计上门
      searchForm: {},//查询条件
      options: [],//仓库
      brandList:[],//品牌
      categoryList:[],//品类
      statusList:[
        {
          label:'未生成调拨单',
          id:0
        },
        {
          label:'已生成调拨单',
          id:2
        },
        {
          label:'已完成',
          id:3
        }
      ]
    };
  },

  mounted(){
    getStorageList()
      .then(res => {
        this.options = res.data;
      })
      .catch(error => {
        console.log("获取仓库列表" + error);
      });

    this.getBrand()
    this.getCategory()
  },
  methods: {
     //收起
    fontClick() {
      this.showInput = !this.showInput;
    },
    //获取品牌
    getBrand() {
      listBrand().then(res => {
        if(res.status == 200){
          this.brandList = res.data;
        }
      }).catch(error => {
        console.error("获取品牌", error);
      });
    },
    //获取品类
    getCategory() {
      listCategory().then(res => {
        if(res.status == 200){
          this.categoryList = res.data;
        }
      }).catch(error => {
        console.error("获取品类", error);
      });
    },

    // 时间的数据处理
    dataChange2() {
      this.searchForm.pickUpStartTime = this.time2 ? this.time2[0] : "";
      this.searchForm.pickUpSEndTime = this.time2 ? this.time2[1] : "";
    },

    // 时间的数据处理
    dataChange3() {
      this.searchForm.pappointmentStartTime = this.time3 ? this.time3[0] : "";
      this.searchForm.pappointmentEndTime = this.time3 ? this.time3[1] : "";
    },

    // 查询按钮
    searchFun() {
      this.$emit("get_List", this.searchForm);
    },

    // 重置按钮
    resetFun() {
      this.searchForm = {};
      this.time2 = [];
      this.time3 = [];
      this.searchFun();
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
  width: 100%;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
}
.queryStyle{
  flex: 1;
  display: flex;
  flex-flow: wrap;
}
.search_item {
  // width: calc(((94vw - 250px)) / 4);
  width: 25%;
  padding: 0 5px;
  margin-bottom:10px;
}
.btnSty{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 190px;
  height: 40px;
  .fontMore {
    color: #d0cfcf;
    min-width: 40px;
    text-align: right;
  }
}

</style>
