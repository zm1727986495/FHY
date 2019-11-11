
<template>
  <div class="wrapper">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

      <el-card class="attribute lvs">
          <!-- tab页 -->
          <div class="tabel_page_box">
                <div class="table_warp_box">
                  <!-- 操作按钮 提交-重新上传 -->
                  <div class="warp_head_action_btn">
                    <el-button
                      v-for="(item,index) in actionBtnList"
                      :key="index"
                      size="small" class="button-96"
                      :type="item.style"
                      @click="butGroupAction(item.type)"
                    >{{item.name}}</el-button>
                  </div>
                  <!-- 表格 -->
                  <div class="table_list">
                    <el-table
                      border
                      :row-style="tableBodycolor"
                      :row-class-name="tableRowClassName"
                      @selection-change="handleSelectionChange"
                      :data="tabList"
                      ref="multipleTable"
                      style="width: 100%;">
                      <el-table-column prop="commodityCode" align="center" label="商品编码"></el-table-column>
                      <el-table-column prop="commodityName" align="center" label="商品名称"></el-table-column>
                      <el-table-column prop="costPrice" align="center" label="成本价"></el-table-column>
                      <el-table-column prop="sellingPrice" align="center" label="销售价"></el-table-column>
                      <el-table-column prop="status" align="center" label="状态" >
						<template slot-scope="scope">
							<span  :class="scope.row.status == 1 ? '': 'redSpan'">
								{{scope.row.status == 1 ? '成功': '失败'}}
							</span>
							<!-- <span v-else class="redSpan">{{scope.row.status}} + 255</span>  -->
						</template>
					  </el-table-column>
                      <el-table-column prop="cause" align="center" label="失败原因">
						  <template slot-scope="scope">
							<span  :class="scope.row.status == 1 ? '': 'redSpan'">
								{{scope.row.cause}}
							</span>
							<!-- <span v-else class="redSpan">{{scope.row.status}} + 255</span>  -->
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

                  </div>
                </div>
          </div>
    </el-card>
    </div>
  </div>
</template>


<script>
import breadcrumb from "../../../components/breadcrumb";
import { btnCustomer, listrCustomer } from "api/customermanagement/transfer/transfer";
import { getNames } from 'src/utils/pubilcFn.js';
import spot from '@/assets/images/spot.png';
import pagination from '../../../components/pagination';

import {
    listBatchImportCommodity
} from 'api/price/price';

export default {
  // name: 'verifyGoods',
    components: {
        breadcrumb,
        pagination
    },
    data() {
        return {
            currentPage: 1,//当前页数
            pageSize: 20,//当前页最大条数
            total: 0,//总条数
            navList: [],//导航标签
            spot,
            roomks:'',//弹框备注
            // 商品价格详情里的按钮
            actionBtnList:[
				{ name: "提交", style: "default", url: "/strateDetails", type: 1 },
				{ name: "重新上传", style: "default", url: "/reUpload", type: 2 }
            ],
            // 批次记录页面的操作按钮
            actionBtninBatch:[
                {'name':'导入','style':'default','url':'/addbrand','type':1},
                {'name':'应用','style':'default','url':'/addbrand','type':2},
                {'name':'下载价格模板','style':'default','url':'/downbrand','type':3},
                {'name':'删除','style':'default','url':'/delbrand','type':4},
            ],
            //点击id后展示批次记录商品详情
            tableAfterId: false,
            centerDialogVisible:false,
            // 导入操作按钮控制的弹框
            dialogFormVisible: false,
            brandInfo:{},
            // 商品价格核对页表格信息数据
            tabList:[],
            opentab:'0',//tab选项卡默认参数
            selectVal:[],
            details:'',
            flag:false,
            // 查询条件
            brandOptions: [{
                value: '选项1',
                label: '黄金糕'
            }, {
                value: '选项2',
                label: '双皮奶'
            }, {
                value: '选项3',
                label: '蚵仔煎'
            }, {
                value: '选项4',
                label: '龙须面'
            }, {
                value: '选项5',
                label: '北京烤鸭'
            }],
            brand: '请选择商品品牌'     
        }
    },
	created(){
		this.getList();
	},
	mounted() {
		// 头部面包屑
		this.navList = this.$route.meta;
	},
	methods: {
		
		
		currentChange(val) {//翻页方法
				this.currentPage = val;
				this.getList();
		},
		sizeChange(val) {//翻页方法
			this.currentPage = 1;
			this.pageSize = val;
			this.getList();
		},
		listBtn(type,val){//审核（通过或者退回）
			var strId =[];

			Array.isArray(val) ? strId = val : strId.push(val);
			strId = strId.map(item => {
				return Number(item.storeCustomerTransferId)
			});
			let data = {
				storeCustomerTransferIds: strId,
				auditStatus: type
			};
			console.log(data);
			type == 2 ? data.auditReason = this.roomks : null;
			btnCustomer(data).then(res =>{
				this.centerDialogVisible = false;
				this.getList();
				this.$message({message: '操作成功',type: 'success'});
			}).catch(error =>{
				this.$message.error({message: '操作失败'});
			})
		},
		handleSelectionChange(val){//table勾选事件
			this.selectVal = val;
			
		},
	butGroupAction(type){
		if (type == 1) {
			this.$router.push({path: '/strateDetails', query: {tabValue: 'batRecords'}});
			this.listBtn(1,this.selectVal);
		}else {
			this.roomks ='';
			this.centerDialogVisible = true;
			this.flag=false
		}
	},
	// 批次记录里的操作按钮
	butGroupinBatch(url,type){
		if(type == 1){
			this.showDialog();
		}
	},
	// 导入操作按钮的弹出框控制
	showDialog () {
		this.dialogFormVisible = true;
	},
	dialogUpload () {
		this.dialogFormVisible = false;
		this.$router.push({
			path: '/activityMaintain/viewActivity',
		});
	},
	getList(){ // 获取列表
		let data={
			...this.brandInfo,
			auditStatus:this.opentab,

			page:this.currentPage,
			limit:this.pageSize
		}
		listBatchImportCommodity(data).then(res =>{
			this.tabList = res.data.rows;
			this.total=res.data.total
		}).catch(error =>{
			console.error('客户移交审批查询列表 customermanagement\transfer\transfer.vue', error)
		})
	},
	tabclickH(a){//tab选项卡切换方法
		this.getList();
	},
	searchFun(){
		this.getList()
	},
	clickRecordID(row,column,event,cell){
		// console.log(row,"row")
		// console.log(column,"column")
		// console.log(event,"event")
		// console.log(cell,"cell");
		if(column.label === "记录ID"){
			this.tableAfterId = true;
		}
	},

	
	// 状态
	statuMatter(row, column) {
		if (row.status == 1) {
			return  "成功"
		}else if(row.status == 0){
			return "失败"
		}
	},
	passHandle(val){
		console.log(1);
	},
	tableRowClassName({row, rowIndex}) {//表格斑马线设置
		return rowIndex%2 != 0 ? 'el-f0' : '';
	},
	// 改变tablebody颜色
	tableBodycolor({ row, rowIndex }) {
		return "height: 80px"
	},
	},
};
</script>
<style scoped>
.title_nav{
  margin: 20px;
}
.felxHead{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 62%;
}
/* .pagination_wrap {
  text-align: center;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
} */
/* .warp_head_list {
  justify-content: space-between;
} */
.search_nav {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin:20px;
}
.table_action_span {
  color: rgb(127, 221, 228);
  cursor: pointer;
}
.pageTitle {
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  /* border-bottom: 1px solid #ddd; */
  margin-bottom: 10px;
}
.tabel_page_box {
  position: relative;
  margin-top: 10px;
}
.left_fix_table {
  position: absolute;
  right: 10px;
  top: 8px;
}
.dialog_con_box .content_box {
  display: flex;
  flex-wrap: nowrap;
}
.dialog_con_box .left_form {
  width: 100%;
}
.dialog_con_box .right_logo {
  width: 40%;
}
.Dialog_input_cell {
  display: flex;
  flex-wrap: nowrap;
  height: 50px;
  align-items: center;
}
.left_form > .lastDialog_input_cell {
  display: flex;
  flex-wrap: nowrap;
  height: 100px;
  align-items: top !important;
}
.dialog_con_box .Dialog_input_cell .Dialog_input_cell_title {
  width: 100px;
  text-align: right;
  padding-right: 10px;
}
.Dialog_input_cell_input {
  flex: 1;
}
.right_logo .img_logo {
  width: 150px;
  height: 150px;
  margin: auto;
  background-color: #dddddd;
  overflow: hidden;
}
.right_logo .img_logo img {
  width: 100%;
}
.upload_logo {
  text-align: center;
  padding: 10px 0px;
}
.show_after_click {
    border-top:1px solid #ebeef5;
}
.tableShowTitle {
    padding: 18px 20px;
    color: #409EFF;
    box-sizing: border-box;
}
.redSpan {
	color: red;
}
</style>

