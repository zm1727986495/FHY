<template>
    <div class="violadetail">
 
        <div class="list_select">
            <div class="viola_detail_list">
                <span>违规单号</span>
                <el-input
                    label="违规单号"
                    placeholder="请输入内容"
                    v-model="violorder"
                    clearable disabled>
                </el-input>
            </div>

            <div class="viola_detail_list">
                <span>违规类型</span>
                <el-select v-model="violtype"  placeholder="违规类型" size="medium">
                    <el-option
                        v-for="item in typeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>

            <div class="viola_detail_list">
                <span>违规等级</span>
                <el-select v-model="violrate"  placeholder="违规等级" size="medium">
                    <el-option
                        v-for="item in typeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="viola_detail_list">
                <span>合同金额</span>
                <el-input
                    label="合同金额"
                    placeholder="请输入内容"
                    v-model="contmoney"
                    clearable disabled>
                </el-input>
            </div>
            <div class="viola_detail_list">
                <span>少收金额</span>
                <el-input
                    label="少收金额"
                    placeholder="请输入内容"
                    v-model="lessmoney"
                    clearable disabled>
                </el-input>
            </div>
            <div class="viola_detail_list">
                <span>正确折后金额</span>
                <el-input
                    label="正确折后金额"
                    placeholder="请输入内容"
                    v-model="corrmoney"
                    clearable disabled>
                </el-input>
            </div>
            <div class="viola_detail_list">
                <span>店长</span>
                <el-select v-model="manager.name"  placeholder="店长" size="medium">
                    <el-option
                        v-for="item in managerList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
                <div class="viola_detail_list">
                <span>店长扣分</span>
                <el-input
                    label="店长扣分"
                    placeholder="请输入内容"
                    v-model="manager.ponits"
                    clearable disabled>
                </el-input>
            </div>
            <div class="viola_detail_list">
                <span>店长罚款</span>
                <el-input
                    label="店长罚款"
                    placeholder="请输入内容"
                    v-model="manager.money"
                    clearable disabled>
                </el-input>
            </div>
            <div class="viola_detail_list">
                <span>设计师</span>
                <el-select v-model="designer.name"  placeholder="设计师" size="medium">
                    <el-option
                        v-for="item in designerList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="viola_detail_list">
                <span>设计师罚款</span>
                <el-input
                    label="设计师罚款"
                    placeholder="请输入内容"
                    v-model="designer.money"
                    clearable disabled>
                </el-input>
            </div>
                <div class="viola_detail_list">
                <span>设计师扣分</span>
                <el-input
                    label="设计师扣分"
                    placeholder="请输入内容"
                    v-model="designer.ponits"
                    clearable disabled>
                </el-input>
            </div>
            <div class="viola_detail_list">
                <span>销售</span>
                <el-select v-model="sale.name"  placeholder="销售" size="medium">
                    <el-option
                        v-for="item in saleList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="viola_detail_list">
                <span>销售罚款</span>
                <el-input
                    label="销售罚款"
                    placeholder="请输入内容"
                    v-model="sale.money"
                    clearable disabled>
                </el-input>
            </div>
            <div class="viola_detail_list">
                <span>销售扣分</span>
                <el-input
                    label="销售扣分"
                    placeholder="请输入内容"
                    v-model="sale.points"
                    clearable disabled>
                </el-input>
            </div>

            <div class="viola_detail_list">
                <span>店面业绩</span>
                <el-input
                    label="店面业绩"
                    placeholder="请输入内容"
                    v-model="results"
                    clearable disabled>
                </el-input>
            </div>
            <div class="viola_detail_list viola_detail_disc">
                <span>应收折扣明细</span>
                <el-input
                    label="应收折扣明细"
                    placeholder="请输入内容"
                    v-model="discount"
                    clearable disabled>
                </el-input>
            </div>
            <div class="viola_detail_list viola_detail_desc">
                <span>违规描述</span>
                <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="desc">
                </el-input>
            </div>

        </div>

    </div>
    
</template>

<script>

  export default {
    data() {
        return {
            violorder: '',
            violtype: '',
            violrate: '',
            contmoney: '',
            lessmoney: '',
            corrmoney: '',
            manager:{
                ponits:'',
                money:'',
                name:'',
            },
            designer: {
                ponits:'',
                money:'',
                name:'',
            },
            sale: {
                ponits:'',
                money:'',
                name:'',
            },
            results: '',
            discount : '',
            desc: '',

            saleList: [],
            typeList:[],
            managerList: [],
            designerList: [],
            
        };
    },
    // props: [],
    props: {
        // 该组件是否显示button
       
    },
    mounted() {

    },
    created() {
        
    },
    methods: {


    },
    computed: {}
  };
</script>

<style lang="scss" scoped>
   .violadetail {
       width: 100%;
       .list_select{
           display: flex;
           align-items: center;
           justify-content: space-around;
           flex-wrap: wrap;
           .viola_detail_list {
               display: flex;
               justify-content: center;
               align-items: center;
               flex-wrap: nowrap;
               margin-bottom: 10px;
               width: 30%;
               >span{
                   min-width: 120px;
                   text-align: right;
                   display: inline-block;
                   box-sizing: border-box;
                   padding-right: 12px;
               }
           }
           .viola_detail_desc {
               width: 100%;
           }
           .viola_detail_disc{
               flex: 1;
           }
       }
   } 
  
      
</style>



