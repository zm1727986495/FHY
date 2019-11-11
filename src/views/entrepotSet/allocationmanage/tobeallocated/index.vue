<template>
  <div class="wrapper">
    <div class="apper">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <el-card>
        <!-- 查询条件组 -->
        <searchinfo @get_List="getDataFun" ref="searchinfo"></searchinfo>
        <div class="h-width"></div>
        <!-- 按钮组 -->
        <div class="btn_list_1">
          <el-button size="small" v-if="btnJurisdiction['tobeallocated_make']" class="button-96" @click="addallocation">生成调拨单</el-button>
          <el-button size="small" v-if="btnJurisdiction['tobeallocated_add']" class="button-96" @click="addapply">新增调拨申请</el-button>
          <el-button size="small" v-if="btnJurisdiction['tobeallocated_import']" class="button-96" @click="releasedexport">导出</el-button>
        </div>
        <!-- table表格 -->
        <!-- :row-key="getRowKeys"   :reserve-selection="true"-->
        <div class="table_list lvs attribute">
          <el-table border :max-height="maxHeight" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" :data="tabList" style="width: 100%;">
            <el-table-column type="selection" width="40" fixed='left'></el-table-column>
            <el-table-column prop="transfersApplyNumber" label="单据编号" width="140" fixed='left' align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>
                  <p class="table_action_span" @click="billFn(scope.row)">{{scope.row.transfersApplyNumber}}</p>
                </div>
              </template>
            </el-table-column>
            <!-- 1 安装 2 备货 3 订单  4 门店 5 仓库 -->
            <el-table-column prop="transfersSource" label="来源" width="80" align="center">
              <template slot-scope="scope">
                <div>
                  <p v-if="scope.row.transfersSource==1">安装</p>
                  <p v-if="scope.row.transfersSource==2">成品</p>
                  <p v-if="scope.row.transfersSource==3">订单</p>
                  <p v-if="scope.row.transfersSource==4">门店</p>
                  <p v-if="scope.row.transfersSource==5">仓库</p>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="status" label="状态" width="160" align="center">
              <template slot-scope="scope">
                <div>
                  <p v-if="scope.row.status==0">未生成调拨单</p>
                  <p v-if="scope.row.status==2">已生成调拨单</p>
                  <p v-if="scope.row.status==3">已完成</p>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="pickUpTime" label="提货时间" width="160" align="center"></el-table-column>

            <el-table-column prop="putStorageTime" label="入库时间" width="160" align="center"></el-table-column>

            <el-table-column prop="appointmentTime" label="预计上门时间" width="160" align="center"></el-table-column>

            <el-table-column prop="brandName" label="品牌" width="100" align="center"></el-table-column>

            <el-table-column prop="categoryName" label="品类" width="100" align="center" show-overflow-tooltip></el-table-column>
            
            <el-table-column prop="purchaseContractCode" label="采购合同号" width="120" align="center" show-overflow-tooltip></el-table-column>

            <!-- <el-table-column prop="predictInstallTime" label="预计安装时间" width="160" align="center"></el-table-column> -->

            <el-table-column prop="installationName" label="安装部" width="120" align="center" show-overflow-tooltip></el-table-column>

            <el-table-column prop="theWarehousingName" label="调入仓库" width="120" align="center" show-overflow-tooltip></el-table-column>

            <el-table-column prop="bringUpTheLibraryName" label="调出仓库" width="120" align="center" show-overflow-tooltip></el-table-column>

            <el-table-column prop="transfersNumber" label="数量" width="100" align="center"></el-table-column>

            <el-table-column prop="userName" label="发起人" width="100" align="center"></el-table-column>

            <el-table-column prop="departmentName" label="发起部门" width="120" align="center" show-overflow-tooltip></el-table-column>

            <el-table-column prop="createTime" label="发起时间" width="160" align="center" ></el-table-column>
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
      </el-card>

      <!-- </el-card> -->
    </div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";

import {
  transfersApplyByPage //获取所有的待调拨列表
} from "api/entrepotSet/allocationmanage/tobeallocated/tobeallocated";
import { getToken } from '@/utils/auth';
import { mapGetters } from 'vuex';
import spot from "@/assets/images/spot.png";
import searchinfo from "./searchInfo";
import module from "../../../../../config/index"; //导出文件
export default {
  components: {
    breadcrumb,
    pagination,
    searchinfo //查询条件
  },
  // name: 'brandmanagement',
  data() {
    return {
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),//按钮权限
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 0, //总条数
      spot, //操作图片
      navList: [], //头部面包屑
      form:{},//查询条件
      elsectVal: [], //选中框
      tabList: [], //table数据
      isFlag: false //判断是否满足进入生成调拨单页面的条件   条件限制：一条没有限制，多条的时候。必须是相同调出仓，调入仓，和来源
    };
  },

  activated(){
    // 头部面包屑
    this.navList = this.$route.meta;
    this.$refs['searchinfo'].searchFun();
  },
  // deactivated () {
  //     this.$destroy(true)
  // },
  // mounted() {
  //   // 头部面包屑
  //   this.navList = this.$route.meta;
  //   this.$refs['searchinfo'].searchFun();
  // },
  computed: {
    ...mapGetters(['maxHeight'])
  },
  methods: {
    //导出
    releasedexport() {
      let {
        brandId,
        categoryId,
        text,
        pickUpStartTime,
        pickUpSEndTime,
        pappointmentStartTime,
        pappointmentEndTime,
        theWarehousingId,
        calloutLibrariesId
      } = this.$refs.searchinfo.searchForm;
      if(!(brandId&&categoryId)){
        this.$message.error('没有选择品牌品类!')
        return
      }
      let Interface = '';
      //  欧派 衣柜
      if(brandId == 1&&categoryId == 1000026){
        Interface = 'exportTransfersApplyYiGui';
      }

      //  欧派 橱柜
      if(brandId == 1&&categoryId == 1000033){
        Interface = 'exportTransfersApplyChuGui';
      }
      let text1 = text?`&text=${text}`:'';
      let pickUpStartTime1 = pickUpStartTime?`&pickUpStartTime=${pickUpStartTime}`:'';
      let pickUpSEndTime1 = pickUpSEndTime?`&pickUpSEndTime=${pickUpSEndTime}`:'';
      let pappointmentStartTime1 = pappointmentStartTime?`&pappointmentStartTime=${pappointmentStartTime}`:'';
      let pappointmentEndTime1 = pappointmentEndTime?`&pappointmentEndTime=${pappointmentEndTime}`:'';
      let theWarehousingId1 = theWarehousingId?`&theWarehousingId=${theWarehousingId}`:'';
      let calloutLibrariesId1 = calloutLibrariesId?`&calloutLibrariesId=${calloutLibrariesId}`:'';

      let str = module.dev.proxyTable["/api"].target +`/api/pc/transfers/${Interface}?token=${getToken()}&brandId=${brandId}&categoryId=${categoryId}${text1}${pickUpStartTime1}${pickUpSEndTime1}${pappointmentStartTime1}${pappointmentEndTime1}${theWarehousingId1}${calloutLibrariesId1}`;
      window.location.href = str;
    },
    billFn(row){
      this.$router.push({path:'allocationdetails',query:{transfersApplyId:row.transfersApplyId}})
    },
    getDataFun(form){
      this.currentPage = 1;
      this.form = form;
      this.getListFun();
    },
    //查询按钮获取
    getListFun() {
      let data = {
        ...this.form,
        page: this.currentPage,
        limit: this.pageSize
      };
      transfersApplyByPage(data).then(res => {
        if(res.status == 200){
          this.tabList = res.data.rows;
          this.total = res.data.total;
        }
      });
    },

    // 生成调拨单
    addallocation() {
      if (this.elsectVal.length < 1) {
        this.$message.error("你未勾选!");
      } else {
        if (this.isFlag) {
          let arr = [];
          let orderList=[]
          // let sum = 0
          console.log(this.elsectVal);
          let flag = this.elsectVal.every(item=>{
            return item.status == 0
          })
          if(!flag){
            this.$message.error('未生成调拨单，才能生成!')
            return
          }
          this.elsectVal.forEach(item => {
            arr.push(item.transfersApplyId);
            orderList.push(item.orderId)
            // if(item.transfersSource == 1){
            //   sum++
            // }
          });
          // if(sum>1){
          //   this.$message.error('安装只支持勾选一个!')
          //   return
          // }

          this.$router.push({
            path: "createallocated",
            query: {
              theWarehousingId: this.elsectVal[0].theWarehousingId, //调入仓
              bringUpTheLibraryId: this.elsectVal[0].bringUpTheLibraryId, //调出仓
              transfersApplyId: arr,
              nums: 1,
              orderId:orderList
            }
          });
        } else {
          // this.$message.warning("勾选多条时，必须为相同调入仓，调出仓和来源");
          this.$message.error("勾选多条时，必须为相同调入仓，调出仓");
        }
      }
    },
    // 新增调拨申请
    addapply() {
      this.$router.push({
        path: "addapply",
        query: {}
      });
    },

    //翻页记忆选中
    // getRowKeys(row) {
    //   return row.transfersApplyId;
    // },

    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getListFun();
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getListFun();
    },

    //勾选函数回调
    handleSelectionChange(val) {
      this.elsectVal = val;
      if (val.length == 1) {
        this.isFlag = true; //
      } else {
        // 调出仓bringUpTheLibraryId   来源transfersSource   调入仓 theWarehousingId
        let bringUpTheLibraryArr = val.map(item => {
          return item.bringUpTheLibraryId;
        });

        let transfersSourceArr = val.map(item => {
          return item.transfersSource;
        });

        let theWarehousingArr = val.map(item => {
          return item.theWarehousingId;
        });

        let a =
          Math.max.apply(null, bringUpTheLibraryArr) ==
          Math.min.apply(null, bringUpTheLibraryArr);

        // let b =
        //   Math.max.apply(null, transfersSourceArr) ==
        //   Math.min.apply(null, transfersSourceArr);

        let c =
          Math.max.apply(null, theWarehousingArr) ==
          Math.min.apply(null, theWarehousingArr);

        if (a&c) {
          this.isFlag = true;
        } else {
          this.isFlag = false;
        }
      }
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style scoped lang='scss'>
.btn_list_1 {
  // height: 55px;
  // float: left;
  display: flex;
  margin-bottom: 5px;
}

.pagination_wrap {
  text-align: center;
  height: 50px;
  /* line-height: 50px; */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

