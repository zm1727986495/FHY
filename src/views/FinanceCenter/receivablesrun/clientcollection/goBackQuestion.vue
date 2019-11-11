<template>
    <div class="unsortable">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card v-if="datas.length">
            <div class="titles">退回原因</div>
            <div>
                <ul style="margin-top:20px;" v-for="(item,idx) in datas" :key="idx">
                    <li style="display:inline-block;width:30%">
                        <span style="display:inline-block;width:100px;text-align:right;">退回人：</span>
                        <div style="display:inline-block">{{item.createName}}</div>
                    </li>
                    <li style="display:inline-block;width:30%">
                        <span style="display:inline-block;width:100px;text-align:right;">退回时间：</span>
                        <div style="display:inline-block">{{item.createTime}}</div>
                    </li>
                    <li style="display:inline-block;width:30%">
                        <span style="display:inline-block;text-align:right;float:left">退回原因：{{item.returnReason}}</span>
                    </li>
                </ul>
            </div>
            
        </el-card>
        <el-card class="m-top20">
            <collectionInformation @goBackQuestion="question" :childTable="obj"></collectionInformation>
        </el-card>
        
    </div>
</template>
<script>
import collectionInformation from './collectionInformation'
import breadcrumb from "@/views/components/breadcrumb";
export default {
    components:{
        collectionInformation,
        breadcrumb,
    },
    mounted() {
        this.navList = this.$route.meta;
    },
    data(){
        return{
            textArea:'',
            navList:[],
            datas:[],
            obj:{
                multiSelection:[]
            }
        }
    },
    methods: {
        question(val){
            if(val.returnOrderCollectMonies){
                this.datas=val.returnOrderCollectMonies
            }
        }
    },
}
</script>
<style scoped>
    .titles{
        position: relative;
        font-size: 20px;
        padding-left:30px;
        color:#006EC7;;
    }
    .titles::after {
        content: "";
        display: block;
        width: 4px;
        height: 20px;
        background: #006EC7;
        position: absolute;
        left:15px;
        top: 50%;;
        margin-top:-10px;
        border-radius: 5px;
    }
</style>
