<template>
    <div class="batch_records">
        <!-- 按钮组 -->
        <div class="btn_bottom">
            <el-button v-for="(item,index) in actionBtninBatch" :key="index" :type="item.style" size="small" class="button-96 recordActions" @click="butGroupinBatch(item.url,item.type)">{{item.name}}</el-button>
            <el-button type="default" size="small" class="button-96 recordActions downActions">
                <a :href="downFile">下载价格模板</a>
            </el-button>

        </div>

        <!-- 点击导入操作按钮后出现的弹框 -->
        <el-dialog title="" :visible.sync="dialogFormVisible">
            <div class="titlecals">请导入商品价格文件</div>
            <el-upload
                ref="upload"
                class="upload-demo"
                action="/api/pc/batchImport/addBatchImport"
                :data= upLoadtype
                :headers = "headers"
                accept="application/vnd.ms-excel,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                :before-upload="beforUpload"
                :on-success="uplodSuccess"
                :on-error="uplodError">
                <el-button size="small" type="primary">请选择文件</el-button>
            </el-upload>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogUpload">上传</el-button>
            </div>
        </el-dialog>

        <!-- 批次记录批次记录表格 -->
        <div class="table_list">
            <el-table
                border
                :row-style="tableBodycolor"
                :row-class-name="tableRowClassName"
                :data="listinBatch"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                @cell-click = "clickRecordID">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column prop="batchImportId" align="center" sortable label="批次记录ID" class="table_action_span">
                    <template slot-scope="scope">
                        <div>
                            <p class="operation table_action_span">{{scope.row.batchImportId}}</p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="batchName" align="center" sortable label="批次名称" ></el-table-column>
                <el-table-column prop="updateName" align="center" sortable label="修改人" ></el-table-column>
                <el-table-column prop="organizationName" align="center" sortable label="调整部门"></el-table-column>
                <el-table-column prop="createTime" align="center" sortable label="修改时间" :formatter = formatter></el-table-column>
                <el-table-column prop="status" align="status" sortable label="批次状态" :formatter = statuMatter></el-table-column>
            </el-table>
            <!-- 批次记录分页条 -->
            <div class="pagination_wrap">
                <pagination
                    :current-page="currentPage"
                    :pageSize="pageSize"
                    :total="total"
                    @sizeChange="sizeChange"
                    @currentChange="currentChange">
                </pagination>
            </div>


        </div>

        <!-- 点击批次记录ID后显现的商品价格详情表格 -->
        <div class="show_after_click" v-if="tableAfterId">
            <!-- 题目 -->
            <div class="tableShowTitle iconBox">
                <i class="Icon"></i>
                <span>批次记录商品详情</span>
            </div>
            <!-- 批次记录按钮组 -->
            <div class="search_box recoder">
                <!-- 查询条件组 -->
                <div class="search_item" >
                    <el-input placeholder=" 商品名称/商品编码" size="meduim" v-model="brandInfo.customerName"  maxlength="50"  class="width-100"></el-input>
                </div>
                <div class="search_item">
                    <!-- <el-input placeholder="请选择商品品牌" v-model="brandInfo.customerPhone" size="meduim" class="input-200" maxlength="50"></el-input> -->
                    <el-select v-model="brandInfo.brandId" placeholder="请选择商品品牌">
                        <el-option
                        v-for="item in brandOptions"
                        :key="item.brandId"
                        :label="item.brandName"
                        :value="item.brandId">
                        </el-option>
                    </el-select>
                </div>
                <div class="search_item">
                    <!-- <el-input placeholder="请选择商品品牌" v-model="brandInfo.customerPhone" size="meduim" class="input-200" maxlength="50"></el-input> -->
                    <el-select v-model="brandInfo.commodityCategoryId" placeholder="请选择商品品类">
                        <el-option
                        v-for="item in classifyOptions"
                        :key="item.commodityCategoryId"
                        :label="item.categoryName"
                        :value="item.commodityCategoryId">
                        </el-option>
                    </el-select>
                </div>
                <div class="search_item">
                    <el-select v-model="brandInfo.commodityClassifyId" @visible-change="classChange('brandInfo',$event)" placeholder="请选择商品分类">
                        <el-option
                            v-for="item in styleList"
                            :key="item.commodityClassifyId"
                            :label="item.classifyName"
                            :value="item.commodityClassifyId">
                        </el-option>
                    </el-select>
                </div>
                <div class="search_button head_nav_btn">
                    <el-button class="button-fc" type="warning" size="medium"  @click='onSearch'>查询</el-button>
                    <el-button class="el-button--medium" type="primary" size="medium"   @click="resetFun">重置</el-button>
                </div>
            </div>
            <!-- 批次记录商品详情表格 -->
            <div class="table_list lvs attribute m-top20">
                <!-- 表格主干 -->
                <el-table
                    border
                    :row-style="tableBodycolor"
                    :row-class-name="tableRowClassName"
                    :data="tabList"
                    ref="multipleTable"
                    style="width: 100%;">
                    <el-table-column type="index" width="55" align="center" label="序号"></el-table-column>
                    <el-table-column prop="brandName"   align="center" sortable  label="品牌"></el-table-column>
                    <el-table-column prop="categoryName"   align="center" sortable  label="商品品类"></el-table-column>
                    <el-table-column prop="classifyName"   align="center" sortable  label="商品分类"></el-table-column>
                    <el-table-column prop="costPrice"   align="center" sortable  label="成本价"></el-table-column>
                    <el-table-column prop="sellingPrice"   align="center" sortable  label="销售价格"></el-table-column>
                    <el-table-column prop="processRemarks"   align="center" sortable  label="备注"></el-table-column>
                </el-table>
                <!-- 点击批次记录ID分页条 -->
                <div class="pagination_wrap">
                    <pagination
                        :current-page="currentPagegoods"
                        :pageSize="pageSizegoods"
                        :total="totalGoods"
                        @sizeChange="sizeChangegoods"
                        @currentChange="currentChangegoods">
                    </pagination>
                </div>
            </div>
        </div>


	</div>
</template>
<script>
import pagination from '../../../../components/pagination';

import { getToken } from '@/utils/auth';
import module from '../../../../../../config/index.js';


import {
    listBatchImportByPage,
    listBrand,
    deleteBatchImport,
    addBatchImport,
    listCommoditylist,
    listCategory,
    listClassify,
    editCommodityPrice,
    exportBatchImport
} from 'api/price/price';

export default {
    components: {
		pagination
    },
    
    data(){
        return {
            // 分页
			currentPage: 1,// 当前页数
			pageSize: 10, // 当前页最大条数	
            total: 0, // 总条数

            // 分页
			currentPagegoods: 1,// 当前页数
			pageSizegoods: 10, // 当前页最大条数	
            totalGoods: 0, // 总条数

            listinBatch:[], // 批次记录表格数据
            tabList: [], // 批次记录商品价格详情表格数据
            // 导入操作按钮控制的弹框
            dialogFormVisible: false,
           // 批次记录页面的操作按钮
            actionBtninBatch:[
                {'name':'导入','style':'default','url':'/addbrand','type':1},
                {'name':'应用','style':'default','url':'/addbrand','type':2},
                {'name':'删除','style':'default','url':'/delbrand','type':4},
            ],
            upLoadtype:{ // 图片上传参数  
                // type: 'pc'
            },
            selectVal:[],  // 选中的表格行组成的数组
            brandInfo:{},
            //点击id后展示批次记录商品详情
            tableAfterId: false,
            
            
			headers: {
				Authorization: getToken()  // 从cookie里获取token，并赋值  Authorization ，而不是token
            },
            brand: '',
            // 商品品牌
            brandOptions: [],
            // 商品品类
            classifyOptions:[],
            // 商品分类
            styleList: [],
            // 批次记录ID
            recordId: '',
            elsectVal: [], // 批次记录所选组成的数组
            downFile: '',

        }
    },
    created(){
        
        // 获取批次记录表格数据
        this.getList();
        // 商品列表
        this.getBrand();
        // 商品品类
        this.getClassify();
        
        // this.downFile = module.dev.proxyTable['/api'].target + '/api/auth/service/fileDownload?' + getToken();
        // http://localhost:8765/api/pc/batchImport/exportBatchImport
        this.downFile = module.dev.proxyTable['/api'].target + '/api/pc/batchImport/exportBatchImport';
        
    },
    mounted() {
        // 获取批次记录表格数据
        this.getList();
         // 商品列表
        this.getBrand();
        // 商品品类
	    this.getClassify();
    },
    methods: {
        // 获取批次记录列表数据
        getList(){
            let data={
                page: this.currentPage,
                limit: this.pageSize
            }
            console.log(data,"vvvdata");
            
            listBatchImportByPage(data).then(res =>{
                this.listinBatch = res.data.rows;
                this.total = res.data.total
                console.log(this.total,"this.total")
            }).catch(error =>{
                console.error('销售价格 销售价格维护 批次记录详情列表 views/price/components/batchRecords', error)
            })
        
        },

        // 获取批次记录商品价格详情列表数据
        getGoodslist(){
            let data={
                batchImportId: this.recordId,
                
                page: this.currentPagegoods,
                limit: this.pageSizegoods
            }
            
            listCommoditylist(data).then(res =>{
                this.tabList = res.data.rows;
                this.totalGoods = res.data.total
                console.log(this.total,"this.total")
            }).catch(error =>{
                console.error('销售价格 销售价格维护 批次记录商品价格详情列表 views/price/components/batchRecords', error)
            })
        
        },

        // 批量删除批次导入记录
        deleteFile(){
            let arr=[];

            this.selectVal.map((item,index) => {
                console.log(item)
                if(item.status == 0){
                    arr.push(Number(item.batchImportId))
                }else{
                    this.$message({
                        message: '应用状态不可删除',
                        type: 'warning'
                    });
                }
            })
            deleteBatchImport({batchImportIds:arr}).then(res=>{
                if(res.status == 200){
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getList();
                }
            })
            
        },

        // 批次记录里的操作按钮
        butGroupinBatch(url,type){
            if(type == 1){
                if(this.elsectVal.length == 0 || this.elsectVal.length > 1){
                    this.$message({ message: '没有选择批次记录或所选多于一个',type: 'warning'});
                    return;
                }
                this.showDialog();
            }else if(type == 4) { // 批量删除批次导入记录
                this.deleteFile();
            }else if(type == 2) { // 应用批次导入

                if(this.elsectVal.length == 0 || this.elsectVal.length > 1){
                    this.$message({ message: '没有选择批次记录或所选多于一个',type: 'warning'});
                    return;
                }

                editCommodityPrice({batchImportId : this.elsectVal[0].batchImportId}).then(res=>{
                    if(res.status == 200){
                        this.$message({
                            message: '应用成功',
                            type: 'success'
                        });
                        this.getList();
                    }
                })
            }else if(type == 3){ // 下载价格模板
                 
                // let host = window.location.host + '/api/auth/service/fileDownload';

                // this.downFile = host;
                // exportBatchImport({}).then(res=>{
                //     console.log(res);
                //     if(res.status == 200){
                //         this.$message({
                //             message: '下载模板成功',
                //             type: 'success'
                //         });
                //     }
                // })
            }

        },
        // 导入操作按钮的弹出框控制
        showDialog () {
            this.dialogFormVisible = true;
        },
        
        
        clickRecordID(row,column,event,cell){
            console.log(row,"row")
            console.log(column,"column")
            console.log(event,"event")
            console.log(cell,"cell");
            if(column.label === "批次记录ID"){
                this.recordId = row.batchImportId;
                this.getGoodslist();
                this.tableAfterId = true;

            }
        },
        // 上传前的回调
        beforUpload(file){
            console.log(file);
            this.upLoadtype.multipartFile = file;
        },
        // 文件上传成功回调
		uplodSuccess(response, file, fileList){
            // this.brandInfo.brandUrl = response.data.url;
            console.log(response);
           

            // addBatchImport({multipartFile: response.name}).then(res=>{
            //     if(res.status == 200){
            //         this.$message({
            //             message: '上传成功',
            //             type: 'success'
            //         });
            //         // this.getList();
            //     }
            // })
            
            this.dialogFormVisible = false;
            this.$router.push({
                path: 'verifyGoods',
            });
        },
        // 上传失败回调
		uplodError(err, file, fileList){
			console.log(err, file, fileList)
        },

        // 上传操作按钮
        dialogUpload () {
            // this.$refs.upload.submit();
            console.log(this.upLoadtype.multipartFile,'----------------');
            
            addBatchImport({multipartFile: this.upLoadtype.multipartFile}).then(res=>{
                if(res.status == 200){
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getList();
                }
            })
            
            this.dialogFormVisible = false;
           
            this.$router.push({
                path: "verifyGoods", 
                query: {id:  this.elsectVal[0].batchImportId}
            });
        },

        currentChange(val) {// 翻页方法 -- 批次记录
            this.currentPage = val;
            this.getList();
        },
        sizeChange(val) { // 改变条数方法 -- 批次记录
            this.currentPage = 1;
            this.pageSize = val;
            this.getList();
        },
        currentChangegoods(val) {// 翻页方法 -- 商品价格详情
            this.currentPage = val;
            this.getGoodslist();
        },
        sizeChangegoods(val) { // 改变条数方法 -- 商品价格详情
            this.currentPagegoods = 1;
            this.pageSizegoods = val;
            this.getGoodslist();
        },
        // 改变tablebody颜色
        tableBodycolor({ row, rowIndex }) {
            // return "height: 80px"
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        handleSelectionChange(val){ // table勾选事件
            this.elsectVal = val;
        },

        onSearch() {

        },

        // 有效时间
        formatter(row, column) {
            //  :formatter = formatter
            return row.createTime.split("-").join("/");
            // let startTime = row.startTime.split(" ")[0].split("-").join("/");
            // let endTime = row.endTime.split(" ")[0].split("-").join("/");
            // return startTime + "~" + endTime
        },

        // 状态
        statuMatter(row, column) {
            if (row.status == 1) {
               return  "已应用"
            }else if(row.status == 0){
                return "未应用"
            }
        },
        // 获取品牌
        getBrand(){
            listBrand({}).then(res=>{
                this.brandOptions = res.data
            }).catch(error=>{
                console.error('销售价格 销售价格维护 商品价格详情 获取品牌 views/price/strateDetail',error)
            })
        },
        // 获取品类
		getClassify(){
			listCategory({}).then(res=>{
				this.classifyOptions = res.data
			}).catch(error=>{
				console.error('销售价格 销售价格维护 商品价格详情 获取品牌品类 views/price/strateDetail',error)
			})
        },
        // 获取商品分类
		getclassification(id,type){
			
			listClassify({
				commodityCategoryId: id
			}).then(res=>{
				if(type == 'brandInfo'){
					this.styleList = res.data
				}else if( type ==  'commodity'){
					this.styleListTan = res.data
				}
				
			}).catch(error=>{
				console.error('获取商品分类',error)
			})
		},
        // 商品分类值发生变化时触发的事件
		classChange(type,isVisible) {
			console.log(isVisible,"$evtn")
			if(isVisible) {
				if(type === 'brandInfo'){
					if(!this.brandInfo.commodityCategoryId) {
						console.log(this.brandInfo.commodityCategoryId,"commodityCategoryId");

						this.$message({ message: '请先选择商品品类',type: 'warning'});
						return;
					}
					this.getclassification(this.brandInfo.commodityCategoryId,'brandInfo');
				}else if(type == 'commodity'){
					if(!this.commodity.commodityCategoryId) {
						this.$message({ message: '请先选择商品品类',type: 'warning'});
						return;
					}
					this.getclassification(this.commodity.commodityCategoryId,'commodity');
				}
				
			}
        },
        // 重置按钮
        resetFun() {
            this.brandInfo = {}; 
            this.currentPage = 1;
            this.styleList = [];
            this.getList();
        },
        
    }


}
</script>
<style scoped lang="scss">
    .batch_records {
        .btn_bottom{
            margin-bottom: 15px;
            .recordActions {
                padding : 0px;
                span{
                    display: block;
                    width: 100%;
                    height: 100%;
                    a{
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
                
            }
        }
        .show_after_click {
            margin-top:20px;
            border-top:1px solid #ebeef5;
            .tableShowTitle {
                padding: 18px 20px 18px 0px;
                color: #409EFF;
                box-sizing: border-box;
            }
            .search_box{
                display: flex;
                flex-flow: row wrap;
                justify-content: space-between;
                margin-bottom: 15px;
            }
            .search_item{
                margin: 10px 0px;
                padding: 0px 5px;
                width: 25%;
                >div{
                    width: 100%;
                }
            }
        }
    }
    .head_nav_btn{
        width: 100%;
        text-align: center;
        
    }

    

    

    .table_action_span div{
        color: rgb(127, 221, 228);
        cursor: pointer;
    }

    .table_action_span {
		color: rgb(127, 221, 228);
		cursor: pointer;
	}

    

    

    .iconBox span {
		font-size: 18px;
		font-weight: 500;
	}

    

</style>

<style lang="scss">
    .recordActions {     
        span{
            display: block;
            width: 100%;
            height: 100%;
            padding : 9px 10px;
        }
        
    }
    .downActions {
        span{
            display: block;
            width: 100%;
            height: 100%;
            padding : 0px;
            a{
                display: block;
                width: 100%;
                height: 100%;
                padding : 9px 10px;
            }
        }
    }
</style>