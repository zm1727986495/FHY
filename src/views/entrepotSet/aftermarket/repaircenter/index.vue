<template>
  <div class="repaircenter">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <searchinfo ref="searchinfo" :orderStatusArr="orderStatusArr" @get_List="getListfun"></searchinfo>
    </el-card>
    <div class="m-top20">
      <el-button
        class="map_btn"
        type="success"
        size="mini"
        @click="mapClose"
      >{{mapShow?"收起":"展开地图"}}</el-button>
      <el-tabs type="border-card" v-model="tabNum" @tab-click="tabClick">
        <el-tab-pane label="待处理" name="0">
          <stepsOne :tabList="tabList" :mapShow="mapShow" :maxHeight="maxHeight" :loading='loading'></stepsOne>
        </el-tab-pane>
        <el-tab-pane label="进行中" name="1">
          <stepsTwo :tabList="tabList" :mapShow="mapShow" :maxHeight="maxHeight" :loading='loading'></stepsTwo>
        </el-tab-pane>
        <el-tab-pane label="已完成" name="2">
          <stepsThree :tabList="tabList" :mapShow="mapShow" :maxHeight="maxHeight" :loading='loading'></stepsThree>
        </el-tab-pane>

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
      </el-tabs>
    </div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import spot from "@/assets/images/spot.png";
import searchinfo from "./components/searchInfo"; //查询条件
import stepsOne from "./stepsOne/index";
import stepsTwo from "./stepsTwo/index";
import stepsThree from "./stepsThree/index"; //D:\agweb\src\api\entrepotSet\aftermarket\repaircenter\repaircenter.js

import {
  listInstallationOrder //获取列表
} from "@/api/entrepotSet/aftermarket/repaircenter/repaircenter";
import { mapGetters, mapMutations } from "vuex";
export default {
  components: {
    breadcrumb,
    pagination,
    searchinfo,
    stepsOne,
    stepsTwo,
    stepsThree
  },
  // name: 'brandmanagement',
  data() {
    return {
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 100, //总条数
      spot, //操作图片
      navList: [], //头部面包屑
      elsectVal: [], //选中框
      tabList: [], //table数据
      tabNum: 0, //table数据
      orderStatus: "",
      orderStatusArr: [],
      location: "", //  1待处理 2进行中 3已完成
      form: {}, //查询条件
      mapShow: false, //地图是否显示
      loading:false,
    };
  },
  activated(){
    // 头部面包屑
    this.navList = this.$route.meta;
    let { names = "" } = this.$route.query;
    if (names) {
      this.tabNum = names;
      console.log(this.tabNum,'=========')
    }
    this.$refs["searchinfo"].searchFun();
  },
  // deactivated () {
  //     this.$destroy(true)
  // },
  // mounted() {
  //   // 头部面包屑
  //   this.navList = this.$route.meta;
  //   let { names = "" } = this.$route.query;
  //   if (names) {
  //     this.tabNum = names;
  //     console.log(this.tabNum,'=========')
  //   }
  //   this.$refs["searchinfo"].searchFun();
  // },
  computed: {
    ...mapGetters(["repaircenter", "maxHeight"])
  },
  watch: {
    repaircenter: function(a, b) {
      this.$refs["searchinfo"].searchFun();
    }
  },
  methods: {
    ...mapMutations(["SET_REPAIRCENTER"]),
    //关闭地图
    mapClose() {
      this.mapShow = !this.mapShow;
      if (this.mapShow) {
        this.SET_REPAIRCENTER(`刷新列表${new Date().getTime()}`);
      }
    },

    //查询按钮
    searchFun() {
      this.currentPage = 1;
      this.$refs["searchinfo"].searchFun();
    },

    getListfun(form) {
      this.form = form;
      this.currentPage = 1;
      this.pagetagFun();
    },
    tabClick(e) {
      this.mapShow = false;
      this.pagetagFun();
    },
    // tag状态切换
    pagetagFun() {
      let data = {
        ...this.form,
        location: this.location,
        orderStatus: this.form.orderStatus && this.form.orderStatus.join(","),
        installationType: 2,
        // orderStatus: this.orderStatus,
        page: this.currentPage,
        limit: this.pageSize
      };
      let url = "#/aftermarket/repaircenter?names=" + this.tabNum;

      history.pushState({}, '', url);
      if (this.tabNum == 0) {
        data.location = 1; //待处理 2进行中 3已完成
        // this.orderStatus = "0,1,2,4,5,6";
        this.orderStatusArr = [
          {
            name: "待指派",
            id: "0"
          },
          {
            name: "转单",
            id: "1"
          },
          {
            name: "转单被拒",
            id: "2"
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
          }
        ];
      } else if (this.tabNum == 1) {
        data.location = 2; //待处理 2进行中 3已完成
        // this.orderStatus = "3,5,6,7,8,9,10,11,13,14,15";
        this.orderStatusArr = [
          {
            name: "未通知",
            id: "3"
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
            name: "维修中",
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
          },
          {
            name: "已预约未确定",
            id: "13"
          },
          {
            name: "已预约待派单",
            id: "14"
          },
          {
            name: "待安装",
            id: "15"
          }
        ];
      } else {
        // this.orderStatus = "12";
        data.location = 3; //待处理 2进行中 3已完成
        this.orderStatusArr = [
          {
            name: "已完成",
            id: "12"
          }
        ];
        // let date = new Date();
        // date.setDate(1);
        // let dateStart =
        //   date.getFullYear() +
        //   "-" +
        //   (date.getMonth() + 1) +
        //   "-" +
        //   date.getDate();
        // data.installCompleteStartTime = dateStart;
        // data.installCompleteEndTime = this.getNowFormatDate();
      }
      if(this.tabNum != 2){
        data.installCompleteStartTime = '';
        data.installCompleteEndTime = '';
      }
      this.loading = true;
      listInstallationOrder(data).then(res => {
        if (res.status == "200") {
          this.tabList = res.data.rows;
          this.tabList.forEach(item=>{
            //判断有没有1+的问题图标
            if(item.secondQuestion>1){
              item.secondQuesIcon = true;
            }else{
              item.secondQuesIcon = false;
            }

            if(!item.firstInstallationTime){
              item.timeCycle = "无";
            }

            if (item.firstInstallationTime && item.installCompleteTime) {
                item.timeCycle = Math.ceil(
                  (new Date(item.installCompleteTime).getTime() -
                    new Date(item.firstInstallationTime).getTime()) /
                    86400000 /
                    7
                );
              } else if (
                item.firstInstallationTime &&
                !item.installCompleteTime
              ) {
                item.timeCycle = Math.ceil(
                  (new Date().getTime() -
                    new Date(item.firstInstallationTime).getTime()) /
                    86400000 /
                    7
                );
              }
          })
          this.total = res.data.total;
          this.loading = false;
        } else {
          this.loading = false;
          this.$message.error("查询失败");
        }
      }).catch(error=>{
        this.loading = false;
        console.error('获取售后派单',error);
      })
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
      this.pagetagFun();
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.pagetagFun();
    }
  }
};
</script>
<style scoped lang='scss'>
.repaircenter {
  .m-top20 {
    position: relative;
    .map_btn {
      position: absolute;
      z-index: 2;
      right: 105px;
      top: 6px;
    }
  }
}
</style>

