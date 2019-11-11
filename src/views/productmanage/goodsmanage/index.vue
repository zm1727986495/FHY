 <template>
  <div class="wrapper">
    <div class="apper">
      <div class="head_nav" ref="topInfo">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <!-- 主题内容左右结构 -->
      <el-card class="m-bottom20">
        <!-- 查询条件组 -->
        <div class="searchModules">
          <div class="searchModule" :class="{ unfold : foldStatus1 === 0 }">
            <div class="searchModuleTitle">品牌</div>
            <div class="searchModuleContent">
              <span class="filter_style_cell" :class="{ active: beforIn.brandId === '' }" @click="selectType('','brandId')">全部</span>
              <span v-for="item in selectList.brandList" :key="item.brandId" class="filter_style_cell" :class="{ active: item.brandId == beforIn.brandId }" @click="selectType(item.brandId,'brandId')">{{ item.brandName }}</span>
            </div>
            <div class="searchModuleBtn">
              <el-button type="text" :size="size" :icon="foldStatus1 == 1 ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" @click="handleFold(1)">{{ foldStatus1 == 1 ? '展开' : '收起' }}</el-button>
            </div>
          </div>
          <div class="searchModule" :class="{ unfold : foldStatus2 === 0 }">
            <div class="searchModuleTitle">品类</div>
            <div class="searchModuleContent">
              <span class="filter_style_cell" :class="{ active: beforIn.commodityCategoryId === '' }" @click="selectType('','commodityCategoryId')">全部</span>
              <span v-for="item in selectList.categoryList" :key="item.commodityCategoryId" class="filter_style_cell" 
              :class="{ active: item.commodityCategoryId == beforIn.commodityCategoryId }"
              @click="selectType(item.commodityCategoryId,'commodityCategoryId')">{{ item.categoryName }}</span>
            </div>

            <div class="searchModuleBtn">
              <el-button type="text" :size="size" :icon="foldStatus2 == 1 ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" @click="handleFold(2)">{{ foldStatus2 == 1 ? '展开' : '收起' }}</el-button>
            </div>
          </div>

          <div class="searchModule" :class="{ unfold : foldStatus3 === 0 }" v-show="selectList.classifyList && selectList.classifyList.length">
            <div class="searchModuleTitle">一级分类</div>
            <div class="searchModuleContent">
              <span class="filter_style_cell" :class="{ active: beforIn.commodityClassifyId === '' }" @click="getChildClassifyList('')">全部</span>
              <span
                v-for="(item,index) in selectList.classifyList"
                :class="{ active: item.id === beforIn.commodityClassifyId }"
                class="filter_style_cell"
                @click="getChildClassifyList(item.id,index)"
                :key="item.id"
              >{{ item.classifyName }}</span>
            </div>
            <div class="searchModuleBtn" v-show="selectList.classifyList && selectList.classifyList.length > 3">
              <el-button type="text" :size="size" :icon="foldStatus3 == 1 ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" @click="handleFold(3)">{{ foldStatus3 == 1 ? '展开' : '收起' }}</el-button>
            </div>
          </div>
          
          <div class="searchModule" :class="{ unfold : foldStatus4 === 0 }" v-show="selectList.childClassifyList && selectList.childClassifyList.length">
            <div class="searchModuleTitle">二级分类</div>
            <div class="searchModuleContent">
              <span class="filter_style_cell" :class="{ active: beforIn.childCommodityClassifyId === '' }" @click="selectClassify('')">全部</span>
              <span
                v-for="item in selectList.childClassifyList"
                @click="selectClassify(item.id)"
                class="filter_style_cell"
                :class="{ active: beforIn.childCommodityClassifyId === item.id }"
                :key="item.id"
              >{{ item.classifyName }}</span>
            </div>
            <div class="searchModuleBtn" v-show="selectList.childClassifyList && selectList.childClassifyList.length > 3">
              <el-button  type="text"  :size="size"  :icon="foldStatus4 == 1 ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"  @click="handleFold(4)">{{ foldStatus4 == 1 ? '展开' : '收起' }}</el-button>
            </div>
          </div>
        </div>
        <el-row :gutter="10" class="queryForm">
          <el-col :span="span">
            <el-input v-model.trim="beforIn.commodityGroup" placeholder="商品名称/商品编码" :size="size" clearable></el-input>
          </el-col>
          <el-col :span="span">
            <el-select v-model="beforIn.seriesId" placeholder="系列" clearable :size="size">
              <el-option v-for="item in seriesList" :key="item.id" :label="item.dictName" :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="span">
            <el-select v-model="beforIn.colourId" placeholder="颜色" clearable :size="size">
              <el-option v-for="item in colorsList" :key="item.id" :label="item.dictName" :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="span">
            <el-select v-model="beforIn.materialId" placeholder="材质" clearable :size="size">
              <el-option v-for="item in materialList" :key="item.id" :label="item.dictName" :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="span">
            <el-input v-model.trim="beforIn.commodityModel" placeholder="请输入货号" maxlength="50" :size="size" clearable></el-input>
          </el-col>
          <el-col :span="span">
            <el-button class="button-fc" type="warning" :size="size" @click="onSearch">查询</el-button>
            <el-button type="primary" :size="size" @click="resetFun">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
      <!-- 分类按钮组按钮组 -->
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane :label="item.name+`（${item.num}）`" :name="item.str" v-for="(item, index) in filterBtnList" :key="index"></el-tab-pane>
        <!-- 按钮组 -->
        <div class="m-bottom20 btnStyle">
          <!-- btnJurisdiction -->
          <div v-for="(item,index) in actionBtnList" :key="index">
            <el-button v-if="btnJurisdiction[item.str]" type="default" :size="btnSize" class="button-96 m-left10" @click="butGroupAction(item.type)">{{item.name}}</el-button>
          </div>
          <el-upload
            v-if="btnJurisdiction.goodsmanage_Import"
            action="/api/pc/commodity/importCommodity"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            class="upload-demo"
            multiple
            :headers="headers"
            :show-file-list="false"
            :before-upload="beforeUploat"
            :on-success="uploadSuccess"
            style="display:inline-block;margin-left:10px"
          >
            <el-button class="button-96" :size="btnSize">导入</el-button>
          </el-upload>
        </div>
        <!-- 表格 -->
        <!-- <tabshow v-on:childByValue="childByValue" :dataItem = "tabDate" class="shows"></tabshow> -->
        <div class="table_list" v-loading="loading">
          <el-table border :row-style="tableBodycolor" @selection-change="handleSelectionChange" :data="tabList" :row-class-name="tableRowClassName" :max-height="maxHeight">
            <el-table-column fixed="left" type="selection" width="50"></el-table-column>
            <el-table-column prop="commodity_code" label="商品编码" width="180" align="center" fixed="left" show-overflow-tooltip>
              <template slot-scope="scope">
                <div>
                  <el-tooltip placement="right" visible-arrow>
                    <div slot="content" class="tips tipFon">
                      <p @click="editHandle(scope.row)" class="operaItems">编辑</p>
                    </div>
                    <img :src="spot" alt class="attributesTips" />
                  </el-tooltip>
                  <p class="operation">{{scope.row.commodity_code}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="commodity_name" label="商品名称" width="240" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="company_name" label="供应商" width="200" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="brand_name" label="品牌名称" width="120" align="center" :filters="names" :filter-method="filterName"></el-table-column>
            <el-table-column prop="category_name" label="品类名称" width="120" align="center"></el-table-column>
            <el-table-column prop="classify_name" label="分类名称" width="200" align="center" show-overflow-tooltip></el-table-column>

            <!-- <el-table-column prop="commodity_model" label="颜色" width="240" align="center"></el-table-column>
            <el-table-column prop="commodity_model" label="系列" width="240" align="center"></el-table-column>
            <el-table-column prop="commodity_model" label="材质" width="240" align="center"></el-table-column>-->
            <el-table-column prop="commodity_model" label="商品型号" width="150" align="center" show-overflow-tooltip ></el-table-column>
            <el-table-column prop="item_number" label="货号" width="150" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="commodity_unit" label="单位" width="120" align="center" ></el-table-column>
            <el-table-column prop="valuationMethodName" label="计价方式" width="120" align="center"></el-table-column>
            <el-table-column prop="status" label="状态" width="100" align="center" :filters="typess" :filter-method="filterHandler">
              <template slot-scope="scope">
                <span v-if="scope.row.status==1">在产</span>
                <span v-if="scope.row.status==2">停产</span>
                <span v-if="scope.row.status==3">预计停产</span>
              </template>
            </el-table-column>

            <el-table-column prop="commodity_long" label="深" width="120" align="center" ></el-table-column>
            <el-table-column prop="commodity_wide" label="宽" width="120" align="center" ></el-table-column>
            <el-table-column prop="commodity_high" label="高" width="120" align="center" ></el-table-column>
            <el-table-column prop="commodity_thick" label="厚" width="120" align="center" ></el-table-column>
            <el-table-column prop="is_warehousing" label="是否入库" width="120" align="center" >
              <template slot-scope="scope">
                <span v-if="scope.row.is_warehousing==0">否</span>
                <span v-else>是</span>
              </template>
            </el-table-column>
            <el-table-column prop="is_unpacking" label="是否拆包" width="120" align="center" >
              <template slot-scope="scope">
                <span v-if="scope.row.is_warehousing==0">否</span>
                <span v-else>是</span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="construction_period"
              label="工期"
              width="120"
              align="center"
              
            ></el-table-column> -->
            <el-table-column prop="is_upper_shelf" label="是否上架" width="120" align="center" >
              <template slot-scope="scope">
                <span v-if="scope.row.is_upper_shelf==0">否</span>
                <span v-else>是</span>
              </template>
            </el-table-column>
            <el-table-column prop="commodity_describe" label="商品描述" width="200" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-html="scope.row.commodity_describe"></div>
              </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间" width="170" align="center" ></el-table-column>
            <el-table-column prop="createName" label="创建人" width="120" align="center" ></el-table-column>
            <el-table-column prop="update_time" label="修改时间" width="170" align="center" ></el-table-column>
            <el-table-column prop="updateName" label="修改人" width="120" align="center" ></el-table-column>
            <el-table-column prop="is_delete" label="是否删除" width="120" align="center" >
              <template slot-scope="scope">
                <span v-if="scope.row.is_delete==0">否</span>
                <span v-else>是</span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              :prop="item.fieldName"
              :label="item.title"
              width="240"
              v-for="(item,index) in tableTtile"
              :key="index"
              align="center"
            ></el-table-column>-->
          </el-table>
          <div class="pagination_wrap">
            <pagination
              :current-page="currentPage"
              :pageSize="pageSize"
              :total="total"
              @sizeChange="sizeChange"
              @currentChange="currentChange"
            ></pagination>
          </div>
        </div>
      </el-tabs>
      <el-dialog :visible.sync="dialogModel" width="20%">
        <div class="titlecals">{{Dialogtitle}}</div>
        <div class="center pl-20">
          <el-select v-model="selectVal" placeholder="请选择操作" class="width-100">
            <el-option
              v-for="item in selectArr"
              :key="item.val"
              :label="item.label"
              :value="item.val"
            ></el-option>
          </el-select>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogModel = false">取 消</el-button>
          <el-button type="primary" @click="sendJava">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import tabshow from "@/views/components/tabshow";
import { mapGetters } from "vuex";
import { getToken } from "utils/auth";
import spot from "@/assets/images/spot.png";
import {
  listCategory,
  listCommodityByPage,
  countCommodity,
  listClassify,
  listBrand,
  editStatus,
  editUpperShelf,
  listFailImportByPage
} from "api/productmanage/goodsmanage/goodsmanage";
import {
  listCommodity,
  listBaseDict, //字典查询
  listOrganization // 组织机构
} from "api/pulicJava";
import { getNames, getTypes, Approval } from "src/utils/pubilcFn.js";
export default {
  name: "goodsmanage",
  components: {
    tabshow,
    breadcrumb,
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {
      span: 6,
      // 查询条件搜索
      colorsList: [], //颜色
      materialList: [], //材质
      seriesList: [], //系列
      headers: {
        Authorization: getToken()
      },
      beforIn: {
        commodityGroup: "", // 商品名称/商品编码
        seriesId: "", // 系列
        materialId: "", // 材质
        colourId: "", // 颜色
        itemNumber: "", // 货号
        brandId: "", // 品牌
        commodityModel: "", //型号
        commodityCategoryId: "", // 品类
        commodityClassifyId: "", // 一级分类
        childCommodityClassifyId: "" // 二级分类
      },
      foldStatus1: 1, // 1展开 0 收起
      foldStatus2: 1, // 1展开 0 收起
      foldStatus3: 1, // 1展开 0 收起
      foldStatus4: 1, // 1展开 0 收起
      // 条件
      selectList: {
        brandList: [], // 品牌数据
        categoryList: [], // 品类数据
        classifyList: [], // 一级分类
        childClassifyList: [] // 二级分类
      },

      //***********************************************
      activeName: "all",
      tabstatus: 0,
      selectVal: "", //修改 上下架及状态数据
      selectArr: [],
      ComycategoryId: null, //品类id
      currentPage: 1, //当前页数
      pageSize: 10, //当前页最大条数
      total: 0, //总条数
      tabDate: [{ name: "商品", key: true }],
      spot, //图片
      dialogModel: false, //弹框shows
      navList: [], //头部面包屑导航
      names: [], //table筛选
      typess: [], //table筛选数据
      tableTtile: [], //table Title数据
      tabList: [], //table列表数据
      searchtext: "", //查询内容
      statuestyle: "", //状态查询
      downCommodity: "",
      checks: [], //tab单选 返回数据
      styleList: [],
      commodityBrand: [],
      //过滤按钮组
      filterBtnList: [
        { name: "全部产品", type: null, num: 0, str: "all" },
        { name: "已上架", type: 1, num: 0, str: "already" },
        { name: "未上架", type: 0, num: 0, str: "not" }
      ],
      //过滤按钮激活flag
      filterbtn: 0,
      //页面操作按钮list
      actionBtnList: [
        { name: "新增商品", type: 1, str: "goodsmanage_Add" },
        { name: "批量修改状态", type: 3, str: "goodsmanage_Modifystate" },
        { name: "批量上/下架", type: 4, str: "goodsmanage_Shelf" }
      ],
      listData: [], //品类列表数据
      defaultProps: {
        children: "children",
        label: "label"
      },
      Shelfstate: null,
      Dialogtitle: "",
      loading: true,

      // 按钮权限***********
      btnJurisdiction:JSON.parse(this.$loca.getItem("element"))
    };
  },
  activated(){
    let topH = this.$refs.topInfo.offsetHeight;
    let tabH = this.$refs.tab;
    let height = topH + 52;
    window.onscroll = function() {
      let winscrollTop = document.documentElement.scrollTop;
      if (winscrollTop + 40 > height) {
        tabH.setAttribute("style", "top:10px !important;height:100vh;");
      } else {
        tabH.setAttribute("style", `top:${height}px !important`);
      }
    };
    // 头部面包屑
    this.navList = this.$route.meta;

    // this.getList();//获取数量
    this.getListData(); //获取商品列表
    this.getList();

    // 获取品牌
    this.getBrandList();
    // 获取品类
    this.getCategoryList();
    //获取颜色
    this.getColors();
    //获取材质
    this.getMaterial();
    //获取系列
    this.getSeries();

    this.getBrand();
  },
  // deactivated () {
  //   this.$destroy(true)
  // },
  // created() {
  //   // this.getinformation();
  //   this.getBrand();
  // },
  // mounted() {
  //   let topH = this.$refs.topInfo.offsetHeight;
  //   let tabH = this.$refs.tab;
  //   let height = topH + 52;
  //   window.onscroll = function() {
  //     let winscrollTop = document.documentElement.scrollTop;
  //     if (winscrollTop + 40 > height) {
  //       tabH.setAttribute("style", "top:10px !important;height:100vh;");
  //     } else {
  //       tabH.setAttribute("style", `top:${height}px !important`);
  //     }
  //   };
  //   // 头部面包屑
  //   this.navList = this.$route.meta;

  //   // this.getList();//获取数量
  //   this.getListData(); //获取商品列表
  //   this.getList();

  //   // 获取品牌
  //   this.getBrandList();
  //   // 获取品类
  //   this.getCategoryList();
  //   //获取颜色
  //   this.getColors();
  //   //获取材质
  //   this.getMaterial();
  //   //获取系列
  //   this.getSeries();
  // },
  methods: {
    //*********************************查询条件
    //获取颜色
    getColors() {
      let data = {
        dataType: "COMMODITY_COLOR"
      };
      listBaseDict(data)
        .then(res => {
          this.colorsList = res.data;
        })
        .catch(error => {
          console.error("获取颜色", error);
        });
    },
    // 材质
    getMaterial() {
      let data = {
        dataType: "COMMODITY_MATERIAL"
      };
      listBaseDict(data)
        .then(res => {
          this.materialList = res.data;
        })
        .catch(error => {
          console.error("获取材质", error);
        });
    },

    // 系列
    getSeries() {
      let data = {
        dataType: "DEMAND_STYLE"
      };
      listBaseDict(data)
        .then(res => {
          this.seriesList = res.data;
        })
        .catch(error => {
          console.error("获取系列", error);
        });
    },
    // 查询
    onSearch() {
      this.currentPage = 1;
      this.getListData();
      this.getList();
    },

    // 重置
    resetFun() {
      this.beforIn = {
        ...this.beforIn,
        commodityGroup: "", // 商品名称/商品编码
        seriesId: "", // 系列
        materialId: "", // 材质
        colourId: "", // 颜色
        itemNumber: "", // 货号
        brandId: "", // 品牌
        commodityModel: "", //型号
        commodityCategoryId: "", // 品类
        commodityClassifyId: "", // 一级分类
        childCommodityClassifyId: "" // 二级分类
      };
    },
    //点击品牌展开
    handleFold(type) {
      this["foldStatus" + type] = this["foldStatus" + type] == 1 ? 0 : 1;
    },
    getChildClassifyList(commodityClassifyId, index) {
      if (commodityClassifyId) {
        this.selectList.childClassifyList = this.selectList.classifyList[
          index
        ].children;
        this.beforIn.commodityClassifyId = commodityClassifyId; // 一级分类
        this.beforIn.childCommodityClassifyId = "";
      } else {
        // 点击一级分类的全部
        this.beforIn.commodityClassifyId = "";
        this.beforIn.childCommodityClassifyId = "";
        this.selectList.childClassifyList = [];
      }
      this.beforIn.commodityClassifyId = commodityClassifyId;
      this.getListData();
    },
    // 获取全部品牌列表
    getBrandList() {
      listBrand()
        .then(res => {
          if (res.status == 200) {
            this.selectList.brandList = res.data;
          }
        })
        .catch(error => {
          console.log(
            "成本销售价格 成本价格维护 获取全部品牌列表 views/salecost/costguard/index",
            error
          );
        });
    },

    // 获取全部品类列表
    getCategoryList() {
      listCategory()
        .then(res => {
          if (res.status == 200) {
            this.selectList.categoryList = res.data;
          }
        })
        .catch(error => {
          console.log(
            "成本销售价格 成本价格维护 获取全部品类列表 views/salecost/costguard/index",
            error
          );
        });
    },

    // 选中品牌 and 品类
    selectType(value, type) {
      this.ComycategoryId = value;
      this.activeName = "all";
      this.beforIn[type] = value;
      this.Shelfstate = null;
      this.getListData();
      this.getList();
      if (type == "commodityCategoryId") {
        // 如果是点击品类 即 获取二级分类
        this.selectList.classifyList = [];
        this.selectList.childClassifyList = [];
        this.beforIn.commodityClassifyId = "";
        if (value) {
          let params = {
            commodityCategoryId: value
          };
          listClassify(params)
            .then(response => {
              this.selectList.classifyList = response.data; // 一级分类
            })
            .catch(error => {
              console.log(
                "成本销售价格 成本价格维护 选中品牌 and 品类 views/salecost/costguard/index",
                error
              );
            });
        }
      }
    },

    // 点击一级分类 即获取二级分类
    getChildClassifyList(commodityClassifyId, index) {
      if (commodityClassifyId) {
        this.selectList.childClassifyList = this.selectList.classifyList[
          index
        ].children;
        this.beforIn.commodityClassifyId = commodityClassifyId; // 一级分类
        this.beforIn.childCommodityClassifyId = "";
      } else {
        // 点击一级分类的全部
        this.beforIn.commodityClassifyId = "";
        this.beforIn.childCommodityClassifyId = "";
        this.selectList.childClassifyList = [];
      }
      this.beforIn.commodityClassifyId = commodityClassifyId;
      this.getListData();
    },

    handleFold(type) {
      this["foldStatus" + type] = this["foldStatus" + type] == 1 ? 0 : 1;
    },

    // 点击二级分类
    selectClassify(commodityClassifyId) {
      if (commodityClassifyId) {
        this.beforIn.commodityClassifyId = commodityClassifyId;
      } else {
        // 点击二级分类的全部
        this.beforIn.commodityClassifyId = this.commodityClassifyId;
      }
      this.beforIn.childCommodityClassifyId = commodityClassifyId;
      this.getListData();
    },

    //*************************************
    handleClick(tab, event) {
      let type = this.filterBtnList.filter(item => {
        return item.str == this.activeName;
      })[0].type;
      this.butGroupfilter(type);
    },
    getBrand() {
      //获取分类
      listBrand()
        .then(res => {
          this.commodityBrand = res.data;
        })
        .catch(error => {
          console.error("获取品牌", error);
        });
    },

    getclassification() {
      //获取商品分类
      listClassify({
        commodityCategoryId: this.ComycategoryId
      })
        .then(res => {
          this.styleList = res.data;
        })
        .catch(error => {
          console.error("获取商品分类", error);
        });
    },
    screenSend() {
      this.names = getNames("brand_name", this.tabList); //调用筛选数据处理
      this.typess = Approval(
        "status",
        this.tabList,
        "在产",
        "停产",
        "预计停产"
      ); //调用筛选数据处理
    },
    getList() {
      //上下架
      this.filterBtnList.forEach((value, index) => {
        value.num = 0;
      });
      countCommodity({
        ...this.beforIn
      })
        .then(res => {
          if (res.status == 200) {
            res.data.forEach((item, index) => {
              this.filterBtnList[index].num = item.allCount;
            });
          }
        })
        .catch(error => {
          console.error(
            "产品管理：获取产品商家数量 productmanage/productmanages/addproducts"
          );
        });
    },
    btnList(item, i = 0) {
      //切换品类
      this.listData.forEach((attr, index) => {
        if (index == i) {
          attr.flag = true;
        } else {
          attr.flag = false;
        }
      });
      this.ComycategoryId = item.commodityCategoryId;
      this.currentPage = 1;
      this.getList();
      this.getListData();
      // this.getclassification();
    },
    getListData() {
      //商品列表数据
      let data = {
        ...this.beforIn,
        isUpperShelf: this.Shelfstate, //上架状态
        page: this.currentPage, //当前页
        limit: this.pageSize //分页数量
      };
      listCommodityByPage(data)
        .then(res => {
          if (res.status == 200) {
            this.tableTtile = res.data.CommodityColumn;
            this.tabList = res.data.list;
            this.loading = false;
            this.total = res.data.total;
            this.screenSend();
          }
        })
        .catch(error => {
          this.loading = false;
          console.error(
            "商品管理 商品查询接口 views/productmanage/goodsmanage/index",
            error
          );
        });
    },
    sizeChange(val) {
      //翻页方法
      this.currentPage = 1;
      this.pageSize = val;
      this.getListData();
    },
    currentChange(val) {
      //翻页方法
      this.currentPage = val;
      this.getListData();
    },
    handleSelectionChange(val) {
      //table列表勾选方法
      this.checks = val;
    },
    filterHandler(value, row, column) {
      //筛选方法调用
      switch (value) {
        case "在产":
          value = 0;
          break;
        case "预计停产":
          value = 1;
          break;
        case "停产":
          value = 2;
          break;
      }

      const property = column["property"];
      return row[property] == value;
    },
    filterName(value, row, column) {
      //筛选方法调用
      const property = column["property"];
      return row[property] == value;
    },
    //获取品类列表信息
    getinformation() {
      let data = {
        categoryName: this.searchtext
      };
      listCategory(data)
        .then(res => {
          this.listData = res.data.map(item => {
            item.flag = false;
            return item;
          });
          this.btnList(this.listData[0]);
        })
        .catch(error => {
          console.log(
            "商品管理 获取品类列表 views/productmanage/goodsmanage/index",
            error
          );
        });
    },
    // 改变table头部颜色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background: #f8f8f8;border-color: #dddddd";
      }
    },
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      // return "height: 80px";
    },
    //查询按钮点击
    searchFun() {
      this.getListData();
    },
    Reset() {
      this.beforIn = {};
    },
    //filterbun
    butGroupfilter(type) {
      this.Shelfstate = type;
      this.getListData();
      // if (type == 0) {
      // } else if (type == 1) {
      //   this.getListData();
      // } else {
      //   this.getListData();
      // }
    },
    sendJava() {
      //批量修状态 上下架 据接口
      let data = {};
      let fn;
      if (this.checks.length == 0 || this.selectVal === "") {
        this.$message.error("你未勾选或者未选择");
        return;
      }

      if (this.Dialogtitle == "批量修改状态") {
        data.status = this.selectVal;
      } else {
        data.isUpperShelf = this.selectVal;
      }
      data.commodityIds = this.checks
        .map(item => {
          return item.commodity_id;
        })
        .join();
      this.Dialogtitle == "批量修改状态"
        ? (fn = editStatus)
        : (fn = editUpperShelf);
      fn(data)
        .then(res => {
          this.dialogModel = false;
          this.$message({ message: "操作成功", type: "success" });
          this.getListData();
        })
        .catch(res => {
          console.error(
            "产品管理：修改状态 上下架 productmanage/productmanages/index"
          );
        });
    },
    //按钮组函数
    butGroupAction(type) {
      if (type == 1) {
        //页面跳转
        this.addbrand();
      } else if (type == 3) {
        this.eidStatus(0);
      } else {
        this.eidStatus(1);
      }
    },
    //导入之前
    beforeUploat(file) {},
    //导入成功
    uploadSuccess(file) {
      if (file.status == 200) {
        listFailImportByPage()
          .then(res => {
            if (res.status == 200) {
              if (res.data.rows.length == 0) {
                this.$message.success("导入成功!");
              } else {
                this.$router.push({
                  path: "failurelist"
                });
              }
            }
          })
          .catch(error => {
            console.error("获取失败列表", error);
          });
      } else {
        this.$message.error("导入失败");
      }
    },
    eidStatus(index) {
      if (this.checks.length < 1) {
        this.$message.error("你未勾选!");
        return;
      }
      this.selectArr = [];
      //批量修改 状态 上下架弹框展示数据
      if (index == 0) {
        this.Dialogtitle = "批量修改状态";
        this.selectArr = [
          { label: "预计停产", val: 1 },
          { label: "在产", val: 0 },
          { label: "停产", val: 3 }
        ];
      } else {
        this.Dialogtitle = "批量上/下架";
        this.selectArr = [{ label: "下架", val: 0 }, { label: "上架", val: 1 }];
      }
      this.dialogModel = true;
    },
    //添加新
    addbrand(row) {
      console.log(row);
      this.$router.push({
        path: "addgoods"
        // query: { id: this.ComycategoryId }
      });
    },
    //编辑
    editHandle(row) {
      console.log(row);
      this.$router.push({
        path: "editgoods",
        query: {
          brandId: row.brand_id,
          id: row.commodity_id,
          commodityCategoryId: row.commodity_category_id
        }
      });
    },
    //编辑
    setStatue(row, type) {
      console.log(row);
      this.$router.push({ path: "scalegoods", query: { id: row.id } });
    },
    //查看
    seeHandle(row) {
      console.log(row);
      this.$router.push({ path: "scalebrand", query: { id: row.id } });
    }
  },
  computed: {
    ...mapGetters(["maxHeight", "size", "btnSize"])
  }
};
</script>
<style scoped lang="scss">
.btnStyle {
  display: flex;
}
.searchModules {
  width: 100%;
  margin-bottom: 10px;
  font-size: 14px;
  .searchModule {
    width: 100%;
    display: flex;
    background-color: #fff;
    border-bottom: 1px solid #dcdfe6;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    .searchModuleTitle {
      width: 180px;
      background-color: #f0f5f9;
      text-align: center;
    }
    .searchModuleContent {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: start;
      flex-wrap: wrap;
      color: #666;
      .filter_style_cell {
        cursor: pointer;
        padding: 0 30px;
        width: 25%;
        height: 40px;
        overflow: hidden;
      }
      .filter_style_cell.active {
        color: #409eff;
      }
    }
  }
  .unfold {
    overflow: auto;
    height: auto;
  }
}
</style>

