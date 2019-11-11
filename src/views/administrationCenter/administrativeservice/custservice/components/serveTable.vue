<template>
    <div class="serveTable">
        <!-- 待处理按钮组 -->
        <div class="">
            <el-button
                v-for="(item,index) in actionBtnList"
                :key="index"
                :type="item.style"
                size="small" class="button-96"
                @click="butGroupActions(item.url,item.type)"
            >{{item.name}}</el-button>
        </div>

        <div class="table_list lvs attribute m-top20">
            <el-table
                border   :row-key="getRowKeys"
                :row-class-name="tableRowClassName"
                :data="tableList"
                style="width: 100%"
                @selection-change="handleSelectionChange">

            <el-table-column type="selection" width="55"  :reserve-selection="true"></el-table-column>

            <el-table-column label="客户合同号"  prop="customerContractNumber" sortable align="center" width="160">
                <template slot-scope="scope">
                    <div>
                        <el-tooltip placement="right" visible-arrow >
                            <div slot="content" class="tips tipFon">
                                <p  @click="operaButton(scope.row)" class="operaItems">查看</p>
                            </div>
                            <img :src="spot" alt="" class="attributesTips">
                        </el-tooltip>

                        <p class="text">{{scope.row.customerContractNumber}}</p>
                    </div>       
                </template>
            </el-table-column>

            <el-table-column
                label="来源"
                prop="source" sortable  align="center" width="240" :formatter="sourceformatter">
            </el-table-column>

            <el-table-column
                label="沟通状态"
                prop="status" sortable  align="center" width="240">
            </el-table-column>

            <el-table-column
                label="订单类型"
                prop="type" sortable  align="center" width="240">
            </el-table-column>

            <el-table-column
                label="客户姓名"
                prop="name" sortable  align="center" width="240">
            </el-table-column>

            <el-table-column
                label="客户电话"
                prop="name" sortable  align="center" width="240">
            </el-table-column>
            
            <el-table-column
                label="订单地址"
                prop="name" sortable  align="center" width="240">
            </el-table-column>

            <el-table-column
                label="地址备注"
                prop="name" sortable  align="center" width="240">
            </el-table-column>
            
            <el-table-column
                label="安装完成时间"
                prop="name" sortable  align="center" width="240">
            </el-table-column>

            <el-table-column
                label="第一次出库时间"
                prop="name" sortable  align="center" width="240">
            </el-table-column>

            <el-table-column
                label="销售人员评分"
                prop="name" sortable  align="center" width="240">
            </el-table-column>

            <el-table-column
                label="设计师评分"
                prop="name" sortable  align="center" width="240">
            </el-table-column>

            <el-table-column
                label="安装人员评分"
                prop="name" sortable  align="center" width="240">
            </el-table-column>

            <el-table-column
                label="反馈已经"
                prop="name" sortable  align="center" width="240">
            </el-table-column>

            </el-table>
        </div>
        
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
import spot from '@/assets/images/spot.png';

import pagination from "@/views/components/pagination";

import {
  listCustomerService, // table数据
} from 'api/administrationCenter/administrativeservice/index';


export default {
    name: 'serveTable',
    components: {
        pagination,
    },
    
    data() {
        return {
            spot,// 操作图片

            // 分页
            currentPage: 1,//当前页数
            pageSize: 20,//总页数
            total: 100,//总条数

            // 待处理页面操作按钮list
            actionBtnList: [
                { name: "导出", style: "default", url: "/addbrand", type: 1 },
            ],
            tableList: [], // 表格数据
        };
    },
    mounted() {
        // 代收款--获取表格数据
        // this.getList();
    },
    created () {
        console.log("wo shi table");

        let data = {
            page: this.currentPage,
            limit: this.pageSize,
        };
        this.getList(data);
    },
    methods: {
        getRowKeys(row) {
            return row.illegalBillId;
        },
        //来源 0安装 1售后
        sourceformatter(row) {
            let source = '';

            if(row.status == 0) {
                source = "安装";
            }else if(row.status == 1) {
                source = "售后";
            }
            return source;
        },
        
        // 搜索条件获取
        searchdatas(){
            return {
                // names: this.names, 
                // searchData: this.searchData[0], 
                // sourceOrder: this.sourceOrder,
                // processType: this.processType, 
		
                page: this.currentPage,
                limit: this.pageSize,
            };
		},

        // 搜索
        searchFun(){   
            this.currentPage = 1;
            let data = this.searchdatas();

            console.log(data);
            this.orderdatafun(data);
        },

        // 分页函数回调
        currentChange(val) {
            this.currentPage = val;

            let data = this.searchdatas();
            this.getList(data);
        },
        // 单页条数改变
        sizeChange(val){
            this.currentPage = 1;
            this.pageSize = val;

            let data = this.searchdatas();
            this.getList(data);
		},

        // 查看操作按钮
        operaButton(val) {
            // console.log(val);
            let source = val.source;
            if (source == '安装') {
                this.$router.push({path: "backinstall"});
            }
            // this.$router.push({path: "strateDetails", query:{id: id}});
        },

        //按钮组函数
		butGroupActions(url, type) {
			if (type == 1) {
				//弹框
				// this.addbrand();
				this.$message.error("订单功能未开发")
			}
		},

        // table 颜色切换
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },

        // 多选改变
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.$emit('selection-change', this.multipleSelection);
        },

        // 获取表格数据
		getList(data){
            listCustomerService(data).then(res =>{
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tableList = res.data.rows;
                }
            }).catch(error =>{
                console.log('订单管理:订单列表 views/administrationCenter/administrativeservice/custservice/components/serveTable.vue', error);
            })
        },

    }
};
</script>
<style scoped lang="scss">
  
</style>