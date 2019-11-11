<template>
    <div class="price_pop">
    
        <el-dialog title="" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
            <div class="titlecals">查看详情</div>
                <div class="btn_list">
                    <el-button size="small" class="button-96" @click="addFun">Cad图</el-button> 
                    <el-button size="small" class="button-96" @click="editFun">货物清单</el-button>
                    <el-button size="small" class="button-96" @click="ponitFun">其他</el-button>
                    <span>按照需要的附件类型</span>
                </div>   
                 <div  class="table_list lvs">
                    <el-table
                        :data="tableData"
                        style="width: 100%"
                        :row-class-name="tableRowClassName"
                        border >
                    <!-- :cell-style="cellStyle" :header-cell-style = "cellStyle" -->

                        <el-table-column
                            label="到货单号"
                            prop="id" sortable align="center" width="160">
                        </el-table-column>

                        <el-table-column
                            label="客户合同号"
                            prop="name" sortable  align="center" width="180">
                        </el-table-column>

                        <el-table-column
                            label="采购合同号"
                            prop="phone" sortable  align="center" width="180">
                        </el-table-column>

                        <el-table-column
                            label="柜身"
                            prop="name" sortable  align="center" width="180">
                        </el-table-column>

                        <el-table-column
                            label="门板"
                            prop="name" sortable  align="center" width="180">
                        </el-table-column>

                        <el-table-column
                            label="配件"
                            prop="name" sortable  align="center" width="180">
                        </el-table-column>
                        
                        <el-table-column
                            label="备注"
                            prop="name" sortable  align="center" width="180">
                        </el-table-column>

                    
                    </el-table>
                 </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitBtn">提交</el-button>
                    <el-button  @click="colseBtn">取消</el-button>
                </div>
        </el-dialog>
                 
    </div>
</template>
<script>
import {
  addPriceTactics,
  listPriceStrategy,
  listStore,
  editPriceStrategyById,
  deletePriceStrategy,
  inlistStore, // 价格策略下的门店列表
  editPriceStrategyStatus, // 发布撤回功能
} from 'api/price/price';

export default {
    props: ["title","dateDate","datapop","menus","type","id"],

    data(){
        return {
            tableData: [],
            curDate:[],
            curName:'',
            organizationStructureIds: [],
            remarks: '',
            startTime: '',
            endTime: '',
            formLabelWidth: '120px',
            // 控制弹出框是否显示
            visible: true,
        }
    },
    created(){
        this.visible = true;
        setTimeout(() =>{
            this.curDate = this.dateDate;
            if (this.title == "修改价格策略"){
                this.curName =  this.datapop.priceStrategyName;
                
                // this.organizationStructureIds =  this.datapop.organizationStructureIds;
                this.remarks =  this.datapop.remarks;
            }
            
        },0);
        console.log(this.id,"curId345")
        if(this.id != 0){ 
            
            console.log(this.id,"curId")
            // this.title = "修改价格策略"; // 修改弹出框名字

            this.getinStoreList(this.id); // 获取价格策略下的门店列表
            // alert(this.id)
            //     // 控制时间
            // this.curDate[0] = this.datapop.startTime ? this.datapop.startTime.split(" ")[0] : "";
            // this.curDate[1] = this.datapop.endTime ? this.datapop.endTime.split(" ")[0] : "";

                // console.log(this.dateDate,"this.editsss123");
                // console.log(this.editPrices,"this.editPrices");
                // this.$set(this.editDate,0, data1);
                // this.$refs.popTan.visible = true; // 弹出框是否显示
                // this.popTan = true;


            this.curId = 0;
            this.$emit('edit-id',0);
        }else {
            // 新增价格策略
            
            // this.randomTitle = "新增价格策略"; // 修改弹出框名字
            this.curDate = [];

        
        }

    },
    methods: {
        // 获取价格策略下的门店列表
        getinStoreList(id) {
            let data = {
                priceStrategyId: id,
            }
            console.log(data,"ljkl;ll;")
            inlistStore(data).then(res => {
                // this.gridData = res.data.rows;
                
                this.eidButton(res.data.rows);

                // this.getInfos(res.data.rows);
            }).catch(error =>{
                console.log('销售价格 获取门店列表 views/price/price', error);
            })
        },
        eidButton(datas) {
            
            var temp = datas.map(item => {
                return item.storeId;
            });
            console.log(this.organizationStructureIds,"this.organizationStructureIds1123000")
            this.organizationStructureIds = temp;
            // this.$set( this.editPrices,'organizationStructureIds', temp)        
            // this.$set( this.editPrices,'organizationStructureIds', temp)
            
        },

        dataChange(dates) {
            this.startTime = dates ? dates[0] : "";
            this.endTime = dates ? dates[1] : "";
            
            this.$emit("data-change","pop",this.curDate);
        },
        colseBtn(){
            this.$emit( "submint-change", "");
        },
        // 提交按钮
        submitBtn () {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
            // this.$emit("add-price", this.datapop);
            if(!this.curName || !this.curDate ){
                this.$message.error('价格策略名称和有效期不能为空')
                return
            }
            console.log(this.startTime,"this.starttiomepppp");
            if(!this.startTime){
                this.startTime = this.curDate[0];
                this.endTime =  this.curDate[1];
            }

            let data = {
                // ...this.datapop,
                priceStrategyName: this.curName,
                organizationStructureIds: this.organizationStructureIds,
                remarks: this.remarks,
                startTime: this.startTime,
                endTime: this.endTime,
                priceStrategyId: this.datapop.priceStrategyId, // edit
            }
            // 调用接口
            if(this.title == "新增价格策略") {
                this.addStra(data);
            }else if(this.title == "修改价格策略") {
                this.editStra(data);
            }

            // 表格数据
            this.$emit( "submint-change")

            // 清空条件
            // this.datapop.priceStrategyName = ""
            // this.datapop.organizationStructureIds = [];
            // this.datapop.remarks = ""
            // this.datapop.curDate = [];

        },

        // 新增价格策略接口
        addStra(data) {
            addPriceTactics(data).then(res => {
                console.log(res,"redssssss");
                if(res.status == 200){
                    this.$message({
                        message: '新增价格策略成功',
                        type: 'success'
                    });
                }else{
                    this.$message.error(res.message)
                } 
            }).catch(error =>{
                console.log('销售价格 销售价格维护 views/price/price', error);
            })
        },
        // 修改价格策略接口
        editStra(data) {
            editPriceStrategyById(data).then(res => {
                console.log(res,"redssssss");
                if(res.status == 200){

                    this.$message({
                        message: '修改价格策略成功',
                        type: 'success'
                    });
                    this.editPrices.priceStrategyName = "";
                    this.editDate = [];
                    this.editPrices.remarks ="",
                    this.editPrices.startTime = "",
                    this.editPrices.endTime = "",
                    this.editPrices.organizationStructureIds = [];
                    // this.editPrices.organizationStructureIds = [];
                }else{
                    this.$message.error(res.message)
                } 
            }).catch(error =>{
                console.log('销售价格 销售价格维护 修改价格策略 views/price/price', error);
            })

        },

        
    },



}
</script>
<style scoped lang="scss">
    .input_width {
        width: 60%;
    }
    
</style>