<template>
  <div class="seemeasure">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <!-- 订单详情 -->
    <orderdetail></orderdetail>
    <el-card>
      <div class="m-top20" v-if="assignedType==0">
        <div class="titlecals">测量汇报内容</div>
        <div class="measurecontent marbott">
          <div class="disflbox">
            <div class="modebox">
              <div class="labox">测量任务编号</div>
              <div class="conbox">{{orderdata.assignedNumber}}</div>
            </div>
            <div class="modebox">
              <div class="labox">指派类型</div>
              <div class="conbox" v-if="orderdata.assignedType == 0">测量</div>
              <div class="conbox" v-if="orderdata.assignedType == 1">设计</div>
              <div class="conbox" v-if="orderdata.assignedType == 2">测量和设计</div>
            </div>
          </div>
          <div class="modebox">
            <div class="labox">任务结果</div>
            <div class="conbox">
              <p v-if="orderdata.dealResult==1">完成</p>
              <p v-if="orderdata.dealResult==0">未完成</p>
            </div>
          </div>
          <div class="modebox">
            <div class="labox">测量附件</div>
            <div class="conbox">
                  <!-- <el-upload class="upload-demo" action="string" :file-list="fileList2"></el-upload> -->
                  <div style="display:flex;" v-for="(itm, idx) in orderdata.enclosures" :key="idx">
                    <p>{{itm.sourceName}}</p>
                    <a style="color:#409EFF;" :href="urls" download @click="measurementDownload(idx)">下载附件</a>
                  </div>
              <!-- <ul class="imgli loadbox">
                <li v-for="(itm, idx) in orderdata.enclosures" :key="idx">
                  <img :src="itm.fileUrl" alt />
                  <a :href="urls" download @click="measurementDownload(idx)">下载附件</a>
                </li>
                <li class="loadbtnbox">
                  <div></div>
                  <div>
                    <el-button class="button-fc" size="medium" @click="measurementDownload">下载附件</el-button>
                  </div>
                </li>
              </ul> -->
            </div>
          </div>
          <div class="modebox">
            <div class="labox">{{orderdata.dealResult == 0 ? '未完成原因' : '汇报内容'}}</div>
            <div class="conbox">
              <el-input disabled resize="none" type="textarea" v-model="orderdata.taskResult"></el-input>
            </div>
          </div>
          <div class="modebox">
            <div class="labox">汇报人</div>
            <div class="conbox">{{orderdata.assignedName}}</div>
          </div>
          <div class="modebox">
            <div class="labox">汇报时间</div>
            <div class="conbox">{{orderdata.reportTime}}</div>
          </div>
        </div>
      </div>

      <div class="m-top20" v-if="assignedType==1">
        <div class="titlecals">设计汇报内容</div>
        <div class="measurecontent">
          <div class="disflbox">
            <div class="modebox">
              <div class="labox">测量任务编号</div>
              <div class="conbox">{{designcadPic.assignedNumber}}</div>
            </div>
            <div class="modebox">
              <div class="labox">指派类型</div>
              <div class="conbox" v-if="designcadPic.assignedType == 0">测量</div>
              <div class="conbox" v-if="designcadPic.assignedType == 1">设计</div>
              <div class="conbox" v-if="designcadPic.assignedType == 2">测量和设计</div>
            </div>
          </div>
          <div class="modebox">
            <div class="labox">线框图</div>
            <div class="conbox">
              <ul class="imgli">
                <li v-for="(item,index) in designcadPic.cadPic" :key="index">
                  <img :href="urls" :src="item.fileUrl" alt />
                  <a :href="urls" download @click="DesignFun(index,'CAD')">下载附件</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="modebox">
            <div class="labox">效果图</div>
            <div class="conbox">
              <ul class="imgli">
                <!-- <el-upload class="upload-demo" action="string" :file-list="fileList1"></el-upload> -->
                 <div style="display:flex;" v-for="(itm, idx) in designcadPic.effectPic" :key="idx">
                    <p>{{itm.sourceName}}</p>
                    <a style="color:#409EFF;" :href="urls" download @click="DesignFun(index,'XGT')">下载附件</a>
                  </div>
                <!-- <li v-for="(item,index) in designcadPic.effectPic" :key="index">
                  <img :src="item.fileUrl" alt />
                  <a :href="urls" download @click="DesignFun(index,'XGT')">下载附件</a>
                </li>
                <li class="loadbtnbox">
                  <div></div>
                  <div></div>
                </li> -->
              </ul>
            </div>
          </div>
          <div class="modebox">
            <div class="labox">预算清单</div>
            <div class="conbox">
              <ul class="imgli">
                <div style="display:flex;" v-for="(itm, idx) in designcadPic.budgetPic" :key="idx">
                    <p>{{itm.sourceName}}</p>
                    <a style="color:#409EFF;" :href="urls" download @click="DesignFun(index,'YSQD')">下载附件</a>
                  </div>
                <!-- <li v-for="(item,index) in designcadPic.budgetPic" :key="index">
                  <img :src="item.fileUrl" alt />
                  
                  <a :href="urls" download @click="DesignFun(index,'YSQD')">下载附件</a>
                </li> -->
                <!-- <el-upload class="upload-demo" action="string" :file-list="fileList"></el-upload> -->
                  <!-- <a :href="urls" download @click="DesignFun(index,'YSQD')">下载附件</a> -->
                <!-- <li class="loadbtnbox">
                  <div></div>
                  <div></div>
                </li> -->
              </ul>
            </div>
          </div>
          <div class="modebox">
            <div class="labox">汇报内容</div>
            <div class="conbox">
              <el-input type="textarea" disabled resize="none" v-model="designcadPic.taskResult"></el-input>
            </div>
          </div>
          <div class="modebox">
            <div class="labox">汇报人</div>
            <div class="conbox">{{designcadPic.assignedName}}</div>
          </div>
          <div class="modebox">
            <div class="labox">汇报时间</div>
            <div class="conbox">{{designcadPic.reportTime}}</div>
          </div>
        </div>
      </div>
    </el-card>
    <div class="btn">
      <el-button size="medium" @click="cancel">返 回</el-button>
    </div>
  </div>
</template>

<script>
import { orderAssignedMeasureDetails } from "api/order/measuremanage/measuremanage";
import breadcrumb from "@/views/components/breadcrumb";
import orderdetail from "../components/orderdetail";
import contractdetails from "../components/contractdetails";
import { getBuffer } from "@/utils/pubilcFn";
export default {
  components: {
    breadcrumb,
    orderdetail,
    contractdetails
  },
  data() {
    return {
      orderdata: {}, //测量详情
      designcadPic: {}, //设计详情
      fileList: [],
      fileList1:[],
      fileList2:[],
      navList: [],
      urls: "",
      assignedType: ""
    };
  },
  created() {
    this.getData();
  },
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {
    //获取列表
    getData() {
      let data = {
        assignedMeasureId: this.$route.query.assignedMeasureId,
        assignedType: this.$route.query.assignedType
      };
      orderAssignedMeasureDetails(data)
        .then(res => {
          if (res.status === 200) {
            this.orderdata = res.data;
            // if(res.data.enclosures){
            //   this.fileList2 = res.data.enclosures.map(item=>{
            //     return{url:item.fileUrl,name:item.sourceName}
            //   })
            // }

            this.designcadPic = res.data;
            if(res.data.budgetPic){

              this.fileList = res.data.budgetPic.map(item=>{
                return{url:item.fileUrl,name:item.sourceName}
              });

              this.fileList1 = res.data.effectPic.map(item=>{
                return{url:item.fileUrl,name:item.sourceName}
              });
            }
            this.assignedType = res.data.assignedType;
          }
        })
        .catch(error => {
          console.log(
            "指派测量:获取订单信息 order/measuremanage/seemeasure.vue",
            error
          );
        });
    },
    cancel() {
      this.$router.go(-1);
    },
    //测量下载
    measurementDownload(index) {
      getBuffer(this.orderdata.enclosures[index].sourceName).then(res => {
        this.urls = res;
      });
    },
    //设计下载
    DesignFun(index, str) {
      if (str == "XGT") {
        getBuffer(this.designcadPic.effectPic[index].sourceName).then(res => {
          this.urls = res;
        });
      } else if (str == "YSQD") {
        getBuffer(this.designcadPic.budgetPic[index].sourceName).then(res => {
          this.urls = res;
        });
      } else {
        getBuffer(this.designcadPic.cadPic[index].sourceName).then(res => {
          this.urls = res;
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.btn {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.retract {
  display: flex;
  justify-content: space-between;
  color: #d0cfcf;
  margin-bottom: 20px;
}
.seemeasure {
  .tapbox {
    padding: 10px;
    border: 1px solid rgba(228, 228, 228, 1);
    border-radius: 2px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .addmeas {
    padding: 0px 200px;
  }
  .boxtit {
    background: #f5f5f5;
    padding: 10px 20px;
    color: #333333;
    font-size: 14px;
    margin: 20px 0px;
  }
  .txtitle {
    margin-top: 20px;
    background: #f5f5f5;
    padding: 10px 20px;
    color: #333333;
    font-size: 14px;
    border: 1px solid #e4e4e4;
  }
  .measurecontent {
    width: 65%;
    padding-bottom: 20px;
    .modebox {
      display: flex;
      font-size: 14px;
      color: #999;
      margin-bottom: 20px;
      .conbox {
        flex: 1;
      }
      .labox {
        width: 120px;
        text-align: right;
        margin-right: 20px;
        color: #333;
      }
      .imgli {
        display: flex;
        flex-wrap: wrap;
        li {
          width: 100px;
          height: 100px;
          border: 1px solid #999;
          margin: 0px 10px 10px 10px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .loadbtnbox {
          border: none;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
      }
    }
    .disflbox {
      display: flex;
      justify-content: space-between;
      .modebox {
        flex: 1;
      }
    }
  }
  .marbott {
    margin-bottom: 40px;
  }
}
</style>

