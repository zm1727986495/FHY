<template>
  <div class="clientcollection unsortable">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card class="lvs">
      <div class="queryForm">
        <el-row :gutter="10">
          <el-col :span="4">
            <el-input size="medium" @keyup.enter.native="search" placeholder="订单号/姓名/电话/收款单号" v-model="formList.orderCustomer" clearable></el-input>
          </el-col>
          <el-col :span="4">
            <el-input size="medium" @keyup.enter.native="search" placeholder="收据号" v-model="formList.collectNumber" clearable></el-input>
          </el-col>
          <el-col :span="4">
            <el-input size="medium" @keyup.enter.native="search" placeholder="门店名称" v-model="formList.storeName" clearable></el-input>
          </el-col>
          <el-col :span="4">
            <el-date-picker
              v-model="date"
              @keyup.enter.native="search"
              type="daterange"
              range-separator="-"
              start-placeholder="收款开始日期"
              size="medium"
              value-format="yyyy-MM-dd"
              @change="resetDate1"
              end-placeholder="收款结束日期">
            </el-date-picker>
          </el-col>
          <el-col :span="4">
            <el-date-picker
              v-model="date2"
              @keyup.enter.native="search"
              type="daterange"
              range-separator="-"
              start-placeholder="审核开始日期"
              size="medium"
              value-format="yyyy-MM-dd"
              @change="resetDate2"
              end-placeholder="审核结束日期">
            </el-date-picker>
          </el-col>
          <el-col :span="4">
            <el-button class="button-fc" type="warning" size="medium" @click="search">查询</el-button>
            <el-button type="primary" size="medium" @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <div>
      <el-tabs type="border-card" @tab-click="tabclickH" v-model="tabIndexObj.tabsIndex">
        <el-tab-pane label="待提交" name="1">
          <div class="m-bottom15">
            <el-button size="small" class="button-96" v-if="btnJurisdiction.check" @click="insertReceivables">录入待收款</el-button>
            <el-button size="small" class="button-96" v-if="btnJurisdiction.cancel" :loading="cancelLoading" @click="stopReceivables">取消收款</el-button>
            <el-button size="small" class="button-96" v-if="btnJurisdiction.submit" :loading="submitLoading" @click="submitOrder">提交</el-button>
          </div>
          <comTable :tableLoading="tableLoading" :btnJurisdiction="btnJurisdiction" names="1" :tableData="tableData" @selection-change="onSelect" :tabstatus="tabstatus" @pages="pagess"></comTable>
        </el-tab-pane>
        <el-tab-pane label="已提交" name="2">
          <simTable :tableLoading="tableLoading" :btnJurisdiction="btnJurisdiction" :tableData="tableData" names="2"/>
        </el-tab-pane>
        <el-tab-pane label="未交票" name="3">
          <simTable :tableLoading="tableLoading" :btnJurisdiction="btnJurisdiction" :tableData="tableData" names="3"/>
        </el-tab-pane>
        <el-tab-pane label="已收款" name="4">
          <simTable :tableLoading="tableLoading" :btnJurisdiction="btnJurisdiction" :tableData="tableData" names="4"/>
        </el-tab-pane>
        <el-tab-pane label="已退回" name="5">
          <div class="m-bottom15">
            <el-button size="small" class="button-96" v-if="btnJurisdiction.cancel" :loading="cancelLoading" @click="stopReceivables">取消收款</el-button>
            <el-button size="small" class="button-96" v-if="btnJurisdiction.submit" :loading="submitLoading" @click="submitOrder">重新提交</el-button>
          </div>
          <comTable :tableLoading="tableLoading" :btnJurisdiction="btnJurisdiction" :tableData="tableData" names="5" @selection-change="onSelect" :tabstatus="tabstatus" @pages="pagess"></comTable>
        </el-tab-pane>
      </el-tabs>
      <div class="pagination_wrap">
        <pagination
          :current-page="currentPage"
          :pageSize="pageSize"
          :total="total"
          @sizeChange="sizeChange"
          @currentChange="currentChange">
        </pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import pagination from '@/views/components/pagination';
  import breadcrumb from "@/views/components/breadcrumb";
  import simTable from "./simTable";
  import comTable from "./comTable";
  import {
    pages,
    listOrder,
    listOrderCollectMoneyUnTicketByPage,
    cancelOrderCollectMoney,
    commitOrderCollectMoney,
    returnOrderCollectMoneySuatus,
    examineList
  } from '@/api/receivablesrun/clientcollection/index'
  import spot from '@/assets/images/spot.png';
  import {listBaseDict} from '@/api/pulicJava.js';
  import {mapGetters} from 'vuex'

  export default {
    props: {
      tabIndexObj: {
        type: Object,
        default() {
          return {tabsIndex: "1"}
        }
      }
    },
    components: {
      breadcrumb,
      pagination,
      simTable,
      comTable
    },
    data() {
      return {
        tableLoading:false,
        submitLoading:false,
        cancelLoading:false,
        // tabsIndex:'1',
        orderNum: '',
        customerName: '',
        customerTel: '',
        collectMoneyName: '',
        navList: [],
        searchtext: "",
        value: "",
        currentPage: 1,//当前页数
        pageSize: 10,//当前页最大条数
        total: 10,//总条数
        spot,
        tableData: [],
        tablists: ["待收款", "已提交", "未交票", "已收款", "已退回"],
        tabstatus: 0,
        multiSelection: [], //表格选中值数组
        dictArr: [],
        date: ['', ''],
        date2: ['', ''],
        show: false,
        text: '收起',
        formList: {
          orderCustomer: '',
          collectNumber: '',
          storeName: '',
          auditStartTime: '',
          auditStartEnd: '',
          gatheringEndTime: '',
          gatheringStartTime: '',
        },
        btnJurisdiction: {
          check: false,
          cancel: false,
          edit: false,
          submit: false
        }
        // receivablesrun_btn_check:false
      };
    },
    activated(){
      this.btnInit()
      if (this.$route.query.names) {
        this.tabIndexObj.tabsIndex = this.$route.query.names;
      }
      // this.receivablesrun_btn_check=this.elements["receivablesrun:btn_check"]
      var now = new Date(); //当前日期
      var nowMonth = now.getMonth(); //当前月
      var nowYear = now.getFullYear(); //当前年
      var monthStartDate = new Date(nowYear, nowMonth, 1);
      var monthEndDate = new Date(nowYear, nowMonth + 1, 0);
      this.date = [
        monthStartDate.getFullYear() + '-' + Number(monthStartDate.getMonth() + 1) + '-' + monthStartDate.getDate(),
        monthEndDate.getFullYear() + '-' + Number(monthEndDate.getMonth() + 1) + '-' + monthEndDate.getDate()
      ];
      // 头部面包屑
      this.navList = this.$route.meta;
      if (this.tabIndexObj.tabsIndex == 3) {
        this.tableLoading=true;
        listOrderCollectMoneyUnTicketByPage(
          {
            orderCustomer: this.formList.orderCustomer,
            collectNumber: this.formList.collectNumber,
            storeName: this.formList.storeName,
            collectMoneyName: this.formList.collectMoneyName,
            gatheringStartTime: this.date[0],
            gatheringEndTime: this.date[1],
            auditStartTime: this.date2[0],
            auditEndTime: this.date2[1],
            isReady: 0,
            limit: this.pageSize,
            page: this.currentPage
          }
        ).then(res => {
          this.tableData = res.data.rows;
          this.total = res.data.total;
          this.tableLoading=false;
        })
      } else {
        switch (this.tabIndexObj.tabsIndex) {
          case "1":
            this.tabstatus = 0;
            break;
          case "2":
            this.tabstatus = 1;
            break;
          case "4":
            this.tabstatus = 3;
            break;
          case "5":
            this.tabstatus = 2;
            break;
        }
        this.pagess()
      }
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    // created() {
    //   this.btnInit()
    //   if (this.$route.query.names) {
    //     this.tabIndexObj.tabsIndex = this.$route.query.names;
    //   }
    //   // this.receivablesrun_btn_check=this.elements["receivablesrun:btn_check"]
    // },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    // mounted() {
    //   var now = new Date(); //当前日期
    //   var nowMonth = now.getMonth(); //当前月
    //   var nowYear = now.getFullYear(); //当前年
    //   var monthStartDate = new Date(nowYear, nowMonth, 1);
    //   var monthEndDate = new Date(nowYear, nowMonth + 1, 0);
    //   this.date = [
    //     monthStartDate.getFullYear() + '-' + Number(monthStartDate.getMonth() + 1) + '-' + monthStartDate.getDate(),
    //     monthEndDate.getFullYear() + '-' + Number(monthEndDate.getMonth() + 1) + '-' + monthEndDate.getDate()
    //   ];
    //   // 头部面包屑
    //   this.navList = this.$route.meta;
    //   if (this.tabIndexObj.tabsIndex == 3) {
    //     this.tableLoading=true;
    //     listOrderCollectMoneyUnTicketByPage(
    //       {
    //         orderCustomer: this.formList.orderCustomer,
    //         collectNumber: this.formList.collectNumber,
    //         storeName: this.formList.storeName,
    //         collectMoneyName: this.formList.collectMoneyName,
    //         gatheringStartTime: this.date[0],
    //         gatheringEndTime: this.date[1],
    //         auditStartTime: this.date2[0],
    //         auditEndTime: this.date2[1],
    //         isReady: 0,
    //         limit: this.pageSize,
    //         page: this.currentPage
    //       }
    //     ).then(res => {
    //       this.tableData = res.data.rows;
    //       this.total = res.data.total;
    //       this.tableLoading=false;
    //     })
    //   } else {
    //     switch (this.tabIndexObj.tabsIndex) {
    //       case "1":
    //         this.tabstatus = 0;
    //         break;
    //       case "2":
    //         this.tabstatus = 1;
    //         break;
    //       case "4":
    //         this.tabstatus = 3;
    //         break;
    //       case "5":
    //         this.tabstatus = 2;
    //         break;
    //     }
    //     this.pagess()
    //   }
    // },
    methods: {
      resetDate2(val) {
        if(!val){
          this.date2 = ["", ""]
        }
      },
      resetDate1(val) {
        if(!val){
          this.date = ["", ""]
        }
      },
      btnInit() {
        this.btnJurisdiction.check = JSON.parse(this.$loca.getItem('element'))["receivablesrun:btn_check"];
        this.btnJurisdiction.cancel = JSON.parse(this.$loca.getItem('element'))["receivablesrun:btn_cancel"];
        this.btnJurisdiction.edit = JSON.parse(this.$loca.getItem('element'))["receivablesrun:btn_edit"];
        this.btnJurisdiction.submit = JSON.parse(this.$loca.getItem("element"))["receivablesrun:btn_submit"];
      },
      getStore() {
        console.log(this.elements, 111)
      },
      more() {
        this.show = !this.show;
        this.text = this.show ? "收起" : "更多"
      },
      reset() {
        this.currentPage = 1;
        this.orderCustomer = "";
        this.customerName = "";
        this.customerTel = "";
        this.collectMoneyName = "";
        var now = new Date(); //当前日期
        var nowMonth = now.getMonth(); //当前月
        var nowYear = now.getFullYear(); //当前年
        var monthStartDate = new Date(nowYear, nowMonth, 1);
        var monthEndDate = new Date(nowYear, nowMonth + 1, 0);
        this.date = [
          monthStartDate.getFullYear() + '-' + Number(monthStartDate.getMonth() + 1) + '-' + monthStartDate.getDate(),
          monthEndDate.getFullYear() + '-' + Number(monthEndDate.getMonth() + 1) + '-' + monthEndDate.getDate()
        ];
        if (this.tabstatus == 4) {
          this.tableLoading=true;
          listOrderCollectMoneyUnTicketByPage(
            {
              orderCustomer: this.formList.orderCustomer,
              collectNumber: this.formList.collectNumber,
              storeName: this.formList.storeName,
              collectMoneyName: this.formList.collectMoneyName,
              gatheringStartTime: this.date[0],
              gatheringEndTime: this.date[1],
              auditStartTime: this.date2[0],
              auditEndTime: this.date2[1],
              isReady: 0,
              limit: this.pageSize,
              page: this.currentPage
            }
          ).then(res => {
            this.tableData = res.data.rows;
            this.total = res.data.total;
            this.tableLoading=false;
          })
        }else if(this.tabstatus==3){
          this.tableLoading=true;
          examineList({
            orderCustomer:this.formList.orderCustomer,
            collectNumber:this.formList.collectNumber,
            storeName:this.formList.storeName,
            collectMoneyName:this.formList.collectMoneyName,
            gatheringStartTime:this.date[0],
            gatheringEndTime:this.date[1],
            auditStartTime:this.date2[0],
            auditEndTime:this.date2[1],
            page:this.currentPage,
            limit:this.pageSize,
            type:2,
          }).then(res=>{
            this.tableData = res.data.rows;
            this.total = res.data.total;
            this.tableLoading=false;
          })
        } else {
          this.pagess()
        }
      },
      pagess() {
        this.tableLoading=true;
        pages(
          {
            orderCustomer: this.formList.orderCustomer,
            collectNumber: this.formList.collectNumber,
            storeName: this.formList.storeName,
            collectMoneyName: this.formList.collectMoneyName,
            gatheringStartTime: this.date[0],
            gatheringEndTime: this.date[1],
            auditStartTime: this.date2[0],
            auditEndTime: this.date2[1],
            status: this.tabstatus,
            limit: this.pageSize,
            page: this.currentPage
          }
        ).then(res => {
          // res.data.rows.map((item,idx)=>{
          //   item.Types = this.dictArr.filter(item2 => {
          //       return item2.id == item.collectWay
          //   })[0].dictName;
          // })
          this.tableData = res.data.rows;
          this.total = res.data.total;
          this.tableLoading=false;
        })
      },
      search() {
        console.log(this.tabstatus)
        this.tableData = [];
        this.currentPage = 1;
        if (this.tabstatus == 4) {
          this.tableLoading=true;
          listOrderCollectMoneyUnTicketByPage(
            {
              orderCustomer: this.formList.orderCustomer,
              collectNumber: this.formList.collectNumber,
              storeName: this.formList.storeName,
              collectMoneyName: this.formList.collectMoneyName,
              gatheringStartTime: this.date[0],
              gatheringEndTime: this.date[1],
              auditStartTime: this.date2[0],
              auditEndTime: this.date2[1],
              isReady: 0,
              limit: this.pageSize,
              page: this.currentPage
            }
          ).then(res => {
            this.tableData = res.data.rows;
            this.total = res.data.total;
            this.tableLoading=false;
          })
        }else if(this.tabstatus == 3){
          this.tableLoading=true;
          examineList({
            orderCustomer:this.formList.orderCustomer,
            collectNumber:this.formList.collectNumber,
            storeName:this.formList.storeName,
            collectMoneyName:this.formList.collectMoneyName,
            gatheringStartTime:this.date[0],
            gatheringEndTime:this.date[1],
            auditStartTime:this.date2[0],
            auditEndTime:this.date2[1],
            page:this.currentPage,
            limit:this.pageSize,
            type:2,
          }).then(res=>{
            this.tableData = res.data.rows;
            this.total = res.data.total;
            this.tableLoading=false;
          })
        } else {
          this.pagess()
        }

      },
      // 翻页方法
      currentChange(val) {
        this.currentPage = val;
        this.pagess()
      },

      // 翻页方法
      sizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        if (this.tabstatus == 4) {

        } else {
          this.pagess()
        }
      },

      //tab切换
      tabclickH(tab, event) {
        let url = "#/collection/receivablesrun?names=" + tab.name;
        let stateObject = {
          names: tab.names
        }
        history.pushState(stateObject, '', url);
        this.tableData = [];
        this.currentPage=1;
        this.total=0;
        if (tab.index == 2) {
          this.tabstatus = 4;
          this.tableLoading=true;
          listOrderCollectMoneyUnTicketByPage(
            {
              orderCustomer: this.formList.orderCustomer,
              collectNumber: this.formList.collectNumber,
              storeName: this.formList.storeName,
              collectMoneyName: this.formList.collectMoneyName,
              gatheringStartTime: this.date[0],
              gatheringEndTime: this.date[1],
              auditStartTime: this.date2[0],
              auditEndTime: this.date2[1],
              isReady: 0,
              limit: this.pageSize,
              page: this.currentPage
            }
          ).then(res => {
            this.tableData = res.data.rows;
            this.total = res.data.total;
            this.tableLoading=false;
          })
        } else if (tab.index == 4) {
          this.tabstatus = 2;
          this.pagess()
        } else if (tab.index == 3) {
          this.tabstatus = 3;
          this.tableLoading=true;
          examineList({
            orderCustomer:this.formList.orderCustomer,
            collectNumber:this.formList.collectNumber,
            storeName:this.formList.storeName,
            collectMoneyName:this.formList.collectMoneyName,
            gatheringStartTime:this.date[0],
            gatheringEndTime:this.date[1],
            auditStartTime:this.date2[0],
            auditEndTime:this.date2[1],
            page:this.currentPage,
            limit:this.pageSize,
            type:2,
          }).then(res=>{
            this.tableData = res.data.rows;
            this.total = res.data.total;
            this.tableLoading=false;
          })
          
        } else {
          this.tabstatus = tab.index
          this.pagess()
        }
      },


      //录入待收款按钮
      insertReceivables() {

        this.$router.push({
          //新增时需传入客户id
          path: "proedit",
          // query:{
          //     id:this.$route.query.id
          // }
        });

      },

      //取消收款按钮
      stopReceivables() {
        if (this.multiSelection.length) {
          this.$confirm('是否取消收款?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.cancelLoading=true;
            let arr = [];
            this.multiSelection.map((item, idx) => {
              arr.push(item.collectMoneyId)
            })
            let a = arr.join(",");
            cancelOrderCollectMoney(
              {
                collectMoneyIdss: a
              }
            ).then(res => {
              this.cancelLoading=false;
              this.pagess()
              this.$message({
                message: '操作成功',
                type: 'success'
              });
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });

        } else {
          this.$message({
            message: '请选择后再取消收款',
            type: 'warning'
          });
        }
      },

      //提交按钮
      submitOrder() {
        if (this.multiSelection.length) {
          this.$confirm('是否提交?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitLoading=true;
            let arr = [];
            this.multiSelection.map((item, idx) => {
              arr.push(item.collectMoneyId)
            })
            let a = arr.join(",");
            commitOrderCollectMoney({
              collectMoneyIdss: a
            }).then(res => {
              this.submitLoading=false;
              this.pagess()
              this.$message({
                message: '操作成功',
                type: 'success'
              });
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        } else {
          this.$message({
            message: '请选择后再操作',
            type: 'warning'
          });
        }

      },
      onSelect(el) {
        this.multiSelection = el;
      },

    },
  };
</script>
<style scoped lang="scss">

  .clientcollection {
    .querybox {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .orderinp {
        max-width: 250px;
      }
    }

    .clientcontent {
      margin-top: 20px;

      .btns {
        margin-top: 20px;
      }
    }
  }

</style>
