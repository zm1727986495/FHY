<template>
  <div>
    <div class="iconBox">
      <i class="Icon"></i>
      <span>基本信息</span>
    </div>
    <div>
      <ul class="customerlist">
        <li>
          <span class="fw">出库单号：</span>
          <span>{{obj.outboundNumber}}</span>
        </li>
        <li>
          <span class="fw">所属仓库：</span>
          <span>{{obj.storageName}}</span>
        </li>
        <li>
          <span class="fw">出库类型：</span>
          <span v-if="obj.outboundType==0">第三方</span>
          <span v-if="obj.outboundType==1">安装</span>
          <span v-if="obj.outboundType==2">内购</span>
          <span v-if="obj.outboundType==3">调拨</span>
          <span v-if="obj.outboundType==4">领用</span>
          <span v-if="obj.outboundType==5">手动</span>
          <span v-if="obj.outboundType==6">撤样</span>
          <span v-if="obj.outboundType==7">销售</span>
        </li>
        <!-- <li>
          <span class="fw">所属门店：</span>
          <span>{{obj.storeName}}</span>
        </li>-->
        <li>
          <span class="fw" style="min-width:90px;text-align: right;">出库状态：</span>
          <span v-if="obj.outboundStatus==1">待出库</span>
          <span v-if="obj.outboundStatus==2">待交接</span>
          <span v-if="obj.outboundStatus==3">已出库</span>
        </li>
        <li>
          <p class="fw">出库人：</p>
          <el-select style="width:130px" clearable filterable size="small" v-model="bindInfo.updateAt" placeholder="请选择">
            <el-option
              v-for="item in nameList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <!-- <el-input style="width:130px;" size="small" v-model="bindInfo.userName"></el-input> -->
        </li>
        <li>
          <span class="fw">来源单号：</span>
          <span>{{obj.sourceCode}}</span>
        </li>
         <li>
          <p class="fw">司机：</p>
          <!-- <span>{{obj.driver}}</span> -->
          <el-input style="width:130px;" size="small" v-model="bindInfo.driver"></el-input>
        </li>
         <li>
          <p class="fw" style="min-width:90px;">车牌号：</p>
          <!-- <span>{{obj.licensePlateNumber}}</span> -->
          <el-input style="width:130px;" size="small" v-model="bindInfo.receivingPeopleCar"></el-input>
        </li>
      </ul>
      <div class="timeFoucs m-top10">
        <div class="timeStyle">
          <p>记账日期：</p>
          <el-date-picker
            :disabled="!isDetails"
            v-model="bindInfo.expectedArrivalDate"
            style="width:130px"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            size="small"
            :default-value="bindInfo.expectedArrivalDate"
          ></el-date-picker>
        </div>
        <div class="timeStyle">
          <p>提货日期：</p>
          <el-date-picker
            :disabled="!isDetails"
            v-model="bindInfo.pickUpTime"
            style="width:130px"
            type="date"
            size="small"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            :default-value="bindInfo.pickUpTime"
          ></el-date-picker>
        </div>
        <div class="timeStyle">
          <p>接货人：</p>
          <el-input v-model="bindInfo.receivingPeople" size="small" style='width:130px;'></el-input>
        </div>
        <div class="timeStyle">
          <p style="min-width:90px;" class="lastChild">接货人电话：</p>
          <el-input style="width:130px;" v-model="bindInfo.receivingPeoplePhone" size="small"></el-input>
        </div>
      </div>
      <div class="remarks m-top10">
        <span class="fw">出库备注：</span>
        <el-input :disabled="!isDetails" :rows="2" placeholder="请输入内容" v-model="textarea"></el-input>
      </div>
    </div>
  </div>
</template>
<script>

import { getById,listOrganizationByUserId } from "api/entrepotSet/outgoingManagement/outgoingManagement";
export default {
  data() {
    return {
      obj: {},
      bindInfo: {
        driver:'',
        receivingPeopleCar:'',
        receivingPeople:'',
        receivingPeoplePhone:'',
        userName:'',
        updateAt:''
      },
      nameList:[],
      textarea: "",
      datePicker: "",
      isDetails: true
    };
  },
  created() {
    this.isDetails = this.$route.query.isShow == 1;
  },

  mounted() {
    this.getNowFormatDate();
    this.getHeader();
    this.getlistOrganizationByUserId();
  },
  methods: {
    getlistOrganizationByUserId(){
      listOrganizationByUserId().then(res=>{
        if(res.status == 200){
          this.nameList = res.data.staff;
          this.bindInfo.updateAt =  Number(JSON.parse(localStorage.getItem('loggedObj')).id);
        }
      }).catch(error=>{
        console.error(errro,'获取当前机构的人');
      })
    },
    //补0
    repair(str) {
      return str < 10 ? "0" + str : str;
    },
    //时间
    getNowFormatDate() {
      let dateTime = new Date();
      let hour = dateTime.getHours();
      let min = dateTime.getMinutes();
      let sec = dateTime.getSeconds();
      let yy = dateTime.getFullYear();
      let dd = dateTime.getDate();
      let mm = dateTime.getMonth() + 1;

      let time = yy + "-" + this.repair(mm) + "-" + this.repair(dd) + " " + this.repair(hour) + ":" + this.repair(min) + ":" + this.repair(sec);
      this.$set(this.bindInfo, "expectedArrivalDate", time);
      this.$set(this.bindInfo, "pickUpTime", time);
    },
    //获取确认出库信息头
    getHeader() {
      let data = {
        outboundOrderId: this.$route.query.outboundOrderId
      };
      getById(data).then(res => {
          if(res.status == 200){
            this.bindInfo.driver = res.data.driver;
            this.bindInfo.receivingPeopleCar = res.data.receivingPeopleCar;
            this.bindInfo.receivingPeople = res.data.receivingPeople;
            this.bindInfo.receivingPeoplePhone = res.data.receivingPeoplePhone;
            // this.bindInfo.userName = res.data.userName;
            this.bindInfo.updateAt = res.data.updateAt;
            this.obj = res.data;
            this.$emit("getData", this.obj);
          }
        })
        .catch(error => {
          console.error("获取确认出库信息头", error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.timeFoucs{
  display: flex;
  padding:0 20px;
}
.timeStyle {
  display: flex;
  width: 25%;
  p {
    display: flex;
    align-items: center;
    font-weight: bold;
    min-width: 70px;
    justify-content:flex-end;

  }
  .lastChild{
    // justify-content:flex-start !important;
    text-align: right;
  }
}
.page_head_div {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  height: 40px;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
}

.remarks {
  display: flex;
  align-items: center;
  padding:0 20px;
  span {
    min-width: 70px;
  }
}

.customerlist {
  display: flex;
  flex-wrap: wrap;
  padding: 0 20px;
  li {
    width: 25%;
    padding: 1px 0;
    display: flex;
    align-items: center;
    // line-height: 40px;
    p{
      min-width: 70px;
      width: 70px;
      text-align: right;
    }
    span {
      font-weight: none !important;
    }
  }
}
</style>
