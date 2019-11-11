<template>
  <div>
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <div class="queryForm">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-input clearable size="medium" @keyup.enter.native="search" placeholder="合作商" v-model="formList.companyName"></el-input>
          </el-col>
          <el-col :span="6">
            <el-input clearable size="medium" @keyup.enter.native="search" placeholder="创建人" v-model="formList.createAtName"></el-input>
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
          <el-button class="button-96" size="small" v-if="btnJurisdiction.create" @click="createBatch">创建结算明细
          </el-button>
          <el-button class="button-96" size="small" v-if="btnJurisdiction.delete" @click="deleteBillingDetails">删除结算明细
          </el-button>
        </div>
        <div class="m-top20 unsortable">
          <el-table
            :data="tableData"
            border
            row-key="id"
            :row-class-name="tableRowClassName"
            @selection-change="selectRows"
            @row-click="rowClick"
            ref="table"
            >
            <el-table-column
              align="center"
              fixed="left"
              type="selection"
              width="50">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="status"
              align="center"
              fixed="left"
              label="状态"
            >
              <template slot-scope="scope">
                <div>
                  <el-tooltip placement="right" visible-arrow v-if="btnJurisdiction.edit||btnJurisdiction.delete">
                    <div slot="content" class="tips tipFon">
                      <p class="operaItems" v-if="btnJurisdiction.edit" @click="goToUrl(scope.row)">编辑</p>
                      <p class="operaItems" v-if="btnJurisdiction.delete" @click="deleteRow(scope.row)">删除</p>
                    </div>
                    <img :src="spot" alt="" class=" attributesTips">
                  </el-tooltip>
                  <span>{{scope.row.status==0?"未导入结算明细":"导入完成"}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="companyName"
              label="合作商">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="amountCollected"
              label="收款金额">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="refundAmount"
              label="返款金额">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="actualSettlementAmount"
              label="实际结算金额">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="createAtName"
              label="创建人">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="createTime"
              label="创建时间">
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
  </div>
</template>
<script>
  import breadcrumb from "@/views/components/breadcrumb";
  import pagination from "@/views/components/pagination";
  import spot from '@/assets/images/spot.png';
  import {
    listBmcBatchVOByPage,
    deleteBmcBatch
  } from '@/api/FinanceCenter/financeSettlementManagement/homeBillingDetails/index'

  export default {
    components: {
      breadcrumb,
      pagination
    },
    activated(){
      this.btnInit()
      this.navList = this.$route.meta;
      this.pages();
    },
    // deactivated () {
    //   this.$destroy(true)
    // },
    // mounted() {
    //   this.btnInit()
    //   this.navList = this.$route.meta;
    //   this.pages();
    // },
    data() {
      return {
        navList: [],
        spot: spot,
        total: 10,
        formList: {
          createAtName: '',
          companyName: '',
          page: 1,
          limit: 10
        },
        tableData: [],
        rowsData: [],
        btnJurisdiction: {
          create: false,
          delete: false,
          edit: false
        }
      }
    },
    methods: {
      rowClick(row){
        this.$refs.table.toggleRowSelection(row)
      },
      btnInit() {
        this.btnJurisdiction.create = JSON.parse(this.$loca.getItem('element'))["homeBillingDetails:btn_create"];
        this.btnJurisdiction.delete = JSON.parse(this.$loca.getItem('element'))["homeBillingDetails:btn_delete"];
        this.btnJurisdiction.edit = JSON.parse(this.$loca.getItem('element'))["homeBillingDetails:btn_edit"];

      },
      search() {
        this.formList.page = 1;
        this.pages()
      },
      reset() {
        this.formList.createAtName = '';
        this.formList.companyName = '';
        this.formList.page = 1;
        this.pages()
      },
      pages() {
        listBmcBatchVOByPage(
          this.formList
        ).then(res => {
          this.tableData = res.data.rows;
          this.total = res.data.total;
        })
      },
      deleteRow(val) {
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteBmcBatch(
            {
              bmcBatchIds: val.bmcBatchId
            }
          ).then(res => {
            this.pages()
            this.$message({
              type: 'success',
              message: '删除成功'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteBillingDetails() {
        if (this.rowsData.length > 0) {
          this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let arr = [];
            this.rowsData.map((item, idx) => {
              arr.push(item.bmcBatchId)
            })
            deleteBmcBatch(
              {
                bmcBatchIds: arr.join(",")
              }
            ).then(res => {
              this.pages()
              this.$message({
                type: 'success',
                message: '删除成功'
              });
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });

        } else {
          this.$message({
            message: '请选择后再进行操作',
            type: 'warning'
          });
        }
      },
      createBatch() {
        this.$router.push({
          path: 'billingDetails',
        })
      },
      goToUrl(val) {
        this.$router.push({
          path: 'billingDetails',
          query: {
            bmcBatchId: val.bmcBatchId,
            edit: true
          }
        })
      },
      selectRows(val) {
        this.rowsData = val;
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
    }
  }
</script>
