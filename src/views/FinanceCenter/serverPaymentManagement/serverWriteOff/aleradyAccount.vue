<template>
    <div class="simTable table_list unsortable">
        <el-table
            :data="tableData"
            style="width: 100%;"
            border
            row-key="id"
            :row-class-name="tableRowClassName"
            ref="topicTable">
            <el-table-column
            prop="paymentNumber"
            align="center"
            label="支出单号"
            width="180"
            show-overflow-tooltip
            fixed
            >
              <template slot-scope="scope">
                <div>
                    <!-- <el-tooltip placement="right" visible-arrow >
                        <div slot="content" class="tips tipFon">
                            <p class="operaItems">销账</p>
                        </div>
                        <img :src="spot" alt="" class=" attributesTips">
                    </el-tooltip> -->
                    <span class="table_action_span" @click="jumpMoney(scope.row)">{{scope.row.paymentNumber}}</span>
                </div>
            </template>
            </el-table-column>
            <el-table-column
            width="100"
            align="center"
            prop="sellMonth"
            show-overflow-tooltip
            label="记账月份">
            </el-table-column>
            <el-table-column
            width="130"
            align="center"
            prop="paymentMoney"
            show-overflow-tooltip
            label="支付金额">
            </el-table-column>
            <el-table-column
            width="150"
            align="center"
            prop="customerName"
            show-overflow-tooltip
            label="客户名称">
            </el-table-column>
            <el-table-column
            width="150"
            align="center"
            show-overflow-tooltip
            prop="customerPhone"
            label="联系电话">
            </el-table-column>
            <el-table-column
            width="370"
            align="center"
            prop="address"
            show-overflow-tooltip
            label="客户地址">
            </el-table-column>
            <el-table-column
            width="130"
            align="center"
            prop="paymentTypeName"
            show-overflow-tooltip
            label="支付方式">
            </el-table-column>
            <el-table-column
            width="130"
            align="center"
            show-overflow-tooltip
            prop="accountName"
            label="开户名">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="affiliatedBank"
            label="收款银行">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="bankCardNumber"
            label="收款账号">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="isPrinting"
            label="是否打印">
            <template slot-scope="scope">
                <div>
                    {{scope.row.isPrinting==0?"是":"否"}}
                </div>
            </template>
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="comAccountName"
            label="付款公司">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="comOpeningBankName"
            label="付款银行">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            show-overflow-tooltip
            prop="comBankCardNumber"
            label="支付账号">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="createName"
            show-overflow-tooltip
            label="创建人">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="createTime"
            show-overflow-tooltip
            label="创建时间">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="sellAtName"
            show-overflow-tooltip
            label="记账人">
            </el-table-column>
            <el-table-column
            width="180"
            align="center"
            prop="sellTime"
            show-overflow-tooltip
            label="记账时间">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import pagination from '../../../components/pagination';
import spot from '@/assets/images/spot.png';
export default {
    props:["tableData"],
    components:{
        pagination
    },
    data(){
        return{
            currentPage:1,
            pageSize:10,
            total:10,
            spot:spot,
            expands:[],
        }
    },
    methods:{
        cellStyle({row, column, rowIndex, columnIndex}){
            // console.log(column,columnIndex)
            if(columnIndex === 1){ // 指定坐标-- 第一列
                return 'borderRight:none'
            }else{
                return ''
            }
        },
        jumpMoney(val){
            this.$emit("showDialog",val)
            // this.$router.push({
            //     path:'/serverCollection/collectionInformation',
            //     query:{
            //         id:val.collectMoneyId,
            //         edit:true,
            //         close:true,
            //     }
            // })
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        currentChange(val) {
            this.currentPage = val;
        //   this.getListData();
        },
        sizeChange(val) {
            this.currentPage = 1;
            this.pageSize = val;
        //   this.getListData();
        },
        rowClick(row){
            console.log(row);
            if (this.expands.indexOf(row.id) < 0) {
                    this.expands = [];
                    this.expands.push(row.id);
                } else {
                    let arr = this.expands.indexOf(row.id);
                    this.expands.splice(arr,1);
                }
        }
    }
}
</script>
<style scoped>

</style>
