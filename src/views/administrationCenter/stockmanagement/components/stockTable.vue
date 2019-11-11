<template>
    <div class="stockTable">
        <div class="btn_list_1" v-if="!isView">
            <el-button size="small" class="button-96" @click="addProduct">添加商品</el-button>   
            <el-button size="small" class="button-96" @click="deleteGoods">删除</el-button>
        </div>
        <el-dialog title="商品列表"   custom-class="customDialogTitle" :visible.sync="productDialog" width="1024px" top="2vh" class="lvs">
            <select-commodity @selectionChange="selectionChange" ref="selectedCommodities" :select-list="productList" v-if="productDialog"></select-commodity>
            
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="selectProductConfirm">确定</el-button>
                <el-button  @click="productDialog = false">取消</el-button>
            </div>
        </el-dialog>
        <!-- table表格 -->
        <div class="table_list lvs attribute m-top20 stock_table">
            <el-table 
                border   :row-key="getRowKeys"
                :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange"
                :data="tabList"
                style="width: 100%;" ref="stockTable">
                <el-table-column type="selection" width="55"  :reserve-selection="true" fixed="left"></el-table-column>
                <el-table-column type="index" width="55" fixed="left"></el-table-column>
                <el-table-column width="180" prop="commodityCode" label="商品编码" sortable align="center" fixed="left"></el-table-column>
                <el-table-column width="180" prop="purchaseNumber"  label="数量" sortable align="center">
                    <template  slot-scope="scope">
                        <el-input-number
                            class="width-100"
                            :controls="false"  placeholder="数量"
                            v-model="scope.row.purchaseNumber"
                            :precision="0"
                            :min="1" :disabled="readonly"
                            size="mini"
                        ></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column width="180" prop="commodityName" label="名称" show-overflow-tooltip sortable align="center"></el-table-column>
                <el-table-column width="180" prop="brand_name" label="品牌" sortable align="center"></el-table-column>
                <el-table-column width="180" prop="category_name" label="品类" sortable align="center"></el-table-column>
                <el-table-column width="180" prop="classifyName" label="分类" align="center" sortable show-overflow-tooltip></el-table-column>
                <!-- <el-table-column width="180" prop="commodityModel" label="型号" sortable align="center"></el-table-column> -->
                <el-table-column width="180" prop="commodityNumber" label="货号" align="center" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="commodityModel" label="规格" align="center" width="180" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="costPrice" label="成本单价" width="180" align="center" sortable></el-table-column>
                <el-table-column width="180" prop="commoditySeriesId" label="系列" sortable align="center">
                    <template  slot-scope="scope">
                        <el-select :size="size" v-model="scope.row.commoditySeriesId"  placeholder="请选择系列" :disabled="readonly">
                            <el-option 
                                v-for="(item,index) in scope.row.commodityseriesList" 
                                :key="index" 
                                :label="item.seriesName" :value="item.seriesId">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column  width="180" prop="commodityMaterialId" label="材质" sortable align="center">
                    <template  slot-scope="scope"> 
                        <el-select :size="size" v-model="scope.row.commodityMaterialId"  placeholder="请选择材质"  :disabled="readonly">
                            <el-option 
                                v-for="item in scope.row.commoditymaterialList" 
                                :key="item.materialId" 
                                :label="item.materialName" :value="item.materialId">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column width="180" prop="commodityColourId" label="颜色" sortable align="center">
                    <template  slot-scope="scope">
                        <el-select :size="size" v-model="scope.row.commodityColourId"  placeholder="请选择颜色" :disabled="readonly">
                            <el-option  
                                v-for="(item,index) in scope.row.commoditycolourList" 
                                :key="index" 
                                :label="item.colourName" :value="item.colourId">
                            </el-option>
                        </el-select>

                        <!-- <p v-else>{scope.row.colourName}</p> -->
                    </template>
                </el-table-column>
                <el-table-column width="180" prop="commodityUnit" label="单位" sortable align="center"></el-table-column>
                <!-- <el-table-column
                    width="180" prop="commodityWide"
                    label="宽"
                    sortable align="center">
                    <template  slot-scope="scope">
                        <el-input-number
                            class="width-100"
                            :controls="false"  placeholder="深"
                            v-model="scope.row.commodityWide"
                            :precision="2"
                            :min="0"
                            size="mini" :disabled="readonly"
                        ></el-input-number>
                    </template>
                </el-table-column>

                <el-table-column
                    width="180" prop="commodityHigh"
                    label="高"
                    sortable align="center">
                    <template  slot-scope="scope">
                        <el-input-number
                            class="width-100"
                            :controls="false"  placeholder="深"
                            v-model="scope.row.commodityHigh"
                            :precision="2"
                            :min="0"
                            size="mini" :disabled="readonly"
                        ></el-input-number>
                    </template>
                </el-table-column>

                <el-table-column
                    width="180" prop="commodityLong"
                    label="深"
                    sortable align="center">
                    <template  slot-scope="scope">
                        <el-input-number
                            class="width-100"
                            :controls="false"  placeholder="深"
                            v-model="scope.row.commodityLong"
                            :precision="2"
                            :min="0" :disabled="readonly"
                            size="mini"
                        ></el-input-number>
                    </template>
                </el-table-column>

                <el-table-column
                    width="180" prop="commodityThick"
                    label="厚"
                    sortable align="center">
                    <template  slot-scope="scope">
                        <el-input-number
                            class="width-100"
                            :controls="false"  placeholder="厚"
                            v-model="scope.row.commodityThick"
                            :precision="2"
                            :min="0" :disabled="readonly"
                            size="mini"
                        ></el-input-number>
                    </template>
                </el-table-column> -->


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


    </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import selectCommodity from '@/views/components/selectCommodity'

import { 
    listCommodityColour, // 商品颜色查询
    listCommoditySeries, // 商品系列查询
    listCommodityMaterial, // 商品材质查询
} from 'api/administrationCenter/stockmanagement/index';

import {
    getStockUpApply, // 回显备货申请信息
} from 'api/administrationCenter/stockmanagement/index';


export default {
    components: {
       pagination,
       selectCommodity
    },
    props: ["brandId","commodityCategoryId","companyId"],
    // name: 'stockTable',
    data() {
        return {
            size: "small",
            // 表格数据
            elsectVal: [], // 表格选中的数据
            tabList:[], // 表格数据
            num: '',
            // 分页
            currentPage: 1,
            pageSize: 20,
            total: 0,
            isAudit: false,
            isView: false,
            // 下拉框数据
            // commoditycolourList: [], // 商品颜色
            // commodityseriesList: [], // 商品系列
            // commoditymaterialList: [], // 商品材质

            // 商品
            productDialog: false,
            productList: {
                brandList: [], // 品牌数组 可不传（不传默认为全部品牌）
                categoryList: [], // 品类数组 可不传（不传默认为全部品类）
                selectedCommodities: [], // 选中的商品 可不传 即 已有的table中的商品
                height: '350px', // 设置表格高度 可不传（弹出层最好传下）
                isDialog: true, // 是否为弹出层（不传默认为页面）
                brandId: 0,
                commodityCategoryId: 0,
                disabled: true,
                companydisabled:  true, // 供应商
                companyId: 0,
                goodsType: 1// 货品类型： 1成品 2定制品
            },
            selectedProducts: [], // 选择商品
            readonly: false, // 是否只读
        };
    },

    mounted() {
       
    },
    created() {

        if(this.$route.path == "/stockmanagement/viewstockpurchase" || this.$route.path == "/stockmanagement/editstockpurchase" || this.$route.path == "/stockmanagement/auditstock") { // 查看备货申请 修改备货申请
            this.getStockUpApply(); // 回显信息
        }
       
        if(this.$route.path == "/stockmanagement/viewstockpurchase" || this.$route.path == "/stockmanagement/auditstock") {
            this.isView = true;
            this.readonly = true;
        }
        // if(this.$route.path == "/stockmanagement/auditstock") {
        //     this.isAudit = true;
        // }
        // this.listCommodityColour(); // 商品颜色查询
        // this.listCommoditySeries(); // 商品系列查询
        // this.listCommodityMaterial(); // 商品材质查询

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
        getRowKeys(row) {
            return row.commodityId;
        },
        // 点击添加商品
        addProduct() {
            // if(this.isExit && this.tabList && this.tabList.length != 0) { // 删除列表数据
            //     this.$confirm('是否确定删除列表数据?', '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(() => {
            //         this.tabList = [];

            //     }).catch(() => {
            //         this.$message({
            //             type: 'info',
            //             message: '已取消删除'
            //         }); 
            //     });    
            // }
            
            if(this.brandId && this.commodityCategoryId && this.companyId) {
                this.productList.brandId =  this.brandId; // 品牌
                this.productList.commodityCategoryId = this.commodityCategoryId; // 品类
                this.productList.companyId = this.companyId; // 供应商
            }else {
                this.$message.warning("请选择品牌品类供应商");
                return;
            }

            if(this.elsectVal.length > 0) {
                this.$message({
                    message: '请勿选择商品',
                    type: 'warning'
                });
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
               
                // console.log(this.selectedProducts,this.tabList,"this.tabList 8888888899");
                new Promise((resolve, reject) => {
                    // getUUID({ serialNumber: "GD" }).then(res => {
                    //     resolve(res);
                    // });
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
                            if(!item.costPrice) {
                                item.costPrice = 0;
                            }
                            item.costing = item.costPrice;
                            // 颜色 
                            if(res[0].data && res[0].data.length != 0 && (!item.commodityColourId)) {
                                item.commodityColourId = res[0].data[0].colourId
                            }
                            // 材质
                            if(res[2].data && res[2].data.length != 0 && (!item.commodityMaterialId)) {
                                item.commodityMaterialId = res[2].data[0].materialId
                            }
                            // 系列
                            if(res[1].data && res[1].data.length != 0 && (!item.commoditySeriesId)) {
                                item.commoditySeriesId = res[1].data[0].seriesId
                            }

                            this.tabList.push({
                                inventoryNumber: 0,
                                commoditycolourList: res[0].data,
                                commodityseriesList: res[1].data,
                                commoditymaterialList: res[2].data,
                                ...item
                            });
                        });
                        // item.purchaseNumber = '';
                    })
                    resolve( this.tabList );

                }).then(res => {
                    console.log(res,Array.isArray(res),res.length,"wai22222222");
                    let storTable = res;
                    console.log(storTable,Array.isArray(storTable),res.length,storTable.length,"wai22222222");
                    

                    for (let index = 0; index < res.length; index++) {
                        console.log(2345256662);
                        
                        // 颜色
                        if(res[index].commoditycolourList && res[index].commoditycolourList.length != 0 && (!res[index].commodityColourId)) {
                            res[index].commodityColourId = res[index].commoditycolourList[0].colourId
                        }
                        // 材质
                        if(res[index].commoditymaterialList && res[index].commoditymaterialList.length != 0 && (!res[index].commodityMaterialId)) {
                            res[index].commodityMaterialId = res[index].commoditymaterialList[0].materialId
                        }
                        // 系列
                        if(res[index].commoditymaterialList && res[index].commoditymaterialList.length != 0 && (!res[index].commoditySeriesId)) {
                            res[index].commoditySeriesId = res[index].commoditymaterialList[0].seriesId
                        }

                        if(!res[index].costPrice) {
                            // console.log(res[index].costPrice,"res[index].costPrice11");
                            
                            res[index].costPrice = 0;
                            res[index].costing = res[index].costPrice;
                            // console.log(res[index].costPrice,"res[index].costPrice1122");
                        }else {
                            // console.log(8888888888888);
                            
                        }
                        
                    }
                    
                    // res.forEach(item => {
                    //     console.log(8563654445414444444444,this.tabList,res);
                        
                    //     // 颜色
                    //     if(item.commoditycolourList && item.commoditycolourList.length != 0) {
                    //         item.commodityColourId = item.commoditycolourList[0].colourId
                    //     }
                    //     // 材质
                    //     if(item.commoditymaterialList && item.commoditymaterialList.length != 0) {
                    //         item.commodityMaterialId = item.commoditymaterialList[0].materialId
                    //     }
                    //     // 系列
                    //     if(item.commoditymaterialList && item.commoditymaterialList.length != 0) {
                    //         item.commoditySeriesId = item.commoditymaterialList[0].seriesId
                    //     }

                    //     if(!item.costPrice) {
                    //         console.log(item.costPrice,"item.costPrice11");
                            
                    //         item.costPrice = 0;
                    //         console.log(item.costPrice,"item.costPrice1122");
                    //     }else {
                    //         console.log(8888888888888);
                            
                    //     }
                    // })
                });
                console.log(this.tabList,"tabList 453");
                
                
                this.productDialog = false;
            } else {
                this.$message.warning('请选择商品');
            }
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
            this.$refs.stockTable.clearSelection()
        },

        // 修改 and 查看备货申请 and 备货审核 回显信息
        getStockUpApply() {
            console.log("yunxinglema  ***mama");
            
            let data = {
                stockUpApplyId: this.$route.query.stockUpApplyId,
            }
            getStockUpApply(data).then(res => {
                if (res.status == 200) {
                    
                    this.viewstockObj = res.data;
                    // this.tabList = this.viewstockObj.stockUpGoodsVOList;

                    if(this.viewstockObj.stockUpGoodsVOList && this.viewstockObj.stockUpGoodsVOList.length != 0) {
                        console.log("执行了",this.viewstockObj.stockUpGoodsVOList.length,"this.viewstockObj.stockUpGoodsVOList.length");
                        
                        this.viewstockObj.stockUpGoodsVOList.forEach(item => {
                            let data = {
                                commodityId: item.commodityId ? item.commodityId : ''
                            };
                            if(data.commodityId != '') {
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
                                    if(!item.costPrice) {
                                        item.costPrice = 0;
                                    }

                                    item.costing = item.costPrice;

                                    this.tabList.push({
                                        inventoryNumber: 0,
                                        commoditycolourList: res[0].data,
                                        commodityseriesList: res[1].data,
                                        commoditymaterialList: res[2].data,
                                        brand_name: item.brandName,
                                        category_name:   item.categoryName,
                                        ...item
                                    });
                                });
                            }
                        })


                    }
                    // this.purchase = this.viewstockObj.stockUpApply; // 对象
                    // this.fileList = this.viewstockObj.accessoryList; // 附件
                }
            }).catch(error => {
                console.log("备货采购申请管理 备货管理 查看备货申请 views/stockmanagement/stockpurchase/components/stockTable",error);
            });
        },

       
        
       
        // 表格选中
        handleSelectionChange(val){
            this.elsectVal = val;

            console.log(this.elsectVal,"elsectVal");
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
            margin-top: 20px;
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
                // border: 0px;
                // appearance: none;
                background: transparent;
            }
            // .el-input__suffix {
            //     // display: none;
            // }
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
                                // border: 0;
                                // appearance: none;
                                // background: #f0f5f9;
                            }
                            // span.el-input__suffix {
                            //     // display: none;
                            // }
                        }
                    }
                    div.el-input--small{
                        box-sizing: border-box;
                        height: 23px;   
                        .el-input__inner{
                            box-sizing: border-box;
                            height: 23px;
                            // border: 0;
                            // appearance: none;
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
                            // height: 23px;
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


