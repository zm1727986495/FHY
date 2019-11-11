<template>
  <div class="choseord">
    <div class="orderList">
      <div class="order_item m-bottom" style="marginTop: 20px">
        <div class="item_header multipleTableHeaderBg">
          <div style="paddingLeft:12px">
            <span class="span_title">借给单-采购单号：</span><span>{{purchaseNumber}}</span>
          </div>
        </div>
        <div class="item_body">
          <div class="item_div">
            <ul>
              <li><span>名称</span></li>
              <li><span>数量</span></li>
              <li class="item_tiele textAl"><div class="li_detail1">详情</div></li>
            </ul>
            <ul v-for="(item,index) in getCheckedData" :key="index">
              <!--名称 柜身 -->
              <li style="textAlign:center;padding:6px 0px;">
                  {{item.aogTemplateName}}
              </li>
              <li><span class="li_pro">{{item.numTotalChecked}}</span></li>
              <li class="item_tiele textA2">
                <!--详情 存放区 -->
				        <div class="li_detail2" v-for="(attr,idx) in item.siteNumberList" :key="idx">
                    {{attr.regionName}}&nbsp;&nbsp;数量:{{attr.inventoryNumber}}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import pagination from '../../../components/pagination';
  import breadcrumb from "../../../components/breadcrumb";
  import {
    listPackageById, // 采购单列表后的采购单明细
    addScrapApply, // 新增报废
  } from 'api/entrepotSet/scrapmanagement/index';
  import { 
	listStoragePurchaseOrderPackageById
} from 'api/entrepotSet/borrowedmanage/index';
  import {mapGetters} from 'vuex';
  export default {
    components: {
      breadcrumb,
      pagination
    },
    name: 'choseord',
    props: ["purchaseNumber", "purchaseOrderId"],
    data() {
      return {
        navList: [],//头部面包屑
        visible: true,
        checked: false,
        tempList: [], // 名称加id
        siteNumberList: [],  // 详情
        tabList: []
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
        let newTabList = this.selectedDetails; // 传来的数据
        let newList = this.tabList; // 获取到的数据 -- 借入单号的数据
        if(newTabList && newTabList.length != 0){
          newTabList.forEach(itaem =>{ // 传过来的数据
            arr = this.tabList.map(itm => { //  获取到的数据 -- 借入单号的数据
              if(itaem.aogTemplateId == itm.aogTemplateId) {
                itaem.siteNumberList.forEach(itmm => {
                  itm.siteNumberList.push({...itmm})
                })
                console.log(itm,"itm 执行后返回的值");
              }
              return itm;
            })
          })
        }
        if(newTabList && newTabList.length == 0) {
          arr = this.tabList; 
        }
        console.log(arr,"arr 555555555");
        return arr;
      },
    },
    watch: {
      selectedDetails(item) {
        console.log(item,"在借入单号获取到的数组");
        if(item.length==0){
          this.tabList = this.tabList.map(item=>{
            return {...item,siteNumberList:[]}
          })
        }
      }
    },
    methods: {
     // 获取采购单明细
      listPackageByIdfun() {
        let data = {
          purchaseOrderId: this.purchaseOrderId,
        }
        listStoragePurchaseOrderPackageById(data).then(res => {
          if (res.status == 200) {
            this.tabList = [];
            let datalist = res.data.packageList; // 名称加id
            this.tabList = datalist.map(item =>{
                return {
                    ...item,
                    numTotal: 0,// 总数量
                    aogTemplateisChecked: false,// 名称是否被选中
                    disabled: false,
                    siteNumberList: [],// 明细
                }
            })
            // 计算货区的总数量
            this.tabList.forEach(item => {
              item.siteNumberList.forEach(itm => {
                item.numTotal+=itm.inventoryNumber;
              })
            })
          }
        }).catch(error => {
          console.log('报废管理:报废管理 获取采购单明细 entrepotSet/scrapmanagement/components/purchaseList.vue', error);
        })
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
            padding: 0px 8px;
            text-align: center;
          }
          height: 50px;
          line-height: 50px;
          display: flex;
          flex-wrap: nowrap;
          >div {
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
</style>


