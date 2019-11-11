<template>
    <div>
        <vxe-table
                border
                height="400"
                stripe
                :edit-config="{trigger: 'click', mode: 'cell'}"
                @edit-closed="editChange"
                :data.sync="commodityHighers">
                <vxe-table-column field="commodityName" width="auto" align="center" fixed="left" min-width=250 title="商品名称" resizable show-overflow="tooltip"></vxe-table-column>
                <vxe-table-column field="commodityCode" align="center" title="商品编号"  min-width=200 ></vxe-table-column>
                <vxe-table-column field="commodityModel" align="center" title="商品型号" min-width=200 ></vxe-table-column>
                <vxe-table-column field="classifyName" align="center" title="商品分类" min-width=200 ></vxe-table-column>
                <vxe-table-column field="companyName" align="center" title="供应商" min-width=200 ></vxe-table-column>
                <vxe-table-column field="commodityWide" align="center" title="宽" min-width=100  resizable ></vxe-table-column>
                <vxe-table-column field="commodityHigh" align="center" title="高" min-width=100   resizable></vxe-table-column>
                <vxe-table-column field="commodityLong" align="center" title="深" min-width=100   resizable></vxe-table-column>
                <vxe-table-column field="amount" align="center" title="数量" min-width=100   resizable></vxe-table-column>
                <vxe-table-column field="discountRate" align="center" title="折扣率" min-width=100   resizable></vxe-table-column>
                <vxe-table-column field="nonParameter" align="center" title="非标系数" min-width=100  resizable></vxe-table-column>
                <vxe-table-column field="valuationMethod" align="center" title="计价方式" min-width=100 ></vxe-table-column>
                <vxe-table-column field="commodityColourId" align="center" title="颜色" min-width=150>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.commodityColourId" placeholder="颜色"  class="classification" @change="setColor(index)">
                            <el-option
                            v-for="item in scope.row.commodityColorList"
                            :key="item.colourId"
                            :label="item.colourName"
                            :value="item.colourId">
                            </el-option>
                        </el-select> 
                    </template>
                </vxe-table-column>
                <vxe-table-column field="commoditySeriesId" align="center" title="系列" min-width=150>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.commoditySeriesId" placeholder="系列"  class="classification" @change="setColor(index)">
                            <el-option
                            v-for="item in scope.row.seriesLsit"
                            :key="item.id"
                            :label="item.seriesName"
                            :value="item.seriesId">
                            </el-option>
                        </el-select> 
                    </template>
                </vxe-table-column>
                <vxe-table-column field="commodityMaterialId" align="center" title="材质" min-width=150 >
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.commodityMaterialId" placeholder="材质"  class="classification" @change="setColor(index)">
                            <el-option
                            v-for="item in scope.row.materialList"
                            :key="item.id"
                            :label="item.materialName"
                            :value="item.materialId">
                            </el-option>
                        </el-select> 
                    </template>
                </vxe-table-column>
                <vxe-table-column field="remarks" align="center" title="备注" min-width=300 :edit-render="{name: 'input'}"  resizable show-overflow="tooltip"></vxe-table-column>
                <vxe-table-column field="onePrice" align="center" title="单价" min-width=150 >
                    <template slot-scope="scope">
                        <div size="medium">{{scope.row.onePrice}}.00</div>
                    </template>                    
                </vxe-table-column>
                <vxe-table-column field="discountPrice" align="center" title="活动价" min-width=150 >
                    <template slot-scope="scope">
                        <div size="medium">{{scope.row.discountPrice}}.00</div>
                    </template>
                </vxe-table-column>
        </vxe-table>       
    </div>
</template>
<script>
export default {
     props: {
        commodityHighers:{
            type: Array,
            default() {
                return []
            }
        }
     },
     data() {
       return {
       };
     },
   }
</script>
<style lang="scss" scoped>
.operation{
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: flex-start;
}
.classification{
    width: 105px;
    margin: 0 10px;
}
.commodity-checkbox span{
    font-size: 14px;
    color: #aeaeae;
}
.rooms-heade{
    display: flex;
    align-items: center;
    margin:12px 0;
    justify-content:space-between;
}
.rooms-heade-left{
    display: flex;
    align-items: center;
}
.rooms-heade-right{
    display: flex;
    align-items: center;
}
.rooms-heade-l, .rooms-heade-r{
    display: flex;
    align-items: center;
    flex-direction: column;
    align-items: flex-end;
}
.rooms-heade-r{
    align-items: flex-start !important;
}
.rooms-item{
    background: #fcfcfc;
    border: 1px solid #e6e6e6;
    margin-bottom: 20px;
}
.commodity-checkbox{
    min-height: 30px;
    padding: 10px 10px; 
    flex-wrap: wrap;
}
.commodity-title{
    border-top: 1px solid #e6e6e6; 
    display: flex;
    height:144px;
    padding-top:25px; 
    padding:  24px 10px 20px 10px ;
}
.room-checkbox{
    margin-top: 14px;
}
.commodity-group{
    margin-left: 44px;
    flex-flow: wrap;
    width:100%;
}
.commodity-number{
    width: calc((100% - 44px)/3);
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
}
.commodity-select{
    width: 17%;
}
.h-w80{
  width: calc(100% - 88px);
  height: 1px;
  margin: 0 0 25px 44px;
  background: #d9d9d9;    
}
.rooms-input{
    padding: 0 54px 0 50px;
    display: flex;
    align-items: center;
}
.rooms-color{
    color: #0963b8;
}
.rooms-measure{
    width: 8%;
    display: flex;
    align-items: center;
    margin-left: 2%;
}
.rooms-calculation{
    width: 16%;
    display: flex;
    align-items: center;
}
.rooms-size{
    width: 160px;
    text-align: center;
}
.mus-left{
    margin-left: calc(6% + 4px);
}
.nums-size{
    width: 80px;
}
.rooms-remarks{
    display: flex;
    padding: 0 44px 0 54px;
    margin-bottom: 20px;
}
.remarks-title{
    width: 61px;
}
.subtotal{
    height: 16px;
    line-height: 16px;
    font-size: 16px;
    margin-bottom:10px;
}
.activityPrice{
    height: 18px;
    line-height: 18px;
    font-size:18px;
}
.remarks-content{
    display: flex;
    width: 80%;
}
.roomPrice{
    width:19%;
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    justify-content:space-around;
}
.roomPrice-input{
    width: 100px;
}
.roomPrice-num{
    font-size: 16px;
}
.prices{
    position: absolute;
    right:20px;
    top: 10px;
    z-index: 99;
    color: red;
}
.titlecal {
    font-size: 18px;
    line-height: 1;
    position: relative;
    font-weight: 500;
    color: #006EC7;
    padding-left: 15px;
    margin-bottom: 20px;
}
.titlecal::before {
    content: " ";
    display: inline-block;
    width: 4px;
    height: 15px;   
    position: absolute;
    top: 10px;
    left: 0;
    margin-right: 10px; 
    background: #006EC7;
    border-radius: 5px;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
}
.discountCard{
    padding:0 20px;
}
.discountItem{
    margin:0 10px;
    border-bottom:1px solid #d9d9d9;
}
</style>