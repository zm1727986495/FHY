<template>
  <div class="wrapper">
    <div class="apper">
        <div class="head_nav">
            <!-- 导航栏 -->
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <div class="page_head_div">
            <span class="page_head_div_title">客户编辑</span>
            <span class="page_head_div_id">客户ID：C1806220001</span>
        </div>
       
        <div class="collapse_cell_div">
            <div class="collapse_input_cell_box">
            <span class="input_befor_text">客户姓名：</span>
            <div class="input_after_div">
                <el-input placeholder v-model="searchtext" maxlength="50"></el-input>
            </div>
            </div>
            <div class="collapse_input_cell_box">
            <span class="input_befor_text">客户电话：</span>
            <div class="input_after_div">
                <el-input placeholder="商品名称/商品编码" v-model="searchtext" maxlength="50"></el-input>
            </div>
            </div>

            <div class="collapse_input_cell_box">
            
            </div>
            <div class="collapse_input_cell_box">
            <span class="input_befor_text">备用电话：</span>
            <div class="input_after_div">
                <el-input placeholder="商品名称/商品编码" v-model="searchtext" maxlength="50"></el-input>
            </div>
            </div>
            <div class="collapse_input_cell_box">
            <span class="input_befor_text">是否上架：</span>
            <div class="input_after_div">
                <el-radio v-model="isSell" label="1">是</el-radio>
                <el-radio v-model="isSell" label="2">否</el-radio>
            </div>
            </div>
            <div class="collapse_input_cell_box">
            <span class="input_befor_text">年龄段：</span>
            <div class="input_after_div">
                <el-select v-model="statuestyle" placeholder="请选择商品分类">
                <el-option
                    v-for="item in styleList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
                </el-select>
            </div>
            </div>
        </div>
        <div class="collapse_cell_div">
            <!-- 查询条件组 -->
            <div class="warp_head_list">
                <div class="head_nav_search_t">
                客户地址
                </div>
                <div class="head_nav_btn">
                <el-button type="primary" @click="addHandle">新增</el-button>
                <el-button type="default" @click="searchFun">删除</el-button>
                </div>
            </div>
            <!-- 表格 -->
            <div class="table_list">
                <!--  -->
                <el-table
                :header-cell-style="tableHeaderColor"
                border
                :row-style="tableBodycolor"
                @selection-change="handleSelectionChange"
                :data="tabList"
                style="width: 100%;"
                >
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column prop="id" label="操作" width="180">
                    <template slot-scope="scope">
                    <span class="table_action_span" v-if="scope.row.isNew==1" @click="editHandle(scope.row)">编辑</span>
                    <span class="table_action_span" @click="deleteHandle(scope.row)">删除</span>
                    </template>
                </el-table-column>
            
                <el-table-column prop="name" label="地址">
                    <template slot-scope="scope">
                        <div class="table_edit_column" v-if="scope.row.editFalg==1">   
                            <div class="input_box">
                            <el-input placeholder='地图定位' v-model="searchtext" maxlength="50"></el-input></div>
                            <div class="input_box">
                            <el-input placeholder v-model="searchtext" maxlength="50"></el-input>
                            楼号/区</div>
                            <div class="input_box">
                            <el-input placeholder v-model="searchtext" maxlength="50"></el-input>
                            单元/号楼</div>
                            <div class="input_box">
                            <el-input placeholder v-model="searchtext" maxlength="50"></el-input>
                            室</div>
                            <div class="input_box">
                            <el-button type="default" >提交</el-button></div>
                        </div>
                            <div v-else>
                                北京市海淀区知春路小区8号楼3单元1009
                            </div>
                    </template>
                </el-table-column>
                
                </el-table>
                <div class="pagination_wrap">
                <!-- <el-pagination background layout="prev, pager, next" :pager-count="8" prev-text="上一页" next-text="下一页" :total="1000"></el-pagination> -->
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage3"
                    :page-sizes="[10,20,30,40]"
                    :page-size="10"
                    prev-text="上一页"
                    next-text="下一页"
                    text-align:
                    center
                    layout="total,prev, pager, next, sizes, jumper"
                    :total="totle"
                ></el-pagination>
                </div>
            </div>
        </div>
        <div class="collapse_cell_div border_top border_bottom">
            <div class="collapse_input_cell_box">
            <span class="input_befor_text">客户来源：</span>
            <div class="input_after_div">
                <el-select v-model="statuestyle" placeholder="">
                <el-option
                    v-for="item in styleList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
                </el-select>
            </div>
            </div>
            <div class="collapse_input_cell_box">
            <span class="input_befor_text">内部推荐人：</span>
            <div class="input_after_div">
                <el-input placeholder='选择门店或组织结构' v-model="searchtext" maxlength="50"></el-input>
               
            </div>
            <div class="input_after_div">
                 <el-input placeholder='选择门店或组织结构中的人' v-model="searchtext" maxlength="50"></el-input>
            </div>
            </div>
            <div class="collapse_input_cell_box_area">
            <span class="input_befor_text">备注：</span>
            <div class="input_after_div">
                <el-input type='textarea' placeholder v-model="searchtext" maxlength="50"></el-input>
            </div>
            </div>
        </div>

      <div class="foot_btn_box">
          <el-button type="primary" @click="">编 辑</el-button>
          <el-button @click="">取 消</el-button>
      </div>
    </div>
  </div>
</template>


<script>
import breadcrumb from "../../components/breadcrumb";
export default {
  // name: 'brandmanagement',
  data() {
    return {
      //头部面包屑导航
      navList: [],
      //手风琴效果展开
     
      //第一块
      isUnpack: false,
      isInsert: false,
      isShare: 1,
      isSell: 1,
      tagList: [
        { name: "新品上架", code: "1" },
        { name: "热卖爆款", code: "2" },
        { name: "清场优惠", code: "3" }
      ],
     
      //第三块

      //第四块

      //第五块

      //imglogosrc
      imglogosrc:'',
      //文件上传
      upLoadList:[],

      tabList: [
        {
          name: "张三",
          phone: "18879432548",
          brandname: "北京欧派",
          brandtype: "自营",
          type: 1, //0为禁用  1为启用
          id: 1,
          isNew:1,
        },
            {
          name: "张三",
          phone: "18879432548",
          brandname: "北京欧派",
          brandtype: "自营",
          type: 1, //0为禁用  1为启用
          id: 1,
          isNew:0,
          editFalg:1,
          
        }
      ],
      //状态查询
      statuestyle: "",
      styleList: [
        { label: "全部", value: "" },
        { label: "启用", value: 1 },
        { label: "停用", value: 2 }
      ],
      //
      //分页
      currentPage3: 1,
      totle: 100,
      //查询内容
      searchtext: ""
      //状态查询
    };
  },
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {
    //下拉效果
    handleChange(index) {
      console.log(index);
    },
    //
    delete_tag_fun(index) {
      this.tagList.splice(index, 1);
    },

   
    //获取列表信息
    getListData() {
      let _this = this;
      let url = "";

      //待备案
      url = baseURL + "/company/project/getStayRecordProjectList2";

      let data = {
        pc_id: "", //项目类型
        company_name: "", //项目施工单位
        create_start: "", //创建起始时间
        create_end: "", //创建结束时间
        searchtext: "",
        currPage: this.currentPage3, //分页信息
        pageSize: 10 //显示数量
      };
      $.ajax({
        url: url,
        type: "POST",
        // contentType:"application/json",
        data: data,
        success: function(res) {
          console.log(res);
          if (res.code == 0) {
            _this.tabList = res.page.list;

            _this.totle = res.page.totalCount;
          } else {
            alert(res.msg);
            return;
          }
        },
        error: function(err) {}
      });
    },

    // 操作
    projectdetail(row) {},

    // 改变table头部颜色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background: #f8f8f8;border-color: #dddddd";
      }
    },
    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      return "height: 80px";
    },
    //分页函数回调
    handleCurrentChange(val) {
      this.currentPage3 = val;
      this.getData();
    },
    //勾选函数回调
    handleSelectionChange(val) {},

    //查询按钮点击
    searchFun() {
      this.currentPage3 = 1;
      this.getListData();
    },
    //新增商品页面
    addHandle(){
      this.$router.push({path:'choseproducts'});
    }


  },
  components: {
    breadcrumb,
   
  }
};
</script>
<style scoped>
.pagination_wrap {
  text-align: center;
  height: 50px;
  /* line-height: 50px; */
  display: flex;
  align-items: center;
  justify-content: center;
}
.collapse_cell_div {
  display: flex;
  overflow: hidden;
  flex-wrap: wrap;
  padding: 10px 0;
}
.warp_head_list{
    justify-content: space-between;
    width: 100%;
}
.page_head_div{
    display: flex;
  flex-wrap: nowrap;
  align-items: center;
  height: 50px;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
}
.table_edit_column{
    display: flex;
    align-items: center;
}
.table_edit_column .input_box{
    width: 20%;
}

.collapse_cell_div  .ImgBox{
  width:100%;
  display: flex;
  margin-bottom: 10px;
}
.collapse_input_cell_box {
  display: flex;
  flex-wrap: nowrap;
}
.collapse_input_cell_box_area{
      width: 100%;
    display: flex;
    flex-wrap: nowrap;
    
        height: 80px;
    align-items: center;
}
.collapse_input_cell_box_area .input_after_div{
  width: 84%;
}
.el-input {
  flex: 1;
  width: 80%;
}

.collapse_input_cell_box {
  width: 50%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  height: 50px;
  
}
.collapse_input_cell_box .input_befor_text {
  width: 8em;
}
.collapse_input_cell_box .input_after_div {
  flex: 1;
}
.table_list {
  width: 100%;
  margin-top: 10px;
}
.head_nav_search_t {
  margin-right: 20px;
  display: flex;
  align-items: center;
}
.head_nav_select_t {
  margin-right: 20px;
  display: flex;
  align-items: center;
}
.input_befor_text {
  width: 120px;
}
.foot_btn_box{
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.collapse_input_cell_box_area .input_after_div{
    width: 88%;
}
</style>
<style>
.el-collapse-item__header{
  background-color: #dddddd;
  padding: 0 10px;
}
.table_edit_column .input_box .el-input{
    width: 60%;
}
.table_edit_column .input_box:first-child .el-input{
    width: 90%;
}
</style>



