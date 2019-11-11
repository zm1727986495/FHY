<template>
    <div class="unsortable">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <collectionInformation :childTable="multiSelection"></collectionInformation>
        </el-card>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import collectionInformation from './collectionInformation'
export default {
    components: {
        breadcrumb,
        collectionInformation
    },
    data(){
        return{
            navList: [],
            multiSelection:{
                multiSelection:[]
            }
        }
    },
    mounted() {
        // 头部面包屑
        this.navList = this.$route.meta;
        // 代收款--获取表格数据
        // this.getListData();
    },
}
</script>
<style scoped>

</style>
