<template>
    <div class="exceptiondetails">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="lvs">
            <el-tabs type="border-card">
                <!-- 基础信息切换 -->
                <el-tab-pane label="基础信息">
                    <!-- 异常基础信息 -->
                    <ul class="detailslist">
                        <li>
                            <span>异常单号</span>
                            <span>SO2019109087</span>
                        </li>
                        <li>
                            <span>订单来源</span>
                            <span>安装任务/维修任务/出库/入库/物流配送/盘点</span>
                        </li>
                        <li>
                            <span>异常原因</span>
                            <span>货多/货少/货坏</span>
                        </li>
                        <li>
                            <span>生成时间</span>
                            <span>2016-12-20 11：32</span>
                        </li>
                        <li>
                            <span>申报人</span>
                            <span>李三</span>
                        </li>
                        <li>
                            <span>电话</span>
                            <span>13012546868</span>
                        </li>
                        <li>
                            <span>反馈内容</span>
                            <span>物流司机运输中损坏，柜身多两个，门板多两个，电器损坏两个</span>
                        </li>
                    </ul>
                    <!-- 列表+图片组件展示 -->
                    <div class="separator"></div>
                    <tableimgcomp>
                        <div class="titlecals">报废货物列表</div>
                    </tableimgcomp>
                    <div class="separator"></div>
                    <tableimgcomp>
                        <div class="titlecals">多出货物列表</div>
                    </tableimgcomp>
                    <div class="separator"></div>
                    <tableimgcomp>
                        <div class="titlecals">少出货物列表</div>
                    </tableimgcomp>
                    
                    <div class="submibox">
                        <p class="textclas">填写处理内容：</p>
                        <el-input type="textarea" v-model="textareaval"></el-input>
                        <div class="butlist">
                            <el-button type="primary">提交沟通内容</el-button>
                            <el-button type="primary" @click="blamefun">定责</el-button>
                            <el-button type="primary" @click="handle">处理</el-button>
                        </div>
                    </div>
                </el-tab-pane>
                <!-- 处理内容切换 -->
                <el-tab-pane label="处理内容">
                    <div class="handlebox">
                        <ul class="handlelist">
                            <li>
                                <div class="timeclasbox">
                                    <span>2019 -01-20 18：00</span>
                                    <span>跟进人:小马</span>
                                </div>
                                <div>已通报下单部，下遗留单</div>
                            </li>
                            <li>
                                <div class="timeclasbox">
                                    <span>2019 -01-20 18：00</span>
                                    <span>跟进人:小马</span>
                                </div>
                                <div>已通报下单部，下遗留单</div>
                            </li>
                            <li>
                                <div class="timeclasbox">
                                    <span>2019 -01-20 18：00</span>
                                    <span>跟进人:小马</span>
                                </div>
                                <div>已通报下单部，下遗留单</div>
                            </li>
                        </ul>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="相关附件">相关附件</el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 定责 -->
        <el-dialog :visible.sync="dialogVisible" width="50%">
            <div class="blameclas">
                <div class="titlecals">定责汇报</div>
                <el-form class="frombox" label-width="100px">
                    <el-form-item label="定责对象">
                        <el-select v-model="orderStatus" placeholder="选择定责对象" size="medium" class="fromlismax">
                            <el-option
                                v-for="item in stateList" :key="item.value"
                                :label="item.dictName" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="责任人姓名">
                        <el-input v-model="fromvals"></el-input>
                    </el-form-item>
                    <el-form-item label="处罚金额">
                        <el-input v-model="fromvals"></el-input>
                    </el-form-item>
                    <el-form-item label="收款方式">
                        <el-select v-model="orderStatus" placeholder="选择收款方式" size="medium" class="fromlismax">
                            <el-option
                                v-for="item in stateList" :key="item.value"
                                :label="item.dictName" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <el-form class="frombotm" label-width="100px" label-position="top">
                    <el-form-item label="定责照片">
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
                    <el-form-item label="定责描述">
                        <el-input type="textarea" v-model="textareaval"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 处理 -->
        <el-dialog :visible.sync="handlefals" width="60%">
            <div class="blameclas">
                <div class="titlecals">处理</div>
                <!-- 切换 -->
                <el-tabs type="border-card" v-model="activeName">
                    <el-tab-pane :label="itm" :name="itm" v-for="(itm, idx) in tablist" :key="idx"></el-tab-pane>
                    <!-- 内容 -->
                    <div v-if="activeName === '出库单' || activeName === '入库单'">
                        <el-form class="fromboxtree" label-width="80px" label-position="left">
                            <el-form-item label="出库单号:" v-if="activeName === '出库单'">
                                <div>RK46464588</div>
                            </el-form-item>
                            <el-form-item label="入库单号:" v-if="activeName === '入库单'">
                                <div>RK46464588</div>
                            </el-form-item>
                            <el-form-item label="供应商:">
                                <div>北京欧派</div>
                            </el-form-item>
                            <el-form-item label="所属仓库:">
                                <div>北京顺义仓库</div>
                            </el-form-item>
                            <el-form-item label="产品类型:">
                                <div>衣柜</div>
                            </el-form-item>
                            <el-form-item label="货主:">
                                <div>张三</div>
                            </el-form-item>
                            <el-form-item label=""></el-form-item>
                        </el-form>
                        <el-form label-width="80px" label-position="left">
                            <el-form-item label="出库备注:" v-if="activeName === '出库单'">
                                <el-input type="textarea" v-model="textareaval"></el-input>
                            </el-form-item>
                            <el-form-item label="入库备注:" v-if="activeName === '入库单'">
                                <el-input type="textarea" v-model="textareaval"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div v-if="activeName === '遗留单'">
                        <el-form class="frombox" label-width="100px">
                            <el-form-item label="遗留单号">RK46464588</el-form-item>
                            <el-form-item label="供应商">
                                <el-select v-model="orderStatus" placeholder="选择供应商" size="medium" class="fromlismax">
                                    <el-option
                                        v-for="item in stateList" :key="item.value"
                                        :label="item.dictName" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="订单类别">
                                <el-select v-model="orderStatus" placeholder="选择订单类别" size="medium" class="fromlismax">
                                    <el-option
                                        v-for="item in stateList" :key="item.value"
                                        :label="item.dictName" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="下单原因">
                                <el-select v-model="orderStatus" placeholder="选择下单原因" size="medium" class="fromlismax">
                                    <el-option
                                        v-for="item in stateList" :key="item.value"
                                        :label="item.dictName" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <el-form class="fromboxs" label-width="100px">
                            <el-form-item label="备注">
                                <el-input type="textarea" v-model="textareaval"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div v-if="activeName === '报废单'">
                        <el-form class="frombox" label-width="100px">
                            <el-form-item label="报废单号">RK46464588</el-form-item>
                            <el-form-item label="来源">RK46464588</el-form-item>
                            <el-form-item label="申报人">小王</el-form-item>
                            <el-form-item label="申报时间">2018-10-18 09:50</el-form-item>
                            <el-form-item label="创建人">
                                <el-select v-model="orderStatus" placeholder="选择下单原因" size="medium" class="fromlismax">
                                    <el-option
                                        v-for="item in stateList" :key="item.value"
                                        :label="item.dictName" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <el-form class="fromboxs" label-width="100px">
                            <el-form-item label="报废备注">
                                <el-input type="textarea" v-model="textareaval"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <!-- 列表+图片组件展示 -->
                    <tableimgcomp>
                        <div class="titlecals">报废货物列表</div>
                    </tableimgcomp>
                </el-tabs>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handlefals = false">确 定</el-button>
                <el-button @click="handlefals = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from "../../components/breadcrumb";
import tableimgcomp from "./components/tableimgcomp";

export default {
    components: {
        breadcrumb,
        tableimgcomp,
    },
    data(){
        return {
            tablist: ["出库单", "入库单", "遗留单", "报废单"],
            activeName: "出库单",
            orderStatus: "",
            stateList: [
                {dictName: "设计师", id: "1"},
                {dictName: "测量师", id: "2"},
            ],
            navList: [],
            textareaval: "",
            fromvals: "",
            dialogVisible: false,//定责弹框开关
            handlefals: false,//处理弹框开关
            tableData:[{
                    orderStatus: 1,
                    customerName: "张三",
                    customerPhone: "13520176584",
                    otherPhone: "18701432668",
                    address: "详细地址",
                },{
                    orderStatus: 1,
                    customerName: "张三",
                    customerPhone: "13520176584",
                    otherPhone: "18701432668",
                    address: "详细地址",
                },{
                    orderStatus: 1,
                    customerName: "张三",
                    customerPhone: "13520176584",
                    otherPhone: "18701432668",
                    address: "详细地址",
                },{
                    orderStatus: 1,
                    customerName: "张三",
                    customerPhone: "13520176584",
                    otherPhone: "18701432668",
                    address: "详细地址",
                },
            ],
            tableSelectList: [],
            total: 0,    // 总数
            pageSize: 10,  // 单页条数
            currentPage: 1, // 当前页
            processPicture:{},//图片
            num: 5,
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
    mounted() {
        // 头部面包屑
        this.navList=this.$route.meta;
    },
    created() {
        
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
        blamefun(){
            this.dialogVisible = true;
        },
        handle(){
            this.handlefals = true;
        },
        handleSelectionChange(val){
            this.tableSelectList = val;
            console.log(this.tableSelectList);
        },
        //分页函数回调
        handleCurrentChange(val) {
            this.currentPage = val;
            let data = {
                page: this.currentPage,
                limit: this.pageSize,
            };
        },
        // 单页条数改变
        handleSizeChange(val){
            this.pageSize = val;
            let data = {
                page: this.currentPage,
                limit: this.pageSize,
            };
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
    }
}
</script>
<style lang="scss">
.exceptiondetails{
    .detailslist{
        font-size: 15px;
        padding: 20px 70px 20px 30px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        align-items: center;
        li{
            padding: 20px 0px;
            width: 40%;
            align-items: center;
            display: flex;
            :nth-of-type(1){
                width: 100px;
                font-weight: 500;
            }
            :nth-of-type(2){
                flex: 1;
                color: #999;
            }
        }
    }
    .separator{
        border-top: 1px solid #dcdfe6;
        margin-bottom: 20px;
    }

    .submibox{
        padding: 20px;
        background: #eee;
        .textclas{
            margin-bottom: 10px;
        }
        .butlist{
            margin: 20px;
            display: flex;
            justify-content: center;
        }
    }
    .blameclas{
        .frombox{
            padding-right: 30px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            >div{
                width: 45%;
            }
        }
        .fromboxs{
            padding-right: 30px;
        }
        .fromboxtree{
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            >div{
                width: 30%;
            }
        }
        .frombotm{
            padding: 0px 30px;
        }
    }
    .fromlismax{
        width: 100%;
    }

    .handlebox{
        padding: 20px;
        .handlelist{
            li{
                border-bottom: 1px solid #999;
                padding: 15px 0px;
            }
            .timeclasbox{
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
            }
        }
    }
}
</style>