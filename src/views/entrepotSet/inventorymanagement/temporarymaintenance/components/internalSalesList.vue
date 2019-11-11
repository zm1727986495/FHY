<template>
  <div class="internalSalesList" v-loading="loading">
    <!-- 查询 -->
    <div class="btn-list m-bottom15">
      <div v-for="(item,index) in btnList" :key="index">
        <el-button size="small" class="button-96" v-if="btnJurisdiction[item.jurisdiction]"
        @click="butGroupAction(item.type)">{{item.name}}</el-button>
      </div>
    </div>
    <div class="table_list lvs attribute">
      <el-table border :row-class-name="tableRowClassName" :max-height="maxHeight" :data="tableData" @selection-change="handleSelectionChange" ref="multipleTable">
        <el-table-column align="center" type="selection" fixed width="50"></el-table-column>
        <el-table-column align="center" prop="maintainStatus" label="状态" width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <p v-if="scope.row.maintainStatus==2">驳回</p>
            <p v-if="scope.row.maintainStatus==3">通过</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="maintainSource" label="来源" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="oddNumbers" label="订单号" width="130" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="purchaseNumber" label="采购合同号" width="130" show-overflow-tooltip></el-table-column>
<!--        <el-table-column align="center" prop="templateName" label="类型" width="120" show-overflow-tooltip></el-table-column>-->
        <el-table-column align="center" prop="storageName" label="所属仓库" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="regionName" label="货区" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="siteCode" label="货位" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="handling" label="处理方式" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <p v-if='scope.row.handling==1'>新增</p>
            <p v-if='scope.row.handling==2'>转可用</p>
            <p v-if='scope.row.handling==3'>报废</p>
            <p v-if='scope.row.handling==4'>内部销售</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination_wrap">
      <pagination :current-page="currentPage" :pageSize="pageSize" :total="total" @sizeChange="sizeChange" @currentChange="currentChange"></pagination>
    </div>
    <el-dialog title="审批" :visible.sync="approveDialog" width="400px" custom-class="customDialogTitle" append-to-body :close-on-click-modal="closeOnClickModal">
      <div class="dialogBody pl-20">
        <el-radio-group v-model="approveStatus">
          <el-radio :label="item.code" :key="item.code" v-for="item in approveList">{{ item.value }}</el-radio>
        </el-radio-group>
      </div>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="approveSubmit">提交</el-button>
        <el-button @click="approveDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="出库详情" :visible.sync="dialogVisible" width="60%" custom-class="customDialogTitle" append-to-body :close-on-click-modal="closeOnClickModal">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" :size="size" class="clearfix">
        <el-col :span="span">
          <el-form-item label="商品名称：">
            {{ selectedInfo.commodityName }}
          </el-form-item>
        </el-col>
        <el-col :span="span">
          <el-form-item label="采购单号：">
            {{ selectedInfo.purchaseNumber }}
          </el-form-item>
        </el-col>
        <el-col :span="span">
          <el-form-item label="商品型号：">
            {{ selectedInfo.commodityModel }}
          </el-form-item>
        </el-col>
        <el-col :span="span">
          <el-form-item label="商品品类：">
            {{ selectedInfo.categoryName }}
          </el-form-item>
        </el-col>
        <el-col :span="span">
          <el-form-item label="商品材质：">
            {{ selectedInfo.materialName }}
          </el-form-item>
        </el-col>
        <el-col :span="span">
          <el-form-item label="商品颜色：">
            {{ selectedInfo.colourName }}
          </el-form-item>
        </el-col>
        <!-- <el-col :span="span">
          <el-form-item label="数量：">1</el-form-item>
        </el-col> -->
        <el-col :span="span">
          <el-form-item label="售价：" prop="internalPrice">
            <el-input v-model="ruleForm.internalPrice" clearable placeholder="请输入售价"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="span">
          <el-form-item label="收据号：" prop="receiptCode">
            <el-input v-model="ruleForm.receiptCode" clearable placeholder="请输入收据号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上传照片">
            <el-upload
              list-type="picture-card"
              class="upload-demo"
              action="string"
              :accept="accept"
              :http-request="uploadPic"
              :file-list="fileList"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-form>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="warehouseOutSubmit('ruleForm')">确认出库</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--图片预览-->
    <el-dialog :visible.sync="processPicture.dialogVisible" class="box">
      <img width="100%" :src="processPicture.dialogImageUrl">
    </el-dialog>
  </div>
</template>
<script>
  import { put } from "@/utils/pubilcFn";
  import pagination from "@/views/components/pagination";
  import { mapGetters } from "vuex";
  import { maintenanceGoodsSalesByPage, auditInternalSalesApply, outboundMaintainGoods } from "api/entrepotSet/inventorymanagement/temporarymaintenance/index";
  export default {
    components: {
      pagination
    },
    props: ['params', 'isReset'],
    created() {
      this.getData();
    },
    data() {
      return {
        size: 'medium',
        span: 8,
        closeOnClickModal: false, // 是否点击遮罩层关闭弹窗
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        btnList: [
          {name: "审批",type: 1, jurisdiction: "temporarymain_approval"},
          {name: '出库',type: 2, jurisdiction: "temporarymain_retrieval"}
        ],
        btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
        loading: false,
        selection: [], // 列表选中数据
        selectedInfo: {},
        approveList: [ // 审批状态列表
          { code: 2, value: '审批通过' },
          { code: 3, value: '驳回' }
        ],
        approveDialog: false, // 审批弹框
        approveStatus: '', // 审批状态
        dialogVisible: false, // 出库详情弹窗
        activityPrice: '', // 售价
        receiptNumber: '', // 收据号
        accept: '',
        fileList: [],
        picList: [],
        processPicture: { // 预览图片
          dialogVisible: false,
          dialogImageUrl: ''
        },
        ruleForm: {
          internalPrice: '',
          receiptCode: ''
        },
        rules: {
          internalPrice: [
            { required: true, message: '请输入售价', trigger: 'blur' }
          ],
          receiptCode: [
            { required: true, message: '请输入收据号', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      sizeChange(val) {
        this.$emit('resetPage');
        this.currentPage = 1;
        this.pageSize = val;
        this.getData();
      },
      currentChange(val) {
        this.$emit('resetPage');
        this.currentPage = val;
        this.getData();
      },
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? "el-f0" : "";
      },
      // 获取内部销售列表
      getData() {
        this.loading = true;
        let data = {
          page: this.currentPage,
          limit: this.pageSize,
          ...this.params
        };
        maintenanceGoodsSalesByPage(data)
          .then(res => {
            this.loading = false;
            this.tableData = res.data.rows;
            this.total = res.data.total;
          })
          .catch(error => {
            this.loading = false;
            console.log('views/entrepotSet/inventorymanagement/temporarymaintenance/components/internalSalesList.vue-getData:' + error)
          });
      },
      // 点击按钮组
      butGroupAction(type) {
        // 0 导出 1 审批 2 出库
        if (type == 0) {

        } else if (type == 1) {
          if (this.selection.length) {
            this.approveStatus = '';
            this.approveDialog = true;
          } else {
            this.$message.error('请先选择');
          }
        } else {
          if (this.selection.length) {
            if (this.selection[0].maintainStatus == 3) {
              this.$confirm('确定出库?', '提示', {
                type: 'warning'
              }).then(() => {
                this.dialogVisible = true;
              }).catch(() => {});
            } else {
              this.$message.error('未通过审核，不能出库');
            }
          } else {
            this.$message.warning('请先选择');
          }
        }
      },
      // 表格选择数据
      handleSelectionChange(val) {
        this.selection = val;
        if (this.selection.length > 1) {
          this.$refs.multipleTable.toggleRowSelection(this.selection[0]);
        }
        this.selectedInfo = this.selection[0];
      },
      // 审批
      approveSubmit() {
        if (this.approveSubmit == '') {
          this.$message.warning('请选择操作');
        } else {
          let params = {
            internalSalesApplyId: this.selection[0].internalSalesApplyId,
            maintainGoodsId: this.selection[0].maintainGoodsId,
            status: this.approveStatus
          };
          auditInternalSalesApply(params)
            .then(response => {
              if (response.status == 200) {
                this.$message.success('操作成功');
                this.approveDialog = false;
                this.getData();
              } else {
                this.$message.error(response.message || '操作失败');
              }
            })
            .catch(error => {
              console.log('views/entrepotSet/inventorymanagement/temporarymaintenance/components/internalSalesList.vue-approveSubmit:' + error)
            });
        }
      },
      // 上传图片
      uploadPic(res) {
        put(res)
          .then(response => {
            this.picList.push(response);
          })
      },
      // 刪除图片
      handleRemove(file) {
        let length = String(file.raw.uid).length;
        this.picList = this.picList.filter(item => {
          let str = item.name.substring(0, length);
          return str !== String(file.raw.uid);
        });
      },
      // 出库
      warehouseOutSubmit(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let params = {
              skuGoodsId: this.selection[0].skuGoodsId || '',
              internalPrice: Number(this.ruleForm.internalPrice),
              receiptCode: this.ruleForm.receiptCode,
              inventoryGoodsId: this.selection[0].inventoryGoodsId || '',
              internalSalesApplyId: this.selection[0].internalSalesApplyId,
              fileUrlList: this.getFileUrlList
            };
            outboundMaintainGoods(params)
              .then(response => {
                if (response.status == 200) {
                  this.$message.success('操作成功');
                  this.dialogVisible = false;
                  this.getData();
                } else {
                  this.$message.error(response.message || '操作失败');
                }
              })
              .catch(error => {
                console.log('views/entrepotSet/inventorymanagement/temporarymaintenance/components/internalSalesList.vue-warehouseOutSubmit:' + error)
              });
          } else {
            return false;
          }
        });
      }
    },
    watch: {
      isReset(newVal, oldVal) {
        if (newVal) {
          this.currentPage = 1;
        }
      }
    },
    computed: {
      ...mapGetters(["maxHeight"]),
      // 获取图片列表
      getFileUrlList() {
        let arr = [];
        if (this.picList.length) {
          this.picList.forEach(item => {
            arr.push(item.url);
          })
        }
        return arr;
      }
    }
  };
</script>
<style lang="scss" scoped>
.internalSalesList{
    .btn-list{
      display: flex;
      button{
        margin: 0 5px;
      }
    }
}
</style>