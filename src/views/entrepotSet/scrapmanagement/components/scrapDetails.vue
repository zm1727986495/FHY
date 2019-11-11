<template>
 
        <el-dialog title="报废详情"  custom-class="customDialogTitle" :visible.sync="visible"  width="50%" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
         
            <div class="warp_head_list">
                <div class="orderbox">
					<ul class="orderlsit">
						<li>报废单号</li>
                        <el-tooltip class="item" effect="dark" :content="scrapDetail.scrapApplyCode" placement="top">
                            <li>{{scrapDetail.scrapApplyCode}}</li>
                        </el-tooltip>
						<li>报废类型</li>
						<li>{{scrapApplyType}}</li>
					</ul>
					<ul class="orderlsit">
						<li>申报人</li>
						<li>{{scrapDetail.scrapApplyUser}}</li>
						<li>申报时间</li>
                        <el-tooltip class="item" effect="dark" :content="scrapDetail.scrapApplyTime" placement="top">
                            <li>{{scrapDetail.scrapApplyTime}}</li>
                        </el-tooltip>
                        <li>创建人</li>
						<li>{{scrapDetail.userName}}</li>
					</ul>
					<ul class="orderlsit">
						<li>报废备注</li>
                        <el-tooltip class="item" effect="dark" :content="scrapDetail.remark" placement="top">
                            <li>{{scrapDetail.remark}}</li>
                        </el-tooltip>
					</ul>
				</div>
               

                <div class="scrapPhoto" v-if="photoLists && photoLists.length !=0">
                    <span>照片</span>
                    <div class="photos">
                        <ul class="photoslist">
                            <li v-for="item in photoLists" :key="item.id">
                                <img :src="item" alt="">
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 包 -->
                <div class="scrapTable"  v-if="templateList && templateList.length != 0">
                    <span>报废货物列表</span>
                    <div  class="table_list lvs">
                        <el-table
                            border
                            :row-class-name="tableRowClassName" 
                            ref="multipleTable"
                            :data="templateList"
                            tooltip-effect="dark"
                            style="width: 100%">

                            <el-table-column label="采购单号" show-overflow-tooltip  prop="purchaseNumber" sortable  align="center" width="180"></el-table-column>
                            <el-table-column label="列项名称" show-overflow-tooltip  prop="aogTemplateName" sortable  align="center" width="180"></el-table-column>
                            <el-table-column label="报废数量" show-overflow-tooltip  prop="inventoryNumber" sortable  align="center" width="180"></el-table-column>
                            <el-table-column label="仓库名称" show-overflow-tooltip  prop="storageName" sortable  align="center" width="180"></el-table-column>
                            <el-table-column label="货区名称" show-overflow-tooltip  prop="regionName" sortable  align="center" width="180"></el-table-column>
                            <el-table-column label="货位编号" show-overflow-tooltip  prop="siteCode" sortable  align="center" width="180"></el-table-column>
                            <!-- <el-table-column label="组装好的数据" show-overflow-tooltip  prop="resultData" sortable  align="center" width="180"></el-table-column> -->

                            <!-- <el-table-column
                                label="商品名称" show-overflow-tooltip 
                                prop="aogTemplateName" sortable align="center" width="160">
                            </el-table-column>

                            <el-table-column
                                label="数量"
                                prop="inventoryNumber" sortable  align="center" width="180">
                            </el-table-column>

                            

                            <el-table-column
                                label="订单号" show-overflow-tooltip 
                                prop="name" sortable  align="center" width="180">
                            </el-table-column>

                            <el-table-column
                                label="货位" show-overflow-tooltip 
                                prop="regionName" sortable  align="center" width="180">
                            </el-table-column>
                            
                            <el-table-column
                                label="备注" show-overflow-tooltip 
                                prop="remark" sortable  align="center" width="180">
                            </el-table-column> -->
                        </el-table>
                    </div>
                    <!-- <div class="pagination_wrap">
                        <pagination
                            :current-page="currentPage"
                            :pageSize="pageSize"
                            :total="total"
                            @sizeChange="sizeChange"
                            @currentChange="currentChange">
                        </pagination>
                    </div> -->
                </div>
                <!-- 商品 -->
                <div class="scrapTable" v-if="goodsList && goodsList.length != 0">
                    <span>报废货物列表</span>
                    <div  class="table_list lvs">
                        <el-table
                            border
                            :row-class-name="tableRowClassName" 
                            ref="multipleTable"
                            :data="goodsList"
                            tooltip-effect="dark"
                            style="width: 100%">

                            
                            <el-table-column
                                label="商品名称" show-overflow-tooltip 
                                prop="commodityName" sortable align="center" width="160">
                            </el-table-column>

                            <el-table-column
                                label="数量"
                                prop="inventoryNumber" sortable  align="center" width="180">
                            </el-table-column>
                            
                            <el-table-column
                                label="商品编码"
                                prop="commodityCode" sortable  align="center" width="180">
                            </el-table-column>

                            <el-table-column
                                label="商品型号" show-overflow-tooltip 
                                prop="commodityModel" sortable  align="center" width="180">
                            </el-table-column>

                            <el-table-column
                                label="商品品牌" show-overflow-tooltip 
                                prop="brandName" sortable  align="center" width="180">
                            </el-table-column>

                            <el-table-column
                                label="商品分类" show-overflow-tooltip 
                                prop="classifyName" sortable  align="center" width="180">
                            </el-table-column>
                            
                            <el-table-column
                                label="商品品类" show-overflow-tooltip 
                                prop="categoryName" sortable  align="center" width="180">
                            </el-table-column>
                            
                            <el-table-column
                                label="商品材质" show-overflow-tooltip 
                                prop="materialName" sortable  align="center" width="180">
                            </el-table-column>
                            
                            <el-table-column
                                label="商品颜色" show-overflow-tooltip 
                                prop="colourName" sortable  align="center" width="180">
                            </el-table-column>

                            <el-table-column
                                label="采购单号" show-overflow-tooltip 
                                prop="purchaseNumber" sortable  align="center" width="180">
                            </el-table-column>

                            <el-table-column
                                label="订单号" show-overflow-tooltip 
                                prop="name" sortable  align="center" width="180">
                            </el-table-column>

                            <el-table-column
                                prop="regionName"
                                label="货区"
                                width="240" sortable align="center">
                            </el-table-column>

                            <el-table-column
                                prop="siteCode"
                                label="货位" show-overflow-tooltip
                                width="240" sortable align="center">
                            </el-table-column>

                            <!-- <el-table-column
                                label="货位" show-overflow-tooltip 
                                prop="regionName" sortable  align="center" width="180">
                            </el-table-column> -->
                            
                            <el-table-column
                                label="备注" show-overflow-tooltip 
                                prop="remark" sortable  align="center" width="180">
                            </el-table-column>

                            
                        </el-table>
                    </div>
                    <!-- <div class="pagination_wrap">
                        <pagination
                            :current-page="currentPage"
                            :pageSize="pageSize"
                            :total="total"
                            @sizeChange="sizeChange"
                            @currentChange="currentChange">
                        </pagination>
                    </div> -->
                </div>

            </div>  
           

            <span slot="footer" class="dialog-footer">
                <el-button @click="colseBtn">取 消</el-button>
            </span>
        </el-dialog>

</template>

<script>
import pagination from "@/views/components/pagination";

import {
    addCommodityInPriceStrategy,
    getById, // 根据报废申请id获取报废申请详情
    getGoodsAndPackage, // 根据报废申请id获取报废的商品、包
} from 'api/entrepotSet/scrapmanagement/index';

export default {
    name: 'scrapDetails',

	components: {
		pagination,
    },

    computed: {
        scrapApplyType(){
            let scrapApplyType = '';
            if(Number(this.scrapDetail.scrapApplyType) == 1) {
                scrapApplyType =  "盘点报废";
            }else if(Number(this.scrapDetail.scrapApplyType) == 2) {
                scrapApplyType =  "手动报废";
            }else if(Number(this.scrapDetail.scrapApplyType) == 3) {
                scrapApplyType =  "维修报废";
            }else if(Number(this.scrapDetail.scrapApplyType) == 4) {
                scrapApplyType =  "入库报废";
            }
           
            return scrapApplyType;
        }
    },

    props: {
        // 报废列表id
        scrapApplyId: {
            type: String,
            default() {
                return '';
            }
        },
    },

    created() {
        this.getById(); // 根据报废申请id获取报废申请详情
        this.getGoodsAndPackage(); // 根据报废申请id获取报废的商品、包
    },

    data() {
        return {

            scrapDetail: {}, // 报废申请详情
            goodsList: [],  // 报废申请详情 -- 商品
            templateList: [], // 报废申请详情 -- 货品
            // 分页
            currentPage: 1,//当前页数
            pageSize: 20,//当前页最大条数
            total: 0,//总条数
            

            photoLists: [], // 照片
            tabList: [],
            visible: true,
        }
    },
  
    methods: {
    
        // 根据报废申请id获取报废申请详情
        getById() {
            let data = {
                scrapApplyId: Number(this.scrapApplyId),
            }

            getById(data).then(res => {
                if(res.status == 200) {
                    this.scrapDetail = res.data;
                    this.photoLists = this.scrapDetail.fileUrlList;
                }
            }).catch(err =>{
               console.log('报废管理:报废管理 报废详情 entrepotSet/scrapmanagement/components/scrapDetails.vue', err);
            })
        },
        // 根据报废申请id获取报废申请表格
        getGoodsAndPackage() {
            let data = {
                scrapApplyId: Number(this.scrapApplyId),
            }
            getGoodsAndPackage(data).then(res => {
                if(res.status == 200) {
                    if(res.data.goodsList && res.data.goodsList.length != 0) {
                        this.goodsList = res.data.goodsList;
                    }else if(res.data.templateList && res.data.templateList.length != 0) {
                        this.templateList = res.data.templateList;
                    }
                }
            }).catch(err =>{
               console.log('报废管理:报废管理 报废详情表格 entrepotSet/scrapmanagement/components/scrapDetails.vue', err);
            })
        },
        

        colseBtn(){
            this.$emit( "close-change");
        },

        // 获取表格数据
		getList(data){
            // listOrder(data).then(res =>{
            //     console.log(res);
            //     if(res.status == 200){
            //         this.total = res.data.total;
            //         this.scrapData = res.data.rows;
            //     }
            // }).catch(error =>{
            //     console.log('订单管理:订单列表 order/order/order.vue', error);
            // })
        },
        
        // currentChange(val) {//翻页方法
        //     this.currentPage = val;
        //     // this.getList();
        // },
        // sizeChange(val) {//翻页方法
        //     this.currentPage = 1;

        //     this.pageSize = val;
        //     //   this.getList();
        // },
        // 表格行样式
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
    

  },
};
</script>
<style scoped lang="scss">
    .orderbox{
		width: 100%;
		font-size: 14px;
		border-top: 1px solid #e4e4e4;
		border-left: 1px solid #e4e4e4;
		.orderlsit{
			display: flex;
			li{
				padding: 0px 10px;
				display: flex;
				align-items: center;
				border-right: 1px solid #e4e4e4;
				border-bottom: 1px solid #e4e4e4;
				line-height: 2.2;
				&:nth-child(odd){
					width: 120px;
					text-align: center;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
				&:nth-child(even){
					flex: 1;
					color: #999;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					display: block;
				}
			}
		}
	}

 

        .warp_head_list{
            flex-wrap: wrap;
            .scrapdetails{
                // margin-top: 20px;
                padding-left: 25px;
                /* border: 1px solid rgba(228, 228, 228, 1); */
                border-radius: 2px;  
                .scraplist{
                    display: flex;
                    // justify-content: space-between;
                    flex-wrap: wrap;
                    font-size: 14px;
                    color: #333333;
                    .remarks {
                        width: 100%;
                    }
                }
                .scraplist li {
                    width: 25%;
                    line-height: 30px;
                }
            }
            .scrapPhoto {
                margin-top : 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-wrap: nowrap;
                > span {
                    width: 60px;
                    margin-left: 35px;
                }
                .photos {
                    .photoslist {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                        align-items: center;
                        li {
                            width: 150px;
                            height: 150px;
                            margin-left: 16px;
                            margin-bottom: 6px;
                            img {
                                width: 100%;
                                height: 100%;
                                display: inline-block;
                                
                            }
                        }
                        
                    }
                    
                }
            }

            .scrapTable {
                width:100%;
                >span {
                    display: block;
                    padding: 20px;
                }
                .table_list{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }

             .examNote {
                display: flex;
                justify-content: flex;
                align-items: center;
                padding:20px 0px;
            }

        }
 
</style>


