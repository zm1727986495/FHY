<template>
 
        <el-dialog title="" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
            <div class = "inventorydetail">
                <div  :class="title ? 'titlecals titleTop' : '  titledis'">
                    <!-- {{title}} -->
                    盘点类报废详情
                </div>
                
                <div class="warp_head_list">
                    <div class="scrapdetails" >
                        <ul class="scraplist">
                            <li>报废单号： RK4645988</li>
                            <li>来源单号：25692304757</li>
                            <li>来源： 盘地报费</li>
                            <li>发起人：小王</li>
                            <li>报废时间： 2018-10-18 09:50</li>
                            <li class="remarks">报废备注：这是一条备注内容~入库顺利这是一条备注内容~这是一条备注内容~这是一条备注内容~入库顺利这是一条备注内容~这是一条备注内容~这是一条备注内容~入库顺利这是一条备注内容~这是一条备注内容~这是一条备注内容~入库顺利这是一条备注内容~这是一条备注内容~这是一条备注内容~入库顺利这是一条备注内容~这是一条备注内容~</li>
                        </ul>
                    </div>


                    <div class="scrapTable" v-if="isStatus == true">
                        <span>报废货物列表</span>
                        <div  class="table_list lvs">
                            <el-table
                                :data="tableData"
                                style="width: 100%"
                                :row-class-name="tableRowClassName"
                                border >
                            <!-- :cell-style="cellStyle" :header-cell-style = "cellStyle" -->

                                <el-table-column
                                    label="货区货位"
                                    prop="id" sortable align="center" width="160">
                                </el-table-column>

                                <el-table-column
                                    label="商品名称"
                                    prop="name" sortable  align="center" width="180">
                                </el-table-column>

                                <el-table-column
                                    label="商品型号"
                                    prop="phone" sortable  align="center" width="180">
                                </el-table-column>

                                <el-table-column
                                    label="商品材质"
                                    prop="name" sortable  align="center" width="180">
                                </el-table-column>

                                <el-table-column
                                    label="商品颜色"
                                    prop="name" sortable  align="center" width="180">
                                </el-table-column>

                                <el-table-column
                                    label="入库单号"
                                    prop="name" sortable  align="center" width="180">
                                </el-table-column>
                                
                                <el-table-column
                                    label="盘点单号"
                                    prop="name" sortable  align="center" width="180">
                                </el-table-column>

                                <el-table-column
                                    label="采购单号"
                                    prop="name" sortable  align="center" width="180">
                                </el-table-column>

                                <el-table-column
                                    label="库存属性"
                                    prop="name" sortable  align="center" width="180">
                                </el-table-column>

                                <el-table-column
                                    label="商品类型"
                                    prop="name" sortable  align="center" width="180">
                                </el-table-column>
                                
                                <el-table-column
                                    label="计量单位"
                                    prop="name" sortable  align="center" width="180">
                                </el-table-column>

                                <el-table-column
                                    label="应盘数量"
                                    prop="name" sortable  align="center" width="180">
                                </el-table-column>
                                
                                <el-table-column
                                    label="盘点数量"
                                    prop="name" sortable  align="center" width="180">
                                </el-table-column>

                                <el-table-column
                                    label="报废数量"
                                    prop="name" sortable  align="center" width="180" style="color: red">
                                    <template slot-scope="scope">
                                        <span  class="redSpan">
                                            {{scope.row.name}}
                                        </span>
                                        <!-- <span v-else class="redSpan">{{scope.row.status}} + 255</span>  -->
                                    </template>
                                </el-table-column>
                            
                            </el-table>
                        </div>
                    </div>
                    <div class="scrapTable" v-else>
                        <span>报废货物列表</span>
                        <div  class="table_list lvs">
                            <el-table
                                :data="tableData"
                                style="width: 100%"
                                :row-class-name="tableRowClassName"
                                border >
                            <!-- :cell-style="cellStyle" :header-cell-style = "cellStyle" -->

                                <el-table-column
                                    label="到货单号"
                                    prop="id" sortable align="center" width="160">
                                </el-table-column>

                                <el-table-column
                                    label="客户合同号"
                                    prop="name" sortable  align="center" width="180">
                                </el-table-column>

                                <el-table-column
                                    label="采购合同号"
                                    prop="phone" sortable  align="center" width="180">
                                </el-table-column>

                                <el-table-column
                                    label="柜身"
                                    prop="name" sortable  align="center" width="180">
                                </el-table-column>

                                <el-table-column
                                    label="门板"
                                    prop="name" sortable  align="center" width="180">
                                </el-table-column>

                                <el-table-column
                                    label="配件"
                                    prop="name" sortable  align="center" width="180">
                                </el-table-column>
                                
                                <el-table-column
                                    label="备注"
                                    prop="name" sortable  align="center" width="180">
                                </el-table-column>

                            
                            </el-table>
                        </div>
                    </div>
                    <el-steps :active="1">
                        <el-step title="待审批" description=""></el-step>
                        <el-step title="待行政审批" description=""></el-step>
                        <el-step title="驳回" description=""></el-step>
                        <el-step title="带财务审批" description=""></el-step>
                        <el-step title="驳回" description=""></el-step>
                        <el-step title="审批通过" description=""></el-step>
                    </el-steps>

                </div>
                <div slot="footer" class="dialog-footer backButton">
                    <!-- <el-button type="primary" @click="submitBtn">提交</el-button> -->
                    <el-button  @click="colseBtn">取消</el-button>
                </div>
            </div>
 
        </el-dialog>

</template>

<script>
import pagination from "@/views/components/pagination";

import {
  addCommodityInPriceStrategy,
} from 'api/price/price';

export default {
    name: 'inventoryPop',

	components: {
		pagination,
    },
    
    // props: ["id"],
    props: {
        // 配置title
        title: {
            type: String,
            default () {
                return '';
            }
        },
    },

    data() {
        return {

            // 分页
            currentPage: 1,//当前页数
            pageSize: 20,//当前页最大条数
            total: 0,//总条数
            isStatus: false,
            visible: true,
            photoLists: [{
                id: '112',url: ''
            },{
                id: '122',url: ''
            },{
                id: '132',url: ''
            },{
                id: '142',url: ''
            },],
            tableData: [{
                id: '2016-05-02',
                name: '王小虎',
                phone: '上海市普陀区金沙江路 1518 弄'
            }, {
                id: '2016-05-02',
                name: '王小虎',
                phone: '上海市普陀区金沙江路 1518 弄'
            }, {
                id: '2016-05-02',
                name: '王小虎',
                phone: '上海市普陀区金沙江路 1518 弄'
            }, {
                id: '2016-05-02',
                name: '王小虎',
                phone: '上海市普陀区金沙江路 1518 弄'
            }],
            visible: true,
        }
    },
  
    methods: {
        // begin

        // 查看操作按钮
        operaButton(val) {
			
        },
        // 取消 返回上一页
        goBack() {
            // this.$router.go(-1);
        },
        colseBtn(){
            this.$emit( "submint-change", "");
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
        
        currentChange(val) {//翻页方法
            this.currentPage = val;
            // this.getList();
        },
        sizeChange(val) {//翻页方法
            this.currentPage = 1;
            this.pageSize = val;
            //   this.getList();
        },
        // 表格行样式
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        // 改变tablebody颜色
        tableBodycolor({ row, rowIndex }) {
            // return "height: 80px";
        },

        // end

  },
};
</script>
<style scoped lang="scss">


    .inventorydetail{
        
        .titledis {
            display: none;
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

            

        }
        
        .backButton {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
        }     
        
    }
    .redSpan {
        color: red;
    }
</style>

<style>
    .el-steps--horizontal {
        width: 100%;
        margin-top:20px;
    }
</style>



