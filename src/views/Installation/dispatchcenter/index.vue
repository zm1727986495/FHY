<template>
  <div class="dispatchcenter">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <div>
      <el-card class="box-card">
        <distributequery :loading='loading' :activeName='activeName' :locationStr='locationStr' ref="distributequery" :orderStatus="orderStatus" @switchTab="switchTab"></distributequery>
      </el-card>
    </div>
    <div class="m-top10 dispathStyle">
      <el-button class="map_btn" type="success" size="mini" @click="mapClose">{{mapShow?"收起":"展开"}}</el-button>
      <el-tabs type="border-card" v-model="activeName" @tab-click="hankwitch">
        <el-tab-pane label="未接单" name="stepsOne">
          <stepsOne :tableData="dataList" :mapShow="mapShow" :maxHeight="maxHeight" :loading='loading'></stepsOne>
        </el-tab-pane>
        <el-tab-pane label="待处理" name="stepsTwo">
          <stepsTwo :tableData="dataList" :mapShow="mapShow" :maxHeight="maxHeight" :loading='loading'></stepsTwo>
        </el-tab-pane>
        <el-tab-pane label="进行中" name="stepsThree">
          <stepsThree :tableData="dataList" :mapShow="mapShow" :maxHeight="maxHeight" :loading='loading'></stepsThree>
        </el-tab-pane>
        <el-tab-pane label="已完成" name="stepsFour">
          <stepsFour :tableData="dataList" :mapShow="mapShow" :maxHeight="maxHeight" :loading='loading'></stepsFour>
        </el-tab-pane>
        <div class="pagination_wrap">
          <pagination
            :current-page="currentPage"
            :pageSize="pageSize"
            :total="total"
            @sizeChange="sizeChange"
            @currentChange="currentChange"
          ></pagination>
        </div>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import distributequery from "./components/distributequery";
import stepsOne from "./stepsOne/index"; //未接单
import stepsTwo from "./stepsTwo/index"; //待处理
import stepsThree from "./stepsThree/index"; //进行中
import stepsFour from "./stepsFour/index"; //已完成
import { listInstallationOrder } from "api/Installation/dispatchcenter/dispatchcenter";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    breadcrumb,
    pagination,
    distributequery,
    stepsOne,
    stepsTwo,
    stepsThree,
    stepsFour
  },
  data() {
    return {
      navList: [], //导航
      currentPage: 1, //当前页数
      pageSize: 10, //当前页最大条数
      total: 0, //总条数
      loading:true,
      activeName: "stepsOne",
      dataList: [], //列表数据
      orderStatus: [
        {
          name: "未接单",
          id: "0"
        },
        {
          name: "已转单",
          id: "1"
        },
        {
          name: "转单被拒",
          id: "2"
        }
      ], //查询条件订单状态
      isT: false,
      isT1: false,
      isT2: false,
      mapShow: false, //关闭地图
      locationStr:0
    };
  },
  // activated(){
  //   // 头部面包屑
  //   this.navList = this.$route.meta;
  //   let { pathtabs = "" } = this.$route.query;
  //   if (pathtabs) {
  //     this.activeName = pathtabs;
  //   }
  
  //   this.switchTab(this.$refs.distributequery.beforIn);
  // },
  // deactivated () {
  //   this.$destroy(true)
  // },
  // created() {},
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    let { pathtabs = "" } = this.$route.query;
    if (pathtabs) {
      this.activeName = pathtabs;
    }
    this.switchTab(this.$refs.distributequery.beforIn);
    // this.$refs.distributequery.queryFun()
  },
  computed: {
    ...mapGetters(["paymentcenter", "maxHeight"])
  },
  watch: {
    paymentcenter: function(a, b) {
      // this.switchTab();
      this.$refs.distributequery.queryFun()
    }
  },
  methods: {
    ...mapMutations(["SET_PAYMENT"]),
    //关闭地图
    mapClose() {
      this.mapShow = !this.mapShow;
      if (this.mapShow) {
        this.SET_PAYMENT(`地图${new Date().getTime()}`);
      }
    },
    hankwitch() {
      this.currentPage = 1;
      this.switchTab(this.$refs.distributequery.beforIn);
      this.mapShow = false;
    },
    //获取列表
    switchTab(obj = {}, page) {

      this.currentPage = page ? page : this.currentPage;
      let data = {
        page: this.currentPage, //当前页
        limit: this.pageSize, //分页数量
        installationType: "1",
        ...obj,
        orderStatus: obj.orderStatus && obj.orderStatus.join(",")
      };

      let url = "#/Installation/dispatchcenter?pathtabs=" + this.activeName;
      history.pushState({}, '', url);
      if (this.activeName == "stepsOne") {
        //未接单
        //  this.isT = false;
        //查询条件订单状态
        this.orderStatus = [
          {
            name: "未接单",
            id: "0"
          },
          {
            name: "已转单",
            id: "1"
          },
          {
            name: "转单被拒",
            id: "2"
          }
        ];
        data.location = 0;
        this.locationStr = 0;
      } else if (this.activeName == "stepsTwo") {
        //待处理
        this.isT = true;
        //查询条件订单状态
        this.orderStatus = [
          {
            name: "已接单未通知",
            id: "3"
          },
          {
            name: "已通知未预约",
            id: "4"
          },
          {
            name: "派单已撤销",
            id: "5"
          },
          {
            name: "已预约待指派",
            id: "6"
          },
          {
            name: "已预约未确定",
            id: "13"
          },
          {
            name: "已指派待派单",
            id: "14"
          },
          {
            name: "待安装",
            id: "15"
          }
        ];
        data.location = 1;
        this.locationStr = 1;
      } else if (this.activeName == "stepsThree") {
        //进行中
        this.isT1 = true;
        //查询条件订单状态
        this.orderStatus = [
          {
            name: "安装中",
            id: "7"
          },
          {
            name: "汇报未完成",
            id: "8"
          },
          {
            name: "汇报已完成",
            id: "9"
          },
          {
            name: "回访中",
            id: "10"
          },
          {
            name: "回访驳回",
            id: "11"
          }
        ];

        data.location = 2;
        this.locationStr = 2;
      } else if (this.activeName == "stepsFour") {
        //已完成
        this.isT2 = true;
        this.orderStatus = [
          {
            name: "已完成",
            id: "12"
          }
        ];
        data.location = 3;
        this.locationStr = 3;
      }
      if(this.activeName != "stepsFour"){
        data.installCompleteStartTime = '';
        data.installCompleteEndTime = '';
      }

      // }
      this.loading = true;
      listInstallationOrder(data).then(res => {
        if (res.status == 200) {
          this.dataList = res.data.rows;
          this.total = res.data.total;
          this.dataList.forEach(item => {
            //判断有没有1+的问题图标
            if (item.secondQuestion > 1) {
              item.secondQuesIcon = true;
            } else {
              item.secondQuesIcon = false;
            }

            if (!item.firstInstallationTime) {
              item.timeCycle = "无";
            }

            if (item.firstInstallationTime && item.installCompleteTime) {
              item.timeCycle = Math.ceil((new Date(item.installCompleteTime).getTime() -new Date(item.firstInstallationTime).getTime()) /86400000 /7);

            } else if (item.firstInstallationTime &&!item.installCompleteTime) {

              item.timeCycle = Math.ceil((new Date().getTime() -new Date(item.firstInstallationTime).getTime()) /86400000 /7);
            }
          });
          this.loading = false;
        }else{
          this.loading = false;
        }
      }).catch(error => {
        this.loading = false;
        console.error("获取列表", error);
      });
    },
    //获取当前日期
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.switchTab(this.$refs.distributequery.beforIn);
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.switchTab(this.$refs.distributequery.beforIn);
    }
  }
};
</script>
<style lang="scss" scoped>
.dispathStyle {
  position: relative;
  .map_btn {
    position: absolute;
    z-index: 2;
    right: 105px;
    top: 7px;
  }
}
</style>
