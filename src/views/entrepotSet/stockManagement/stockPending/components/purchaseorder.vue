<template>
  <div class="choseord">
    <div class="orderList">
      <input
        v-if="tabList"
        type="checkbox"
        :checked="tabList.length==seltabList.length && seltabList.length"
        @click="checkedAll"
        class="m-left32"
      >
      <label v-if="tabList" class="font_red">全选</label>
      <div class="order_item m-bottom" v-for="(item,index) in tabList" :key="index">
        <div class="item_header">
          <span>
            <input
              type="checkbox"
              :checked="seltabList.indexOf(item.id)>=0"
              name="checkboxinput"
              @click="checkedOne(item.id)"
            >
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
              <li>
                <span>名称</span>
              </li>
              <li>
                <span>实收</span>
              </li>
              <li>
                <span>应收</span>
              </li>
              <li class="item_tiele textAl">
                <div class="li_detail1">详情</div>
              </li>
            </ul>

            <ul v-for="(pro,index) in item.pro" :key="index">
              <li>
                <span class="li_pro">{{pro.name1}}</span>
              </li>
              <li>
                <span class="li_pro">{{pro.num1}}</span>
              </li>
              <li>
                <span class="li_pro">{{pro.num2}}</span>
              </li>
              <li class="item_tiele">
                <div class="li_detail2" v-for="(attr,index) in pro.detail" :key="index">{{attr}}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import spot from "@/assets/images/spot.png";
export default {
  data() {
    return {
      spot, //操作图片
      navList: [], //头部面包屑
      allchecked: false,

      seltabList: [], //选中框
      tabList: [
        {
          id: 1,
          orderid: ["123", "123", "123", "123"],
          pro: [
            {
              name1: "柜身",
              num1: 2,
              num2: 12,
              detail: [
                "存放区1 001 数量1",
                "存放区2 002 数量2",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3"
              ]
            },
            {
              name1: "窗户",
              num1: 2,
              num2: 12,
              detail: [
                "存放区1 001 数量1",
                "存放区2 002 数量2",
                "存放区2 002 数量2",
                "存放区2 002 数量2",
                "存放区2 002 数量2"
              ]
            },
            {
              name1: "窗户",
              num1: 2,
              num2: 12,
              detail: [
                "存放区1 001 数量1",
                "存放区2 002 数量2",
                "存放区2 002 数量2",
                "存放区3 003 数量3"
              ]
            },
            {
              name1: "窗户",
              num1: 2,
              num2: 12,
              detail: [
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
              name1: "柜身",
              num1: 2,
              num2: 12,
              detail: [
                "存放区1 001 数量1",
                "存放区2 002 数量2",
                "存放区3 003 数量3"
              ]
            },
            {
              name1: "柜身",
              num1: 2,
              num2: 12,
              detail: [
                "存放区1 001 数量1",
                "存放区2 002 数量2",
                "存放区3 003 数量3"
              ]
            }
          ]
        },
        {
          id: 1,
          orderid: ["123", "123", "123", "123"],
          pro: [
            {
              name1: "柜身",
              num1: 2,
              num2: 12,
              detail: [
                "存放区1 001 数量1",
                "存放区2 002 数量2",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3",
                "存放区3 003 数量3"
              ]
            },
            {
              name1: "窗户",
              num1: 2,
              num2: 12,
              detail: [
                "存放区1 001 数量1",
                "存放区2 002 数量2",
                "存放区2 002 数量2",
                "存放区2 002 数量2",
                "存放区2 002 数量2"
              ]
            },
            {
              name1: "窗户",
              num1: 2,
              num2: 12,
              detail: [
                "存放区1 001 数量1",
                "存放区2 002 数量2",
                "存放区2 002 数量2",
                "存放区3 003 数量3"
              ]
            },
            {
              name1: "窗户",
              num1: 2,
              num2: 12,
              detail: [
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
              name1: "柜身",
              num1: 2,
              num2: 12,
              detail: [
                "存放区1 001 数量1",
                "存放区2 002 数量2",
                "存放区3 003 数量3"
              ]
            },
            {
              name1: "柜身",
              num1: 2,
              num2: 12,
              detail: [
                "存放区1 001 数量1",
                "存放区2 002 数量2",
                "存放区3 003 数量3"
              ]
            }
          ]
        }
      ]
    };
  },

  methods: {
    checkedOne(Id) {
      let idIndex = this.seltabList.indexOf(Id);
      if (idIndex >= 0) {
        //如果已经包含就去除
        this.seltabList.splice(idIndex, 1);
      } else {
        //如果没有包含就添加
        this.seltabList.push(Id);
      }
    },

    checkedAll(e) {
      this.isCheckedAll = e.target.checked;
      if (this.isCheckedAll) {
        //全选时
        this.seltabList = [];
        this.tabList.forEach(item => {
          this.seltabList.push(item.id);
        });
      } else {
        this.seltabList = [];
      }
    },

    //  提交按钮
    subclick() {
      // this.$emit("sub_click")
      this.$router.push({
        path: "tobeallocated",
        query: {}
      });
    },

    //勾选函数回调
    handleSelectionChange(val) {
      this.elsectVal = val;
      console.log(this.elsectVal);
    },

    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      return "height: 80px";
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style scoped lang='scss'>
.choseord {
  max-height: 600px;
  overflow: auto;
  .search_box {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }
  .search_item {
    width: calc(((94vw - 250px)) / 4);
    margin-bottom: 20px;
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
    width: 25%;
    margin: 20px auto;
  }
  .orderList {
    .m-left32 {
      margin-left: 32px;
      margin-bottom: 15px;
    }
    .font_red {
      margin-bottom: 200px;
      color: red;
    }
    font-size: 14px;
    .order_item {
      width: 100%;
      border: 1px solid #dcdcdc;
      .item_header {
        > span {
          width: 80px;
          text-align: center;
        }
        background-color: #dcdcdc;
        height: 50px;
        line-height: 50px;
        display: flex;
        flex-wrap: nowrap;
        > div {
          width: 25%;
          .span_title {
            font-weight: bold;
          }
        }
      }
      .item_body {
        max-height: 270px;
        overflow-y: auto;
        overflow-x: auto;
        .item_div {
          display: flex;
          flex-wrap: nowrap;
          ul {
            border-right: 1px solid #dcdcdc;
            .item_tiele {
              height: calc(100% - 90px);
            }
            .textAl {
              display: flex;
              align-items: center;
            }
          }
          li {
            border-bottom: 1px solid #dcdcdc;
          }
          span {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 80px;
            height: 30px;
          }
          .li_detail1 {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 1;
          }
          .li_pro {
            display: flex;
            width: 200px;
          }
          .li_detail2 {
            max-width: 200px;
            padding: 5px 0;
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


