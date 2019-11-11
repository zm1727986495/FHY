<template>
    <div class="choose">
        <el-dialog
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="dialogVisible"
        width="80%"
        >
            <div class="order_tables budget_tables">
                <el-table border ref="multipleTable" :data="tabData" 
                    tooltip-effect="dark" style="width: 100%"
                    :row-class-name="tableRowClassName"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"  align="center"></el-table-column>
                    <el-table-column prop="commodityId"  align="center" label="商品编码"></el-table-column>
                    <el-table-column prop="commodityName"  align="center" label="商品名称"></el-table-column>
                    <el-table-column prop="sourcePrice"  align="center" label="当前价格" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="activityPrice"  align="center" label="加价购价格" show-overflow-tooltip></el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="coloseItem">取 消</el-button>
                <el-button type="primary" @click="setPrice()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { listPurchaseCommodity, listActivityGift} from "@/api/order/budgetdetailed/budgetdetailed";
export default {
    props:{
        sonVal:{
            type: Object,
            default: function(){
                return {
                    name:'',
                    val: 0,
                    index: 0,
                    i: 0
                }
            },
        parseInt:{
            type: Number,
            default: 0
            }
        }
    },
    data(){
        return{
            dialogVisible:true,
            tabData:[],
            activeCommdiy:[],

        }
    },
    created(){
        this.getData();
        console.log(this.sonVal);
    },
    methods:{
        handleSelectionChange(item){
            this.activeCommdiy = item;
        },
        getData(){
            let menthoItem;
            this.sonVal.name == 'higherPrice' ? menthoItem = listPurchaseCommodity : menthoItem = listActivityGift;
            menthoItem({activityRuleId: this.sonVal.val}).then(res => {
                this.tabData = res.data;
                console.log(res);
            }).catch(res=>{

            })
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        coloseItem(){
                this.$parent.coloseItem();
        },
        setPrice(){
            if (this.activeCommdiy.length == 0) {
                this.$message({message: '请勾选商品',type: 'warning'});    
                return           
            }
            if(this.activeCommdiy.length > 1){
                this.$message({message: '只能勾选一个商品',type: 'warning'});    
                return           
            }
            this.$parent.addPrice(this.activeCommdiy, this.sonVal);
            if(this.parseInt == 1) {
                this.$parent.getparseInt(this.activeCommdiy, this.sonVal);
            }else{
                this.$parent.addPrice(this.activeCommdiy, this.sonVal);
            }
        }
    }
}
</script>
<style>

</style>


