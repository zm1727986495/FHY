<template>
  <div class="table_list unsortable">
    <el-table border :data="datas" :max-height="maxHeight">
      <el-table-column type="index" align="center" width="60"></el-table-column>
      <el-table-column label="操作人" prop="auditAtName" align="center"></el-table-column>
      <el-table-column label="操作时间" prop="createTime" align="center"></el-table-column>
      <el-table-column label="操作结果" prop="auditResult" align="center">
        <template slot-scope="scope">
          <div v-if="!type">
            <p v-if="scope.row.auditResult == 0">发起申请</p>
            <p v-if="scope.row.auditResult == 1">通过</p>
            <p v-if="scope.row.auditResult == 2">拒绝</p>
            <p v-if="scope.row.auditResult == 3">退回上一步</p>
          </div>
          <div v-if="type == 'contract'">
            <p v-if="scope.row.auditResult == 1">通过</p>
            <p v-if="scope.row.auditResult == 2">拒绝</p>
            <p v-if="scope.row.auditResult == 3">整单驳回</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="auditOpinion" align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    props: ['datas', 'type'],
    methods: {
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      }
    },
    computed: {
      ...mapGetters(['maxHeight'])
    }
  };
</script>
