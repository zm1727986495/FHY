<template>
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
                <div :class="[{'head_nav_btn': !isShow},'head_nav_datapick']">
                    <span class="fontMore cursors" @click="hideSearch()">{{isShow ? '收起' : '更多'}}</span>
                    <el-button class="button-fc" type="warning" size="medium" @click="searchfun">查询</el-button>
                    <el-button   class="el-button--medium" type="primary" size="medium" @click="resetFun">重置</el-button>
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

                        <el-table-column prop="name" align="center" label="申请状态" width="280" sortable>
                            <template slot-scope="scope">
                                <div>
                                    <el-tooltip placement="right" visible-arrow >
                                        <div slot="content" class="tips tipFon">
                                            <p @click="editHandle(scope.row)" class="operaItems">编辑</p>
                                            <p @click="deleteHandle(scope.row)" class="operaItems">删除</p>
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
            <!-- 点击单元格--申请单号的弹出框 -->
            <applydetail @close-dialog = "closeDialog" v-if="diaVisible"></applydetail>

            <!-- 点击审核记录操作按钮--审核记录 -->
            <examinedia :visible="examVisible" @close_examin="examineclose" @examin_ok="examinok"></examinedia>

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
    listStore, 
    listCategory, 
    listBaseDict,
    getSalesmanList,//获取本门店下所有的销售员
    getSurveyorList,//获取本门店下所有的测量员
    getDesignerList,//获取本门店下所有的设计员
} from 'api/order/order/order';
import spot from '@/assets/images/spot.png';
import pagination from "@/views/components/pagination";
import applydetail from '@/views/components/components/applydetail'; // 申请单号
import examinedia from '@/views/components/components/examinedia'; // 审核记录
export default {
    components: {
        pagination,
        examinedia,
        applydetail
    },
    data() {
        return {
            spot,
            // 分页
            currentPage: 1,
            pageSize: 20,

            names: '', // 条件搜索
            searchData: [],// 选择时间
            searchData2: [],// 选择时间2
            applyer: [], // 选择申请人
            applyType: [], // 选择申请类型
            status: [],  // 状态
            auditer: [], // 选择审核人
            // 条件
            applyList: [],  // 选择申请人条件
            typeList: [],  // 选择申请类型条件
            statusList: [],  // 选择审核状态条件
            auditList: [],  // 选择审核人条件
            // 搜索框的显示与否
            isShow: false,
            // 申请详情弹出框的显示与否
            diaVisible: false,
            examVisible: false, // 审核记录弹框是否显示
            // 表格
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
			
        }
    },
    props: {
        total:{
            type: Number,
            default: 0
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

        // listStore().then(res =>{
        //     console.log(res,"获取门店");
        //     if(res.status == 200){
        //         this.dotList = res.data;
        //     }
        // }).catch(error =>{
        //     console.log('订单管理:获取门店 order/order/order.vue', error);
        // })

        listCategory().then(res =>{
            console.log(res,"获取产品类别列表");
            if(res.status == 200){
                this.typeList = res.data;
            }
        }).catch(error =>{
            console.log('订单管理:获取产品类别列表 order/order/order.vue', error);
        })


        //获取订单渠道
        // let datas={
        //     dataType: "ORDER_CHANNEL"
        // };
        // listBaseDict(datas).then(res =>{
        //     console.log(res,"基础字典查询获取订单渠道");
        //     if(res.status == 200){
        //         this.channelList = res.data;
        //     }
        // }).catch(error =>{
        //     console.log('订单管理:基础字典查询获取订单渠道 order/justOrder/addJustOrder.vue', error);
        // })

        //获取订单状态
        // let datasa={
        //     dataType: "ORDER_STATUS"
        // };
        // listBaseDict(datasa).then(res =>{
        //     console.log(res,"基础字典查询获取订单状态");
        //     if(res.status == 200){
        //         this.applyList = res.data;
        //     }
        // }).catch(error =>{
        //     console.log('订单管理:基础字典查询获取订单状态 order/justOrder/addJustOrder.vue', error);
        // })
    },
    methods: {
        

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
        
            // var id = row.priceStrategyId;
            
            if(column.label === "申请单号"){
                // this.getinStoreList(id);
                this.diaVisible = true;
            }
        },

        closeDialog() {
            this.diaVisible = false;
        },

        // 编辑 -- 操作按钮2
        editHandle(val) {
            this.$router.push({
                path: '/minemanagement/editapplication',
                // query: {
                   
                // }
            });
        },
        // 删除 -- 操作按钮2
        deleteHandle (val) {
        },
        // 审核 -- 操作按钮2
        auditRecord () {
            this.examVisible = true;
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
        // 显示隐藏搜索
        hideSearch(){
            this.isShow = !this.isShow;
        },
        // 搜索条件获取
        searchdatas(){
            return {
                names: this.names,//订单编号
                createTimeStart: this.searchData[0],//创建时间
                createTimeEnd: this.searchData[1],
             
                // applyerIds: this.applyer.join(","),// 申请人状态
                // applyTypes: this.applyType.join(","), // 申请类型别
                
                page: this.currentPage,
                limit: this.pageSize,
            };
        },
        searchfun(){    //搜索
            let data = this.searchdatas();
            this.$emit("searchfun",data)
        },
        resetFun(){// 重置
            this.names= '' // 条件搜索
            this.searchData = [];// 时间搜索
            this.applyer = []; // 审核人搜索
            this.applyType = []; // 申请类型搜索
            this.status = []; // 状态搜索
            
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
        .fontMore{
            color:#d0cfcf;
        }
        .btnone{
            margin-left: 10px;
        }
        .head_nav_btn{
            width: 100%;
            text-align: center;
            .fontMore{
                color:#d0cfcf;
            }
            .btnone{
                margin-left: 10px;
            }
        }
    }
}
</style>