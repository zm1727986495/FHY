<template>
  <div class="choseord">
    <el-card>
      <div class="orderList">
        <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
        </el-checkbox-group> -->
        <el-button class="el-button--medium" type="primary" size="medium">全选</el-button>
        <div class="order_item m-bottom" v-for="(item,index) in tabList" :key="index">
          <div class="item_header">
            <span>
              <el-checkbox v-model="allchecked"></el-checkbox>
            </span>
            <div>
              <span class="span_title">采购单号：</span>
              <span>{{item.orderid[0]}}</span>
            </div>
            <div>
              <span class="span_title">采购合同号：</span>
              <span>{{item.orderid[1]}}</span>
            </div>
            <div>
              <span class="span_title">订单号：</span>
              <span>{{item.orderid[2]}}</span>
            </div>
            <div>
              <span class="span_title">到货单号：</span>
              <span>{{item.orderid[3]}}</span>
            </div>

          </div>
          <div class="item_body">
            <div class="item_div">
              <ul>
                <li> <span>名称</span> </li>
                <li> <span>实收</span> </li>
                <li> <span>应收</span> </li>
                <li class="item_tiele textAl"> <div class="li_detail1">详情</div> </li>
              </ul>

              <ul v-for="(pro,index) in item.pro" :key="index">
                <li> <span class="li_pro">{{pro.name1}}</span> </li>
                <li> <span class="li_pro">{{pro.num1}}</span> </li>
                <li> <span class="li_pro">{{pro.num2}}</span> </li>
                <li class="item_tiele"> <div class="li_detail2" v-for="(attr,index) in pro.detail" :key="index">{{attr}}</div> </li>
              </ul>
            </div>
          </div>

        
          
          <!-- {{item}} -->
        </div>
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

      <librarytake></librarytake>

      <div class="subclick">
          <el-button class="el-button--medium" type="primary" size="medium"   @click="subclick">确认</el-button>
          <el-button class="el-button--medium" size="medium"   @click="subclick">返回</el-button>
      </div>

    </el-card>
  </div>
</template>
<script>

import pagination from "@/views/components/pagination";
import librarytake from './librarytake';

import spot from '@/assets/images/spot.png';
export default {
  components: {
    librarytake,
    pagination,
  },
  name: 'choseord',
  data() {
    return {
      currentPage: 1,//当前页数
      pageSize: 20,//总页数
      total: 100,//总条数
      spot,//操作图片
      navList: [],//头部面包屑
      allchecked:false,

      elsectVal:[],//选中框
      tabList:[
        {
          orderid:["123","123","123","123"],
          pro:[
            {
              name1:"柜身",
              num1:2,
              num2:12,
              detail:[
                "存放区1 001 数量1",
                "存放区2 002 数量2",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
              ]
            },
            {
              name1:"窗户",
              num1:2,
              num2:12,
              detail:[
                "存放区1 001 数量1",
                "存放区2 002 数量2",
                "存放区2 002 数量2",
                "存放区2 002 数量2",
                "存放区2 002 数量2",
                "存放区2 002 数量2",
                "存放区2 002 数量2",
                "存放区2 002 数量2",
                "存放区3 003 数量3"
              ]
            },
            {
              name1:"窗户",
              num1:2,
              num2:12,
              detail:[
                "存放区1 001 数量1",
                "存放区2 002 数量2",
                "存放区2 002 数量2",
                "存放区3 003 数量3"
              ]
            },
            {
              name1:"窗户",
              num1:2,
              num2:12,
              detail:[
                "存放区1 001 数量1",
                "存放区2 002 数量2",
                "存放区2 002 数量2",
                "存放区2 002 数量2",
                "存放区2 002 数量2",
                "存放区2 002 数量2",
                "存放区3 003 数量3"
              ]
            },
            {
              name1:"柜身",
              num1:2,
              num2:12,
              detail:[
                "存放区1 001 数量1",
                "存放区2 002 数量2",
                "存放区3 003 数量3"
              ]
            },
            {
              name1:"柜身",
              num1:2,
              num2:12,
              detail:[
                "存放区1 001 数量1",
                "存放区2 002 数量2",
                "存放区3 003 数量3"
              ]
            }

          ]
        },
        {
          orderid:["123","123","123","123"],
          pro:[
            {
              name1:"柜身",
              num1:2,
              num2:12,
              detail:[
                "存放区1 001 数量1",
                "存放区2 002 数量2",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
              ]
            },
            {
              name1:"窗户",
              num1:2,
              num2:12,
              detail:[
                "存放区1 001 数量1",
                "存放区2 002 数量2",
                "存放区2 002 数量2",
                "存放区2 002 数量2",
                "存放区2 002 数量2",
                "存放区2 002 数量2",
                "存放区2 002 数量2",
                "存放区2 002 数量2",
                "存放区3 003 数量3"
              ]
            },
            {
              name1:"柜身",
              num1:2,
              num2:12,
              detail:[
                "存放区1 001 数量1",
                "存放区2 002 数量2",
                "存放区3 003 数量3"
              ]
            },
            {
              name1:"柜身",
              num1:2,
              num2:12,
              detail:[
                "存放区1 001 数量1",
                "存放区2 002 数量2",
                "存放区3 003 数量3"
              ]
            }

          ]
        },
        
      ],
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
      searchForm:{ //查询条件
        name:"",
        value:"",
        time:[],
      },
       
    
    };
  },
  
 
  methods: {

    //  提交按钮
    subclick(){
        // this.$emit("sub_click")
        this.$router.push({
          path: "lendingdetails",
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
.choseord{
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
    .orderList{
      font-size: 14px;
      .order_item{
        width:100%;
        border:1px solid #DCDCDC;
        .item_header{
          >span{
            width: 80px;
            text-align: center;
          }
          background-color:#DCDCDC;
          height: 50px;
          line-height: 50px;
          display: flex;
          flex-wrap: nowrap;
          >div{
            width: 25%;
            .span_title{
              font-weight: bold;
            } 
          }
        }
        .item_body{
          max-height:400px;
          overflow-y:auto;
          overflow-x:auto;
          .item_div{
            display: flex;
            flex-wrap: nowrap;
            ul{
              border-right: 1px solid #dcdcdc;
              .item_tiele{
                height: calc(100% - 90px);
              }
              .textAl{
                display: flex;
                align-items: center;
              }
            }
            li{
              border-bottom: 1px solid #dcdcdc;
            }
            span{
              display:flex;
              justify-content: center;
              align-items: center;
              width: 80px;
              height: 30px;
            }
            .li_detail1{
              display: flex;
              justify-content: center;
              align-items: center;
              flex: 1;
            }
            .li_pro{
              display: flex;
              width: 200px;
            }
            .li_detail2{
              max-width: 200px;
              margin: 5px 0;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }

      }
    }
}

</style>


