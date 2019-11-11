<template>
    <div class="returndetails">
		<!-- 导航栏 -->
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>

		<!-- 查询条件组 -->
		<el-card v-if="see">
			<div class="titlecals">借还货明细</div>
			<div class="order_item m-bottom" style="marginTop: 20px">
				<div class="item_header multipleTableHeaderBg">
				<div style="paddingLeft:12px">
					<span class="span_title">借货方-采购单号1：</span><span>{{borrowCode}}</span>
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
						<ul v-for="(item, index) in borrowdata" :key="index">
							<li style="textAlign:center;padding:6px 0px;">{{item.aogTemplateName}}</li>
							<li><span class="li_pro">{{item.inventoryNumber}}</span></li>
							<li class="item_tiele textA2">
								<div class="li_detail2" v-for="(itm, idx) in item.siteList" :key="idx">
									<!-- {{itm.siteCode}} 数量 {{itm.inventoryNumber}} -->
									{{itm.siteCode}}
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="order_item m-bottom" style="marginTop: 20px">
				<div class="item_header multipleTableHeaderBg">
				<div style="paddingLeft:12px">
					<span class="span_title">还货方-采购单号：</span><span>{{lendCode}}</span>
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
						<ul v-for="(item, index) in lendata" :key="index">
							<li style="textAlign:center;padding:6px 0px;">{{item.aogTemplateName}}</li>
							<li><span class="li_pro">{{item.inventoryNumber}}</span></li>
							<li class="item_tiele textA2">
								<div class="li_detail2" v-for="(itm, idx) in item.siteList" :key="idx">
									<!-- {{itm.siteCode}} 数量 {{itm.inventoryNumber}} -->
									{{itm.siteCode}}
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="backButton">
				<el-button @click="colseBtn">取 消</el-button>
			</div>
		</el-card>
		
		<!-- 查询条件组 -->
		<el-card v-else>
			<el-button type="primary" size="small" @click="alsothefun">还货</el-button>
			<div class="order_item m-bottom" style="marginTop: 20px">
				<div class="item_header multipleTableHeaderBg">
				<div style="paddingLeft:12px">
					<span class="span_title">还货方-采购单号：</span><span>{{borrowCode}}</span>
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
						<ul v-for="(item, index) in andpackagedata" :key="index">
							<li style="textAlign:center;padding:6px 0px;">{{item.aogTemplateName}}</li>
							<li><span class="li_pro">{{item.borrowNumber}}</span></li>
							<li class="item_tiele textA2">
								<div class="li_detail2" v-for="(itm, idx) in item.borrowDetailsList" :key="idx">
									{{itm.dataValue}}
								</div>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="order_item m-bottom" style="marginTop: 20px">
				<div class="item_header multipleTableHeaderBg">
					<div style="paddingLeft:12px">
						<span class="span_title">收货方-采购单号：</span><span>{{lendCode}}</span>
					</div>
				</div>
			</div>
			<div class="backButton">
				<el-button @click="colseBtn">取 消</el-button>
			</div>
		</el-card>
    </div>
</template>
<script>

import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import { 
	getGooodAndPackageById,//根据借货id获取借货的商品、包
	alsoTheGoods,//还货
} from 'api/entrepotSet/borrowedmanage/index';
import {
listPackageById, // 采购单列表后的采购单明细
} from 'api/entrepotSet/scrapmanagement/index';
export default {
	components: {
		pagination,
		breadcrumb,
	},
	data() {
		return {
			navList: [],//头部面包屑
			lendingMoneyId: this.$route.query.lendingMoneyId,//借货id
			see: this.$route.query.see,//查看
			andpackagedata: [],
			borrowdata: [],
			lendata: [],
			borrowCode: "",
			lendCode: "",
			borrowId: "",
			lendId: "",
		};
	},
	mounted() {
		// 头部面包屑
		this.navList = this.$route.meta;
	},
	created() {
		// 判断是否为还货
		if(this.lendingMoneyId){
			getGooodAndPackageById({lendingMoneyId: this.lendingMoneyId}).then(res => {
				if (res.status == 200) {
					this.andpackagedata = res.data.borrowList
					this.borrowCode = res.data.borrowCode
					this.lendCode = res.data.lendCode
					this.borrowId = res.data.borrowId
					this.lendId = res.data.lendId
					if(this.$route.query.see){
						this.listPackageByIdfun(this.borrowId, 1)
						this.listPackageByIdfun(this.lendId, 2)
					}
				}
			}).catch(err => {
				console.log('换货:根据借货id获取借货的商品、包 entrepotSet/scrapmanagement/components/choseord.vue', err);
			})
		}
    },
	methods: {
		colseBtn() {
			this.$router.push({path: "/borrowedmanage/lending"})
		},
		listPackageByIdfun(val, type) {
			let data = {
				purchaseOrderId: val,
			}
			listPackageById(data).then(res => {
				if (res.status == 200) {
					console.log(res.data.packageList);
					if(type == 1){
						this.borrowdata = res.data.packageList
					}else{
						this.lendata = res.data.packageList
					}
				}
			}).catch(error => {
				console.log('报废管理:报废管理 获取采购单明细 entrepotSet/scrapmanagement/components/purchaseList.vue', error);
			});
		},
		// 还货按钮
		alsothefun(){
			alsoTheGoods({lendingMoneyId: this.lendingMoneyId}).then(res => {
				if (res.status == 200) {
					this.$message.success("还货成功");
					this.$router.push({path: "/borrowedmanage/lending"})
				}
			}).catch(err => {
				console.log('换货:根据借货id获取借货的商品、包 entrepotSet/scrapmanagement/components/choseord.vue', err);
			})
		}
	}
};
</script>
<style scoped lang='scss'>
.returndetails{
	.titlecals{
		top: 0;
	}
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
			>div{
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
				max-width: 250px;
				display: flex;
				flex-wrap: nowrap;
				>ul {
					text-align: center;
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
							text-align: center;
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
							padding: 1px;
							min-width: 150px;
						}
					}
					&:nth-of-type( n + 2 ) {
						flex: 1;
					}
				}
			}
        }
	}
	.backButton {
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
		margin-top: 20px;
	}
}
</style>

