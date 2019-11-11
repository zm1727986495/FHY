<template>
    <div class="order_tables budget_tables">
    <div class="m-bottom" >         
            <orderdetail></orderdetail>
    </div>
            <el-table :data="rommTable" border >
                <el-table-column align="center" prop="roomName" label="所属房间" width=150>
                </el-table-column>
                <el-table-column align="center" prop="commodityCode" label="商品编号" show-overflow-tooltip width=150>
                </el-table-column>
                <el-table-column align="center" prop="commodityName" label="商品名称" show-overflow-tooltip width=150>
                </el-table-column>
                <el-table-column align="center" prop="classifyName" label="商品分类" show-overflow-tooltip width=150>
                </el-table-column>
                 <el-table-column align="center" prop="commodityColor" label="商品颜色" width=200>
                </el-table-column> 
                <el-table-column align="center" prop="materialName" label="商品材质" width=200>
                </el-table-column>
                <el-table-column align="center" prop="seriesName" label="商品系列" width=200>
                </el-table-column>
                <el-table-column align="center" prop="commodityWide" label="宽" width=80>
                </el-table-column>
                <el-table-column align="center" prop="commodityHigh" label="高" width=80>
                </el-table-column>
                <el-table-column align="center" prop="commodityLong" label="深" width=80>
                </el-table-column>
                <el-table-column align="center" prop="nonParameter" label="非标系数" width=180>
                </el-table-column>
                <el-table-column align="center" prop="discountRate" label="折扣率" width=180>
                </el-table-column>
                <el-table-column align="center" prop="amount" label="数量" width=50>
                </el-table-column>
                <el-table-column align="center" prop="remarks" label="备注" width=300 show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="center" prop="discountPrice" label="活动价" width=300 show-overflow-tooltip>
                </el-table-column>
            </el-table>
    </div>
</template>
<script>
import { getOrderBudget, listCommodityColour } from "@/api/order/budgetdetailed/budgetdetailed";
import { listCommoditySeries, listCommodityMaterial } from '@/api/administrationCenter/stockmanagement/index';
import orderdetail from "@/views/order/components/orderdetail";
export default {
    components:{
        orderdetail
    },
    data(){
        return {
            rommTable:[],
            rommList:[],
            orderRoom:null
        }
    },
    created(){
        this.getData(this.$route.query.budgetId);
    },
    methods:{
        value(){
            this.rommTable=[];
            this.rommList.map(res => {
                res.commodity.map(ite=>{ 
                    ite.roomName = res.roomName;
                    this.rommTable.push(ite);
                })
            })
        },
        getData(val){
            getOrderBudget({budgetId: val}).then( res=> {
                this.rommList = [];
                let arr = [];
                this.orderRoom = res.data;
                // this.budgetId = res.data.budgetId;
                // this.orderId = res.data.orderId;
                // res.data.isActivityPackage = 0;
                // let date = {
                //     versionName: res.data.versionName,
                //     budgetNumber: res.data.budgetNumber,
                //     isActivityPackage: res.data.isActivityPackage,
                //     activityId:  res.data.activityId,
                //     calculateWay: res.data.calculateWay,
                //     priceStrategyId: Number(res.data.priceStrategyId)
                // }
                // this.$refs.addSercet.setName(date);
                res.data.commodity.forEach( item=> { 
                    this.setcColors(Number(item.commodityId)).then(color =>{ item.commodityColorList = color;})
                        this.setcMaterial(Number(item.commodityId)).then(material => {item.materialList = material; });
                        this.seriesLsit(Number(item.commodityId)).then(seriesLsit => {item.seriesLsit = seriesLsit; });
                        item.checked = false;
                        item.onePrice = Number(item.onePrice);
                        item.commodityId = Number(item.commodityId) 
                        item.commodityUnit = item.valuationMethod;
                        item.discountPrice = Number(item.discountPrice);
                        item.activityRules = [];
                        item.commodityWide = item.commodityWidth;
                        item.checkedList = [];
                        item.childrenGoods = [];
                        item.nonParameter = Number(item.nonParameter).toFixed(2);
                        item.checkedShow = [];
                        item.commoditySeriesId = item.commoditySeriesId != null ? Number(item.commoditySeriesId) : null;
                        item.commodityMaterialId = item.commodityMaterialId != null ?  Number(item.commodityMaterialId): null;
                        item.commodityColourId = item.commodityColorId != null ?  Number(item.commodityColorId) : null;
                        item.commoditySeries = '';
                        item.commodityMaterial = '';
                        item.commodityColour= '';
                        item.roomCode = Number(item.roomCode);
                        console.log(item)    
                        item.amount = Number(item.amount);
                        console.log(item)
                        if(this.rommList[item.roomCode] != undefined ){
                            this.rommList[item.roomCode].commodity.push(item);
                        } else {
                            this.rommList[item.roomCode] = {};
                            this.rommList[item.roomCode].commodity = [];
                            this.rommList[item.roomCode].checked = false;
                            this.rommList[item.roomCode].commodity.push(item);
                            this.rommList[item.roomCode].roomCode =  Number(item.roomCode);
                            this.rommList[item.roomCode].roomName = `房间0${item.roomCode + 1}`;
                            this.rommList[item.roomCode].roomId = Number(item.roomId);
                        }
                    })
                    this.value();
            }).catch( error=> {
                console.log(error);
            })
        },
/**
         * 获取商品颜色
         * @method setcolors
         */
        setcColors(commodityId){
            return  new Promise((resolve, reject) => {
                listCommodityColour({commodityId: commodityId}).then(el => {
                        resolve(el.data)
                }).catch(error => {
                    console.log('新增预算清单 获取商品颜色接口 views/order/budgetdetailed/add/addTranslate.vue')
                })
            });
        },
        /**
         * 获取商品材质
         * @method setcMaterial
         */
        setcMaterial(commodityId){
            return  new Promise((resolve, reject) => {
                listCommodityMaterial({commodityId: commodityId}).then(el => {
                    resolve(el.data);
                }).catch(error => {
                    console.log('新增预算清单 获取商品材质接口 views/order/budgetdetailed/add/addTranslate.vue')                        
                })
            });
        },
        /**
         * 获取商品系列
         * @method seriesLsit
         */
        seriesLsit(commodityId){
              return new Promise((resolve, reject) => {
                    listCommoditySeries({commodityId: commodityId}).then(el => {
                        resolve(el.data);
                    }).catch(error => {
                        console.log('新增预算清单 获取商品系列接口 views/order/budgetdetailed/add/addTranslate.vue')                        
                    })
                });
        },
    }
}
</script>
<style lang="scss" scoped >

</style>