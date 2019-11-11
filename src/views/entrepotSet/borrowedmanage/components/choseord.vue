<template>
  <div class="choseord">
    <div class="orderList">
      <div class="li_detail2"></div>
      <div class="subbox">
        <el-button type="primary" size="small" @click="lendFun">借 出</el-button>
        <el-button type="primary" size="small" @click="resetFun">重 置</el-button>
        <el-input-number v-model="inpnumb" :min="0" :controls="false" v-if="isNumberView" size="small" :step="1" :precision="0"></el-input-number>
      </div>
      <div class="order_item m-bottom" style="marginTop: 20px">
        <div class="item_header multipleTableHeaderBg">
          <div style="paddingLeft:12px">
            <span class="span_title">借出单-采购单号：</span><span>{{purchaseNumber}}</span>
          </div>
        </div>
        <div class="item_body">
          <div class="item_div">
            <ul>
              <li><span>名称</span></li>
              <li><span>数量</span></li>
              <li class="item_tiele textAl">
                <div class="li_detail1">详情</div>
              </li>
            </ul>
            <ul v-for="(item,index) in tabList" :key="index">
              <!--名称 柜身 -->
              <li style="textAlign:center;padding:6px 0px;" ref="">
                <el-checkbox v-model="item.aogTemplateisChecked" @change="clickAogTemplate(item.aogTemplateId,$event)" :disabled="item.disabled">
                  {{item.aogTemplateName}}
                </el-checkbox>
              </li>
              <!-- 数量 -->
              <li><span class="li_pro">{{item.numTotal}}</span></li>
              <li class="item_tiele textA2">
                <!--详情 存放区 -->
                <div class="li_detail2" v-for="(attr,idx) in item.siteNumberList" :key="idx">
                  <el-checkbox v-model="attr.ischecked" @change="clickRegionName(item.aogTemplateId,$event)" :disabled="attr.disabled">
                    {{attr.regionName}}&nbsp;&nbsp;数量:{{attr.inventoryNumber}}
                  </el-checkbox>
                </div>
                <!-- <div style="margin: 6px,dispaly:block,width: 100%">
                  <el-input-number v-model="item.numlend" :min = "0" :controls="false" :step="1" :precision="0" v-if="item.isNumberView" :disabled="item.disabled" ></el-input-number>
                  <el-button type="primary" size="small" @click="lendFun(item.aogTemplateId)" :disabled="item.disabled">借 出</el-button>
                </div> -->
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import pagination from '@/views/components/pagination';
  import {
    listPackageById, // 采购单列表后的采购单明细
  } from 'api/entrepotSet/scrapmanagement/index';
    import { 
	listStoragePurchaseOrderPackageById
} from 'api/entrepotSet/borrowedmanage/index';
  import {log} from 'util';
  import {mapMutations, mapGetters, mapActions} from 'vuex';
  export default {
    components: {
      pagination,
    },
    name: 'choseord',
    props: ["purchaseNumber", "purchaseOrderId"],
    data() {
      return {
        visible: true,
        checked: false,
        tempList: [], // 名称加id
        siteNumberList: [],  // 详情
        tabList: [],
        disabled: false,
        isNumberView: false,
        inpnumb: 0,
      };
    },
    created() {
      // 获取采购单明细
      this.listPackageByIdfun();
    },
    mounted() {
      // 头部面包屑
      this.navList = this.$route.meta;
    },
    computed: {
      ...mapGetters([
        'selectedDetails'
      ]),
      getCheckedData() {
        let arr = [];
        let newTabList = this.tabList;
        newTabList.forEach(item => {
          item.siteNumberListChecked = item.siteNumberList.filter(child => {
            return child.ischecked;
          })
          arr.push(item)
        })
        return arr;
      }
    },
    methods: {
      ...mapMutations(["SET_SELECTEDDETAILS"]),
      ...mapActions(['setSelectedDetails']),
      //重置
      resetFun(){
        this.SET_SELECTEDDETAILS([])
        this.listPackageByIdfun()
        this.isNumberView = false;
        this.inpnumb = 0;
      },
      // 点击名称
      clickAogTemplate(aogTemplateId, val) {
        console.log(aogTemplateId, val, "aogTemplateId,val");
        this.tabList.forEach(item => {
          if (item.aogTemplateId == aogTemplateId) {
            item.siteNumberList.forEach(itm => {
              itm.ischecked = val;
            })
          }
        })
        if(val){
          // 禁用其他明细
          this.tabList.forEach(item =>{
            if(item.aogTemplateId != aogTemplateId){
              item.disabled = val;
              item.siteNumberList.forEach(itm => {  // 其他包的明细的 --- 即可以被选中/不选中
                itm.disabled = val;
              })
            }
          })
        }else{
          this.tabList.forEach(item =>{
            item.disabled = false;
            item.siteNumberList.forEach(itm => {  // 其他包的明细的 --- 即可以被选中/不选中
              itm.disabled = false;
            })
          })
        }
      },
      // 点击详情
      clickRegionName(aogTemplateId, val) {
		    // 控制包选中与否
        this.tabList.forEach(item => {
          if (item.aogTemplateId == aogTemplateId) {
            let flag = item.siteNumberList.every(itm => {
              return itm.ischecked
            })
            item.aogTemplateisChecked = flag;
          }
        })
        // 控制多选框选中与否
        this.$nextTick(() => {
          if(val){
            this.tabList.forEach(item =>{
              if(item.aogTemplateId != aogTemplateId){
                item.disabled = val;
                item.siteNumberList.forEach(itm => {  // 其他包的明细的 --- 即可以被选中/不选中
                  itm.disabled = val;
                })
              }
            })
          }else{
            let flag
            this.tabList.forEach(item =>{
              if(item.aogTemplateId == aogTemplateId){
                flag = item.siteNumberList.every(itm => {
                  return !itm.ischecked
                })
              }
            })
            if(flag){
              this.tabList.forEach(item =>{
                item.disabled = false;
                item.siteNumberList.forEach(itm => {  // 其他包的明细的 --- 即可以被选中/不选中
                  itm.disabled = false;
                })
              })
            }
          }
        });
		
        // 如果点中的详情超过1个就显示 input-Numebr框
        let numChecked = 0;
        let inpnumb = 0;
        this.tabList.forEach(item => {
          if (item.aogTemplateId == aogTemplateId) {
            item.siteNumberList.forEach(itm => {
              if(itm.ischecked) {
                numChecked += 1;
                inpnumb = itm.inventoryNumber
              }
            })
          }
        })
        if(numChecked == 1) {
          this.isNumberView = true;
          this.inpnumb = inpnumb
        }else {
          this.isNumberView = false;
        }
	    },
	  
	    // 详情的借出按钮
	  	lendFun() {
        console.log(this.tabList);
        if(this.selectedDetails.length>=1){
          this.$message.error('只能借一个!')
          return
        }
        let arr = []; // 里面的arr
        let selectedArr = [];
        this.tabList.forEach(item =>{
          item.numTotal = 0;
          item.siteNumberList.forEach(itm =>{
            if(itm.ischecked) {
              if(this.isNumberView){
                if(itm.inventoryNumber < this.inpnumb || this.inpnumb == 0 || itm.inventoryNumber == 0){
                  this.$message.warning("请输入正确的数量");
                  return;
                }else{
                  itm.inventoryNumber = itm.inventoryNumber - this.inpnumb
                  item.isborrow = true
                  itm.isborrow = true
                  let obj = {...itm, inventoryNumber: this.inpnumb}
                  arr.push(obj);
                }
              }else{
                let obj = {...itm}
                arr.push(obj);
                itm.inventoryNumber = 0
                itm.isborrow = true
              }
              selectedArr.push({
                ...item,
                numTotal: 0, // 数量
                siteNumberList: arr,
              })
            }
            item.numTotal+=itm.inventoryNumber
          })
        })
        console.log(arr);

        console.log(selectedArr, "在借出单号选中的数组");
        
        this.SET_SELECTEDDETAILS(selectedArr);
      },
      // 获取采购单明细
      listPackageByIdfun() {
        let data = {
          // purchaseOrderId: this.$route.query.purchaseOrderId, // 采购单id
          purchaseOrderId: this.purchaseOrderId,
        }
        listStoragePurchaseOrderPackageById(data).then(res => {
          if (res.status == 200) {
            this.tabList = [];
            this.tabList = res.data.packageList.map(item =>{
                let obj = {
                    ...item,
                    numTotal: 0,// 总数量
                    aogTemplateisChecked: false,// 名称是否被选中
                    disabled: false,
                    numlend: 0,// 只选择了一个详情 填写的报废数量
                    siteNumberList: [],// 明细
                }
                obj.siteNumberList = item.siteList.map(itm =>{
                  return {
                    ...itm,
                    ischecked: false,// 货区checkbox控制
                  }
                })
                return obj
            })
            
            // 计算货区的总数量
            this.tabList.forEach(item => {
              item.siteNumberList.forEach(itm => {
                item.numTotal += itm.inventoryNumber;
              })
            })
          }
        }).catch(error => {
          console.log('报废管理:报废管理 获取采购单明细 entrepotSet/scrapmanagement/components/purchaseList.vue', error);
        });
      }
    }
  };
</script>
<style scoped lang='scss'>
  .choseord {
    .orderList {
      font-size: 14px;
      .order_item {
        width: 100%;
        border: 1px solid #ebeef5;
        .item_header {
          >span {
            // width: 80px;
            padding: 0px 8px;
            text-align: center;
          }
          // background-color:#DCDCDC;
          height: 50px;
          line-height: 50px;
          display: flex;
          flex-wrap: nowrap;
          > div {
            .span_title {
              font-weight: bold;
            }
          }
        }
        .item_body {
          max-height: 400px;
          overflow-y: auto;
          overflow-x: auto;
          .item_div {
            display: flex;
            flex-wrap: nowrap;
            > ul {
              border-top: 1px solid #ebeef5;
              border-left: 1px solid #ebeef5;
              display: flex;
              flex-direction: column;
              li {
                border-right: 1px solid #ebeef5;
                border-bottom: 1px solid #ebeef5;
                display: flex;
                flex-wrap: nowrap;
                justify-content: center;
                align-items: center;
                min-height: 34px;
                span {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 80px;
                  height: 30px;
                }
                &.item_tiele {
                  flex: 1;
                  min-width: 0;
                  flex-wrap: wrap;
                  justify-content: flex-start;
                  .li_detail2 {
                    // width: 50%;
                    min-width: 138px;
                    padding: 0px 0 0 6px;
                    margin-top: 0px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }
                }
                &.textAl {
                  justify-content: center;
                }
                &.textA2 {
                  // min-width: 260px;
                  // max-height: 520px;
                  padding: 6px;
                  min-width: 292px;
                }
              }
              &:nth-of-type( n + 2 ) {
                flex: 1;
              }
            }
          }
        }
      }
    }
  }
  .bottom_btnlist {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>