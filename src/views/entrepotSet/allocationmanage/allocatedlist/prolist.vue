<template>
  <div class="prolist1">
    <div class="apper">
        <!-- table表格 -->
        <div class="table_list lvs attribute m-top50">

          <el-table
            border
            :row-class-name="tableRowClassName"
            :row-style="tableBodycolor"
            :data="tabList"
            style="width: 100%;">
            <el-table-column
              prop="name"
              label="所属仓库"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="type"
              label="库存状态"
              width="240" sortable align="center">

              <template slot-scope="scope">
                <div class="typeBg">
                  <p v-if="scope.row.type==0" class="labelicon labelI">库存不足</p>
                  <p v-if="scope.row.type==1" class="labelicon2 labelI2">库存过多</p>
                  <p v-if="scope.row.type==2" class="labelicon3 labelI3">呆滞品</p>
                  <p v-if="scope.row.type==3" class="labelicon4 labelI4">正常</p>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              prop="name"
              label="商品名称"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="商品编码"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="商品规格"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="商品型号"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="商品类型"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="商品材质"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="商品颜色"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="商品属性"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="计量单位"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="货区货位"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="实际库存"
              width="240" sortable align="center">
            </el-table-column>

             <el-table-column
              prop="num"
              label="调拨数量"
              width="240" sortable align="center">

              
            </el-table-column>

            

          </el-table>    

        </div>



        <!-- 分页 -->
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

import pagination from '../../../components/pagination';
import breadcrumb from "../../../components/breadcrumb";

import spot from '@/assets/images/spot.png';
export default {
    components: {
      breadcrumb,
      pagination,
    

      
  },
  // name: 'brandmanagement',
  data() {
    return {
      currentPage: 1,//当前页数
      pageSize: 20,//总页数
      total: 100,//总条数
      spot,//操作图片
      navList: [],//头部面包屑

      elsectVal:[],//选中框
      tabList:[{
          num:1,
          name:"zhangsan",
          type:0
      },{
          num:1,
          name:"zhangsan",
          type:1
      },{
          num:1,
          name:"zhangsan",
          type:2
      },{
          num:1,
          name:"zhangsan",
          type:3
      }],//table数据
      options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
      value: '',
      show:"",



       searchForm:{ //查询条件
            name:"",
            value:"",
            time:[],
        },
       

      



      
    };
  },
  
 
  methods: {
    // 查询按钮
    searchFun(){
      

    },

    // 重置按钮
    resetFun(){
        this.searchForm = {};
    },


    //  提交按钮
    subclick(){
        // this.$emit("sub_click")
        this.$router.push({
          path: "tobeallocated",
          query:{
            
          }
        });
        
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
      console.log(this.elsectVal)
    },
    
    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      return "height: 80px";
    },

    //表格斑马线设置
    tableRowClassName({row, rowIndex}) {
        return rowIndex%2 != 0 ? 'el-f0' : '';
    },
    
    
  }
};
</script>
<style scoped lang='scss'>
.prolist1{
    .search_box{
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
    }
    .search_item{
        width: calc(((94vw - 250px))/4);
        margin-bottom:20px;
        cursor: pointer;
        position: relative;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        span{
            min-width: 80px;
            text-align: right
        }
        .fontMore{
            color:#d0cfcf;
        }
    }
    .subclick{
        width: 25%;
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
    .typeBg {
      display: flex;
      justify-content: center;
    }

}

</style>

