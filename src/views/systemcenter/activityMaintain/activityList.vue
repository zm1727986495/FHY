<template>
  <div class="wrapper lvs">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <!-- 查询条件组 -->
      <el-card class="m-bottom10">
        <div class="queryForm">
          <el-row :gutter="10">
            <el-col :span="span">
              <el-input v-model.trim="queryForm.activityId" clearable placeholder="活动ID" :size="size" @keyup.enter.native="searchFun"></el-input>
            </el-col>
            <el-col :span="span">
              <el-input v-model.trim="queryForm.activityName" clearable placeholder="活动名称" :size="size" @keyup.enter.native="searchFun"></el-input>
            </el-col>
            <el-col :span="span">
              <el-select v-model="queryForm.activityStatus" placeholder="活动状态" clearable :size="size">
                <el-option v-for="item in statusList" :value="item.code" :label="item.value" :key="item.code"></el-option>
              </el-select>
            </el-col>
            <el-col :span="span">
              <el-select v-model="queryForm.activityType" placeholder="活动类型" clearable :size="size">
                <el-option v-for="item in activityType" :value="item.code" :label="item.value" :key="item.code"></el-option>
              </el-select>
            </el-col>
            <el-col :span="span">
              <el-select v-model="queryForm.brandId" placeholder="品牌" clearable :size="size" filterable>
                <el-option v-for="item in brandList" :value="item.brandId" :label="item.brandName" :key="item.brandId"></el-option>
              </el-select>
            </el-col>
            <el-col :span="span">
              <el-select v-model="queryForm.storeId" placeholder="门店" clearable :size="size" filterable>
                <el-option v-for="item in storeList" :value="item.storeId" :label="item.storeName" :key="item.storeId"></el-option>
              </el-select>
            </el-col>
            <el-col :span="24" class="center">
              <el-button type="warning" class="button-fc" @click="searchFun" :size="size">查询</el-button>
              <el-button type="primary" @click="resetQueryForm" :size="size">重置</el-button>
            </el-col>
          </el-row>
        </div>
      </el-card>
      <!-- 按钮-表格-分页-->
      <el-card v-loading="loading">
        <div class="m-bottom10">
          <el-button v-for="(item,index) in actionBtnList" class="button-96" @click="butGroupAction(item.url,item.type)" :key="index" :size="btnSize" v-if="item.isHasAuthority">{{item.name}}</el-button>
        </div>
        <div class="table_list">
          <el-table border :data="tableList" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" :max-height="maxHeight">
            <el-table-column align="center" type="selection" width="50" fixed="left"></el-table-column>
            <el-table-column align="center" prop="status" label="活动状态" sortable width="110" fixed>
              <template slot-scope="scope">
                <span v-if="scope.row.activityStatus == 0">未发布</span>
                <span v-else-if="scope.row.activityStatus == 1">已发布</span>
                <span v-else-if="scope.row.activityStatus == 2">已过期</span>
                <span v-else-if="scope.row.activityStatus == 3">已停用</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="activityCode" label="活动编码" sortable width="130" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="name" label="活动名称" sortable width="200" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button type="text" @click="handleView(scope.row)">{{scope.row.activityName}}</el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="activityType" label="活动类型" sortable width="110">
              <template slot-scope="scope">
                <span v-if="scope.row.activityType == 0">品牌</span>
                <span v-if="scope.row.activityType == 1">门店</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="startTime" label="发布时间" sortable width="180"></el-table-column>
            <el-table-column align="center" prop="endTime" label="结束时间" sortable width="180"></el-table-column>
            <el-table-column align="center" prop="createTime" label="创建时间" sortable width="180"></el-table-column>
            <el-table-column align="center" prop="actualTime" label="停用时间" sortable width="180"></el-table-column>
            <el-table-column align="center" prop="remarks" label="备注" sortable min-width="230" show-overflow-tooltip></el-table-column>
          </el-table>
          <div class="pagination_wrap">
            <pagination
              :current-page="currentPage"
              :pageSize="pageSize"
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
  import breadcrumb from '@/views/components/breadcrumb';
  import pagination from '@/views/components/pagination';
  import { mapGetters } from 'vuex';
  import spot from '@/assets/images/spot.png';
  import { listBrand, listStore } from 'src/api/pulicJava';
  import { listActivityByPage, copyActivity, editPublish, delActivity } from 'src/api/administrationCenter/sysParamsSetting/activityMaintain';
  export default {
    name: 'activityList',
    components: {
      breadcrumb,
      pagination
    },
    data() {
      return {
        btn_view: false, // 查看活动按钮权限-未加
        loading: true,
        spot,
        navList: [],
        status: [],
        tableList: [],
        currentPage: 1,
        pageSize: 20,
        total: 0,
        statusList: [
          { code: 0, value: '未发布' },
          { code: 1, value: '已发布' },
          { code: 2, value: '已过期' },
          { code: 3, value: '已停用' }
        ],
        activityType: [
          { code: 0, value: '品牌' },
          { code: 1, value: '门店' }
        ],
        brandList: [],
        storeList: [],
        selection: [],
        actionBtnList: [
          { name: '新增', url: '/activity/addActivity', type: 1, isHasAuthority: false },
          { name: '删除', url: '', type: 2, isHasAuthority: false },
          { name: '编辑', url: '/activity/addActivity', type: 3, isHasAuthority: false },
          { name: '发布', url: '', type: 4, isHasAuthority: false },
          { name: '停用', url: '', type: 5, isHasAuthority: false },
          { name: '复制', url: '', type: 6, isHasAuthority: false }
        ],
        queryForm: {
          activityId: '',
          activityName: '',
          activityStatus: '',
          activityType: '',
          brandId: '',
          storeId: ''
        }
      }
    },
    created() {
      this.getBrandList();
      this.getStoreList();
      this.getData();
      this.initBtnElements();
    },
    mounted() {
      this.navList = this.$route.meta;
    },
    methods: {
      // 获取按钮权限
      initBtnElements() {
        let element = JSON.parse(this.$loca.getItem('element'));
        this.actionBtnList[0].isHasAuthority = element['activity:btn_add']; // 新增
        this.actionBtnList[1].isHasAuthority = element['activity:btn_del']; // 删除
        this.actionBtnList[2].isHasAuthority = element['activity:btn_edit']; // 编辑
        this.actionBtnList[3].isHasAuthority = element['activity:btn_publish']; // 发布
        this.actionBtnList[4].isHasAuthority = element['activity:btn_disable']; // 停用
        this.actionBtnList[5].isHasAuthority = element['activity:btn_copy']; // 复制
        this.btn_view = element['activity:btn_view']; // 查看
      },
      resetForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
      },
      currentChange(val) {
        this.currentPage = val;
        this.getData();
      },
      sizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        this.getData();
      },
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      // 获取全部门店
      getStoreList() {
        listStore()
          .then(response => {
            this.storeList = response.data;
          })
          .catch(error => {
            console.log('common/listStore:' + error);
          });
      },
      // 获取所有的品牌
      getBrandList() {
        listBrand()
          .then(response => {
            this.brandList = response.data;
          })
          .catch(error => {
            console.log('common/listBrand:' + error);
          });
      },
      // 查询按钮点击
      searchFun() {
        this.currentPage = 1;
        this.getData();
      },
      // 重置
      resetQueryForm() {
        this.currentPage = 1;
        for (let keys in this.queryForm) {
          this.queryForm[keys] = '';
        }
        this.getData();
      },
      // 勾选函数回调
      handleSelectionChange(val) {
        this.selection = val;
      },
      // 按钮组函数
      butGroupAction(url, type) {
        if (type == 1) { // 新增
          this.$router.push({
            path: url
          });
        } else {
          if (!this.selection.length) {
            this.$message.warning('请选择活动');
            return;
          }
          if (type == 2 || type == 4 || type == 5) {
            if (type == 2) { // 删除
              this.$confirm('确定删除?', '提示', {
                type: 'warning'
              }).then(() => {
                let ids = [];
                this.selection.forEach(item => {
                  ids.push(Number(item.activityId));
                })
                let params = {
                  activityId: ids
                }
                this.deleteActivity(params);
              }).catch(() => {});
            }
            if (type == 4) { // 发布
              let errorData = this.selection.filter(item => {
                return item.activityStatus != 0
              });
              if(errorData.length) {
                this.$message.error('只有为未发布状态的活动才能进行发布操作');
              } else {
                this.$confirm('确定发布?', '提示', {
                  type: 'warning'
                }).then(() => {
                  let ids = [];
                  this.selection.forEach(item => {
                    ids.push(Number(item.activityId));
                  })
                  let params = {
                    activityId: ids,
                    activityStatus: 0
                  }
                  this.editPublish(params);
                }).catch(() => {});
              }
            }
            if (type == 5) { // 停用
              let errorData = this.selection.filter(item => {
                return item.activityStatus != 1
              });
              if(errorData.length) {
                this.$message.error('只有为发布状态的活动才能进行停用操作');
              } else {
                this.$confirm('确定停用?', '提示', {
                  type: 'warning'
                }).then(() => {
                  let ids = [];
                  this.selection.forEach(item => {
                    ids.push(Number(item.activityId));
                  })
                  let params = {
                    activityId: ids,
                    activityStatus: 1
                  }
                  this.editPublish(params);
                }).catch(() => {});
              }
            }
          } else {
            if (this.selection.length > 1) {
              this.$message.warning('只能选择一个活动');
              return;
            }
            if (type == 3) { // 编辑
              this.$router.push({
                path: url,
                query: {
                  activityId: this.selection[0].activityId,
                  status: this.selection[0].activityStatus
                }
              });
            }
            if (type == 6) { // 复制
              this.$confirm('确定复制此活动?', '提示', {
                type: 'warning'
              }).then(() => {
                let params = {
                  activityId: this.selection[0].activityId
                }
                this.copyActivity(params);
              }).catch(() => {});
            }
          }
        }
      },
      // 获取活动列表
      getData() {
        let params = {
          activityName: this.queryForm.activityName,
          activityStatus: this.queryForm.activityStatus,
          activityType: this.queryForm.activityType,
          brandId: this.queryForm.brandId,
          storeId: this.queryForm.storeId,
          limit: this.pageSize,
          page: this.currentPage
        }
        this.loading = true;
        listActivityByPage(params)
          .then(response => {
            this.loading = false;
            const result = response.data;
            this.tableList = result.rows;
            this.total = result.total;
          })
          .catch(error => {
            this.loading = false;
            console.log('activity/listActivityByPage:' + error);
          });
      },
      // 点击活动名称 - 查看
      handleView(row) {
        this.$router.push({
          path: '/activity/viewActivity',
          query: {
            activityId: row.activityId
          }
        });
      },
      // 复制活动
      copyActivity(params) {
        copyActivity(params)
          .then(response => {
            this.$message.success('复制成功');
            this.getData();
          })
          .catch(error => {
            console.log('activity/copyActivity:' + error);
          });
      },
      // 发布、停用活动
      editPublish(params) {
        editPublish(params)
          .then(response => {
            this.$message.success('操作成功');
            this.getData();
          })
          .catch(error => {
            this.$message.error('操作失败');
            console.log('activity/editPublish:' + error);
          });
      },
      // 删除活动
      deleteActivity(params) {
        delActivity(params)
          .then(response => {
            this.$message.success('删除成功');
            this.getData();
          })
          .catch(error => {
            this.$message.error('删除失败');
            console.log('活动维护-删除活动-activity/delActivity:' + error);
          });
      }
    },
    computed: {
      ...mapGetters([
        'maxHeight',
        'size',
        'btnSize',
        'span',
        'elements'
      ])
    }
  }
</script>
