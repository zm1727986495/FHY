<template>
    <div class = "table_list lvs attribute m-top20" v-loading="loading">
        <el-table
            border :row-key="getRowKeys"   @row-click="rowClick"
            :row-class-name="tableRowClassName" 
            ref="multipleTable"
            :data="tabList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
                <el-table-column
                    prop="scrapApplyCode"
                    label="报废单号"  width="240px"
                    show-overflow-tooltip  align="center" sortable>
                    <template slot-scope="scope">
                        <div>
                            <el-tooltip placement="right" visible-arrow >
                                <div slot="content" class="tips tipFon">
                                    <p  @click="operaButton(scope.row)" class="operaItems">查看</p>
                                </div>
                                <img :src="spot" alt="" class="attributesTips">
                            </el-tooltip>

                            <p class="text">{{scope.row.scrapApplyCode}}</p>
                        </div>       
                    </template>
                </el-table-column>
                <el-table-column  prop="status" label="状态" align="center" sortable :formatter="statusFormatter" width="240px"></el-table-column>
                <el-table-column prop="scrapApplyType" label="报废类型" show-overflow-tooltip  align="center" sortable :formatter="typeFormatter"  width="240px"></el-table-column>
                <el-table-column  prop="sourceCode" label="来源单号" show-overflow-tooltip  align="center" sortable  width="240px"></el-table-column>
                <el-table-column prop="amount" label="数量" show-overflow-tooltip  align="center" sortable  width="240px"></el-table-column>
                <el-table-column prop="userName" label="报废人" show-overflow-tooltip  align="center" sortable  width="240px"></el-table-column>
                <el-table-column prop="scrapApplyTime"  label="申请报废时间" show-overflow-tooltip  align="center" sortable  width="240px"></el-table-column>
                <el-table-column  prop="remark" label="备注" show-overflow-tooltip  align="center" sortable  width="240px"></el-table-column>
            </el-table>

            <div class="pagination_wrap">
                <pagination
                    :current-page="currentPage"
                    :pageSize="pageSize"
                    :total="total"
                    @sizeChange="sizeChange"
                    @currentChange="currentChange">
                </pagination>
            </div>

            <scrapDetails 
                v-if="dialogVisible"
                :scrapApplyId = "String(scrapApplyId)"
                :datapop = "datapop"
                @close-change = 'closeChange'/> 

            </div>
</template>

<script>
import pagination from "@/views/components/pagination";

import scrapDetails from './scrapDetails';
import spot from "@/assets/images/spot.png";

import {
    listScrapApplyByPage, // 报废列表查询
} from 'api/entrepotSet/scrapmanagement/index';

export default {
    name: 'scrapTable',

	components: {
        pagination,
        scrapDetails
    },

    
    props: ["status","text","searchData","scrapApplyType"],
    data() {
        return {
            spot, //操作图片

            scrapApplyId: '',
            dialogVisible: false, // 报废申请详情弹出框的flag
            loading: true, // table的loading控制
            tabList: [], // 表格数据
            selectVal: [], // 选中的数据
            // 分页
            currentPage: 1,//当前页数
            pageSize: 20,//当前页最大条数
            total: 0,//总条数
            
        }
    },
    created () {

        let data = {
            status: this.status,

            page: this.currentPage,
            limit: this.pageSize,
        };
        this.getList(data);
    },
   
    methods: {
        getRowKeys(row) {
            return row.scrapApplyId;
        },
        rowClick(row) {
            this.$refs.multipleTable.toggleRowSelection(row)
        },

        // 1 申请中 2 申请通过 3 驳回 4 待提交
        statusFormatter(row) {
            let status = '';
            switch(row.status) {
                case 1:
                    status =  "申请中" 
                    break;
                case 2:
                    status =  "申请通过" 
                    break;
                case 3:
                    status =  "驳回" 
                    break;   
                case 4:
                    status =  "待提交" 
                    break; 
                default: 
                    status = ""
            }
            return status;
        },
        // 报废类型
        typeFormatter(row) {
            let scrapApplyType = '';
            if(Number(row.scrapApplyType) == 1) {
                scrapApplyType =  "盘点报废";
            }else if(Number(row.scrapApplyType) == 2) {
                scrapApplyType =  "手动报废";
            }else if(Number(row.scrapApplyType) == 3) {
                scrapApplyType =  "维修报废";
            }else if(Number(row.scrapApplyType) == 4) {
                scrapApplyType =  "入库报废";
            }
        
            return scrapApplyType;
        },
      
        // 查看操作按钮
        operaButton(val) {
            this.scrapApplyId = val.scrapApplyId;

            this.datapop = val;
			this.dialogVisible  = true;
        },
        //table勾选事件
        handleSelectionChange(val) {
            this.selectVal = val;

            console.log(this.selectVal, "this.selectVal");
            
        },
        // 弹出框的取消 -- 子组件触发
        closeChange(item) {

            this.dialogVisible = false; // 关闭弹出框
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
        
        // 搜索条件获取
        searchdatas(){
            return {
                text : this.text ? this.text : '',  // 报废单号/订单号/采购单
				startTime: this.searchData ? this.searchData[0] : '', 
				endTime: this.searchData ? this.searchData[0] : '',
				scrapApplyType: this.scrapApplyType ? this.scrapApplyType : '',  // 报废类型
				status: Number(this.status), // tab状态

                page: this.currentPage,
                limit: this.pageSize,
            };
        },
        // // 搜索条件获取
        // searchdatas(){
        //     return {
        //         text : this.text,  // 报废单号/订单号/采购单
		// 		startTime: this.searchData[0], 
		// 		endTime: this.searchData[1],
		// 		scrapApplyType: this.scrapApplyType,  // 报废类型
		// 		// status: Number(this.$refs.tablelists.status), // tab状态

        //         // page: this.$refs.tablelists.currentPage,
        //         // limit: this.$refs.tablelists.pageSize,
        //     };
		// },

        // 获取表格数据
		getList(data) {
            this.loading = true;
            listScrapApplyByPage(data).then(res =>{
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tabList = res.data.rows;

                    this.tabList.forEach(item => {
                        Number(item.status);
                    })
                    this.loading = false;
                }
            }).catch(err =>{
                this.loading = false;
                console.log('报废管理:报废管理 列表 entrepotSet/scrapmanagement/components/scrapTable.vue', err);
            })
        },


        // 表格行样式
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },

  },
};
</script>
<style scoped lang="scss">

</style>


