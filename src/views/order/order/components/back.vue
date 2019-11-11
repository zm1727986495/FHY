<template>
    <!-- 弹框页面 -->
    <div style="width:100%;">
        <div class='Dialog_input_cell'>
            <div class='Dialog_content'>
                <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-dynamic">

                    <el-form-item
                        prop="isScrap">
                        <el-checkbox v-model= "ruleForm.whether" >当前订单有收款信息，无法作废，是否走退单流程</el-checkbox>
                    </el-form-item>

                     <el-form-item label="退单原因：" prop="desc" :rules="[
                          { required: true, message: '请输入作废原因', trigger: 'blur' },
                      ]">
                            <el-input
                                type = "textarea"
                                :rows = "2"
                                placeholder = "请输入内容"
                                v-model = "ruleForm.desc">
                            </el-input>
                  
                    </el-form-item>

                    
                </el-form>

            </div>
        </div>
        <!-- <div class='Dialog_input_cell'>
            <div class='Dialog_content'>
            <el-checkbox v-model="whether">当前订单有收款信息，无法作废，是否走退单流程</el-checkbox>
            <div class='reasons'>
                <span class='fontWidth'>退单原因：</span>
                <el-input
                   type="textarea"
                   :rows="2"
                   placeholder="请输入内容"
                   v-model="textarea">
                </el-input>
            </div>
            </div>
        </div> -->
    </div>
</template>
<script>

export default {
    data() {
        return {
            ruleForm: {
                whether: false,
                desc: ''
            }
        }
    },
    mounted() {
    },
    methods:　{},
        
}
</script>
<style scoped  lang="scss">
    .Dialog_input_cell{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .Dialog_content{
        width: 30vw;
    }
    .reasons{
        display: flex;
        flex-direction:row;
        margin-top:15px;
    }
    .redStar{
        color: #f15858;
        font-size:14px;
    }
    .reasons .fontWidth{
        width: 6em;
        position: relative;
    }

</style>
<style>

</style>

