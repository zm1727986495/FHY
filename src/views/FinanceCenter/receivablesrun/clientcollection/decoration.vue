<template>
  <div class="clientcollection unsortable">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card class="lvs">
      <div class="querybox">
        <el-input
          placeholder="订单编号/客户合同号/客户姓名/客户电话/订单地址"
          v-model="searchtext"
          size="medium"
          class="orderinp"
        >
          <el-button slot="append" icon="el-icon-search" size="medium"></el-button>
        </el-input>
        <div>
          <el-button size="medium" class="button-fc">查询</el-button>
        </div>
      </div>
    </el-card>
    <ul class="tabtop m-left20 m-top20">
            <li v-for="(itm, idx) in tablists" :key="idx" @click="tabclickH(idx)" :class="[tabstatus===idx ? 'checkclass': '']">{{itm}}</li>
      </ul>
    <el-card class="lvs m-top50">
      <div>
        <el-table :data="tableData" style="width: 100%;margin-bottom: 20px;" border row-key="id">
            <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="date" label="日期" sortable width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" sortable width="180"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
        </el-table>
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
    </el-card>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from '@/views/components/pagination';

export default {
  components: {
    breadcrumb,
    pagination
  },
  data() {
    return {
      navList: [],
      searchtext: "",
      tablists:["待审核","已审核"],
      tabstatus:0,//tab切换
      currentPage: 1,//当前页数
      pageSize: 20,//当前页最大条数
      total: 10,//总条数
      tableData: [//列表数据
        {
          id: 1,
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          id: 2,
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          id: 3,
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          id: 4,
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {
    currentChange(val) {//翻页方法
        this.currentPage = val;
    },
    sizeChange(val) {//翻页方法
        this.currentPage = 1;
        this.pageSize = val;
    },
    tabclickH(attr){
        this.tabstatus = attr;
    }
  }
};
</script>
<style scoped lang="scss">
.clientcollection {
  .querybox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .orderinp {
      max-width: 420px;
    }
  }

}
.tabtop{
    position: absolute;
    margin-top: 70px;
    // top: -27px;
    // left: 0px;
    transform: translate(-20px, -47px);
    display: flex;
    font-size: 14px;
    background: #006EC7;
    border-radius: 5px 5px 0px 0px;
    border-bottom: none;
    cursor:pointer;
    li{
      padding: 5px 8px;
      color: #ffffff;
      transition: 1s all;
      height: 100%;
    }
    .checkclass{
      background: #ffffff;
      color: #333;
      border-radius: 5px 5px 0px 0px!important;
      transition: 1s all;
      border-bottom: none;
    }
}
</style>