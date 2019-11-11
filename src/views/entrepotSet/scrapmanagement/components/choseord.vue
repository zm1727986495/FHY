<template>
  <div class="choseord">
        <!-- <div class="head_nav">
             导航栏
            <breadcrumb :navList="navList"></breadcrumb>
        </div> -->

    <!-- <el-card> -->
	<!-- <el-dialog title="采购单" :visible.sync="visible" width="50%"  custom-class="customDialogTitle"  :close-on-press-escape="false"  :close-on-click-modal="false" :show-close="false"> -->

      <div class="orderList">
        <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
        </el-checkbox-group> -->
        <div class="li_detail2">
            <el-checkbox v-model="isAllchecked">全选</el-checkbox>
        </div>
        <!-- <el-button class="el-button--medium" type="primary" size="medium">全选</el-button> -->
        <div class="order_item m-bottom" style="marginTop: 20px">

          <div class="item_header multipleTableHeaderBg">
            <span>
              <el-checkbox v-model="isAllchecked"></el-checkbox>
            </span>
            <div>
              <span class="span_title">采购单号：</span>
              <span>{{purchaseNumber}}</span>
            </div>
            <!-- <div>
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
            </div> -->
          </div>


          <div class="item_body">
            <div class="item_div">

              <ul>
                <li><span>名称</span></li>
				<li><span>数量</span></li>
                <li class="item_tiele textAl"><div class="li_detail1">详情</div></li>
              </ul>

              <ul v-for="(item,index) in tabList" :key="index">
                <!--名称 柜身 -->
                <li style="textAlign:center;padding:6px 0px;" ref=""> 
                    <el-checkbox  v-model="item.aogTemplateisChecked" @change="clickAogTemplate(item.aogTemplateId,$event)">{{item.aogTemplateName}}</el-checkbox>
                </li>

				<!-- 数量 -->
				<li>  
                    <span class="li_pro">{{item.numTotal}}</span> 
                </li>

                <li class="item_tiele textA2"> 
                    <!--详情 存放区 -->
                    <div class="li_detail2" v-for="(attr,idx) in item.siteNumberList" :key="idx">
                        <el-checkbox v-model="attr.ischecked"  @change="clickRegionName(item.aogTemplateId,$event)">{{attr.regionName}}&nbsp;&nbsp;数量:{{attr.inventoryNumber}}</el-checkbox>
                    </div> 
                    
                </li>
              </ul>

            </div>
          </div>
          <!-- {{item}} -->
        </div>
      </div>
	  
      <!-- <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span> -->
	<!-- </el-dialog> -->
        <!-- <div class="bottom_btnlist">
            <el-button type="primary" @click="submitForm('ruleForm')">确认作废</el-button>
            <el-button @click="cancel('ruleForm')">返回</el-button>
        </div> -->

    <!-- </el-card> -->
  </div>
</template>
<script>

import pagination from '../../../components/pagination';
import breadcrumb from "../../../components/breadcrumb";
import { 
	listPackageById, // 采购单列表后的采购单明细
	addScrapApply, // 新增报废
} from 'api/entrepotSet/scrapmanagement/index';
import { log } from 'util';



export default {
  components: {
    breadcrumb,
    pagination,
  },
  name: 'choseord',
  props: ["purchaseNumber","purchaseOrderId"],
  data() {
    return {
        navList: [],//头部面包屑

        visible: true,
        // purchaseNumber: this.$route.query.purchaseNumber,

        // isAllchecked: false, // 全选的flag

        checked: false,


		tempList: [], // 名称加id
		siteNumberList: [],  // 详情
		tabList: [],
        // tabList: [{
        //     aogTemplateName: item.aogTemplateName, // 名称
        //     aogTemplateId: item.aogTemplateId, // 名称对应的id
        //     numTotal: 0, // 数量
        //     aogTemplateisChecked: item.aogTemplateisChecked, // 名称是否被选中
        //     siteNumberList: [{ // 货区
        //         aogTemplateId: itm.aogTemplateId, // 货区的id与名称的id对应
		// 		   inventoryPurchasePackageId: itm.inventoryPurchasePackageId, // 库存采购单包ID
		//         regionName: itm.regionName, // 货区的名字
		// 		   inventoryPurchasePackageDetailId: itm.inventoryPurchasePackageDetailId, //库存采购单包明细ID
        //         inventoryNumber: itm.inventoryNumber, // 货区的数量
        //         ischecked: false,  // 货区checkbox控制
        //     }], 
        // }],
    };
  },

	  created() {
		console.log(this.$route.path,"this.$route.path feiis")
		// 获取采购单明细
		this.listPackageById();
      },
      
      
    mounted() {
        // 头部面包屑
        this.navList = this.$route.meta;
    },

    computed: {
		// 全选flag
        isAllchecked: {
            get() {
                let flag = this.tabList.every(item => {
                    return item.aogTemplateisChecked
                })
                return flag;
            },
            set(val) {
				console.log(val,"val 5555");
				
				// 让所有的名称前的checkbox跟随变化
                this.tabList.forEach(item => {
					item.aogTemplateisChecked = val;

					item.siteNumberList.forEach(itm => {
						itm.ischecked = val;
					})

				})
            },
        }
    },

    methods: {
		// 点击名称
		clickAogTemplate(aogTemplateId,val) {
			console.log(aogTemplateId,val,"aogTemplateId,val");
			
			this.tabList.forEach(item => {
				if(item.aogTemplateId == aogTemplateId) {
					item.siteNumberList.forEach(itm => {
						itm.ischecked = val;
					})
				}
			})
		},

		// 点击详情
		clickRegionName(aogTemplateId,val) {
			this.tabList.forEach(item => {
				if(item.aogTemplateId == aogTemplateId) {
					let flag = item.siteNumberList.every(itm => {
						return itm.ischecked
					})

					
					item.aogTemplateisChecked = flag;
					

				}
			})
		},

		submitForm() {
			let packageList = [];
			this.tabList.forEach(item => {
				item.siteNumberList.forEach(itm => {
					if(itm.ischecked) {
						packageList.push({
							inventoryPurchasePackageId: itm.inventoryPurchasePackageId,
							scrapNumber: itm.scrapNumber,
						});
					}
				})
			})


			let data = {
				
				packageList: packageList
			};

			addScrapApply(data).then(res => {
				if (res.status == 200) {
					this.$message({
						message: "报废成功",
						type: "success"
					});
					this.$emit("closeOrder");
					// this.getPdf();
					// this.$router.push("/compensationmanage/index");
				}
			}).catch(err => {
				console.log('报废管理:报废管理 订单列表 entrepotSet/scrapmanagement/components/choseord.vue', err);
			});

		},
		// 取消按钮
		handleClose() {
			this.$emit("closeOrder");
		},
        //  提交按钮
        subclick(){
            // this.$emit("sub_click")
            if(this.isScrap) {
                this.$router.push({
                    path: "addscrap",
                    query:{
                    
                    }
                });
                return;
            }
            this.$router.push({
                path: "tobeallocated",
                query:{
                    
                }
            });
        },
        // 获取采购单明细
        listPackageById() {
            let data = { 
				// purchaseOrderId: this.$route.query.purchaseOrderId, // 采购单id
				purchaseOrderId: this.purchaseOrderId,
            }

            listPackageById(data).then(res => {
                if(res.status == 200) {
                    // this.tabList = [];
					// this.tempList = res.data.tempList; // 名称加id
					
					this.tempList = res.data.packageList;

					this.tempList.forEach(item => {
						if(!item) {
							return;
						}

						item.siteList.forEach(att => {
							att.ischecked = false; // 货区checkbox控制
						})

						this.tabList.push({
                            aogTemplateName: item.aogTemplateName,  // 名称
                            aogTemplateId: item.aogTemplateId, // 名称对应的id
                            numTotal:  item.inventoryNumber, // 数量
                            aogTemplateisChecked: false, // 名称是否被选中
							siteNumberList: item.siteList, // 货区
						})
					})

					console.log(this.tabList,"zhe格式");
					

					// 
					// console.log(this.tempList,"this.tempList52243342");
                    // this.tempList.forEach(item => {
					// 	if(!item) {
					// 		return;
					// 	}
						
                    //     this.tabList.push({
                    //         aogTemplateName: item.aogTemplateName,  // 名称
                    //         aogTemplateId: item.aogTemplateId, // 名称对应的id
                    //         numTotal: 0, // 数量
                    //         aogTemplateisChecked: false, // 名称是否被选中
                    //         siteNumberList: [], // 货区
					// 	})
					// 	console.log(this.tabList,"tabList4532");
						

                    // })

                    // // tabList: [{
                    // //     aogTemplateName: item.aogTemplateName, // 名称
                    // //     aogTemplateId: item.aogTemplateId, // 名称对应的id
                    // //     numTotal: 0, // 数量
                    // //     aogTemplateisChecked: item.aogTemplateisChecked, // 名称是否被选中
                    // //     siteNumberList: [{ // 货区
                    // //         aogTemplateId: itm.aogTemplateId, // 货区的id与名称的id对应
					// //         regionName: itm.regionName, // 货区的名字
					// // 		   inventoryPurchasePackageDetailId: itm.inventoryPurchasePackageDetailId, //库存采购单包明细ID
					// // 		   inventoryPurchasePackageId: itm.inventoryPurchasePackageId, // 库存采购单包ID
                    // //         inventoryNumber: itm.inventoryNumber, // 货区的数量
                    // //         ischecked: false, // // 货区checkbox控制
                    // //     }], 
                    // // }],

                    // this.siteNumberList = res.data.siteNumberList; // 详情
                    // this.tabList.forEach(item => {
                    //     this.siteNumberList.forEach(itm => {
                    //         if(item.aogTemplateId == itm.aogTemplateId) {
                    //             item.siteNumberList.push({
					// 				aogTemplateId: itm.aogTemplateId, // 货区的id与名称的id对应
					// 				inventoryPurchasePackageId: itm.inventoryPurchasePackageId, // 库存采购单包ID
					// 				inventoryPurchasePackageDetailId: itm.inventoryPurchasePackageDetailId, //库存采购单包明细ID
                    //                 regionName: itm.regionName, // 货区的名字
                    //                 inventoryNumber: itm.inventoryNumber, // 货区的数量
                    //                 ischecked: false, // // 货区checkbox控制
                    //             });
                                
                    //             // for(let i = 0; i < 10;i++) { // 测试用，应删除
                    //             //     item.siteNumberList.push({
					// 			// 		aogTemplateId: itm.aogTemplateId, // 货区的id与名称的id对应
					// 			// 		inventoryPurchasePackageId: itm.inventoryPurchasePackageId, // 库存采购单包ID
					// 			// 		inventoryPurchasePackageDetailId: itm.inventoryPurchasePackageDetailId, //库存采购单包明细ID
					// 			// 		regionName: itm.regionName, // 货区的名字
					// 			// 		inventoryNumber: itm.inventoryNumber, // 货区的数量
					// 			// 		ischecked: false, // // 货区checkbox控制
                    //             //     });
                    //             // }

                    //         }
                    //     })
                        
                    // })
                    // // 计算货区的总数量
                    // this.tabList.forEach(item => {
                    //     item.siteNumberList.forEach(itm => {
                    //         item.numTotal += itm.inventoryNumber;
                    //     })
                    // })

                    // console.log(this.tabList,"tabList");
                    
                } 
            }).catch(error => {
                console.log('报废管理:报废管理 获取采购单明细 entrepotSet/scrapmanagement/components/purchaseList.vue', error);
            });
        },
    }
};
</script>
<style scoped lang='scss'>
.choseord{
    
    .orderList{
      font-size: 14px;
      .order_item{
        width:100%;
        border:1px solid #ebeef5;
        .item_header{
          >span{
            // width: 80px;
			padding:0px 8px;
            text-align: center;
          }
          // background-color:#DCDCDC;
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
			> ul {
				border-top: 1px solid #ebeef5;
                border-left: 1px solid #ebeef5;
				display: flex;
				flex-direction: column;
				li{
                    border-right: 1px solid #ebeef5;
					border-bottom: 1px solid #ebeef5;
                    display: flex;
                    flex-wrap: nowrap;
                    justify-content: center;
                    align-items: center;
                    min-height: 34px;
					span{
						display:flex;
						justify-content: center;
						align-items: center;
						width: 80px;
						height: 30px;
					}
                    &.item_tiele{
                        flex: 1;
						min-width: 0;
                        flex-wrap: wrap;
                        justify-content: flex-start;
                        .li_detail2{
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

            // ul{
            //   border-right: 1px solid #ebeef5;
            //   .item_tiele{
            //     height: calc(100% - 90px);
            //   }
            //   .textAl{
            //     display: flex;
            //     align-items: center;
            //   }
            // }
            // li{
            //   border-bottom: 1px solid #ebeef5;
            // }
            // span{
            //   display:flex;
            //   justify-content: center;
            //   align-items: center;
            //   width: 80px;
            //   height: 30px;
            // }
            // .li_detail1{
            //   display: flex;
            //   justify-content: center;
            //   align-items: center;
            //   flex: 1;
            // }
            // .li_pro{
            //   display: flex;
            //   width: 200px;
            // }
            
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


