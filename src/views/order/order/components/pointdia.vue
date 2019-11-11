<template>
  <div class="price_pop">

    <el-dialog title="指 派" custom-class="customDialogTitle" :visible.sync="visible" :close-on-press-escape="false"
               :close-on-click-modal="false" :show-close="false" top="5vh">
      <div class="applyfrom">
        <el-form
          ref="ruleForm"
          :label-position="labelPosition"
          label-width="120px"
          :model="point"
          class="queryForm">
          <el-form-item label="指派对象" class="input_100">
            <el-checkbox-group v-model="point.obj" size="medium" ref="objradio">
              <el-checkbox
                v-for="item in objList" :key="item.value"
                :label="item.value">
                {{item.label}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 门店对应的销售员 -->
          <el-form-item label="门店销售员" prop="order" class="seleinput input_100" v-if="point.obj.indexOf('1') != -1">
            <el-select v-model="point.salesmanId" placeholder="请选择" size="medium" style="width: 38%">
              <el-option v-for="item in saleList" :key="item.id" :label="item.username" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <!-- 销售员 -->
          <!-- <el-form-item label = "销售员" prop="order" class="seleinput input_100" v-if="point.obj.indexOf('1') != -1">
              <el-select v-model="point.salesmanId" placeholder="请选择" size="medium" style="width: 38%">
                  <el-option v-for="item in saleList" :key="item.designerId" :label="item.designerName" :value="item.designerId"> </el-option>
              </el-select>
          </el-form-item> -->
          <el-form-item
            label="备注"
            class="addressclas input_100"
            prop="salesmanRemark" v-if="point.obj.indexOf('1') != -1">
            <el-input type="textarea" v-model="point.salesmanRemark"></el-input>
          </el-form-item>

          <!-- 门店 -->
          <!-- <el-form-item label = "门店"  prop="order" class="seleinput input_100" v-if="point.obj.indexOf('4') != -1">
                            <el-select v-model="point.storeId" placeholder="请选择" size="medium" style="width: 38%" @change="storeChange">
                                <el-option v-for="item in storeList" :key="item.storeId" :label="item.storeName" :value="item.storeId"> </el-option>
                            </el-select>
                        </el-form-item> -->

          <!-- <el-form-item
              label="备注"
              class="addressclas input_100"
              prop="storeRemark"  v-if="point.obj.indexOf('4') != -1">
              <el-input type="textarea" v-model="point.storeRemark"></el-input>
          </el-form-item> -->
          <!-- 门店对应的业务员 -->
          <el-form-item label="业务员" prop="order" class="seleinput input_100" v-if="point.obj.indexOf('2') != -1">
            <el-select v-model="point.businessId" placeholder="请选择" size="medium" style="width: 38%">
              <el-option v-for="item in accountList" :key="item.id" :label="item.username" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <!-- 业务员 -->
          <!-- <el-form-item  label = "业务员"  prop="order" class="seleinput input_100" v-if="point.obj.indexOf('2') != -1 && !storeView">
              <el-select v-model="point.businessId" placeholder="请选择" size="medium" style="width: 38%">
                  <el-option v-for="item in accountList" :key="item.designerId" :label="item.designerName" :value="item.designerId"> </el-option>
              </el-select>
          </el-form-item> -->

          <el-form-item
            label="备注"
            class="addressclas input_100"
            prop="businessRemark" v-if="point.obj.indexOf('2')  != -1 ">
            <el-input type="textarea" v-model="point.businessRemark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitBtn" :loading="loadingBtn">确 定</el-button>
        <el-button @click="colseBtn" :loading="loadingBtn">取 消</el-button>
      </div>
      <!-- tab页 -->
      <el-tabs @tab-click="tabclickH" type="border-card" v-model="activeName">
        <el-tab-pane
          v-for="item in objList" :key="item.value"
          :label="item.label" :name="item.value">
          <div class="table_list lvs attribute m-top20">
            <el-table
              border
              :row-class-name="tableRowClassName"
              :data="tabList"
              max-height="150">
              <el-table-column prop="name" align="center" label="历史负责人" sortable></el-table-column>
              <el-table-column prop="createName" align="center" label="变更人" sortable></el-table-column>
              <el-table-column prop="createTime" align="center" label="变更时间" sortable></el-table-column>
              <el-table-column prop="remark" align="center" label="备注" sortable></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- 分页 -->
      <div class="pagination_wrap">
        <pagination
          :current-page="currentPage"
          :pageSize="pageSize"
          :total="total"
          @sizeChange="sizeChange"
          @currentChange="currentChange">
        </pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {
    orderChangeList,
    getDesignerList,
    listStore,
    appointedAgency,
    listSalesmanPost, // 获取门店下和大区下的销售员和业务员
  } from '@/api/order/order/order';
  import pagination from "@/views/components/pagination";
  export default {
    props: ["tableSelect", "storeId"],
    components: {
      pagination
    },
    data() {
      return {
        loadingBtn: false,
        storeView: false, // 门店对应的销售员 业务员
        organizationId: '',
        tabList: [], // 表格数据
        obj: '销售员', // 指派对象的选择
        point: {
          obj: ["1"],
          salesmanId: '', // 销售员
          businessId: '', // 业务员
          storeId: '',
          salesmanRemark: '',
          businessRemark: '',
          storeRemark: '',
        }, // 折扣特批的申请详情信息
        labelPosition: "right",
        formLabelWidth: '120px',
        activeName: "1", // tab页的active页
        // 条件
        objList: [{
          label: "销售员", value: "1"
        }, {
          label: "业务员", value: "2"
        },
          // {
          //     label: "门店",value: "4"
          // },
        ], // 指派对象条件
        saleList: [], // 销售员，业务员条件
        accountList: [], // 业务员条件
        storeList: [], // 门店条件
        // 控制弹出框是否显示 -- 始终显示
        visible: true,
        status: 1,
        // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0,
      }
    },
    created() {
      // 表格数据
      let data = {
        orderId: this.tableSelect.orderId,   //  订单Id
        userType: Number(this.activeName), // 人员类型
        page: this.currentPage,  // 当前页
        limit: this.pageSize,  // 分页数量
      };
      this.currentPage = 1;
      this.getList(data);

      // 获取本门店下所有的设计员、销售员
      // 下拉框数据 -- 销售员
      // let seledata = {
      //     "dataCode": "G070", // 数据编码
      //     storeId: this.storeId,
      // };
      // this.getSalesmanList(seledata);
      // // 下拉框数据 -- 业务员
      // seledata = {
      // 	"dataCode": "G320", // 数据编码
      //     storeId: this.storeId,
      // };
      // this.getAccountList(seledata);
      // 门店
      this.getStore();


    },
    watch: {
      // 监听point对象
      'point.obj'(val) {
        if (val == "") {
          return false;
        }

        if (val.indexOf('1') == -1) { // 没有销售员
          this.point.salesmanId = ''; // 销售员Id
          this.point.salesmanRemark = ''; // 指派销售备注

        }
        if (val.indexOf('2') == -1) { // 没有业务员
          this.point.businessId = '';   // 业务员Id
          this.point.businessRemark = ''; // 指派业务备注
        }
        // if(val.indexOf('4') == -1){ // 没有门店
        //     console.log(val,"没有门店");
        // 	this.point.storeId = '';  //  门店Id
        //     this.point.storeRemark = '';  // 指派门店备注
        //     this.point.salesmanId = '';
        //     this.point.salesmanRemark = ''; // 指派销售备注
        //     this.point.businessId = '';
        //     this.point.businessRemark = ''; // 指派业务备注

        //      // 获取本门店下所有的设计员、销售员
        //     // 下拉框数据 -- 销售员
        //     let seledata = {
        //         "dataCode": "G070", // 数据编码
        //         storeId: this.storeId,
        //     };
        //     this.getSalesmanList(seledata);
        //     // // 下拉框数据 -- 业务员
        //     seledata = {
        //         "dataCode": "G320", // 数据编码
        //         storeId: this.storeId,
        //     };
        //     this.getAccountList(seledata);
        //     this.storeView = false;
        // }
      },

      // 'point.storeId'(val) {
      //     if(val && this.point.obj.indexOf('4') != -1) { // 选择的门店有值并且勾选了门店选项
      //         this.point.businessId = '';   // 业务员Id
      //         this.point.salesmanId = ''; // 销售员Id

      //         // 获取本门店下所有的设计员、销售员
      //         // 下拉框数据 -- 销售员
      //         let saledata = {
      //             // "dataCode": "G070", // 数据编码
      //             storeId: val,       // 门店id
      //         };
      //         this.listSalesmanPost(seledata,'sale');
      //         // this.getSalesmanList(seledata);
      //         // 下拉框数据 -- 业务员
      //         let businessdata = {
      //             // "dataCode": "G320", // 数据编码
      //             storeId: val,       // 门店id
      //         };
      //         this.listSalesmanPost(businessdata,'business');
      //     }
      // }
    },
    methods: {
      storeChange(val) {
        if (val && this.point.obj.indexOf('4') != -1) { // 选择的门店有值并且勾选了门店选项
          this.point.businessId = '';   // 业务员Id
          this.point.salesmanId = ''; // 销售员Id

          this.storeList.forEach(item => {
            if (item.storeId == val) {
              this.organizationId = item.organizationId;
            }
          })

          // 获取本门店下所有的设计员、销售员
          // 下拉框数据 -- 销售员
          let saledata = {
            // "dataCode": "G070", // 数据编码
            organizationId: this.organizationId,
            storeId: val,       // 门店id
          };
          this.listSalesmanPost(saledata, 'sale');
          // this.getSalesmanList(seledata);
          // 下拉框数据 -- 业务员
          let businessdata = {
            // "dataCode": "G320", // 数据编码
            organizationId: this.organizationId,
            storeId: val,       // 门店id
          };
          this.listSalesmanPost(businessdata, 'business');
          this.storeView = true;

        } else {
          this.storeView = false;
        }
      },
      searchdatas() {
        return {
          orderId: this.tableSelect.orderId,   //  订单Id
          userType: this.status, //人员类型
          page: this.currentPage,  // 当前页
          limit: this.pageSize,  //分页数量
        };
      },
      // tab页选择
      tabclickH(e) {
        this.currentPage = 1;


        if (e.name == 1) { // 销售员

          this.status = 1;
          this.currentPage = 1;
          let data = this.searchdatas();
          this.getList(data);
        } else if (e.name == 2) { // 业务员

          this.status = 2;
          this.currentPage = 1;
          let data = this.searchdatas();
          this.getList(data);
        } else if (e.name == 4) {  // 门店

          this.status = 4;
          this.currentPage = 1;
          let data = this.searchdatas();
          this.getList(data);
        }
      },
      colseBtn() {
        this.$emit("close-dialog");
      },
      submitBtn() {
        if (this.point.obj && this.point.obj.length == 0) {
          this.$message.warning("请选择指派对象");
          return;
        }

        if (this.point.obj.indexOf('1') != -1) {// 有销售员
          if (!this.point.salesmanId) {
            this.$message({
              message: '请选择销售员',
              type: 'warning'
            });
            return;
          }
        } else if (this.point.obj.indexOf('2') != -1) {// 有业务员
          if (!this.point.businessId) {
            this.$message({
              message: '请选择业务员',
              type: 'warning'
            });
            return;
          }
        }
        // else if(this.point.obj.indexOf('4') != -1) {// 有门店
        //     if(!this.point.storeId) {
        //         this.$message({
        //             message: '请选择门店',
        //             type: 'warning'
        //         });
        //         return;
        //     }
        // }
        this.loadingBtn = true;
        let data = {
          orderId: this.tableSelect.orderId,   //  订单Id
          storeId: this.point.storeId ? this.point.storeId : this.tableSelect.storeId,   //  门店Id
          salesmanId: this.point.salesmanId ? this.point.salesmanId : this.tableSelect.salesmanId,   // 销售员Id(可传可不传)
          businessId: this.point.businessId ? this.point.businessId : this.tableSelect.businessId,   // 业务员Id(可传可不传)
          storeRemark: this.point.storeRemark,   // 指派门店备注
          salesmanRemark: this.point.salesmanRemark, // 指派销售备注
          businessRemark: this.point.businessRemark, // 指派业务备注
        };
        appointedAgency(data).then(res => {
          if (res.status == 200) {
            this.$message({
              message: '指派成功',
              type: 'warning'
            });
          }
          this.loadingBtn = false;
        }).catch(error => {
          this.loadingBtn = false;
          console.log('订单管理:订单列表 order/components/pointdia.vue', error);
        })
        this.$emit("close-dialog");
      },
      //表格斑马线设置
      tableRowClassName({row, rowIndex}) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },

      currentChange(val) {
        this.currentPage = val;
        let data = {
          orderId: this.tableSelect.orderId,   //  订单Id
          userType: this.status, // 人员类型
          page: this.currentPage,  // 当前页
          limit: this.pageSize,  // 分页数量
        };
        this.getList(data)
      },
      sizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        let data = {
          orderId: this.tableSelect.orderId,   //  订单Id
          userType: this.status, // 人员类型
          page: this.currentPage,  // 当前页
          limit: this.pageSize,  // 分页数量
        };
        this.getList(data)
      },

      // 加载表格
      getList(data) {
        orderChangeList(data).then(res => {
          if (res.status == 200) {
            this.total = res.data.total;
            this.tabList = res.data.rows;
          }
        }).catch(error => {
          console.log('订单管理:订单列表 order/components/pointdia.vue', error);
        })
      },

      // 获取本门店下所有的销售员
      getSalesmanList(data) {
        getDesignerList(data).then(res => {
          if (res.status == 200) {
            this.saleList = res.data.rows;
          }
        }).catch(error => {
          console.log('订单管理:订单列表 order/components/pointdia.vue', error);
        })
      },
      // 获取本门店下所有的业务员
      getAccountList(data) {
        getDesignerList(data).then(res => {
          if (res.status == 200) {
            this.accountList = res.data.rows;
          }
        }).catch(error => {
          console.log('订单管理:订单列表 order/components/pointdia.vue', error);
        })
      },
      // 获取门店下和大区下的销售员和业务员
      listSalesmanPost(data, type) {
        listSalesmanPost(data).then(res => {
          if (res.status == 200) {
            if (type == 'business') { // 业务员
              this.accountList = res.data;
            } else if (type == 'sale') { // 销售员
              this.saleList = res.data;
            }
          }
        }).catch(error => {
          console.log('订单管理:订单列表 order/components/pointdia.vue', error);
        })
      },

      // 获取门店
      getStore() {
        listStore().then(res => {
          if (res.status == 200) {
            this.storeList = res.data;

            this.storeList.forEach(item => {
              if (item.storeId == this.tableSelect.storeId) {
                this.organizationId = item.organizationId;
              }
            })

            // 获取本门店下所有的设计员、销售员
            // 下拉框数据 -- 销售员
            let saledata = {
              organizationId: this.organizationId,
              storeId: this.tableSelect.storeId,       // 门店id
            };
            this.listSalesmanPost(saledata, 'sale');
            // this.getSalesmanList(seledata);
            // 下拉框数据 -- 业务员
            let businessdata = {
              organizationId: this.organizationId,
              storeId: this.tableSelect.storeId,       // 门店id
            };
            this.listSalesmanPost(businessdata, 'business');
          }
        }).catch(error => {
          console.log('订单管理:获取门店 order/components/pointdia.vue', error);
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .input_width {
    width: 60%;
  }

  .applyfrom {
    padding: 10px 70px;

    .el-form-item__label {
      font-weight: 400;
    }

    .demo-form-inline {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .seleinput .el-input {
        width: 40%;
      }

      .addressclas {
        width: 40%;
      }
    }

    .input_100 {
      width: 100% !important;
    }
  }
</style>
