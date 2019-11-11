<template>
    <div class="dialog_con_box unsortable">
         <el-dialog title="" :visible.sync="childDialog.isShow" @close="close" @open="open">
            <div class="titlecals">{{title}}</div>
            <div class="content_box">
                <div class="queryForm">
                    <el-row :gutter="10">
                        <el-col :span="6">
                            <el-input
                                placeholder="门店名称/店长名称/供应商"
                                v-model="formList.groupName"
                                size="medium"
                                class="orderinp">
                            </el-input>
                        </el-col>
                        <el-col :span="18">
                            <el-button class="button-fc" type="warning" size="medium"  @click="onSearch">查询</el-button>
                            <el-button class="el-button--medium" type="primary" size="medium" @click="resetFun">重置</el-button>
                        </el-col>
                    </el-row>
                </div>
                <!-- 表格 -->
                <div class="table_list">
                    <el-table
                        border
                        @selection-change="handleSelectionChange"
                        :data="storeList"
                        ref="tableDom">
                        <el-table-column fixed show-overflow-tooltip type="selection" width="40"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="storeNumber" label="门店编码"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="storeName" label="门店名称"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="storeLeader" label="店长"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="boothNumber" label="所属摊位"></el-table-column>
                        <el-table-column show-overflow-tooltip prop="companyName" label="所属建材城"></el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="pagination_wrap">
                <pagination
                    :current-page="formList.page"
                    :pageSize="formList.limit"
                    :total="total"
                    @sizeChange="sizeChange"
                    @currentChange="currentChange">
                </pagination>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitBtn">确认</el-button>
                <el-button type="warning" @click="colseBtn">取消</el-button>
            </div>

        </el-dialog> 
    </div>
</template>
<script>
import pagination from '@/views/components/pagination'
import {

  listStorePage,

} from '@/api/price/price';
import { setTimeout } from 'timers';

export default {
    props: ["title","dateDate","datapop","menus","type","id","childDialog","storeId"],
    mounted(){
        
    },
    data(){
        return {
            curDate:[],
            curName:'',
            organizationStructureIds: [],
            remarks: '',
            startTime: '',
            endTime: '',
            searchtext: "", // 查询
            formLabelWidth: '120px',
            // 控制弹出框是否显示
            visible: true,
            storeList:[],//门店列表
            elsectVal:[], // table表单 勾选属性
            //分页
            total: 20,    // 总数
            page: 12,   // 页数
            pageSize: 20,  // 单页条数
            currentPage: 1, // 当前页
            formList:{
                page:1,
                limit:10,
                groupName:'',
            }
        }
    },
    methods: {
        close(){
            this.elsectVal=[];
        },
        open(){
            listStorePage(this.formList).then(res=>{
                this.storeList=res.data.rows;
                this.total=res.data.total;
                this.storeList.forEach((item,idx)=>{
                    if(item.storeId==this.storeId){
                        this.$nextTick(() => {
                            this.$refs.tableDom.toggleRowSelection(item,true);
                        });
                    }
                })
                
            })
        },
        // 改变table头部颜色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
                return "background: #f8f8f8;border-color: #dddddd";
            }
        },
        // 查询
        onSearch () {
            this.formList.page=1;
            this.open()    
        },
        // 门店表格 选项发生变化事件
        handleSelectionChange (val) {
            this.elsectVal = val;
        },
        // 取消按钮
        colseBtn(){
            this.$emit( "close-pop");
        },
        // 提交按钮
        submitBtn () { 
            if(this.elsectVal.length==1){
                this.$message({
                    message: '选择成功',
                    type: 'success'
                });
                this.$emit( "close-pop",this.elsectVal)
            }else if(this.elsectVal.length==0){
                this.$message({
                    message: '请选择',
                    type: 'warning'
                });
            }else{
                this.$message({
                    message: '只可选择一条',
                    type: 'warning'
                });
            }
        },
        // 重置
        resetFun(){  
            this.formList.groupName='';
            this.open()
        },
        sizeChange(val) {// 修改pageSize方法
            this.formList.page = 1;
            this.formList.limit = val;
            this.open()
        },
        currentChange(val) {// 翻页方法
            this.formList.page = val;
            this.open()
        },
    },

    components: {
        pagination
    },


}
</script>
<style scoped lang="scss">
    .dialog_con_box{
        .querybox {
            width: 100%;
            display: flex;
            justify-content: space-between;
            flex-wrap: nowrap;
            align-items: center;
            .orderinp {
                max-width: 420px;
            }
            .search_item {
                margin-bottom:20px;
                cursor: pointer;
            }
            .operationbtns {
                display: flex;
                align-items: center;                                                                                                                                                                                                                                   ;
                flex-wrap: nowrap;
                margin-left: 24px;
            }
        }
        .dialog-footer{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: nowrap;
        }
    }
</style>