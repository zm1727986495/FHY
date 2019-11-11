<template>
  <div class="ruleMutex">
    <div class="table_list unsortable" v-loading="loading">
      <el-table border :data="activityRuleList" :row-class-name="tableRowClassName">
        <el-table-column align="center" label="序号" width="120">
          <template slot-scope="scope">
            <div>
              <el-tooltip placement="right" visible-arrow>
                <div slot="content" class="tips tipFon">
                  <p @click="handleEdit(scope.row)" class="operaItems">编辑互斥关系</p>
                  <p @click="handleEditOrder(scope.row,0)" class="operaItems">上移</p>
                  <p @click="handleEditOrder(scope.row,1)" class="operaItems">下移</p>
                </div>
                <img :src="spot" alt="" class="attributesTips">
              </el-tooltip>
              <p class="operation">{{scope.$index + 1}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="ruleType" label="类型">
          <template slot-scope="scope">
            <span v-if="scope.row.ruleType == 0">满减</span>
            <span v-else-if="scope.row.ruleType == 1">折扣</span>
            <span v-else-if="scope.row.ruleType == 2">加价购</span>
            <span v-else-if="scope.row.ruleType == 3">一口价</span>
            <span v-else-if="scope.row.ruleType == 4">赠礼品</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="ruleName" label="自定义名称" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="mutexName" label="互斥优惠规则" width="500" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="remarks" label="备注" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <el-dialog title="编辑互斥关系" :visible.sync="rulesDialogVisible" width="600px" custom-class="customDialogTitle">
      <div class="dialogBody">
        <el-row class="rulesBox">
          <el-col :span="10" class="itemBox leftBox">
            <p class="editRules">{{ editRules.activityRuleId }} {{ editRules.activityRuleName }}</p>
          </el-col>
          <el-col :span="3" class="itemBox middleBox">
            <el-button class="rulesButton" size="small" icon="el-icon-d-arrow-right" circle></el-button>
          </el-col>
          <el-col :span="11" class="itemBox rightBox">
            <el-checkbox-group v-model="editRules.selectedRules">
              <el-checkbox v-for="item in editRules.activityRuleMutexList" :label="item.activityRuleId" :key="item.activityRuleId">{{ item.ruleName }}</el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectRules">确 定</el-button>
        <el-button @click="rulesDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import spot from '@/assets/images/spot.png';
  import { listActivityRule, getActivityRuleMutex, editActivityRuleMutex, editActivityRuleOrder } from 'src/api/administrationCenter/sysParamsSetting/activityMaintain';
  export default {
    name: 'ruleMutex',
    data() {
      return {
        loading: false,
        navList: [],
        activityId: '',
        activityRuleId: '',
        span: 12,
        dialogSpan: 11,
        fullSpan: 24,
        querySpan: 3,
        spot,
        size: 'medium',
        formLabelWidth: '170px',
        formLabelWidthDialog: '140px',
        rulesDialogVisible: false,
        activityRuleList: [],
        editRules: {
          activityRuleId: '',
          activityRuleName: '',
          activityRuleMutexList: [],
          selectedRules: []
        }
      }
    },
    created() {
      if (this.selectedInfo.activityId != '' && this.selectedInfo.activityId != null && this.selectedInfo.activityId != undefined) {
        this.activityId = this.selectedInfo.activityId;
        this.getActivityRuleList();
      }
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      // 获取优惠规则列表
      getActivityRuleList() {
        this.loading = true;
        const params = {
          activityId: this.activityId
        }
        listActivityRule(params)
          .then(response => {
            this.activityRuleList = response.data;
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            console.log('views/administratiocenter/sysParamsSetting/activityMaintain/ruleMutex.vue:getActivityRuleList' + error);
          });
      },
      // 获取互斥规则列表
      getActivityRuleMutex(params) {
        getActivityRuleMutex(params)
          .then(response => {
            this.editRules.activityRuleMutexList = response.data;
            const selectedRulesList = response.data.filter(item => item.activityRuleType != 0)
            selectedRulesList.forEach(item => {
              this.editRules.selectedRules.push(item.activityRuleId);
            })
          })
          .catch(error => {
            console.log('views/administratiocenter/sysParamsSetting/activityMaintain/ruleMutex.vue:getActivityRuleMutex' + error);
          });
      },
      // 点击编辑互斥关系按钮
      handleEdit(row) {
        this.editRules.selectedRules = [];
        const params = {
          activityId: this.activityId,
          activityRuleId: row.activityRuleId
        }
        this.getActivityRuleMutex(params);
        this.editRules.activityRuleId = row.activityRuleId;
        this.editRules.activityRuleName = row.ruleName;
        this.rulesDialogVisible = true;
      },
      // 提交互斥关系
      selectRules() {
        const params = {
          activityRuleId: this.editRules.activityRuleId,
          activityRuleIds: this.editRules.selectedRules
        }
        editActivityRuleMutex(params)
          .then(response => {
            this.$message.success('编辑成功');
            this.getActivityRuleList();
            this.rulesDialogVisible = false;
          })
          .catch(error => {
            console.log('views/administratiocenter/sysParamsSetting/activityMaintain/ruleMutex.vue:selectRules' + error);
          });
      },
      // 互斥规则排序
      handleEditOrder(row, order) {
        const params = {
          activityRuleId: row.activityRuleId,
          order
        }
        editActivityRuleOrder(params)
          .then(response => {
            this.$message.success('操作成功');
            this.getActivityRuleList();
          })
          .catch(error => {
            console.log('views/administratiocenter/sysParamsSetting/activityMaintain/ruleMutex.vue:handleEditOrder' + error);
          });
      }
    },
    computed: {
      ...mapGetters([
        'selectedInfo'
      ])
    }
  }
</script>
