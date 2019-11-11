<template>
    <div class="stockTable">
        <div class="btn_list_1" v-if="!disdetails">
            <el-button size="small" class="button-96" @click="addProduct">添加商品</el-button>   
            <el-button size="small" class="button-96" @click="deleteGoods">删除</el-button>
        </div>
        <!-- table表格 -->
        <div class="table_list lvs attribute m-top20 stock_table">
            <el-table border :row-key="getRowKeys" :row-class-name="tableRowClassName" 
                @selection-change="handleSelectionChange" :data="tabList" style="width: 100%;" ref="stockTable">
                <el-table-column type="selection" fixed="left" :reserve-selection="true" align="center"></el-table-column>
                <el-table-column type="index" width="55" fixed="left" align="center"></el-table-column>
                <el-table-column  width="180" prop="commodityCode" label="商品编码" sortable align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>
                            <p>{{scope.row.commodityCode}}</p>
                            <i class="many" v-if="!scope.row.orderCommodityType"></i>
                            <i class="manyStyle" v-if="!scope.row.orderCommodityType">新</i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="180" prop="commodityName" label="名称" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column width="80" prop="brand_name" label="品牌" align="center"></el-table-column>
                <el-table-column width="80" prop="category_name" label="品类" align="center" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column width="150" prop="costPrice" label="成本单价" align="center"></el-table-column>
                <el-table-column width="150" prop="minPeriod" label="采购金额" align="center"></el-table-column> -->
                <el-table-column width="130" prop="commodityModel" label="型号" align="center"></el-table-column>
                <el-table-column width="180" prop="commoditySeriesId" label="系列" align="center">
                    <template slot-scope="scope">
                        <el-select :size="size" v-model="scope.row.commoditySeriesId" placeholder="请选择系列" 
                        @change="colourmaterialseriesChange(scope.row, scope.$index)" :disabled="readonly">
                            <el-option v-for="(item,index) in scope.row.commodityseriesList" 
                                :key="index" :label="item.seriesName" :value="item.seriesId">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column width="180" prop="commodityMaterialId" label="材质" align="center">
                    <template slot-scope="scope"> 
                        <el-select :size="size" v-model="scope.row.commodityMaterialId"  placeholder="请选择材质" 
                        @change="colourmaterialseriesChange(scope.row, scope.$index)" :disabled="readonly">
                            <el-option v-for="item in scope.row.commoditymaterialList" 
                                :key="item.materialId" :label="item.materialName" :value="item.materialId">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column width="180" prop="commodityColourId" label="颜色" align="center">
                    <template slot-scope="scope">
                        <el-select :size="size" v-model="scope.row.commodityColourId"  placeholder="请选择颜色" 
                        @change="colourmaterialseriesChange(scope.row, scope.$index)" :disabled="readonly">
                            <el-option  v-for="(item,index) in scope.row.commoditycolourList" 
                                :key="index" :label="item.colourName" :value="item.colourId">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column width="120" prop="commodityUnit" label="单位" align="center"></el-table-column>
                <el-table-column width="110" prop="commodityWide" label="宽" align="center">
                    <template slot-scope="scope">
                        <el-input-number class="width-100" :controls="false" placeholder="宽" v-model="scope.row.commodityWide"
                            :precision="2" :min="0" size="mini" :disabled="readonly" @change="colourmaterialseriesChange(scope.row, scope.$index)">
                        </el-input-number>
                    </template>
                </el-table-column>
                <el-table-column width="110" prop="commodityHigh" label="高" align="center">
                    <template  slot-scope="scope">
                        <el-input-number class="width-100" :controls="false"  placeholder="高" v-model="scope.row.commodityHigh"
                            :precision="2":min="0"size="mini" :disabled="readonly" @change="colourmaterialseriesChange(scope.row, scope.$index)">
                        </el-input-number>
                    </template>
                </el-table-column>
                <el-table-column width="110" prop="commodityLong" label="深" align="center">
                    <template slot-scope="scope">
                        <el-input-number class="width-100" :controls="false"  placeholder="深" v-model="scope.row.commodityLong"
                            :precision="2" :min="0" :disabled="readonly" size="mini" @change="colourmaterialseriesChange(scope.row, scope.$index)">
                        </el-input-number>
                    </template>
                </el-table-column>
                <el-table-column width="110" prop="commodityThick" label="厚" align="center">
                    <template  slot-scope="scope">
                        <el-input-number class="width-100" :controls="false"  placeholder="厚" v-model="scope.row.commodityThick"
                            :precision="2" :min="0" :disabled="readonly" size="mini" @change="colourmaterialseriesChange(scope.row, scope.$index)">
                        </el-input-number>
                    </template>
                </el-table-column>
                <el-table-column width="110" prop="purchaseNumber" label="数量" align="center">
                    <template  slot-scope="scope">
                        <el-input-number class="width-100" :controls="false" placeholder="数量" @change="pricefun" v-model="scope.row.purchaseNumber"
                            :precision="0" :min="1" :disabled="readonly" size="mini">
                        </el-input-number>
                    </template>
                </el-table-column>
            </el-table>    
        </div>
        
        <!-- 分页 -->
        <!-- <div class="pagination_wrap">
            <pagination
                :current-page="currentPage"
                :pageSize="pageSize"
                :total="total"
                @sizeChange="sizeChange"
                @currentChange="currentChange">
            </pagination>
        </div> -->
        <el-dialog title="商品列表"   custom-class="customDialogTitle" :visible.sync="productDialog" width="1024px" top="2vh" class="lvs">
            <select-commodity @selectionChange="selectionChange" ref="selectedCommodities" :select-list="productList" v-if="productDialog"></select-commodity>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="selectProductConfirm">确定</el-button>
                <el-button  @click="productDialog = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import spot from "@/assets/images/spot.png";
import selectCommodity from '@/views/components/selectCommodity'
import { 
    listCommodityColour, // 商品颜色查询
    listCommoditySeries, // 商品系列查询
    listCommodityMaterial, // 商品材质查询
} from 'api/administrationCenter/stockmanagement/index';

import { getOrderCommodityInfo,getPurchaseOrder } from 'api/order/order/order';
//获取商品skuid
import { getGoodsSKUId } from "api/entrepotSet/stockManagement/stockPending/stockPending";
export default {
    props:{
        disdetails:{
            default:false
        },
        purchaseOrderCommodityVOList:{
            default:[]
        }
    },
    components: {
       selectCommodity
    },
    data() {
        return {
            size: "small",// 表格数据
            elsectVal: [], // 表格选中的数据
            depositArr:[],
            tabList:[], // 表格数据
            currentPage: 1,
            pageSize: 20,
            total: 10,
            isAudit: false,
            // 商品
            productDialog: false,
            productList: {
                brandList: [], // 品牌数组 可不传（不传默认为全部品牌）
                categoryList: [], // 品类数组 可不传（不传默认为全部品类）
                selectedCommodities: [], // 选中的商品 可不传 即 已有的table中的商品
                height: '350px', // 设置表格高度 可不传（弹出层最好传下）
                isDialog: true // 是否为弹出层（不传默认为页面）
            },
            selectedProducts: [], // 选择商品
            readonly: false, // 是否只读
            prcie: 0,
            index:0
        };
    },
    created() {
        let data = {
            page: this.currentPage,
            limit: this.pageSize,
        };
        this.getList(data);
        if(this.$route.query.orderType) { // 查看备货申请 修改备货申请
            this.getStockUpApply(); // 回显信息
        }
        if(this.$route.path == "/stockmanagement/viewstockpurchase" || this.$route.path == "/stockmanagement/auditstock") {
            this.readonly = true;
        }
        // if(this.purchaseOrderCommodityVOList||this.purchaseOrderCommodityVOList.length!=0){
        //     this.tabList = this.purchaseOrderCommodityVOList
        // }
        
    },
    computed: {
        commodityIds() {
            let arr = [];
            this.tabList.forEach(item => {
                arr.push(item.commodityId);
            })
            return arr;
        }
    },
    methods: {
        getData(purchaseOrderId,index){
            this.index = index;
            getPurchaseOrder({purchaseOrderId}).then(res=>{
                if(res.status == 200){
                    let arr = []
                    res.data.orderCommodity.forEach(item=>{
                        item.products.forEach(attr=>{
                            arr.push(attr)
                        })
                    })
                    if(!this.depositArr[index]){
                        this.depositArr[index] = {list:[]};
                        this.selectedProducts = arr;
                        this.selectProductConfirm()
                    }
                }
            }).catch(error=>{
                console.error('采购单明细',error);
            })
        },
        //颜色系列材质改变
        colourmaterialseriesChange(row, index) {
            console.log(index);
            let obj = {
                commodityColourId: row.commodityColourId || "",//颜色
                commodityMaterialId: row.commodityMaterialId || "",//材质
                commoditySeriesId: row.commoditySeriesId || "",//系列
                commodityWide: row.commodityWide,//宽
                commodityHigh: row.commodityHigh,//高
                commodityLong: row.commodityLong,//深
                commodityThick: row.commodityThick,//厚
                commodityId: row.commodityId//商品id
            };
            getGoodsSKUId(obj).then(res => {
                if(res.status == 200 && res.data) {
                    // obj.commoditySKUId = res.data.commoditySKUId
                    this.tabList[index].commoditySkuId = res.data.commoditySKUId
                    console.log(res.data.commoditySKUId);
                }
            });
        },
        getRowKeys(row) {
            return row.commodityId;
        },
        // 点击添加商品
        addProduct() {
            console.log(this.elsectVal);
            if(this.elsectVal.length > 0) {
                this.$message.warning("请勿选择商品");
                return;
            }
            this.productDialog = true;
            this.productList.selectedCommodities = this.commodityIds;
        },
        // 选择商品 复选框
        selectionChange(val) {
            this.selectedProducts = val;
        },
        // 选择商品
        selectProductConfirm() {
            if (this.selectedProducts.length) {
                this.selectedProducts.forEach(item => {
                    let data = {
                        commodityId: item.commodityId ? item.commodityId : ''
                    };
                    let p1 = new Promise((resolve, reject) => {
                        listCommodityColour(data).then(attr => {
                            resolve(attr);
                        });
                    });
                    let p2 = new Promise((resolve, reject) => {
                        listCommoditySeries(data).then(attr => {
                            resolve(attr);
                        });
                    });
                    let p3 = new Promise((resolve, reject) => {
                        listCommodityMaterial(data).then(attr => {
                            resolve(attr);
                        });
                    });
                    Promise.all([p1, p2, p3]).then(res => {
                        this.depositArr[this.index]['list'].push({
                            inventoryNumber: 0,
                            commoditycolourList: res[0].data,
                            commodityseriesList: res[1].data,
                            commoditymaterialList: res[2].data,
                            ...item,
                            commodityColourId:res[0].data[0]?res[0].data[0].colourId:'',//默认颜色
                            commoditySeriesId:res[1].data[0]?res[1].data[0].seriesId:'',//默认系列
                            commodityMaterialId:res[2].data[0]?res[2].data[0].materialId:''//默认材质
                        });
                        this.tabList = this.depositArr[this.index]['list']
                        this.pricefun()
                    });
                    item.purchaseNumber = 1;
                    console.log(this.tabList,"this.tabList 563454");
                })
                this.productDialog = false;
            } else {
                this.$message.warning('请选择商品');
            }
        },
        pricefun(){
            this.prcie = 0
            this.tabList.forEach(item =>{
                this.prcie = item.costPrice*item.purchaseNumber + this.prcie
            })
            this.$emit("getprice", this.prcie)
        },
        // 商品颜色查询
        listCommodityColour(item) {
            let data = {
                commodityId: item.commodityId,
            }
            listCommodityColour(data).then(res => {
                if(res.status == 200) {
                    item.commoditycolourList = res.data;
                }
            }).catch(err => {
                console.log('备货采购申请管理 备货管理 新增备货申请 商品颜色查询 views/administrationCenter/stockmanagement/stockpurchase/stockpurchase', err);
            })
        },
        // 商品系列查询
        listCommoditySeries(item) {
            let data = {
                commodityId: item.commodityId,
            }
            listCommoditySeries(data).then(res => {
                if(res.status == 200) {
                    item.commodityseriesList = res.data;
                }
            }).catch(err => {
                console.log('备货采购申请管理 备货管理 新增备货申请 商品系列查询 views/administrationCenter/stockmanagement/stockpurchase/stockpurchase', err);
            })
        },
        // 商品材质查询
        listCommodityMaterial(item) {
            let data = {
                commodityId: item.commodityId,
            }
            listCommodityMaterial(data).then(res => {
                if(res.status == 200) {
                    item.commoditymaterialList =  res.data;
                }
            }).catch(err => {
                console.log('备货采购申请管理 备货管理 新增备货申请 商品材质查询 views/administrationCenter/stockmanagement/stockpurchase/stockpurchase', err);
            })
        },
        // 删除
        deleteGoods() {
            if(this.elsectVal && this.elsectVal.length < 1) {
                this.$message.warning("抱歉，请进行选择");
                return;
            }
            this.elsectVal.forEach(item => {
                this.tabList = this.tabList.filter(itm => {
                    return item.commodityId != itm.commodityId
                })
            })
            this.pricefun()
            this.$refs.stockTable.clearSelection()
        },

        // 修改 and 查看备货申请 and 备货审核 回显信息
        getStockUpApply() {
            console.log("yunxinglema  ***mama");
            let data = {
                orderId: this.$route.query.orderId
            }
            getOrderCommodityInfo(data).then(res => {
                if (res.status == 200) {
                    let viewstockObj = res.data.orderCommodityVOList;
                    console.log("执行了",viewstockObj,"viewstockObj");
                    viewstockObj.forEach(item => {
                        let data = {
                            commodityId: item.commodityId ? item.commodityId : ''
                        };
                        console.log(item);
                        if(item.commodityId != '') {
                            let p1 = new Promise((resolve, reject) => {
                                listCommodityColour(item).then(attr => {
                                    resolve(attr);
                                });
                            });
                            let p2 = new Promise((resolve, reject) => {
                                listCommoditySeries(item).then(attr => {
                                    resolve(attr);
                                });
                            });
                            let p3 = new Promise((resolve, reject) => {
                                listCommodityMaterial(item).then(attr => {
                                    resolve(attr);
                                });
                            });
                            Promise.all([p1, p2, p3]).then(res => {
                                this.tabList.push({
                                    commodityWide: item.width,//宽
                                    commodityHigh: item.high,//高
                                    commodityLong: item.deep,//深
                                    commodityThick: item.thick,//厚
                                    commodityColourId: item.colourId,//颜色id
                                    commoditySeriesId: item.seriesId,//系列Id
                                    commodityMaterialId: item.materialId,//材质Id
                                    brand_name: item.branName,//品牌
                                    purchaseNumber: item.amount,//数量
                                    inventoryNumber: 0,
                                    commoditycolourList: res[0].data,
                                    commodityseriesList: res[1].data,
                                    commoditymaterialList: res[2].data,
                                    ...item
                                });
                            });
                        }
                    })
                }
            }).catch(error => {
                console.log("回显遗留单补货单 views/stockmanagement/stockpurchase/components/stockTable",error);
            });
        },
        // 表格选中
        handleSelectionChange(val){
            this.elsectVal = val;

            console.log(this.elsectVal,"elsectVal");
        },
        // 获取表格数据
		getList(data){
            // listOrder(data).then(res =>{
            //     console.log(res);
            //     if(res.status == 200){
            //         this.total = res.data.total;
            //         this.tabList = res.data.rows;
            //     }
            // }).catch(error =>{
            //     console.log('订单管理:订单列表 order/order/order.vue', error);
            // })
        },
        //表格斑马线设置
		tableRowClassName({row, rowIndex}) {
			return rowIndex%2 != 0 ? 'el-f0' : '';
		},

    }
};
</script>
<style scoped lang='scss'>
        .stockTable{
            .statusStyle {
                position: relative;
            }
            .manyStyle {
                position: absolute;
                right: 7px;
                top: 3px;
                color: #fff;
                width: 20px;
                height: 20px;
                font-size: 15px;
                font-style: normal;
                font-family: "宋体";
            }
            .many {
                position: absolute;
                right: 10px;
                top: 4px;
                display: block;
                width: 14px;
                height: 23px;
                background-color: #00479d;
            }
            .many:before {
                content: "";
                display: block;
                position: absolute;
                width: 0;
                height: 0;
                right: 14px;
                border-width: 11px 7px;
                border-style: solid;
                border-color: transparent #00479d transparent transparent;
            }

            .many:after {
                content: "";
                display: block;
                position: absolute;
                width: 0;
                height: 0;
                left: 14px;
                border-width: 11px 7px;
                border-style: solid;
                border-color: transparent transparent transparent #00479d;
                top: 0;
            }
            // margin-top: 20px;
            .stock_table {
                tr {
                    div.cell {
                        div.el-select--small{
                            box-sizing: border-box;
                            height: 23px;
                            .el-input__suffix{
                                display: none;
                            }
                        }
                        div.el-input-number {
                            box-sizing: border-box;
                            height: 23px;
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
            // border: 1px solid red;
        }
</style>
<style lang="scss">
    .stockTable{
        .stock_table {
            .el-input__inner {
                height: 23px;
                line-height: 23px;
                border: 0px;
                appearance: none;
                background: transparent;
            }
            .el-input__suffix {
                display: none;
            }
            tr {
                div.cell {
                    div.el-select--small{
                        box-sizing: border-box;
                        height: 23px;
                        div.el-input--suffix{
                            box-sizing: border-box;
                            height: 23px;
                            .el-input__inner{
                                box-sizing: border-box;
                                height: 23px;
                                border: 0;
                                appearance: none;
                                // background: #f0f5f9;
                            }
                            span.el-input__suffix {
                                display: none;
                            }
                        }
                    }
                    div.el-input--small{
                        box-sizing: border-box;
                        height: 23px;   
                        .el-input__inner{
                            box-sizing: border-box;
                            height: 23px;
                            border: 0;
                            appearance: none;
                            // background: #f0f5f9;
                        }
                    }
                    div.el-input-number {
                        box-sizing: border-box;
                        height: 23px;
                    }
                }
                &.el-f0 {
                    div.cell {
                        div.el-select--small{
                            div.el-input--suffix{
                                .el-input__inner{
                                    background: #f0f5f9;
                                }
                            }
                        }
                        div.el-input--small{
                            .el-input__inner{
                                background: #f0f5f9;
                            }
                        }
                        div.el-input-number {
                            box-sizing: border-box;
                            height: 23px;
                            background: #f0f5f9;
                        }
                    }
                }
            }
            .el-table--enable-row-hover .el-table__body tr:hover>td {
                div.el-select--small{
                    div.el-input--suffix{
                        .el-input__inner{
                            transition: background-color .25s ease;
                            background-color: #F5F7FA;
                        }
                    }
                }
                div.el-input--small{
                    .el-input__inner{
                        transition: background-color .25s ease;
                        background-color: #F5F7FA;
                    }
                }
            }
        }
    }
</style>


