<template>
    <div>
        <div class="destory_nav">报价单</div>
        <div class="destory_table">
            <el-table
                :data="tableData"
                border
                stripe
                style="width: 100%">
                <el-table-column
                prop="num"
                label="报价单编号"
                align="center">
                </el-table-column>
                <el-table-column
                prop="date"
                label="创建时间"
                align="center">
                </el-table-column>
                <el-table-column
                prop="priceName"
                label="报价单名称"
                align="center">
                </el-table-column>
                <el-table-column
                prop="brand"
                label="品牌"
                align="center">
                </el-table-column>
                <el-table-column
                prop="sum"
                label="产品数量"
                align="center">
                </el-table-column>
                <el-table-column
                prop="money"
                label="金额"
                align="center">
                </el-table-column>
                <el-table-column
                prop="name"
                label="创建人"
                align="center">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            tableData: [{
                date: '2016-05-02',
                num: 'Sq13215613',
                priceName:"-",
                brand:"欧派",
                sum:13,
                money:2344,
                name:"张扬"
                },{
                date: '2016-05-02',
                num: 'Sq13215613',
                priceName:"-",
                brand:"欧派",
                sum:13,
                money:2344,
                name:"张扬"
                }]
        }
    }
}
</script>
<style>
    .destory_table{
        width:800px;
    }
</style>