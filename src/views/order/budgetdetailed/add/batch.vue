<template>
    <div class="batch">
        <el-dialog 
        :visible.sync="dialogBatch"
        width="40%">
            <div class="titlecals">批量设置尺寸</div>
        <div class="flex-div itemList">
            <div class="item flex-div">
                宽：
                <el-input v-model="dataSize.commodityWide"></el-input>
            </div>
            <div class="item flex-div">
                高：
                <el-input v-model="dataSize.commodityHigh"></el-input>
            </div>
            <div class="item flex-div">
                深：
                <el-input v-model="dataSize.commodityLong"></el-input>
            </div>
        </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogBatch = false" >取 消</el-button>
                <el-button type="primary" @click="replaceSizz()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                dataSize:{                
                    commodityWide:'',
                    commodityHigh:'',
                    commodityLong: ''
                },
                dialogBatch: false
            }
        },
        methods:{
            replaceSizz(){
                if(this.dataSize.commodityWide == '' && this.dataSize.commodityHigh== '' && this.dataSize.commodityLong =='') {
                    this.$message({message: '长 宽 高 不能全部为空', type: 'warning'});
                    return; 
                }
                let datas = {};
                for(var i in this.dataSize) {
                    if (this.dataSize[i] != ''){
                        datas[i] = this.dataSize[i];
                    }
                }
                this.$parent.setSize(datas);
                this.dialogBatch = false;
            }
        }
    }
</script>
<style scoped lang="scss">
.batch{
    .itemList{
        justify-content:space-between;
        .item{
            width: 25%;
        }
    }
}
</style>