<template>
  <div class="orderList" v-if="tableData.length!==0">
    <!-- <div class="page_head_div"></div> -->
    <div class="headerStyle">
      <div class="inputStyle">
        <div class="iconBox">
          <i class="Icon"></i>
          <span>到货单列表</span>
        </div>
        <el-input v-model="search" @keyup.enter.native='queryFun()' size="mini" style='width:200px;' class="m-left10" placeholder="输入采购单号或者采购合同号"/>
      </div>
      <div>
        <el-upload
          action="/api/pc/arrivalNotice/importArrivalNoticeSummary"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          class="upload-demo"
          multiple
          :headers="headers"
          :data="obj"
          :show-file-list="false"
          :before-upload="beforeUploat"
          :on-success="uploadSuccess"
          style="display:inline-block;margin-left:10px"
        >
          <el-button class="button-96" size="small">导入</el-button>
        </el-upload>
        <el-button size="small" v-if="btnJurisdiction.stockPending_Cargo1" class="button-96 m-left10" @click="cargoareaBtn">选择货区货位</el-button>
        <el-button size="small" v-if="btnJurisdiction.stockPending_Cargo2" class="button-96" @click="butGroupAction">分别选择货区货位</el-button>
      </div>
      <!-- 分配货区货位 -->
      <div class="quantity" v-if="isShow">
        <div class="areaorlocation">
          <ul class="areaStyle">
            <li v-for="(item,index) in arealocation" :class="indexs==index?'areabg':''" :key="index" @click="areaFun(index)">{{item.regionName}}</li>
          </ul>
          <ul class="location">
            <div class="input_numbers">
              <span>数量：</span>
              <el-input-number :disabled="isNums" size="small" v-model="Cargonum" @change="handleChange"></el-input-number>
            </div>

            <div class="cargo">
              <span>货位：</span>
              <el-input style="width:67%;" size="small" v-model.trim="CargoStr"></el-input>
            </div>

            <div class="btn">
              <el-button type="primary" size="mini" @click="locationFun(1)">确定</el-button>
              <el-button size="mini" @click="areaCancel">取消</el-button>
            </div>
          </ul>
        </div>
      </div>
    </div>

    <div class="table_list lvs attribute m-top10">
      <!-- <el-input v-model="search" size="mini" style='width:200px;' class='m-bottom10' placeholder="输入采购单号或者采购合同号"/> -->
      <el-table border style="width: 100%" :row-class-name="tableRowClassName" 
        :data="datas" @selection-change="handleSelectionChange" :max-height="maxHeight"
      >
        <el-table-column align="center" type="selection" fixed="left"></el-table-column>
        <el-table-column align="center" prop="purchaseNumber" label="采购单号" width="140" fixed="left" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column align="center" prop="arrivalNoticeCode" label="到货单号" width="120" show-overflow-tooltip></el-table-column> -->
        <el-table-column align="center" prop="certStr" label="货区货位" width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row.certStr">
              {{scope.row.certStr}}
            </div>
            <div class="CargoStyle" v-else>
              <el-select size="small" v-model="scope.row.regionId" placeholder="请选择">
                <el-option v-for="item in arealocation" :key="item.regionId" :label="item.regionName" :value="item.regionId"></el-option>
              </el-select>
              <el-input @blur="CargoSureFn(1,scope.row.arrivalNoticeDetailId,scope.row.CargoStr,scope.row.regionId,scope.row.summaryId)" 
                v-model.trim="scope.row.CargoStr" size="small"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-for="(item,index) in headerList" :key="index" align="center" prop="receiptsType" :label="item.aogTemplateName" width="80">
          <template slot-scope="scope">
            <div>
              <!-- <p>{{scope.row.list[index].dataValue}}</p> -->
              <el-input size="small" v-model="scope.row.list[index].dataValue"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" width="250">
          <template slot-scope="scope">
            <div>
              <el-input size="small" v-model="scope.row.treasuryNote"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="contractSerialNumber" label="采购合同号" width="150" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>

    <div class="contentBox">
      <el-dialog :visible.sync="dialogModel" fullscreen top="2vh">
        <div class="pl-20">
          <div class="operationbutton m-bottom10">
            <el-button size="small" class="button-96 m-right40" @click="cargoArea">选择货区货位</el-button>
            <el-button size="small" class="button-96 m-right40" @click="delCargo">删除</el-button>
          </div>
          <!-- 分配货区货位 -->
          <div class="quantity" v-if="isFlag">
            <div class="areaorlocation">
              <ul class="areaStyle">
                <li v-for="(item,index) in arealocation" :class="indexs==index?'areabg':''" :key="index" @click="areaFun(index)">{{item.regionName}}</li>
              </ul>
              <ul class="location">
                <div class="input_numbers">
                  <span>数量：</span>
                  <el-input-number :disabled="isNums" size="small" v-model="Cargonum" @change="handleChange"></el-input-number>
                </div>

                <div class="cargo">
                  <span>货位：</span>
                  <el-input style="width:67%;" size="small" v-model.trim="CargoStr"></el-input>
                </div>

                <div class="btn">
                  <el-button type="primary" size="mini" @click="locationFun(2)">确定</el-button>
                  <el-button size="mini" @click="areaCancel">取消</el-button>
                </div>
              </ul>
            </div>
          </div>

          <!-- 包数据 -->
          <div class="orderList m-top10" v-if="pageList.length!==0">
            <el-checkbox class="m-left10" v-model="Allelection">全选</el-checkbox>
            <div class="maximum">
              <div v-for="(val,idx) in pageList">
                <div v-for="(item,index) in val.summaryList" :key="index">
                  <div class="order_item m-bottom">
                    <div class="item_header multipleTableHeaderBg">
                      <el-checkbox class="m-left10" v-model="item.checked" @change="checkfather(index)"></el-checkbox>
                      <div class="purchase m-left10">
                        <span class="span_title">采购单号：</span>
                        <span>{{item.purchaseNumber}}</span>
                      </div>
                      <div class="CargoSty">
                        <p>货区货位：</p>
                        <el-select size="small" v-model="val.regionId" placeholder="请选择">
                          <el-option v-for="item in arealocation" :key="item.regionId" :label="item.regionName" :value="item.regionId"></el-option>
                        </el-select>
                        <el-input v-model.trim="val.CargoStr" size="small"></el-input>
                      </div>
                      <div class="purchase">
                        <p>备注：</p>
                        <el-input size="small" v-model="val.treasuryNote"></el-input>
                      </div>
                    </div>
                    <div class="item_body">
                      <div class="item_div">
                        <ul>
                          <li class="itemValue">名称</li>
                          <li class="itemValue">数量</li>
                          <li class="itemValue">实收数</li>
                          <li class="item_tiele textAl li_detail1">详情</li>
                        </ul>
                        <ul v-for="(pro,i) in item.list" :key="i">
                          <li class="itemValue">
                            <el-checkbox @change="checkChild(idx,index)" v-model="pro.isName">{{val.aogTemplateList[i].aogTemplateName}}</el-checkbox>
                          </li>
                          <li class="itemValue">{{pro.receivableCount}}</li>
                          <li class="inputStle">
                            <el-input placeholder maxlength="50" size="mini" v-model.number="pro.paidInCount"></el-input>
                          </li>
                          <li class="item_tiele">
                            <div v-if="pro.cargoList.length!=0">
                              <div class="li_detail2" v-for="(attr,k) in pro.cargoList" :key="k">
                                <div class="details checkStyle" :title="attr.regionSiteName+' 数量'+attr.num">
                                  <el-checkbox v-model="attr.iscore" @change="cargoChange">
                                    <p class="corsS">{{attr.regionSiteName}}</p>
                                    <p>数量：{{attr.num}}</p>
                                  </el-checkbox>
                                </div>
                              </div>
                            </div>

                            <div class="CargoStyle" v-else>
                              <el-select size="small" v-model="pro.regionId" placeholder="请选择">
                                <el-option v-for="item in arealocation" :key="item.regionId" :label="item.regionName" :value="item.regionId"></el-option>
                              </el-select>
                              <el-input @blur="CargoSureFn(2,pro.arrivalNoticeDetailId,pro.CargoStr,pro.regionId)" v-model.trim="pro.CargoStr" size="small"></el-input>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 按钮 -->
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sendJava">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import { getTreeById } from "api/entrepotSet/locationcargoarea/index.js";
import {
  getPutInStorageOrderList,
  getArrivalNoticeDetailSiteById,
  checkSiteOrAddSite,
  getOrderAndPurchaseBackById
} from "api/entrepotSet/stockManagement/stockPending/stockPending";
import { mapGetters, mapMutations } from "vuex";
import { getToken } from "utils/auth";
export default {
  components: {
    pagination
  },
  props: ["isOrder", "stockList"],
  data() {
    return {
      // 按钮权限***********
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
      headers: {
        Authorization: getToken()
      },
      obj:{},
      search:'',
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 0, //总条数
      dataList: [], //选择货区数据
      choseArr: [], //勾选
      tableData: [], //订单列表
      orderReport: [], //订单报损列表
      headerList: [], //订单标头
      arealocation: [], //货区货位数据
      reportList: [], //报损数据
      dialogModel: false, //弹框
      names: ["名称", "数量", "实收"],
      Cargonum: 0, //数量
      backupsnum: 0, //备份数量
      indexs: 0, //点击选择货区货位状态
      i: 0, //点击报损状态
      isFlag: false, //货区货位显示
      isReport: false, //报损显示
      isNums: false, //选择货区货位数量禁用
      // cargoHearList: [], //采购单标头
      // cargoMainList: [], //采购单内容
      pageList: [], //包
      quantitative: 0, //判断数量是否超出
      CargoStr: "", //货位
      isShow: false, //货位
      isCore: false,
      datas:[]
    };
  },
  created() {
    // false代表是批量入库
    if (this.isOrder) {
      this.getOrderList();
    } else {
      this.OrderAnd();
    }
  },
  mounted() {
    let { isWay, purchaseType, putInStorageType } = this.$route.query;
    this.getData();
  },
  computed: {
    ...mapGetters(["storagearea", "id","maxHeight"]),
    // 全选
    Allelection: {
      get() {
        let str = this.pageList.every(attr => {
          return attr.summaryList.every(item => {
            return item.checked;
          });
        });
        return str;
      },
      set(val) {
        this.pageList.forEach(attr => {
          attr.summaryList.forEach(item => {
            item.checked = val;
          });
        });
        this.pageList.forEach(attr => {
          attr.summaryList.forEach(item => {
            item.list.forEach(attr => {
              attr.isName = item.checked;
            });
          });
        });
      }
    }
  },
  methods: {
    ...mapMutations(["SET_STORAGEAREA"]),
    //导入之前
    beforeUploat(file) {
      this.obj.arrivalNoticeCode = this.$route.query.arrivalNoticeCode;
      this.obj.storageId = this.$route.query.storageId;
    },
    //导入成功
    uploadSuccess(file) {
      if (file.status == 200) {
        if (this.isOrder) {
          this.getOrderList();
        } else {
          this.OrderAnd();
        }
      }
    },
    //采购单筛选
    queryFun(){
     this.datas = this.tableData.filter(data => {
        return !this.search || data.purchaseNumber.toLowerCase().includes(this.search.toLowerCase()) || data.contractSerialNumber.toLowerCase().includes(this.search.toLowerCase())
      })
    },
    /**
     * 选择货区货位里面的列表数据
     * @method
     * getArrival
     */
    getArrival() {
      let arrivalNoticeId = this.choseArr
        .map(item => {
          return item.arrivalNoticeId;
        })
        .join(",");
      let summaryId = this.choseArr
        .map(item => {
          return item.summaryId;
        })
        .join(",");
      let data = {
        arrivalNoticeId,
        summaryId
      };
      getArrivalNoticeDetailSiteById(data)
        .then(res => {
          if (res.status == 200) {
            this.pageList = res.data.map((item, index) => {
              item.summaryList = item.summaryList.map(attr => {
                attr.list = attr.list.map(val => {
                  return {
                    ...val,
                    isName: false,
                    cargoList: [],
                    regionId: this.arealocation[0]?this.arealocation[0].regionId:'',
                    CargoStr: "",
                  };
                });
                return {
                  ...attr,
                  checked: false
                };
              });
              item.regionId = this.arealocation[0]?this.arealocation[0].regionId:'';
              item.CargoStr = "";
              item.treasuryNote = this.tableData[index].treasuryNote;
              return item;
            });

            /**
             * 判断当前vuex是否有数据，有数据走回显
             */

            this.choseArr.forEach(key => {
              if (this.storagearea.arr) {
                this.storagearea.arr.forEach((item, index) => {
                  if (item.cargoMainList) {
                    if (item.summaryId == key.summaryId) {
                      item.cargoMainList.forEach(attr => {
                        this.pageList[index].summaryList = item.cargoMainList;
                        this.pageList[index].CargoStr = item.CargoStr;
                        this.pageList[index].regionId = item.regionId;
                      });
                    }
                  }
                });
              }
            });
          }
        })
        .catch(error => {
          console.error("入库订单数据", error);
        });
    },
    //货区货位弹框确定
    sendJava() {
      let flag = this.pageList.every(item => {
        return item.regionId && item.CargoStr;
      });
      if (flag) {
        this.pageList.forEach(item => {
          if (item.regionId && item.CargoStr) {
              this.purchasingFn(item.summaryId, item.CargoStr, item.regionId);
          }
        });
        // this.purchasingFn()
      }

      this.choseArr.forEach(attr => {
        this.tableData.forEach((item, index) => {
          if (attr.summaryId == item.summaryId) {
            item.cargoMainList = this.pageList[index].summaryList;
            item.CargoStr = this.pageList[index].CargoStr;
            item.regionId = this.pageList[index].regionId;
          }
        });
      });
      this.pageList.forEach((item, index) => {
        this.tableData[index].treasuryNote = item.treasuryNote;
      });

      this.SET_STORAGEAREA({
        arr: this.tableData
      });

      this.tableData.forEach(item=>{
        if(item.cargoMainList){
          item.cargoMainList.forEach(attr=>{
            let flag = attr.list.every(key=>{
              return key.cargoList;
            });
            item.flag = !flag;
          })
        }
      })
      this.dialogModel = false;
      this.isFlag = false;
    },
    /**
     * 点击表格上确定 
     * 
     * @param type
     * 1整体分配货区货位 2分别分配货区货位
     * 
     * @param arrivalNoticeDetailId
     * 到货单明细ID
     * 
     * @param CargoStr
     * 输入货位
     * 
     * @param regionId
     * 货区ID
     * 
     * @param summaryId
     * 到货单汇总ID
     */
    CargoSureFn(type,arrivalNoticeDetailId, CargoStr, regionId,summaryId = '') {
      
      if (!regionId) {
        this.$message.error("没有选择货区!");
        return;
      }
      if(!CargoStr){
        this.$message.error('没有选择货位');
      }
      let data = {
        regionId: regionId,
        siteCode: CargoStr,
        storageId: this.$route.query.storageId,
        status: 0,
        userId: this.id
      };
      checkSiteOrAddSite(data).then(res => {
          if (res.status == 200) {
            let arr = this.arealocation.filter(item => {
              return regionId == item.regionId;
            });

            let obj = {
              regionSiteName: arr[0].regionName + " " + res.data.siteCode,
              regionId: res.data.regionId,
              siteId: res.data.siteId
            };

            if (!res.data.siteCode) {
              this.$message.error("当前没有写货位!");
              return;
            }

            // 1整体分配货区   2分别分配货区
            if(type == 1){
              this.tableData.forEach(item=>{
                if(item.summaryId==summaryId){
                  item.certStr = obj.regionSiteName;
                  item.regionId = obj.regionId;
                  item.siteId = obj.siteId;
                  item.flag = true;
                }
              })
            }else{
              this.pageList.forEach(item => {
                item.summaryList.forEach(attr => {
                  attr.list.forEach(val => {
                    if (val.arrivalNoticeDetailId == arrivalNoticeDetailId) {
                      if (val.paidInCount && val.paidInCount == 0) {
                        this.$message.error("当前有实收数有误或者为0!");
                        return;
                      }
                      val.cargoList=[{
                        regionSiteName: obj.regionSiteName,
                        siteId: obj.siteId,
                        regionId: obj.regionId,
                        num: val.paidInCount,
                        iscore: false,
                        isT: false
                      }];
                    }
                  });
                });
              });
            }
          }
        })
        .catch(error => {
          console.error("新增货位", error);
        });
    },
    /**
     * 点击弹框新增货位确定
     * 
     * @param summaryId
     * 到货单汇总ID
     * 
     * @param CargoStr
     * 输入货位
     * 
     * @param regionId
     * 货区ID
     */
    purchasingFn(summaryId, CargoStr, regionId) {
      // debugger
      if (!regionId) {
        this.$message.error("没有选择货区!");
        return;
      }
      let data = {
        regionId: regionId,
        siteCode: CargoStr,
        storageId: this.$route.query.storageId,
        status: 0,
        userId: this.id
      };
      checkSiteOrAddSite(data)
        .then(res => {
          if (res.status == 200) {
            let arr = this.arealocation.filter(item => {
              return regionId == item.regionId;
            });

            let obj = {
              regionSiteName: arr[0].regionName + " " + res.data.siteCode,
              regionId: res.data.regionId,
              siteId: res.data.siteId
            };

            if (!res.data.siteCode) {
              this.$message.error("当前没有写货位!");
              return;
            }
            this.pageList.forEach(item => {
              item.summaryList.forEach(attr => {
                attr.list.forEach(val => {
                  if (item.summaryId == summaryId) {
                    if (val.paidInCount && val.paidInCount == 0) {
                      // this.$message.error("当前有实收数有误或者为0!");
                      return;
                    }
                    val.cargoList.push({
                      regionSiteName: obj.regionSiteName,
                      siteId: obj.siteId,
                      regionId: obj.regionId,
                      num: val.paidInCount,
                      iscore: false,
                      isT: false
                    });
                  }
                });
              });
            });
          }
        })
        .catch(error => {
          console.error("新增货位", error);
        });
    },

    //获取货区
    getData() {
      getTreeById({
        storageId: this.$route.query.storageId,
        theStaging: 0
      })
        .then(res => {
          if (res.status == 200) {
            this.arealocation = res.data;
            this.tableData.forEach(item=>{
              item.regionId = this.arealocation[0]?this.arealocation[0].regionId:''
            })
          }
        })
        .catch(error => {
          console.error("获取货区", error);
        });
    },
    //同一到货单入库
    OrderAnd() {
      let { packageId } = this.$route.query;

      let data = {
        packageId
      };
      getOrderAndPurchaseBackById(data)
        .then(res => {
          if (res.status == 200) {
            this.headerList = res.data.mapPackage.aogTemplateList.sort(
              (a, b) => {
                return a.aogTemplateId - b.aogTemplateId;
              }
            );

            this.tableData = res.data.mapPackage.list.map((item, index) => {
              let arr = item.list.sort((a, b) => {
                return a.aogTemplateId - b.aogTemplateId;
              });
              // let flag = Boolean(item.certStr);
              return { ...item,flag:true,regionId:this.arealocation[0]?this.arealocation[0].regionId:'', treasuryNote: "", list: arr };
            });
            this.datas = this.tableData;
          }
        })
        .catch(error => {
          console.error("获取订单备货入库列表", error);
        });
    },
    //获取订单货物列表
    getOrderList() {
      let data = {
        putInStorageIdList: this.stockList.join(",")
      };
      getPutInStorageOrderList(data)
        .then(res => {
          if (res.status == 200) {
            this.headerList = res.data.aogTemplateList.sort((a, b) => {
              return a.aogTemplateId - b.aogTemplateId;
            });
           this.tableData = []
            res.data.list.map((item, index) => {
              let arr = item.list.sort((a, b) => {
                return a.aogTemplateId - b.aogTemplateId;
              });
              // let flag = Boolean(item.certStr);
              this.tableData.push({ ...item,flag:true,regionId:this.arealocation[0]?this.arealocation[0].regionId:'', list: arr, treasuryNote: "" });
              this.datas = this.tableData;
            });
          }
        })
        .catch(error => {
          console.error("获取订单货物列表", error);
        });
    },
    //点击累加
    handleChange() {
      if (this.Cargonum > this.backupsnum) {
        this.$message.error("数量不能大于实收数!");
        this.$nextTick(() => {
          this.Cargonum = this.backupsnum;
        });
      }
    },
    /**
     * 分配货区货位点击确定 
     * 
     * @param type
     * 1整体分配  2分别分配
     */
    locationFun(type) {
      let { regionId, regionName } = this.arealocation[this.indexs];
        if (!this.CargoStr) {
          this.$message.error("当前没有输入货位");
          return;
        }
        let data = {
          regionId,
          siteCode: this.CargoStr,
          storageId: this.$route.query.storageId,
          status: 0,
          userId: this.id
        };
        checkSiteOrAddSite(data)
          .then(res => {
            if (res.status == 200) {
              let obj = {
                regionSiteName: regionName + " " + res.data.siteCode,
                regionId: res.data.regionId,
                siteId: res.data.siteId
              };
              if(type == 1){
                if(this.choseArr.length==0){
                  this.$message.error('没有勾选!')
                  return
                }
                this.choseArr.forEach(attr=>{
                  this.tableData.forEach(item=>{
                    if(attr.summaryId == item.summaryId){
                      item.certStr = obj.regionSiteName;
                      item.regionId = obj.regionId;
                      item.siteId = obj.siteId;
                      item.flag = true;
                    }
                  });
                })
                this.isShow = false;
              }else{
                this.locatFn(obj);
              }
            }
          })
        .catch(error => {
          console.error("新增货位", error);
        });
    },
    //选择货位
    locatFn(obj) {
      let receivable = 0; //应收数
      let carNum = 0; //货位数量相加
      this.pageList.forEach(key => {
        key.summaryList.forEach(item => {
          item.list.forEach(attr => {
            if (attr.isName) {
              receivable = attr.paidInCount;
              attr.cargoList.forEach(val => {
                carNum += val.num;
                this.quantitative = carNum + this.Cargonum;
              });
            }
          });
        });
      });

      //判断当前是否勾选多个，然后分配货区货位
      if (this.isNums) {
        this.pageList.forEach(key => {
          key.summaryList.forEach(item => {
            item.list.forEach(attr => {
              if (attr.isName) {
                if (attr.paidInCount && attr.paidInCount != 0) {
                  attr.cargoList = [];
                  attr.cargoList.push({
                    regionSiteName: obj.regionSiteName,
                    siteId: obj.siteId,
                    regionId: obj.regionId,
                    num: attr.paidInCount,
                    iscore: false,
                    isT: false
                  });
                }
              }
            });
          });
        });
      } else {
        if (this.quantitative > receivable) {
          this.$message.error("数量超出!");
          return;
        }
        this.pageList.forEach(key => {
          key.summaryList.forEach(item => {
            item.list.forEach(attr => {
              if (attr.isName) {
                if (attr.paidInCount && attr.paidInCount != 0) {
                  attr.cargoList.push({
                    regionSiteName: obj.regionSiteName,
                    num: this.Cargonum,
                    siteId: obj.siteId,
                    regionId: obj.regionId,
                    iscore: false,
                    isT: false
                  });
                }
              }
            });
          });
        });
      }
      this.isFlag = false;
      this.CargoStr = "";
    },
    //货区货位change
    cargoChange() {
      this.pageList.forEach(key => {
        key.summaryList.forEach(item => {
          item.list.forEach(attr => {
            attr.cargoList.forEach(val => {
              if (val.iscore) {
                attr.isName = false;
              }
            });
          });
        });
      });
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //分别选择货区货位
    butGroupAction() {
      if (this.choseArr.length < 1) {
        this.$message.error("请选择一个采购单!");
      } else {
        this.getArrival();
        this.dialogModel = true;
      }
    },
    // 货区货位
    cargoareaBtn(){
      if(this.choseArr.length==0){
        this.$message.error('没有勾选!')
        return
      }
      this.Cargonum = 0;
      this.choseArr.forEach(attr=>{
        this.tableData.forEach(item=>{
          if(attr.summaryId == item.summaryId){
            item.list.forEach(attr=>{
              this.Cargonum += attr.dataValue * 1;
            })
          }
        })
      })
      
      this.isNums = true;
      this.isShow = true;
    },
    // 采购单勾选
    handleSelectionChange(val) {
      this.choseArr = val;
    },
    //选择货区货位
    cargoArea() {
      let sum = 0;
      let num = 0;
      this.quantitative = 0;
      this.pageList.forEach(key => {
        key.summaryList.forEach(item => {
          item.list.forEach(itm => {
            if (itm.isName) {
              sum += itm.paidInCount * 1;
              let nm = 0;
              itm.cargoList.forEach(val => {
                nm += val.num * 1;
              });
              sum = sum - nm;
              num++;
            }
          });
        });
      });
      this.isFlag = !this.isFlag;
      this.isNums = num > 1;
      this.isReport = false;
      this.Cargonum = sum;
      this.backupsnum = sum;
    },
    //删除货区货位
    delCargo() {
      this.pageList.forEach(key => {
        key.summaryList.forEach(item => {
          item.list.forEach(attr => {
            attr.cargoList = attr.cargoList.filter(key => {
              return !key.iscore;
            });
          });
        });
      });
    },

    //点击货位切换状态
    areaFun(index) {
      this.indexs = index;
    },
    //关闭选择货区货位按钮
    closeBox() {
      this.isFlag = false;
      this.isReport = false;
    },
    //点击父选框
    checkfather(index) {
      this.pageList.forEach(key => {
        key.summaryList[index].list.forEach(item => {
          item.isName = key.summaryList[index].checked;
        });
      });
    },
    cancel() {
      this.dialogModel = false;
      this.isFlag = false;
    },
    //点击子选框
    checkChild(index, i) {
      let flag = this.pageList[index].summaryList[i].list.every(item => {
        return item.isName;
      });
      if (flag) {
        this.pageList[index].summaryList[i].checked = flag;
        this.pageList.forEach(val => {
          val.summaryList.forEach(item => {
            item.list.forEach(attr => {
              if (attr.isNums) {
                attr.cargoList.forEach(key => {
                  key.iscore = false;
                });
              }
            });
          });
        });
      } else {
        this.pageList[index].summaryList[i].checked = flag;
      }
    },
    //取消
    areaCancel() {
      this.isFlag = false;
      this.isShow = false;
      this.isNums = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.inputStyle{
  display: flex;
  align-items: center;
  height: 100%;
}
.CargoStyle {
  display: flex;
}
.CargoSty {
  display: flex;
  p {
    min-width: 80px;
  }
}
.purchase {
  display: flex;
  p {
    min-width: 50px;
  }
}
.close {
  display: flex;
  flex-direction: row-reverse;
  span {
    cursor: pointer;
    display: block;
    margin-right: 10px;
  }
}

.details {
  .corsS {
    width: 110px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.bk {
  border-bottom: 1px solid #ebeef5;
}

.areabg {
  background: #a2a2a2 !important;
}
.bk {
  border-bottom: 1px solid #ebeef5;
}
.quantity {
  width: 300px;
  position: absolute;
  background: #333333;
  z-index: 2;
  top: 92px;
  right: 40px;
  color: #fff;
  border-radius: 4px;
}

.input_numbers {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
}
.reportloss {
  width: 150px;
  position: absolute;
  background: #333333;
  z-index: 2;
  right: -17px;
  top: 46px;
  color: #fff;
  border-radius: 4px;
}

.areaorlocation {
  display: flex;
  width: 100%;
}
.areaStyle {
  width: 35%;
  border-top: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  overflow-y: auto;
  max-height: 130px;

  &::-webkit-scrollbar {
    width: 10px;
    height: 1px;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #c5c5c5;
  }
  li {
    width: 100%;
    height: 30px;
    border-bottom: 1px solid #ebeef5;
    cursor: pointer;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  li:last-child {
    border-bottom: none;
  }
}
.location {
  width: 65%;

  .cargo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    span {
      min-width: 45px;
    }
  }

  .btn {
    display: flex;
    justify-content: center;
    margin: 10px 0;
  }
}
.report {
  width: 200px;
  position: absolute;
  background: #333333;
  z-index: 2;
  right: 59px;
  top: 91px;
  color: #fff;
  border-radius: 4px;
  padding-bottom: 10px;
}

.operationbutton {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
}
.page_head_div {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  height: 50px;
  justify-content: space-between;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 10px;
}
.headerStyle {
  display: flex;
  justify-content: space-between;
}
.warp_head_action_btn {
  // display: flex;
  // flex-direction: row-reverse;
  // align-items: center;
  // border: none;
}
.orderList {
  font-size: 14px;
  color: #909399;
  .maximum {
    max-height: 600px;
    overflow: auto;
  }
  .order_item {
    width: 100%;
    border: 1px solid #ebeef5;
    .item_header {
      > span {
        width: 80px;
      }
      height: 50px;
      line-height: 50px;
      display: flex;
      flex-wrap: nowrap;
      > div {
        width: 25%;
        .span_title {
          font-weight: bold;
        }
      }
    }
    .item_body {
      overflow-x: auto;
      .item_div {
        display: flex;
        flex-wrap: nowrap;
        ul {
          .item_tiele {
            height: calc(100% - 120px);
          }
          .textAl {
            display: flex;
            align-items: center;
          }
        }
        li {
          width: 180px;
          border-top: 1px solid #ebeef5;
          height: 40px;
          box-sizing: border-box;
          padding: 4px 10px;
          text-align: center;
          border-right: 1px solid #ebeef5;
        }
        .itemValue {
          line-height: 32px;
        }
        .li_detail1 {
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
          height: 100%;
        }
        .li_pro {
          display: flex;
          width: 200px;
          height: 100%;
        }
        .li_detail2 {
          // max-width: 200px;
          display: flex;
          // justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>
