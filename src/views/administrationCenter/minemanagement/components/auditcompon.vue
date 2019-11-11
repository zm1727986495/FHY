<template>
<!-- 我的--审核列表 + 表格 -->
    <div class="screencompon">
        <div class="warp_head_list">
            <div class="list_top">
                <div>
                    <el-input placeholder="订单编号/客户合同号/客户姓名/客户电话/订单地址" v-model="names" size="medium" maxlength="50">
                    </el-input>
                </div>
                <div>
                    <el-date-picker
                        size="medium" v-model="searchData" type="daterange" 
                        value-format='yyyy-MM-dd' format='yyyy-MM-dd' 
                        range-separator="-"
                        start-placeholder="年/月/日" end-placeholder="年/月/日">
                    </el-date-picker>
                </div>
                <div>
                    <el-select v-model="applyer" multiple placeholder="选择申请人" size="medium">
                        <el-option
                            v-for="item in applyList" :key="item.value"
                            :label="item.dictName" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <el-select v-model="applyType" multiple placeholder="选择申请类型" size="medium">
                        <el-option
                            v-for="item in typeList" :key="item.value"
                            :label="item.categoryName" :value="item.applyType">
                        </el-option>
                    </el-select>
                </div>
                <div v-if="isShow">
                    <el-select v-model="status" placeholder="选择审核状态" size="medium">
                        <el-option
                            v-for="item in statusList" :key="item.value"
                            :label="item.dictName" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
               <div v-if="isShow">
                    <el-select v-model="auditer" multiple placeholder="选择审核人" size="medium">
                        <el-option
                            v-for="item in auditList" :key="item.value"
                            :label="item.dictName" :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div v-if="isShow">
                    <el-date-picker
                        size="medium" v-model="searchData2" type="daterange" 
                        value-format='yyyy-MM-dd' format='yyyy-MM-dd' 
                        range-separator="-"
                        start-placeholder="年/月/日" end-placeholder="年/月/日">
                    </el-date-picker>
                </div>
                <div class="head_nav_datapick">
                    <el-button type="primary" size="medium" class="button-fc" @click="searchfun">查询</el-button>
                    <el-button  class="el-button--medium" type="primary" size="medium" @click="resetFun">重置</el-button>
                </div>
            </div>
        </div>

        <slot></slot>

        <!-- table表格 -->
                <div class="table_list lvs attribute m-top20">

                    <el-table
                        border
                        :row-class-name="tableRowClassName"
                        :row-style="tableBodycolor"
                        @selection-change="handleSelectionChange"
                        :data="tabList"
                        style="width: 100%;" @cell-click="clickCell">

                        <el-table-column type="selection" width="55"></el-table-column>

                        <el-table-column prop="name" align="center" label="审核状态" width="280" sortable>
                            <template slot-scope="scope">
                                <div>
                                    <el-tooltip placement="right" visible-arrow >
                                        <div slot="content" class="tips tipFon">
                                            <p @click="auditHandle(scope.row)" class="operaItems">审核</p>
                                            <p @click="auditRecord(scope.row)" class="operaItems">审核记录</p>
                                        </div>
                                        <img :src="spot" alt="" class="attributesTips">
                                    </el-tooltip>

                                    <p class="text">{{scope.row.name}}</p>
                                </div>       
                            </template>
                        </el-table-column>
  
                        <el-table-column
                            prop="name"
                            label="申请单号"
                            width="240" sortable align="center">
                            <template slot-scope="scope">
                                <div>
                                    <p class="operation table_action_span">{{scope.row.name}}</p>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="申请时间"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="申请人"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="申请类型"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="申请原因"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="审核人"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="审核时间"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="订单号"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="订单类型"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="产品类别"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="产品品牌"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="客户姓名"
                            width="240" sortable align="center">
                        </el-table-column>
                        
                        <el-table-column
                            prop="name"
                            label="客户电话"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="备用电话"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="订单地址"
                            width="240" sortable align="center">
                        </el-table-column>

                        <el-table-column
                            prop="name"
                            label="所属门店"
                            width="240" sortable align="center">
                        </el-table-column>
                    </el-table>    

                </div>
            <!-- 点击审核记录的操作按耨--审核记录 -->
            <examinedia v-if = "examVisible" @close_examin="examineclose" @examin_ok="examinok"></examinedia>

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
import {
    listBaseDict,
} from 'api/order/order/order';
import spot from '@/assets/images/spot.png';
import pagination from "@/views/components/pagination";

// import applydetail from './applydetail'; // 申请详情
import examinedia from '@/views/components/components/examinedia'; // 审核记录

import {
    listProjectDelayUrgentApply, // 审核列表
} from 'api/marketing/projectpermit/index';

export default {
    components: {
        pagination,
        // applydetail,
        examinedia
    },
    data() {
        return {
            spot,
            // 分页
            currentPage: 1,
            pageSize: 20,
            total: 0,
            // 搜索条件
            orderGroup: '',//订单编号
            applyName: '', //申请人
            applyType: '',//申请类型
            applyStatus: '',//申请状态
            auditName: '',// 审核人
            searchData: [],// 选择时间
            searchData2: [], // 审核时间
            // 条件
            applyList: [],  // 选择申请人条件
            typeList: [],  // 选择申请类型条件
            statusList: [{
                label: "待审核", value: "0",
            },{
                label: "审核通过", value: "1",
            },{
                label: "驳回", value: "2",
            }],
            auditList: [],  // 选择审核人条件
            // 申请详情弹出框的显示与否
            diaVisible: false,
            examVisible: false, // 审核记录弹框是否显示
            // 表格
            elsectVal: [], // 表格选中的数据
            tabList:[], // 表格数据
			
        }
    },

    watch: {
       
        
    },
    created() {
        let data = {
            page: this.currentPage,
            limit: this.pageSize,
        };

        this.getList(data);  
        //字典获取 申请类型
        this.listBaseDictFun(); 
    },
    methods: {
        //字典获取 申请类型
        listBaseDictFun(){
            let data = {
                dataType: "APPLY_TYPE"
            }; 
            listBaseDict(data).then(res=>{
                if(res.status == 200) {
                    this.typeList = res.data;
                }
            })
        },
        // 审核记录 --- 打开审核记录弹框 
        auditRecord () {
            this.examVisible = true;
        },

        //关闭弹框   审核记录
        examineclose() {
            this.examVisible = false;
        },

        //确认关闭弹框   审核记录
        examinok() {
            this.examVisible = false;
            // this.$message("审核信息成功");
        },
        // 点击表格单元格
        clickCell(row,column,event,cell) {
            if(column.label === "申请单号"){
                // this.getinStoreList(id);
                this.diaVisible = true;
            }
        },

        closeDialog() {
            this.diaVisible = false;
        },

        // 编辑
        auditHandle(val) {
            this.currentPage = val;
            this.searchfun()
        },
        // 删除
        delebHandle (val) {
            this.currentPage = val;
            this.searchfun()
        },
        // 审核
        auditHandle(val) {
            this.currentPage = val;
            this.searchfun()
        },

      // 改变页码
        currentChange(val) {
            this.currentPage = val;

            let data = this.searchdatas();
            this.getList(data);
        },
        // 改变单页条数
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;

            let data = this.searchdatas();
            this.getList(data);
        },

        // 搜索条件获取
        searchdatas(){
            return {
                orderGroup: this.orderGroup,//订单编号
                applyStartTime: this.searchData[0],//创建时间
                applyEndTime: this.searchData[1],
                auditStartTime: this.searchData2[0],// 审核开始时间
                auditEndTime: this.searchData2[1],// 审核开始时间
             
                applyName: this.applyName, //申请人
                applyType: this.applyType,//申请类型
                applyStatus: this.applyStatus,//申请状态
                auditName: this.auditName,// 审核人

                
                page: this.currentPage,
                limit: this.pageSize,
            };
        },
        searchfun(){    //搜索
            this.currentPage = 1;

            let data = this.searchdatas();
            this.getList(data);
        },
        resetFun(){// 重置
            this.orderGroup = '';//订单编号
            this.searchData = [];//创建时间
            this.searchData2 = [],// 审核开始时间
             
            this.applyName = ''; //申请人
            this.applyType = '';//申请类型
            this.applyStatus = '';//申请状态
            this.auditName = '';// 审核人
            this.currentPage = 1;
    

            let data = this.searchdatas();
            this.getList(data);
        },
         // 表格选中
        handleSelectionChange(val){
            this.elsectVal = val;
            console.log(this.elsectVal,"elsectVal");
        },
		

        
        // 获取表格数据
		getList(data){
            listProjectDelayUrgentApply(data).then(res =>{
                if(res.status == 200){
                    this.total = res.data.total;
                    this.tabList = res.data.rows;
                    
                    this.tabList.forEach(item => {
                        Number(item.applyStatus)
                    })
                    this.loading = false;
                }
            }).catch(error =>{
                console.log('备货采购申请管理 备货管理 列表页 views/stockmanagement/stockpurchase/components/querycompon', error);
            })
        },
	

        //表格斑马线设置
		tableRowClassName({row, rowIndex}) {
			return rowIndex%2 != 0 ? 'el-f0' : '';
		},

		// 改变tablebody颜色
		tableBodycolor({ row, rowIndex }) {
			// return "height: 80px";
		},

    },
}
</script>
<style lang="scss">
.screencompon{
    .list_top,.list_bottom{
        width: 100%;
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
    }
    .list_top{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        >div{
            margin: 10px 0px;
            padding: 0px 5px;
            width: 25%;
            >div{
                width: 100%;
            }
        }
        .btnone{
            margin-left: 10px;
        }
        .head_nav_btn{
            width: 100%;
            text-align: center;
            .btnone{
                margin-left: 10px;
            }
        }
    }
}
</style>