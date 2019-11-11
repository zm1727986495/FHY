<template>
    <div class="wrapper" >
        <div class="apper" >
            <div class="head_nav">
                <!-- 导航栏 -->
                <breadcrumb :navList="navList"></breadcrumb>
            </div>
            <el-card class="m-bottom10">
                <!-- 基础信息组 -->
                <div class="baseInfo">
                    <div class="baseInfo_title_box">
                        <div class="iconBox"><i class='Icon'></i><span>品牌信息</span></div>
                        <span class="table_action_span">{{brandInfo.brandType == 1 ? '启用' : '禁用'}}</span>
                    </div>
                    <div class="baseInfo_info_box">
                        <div class="info_box_left">
                            <img :src="brandInfo.brandUrl" alt="">
                        </div>
                        <div class="info_box_right">
                            <div class="info_box_input">
                                <div>品牌名称：</div>
                                <span class=co>{{brandInfo.brandName}}</span>
                            </div>
                            <div class="info_box_input">
                                <div>品牌类型：</div>
                                <span class='co'>{{brandInfo.brandTypeEnum == 0 ? '自营' : '合作商'}}</span>
                            </div>
                            <div class="note">
                                <span class="remarks"><div>备</div><div>注：</div></span>
                                <div class="Dialog_input_cell_input co">
                                    {{brandInfo.remarks}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </el-card>

                <!-- <el-card class="attribute"> -->
                    <!-- <div class="baseInfo_title_box">
                        <div class="iconBox"><i class='Icon'></i><span>联系人信息</span></div>
                    </div> -->
                    <!-- 查询条件组 -->
                    
                    <!-- <div class="warp_head_list">
                    
                        <div class="head_nav_search">
                            <el-input
                                placeholder="联系人名称/手机"
                                v-model="searchtext"
                                size="medium"
                                maxlength="50">
                                <i slot="suffix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                        </div>

                        <div class="head_nav_btn m-left10">
                            <el-button type="warning" class="button-fc" size="medium" @click="getListData(id, searchtext)">查询</el-button>
                            <el-button type="primary" size="medium" @click="reset()">重置</el-button>
                        </div>
                    </div> -->
                    <!-- 按钮组 -->
                    <!-- <div class="warp_head_action_btn">
                        <el-button v-for="(item,index) in actionBtnList" :type="item.style" size="small" class="button-96" @click="butGroupAction(item.url,item.type)" :key="index">{{item.name}}</el-button>
                    </div> -->
                    <!-- 表格 -->
                    <!-- <div class="table_list ">
                        <el-table 
                            border
                            :row-style="tableBodycolor" 
                            :row-class-name="tableRowClassName"
                            @selection-change="handleSelectionChange" 
                            :data="tabList" 
                            style="width: 100%;" >
                            
                            <el-table-column type="selection" width="40"></el-table-column>
                            <el-table-column prop="id" label="操作" width="180">
                            <template slot-scope="scope">
                                <span class="table_action_span" @click="editHandle(scope.row)">编辑</span>
                                
                                <span class="table_action_span" @click="seeHandle(scope.row)" v-if="scope.row.isMain != 1">设为主要联系人</span>
                            </template>
                            </el-table-column>
                            <el-table-column prop="contactsName" align="center" label="联系人姓名" width="200">
                            
                            </el-table-column>
                            <el-table-column prop="phone"  align="center" label="联系人手机"></el-table-column>
                            <el-table-column prop="address" align="center" label="联系人地址"></el-table-column>
                            <el-table-column prop="position" align="center" label="职位"></el-table-column>
            
                            <el-table-column prop="isMain" align="center" label="是否为只要联系人" max-width="200">
                                <template slot-scope="scope">
                                    <span>{{scope.row.isMain  == 1 ? '是' : '否'}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination_wrap">
                                <pagination
                                :current-page="currentPage"
                                :pageSize="pageSize"
                                :total="total"
                                @sizeChange="sizeChange"
                                @currentChange="currentChange">
                                </pagination>
                        </div>
                    </div> -->
                    <!-- 结束按钮 -->
                <!-- </el-card> -->
                <div class="closepage_btn">
                    <el-button type="default" @click="closePage">取消</el-button>
                </div>
            </div>
            <!-- 弹框页面 -->
            <!-- <div class="dialog_con_box">
                    <el-dialog
                    :visible.sync="centerDialogVisible"
                    width="40%"
                    >
                    <div class='titlecals'>{{Dialogtitle}}</div>
                    <div class="content_box">
                       
                        <div class="Dialog_input_cell">
                            <span class="Dialog_input_cell_title">联系人姓名：</span>
                                <div class="Dialog_input_cell_input">
                            <el-input
                                placeholder=""
                                v-model="brandMan.contactsName"
                                maxlength="50">
                            </el-input>
                            </div>
                        </div>
                            <div class="Dialog_input_cell">
                            <span class="Dialog_input_cell_title">联系人性别：</span>
                                <div class="Dialog_input_cell_input">
                                     <el-radio v-model="brandMan.sex" :label='0'>男</el-radio>
                                     <el-radio v-model="brandMan.sex" :label='1'>女</el-radio>
                                </div>
                        </div>
                        <div class="Dialog_input_cell">
                            <span class="Dialog_input_cell_title">联系人手机：</span>
                                <div class="Dialog_input_cell_input">
                            <el-input
                                placeholder="请输入手机号"
                                v-model="brandMan.phone"
                                maxlength="11">
                            </el-input>
                            </div>
                        </div>
                        <div class="Dialog_input_cell">
                            <span class="Dialog_input_cell_title">职位：</span>
                                <div class="Dialog_input_cell_input">
                            <el-input
                                placeholder="请输入职位"
                                v-model="brandMan.position"                             
                                maxlength="11">
                            </el-input>
                            </div>
                        </div>
                        <div class="Dialog_input_cell">
                            <span class="Dialog_input_cell_title">是否主要联系人：</span>
                            <div class="Dialog_input_cell_input">
                                <el-checkbox v-model="brandMan.isMain">{{brandMan.isMain==1?'是':'否'}}</el-checkbox>
                            </div>
                        </div>
                        <div class="Dialog_input_cell">
                            <span class="Dialog_input_cell_title">联系人地址：</span>
                            <div class="Dialog_input_cell_input el_select_box">
                                    <el-select v-model="brandMan.provinceId" @change="optionProvince" placeholder="请选择">
                                        <el-option
                                        v-for="item in province"
                                        :key="item.province"
                                        :value="item.provinceid"
                                        :label="item.province"
                                        >
                                        </el-option>
                                    </el-select>
                                        <el-select v-model="brandMan.cityId" @change="optionAreas" placeholder="请选择">
                                        <el-option
                                        v-for="item in listCitys"
                                        :key="item.city"
                                        :value="item.cityid"
                                        :label="item.city"
                                        >
                                        </el-option>
                                    </el-select>
                                    <el-select v-model="brandMan.areaId" placeholder="请选择">
                                        <el-option
                                        v-for="item in areasList"
                                        :key="item.area"
                                        :value="item.areaid"
                                        :label="item.area"
                                        >
                                        </el-option>
                                    </el-select>
                            </div>
                        </div>
                        <div class="Dialog_input_cell">
                            <span class="Dialog_input_cell_title"></span>
                            <div class="Dialog_input_cell_input">
                            <el-input
                                placeholder="详细地址"
                                v-model="brandMan.address"                             
                                maxlength="100">
                            </el-input>
                            </div>
                        </div>
                        <div class="Dialog_input_cell lastDialog_input_cell" style="align-items: top !important;">
                            <span class="Dialog_input_cell_title">备注：</span>
                            <div class="Dialog_input_cell_input">
                            <el-input
                            type="textarea"
                            :rows="3"
                            v-model="brandMan.remarks"                             
                            placeholder="请输入内容"
                            maxlength="200"
                            >
                            </el-input>
                            </div>
                        </div>
                      

                    </div>
                    
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="sendJava()">保 存</el-button>
                        <el-button @click="closeMode()">取 消</el-button>
                    </span>
                    </el-dialog>
            </div> -->
   

        </div>
</template>


<script>
import breadcrumb from "../../components/breadcrumb";
import pagination from '../../components/pagination';
import {getBrand, listBrand, addContacts, getContacts, editBrandContacts, editMain} from 'api/productmanage/brandmanagement/brandmanagement';
import {listProvince, listCity, listAreas} from 'api/pulicJava';
import {
  getNames,
  getTypes,
  potionVal,
  postionPmap
} from 'src/utils/pubilcFn.js';
export default {
    components: {
        breadcrumb,
        pagination
    },
    mounted() {
        
        // 头部面包屑
        this.navList = this.$route.meta;
        this.id = this.$route.query.id;//品牌id
        this.getBrandInfo(this.id);//获取品牌信息
        this.getListData(this.id);//获取联系人列表信息
        this.getProvince();//获取省
    },
    // name: 'brandmanagement',
    data() {
        return {
            checkbox:false,
            id: 0,//品牌id
            currentPage: 1,//当前页数
            pageSize: 20,//总页数
            total: 100,//总条数
            Dialogtitle:'',//弹框title
            brandInfo:{},//品牌信息
            //头部面包屑导航
            navList:[],
            province:[],//获取的省级列表数据
            listCitys:[],//获取的市级列表数据
            areasList:[],//获取的区级列表数据
            provinceId:'',//选中的省
            cityId:'',//选中的市
            areaId:'',//选中的区
            baseInfo:{},//基础信息
            tabList: [],//新建联系人列表数据
            searchtext:'',//查询内容
            statuestyle:'',//状态查询
            styleList:[
                {'label':'全部',"value":''},
                {'label':'启用',"value":1},
                {'label':'停用',"value":2},
                ],
            brandstyle:'',//品牌类型
            brandList:[
                 {'label':'全部',"value":''},
                 {'label':'自营',"value":1},
                 {'label':'合作商',"value":1},
            ],
            //页面操作按钮list
            actionBtnList:[
                {'name':'新建联系人','style':'default','url':'/addbrand','type':1},
            ],
            //页面弹框
            centerDialogVisible:false,
            //弹框页面数据
            brandMan:{
                brandId:this.$route.query.id,
                areaValue:'',
            },
            //imglogosrc
            imglogosrc:'',
            //文件上传
            dialogImglist:[],
    
           
        }
    },
    methods:　{
         reset(){
             this.searchtext=''
         },
        //获取联系人列表信息
        getListData(id, names){
            let data = {
                brandId: id,
                names: names,
                page :this.currentPage,
                limit: this.pageSize
            };
            listBrand(data).then(res => {
                this.tabList = res.data.rows;
                this.total = res.data.total;
                console.log(this.tabList);
            }).catch(res => {
                console.log('品牌管理:查询品牌联系人列表 productmanage/brandmanagement/scalebrand.vue', error);
            });
        },
        getBrandInfo(id){               //获取品信息
            getBrand({
                brandId:id
            }).then(res => {
                this.brandInfo = res.data;
            }).catch(error => {
                console.log('品牌管理:查看品牌 productmanage/brandmanagement/scalebrand.vue', error);
            });
        },
        getProvince(val){              //获取 省级列表
            listProvince().then(res => {            
                this.province = res.data;
            }).catch(error => {
                console.log('品牌管理:调取公共方法获取省 productmanage/brandmanagement/scalebrand.vue', error)
            });
        },
        optionProvince(id){ //三级select下拉框 省级change事件
            this.cityId = '';
            this.areaId = '';
            let data = {
                id: id
            }
            listCity(data).then(res => {        //请求市级 列表数据
                this.listCitys = res.data;

            }).catch(error => {
                console.log('品牌管理:调取公共方法获取 市级 productmanage/brandmanagement/scalebrand.vue', error)
            });
        },
        optionAreas(id){ //三级select下拉框 请求区级 数据列表
            this.areaId = '';
            let data = {
                id: id
            }
            listAreas(data).then(res => {//获取区
                this.areasList = res.data;
            }).catch(error => {
                console.log('品牌管理:调取公共方法获取区 productmanage/brandmanagement/scalebrand.vue', error)
            });
        },
        sendJava(){             //新增品牌联系人 编辑联系人
            if(!this.brandMan.contactsName){
                this.$message.error('姓名不能为空!');
            }else if(this.brandMan.sex==undefined){
                this.$message.error('性别不能为空!')
            }else if(!brandMan.phone){
                this.$message.error('手机不能为空!')
            }else if(!brandMan.position){
                this.$message.error('职位不能为空!')
            }else if(!brandMan.provinceId){
                this.$message.error('省不能为空')
            }else if(!brandMan.cityId){
                this.$message.error('市不能为空')
            }else if(!brandMan.areaId){
                this.$message.error('县不能为空!')
            }else{
                let fn; 
            let str='';
            this.Dialogtitle == "新建联系人" ? fn = addContacts : fn = editBrandContacts ;
            this.Dialogtitle == "新建联系人" ? str = '新建联系人成功' : str = '编辑联系人成功' ;
           
                if(this.brandMan.isMain){
                    this.brandMan.isMain=1
                }else{
                    this.brandMan.isMain=0;
                }

                fn(this.brandMan).then(res => {
                    this.getListData(this.id);
                    this.$message({message: str,type: 'success'});
                    this.centerDialogVisible = false;
                    this.brandMan = {
                        brandId:this.$route.query.id,
                        areaValue:'',
                    };
                }).catch(error => {
                    console.log('品牌管理:'+str+' productmanage/brandmanagement/scalebrand.vue', error);
                    this.$message.error(str);
                });
            }
            
        },
        editHandle(val){         //查看品牌联系人
            getContacts({brandContactsId:val.brandContactsId}).then(res => {
                this.brandMan = res.data;
                res.data?this.brandMan.isMain=true:this.brandMan.isMain=false
                this.optionProvince(res.data.provinceId);
                this.optionAreas(res.data.cityId);
                setTimeout(()=> {
                    this.brandMan.provinceId = potionVal(res.data.provinceId, 'provinceid', 'province', this.province);
                    this.brandMan.cityId = potionVal(res.data.cityId, 'cityid', 'city', this.listCitys);
                    this.brandMan.areaId = potionVal(res.data.areaId, 'areaid', 'area', this.areasList);
                },100)
            }).catch(error => {
                console.log('品牌管理:查看品牌联系人 productmanage/brandmanagement/scalebrand.vue', error);
            });
            this.Dialogtitle="编辑联系人";
            this.centerDialogVisible=true;
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
           return rowIndex%2 != 0 ? 'el-f0' : '';
        },  
        currentChange(val) {//翻页方法
            this.currentPage = val;
            this.getListData();
        },
        sizeChange(val) {//翻页方法
            this.currentPage = 1;
            this.pageSize = val;
            this.getListData();
        },
        // 改变table头部颜色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
                return "background: #f8f8f8;border-color: #dddddd"
            }
        },
        // 改变tablebody颜色
        tableBodycolor({ row, rowIndex }) {
            return "height: 80px"
        },
        //分页函数回调
        handleCurrentChange(val) {
            this.currentPage3 = val;
            this.getData();
        },
        //勾选函数回调
        handleSelectionChange(val){

        },

        searchFun(){//查询按钮点击
            this.currentPage3 = 1;
            this.getListData();
        },
        //按钮组函数
        butGroupAction(url,type)
        {
            if(type==1)
            {
                //弹框
                this.addbrand();
            }
            // else if(type==2)
            // {
            //     //页面跳转
            // }
            // else if(type==3)
            // {
            //     //
            // }
        },
        addbrand(row) {//新建联系人
            this.Dialogtitle="新建联系人";
            this.centerDialogVisible=true;
        },
        //编辑
        setStatue(row,type){
            console.log(row);
        },
        //查看
        seeHandle(val){
            let data = {
                brandContactsId : val.brandContactsId,
                brandId: this.id
            }
            editMain(data).then(res => {
            this.$message({message: '操作成功',type: 'success'});
            this.getListData(this.id);//获取联系人列表信息
            }).catch(error =>{
                    console.log('品牌管理:设置主要联系人 productmanage/brandmanagement/scalebrand.vue', error);
                    this.$message.error('操作失败');                
            })
        },
        //上传前的回调
        beforUpload(file)
        {
            console.log(file);
            
        },
        //弹框里的函数方法
        uploadchange(file, fileList){
            console.log(file);
            console.log(fileList);
            
        },
        closeMode(){//关闭模板
            this.centerDialogVisible = false;
            this.brandMan = {
                brandId: this.$route.query.id,
                areaValue: '',
            };
        },
        //页面取消按钮
        closePage(){
            this.$router.go(-1)
        },

    }
}
</script>
<style scoped lang='scss'>
.co{
    color:#606266;
}
.remarks{
    width: 80px;
    // text-align: right;
    display: flex;
    justify-content:space-between
}
.pagination_wrap{
    text-align: center;
    height: 50px;
    /* line-height: 50px; */
    display: flex;
    align-items: center;
    justify-content: center;
}
.table_action_span{
    color: rgb(127, 221, 228);
    cursor: pointer;
    margin-left:10px;
}
.dialog_con_box{}
.dialog_con_box .content_box{
    display: flex;
    flex-wrap:wrap;
}
.dialog_con_box .left_form{
    width: 60%;
   
}
.dialog_con_box .right_logo{
    width: 40%;
}
.Dialog_input_cell{
    display: flex;
    flex-wrap: nowrap;
    height: 50px;
     width: 100%;
    align-items: center;
}
.lastDialog_input_cell{
    display: flex;
    flex-wrap: nowrap;
    height: 100px;
    align-items: top !important;
}
.dialog_con_box .Dialog_input_cell .Dialog_input_cell_title{
    width: 122px;
    text-align: right;
    padding-right: 10px;
}
.Dialog_input_cell_input{
    flex: 1;
    display: flex;
    flex-wrap: nowrap;
   
}
.right_logo .img_logo{
    width: 150px;
    height: 150px;
    margin: auto;
    background-color: #dddddd;
    overflow: hidden;
}
.right_logo .img_logo img{
    width: 100%;
}
.upload_logo{
       text-align: center;
    padding: 10px 0px;
}
.baseInfo_info_box{
    height: 150px;
    overflow: hidden;
    text-overflow:ellipsis;
    display: flex;
    flex-wrap: nowrap;
    padding-bottom: 20px;
    padding-top: 10px;
    /* border-bottom: 1px solid #dddddd; */
}
.baseInfo_info_box .info_box_left{
    width: 170px;
    height: 100px;
    padding-right: 10px 20px 10px 10px;
    background-color: #dddddd;
    text-align: center;
}
.baseInfo_info_box .info_box_left img{
    width: 100%;
    height: 100%;
}
.baseInfo_info_box .info_box_right{
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    padding-left: 20px;
}
.baseInfo_info_box .info_box_right .info_box_input{
    width: 25%;
    height: 50px;
    line-height: 50px;
    display: flex;
}
.note{
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
}
.baseInfo_title_box{
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
    justify-content:space-between;
    .Icon{
        margin-top:12px;
    }
}
.title_h4{
    font-weight: 700;
}
.warp_head_list{
    padding: 10px 0px;
}
.closepage_btn{
    text-align: center;
    padding: 10px 0px;
}
.el_select_box{
    justify-content:space-between;
}
.el_select_box .el-select{
    width: 30%;
}
</style>

