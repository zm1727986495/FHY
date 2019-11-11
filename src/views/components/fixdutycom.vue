<template>
    <div class="fixduty">
        <!-- 定责 -->
        <div class="titlecals">定责</div>
        <el-form label-position="right" 
            label-width="100px"
            class="fixdutyfrom">
            <el-form-item label="是否定责？">
                <el-radio-group v-model="resource">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="定责单号" v-if="resource == 1">pd21312312</el-form-item>
            <el-form-item label="来源" v-if="resource == 1">
                <el-select v-model="orderStatus" size="medium">
                    <el-option
                        v-for="item in stateList" :key="item.value"
                        :label="item.dictName" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="来源单号" v-if="resource == 1">
                <el-input size="medium" v-model="remarkval"></el-input>
            </el-form-item>
            <el-form-item label="定责原因" v-if="resource == 1">
                <el-input type="textarea" size="medium" v-model="remarkval"></el-input>
            </el-form-item>
            <el-form-item label="测量附件" v-if="resource == 1">
                <template>
                    <el-upload
                        class="upload-demo"
                        :data='technology'
                        :action="TechnologyimgUrl"
                        :limit='num'
                        list-type="picture-card"
                        :accept="Technologyaccept"
                        :on-remove="Technologydel"
                        :on-success="TechnologySwiper"
                        :before-upload="beforeAvatarUp"
                        :on-error="uploadError">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="processPicture.dialogVisible" class='box'>
                        <img width="100%" :src="processPicture.dialogImageUrl" alt="">
                    </el-dialog>
                </template>
            </el-form-item>
            <el-form-item label="备注" class="widmax" v-if="resource == 1">
                <el-input type="textarea" size="medium" v-model="remarkval"></el-input>
            </el-form-item>
        </el-form>
        <div class="order_table" v-if="resource == 1">
            <el-table border
                ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                :row-class-name="tableRowClassName" @selection-change="handleSelectionChange">
                <el-table-column prop="customerName" align="center" label="部门" width="200" sortable></el-table-column>
                <el-table-column prop="customerPhone" align="center" label="人员" width="200" sortable></el-table-column>
                <el-table-column prop="otherPhone" align="center" label="处罚方式" width="200">
                    <template slot-scope="scope">
                        <div>
                            <el-select v-model="orderStatus" placeholder="选择处罚方式" size="medium">
                                <el-option
                                    v-for="item in stateList" :key="item.value"
                                    :label="item.dictName" :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="address" align="center" label="金额" width="200">
                    <template slot-scope="scope">
                        <div>
                            <el-input size="mini" v-model="scope.row.address"></el-input>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="orderStatus" align="center" label="说明" width="200">
                    <template slot-scope="scope">
                        <div>
                            <el-input size="mini" v-model="scope.row.orderStatus"></el-input>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="orderStatus" align="center" label="申诉信息" width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="orderStatus" align="center" label="申诉结果" width="200" show-overflow-tooltip></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            tableSelectList: [],
            stateList: [],
            orderStatus: "",
            inpval: "",
            remarkval: "",
            resource: "",
            tableData: [
                {
                    orderStatus: 1,
                    customerName: "张三",
                    customerPhone: "13520176584",
                    otherPhone: "18701432668",
                    address: "详细地址",
                },
            ],
            processPicture:{},//图片
            num:20,
            technology: {//图片上传参数
                token: '',
                key: ""
            },
            Technologyaccept: "image/jpeg,image/gif,image/png,image/bmp",//上传的文件类型
            TechnologyimgShow: 'http://file.xczhihui.com/',
            TechnologyimgUrl: 'http://up-z2.qiniup.com',//上传地址
            TechnologyList:[],//图片列表
        }
    },
    methods: {
        // 图片上传成功
        TechnologySwiper(val) {
            if(this.TechnologyList.length<=20){
                this.processPicture.dialogImageUrl = this.TechnologyimgShow + val.key;
                this.TechnologyList.push({
                    fileUrl:this.processPicture.dialogImageUrl,
                    sourceName:val.key
                })
                this.addmeasurereportdata.enclosures=this.TechnologyList
               
            }
        },
        //图片删除移除
        Technologydel(file, fileList){
            
        },
        beforeAvatarUp(file){//图片上传之前
            // console.log(file)
            this.technology.key = `${file.lastModified}.png`;
            // console.log(this.technology);
        },
        // 上传失败
        uploadError(err, file, fileList) {
            console.log(err, file, fileList)
        },
        handleSelectionChange(val){
            this.tableSelectList = val;
            console.log(this.tableSelectList,"tableSelectList1234");
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
    },
}
</script>
<style lang="scss">
    .fixduty{
        .fixdutyfrom{
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            >div{
                width: 45%;
            }
            .widmax{
                width: 100%;
            }
        }
    }
</style>