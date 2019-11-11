<template>
    <!-- 弹框页面 -->
    <div style="width:100%;">
        <div class='Dialog_input_cell'>
            <div class='Dialog_content'>
                <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-dynamic">

                    <el-form-item
                        prop="whether">
                        <el-checkbox v-model= "ruleForm.whether" >是否确定作废</el-checkbox>
                    </el-form-item>

                     <el-form-item label="作废原因：" prop="desc">
                        <el-input type="textarea" v-model="ruleForm.desc" :rows = "2" placeholder = "请输入内容">
                     </el-input>
                    </el-form-item>

                    
                </el-form>
            </div>
        </div>

    </div>
</template>
<script>

export default {
    data() {
        return {
            ruleForm: {
                whether: true,
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
        .fontWidth{
            width: 6em;
            position: relative;
        }
    }

</style>
<style>

</style>

