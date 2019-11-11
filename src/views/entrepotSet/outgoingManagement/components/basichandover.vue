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
          <span>{{bindInfo.outboundNumber}}</span>
        </li>
        <li>
          <span class="fw">合同号：</span>
          <span>{{bindInfo.contractSerialNumber}}</span>
        </li>
        <!-- <li>
          <span class="fw">采购合同号：</span>
          <span></span>
        </li> -->
        <li>
          <span class="fw">出库类型：</span>
          <span v-if="bindInfo.outboundType==1">安装</span>
          <span v-if="bindInfo.outboundType==2">内购</span>
          <span v-if="bindInfo.outboundType==3">调拨</span>
          <span v-if="bindInfo.outboundType==4">领用</span>
        </li>
        <!-- <li>
          <span class="fw">供应商：</span>
          <span>欧派</span>
        </li>-->
        <li>
          <span class="fw">所属仓库：</span>
          <span>{{bindInfo.storageName}}</span>
        </li>
        <!-- <li>
          <span class="fw">出库状态：</span>
          <span v-if="bindInfo.outboundStatus==1">待出库</span>
          <span v-if="bindInfo.outboundStatus==1">待交接</span>
          <span v-if="bindInfo.outboundStatus==1">已出库</span>
        </li> -->
        <li>
          <span class="fw">出库人：</span>
          <span>{{bindInfo.userName}}</span>
        </li>
        <!-- <li>
          <span class="fw">出库备注：</span>
          <span></span>
        </li> -->
        <li>
          <span class="fw">所属门店：</span>
          <span>{{bindInfo.storeName}}</span>
        </li>
        <li>
          <span class="fw">客户姓名：</span>
          <span>{{bindInfo.customerName}}</span>
        </li>
        <li>
          <span class="fw">客户电话：</span>
          <span>{{bindInfo.customerPhone}}</span>
        </li>
        <li>
          <span class="fw">客户地址：</span>
          <span>{{bindInfo.address}}</span>
        </li>
        <!-- <li>
          <span class="fw">服务类型：</span>
          <span v-if="bindInfo.designateType==1">送装一体</span>
          <span v-if="bindInfo.designateType==2">送装分离</span>
        </li> -->
        <!-- <li>
          <span class="fw">安装部：</span>
          <span>{{bindInfo.organizationName}}</span>
        </li> -->
        <li>
          <span class="fw">司机：</span>
          <span>{{bindInfo.driver}}</span>
        </li>
        <li>
          <span class="fw">预计安装时间：</span>
          <span>{{bindInfo.predictInstallTime}}</span>
        </li>
        <li>
          <span class="fw">接货人：</span>
          <span>{{bindInfo.receivingPeople}}</span>
        </li>
        <li>
          <span class="fw">接货人电话：</span>
          <span>{{bindInfo.receivingPeoplePhone}}</span>
        </li>
        <li>
          <span class="fw">接货人车牌：</span>
          <span>{{bindInfo.receivingPeopleCar}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { getById } from "api/entrepotSet/outgoingManagement/outgoingManagement";
export default {
  data() {
    return {
      bindInfo: {}
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //获取列表
    getData() {
      let data = {
        outboundOrderId: this.$route.query.outboundOrderId
      };
      getById(data)
        .then(res => {
          if(res.status == 200){
            this.bindInfo = res.data ? res.data : {};
          }
        })
        .catch(error => {
          console.error("获取信息头", error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.page_head_div {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  height: 40px;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
}

.customerlist {
  display: flex;
  flex-wrap: wrap;
  padding: 0 50px;
  li {
    width: 33%;
    line-height: 40px;
    span {
      font-weight: none !important;
    }
  }
}
</style>
