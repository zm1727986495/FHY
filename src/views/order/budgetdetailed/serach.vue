<template>
  <el-row :gutter="10" class="queryForm">
    <el-col :span="6">
      <el-input v-model="sercahData.names" placeholder="订单编号/客户合同号/客户姓名/客户电话/订单地址" size="medium" maxlength="50" @keyup.enter.native="fn()"></el-input>
    </el-col>
    <el-col :span="4">
      <el-select  placeholder="是否签署合同" size="medium" class="width-100" v-model="sercahData.isSing" @keydown.enter.native="fn()">
        <el-option
          v-for="item in value"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="4">
      <el-select  placeholder="选择所属门店" size="medium" class="width-100" v-model="sercahData.storeId" @change="getInfo" @keydown.enter.native="fn()">
        <el-option
          v-for="item in store"
          :key="item.storeId"
          :label="item.companyName"
          :value="item.storeId">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="3">
      <el-select  placeholder="选择销售员" size="medium" class="width-100" v-model="sercahData.salesmanId" @keydown.enter.native="fn()">
        <el-option
          v-for="item in info"
          :key="item.userId"
          :label="item.name"
          :value="item.userId">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="3">
      <el-select  placeholder="选择设计师" size="medium" class="width-100" v-model="sercahData.designerId" @keydown.enter.native="fn()">
        <el-option
          v-for="item in info"
          :key="item.userId"
          :label="item.name"
          :value="item.userId">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="4">
<!--      <span class="fontMore cursors" @click="fontClick()">{{showInput ? '收起' : '更多'}}</span>-->
      <el-button  type="warning" class="button-fc" size="medium"  @click="fn()">查询</el-button>
      <el-button  type="primary" size="medium" @click="reset()">重置</el-button>
    </el-col>
  </el-row>
</template>
<script>
import { listStoreByPresent,listStoreUser} from "api/common/common";
    export default {
        data(){
            return {
                styleList:[
                    {'label':'启用',"value":1},
                    {'label':'停用',"value":2},
                ],
                value:[
                    {'label':'是',"value":1},
                    {'label':'否',"value":0},
                ],
                store:[],
                searchData: '',
                showInput:false,
                sercahData:{
                    names: '',//多维度输入框
                    isSing: '',//是否签署合同
                    storeId:'',//所属门店
                    salesmanId:'',//选择销售员
                    surveyorId:'',//选择业务员
                    designerId:''//选择设计师
                },
                info:[],
            }
        },
        created(){
            this.getStore();
        },
        methods: {
            fontClick(){
                this.showInput =! this.showInput;
            },
            /**
             * 获取门店
             * @menthod getStore
             */
            getStore(){
                listStoreByPresent().then(res=> {
                    this.store = res.data.rows;
                    console.log(res)
                }).catch(error => {
                    console.log('预算清单列表查询 获取门店信息 views/order/budgetdetailed/serach.vue')
                })
            },
            /**
             * 获取门店下人员信息
             */
            getInfo(val){
                listStoreUser({storeId: val}).then(res => {
                    this.info = res.data;
                })
            },
            /**
             * 重置搜索条件
             * @method reset
             */
            reset(){
                this.sercahData = {
                    names: '',
                    isSing: '',
                    storeId:'',
                    salesmanId:'',
                    surveyorId:'',
                    designerId:''
                };
                this.$emit('chilreChange', this.sercahData);

            },
            /**
             * 查询条件获取数据
             * @method fn
             */
            fn(){
                this.$emit('chilreChange', this.sercahData);
            }
        }
    }
</script>
<style scoped>
    .budget{
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
    }
    .input-vw{
        width: calc(((92.5vw - 250px))/4);
        margin-bottom:20px;
        float: left;
        cursor: pointer;
        position: relative;
    }
    .fontMore{
        color:#d0cfcf;
    }
    .spaceAround{
        justify-content:space-around !important;
    }
</style>
