<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="m-bottom20">
          <el-row :gutter="10" class="queryForm">
            <el-col :span="span">
              <el-input placeholder="流程名称" v-model="formSearch.orderProcessName" clearable size="medium"></el-input>
            </el-col>
            <el-col :span="span">
              <el-select v-model="formSearch.brandId" clearable size="medium" placeholder="品牌">
                <el-option v-for="(item,idx) in bandArr" :key="idx" :label="item.brandName" :value="item.brandId"></el-option>
              </el-select>
            </el-col>
            <el-col :span="span">
              <el-select v-model="formSearch.commodityCategoryId" clearable size="medium" placeholder="品类">
                <el-option v-for="(item,idx) in commodityCategoryArr" :key="idx" :label="item.categoryName" :value="item.commodityCategoryId"></el-option>
              </el-select>
            </el-col>
            <el-col :span="span">
              <el-button size="medium" class="button-fc" type="warning">查询</el-button>
              <el-button size="medium" type="primary">重置</el-button>
            </el-col>
          </el-row>
        </el-card>
      <el-card>
        <div class="btnList">
          <el-button class="button-96" size="small" v-if="btnJurisdiction.add" @click="addNewProcess">新增</el-button>
          <el-button class="button-96" size="small" v-if="btnJurisdiction.delete" @click="deleteProcess">删除</el-button>
          <el-button class="button-96" size="small" v-if="btnJurisdiction.copy" @click="copy">复制</el-button>
          <el-button class="button-96" size="small" v-if="btnJurisdiction.sendOut" @click="publish">发布</el-button>
          <el-button class="button-96" size="small" v-if="btnJurisdiction.tapeOut" @click="offline">下线</el-button>
        </div>
        <div class="table_list m-top20">
          <el-table border :data="tableData" :row-class-name="tableRowClassName" @selection-change="selectChange" @row-click="rowClick" ref="table">
            <el-table-column show-overflow-tooltip align="center" type="selection" width="50" fixed></el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="orderProcessNumber" label="编码" width="180">
              <template slot-scope="scope">
                <el-tooltip placement="right" visible-arrow >
                  <div slot="content" class="tips tipFon">
                    <p class="operaItems" v-if="btnJurisdiction.edit" @click="edit(scope.row)">编辑</p>
                  </div>
                  <img :src="spot" alt="" class=" attributesTips">
                </el-tooltip>
                <el-button type="text" @click="isShowNode(scope.row)">{{scope.row.orderProcessNumber}}</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="orderProcessName" label="流程名称" width="150" show-overflow-tooltip ></el-table-column>
            <el-table-column align="center" prop="status" label="发布状态" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.status==0">未发布</span>
                <span v-else-if="scope.row.status==1">发布</span>
                <span v-else>下线</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="goodsId" label="流程适配类型" width="160">
              <template slot-scope="scope">
                {{scope.row.goodsId==0?"定制":"标品"}}
              </template>
            </el-table-column>
            <el-table-column  align="center" prop="sourceName" label="订单来源" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column  align="center" prop="organizationalName" label="组织机构" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column  align="center" prop="brandName" label="品牌" show-overflow-tooltip></el-table-column>
            <el-table-column  align="center" prop="commodityCategoryName" label="品类" width="200" show-overflow-tooltip></el-table-column>
            <el-table-column  align="center" prop="updateTime" label="最后更新时间" width="160" show-overflow-tooltip></el-table-column>
          </el-table>
          <div class="pagination_wrap">
            <pagination
              :current-page="formSearch.page"
              :pageSize="formSearch.limit"
              :total="total"
              @sizeChange="sizeChange"
              @currentChange="currentChange">
            </pagination>
          </div>
        </div>
      </el-card>
    </div>
</template>
<script>
import breadcrumb from '@/views/components/breadcrumb';
import pagination from '@/views/components/pagination';
import spot from '@/assets/images/spot.png';
import { listOrderProcessVO, copyOrderProcess, deleteOrderProcess, getOrderProcessVO, releaseOrderProcess } from '@/api/systemcenter/processModule';
import { listCategory, listBrand, getUUID } from '@/api/pulicJava';
export default {
    components:{
        breadcrumb,
        pagination,
    },
    created() {
        this.btnInit()
        listCategory().then(res=>{
            this.commodityCategoryArr=res.data;
        })
        listBrand().then(res=>{
            this.bandArr=res.data;
        })
        this.pages()
    },
    mounted() {
        this.navList = this.$route.meta;
    },
    data(){
        return{
            navList:[],
            span:6,
            spot,
            total:10,
            bandArr:[],
            commodityCategoryArr:[],
            tableData:[],
            formSearch:{
                orderProcessName:"",
                brandId:"",
                commodityCategoryId:"",
                limit:10,
                page:1
            },
            rowsData:[],
            btnJurisdiction:{
                add:false,
                edit:false,
                delete:false,
                copy:false,
                sendOut:false,
                tapeOut:false,
            }
        }
    },
    methods: {
        rowClick(row){
            this.$refs.table.toggleRowSelection(row)
        },
        btnInit(){
            this.btnJurisdiction.add=JSON.parse(this.$loca.getItem('element'))["processModule:btn_add"];
            this.btnJurisdiction.edit=JSON.parse(this.$loca.getItem('element'))["processModule:btn_edit"];
            this.btnJurisdiction.delete=JSON.parse(this.$loca.getItem('element'))["processModule:btn_delete"];
            this.btnJurisdiction.copy=JSON.parse(this.$loca.getItem('element'))["processModule:btn_copy"];
            this.btnJurisdiction.sendOut=JSON.parse(this.$loca.getItem('element'))["processModule:btn-sendOut"];
            this.btnJurisdiction.tapeOut=JSON.parse(this.$loca.getItem('element'))["processModule:btn_tapeOut"];
        },
        edit(val){
            if(val.status==1){
                this.$message({
                    showClose: true,
                    message: '已发布，不可编辑',
                    type: 'warning'
                });
            }else{
                this.$router.push({
                    path:'processMessage',
                    query:{
                        edit:true,
                        orderProcessId:val.orderProcessId,
                        onlyRead:false
                    }
                })
            }
            
        },
        copy(){
            if(this.rowsData.length==0){
                this.$message({
                    showClose: true,
                    message: '选择后再进行复制',
                    type: 'warning'
                });
            }else if(this.rowsData.length==1){
                getUUID({
                    serialNumber:"PRO"
                }).then(resion=>{
                    copyOrderProcess({
                        orderProcessId:this.rowsData[0].orderProcessId,
                        orderProcessNumber:resion.data
                    }).then(res=>{
                        this.pages()
                        this.$message({
                            showClose: true,
                            message: '复制成功',
                            type: 'success'
                        });
                    })
                })
                
            }else{
                this.$message({
                    showClose: true,
                    message: '只可选择一条',
                    type: 'warning'
                });
            }
            
        },
        processPubOrOff(status){
            if(this.rowsData.length){
                let arr=[]
                this.rowsData.map((item,idx)=>{
                    arr.push(item.orderProcessId)
                })
                releaseOrderProcess(
                    {
                        status,
                        orderProcessIds:arr.join(",")
                    }
                ).then(res=>{
                    if(status==1){
                        this.$message({
                            showClose: true,
                            message: '发布成功',
                            type: 'success'
                        });
                    }else{
                        this.$message({
                            showClose: true,
                            message: '下线成功',
                            type: 'success'
                        });
                    }
                    this.pages()
                })
            }else{
                this.$message({
                    showClose: true,
                    message: '请选择后在进行操作',
                    type: 'warning'
                });
            }
        },
        publish(){
            this.processPubOrOff(1)
        },
        offline(){
            this.processPubOrOff(2)
        },
        tableRowClassName({ row, rowIndex }) {//斑马线
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        selectChange(val){//表格选择
            this.rowsData=val;
        },
        addNewProcess(){//跳转新增页面
            this.$router.push({
                path:'processMessage',
                query:{
                    onlyRead:false
                }
            })
        },
        deleteProcess(){
            if(this.rowsData.length>0){
                let arr=[];
                this.rowsData.map((item,idx)=>{
                    arr.push(item.orderProcessId)
                })
                deleteOrderProcess(
                    {
                        orderProcessIds:arr.join(",")
                    }
                ).then(res=>{
                    this.pages()
                    this.$message({
                        showClose: true,
                        message: '删除成功',
                        type: 'success'
                    });
                })
            }else{
                this.$message({
                    showClose: true,
                    message: '请选择后再进行删除',
                    type: 'warning'
                });
            }
        },
        pages(){//列表接口
            listOrderProcessVO(this.formSearch).then(res=>{
                this.tableData=res.data.rows;
                this.total=res.data.total;
            })
        },
        currentChange(val) {//换页
            this.formSearch.page = val;
            this.pages()
        },
        sizeChange(val) {//换列表量
            this.formSearch.page = 1;
            this.formSearch.limit = val;
            this.pages()
        },
        isShowNode(val){
            this.$router.push({
                path:'processMessage',
                query:{
                    edit:true,
                    orderProcessId:val.orderProcessId,
                    onlyRead:true
                }
            })
        }
    },
}
</script>
<style scoped>
.formBtn{
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
