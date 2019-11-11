<template>
    <div>
      <div class="head_nav">
                  <!-- 导航栏 -->
          <breadcrumb :navList="navList"></breadcrumb>
      </div>
        <div class="content_body_warp_left" ref='tab' style="position:initial">
            <div class="warp_head_list m-margin10">
                <div class="head_nav_search">
                  <el-input placeholder=""  size="medium" v-model="searchtext" maxlength="50">
                    <i slot="suffix" class="el-input__icon el-icon-search"></i>
                  </el-input>
                </div>
                <div class="head_nav_btn">
                  <el-button class="left_button button-fc" size="medium" @click="search">查询</el-button>
                </div>
            </div>
            <div v-for="(item,index) in categorys" :key="index" @click="cateClick(item,index)" :class="item.flag?'listTitle listTitleBg':'listTitle'">
                <span>{{item.categoryName}}</span>
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>
        <el-card>
            <div>
                <div class="tableView">
                    <div class="addMinus clearfloat">
                        <div class="add" @click="add">+</div>
                        <div class="minus" @click="minus" >-</div>
                    </div>
                    <div class="table">
                        <el-table
                            border
                            style="width: 100%"
                            :row-class-name="tableRowClassName"
                            @selection-change="chooseDelete"
                            :data="tableData">
                            <el-table-column
                            align="center"
                            type="selection">
                            </el-table-column>
                            <el-table-column
                            align="center"
                            prop="unpackingName"
                            show-overflow-tooltip
                            label="名称">
                              <template slot-scope="scope">
                                  <el-input v-model="scope.row.unpackingName"></el-input>
                              </template>
                            </el-table-column>
                            <el-table-column
                            align="center"
                            prop="status"
                            width="180"
                            label="有效状态">
                            <template slot-scope="scope">
                                <el-radio v-model="scope.row.status" :label="0">有效</el-radio>
                                <el-radio v-model="scope.row.status" :label="1">无效</el-radio>
                            </template>
                            </el-table-column>
                            <el-table-column
                            align="center"
                            prop="dataType"
                            width="180"
                            label="类型">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.dataType">
                                  <el-option label="文本" :value="0"></el-option>
                                  <el-option label="数值" :value="1"></el-option>
                                </el-select>
                            </template>
                            </el-table-column>
                            <el-table-column
                            align="center"
                            prop="isSplit"
                            width="180"
                            label="是否拆分">
                              <template slot-scope="scope">
                                  <el-radio v-model="scope.row.isSplit" :label="0">是</el-radio>
                                  <el-radio v-model="scope.row.isSplit" :label="1">否</el-radio>
                              </template>
                            </el-table-column>
                            <el-table-column
                            align="center"
                            prop="createTime"
                            show-overflow-tooltip
                            label="添加时间">
                            </el-table-column>
                            <el-table-column
                            align="center"
                            prop="userName"
                            show-overflow-tooltip
                            label="操作人">
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="btns">
                      <el-button type="primary" v-if="btnJurisdiction.submit" @click="submit">提交</el-button>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>
<script>
import { getNames } from '../../../utils/pubilcFn';
import { listAogByPage, listCategory, getUnpackingDataList, editUnpackingData, deleteUnpackingData } from 'api/entrepotSet/unpacking/index'
import breadcrumb from "../../components/breadcrumb";
export default {
    components: {
        breadcrumb,
    },
    // mounted() {
    //   this.btnInit()
    //   this.navList=this.$route.meta;
    //   listCategory().then(res=>{
    //     this.categorys=res.data;
    //     this.categorys.map((item,idx)=>{
    //       item.flag=false;
    //     })
    //   })
        
    // },
    // created(){
    //     this.name=getNames('name',this.tableData)
        
    // },
    activated(){
      this.name=getNames('name',this.tableData)
      this.btnInit()
      this.navList=this.$route.meta;
      listCategory().then(res=>{
        this.categorys=res.data;
        this.categorys.map((item,idx)=>{
          item.flag=false;
        })
      })
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    data() {
      return {
        text:'',
        searchtext:'',
        name:[],
        navList:[],
        tableData:[
        ],
        categorys: [],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        categoryId:'',
        delRows:[],
        adds:0,
        btnJurisdiction:{
            submit:false
        }
      };
    },
    methods: {
      btnInit(){
          this.btnJurisdiction.submit=JSON.parse(this.$loca.getItem('element'))["unpackingData:btn_submit"];
      },
      chooseDelete(val){
        this.delRows=val;
      },
      search(){
        listCategory(
          {
            categoryName:this.searchtext
          }
        ).then(res=>{
          this.categorys=res.data;
          this.categorys.map((item,idx)=>{
            item.flag=false;
          })
        })
      },
      
      submit(){
        let addArr=[];
        let editArr=[];
        this.tableData.map((item,idx)=>{
          if(item.unpackingId!=undefined){
            editArr.push(item)
          }else{
            addArr.push(item)
          }
        })
        editUnpackingData(
          {
            categoryId:this.categoryId,
            addList:addArr,
            editList:editArr
          }
        ).then(res=>{
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.getUnpackingDataListquery()
        })
      },
      minus(){
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let delArr=[];
          let NullArr=[];
          this.delRows.map((item,idx)=>{
              if(item.unpackingId!=undefined){
                delArr.push(item.unpackingId)
              }else{
                NullArr.push(item)
              }
          })
          
          for(var i=0;i<this.delRows.length;i++){
            for(var j=0;j<this.tableData.length;j++){
              if(this.tableData[j].addNum!=undefined){
                if(this.tableData[j].addNum==this.delRows[i].addNum){
                  this.tableData.splice(j,1);
                  j=j-1;
                }
              }else{
                if(this.tableData[j].unpackingId==this.delRows[i].unpackingId){
                  this.tableData.splice(j,1);
                  j=j-1;
                }
              }
            }
          }
          if(delArr.length!=0){
            deleteUnpackingData({
              delList:delArr
            }).then(res=>{
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      add(){
        this.adds++
        this.tableData.push({
          show:true,
          unpackingName:"",
          status:0,
          dataType:0,
          isSplit:0,
          createTime:'',
          userName:'',
          addNum:this.adds
        })
      },
      getUnpackingDataListquery(){
        getUnpackingDataList(
          {categoryId:this.categoryId}
        ).then(res=>{
          console.log(res.data)
          this.tableData=res.data;
        })
      },
      cateClick(val,idx){
        this.categoryId=val.commodityCategoryId;
        this.categorys.map((item,index)=>{
          item.flag=false;
        })
        val.flag=!val.flag;
        this.categorys.splice(idx, 1, val)
        this.getUnpackingDataListquery()
      },
      handleNodeClick(data) {
        console.log(data);
      },
      filterHandler(value, row, column){
            const property = column['property'];
            return row[property] === value;
      },
      tableRowClassName({row, rowIndex}) {//表格斑马线设置
          return rowIndex%2 != 0 ? 'el-f0' : '';
      }
    },
    
  };
</script>
<style scoped>
    .clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
    .clearfloat{zoom:1}
    .clearfloat>div{
        float: left;
    }
    .btns{
      width: 100%;
      text-align: center;
      margin-top:30px;
    }
    .treeView{
        width: 150px;
    }
    .tableView{
        width:100%;   
    }
    .addMenui>div{
        width:32px;
        height: 32px;
        border:1px solid #000;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
         float: left;
    }
    .table{
        margin-top:20px;
    }
    .content_body_warp_left {
      float: left;
      /* position: fixed; */
      width: 230px;
      height: calc(100vh - 145px);
      z-index: 1;
      padding: 0px;
      border: 1px solid #dddddd;
      margin-right: 10px;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      overflow-y: auto;
      transition: top .2s;
    }
    .warp_head_list{
      padding: 10px 0;
    }
    .left_button{
      margin-left:10px;
    }
    .listTitle{
      height: 40px;
      line-height: 40px;
      color: #666;
      cursor: pointer;
      border-bottom: 1px solid #ebeef5;
      font-size: 13px;
      font-weight: 500;
      outline: 0;
      display: flex;
      align-items: center;
      justify-content:space-between;
      padding: 0px 15px;
    }
    .listTitleBg{
      background: #409EFF;
      color: #fff;
    }
    .add,.minus{
      width: 16px;height: 16px;
      float: left;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background: #54a9ea;
      color:#fff;
      margin-left:15px;
    }
</style>
