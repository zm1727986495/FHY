<template>
  <div class="orderlist">
    <div class="apper">
      <div class="search_box">
        <!-- 第一行 -->
        <div class="search_item">
          <el-input
            class="width-100"
            placeholder=" 订单号/采购合同号"
            v-model="searchForm.text"
            maxlength="50"
            size="small"
            @keyup.enter.native='searchFun()'
          ></el-input>
        </div>

        <div class="search_item">
          <el-date-picker size="small" style="width:100%" v-model="time3" @change="dataChange3" type="daterange" range-separator="至" 
          start-placeholder="预计上门开始时间" end-placeholder="预计上门结束时间" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
        </div>

        <div class="search_item">
          <el-select size="small" class="width-100" clearable v-model="searchForm.storeId" placeholder="所属门店">
            <el-option
              v-for="item in options"
              :key="item.storeId"
              :label="item.storeName"
              :value="item.storeId"
            ></el-option>
          </el-select>
        </div>

        <div class="search_item">
          <el-select size="small" class="width-100" clearable v-model="searchForm.brandId" placeholder="品牌">
            <el-option
              v-for="item in brandList"
              :key="item.brandId"
              :label="item.brandName"
              :value="item.brandId"
            ></el-option>
          </el-select>
        </div>

        <div class="search_item">
          <el-select size="small" class="width-100" clearable v-model="searchForm.categoryId" placeholder="品类">
            <el-option
              v-for="item in categoryList"
              :key="item.commodityCategoryId"
              :label="item.categoryName"
              :value="item.commodityCategoryId"
            ></el-option>
          </el-select>
        </div>
        <div class="search_item">
          <el-select size="small" class="width-100" clearable v-model="searchForm.serveGroupId" placeholder="安装部">
            <el-option
              v-for="item in optionsList"
              :key="item.serveGroupId"
              :label="item.serveGroupName"
              :value="item.serveGroupId"
            ></el-option>
          </el-select>
        </div>

        <div class="search_item">
          <el-button class="button-fc" type="warning" size="medium" @click="searchFun">查询</el-button>
          <el-button class="el-button--medium" type="primary" size="medium" @click="resetFun">重置</el-button>
        </div>
        <div class="search_item"></div>
        <div class="search_item"></div>
      </div>

      <div class="warehouse">
          <div class="m-right10">
            <!-- <span>调出仓库：</span> -->
            <el-select size="small" clearable v-model="bringUpTheLibraryId" placeholder="请选择调出仓库">
              <el-option v-for="item in warehouseList" :key="item.storageId" :label="item.storageName" :value="item.storageId"></el-option>
            </el-select>
          </div>
          <div class="m-right10">
            <!-- <span>调入仓库：</span> -->
            <el-select size="small" clearable v-model="theWarehousingId" placeholder="请选择调入仓库">
              <el-option v-for="item in warehouseList" :key="item.storageId" :label="item.storageName" :value="item.storageId"></el-option>
            </el-select>
          </div>
          <div class="m-right10">
            <!-- <span>提货时间：</span> -->
            <el-date-picker size="small" v-model="pickUpTime" placeholder="提货时间" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
          </div>
        </div>

      <!-- table表格 -->
      <div class="table_list lvs attribute" v-loading='loading'>
        <el-table border :row-class-name="tableRowClassName" :max-height="maxHeight" @selection-change="handleSelectionChange" :data="tabList" style="width: 100%;">
          <el-table-column type="selection" width="40"></el-table-column>

          <el-table-column prop="factoryContractNo" label="采购合同号" width="150" show-overflow-tooltip align="center"></el-table-column>

          <el-table-column prop="orderNumber" label="订单号" width="150" align="center" show-overflow-tooltip></el-table-column>

          <el-table-column prop="brandName" label="品牌" width="120" align="center" show-overflow-tooltip></el-table-column>

          <el-table-column prop="categoryName" label="品类" width="120" align="center" show-overflow-tooltip></el-table-column>

          <el-table-column prop="appointmentTime" label="预约上门时间" width="160" align="center"></el-table-column>

          <el-table-column prop="storeName" label="所属门店" width="150" show-overflow-tooltip align="center"></el-table-column>

          <el-table-column prop="createTime" label="订单创建时间" width="160" align="center"></el-table-column>
          <el-table-column prop="serveGroupName" label="安装部" width="120" align="center" show-overflow-tooltip></el-table-column>
          
          <!-- <el-table-column prop="status" label="状态" width="120" align="center">
            <template slot-scope="scope">
              <div>
               <span v-if="scope.row.status==0">部分到货</span>
               <span v-if="scope.row.status==1">全部到货</span>
              </div>
            </template>
          </el-table-column> -->

          <el-table-column prop="paidInCount" label="数量" width="120" align="center"></el-table-column>

          <el-table-column prop="storageName" label="所属仓库" width="120" show-overflow-tooltip align="center"></el-table-column>

          <el-table-column prop="orderRemark" label="备注" width="150" show-overflow-tooltip align="center"></el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination_wrap">
        <pagination
          :current-page="currentPage"
          :pageSize="pageSize"
          :total="total"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
        ></pagination>
      </div>

      <div class="subclick">
        <el-button class="el-button--medium" type="primary" size="medium" @click="subclick">确 认</el-button>
      </div>

      <!-- </el-card> -->
    </div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import {
  getStoragePurchaseOrderByStorage, //根据订单id获取订单采购单详情
  listStoragePurchaseOrderByPage, //订单库存查询列表
  listStore,
  listTransfersOrderByPage,
  getStorageList
} from "api/entrepotSet/allocationmanage/tobeallocated/tobeallocated";
import {
  listBrand,
  listCategory
} from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";
import {
  listLoginServeGroup //安装部
} from "@/api/Installation/dispatchcenter/dispatchcenter";
import spot from "@/assets/images/spot.png";
import {mapGetters} from 'vuex'
export default {
  // props: ["theWarehousingId", "bringUpTheLibraryId",'pickUpTime'],
  components: {
    breadcrumb,
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {
      theWarehousingId: "",
      bringUpTheLibraryId: "",
      pickUpTime:null,//

      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 0, //总条数
      spot, //操作图片
      navList: [], //头部面包屑

      elsectVal: [], //选中框
      tabList: [], //table数据
      options: [], //门店
      warehouseList:[],
      value: "",
      show: "",
      searchForm: {}, //查询条件
      loading:true,
      time3:[],
      brandList:[],//品牌
      categoryList:[],//品类
      optionsList: [],//安装部
    };
  },
  watch: {
    bringUpTheLibraryId: function() {
      this.currentPage = 1;
      this.searchFun();
    }
  },
  mounted() {
    this.searchFun();
    this.getlistStore();
    this.getBrand()
    this.getCategory()
    this.getStorageListFun()
    this.getlistServeGroup()
  },
  computed: {
    ...mapGetters(['maxHeight'])
  },
  methods: {
    //安装部
    getlistServeGroup() {
      let data = {
        dataCode: "INSTALL_DEPARTMENT"
      };
      listLoginServeGroup(data).then(res => {
        if (res.status == 200) {
          this.optionsList = res.data;
        }
      });
    },
     // 时间的数据处理
    dataChange3() {
      this.searchForm.pappointmentStartTime = this.time3 ? this.time3[0] : "";
      this.searchForm.pappointmentEndTime = this.time3 ? this.time3[1] : "";
    },
    //获取仓库列表
    getStorageListFun() {
      getStorageList()
        .then(res => {
          this.warehouseList = res.data;
        })
        .catch(error => {
          console.log("获取仓库列表" + error);
        });
    },
    //获取品牌
    getBrand() {
      listBrand()
        .then(res => {
          this.brandList = res.data;
        })
        .catch(error => {
          console.error("获取品牌", error);
        });
    },
    //获取品类
    getCategory() {
      listCategory()
        .then(res => {
          this.categoryList = res.data;
        })
        .catch(error => {
          console.error("获取品类", error);
        });
    },
    //获取门店
    getlistStore() {
      listStore()
        .then(res => {
          this.options = res.data;
        })
        .catch(error => {
          console.error("获取门店", error);
        });
    },
    // 查询按钮
    searchFun() {
      let data = {
        ...this.searchForm,
        storageId: this.bringUpTheLibraryId,
        page:this.currentPage,
        limit:this.pageSize
      };
      this.loading = true;
      listTransfersOrderByPage(data).then(res => {
        if(res.status == 200){
          this.tabList = res.data.rows;
          this.total = res.data.total;
          this.loading = false;
        }else{
          this.loading = false;
        }
      }).catch(error=>{
        this.loading = false;
        console.error('获取列表',error);
        
      })
    },

    // 重置按钮
    resetFun() {
      this.searchForm = {};
      this.searchFun()
    },

    //  提交按钮
    subclick() {
      if (this.elsectVal.length == 0) {
        this.$message.error("请先勾选订单");
      } else if (
        this.theWarehousingId == "" ||
        this.bringUpTheLibraryId == ""
      ) {
        this.$message.error("请检查填写信息");
      } else {
        if (this.theWarehousingId == this.bringUpTheLibraryId) {
          this.$message.warning("调入仓和调出仓不能相同");
          return;
        }
        let data = this.elsectVal.map(item => {
          return item.orderId;
        });
        let query = {
          orderList: data.join(","),
          storageId:this.bringUpTheLibraryId
        };
        getStoragePurchaseOrderByStorage(query).then(res => {
          this.dataList = res.data.map(item => {
            return { checked: false, ...item };
          });
          if (this.dataList.length == 0) {
            this.$message.error("此订单已经出库完!");
            return;
          } else {
            this.$router.push({
              path: "choseord",
              query: {
                orderId: data,
                isType: 2,
                theWarehousingId: this.theWarehousingId,
                bringUpTheLibraryId: this.bringUpTheLibraryId,
                pickUpTime:this.pickUpTime
              }
            });
          }
        });
      }
    },

    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.searchFun();
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.searchFun();
    },

    //勾选函数回调
    handleSelectionChange(val) {
      this.elsectVal = val;
      console.log(this.elsectVal);
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style scoped lang='scss'>
.orderlist {
  .warehouse {
    width: 100%;
    margin: 5px 0;
    display: flex;
    flex-wrap: nowrap;
    padding-bottom: 10px;
    // border-bottom:1px solid #ccc;
    // justify-content: space-between;
    span {
      min-width: 120px;
    }
    
  }
  margin-top:10px;
  .search_box {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }
  .search_item {
    width: calc(((94vw - 240px)) / 4);
    margin-bottom: 5px;
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
  .subclick {
    width: 10%;
    margin: 20px auto;
  }
  .labelicon {
    padding: 2px 0px;
    background: red;
    color: #ffffff;
    font-size: 12px;
    position: relative;
    width: 130px;
  }
  .labelI::after {
    display: block;
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-right: 15px solid transparent;
    border-left: 16px solid transparent;
    border-bottom: 10px solid #ff0000;
    bottom: 9px;
    right: -20px;
    transform: rotate(90deg);
  }
  .labelicon2 {
    padding: 2px 0px;
    background: #ffa847;
    color: #ffffff;
    font-size: 12px;
    position: relative;
    width: 130px;
  }
  .labelI2::after {
    display: block;
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-right: 15px solid transparent;
    border-left: 16px solid transparent;
    border-bottom: 10px solid #ffa847;
    bottom: 9px;
    right: -20px;
    transform: rotate(90deg);
  }
  .labelicon3 {
    padding: 2px 0px;
    background: #999999;
    color: #ffffff;
    font-size: 12px;
    position: relative;
    width: 130px;
  }
  .labelI3::after {
    display: block;
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-right: 15px solid transparent;
    border-left: 16px solid transparent;
    border-bottom: 10px solid #999999;
    bottom: 9px;
    right: -20px;
    transform: rotate(90deg);
  }
  .labelicon4 {
    padding: 2px 0px;
    background: #1abc9c;
    color: #ffffff;
    font-size: 12px;
    position: relative;
    width: 130px;
  }
  .labelI4::after {
    display: block;
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-right: 15px solid transparent;
    border-left: 16px solid transparent;
    border-bottom: 10px solid #1abc9c;
    bottom: 9px;
    right: -20px;
    transform: rotate(90deg);
  }
}
</style>

