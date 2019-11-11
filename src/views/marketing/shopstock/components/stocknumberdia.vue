<template>
  <!-- 门店库存弹出框 -->
  <div class="noticedia">
    <el-dialog
      title="仓库暂存数量展示"
      :visible.sync="visible"
      width="800px"
      :before-close="handleClose"
      custom-class="customDialogTitle"
      :close-on-click-modal="false"
    >
      <div class="m-bottom15" v-if="isbutton">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" size="medium" class="ruleForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="预计到货时间" prop="arrivalTime">
                <el-date-picker v-model="ruleForm.arrivalTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="组织机构" prop="serveGroupId">
                <el-select v-model="ruleForm.serveGroupId">
                  <el-option v-for="item in serveGroupList" :key="item.serveGroupId" :value="item.serveGroupId" :label="item.serveGroupName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="table_list" v-loading="loading">
        <el-table border :row-class-name="tableRowClassName" :data="tableData" max-height="350">
          <el-table-column prop="commodityName" label="商品名称" sortable align="center"></el-table-column>
          <!--          <el-table-column prop="applySn" label="类型" sortable align="center"></el-table-column>-->
          <el-table-column prop="storageName" label="所属仓库" sortable align="center"></el-table-column>
          <el-table-column prop="inventoryNumber" label="数量" sortable align="center"></el-table-column>
          <el-table-column prop="number" label="派送数量" align="center" v-if="isbutton">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.number" :controls="false" placeholder="数量" :size="size" @blur="checkNumber(scope.row, scope.$index)"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleOk" v-if="isbutton" :disabled="!tableData.length">确定</el-button>
        <el-button @click="handleClose" v-if="isbutton">取 消</el-button>
        <el-button @click="handleClose" v-if="!isbutton">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import pagination from "@/views/components/pagination";
  import breadcrumb from "@/views/components/breadcrumb";
  import { getNoNumber, listStoreServeGroup } from "api/entrepotSet/inventorymanagement/storeInventory/storeInventory";
  export default {
    props: {
      visible: {
        type: Boolean,
        default: () => false
      },
      isbutton: { // 是否是按钮  按钮为点击礼品派送按钮，不是按钮为点击仓库暂存数量
        type: Boolean,
        default: () => false
      },
      datas: {
        type: Object,
        default: () => {
        }
      }
    },
    components: {
      breadcrumb,
      pagination
    },
    data() {
      return {
        loading: true,
        size: 'small',
        tableData: [],
        arr: [],
        serveGroupList: [],
        ruleForm: {
          arrivalTime: '', // 预计到货时间
          serveGroupId: '' // 组织
        },
        rules: {
          arrivalTime: [
            { required: true, message: '请选择预计到货时间', trigger: 'change' }
          ],
          serveGroupId: [
            { required: true, message: '请选择组织机构', trigger: 'change' }
          ]
        }
      };
    },
    created() {
      this.getData();
      if (this.isbutton) {
        this.getStoreServeGroupList();
      }
    },
    methods: {
      resetForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
      },
      getStoreServeGroupList() {
        let params = {
          dataCode: 'INSTALL_DEPARTMENT'
        };
        listStoreServeGroup(params)
          .then(response => {
            this.serveGroupList = response.data;
          })
          .catch(error => {
            console.log('views/marketing/shopstock/components/stocknumberdia.vue-getStoreServeGroupList:' + error);
          })
      },
      handleClose() {
        this.$emit("close_stock");
      },
      handleOk() {
        let actualArr = this.tableData.map(item => {
          return item.number;
        });
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            let errorData = [];
            for (let i = 0; i < actualArr.length; i++) {
              if (!actualArr[i]) {
                errorData.push(actualArr[i]);
                break;
              }
            }
            if (errorData.length) {
              this.$message.error('请输入数量');
            } else {
              this.tableData.forEach((item, index) => {
                this.deductionFun(actualArr[index], item);
              })
              let val = {
                arr: this.arr,
                arrivalTime: this.ruleForm.arrivalTime,
                serveGroupId: this.ruleForm.serveGroupId
              }
              this.$emit("close_stock", val);
            }
          } else {
            return false;
          }
        });
      },
      tableRowClassName({row, rowIndex}) {
        return rowIndex % 2 != 0 ? "el-f0" : "";
      },
      getData() {
        getNoNumber(this.datas).then(res => {
          if (res.data.length > 0) {
            this.arr = res.data;
            var map = {}, dest = [];
            for (var i = 0; i < this.arr.length; i++) {
              var ai = this.arr[i];
              if (!map[ai.storageId]) {
                dest.push({
                  commodityName: ai.commodityName,  // 商品名称
                  storageName: ai.storageName,      // 仓库名称
                  storageId: ai.storageId,         // 仓库id
                  data: [ai]
                });
                map[ai.storageId] = ai;
              } else {
                for (var j = 0; j < dest.length; j++) {
                  var dj = dest[j];
                  if (dj.storageId == ai.storageId) {
                    dj.data.push(ai);
                    break;
                  }
                }
              }
            }
            this.dest = dest;
            dest.forEach(item => {
              let inventorysum = 0;
              item.data.forEach((itemchild, index) => {
                inventorysum = itemchild.inventoryNumber * 1 + inventorysum * 1;
              })
              item.inventoryNumber = inventorysum;
            });
            this.tableData = dest;
          }
          this.loading = false;
        });
      },
      /**
       * 扣减库存的方法
       * @param actuals 要扣减的数量
       * @param datas 数据
       */
      deductionFun(actuals, datas) {
        datas.data.forEach(item => {
          if (actuals > item.inventoryNumber) {
            actuals = actuals - item.inventoryNumber;
            item.receiveNumber = item.inventoryNumber;
          } else {
            item.receiveNumber = actuals;
            actuals = 0;
          }
        })
      },
      // 验证输入验收数量
      checkNumber(row, index) {
        if (row.number || row.number == 0) {
          if (typeof row.number !== 'number') {
            this.$message.error('请输入数字');
            row.number = '';
          } else {
            if (row.number < 1) {
              this.$message.error('验收数量至少为1');
              row.number = '1';
            }
            if (row.number > row.inventoryNumber) {
              this.$message.error('派送数量不能大于总数量');
              row.number = '';
            }
          }
        }
      }
    }
  };
</script>


