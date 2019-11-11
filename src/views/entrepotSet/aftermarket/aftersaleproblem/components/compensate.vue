<template>
    <div class="compensate">
        <!-- 新增问题单 -->
        <el-dialog :visible.sync="visibleDialogs" width="950px" center :before-close="closefun">
            <div class="titlecals">赔偿填写</div>
            <div>
                <el-form :label-position="labelPosition" 
                    label-width="130px" 
                    :model="fromdata" 
                    class="demo_form_inline">
                    <el-form-item label="商城名称">wt213412312</el-form-item>
                    <el-form-item label="合同编号">wt213412312</el-form-item>
                    <el-form-item label="客户姓名">wt213412312</el-form-item>
                    <el-form-item label="客户地址">wt213412312</el-form-item>
                    <el-form-item label="联系电话">wt213412312</el-form-item>
                    <el-form-item label="材质">wt213412312</el-form-item>
                    <el-form-item label="下单日期">wt213412312</el-form-item>
                    <el-form-item label="合同签字日期">wt213412312</el-form-item>
                    <el-form-item label="交单日期">wt213412312</el-form-item>
                    <el-form-item label="交货日期">wt213412312</el-form-item>
                    <el-form-item label="到货日期">wt213412312</el-form-item>
                    <el-form-item label="安装日期">wt213412312</el-form-item>
                </el-form>
                <el-form :label-position="labelPosition" 
                    label-width="130px" 
                    :model="fromdata" 
                    class="demo_form_inline">
                    <el-form-item label="户名">
                        <el-input v-model="fromdata.customerName" size="medium" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="开户账号">
                        <el-input v-model="fromdata.customerName" size="medium" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="开户银行卡地址">
                        <el-input v-model="fromdata.customerPhone" size="medium" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="减收金额">
                        <el-input v-model="fromdata.customerName" size="medium" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="处罚金额">
                        <el-input v-model="fromdata.customerName" size="medium" placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="责任判定">
                        <el-input v-model="fromdata.customerPhone" size="medium" placeholder=""></el-input>
                    </el-form-item>
                </el-form>

                <el-form :label-position="labelPosition" 
                    label-width="130px" 
                    :model="fromdata" 
                    class="demo_form_inline">
                    <el-form-item label="原因简述" class="widmax">
                        <el-input type="textarea" v-model="fromdata.desc"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button type="primary" @click="submitcompensate">确认打印</el-button>
                <el-button type="primary" @click="submitcompensate">上传照片</el-button>
                <el-button @click="closefun">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            visibleDialogs: this.visibleDialog,
            fromdata: {},
            orderq: [],
            labelPosition: 'right',
        }
    },
    props: ["visibleDialog"],
    methods: {
        closefun(){
            this.$emit("submitcompensate")
        },
        submitcompensate(){
            this.visibleDialogs = false;
            this.$emit("submitcompensate",this.fromdata)
        }
    },
}
</script>
<style lang="scss">
.compensate{
    .demo_form_inline{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .widmax{
            width: 100%;
        }
        >div{
            width: 30%;

        }
    }

}
</style>