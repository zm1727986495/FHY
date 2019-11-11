<template>
    <div class="purTable">

        <div class="textitle">
            <div class="titlecals">请购商品</div>
        </div>

        <div class="btn_list_1">
            <el-button size="small" class="button-96" @click="addGoods">添加商品</el-button>   
            <el-button size="small" class="button-96" @click="deleteGoods">删除</el-button>
            <el-button size="small" class="button-96" @click="saveGoods">删除</el-button>
        </div>
        <el-dialog title="商品列表"   custom-class="customDialogTitle" :visible.sync="productDialog" width="1024px" top="2vh" class="lvs">
            <select-commodity @selectionChange="selectionChange" ref="selectedCommodities" :select-list="selectList" v-if="productDialog"></select-commodity>
            
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitBtn">确定</el-button>
                <el-button  @click="colseBtn">取消</el-button>
            </div>
        </el-dialog>
        <!-- table表格 -->
        <div class="table_list lvs attribute m-top20 purchase_table">
            <el-table
                border
                :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange"
                :data="tabList"
                style="width: 100%;">

                <el-table-column type="selection" width="55"></el-table-column>

                <el-table-column type="index" width="55"></el-table-column>

                <el-table-column
                    width="240" prop="name"
                    label="商品编码"
                    sortable align="center">
                </el-table-column>

                <el-table-column
                    width="240" prop="name"
                    label="名称"
                    sortable align="center">
                </el-table-column>

                <el-table-column
                    width="240" prop="name"
                    label="品牌"
                    sortable align="center">
                </el-table-column>

                <el-table-column
                    width="240" prop="name"
                    label="品类"
                    sortable align="center">
                </el-table-column>

                <el-table-column
                    width="240" prop="name"
                    label="型号"
                    sortable align="center">
                </el-table-column>

                <el-table-column
                    width="240" prop="name"
                    label="系列"
                    sortable align="center">
                    <template  slot-scope="scope">
                        <el-select :size="size" v-model="scope.row.series" placeholder="请选择系列">
                            <el-option label="系列" value="1"></el-option>
                            <el-option label="系列2" value="2"></el-option>
                        </el-select>
                    </template>
                </el-table-column>

                <el-table-column
                    width="240" prop="name"
                    label="材质"
                    sortable align="center">
                    <template  slot-scope="scope">
                        <el-select :size="size" v-model="scope.row.series" placeholder="请选择系列">
                            <el-option label="系列" value="1"></el-option>
                            <el-option label="系列2" value="2"></el-option>
                        </el-select>
                    </template>
                </el-table-column>

                <el-table-column
                    width="240" prop="name"
                    label="颜色"
                    sortable align="center">
                    <template  slot-scope="scope">
                        <el-select :size="size" v-model="scope.row.series" placeholder="请选择系列">
                            <el-option label="系列" value="1"></el-option>
                            <el-option label="系列2" value="2"></el-option>
                        </el-select>
                    </template>
                </el-table-column>

                <el-table-column
                    width="240" prop="name"
                    label="单位"
                    sortable align="center">
                </el-table-column>

                <el-table-column
                    width="240" prop="name"
                    label="宽"
                    sortable align="center">
                    <template  slot-scope="scope">
                        <el-input v-model="scope.row.width" :size="size" placeholder="宽"></el-input>
                    </template>
                </el-table-column>

                <el-table-column
                    width="240" prop="name"
                    label="高"
                    sortable align="center">
                    <template  slot-scope="scope">
                        <el-input v-model="scope.row.width" :size="size" placeholder="高"></el-input>
                    </template>
                </el-table-column>

                <el-table-column
                    width="240" prop="name"
                    label="深"
                    sortable align="center">
                    <template  slot-scope="scope">
                        <el-input v-model="scope.row.width" :size="size" placeholder="深"></el-input>
                    </template>
                </el-table-column>

                <el-table-column
                    width="240" prop="name"
                    label="厚"
                    sortable align="center">
                    <template  slot-scope="scope">
                        <el-input v-model="scope.row.width" :size="size" placeholder="厚"></el-input>
                    </template>
                </el-table-column>

                <el-table-column
                    width="240" prop="num"
                    label="数量"
                    sortable align="center">
                    <template>
                    <!-- <template  slot-scope="scope"> -->
                        <!-- {{scope.row.stores}} -->
                        <el-input-number v-model="num" :min = "0" :step="1" :precision="0"></el-input-number>
                    </template>
                </el-table-column>

            </el-table>    
        </div>
        
        <!-- 分页 -->
        <div class="pagination_wrap">
            <pagination
                :current-page="currentPage"
                :pageSize="pageSize"
                :total="total"
                @sizeChange="sizeChange"
                @currentChange="currentChange">
            </pagination>
        </div>


    </div>
</template>
<script>


import spot from "@/assets/images/spot.png";
import pagination from "@/views/components/pagination";
import selectCommodity from '@/views/components/selectCommodity'

export default {
    components: {
       pagination,
       selectCommodity
    },
    // name: 'brandmanagement',
    data() {
        return {
            size: "small",
            productDialog: false,
            // 表格数据
            elsectVal: [], // 表格选中的数据
            tabList:[{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            },], // 表格数据
            num: '',
            selectList: {
                selectedCommodities: [], // 选中的商品 可不传
                brandList: [], // 品牌数组 可不传（不传默认为全部品牌）
                categoryList: [], // 品类数组 可不传（不传默认为全部品类）
                priceStrategyId: '', // 价格策略 不是必填
                height: '350px', // 设置表格高度 可不传（弹出层最好传下）
                isDialog: true // 是否为弹出层（不传默认为页面）
            },
            // 分页
            currentPage: 1,
            pageSize: 20,
            total: 10,
            
        };
    },

    mounted() {
       
    },
    created() {
        let data = {
            page: this.currentPage,
            limit: this.pageSize,
        };
        this.getList(data);
    },
    methods: {
        // 添加商品
        addGoods() {
            this.productDialog = true;
        }, 
        // 删除
        deleteGoods() {
            
        },
        // 保存
        saveGoods() {

        },
        // 确定
        submitBtn() {
            this.productDialog = false;
        },
        // 取消
        colseBtn() {
            this.productDialog = false;
        },
        selectionChange(val) {
            console.log(val)
        },
        currentChange(val) {
            this.currentPage = val;
            this.searchfun()
        },
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
            this.searchfun()
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

		// 改变tablebody颜色
		tableBodycolor({ row, rowIndex }) {
			// return "height: 80px";
		},

    }
};
</script>
<style scoped lang='scss'>
        .purTable{
            .purchase_table {
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
    .purTable{
        .purchase_table {
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


