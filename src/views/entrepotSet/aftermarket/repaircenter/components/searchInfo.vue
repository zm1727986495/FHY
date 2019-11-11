<template>
  <!--搜索条件 -->
  <div class="repaircenter_searchinfo">
    <div class="search_box">
      <div class="search_item">
        <el-input @keyup.enter.native="searchFun" v-model="searchForm.installationOrderGroup" class="width-100" placeholder="订单号/合同号/到货单号/采购合同号/货主姓名/电话号/客户地址"></el-input>
      </div>

      <div class="search_item">
        <el-input @keyup.enter.native="searchFun" v-model="searchForm.commodityName" class="width-100" placeholder="商品名称"></el-input>
      </div>

      <div class="search_item">
        <el-input @keyup.enter.native="searchFun" v-model="searchForm.region" placeholder="地区"></el-input>
      </div>

      <div class="search_item" v-if='isShow'>
        <el-date-picker v-model="time4" class="width-100" style="width:100%" type="daterange" range-separator="至"  
        start-placeholder="订单完成时间" end-placeholder="订单完成时间" @change="time4Change" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
      </div>

      <div class="search_item" v-if='isShow'>
        <el-date-picker v-model="time1" class="width-100" style="width:100%" type="daterange" range-separator="至" 
        start-placeholder="接单开始时间" end-placeholder="接单结束时间" @change="time1Change" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
      </div>

      <div class="search_item" v-if='isShow'>
        <el-date-picker v-model="time2" class="width-100" style="width:100%" type="daterange" range-separator="至"
          start-placeholder="预计开始安装时间" end-placeholder="预计安装结束时间" @change="time2Change" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
      </div>

      <div class="search_item" v-if='isShow'>
        <el-date-picker v-model="time3" class="width-100" style="width:100%" type="daterange" range-separator="至"
          start-placeholder="预约开始上门时间" end-placeholder="预约结束上门时间" @change="time2Change" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
      </div>

      <div class="search_item" v-if='isShow'>
        <el-select class="width-100" clearable filterable v-model="searchForm.orderClassify" placeholder="请选择订单类型">
          <el-option v-for="(item,index) in orderType" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>

      <div class="search_item" v-if='isShow'>
        <el-select class="width-100" clearable filterable multiple collapse-tags v-model="searchForm.orderStatus" placeholder="请选择订单状态">
          <el-option v-for="item in orderStatusArr" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>

      <div class="search_item" v-if='isShow'>
        <el-select class="width-100" clearable filterable v-model="searchForm.distributionType" placeholder="请选择物流类型">
          <el-option v-for="(item,index) in distributionTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>

      <div class="search_item" v-if='isShow'>
        <el-select class="width-100" clearable filterable v-model="searchForm.branch" placeholder="请选择门店">
          <el-option v-for="item in storeList" :key="item.storeId" :label="item.storeName" :value="item.storeId"></el-option>
        </el-select>
      </div>

      <div class="search_item" v-if='isShow'>
        <el-select class="width-100" clearable filterable v-model="searchForm.source" placeholder="请选择订单来源">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>

      <div class="search_item" v-if='isShow'>
        <el-select class="width-100" clearable filterable v-model="searchForm.takeInstallGroup" placeholder="请选择责任安装部">
          <el-option v-for="item in serveOptions" :key="item.serveGroupId" :label="item.serveGroupName" :value="item.serveGroupId"></el-option>
        </el-select>
      </div>

      <div class="search_item" v-if='isShow'>
        <el-select class="width-100" clearable filterable v-model="searchForm.evaluateStatus" placeholder="请选择评分筛选">
          <el-option v-for="item in evaluateOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>

      <div class="search_item">
        <span class="fontMore cursors" @click="isShow=!isShow">{{isShow ? '收起' : '更多'}}</span>
        <el-button class="button-fc" type="warning" size="medium" @click="searchFun">查询</el-button>
        <el-button class="el-button--medium" type="primary" size="medium" @click="resetFun">重置</el-button>
        <el-button class="el-button--medium" type="success" size="medium" @click="exportFun">导出</el-button>
      </div>

      <div class="search_item"></div>

      <div class="search_item"></div>
    </div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import { listStore } from "api/Installation/dispatchcenter/dispatchcenter";
import { listServeGroup } from "@/api/systemcenter/department";
import module from "../../../../../../config/index";
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  props: ["orderStatusArr"],
  created(){
    let start = new Date()
    start.setTime(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
    this.time4[0] = start
    this.time4[1] = new Date((new Date).getTime() + 24*60*60*1000)
    this.searchForm.installCompleteStartTime = this.time4[0].toLocaleDateString().replace(/\//g, "-");
    this.searchForm.installCompleteEndTime = this.time4[1].toLocaleDateString().replace(/\//g, "-");
  },
  data() {
    return {
      isShow: false, //隐藏展示条件
      searchForm: {},
      time1: [], //接单时间
      time2: [], //预计安装时间
      time3: [], //预约时间
      time4: [], //订单完成时间
      options: [
          // `source` tinyint(4) DEFAULT NULL COMMENT '来源1.销售,2.上样,3.转移,4.售后,5.400 6撤样 7第三方订单' 8  ,
        
        {
          value: "1",
          label: "销售"
        },
        {
          value: "2",
          label: "上样"
        },
        {
          value: "3",
          label: "转移"
        },
        {
          value: "4",
          label: "售后"
        },
        {
          value: "5",
          label: "400"
        },
        {
          value: "6",
          label: "撤样"
        },
        {
          value: "7",
          label: "第三方订单"
        },
        {
          value: "8",
          label: "退货"
        },
      ],
      //责任安装部
      serveOptions: [],
      //订单类型
      orderType: [
        {
          name: "正单",
          id: "0"
        },
        {
          name: "增单",
          id: "1"
        },
        {
          name: "补单",
          id: "2"
        },
        {
          name: "遗留单",
          id: "3"
        },
        {
          name: "上样",
          id: "4"
        },
        {
          name: "撤样",
          id: "5"
        },
        {
          name: "调拨入库",
          id: "6"
        },
        {
          name: "换货入库",
          id: "7"
        },
        {
          name: "退货入库",
          id: "8"
        },
        {
          name: "退库入库",
          id: "9"
        },
        {
          name: "手动入库",
          id: "10"
        },
        {
          name: "接口入库",
          id: "11"
        },
        {
          name: "回库入库单",
          id: "12"
        },
        {
          name: "备货入库",
          id: "13"
        }
      ],
      //评分
      evaluateOptions: [
        {
          name: "1分",
          id: "1"
        },
        {
          name: "2分",
          id: "2"
        },
        {
          name: "3分",
          id: "3"
        },
        {
          name: "4分",
          id: "4"
        },
        {
          name: "5分",
          id: "5"
        }
      ],
      //配送类型
      distributionTypeList: [
        {
          name: "送装一体",
          id: "1"
        },
        {
          name: "送装分离",
          id: "2"
        }
      ],
      storeList: [] //门店
    };
  },
  mounted() {
    this.getStore();
    this.listServeGroup();
  },
  methods: {
    //接单时间改变
    time1Change() {
      this.searchForm.takeStartTime = this.time1 ? this.time1[0] : "";
      this.searchForm.takeEndTime = this.time1 ? this.time1[1] : "";
    },

    //预计安装时间改变
    time2Change() {
      this.searchForm.startInstallTime = this.time2 ? this.time2[0] : "";
      this.searchForm.endInstallTime = this.time2 ? this.time2[1] : "";
    },

    //预计上门时间改变
    time3Change() {
      this.searchForm.visitStartTime = this.time3 ? this.time3[0] : "";
      this.searchForm.visitEndTime = this.time3 ? this.time3[1] : "";
    },

    
    //订单完成时间改变
    time4Change() {
      if(this.time4){
        if (this.time4.length != 0) {
            let str =
            new Date(this.time4[1]).getTime() -
            new Date(this.time4[0]).getTime();
          if (str <= 7776000000) {
            this.searchForm.installCompleteStartTime = this.time4[0];
            this.searchForm.installCompleteEndTime = this.time4[1];
          } else {
            this.$message.error("时间不能大于90天!");
            this.time4 = [];
            this.searchForm.installCompleteStartTime = '';
            this.searchForm.installCompleteEndTime = '';
          }
        }
        }else{
        this.time4 = []
        this.searchForm.installCompleteStartTime = '';
        this.searchForm.installCompleteEndTime = '';
      }
    },

    // 查询按钮
    searchFun() {
      this.$emit("get_List", this.searchForm);
    },

    // 重置按钮
    resetFun() {
      this.time4 = [];
      this.searchForm = {};
      this.searchFun();
    },

    //导出
    exportFun() {
      var fix = document.querySelector('.el-table__fixed');
          var wb;
          if (fix) {
            wb = XLSX.utils.table_to_book(document.querySelector('#pathtabs_table1').removeChild(fix));
            document.querySelector('#pathtabs_table1').appendChild(fix);
          } else {
            wb = XLSX.utils.table_to_book(document.querySelector('#pathtabs_table1'));
          }

        var wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "buffer"
        });
        try {
          FileSaver.saveAs(
            new Blob([wbout], { type: "application/octet-stream" }),
            "导出售后.xlsx"
          );
        } catch (e) {
          console.log(e);
        }
    },
    //获取门店
    getStore() {
      listStore()
        .then(res => {
          this.storeList = res.data;
        })
        .catch(error => {
          console.error("获取门店", error);
        });
    },
    //获取责任安装部
    listServeGroup() {
      listServeGroup().then(res => {
        this.serveOptions = res.data.rows;
      });
    }
  },

  components: {
    breadcrumb,
    pagination
  }
};
</script>

<style scope lang="scss">
.repaircenter_searchinfo {
  .search_box {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }
  .search_item {
    width: calc(((94vw - 250px)) / 4);
    margin-bottom: 10px;
    cursor: pointer;
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    .fontMore {
      color: #d0cfcf;
    }
  }
}
</style>
