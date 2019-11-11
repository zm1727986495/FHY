<template>
    <div class="order_table table_list budgetInfo">
        <div class="disflex">
            <div></div>
            <div>
                <el-button type="primary" size="small" @click="exportfun">导出</el-button>
            </div>
        </div>
        <div id="table1">
            <!-- 成品 -->
            <el-table :data="rommTable" border v-if="orderGoodsType == 1">
                <el-table-column align="center" prop="commodityName" label="名称" show-overflow-tooltip width=150></el-table-column>
                <el-table-column align="center" prop="commodityNumber" label="货号" show-overflow-tooltip width=120></el-table-column>
                <el-table-column align="center" prop="commodityModel" label="规格" width=120></el-table-column>
                <el-table-column align="center" prop="commodityColour" label="商品颜色" width=200>
                    <template  slot-scope="scope">
                        <el-select v-model="scope.row.commodityColourId" placeholder="颜色"  class="classification" disabled 
                            @change="setColor(index,scope.row)">
                            <el-option v-for="item in scope.row.commodityColorList"
                            :key="item.colourId" :label="item.colourName" :value="item.colourId">
                            </el-option>
                        </el-select> 
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="onePrice" label="单价" width=120></el-table-column>
                <el-table-column align="center" prop="amount" label="数量" width=50></el-table-column>
                <el-table-column align="center" prop="discountPrice" label="价格" width=120></el-table-column>
                </el-table-column>
            </el-table>
            <!-- 定制品 -->
            <el-table :data="rommTable" border v-else-if="orderGoodsType == 2">
                <el-table-column align="center" prop="roomName" label="房间" width=150></el-table-column>
                <el-table-column align="center" prop="classifyName" label="分类" show-overflow-tooltip width=150></el-table-column>
                <el-table-column align="center" prop="commodityName" label="名称" show-overflow-tooltip width=150></el-table-column>
                <el-table-column align="center" prop="commodityWide" label="宽" width=80></el-table-column>
                <el-table-column align="center" prop="commodityHigh" label="高" width=80></el-table-column>
                <el-table-column align="center" prop="commodityColour" label="商品颜色" width=200>
                    <template  slot-scope="scope">
                    <el-select v-model="scope.row.commodityColourId" placeholder="颜色"  class="classification" disabled  @change="setColor(index,scope.row)">
                        <el-option v-for="item in scope.row.commodityColorList"
                        :key="item.colourId" :label="item.colourName" :value="item.colourId">
                        </el-option>
                    </el-select> 
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="amount" label="数量" width=50></el-table-column>
                <el-table-column align="center" prop="onePrice" label="单价" width=120></el-table-column>
                <el-table-column align="center" prop="nonParameter" label="非标系数" width=180></el-table-column>
                <el-table-column align="center" prop="discountRate" label="折扣率" width=180></el-table-column>
                <el-table-column align="center" prop="remarks" label="备注" width=300 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="discountPrice" label="价格" width=120></el-table-column>
            </el-table>
            <el-table :data="rommTable" border v-else>
                <el-table-column align="center" prop="roomName" label="所属房间" width=150></el-table-column>
                <el-table-column align="center" prop="commodityWide" label="宽" width=80></el-table-column>
                <el-table-column align="center" prop="commodityHigh" label="高" width=80></el-table-column>
                <el-table-column align="center" prop="commodityLong" label="深" width=80></el-table-column>
                <el-table-column align="center" prop="commodityCode" label="商品编号" show-overflow-tooltip width=150></el-table-column>
                <el-table-column align="center" prop="commodityName" label="商品名称" show-overflow-tooltip width=150></el-table-column>
                <el-table-column align="center" prop="classifyName" label="商品分类" show-overflow-tooltip width=150></el-table-column>
                <el-table-column align="center"  label="商品颜色" width=200>
                    <template  slot-scope="scope">
                    <el-select v-model=" scope.row.commodityColourId "  class="classification"  :disabled="seclect">
                        <el-option v-for="item in scope.row.commodityColorList"
                        :key="item.colourId" :label="item.colourName" :value="item.colourId" >
                        </el-option>
                    </el-select> 
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="materialName" label="商品材质" width=200></el-table-column>
                <el-table-column align="center" field="seriesName"  label="商品系列" width=200></el-table-column>
                <el-table-column align="center" prop="nonParameter" label="非标系数" width=180></el-table-column>
                <el-table-column align="center" prop="discountRate" label="折扣率" width=180></el-table-column>
                <el-table-column align="center" prop="amount" label="数量" width=50></el-table-column>
                <el-table-column align="center" prop="remarks" label="备注" width=300 show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import { getOrderBudget, exportOrderBudgetCommodity } from "@/api/order/budgetdetailed/budgetdetailed";
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
     props: {
        rommList:{
            type: Array,
            default() {
                return []
            }
        },
        orderGoodsType:{
            type: [String, Number],
        },
     },
    data(){
        return {
            rommTable:[],
            seclect: false
        }
    },
    created(){
        this.getData();

    },
    mounted(){
        this.seclect = true;
    },
    methods:{
        exportfun(){
            console.log(this.rommTable);
            let data = {
                orderGoodsType: this.orderGoodsType,
                orderBudgetDetailList: []
            }
            this.rommTable.forEach(item =>{
                data.orderBudgetDetailList.push({
                    commodityName: item.commodityName,
                    commodityModel: item.commodityModel,
                    color: item.commodityColor,
                    roomName: item.roomName,
                    commodityNumber: item.commodityNumber,
                    onePrice: item.onePrice,
                    amount: item.amount,
                    discountPrice: item.discountPrice,
                })
            })
            var wb = XLSX.utils.table_to_book(document.querySelector("#table1"));
            var wbout = XLSX.write(wb, {
                bookType: "xlsx",
                bookSST: true,
                type: "buffer"
            });
            try {
            FileSaver.saveAs(
                new Blob([wbout], { type: "application/octet-stream" }),
                "导出清单预览.xlsx"
            );
            } catch (e) {
                console.log(e);
            }
            // exportOrderBudgetCommodity(data).then(res =>{
            //     if(res.status == 200){
            //         console.log(res);
            //     }
            // }).catch(error =>{
            //     console.log('预算清单：清单预览导出', error);
            // })
        },
        getData(){
            this.rommTable=[];
            this.rommList.map(res => {
                res.commodity.map(item=>{ 
                    item.roomName = res.roomName;
                    this.rommTable.push(item);
                })
            })
        }
    }
}
</script>
<style lang="scss" scoped >
.budgetInfo{

    .disflex{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 10px 0px;
    }
}
</style>