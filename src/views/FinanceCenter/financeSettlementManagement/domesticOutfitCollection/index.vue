<template>
  <div>
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <div class="queryForm">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-input
              @keyup.enter.native="search"
              placeholder="收款账号/付款方/收款账号"
              v-model="formList.names"
              size="medium"
              clearable
              class="orderinp">
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-select @keyup.enter.native="search" v-model="formList.storeId" filterable clearable size="medium">
              <el-option v-for="(item,idx) in filterStoreArr" :key="idx" :label="item.storeName"
                         :value="item.storeId"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-date-picker
              @keyup.enter.native="search"
              v-model="date"
              type="daterange"
              size="medium"
              range-separator="-"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              clearable
              end-placeholder="结束日期">
            </el-date-picker>
          </el-col>
          <el-col :span="6">
            <el-button size="medium" class="button-fc" type="warning" @click="search">查询</el-button>
            <el-button size="medium" type="primary" @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <div class="m-top20">
      <el-card>
        <div>
          <el-button size="small" class="button-96" v-if="btnJurisdiction.receipt" @click="dialog=true;status=0">录入收款
          </el-button>
          <el-button size="small" class="button-96" v-if="btnJurisdiction.delete" @click="deleteAll">删除</el-button>
          <el-button size="small" class="button-96" v-if="btnJurisdiction.create" @click="jumpList">创建结算单</el-button>
        </div>
        <div class="m-top20 unsortable">
          <el-table
            :data="tableData"
            border
            row-key="id"
            :row-class-name="tableRowClassName"
            @row-click="rowClick"
            ref="table"
            @selection-change="selectChange"
            >
            <el-table-column
              align="center"
              fixed="left"
              type="selection">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="receivablesNumber"
              align="center"
              label="收款号"
              fixed="left"
              width="180"
            >
              <template slot-scope="scope">
                <div>
                  <el-tooltip placement="right" visible-arrow>
                    <div slot="content" class="tips tipFon">
                      <p class="operaItems" @click="eidt(scope.row)">编辑</p>
                      <p class="operaItems" @click="deleteRow(scope.row)">删除</p>
                      <p class="operaItems" @click="generateStatement(scope.row)">生成结算单</p>
                    </div>
                    <img :src="spot" alt="" class=" attributesTips">
                  </el-tooltip>
                  <el-button type="text">{{scope.row.receivablesNumber}}</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              width="220"
              align="center"
              prop="paymentName"
              label="付款方">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              width="100"
              align="center"
              prop="receivablesType"
              label="收款方式">
              <template slot-scope="scope">
                {{scope.row.receivablesType==0?"支票":"汇款"}}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              width="180"
              align="center"
              prop="bankCardNumber"
              label="收款账号">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              width="180"
              align="center"
              prop="checkNumber"
              label="支票号">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              width="150"
              align="center"
              prop="receivablesMoney"
              label="收款金额">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              width="180"
              align="center"
              prop="storeName"
              label="所属门店">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              width="180"
              align="center"
              prop="receivablesDate"
              label="收款日期">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              width="180"
              align="center"
              prop="createName"
              label="录入人">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              width="180"
              align="center"
              prop="createTime"
              label="录入日期">
            </el-table-column>
          </el-table>
          <div class="pagination_wrap">
            <pagination
              :current-page="formList.page"
              :pageSize="formList.limit"
              :total="total"
              @sizeChange="sizeChange"
              @currentChange="currentChange">
            </pagination>
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog title="收款录入" :visible.sync="dialog" width="850px" custom-class="customDialogTitle" @close="closeReceipt">
      <el-form ref="forms" :model="receiptEntry" label-width="120px" class="ruleForm" :rules="rules" size="medium">
        <el-row :gutter="10">
          <el-col :span="span">
            <el-form-item label="付款方：" prop="paymentId">
              <el-select filterable v-model="receiptEntry.paymentId" @change="changePayment" clearable>
                <el-option v-for="(item,idx) in paymentArr" :key="idx" :label="item.companyName"
                           :value="item.companyId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="收款门店：" prop="storeId">
              <el-select filterable v-model="receiptEntry.storeId" clearable>
                <el-option v-for="(item,idx) in storeArr" :key="idx" :label="item.storeName"
                           :value="item.storeId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="收款日期：" prop="receivablesDate">
              <div class="head_nav_datapick">
                <el-date-picker
                  size="medium" v-model="receiptEntry.receivablesDate" type="date"
                  value-format='yyyy-M-dd HH:mm:ss'
                  range-separator="-"
                  clearable
                  start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="收款金额：" prop="receivablesMoney">
              <el-input @input="filterNum(receiptEntry.receivablesMoney,1)" v-model="receiptEntry.receivablesMoney"
                        clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="收款方式：" prop="receivablesType">
              <el-select filterable v-model="receiptEntry.receivablesType" @change="changeReceivablesType" clearable>
                <el-option v-for="(item,idx) in payMentWayArr" :key="idx" :label="item.dictName"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="公司收款账号：" v-if="bankShow" prop="bankAccountId">
              <el-select filterable v-model="receiptEntry.bankAccountId" clearable>
                <el-option v-for="(item,idx) in bankArr" :key="idx"
                           :label="item.openingBankName + '|' + item.accountName + '|' + item.bankCardNumber"
                           :value="item.bankAccountId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="span" v-if="checkShow">
            <el-form-item label="支票号：" prop="checkNumber">
              <el-input @input="filterNum(receiptEntry.checkNumber,2)" v-model="receiptEntry.checkNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：">
              <el-input type="textarea" v-model="receiptEntry.remarks" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="messageConfirm">确 定</el-button>
                <el-button @click="dialog = false">取 消</el-button>
            </span>
    </el-dialog>
  </div>
</template>
<script>
  import breadcrumb from "@/views/components/breadcrumb";
  import pagination from "@/views/components/pagination";
  import spot from '@/assets/images/spot.png';
  import {
    listBuildingMaterialsCityByPage,
    addBuildingMaterialsCity,
    listCompanyBankAccountByPage,
    editBuildingMaterialsCity,
    delBuildingMaterialsCity,
    getBuildingMaterialsCity,
    listCompanyByService,
    listStoreByService
  } from '@/api/FinanceCenter/financeSettlementManagement/domesticOutfitCollection/index';
  import {getUUID, listBaseDict, listStore} from "@/api/pulicJava";
  import {formatAmount} from "@/utils/pubilcFn"

  export default {
    components: {
      breadcrumb,
      pagination
    },
    activated(){
       this.btnInit()
      listCompanyByService(
      ).then(res => {
        this.paymentArr = res.data
      })

      listBaseDict({
        dataType: 'collection_method_of_building_materials_city'
      }).then(res => {
        this.payMentWayArr = res.data
      })
      listStore().then(res => {
        this.filterStoreArr = res.data
      })
      this.pages()

      this.navList = this.$route.meta;
    },
    // deactivated () {
    //   this.$destroy(true)
    // },
    // created() {
    //   this.btnInit()
    //   listCompanyByService(
    //   ).then(res => {
    //     this.paymentArr = res.data
    //   })

    //   listBaseDict({
    //     dataType: 'collection_method_of_building_materials_city'
    //   }).then(res => {
    //     this.payMentWayArr = res.data
    //   })
    //   listStore().then(res => {
    //     this.filterStoreArr = res.data
    //   })
    //   this.pages()
    // },
    // mounted() {
    //   this.navList = this.$route.meta;
    // },
    data() {
      return {
        span: 12,
        navList: [],
        paymentArr: [],
        storeArr: [],
        filterStoreArr: [],
        date: [],
        searchtext: '',
        spot: spot,
        total: 10,
        dialog: false,
        spot: spot,
        searchData: "",
        bankShow: false,
        checkShow: false,
        form: {},
        receiptEntry: {
          paymentId: "",
          receivablesDate: "",
          receivablesMoney: "",
          receivablesType: "",
          remarks: "",
          storeId: "",
          bankAccountId: null,
          checkNumber: "",
          receivablesNumber: null,
        },
        formList: {
          page: 1,
          limit: 10,
          names: "",
          storeId: null,
          startTime: null,
          endTime: null
        },
        tableData: [],
        bankArr: [],
        rowsData: [],
        status: 0,
        bmcReceivablesId: "",
        rules: {
          paymentId: [{
            required: true,
            message: '请选择',
            trigger: 'change'
          }],
          receivablesDate: [{
            required: true,
            message: '请选择',
            trigger: 'change'
          }],
          receivablesMoney: [{
            required: true,
            message: '请输入',
            trigger: 'blur'
          }],
          receivablesType: [{
            required: true,
            message: '请选择',
            trigger: 'change'
          }],
          storeId: [{
            required: true,
            message: '请选择',
            trigger: 'change'
          }],
          bankAccountId: [{
            required: true,
            message: '请输入',
            trigger: 'blur'
          }],
          checkNumber: [{
            required: true,
            message: '请输入',
            trigger: 'blur'
          }],
        },
        payMentWayArr: [],
        btnJurisdiction: {
          receipt: false,
          delete: false,
          create: false
        }
      }
    },
    methods: {
      rowClick(row){
        this.$refs.table.toggleRowSelection(row)
      },
      btnInit() {
        this.btnJurisdiction.receipt = JSON.parse(this.$loca.getItem('element'))["domesticOutfitCollection:btn_receipt"];
        this.btnJurisdiction.delete = JSON.parse(this.$loca.getItem('element'))["domesticOutfitCollection:btn_delete"];
        this.btnJurisdiction.create = JSON.parse(this.$loca.getItem('element'))["domesticOutfitCollection:btn_create"];
      },
      search() {
        this.formList.page = 1;
        this.pages()
      },
      filterNum(val, idx) {
        if (idx == 1) {
          this.receiptEntry.receivablesMoney = val.replace(/[^\d]/g, '');
        } else if (idx == 2) {
          this.receiptEntry.checkNumber = val.replace(/[^\d]/g, '');
        }

      },
      reset() {
        this.formList.names = "";
        this.formList.storeId = null;
        this.formList.page = 1;
        this.date = [];
        this.formList.startTime = null;
        this.formList.endTime = null;
        this.pages();
      },
      closeReceipt() {
        for (var i in this.receiptEntry) {
          this.receiptEntry[i] = "";
        }
        this.checkShow = false;
        this.bankShow = false;
        // this.$refs.forms.resetField
      },
      selectChange(val) {
        this.rowsData = val;
      },
      deleteRow(val) {
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delBuildingMaterialsCity(
            {
              bmcReceivablesIds: [val.bmcReceivablesId]
            }
          ).then(res => {
            this.pages()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      deleteAll() {
        if (this.rowsData.length) {
          let arr = []
          this.rowsData.map((item, idx) => {
            arr.push(item.bmcReceivablesId)
          })
          delBuildingMaterialsCity(
            {
              bmcReceivablesIds: arr
            }
          ).then(res => {
            this.pages()
          })
        } else {
          this.$message({
            message: '请选择后在进行操作',
            type: 'warning'
          });
        }
      },
      eidt(val) {
        this.bmcReceivablesId = val.bmcReceivablesId
        getBuildingMaterialsCity(
          {
            bmcReceivablesId: this.bmcReceivablesId
          }
        ).then(res => {
          listStoreByService({
            companyId: res.data.paymentId
          }).then(resion => {
            this.storeArr = resion.data;

            listCompanyBankAccountByPage().then(val => {
              this.bankArr = val.data;
              for (var i in this.receiptEntry) {
                this.receiptEntry[i] = res.data[i];
              }
              this.dialog = true;
            })

          })
          if (res.data.checkNumber) {
            this.checkShow = true;
            this.bankShow = false;
          } else if (res.data.bankCardNumber != null || res.data.bankCardNumber != "") {
            this.bankShow = true;
            this.checkShow = false;
          }
          this.status = 1;

        })
      },
      messageConfirm() {
        this.$refs["forms"].validate((valid) => {
          if (valid) {
            this.receiptEntry.receivablesMoney = this.receiptEntry.receivablesMoney - 0;
            if (this.status) {
              let obj = {}
              for (let i in this.receiptEntry) {
                obj[i] = this.receiptEntry[i]
              }
              obj.bmcReceivablesId = this.bmcReceivablesId;
              editBuildingMaterialsCity(
                obj
              ).then(res => {
                this.pages()
                this.dialog = false;
              })
            } else {
              getUUID({
                serialNumber: 'SA'
              }).then(resion => {
                this.receiptEntry.receivablesNumber = resion.data;
                addBuildingMaterialsCity(this.receiptEntry).then(res => {
                  this.pages()
                  this.dialog = false;
                  this.receiptEntry.receivablesNumber = null;
                })
              })

            }
          } else {
            return false;
          }
        });

      },
      changePayment(val) {
        listStoreByService({
          companyId: val
        }).then(res => {
          this.storeArr = res.data;
        })
        if (val) {
          if (this.receiptEntry.receivablesType == 1075) {
            listCompanyBankAccountByPage().then(res => {
              this.bankArr = res.data;
            })
            this.bankShow = true;
            this.checkShow = false;
            this.receiptEntry.bankAccountId = null;
          } else {
            this.bankShow = false;
          }
        } else {
          this.bankShow = false;
          this.receiptEntry.bankAccountId = null;
        }
      },
      changeReceivablesType(val) {
        if (val == 1075) {
          if (this.receiptEntry.paymentId) {
            listCompanyBankAccountByPage().then(res => {
              this.bankArr = res.data;
            })
            this.bankShow = true;
            this.checkShow = false;
            this.receiptEntry.bankAccountId = null;
          } else {
            this.$message({
              message: '必须选择付款方才可出现银行信息',
              type: 'warning'
            });
            this.bankShow = false;
            this.checkShow = false;
            this.receiptEntry.bankAccountId = null;
          }
        } else if (val == 1074) {
          this.bankShow = false;
          this.checkShow = true;
          this.receiptEntry.bankAccountId = null;
        } else {
          this.bankShow = false;
          this.checkShow = false;
        }
      },
      pages() {
        this.formList.startTime = this.date[0];
        this.formList.endTime = this.date[1];
        listBuildingMaterialsCityByPage(this.formList).then(res => {
          res.data.rows.map((item, idx) => {
            item.receivablesMoney = formatAmount(item.receivablesMoney)
          })
          this.tableData = res.data.rows;
          this.total = res.data.total;
        })
      },
      jumpList() {
        if (this.rowsData.length == 1) {
          this.$router.push({
            path: 'finalStatement',
            query: {
              bmcReceivablesId: this.rowsData[0].bmcReceivablesId
            }
          })
        } else if (this.rowsData.length > 1) {
          this.$message({
            message: '请选择一条',
            type: 'warning'
          });
        } else {
          this.$message({
            message: '请选择后再生成结算单',
            type: 'warning'
          });
        }
      },
      generateStatement(val) {
        this.$router.push({
          path: 'finalStatement',
          query: {
            bmcReceivablesId: val.bmcReceivablesId
          }
        })
      },
      tableRowClassName({row, rowIndex}) {//表格斑马线设置
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      currentChange(val) {
        this.formList.page = val;
        this.pages()
      },
      sizeChange(val) {
        this.formList.page = 1;
        this.formList.limit = val;
        this.pages()
      },
    },
  }
</script>
<style scoped>
  .clearfloat:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0
  }

  .clearfloat {
    zoom: 1
  }

  .querybox > div {
    width: calc(100% - 70px);
    float: left;
    display: flex;
    justify-content: space-between;
  }
</style>
