<template>
    <div class = "tabs_after_table">
        <div class="tableHead">
            <div class="tabs_button">
                <el-button size="small" class="button-96" type="default"  @click='confimGoods'>确认</el-button>
                <el-button size="small" class="button-96" type="default" @click='cancelFun'>取消</el-button>
            </div>
        </div>
        <el-table
          border
          ref="multipleTable"
          :data="addData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="55"   align="center" sortable>
        </el-table-column>
        
        <el-table-column
        prop="status"
        label="状态"
        align="center" sortable>
        </el-table-column>

        <el-table-column
        prop="commodityCode"
        label="商品编码"
        show-overflow-tooltip  align="center" sortable>
        </el-table-column>

        <el-table-column
        prop="commodityName"
        label="商品名称"
        show-overflow-tooltip  align="center" sortable>
        </el-table-column>

        <el-table-column
        prop="brandName"
        label="商品品牌"
        show-overflow-tooltip  align="center" sortable>
        </el-table-column>

        <el-table-column
        prop="categoryName"
        label="品类名称"
        show-overflow-tooltip  align="center" sortable>
        </el-table-column>

        <el-table-column
        prop="classifyName"
        label="分类名称"
        show-overflow-tooltip  align="center" sortable>
        </el-table-column>

        <el-table-column
        prop="commodityModel"
        label="产品款型"
        show-overflow-tooltip  align="center" sortable>
        </el-table-column>

        <el-table-column
        prop="spec"
        label="规格型号"
        show-overflow-tooltip  align="center" sortable>
        </el-table-column>
    </el-table>
    </div>
</template>

<script>

import { btnCustomer, listrCustomer } from "api/customermanagement/transfer/transfer";
import { getNames } from 'src/utils/pubilcFn.js';
import { getToken } from '@/utils/auth';
import {
  addCommodityInPriceStrategy,
} from 'api/price/price';

export default {
   name: 'goodsTable',
	components: {
		
	},
  props: ["addData","id"],
  data() {
    return {
       currentPage: 1,//当前页数
       pageSize: 20,//当前页最大条数
       total: 0,//总条数
       selectVal: [],
    }
  },
  
    methods: {
        handleSelectionChange(val){ // table勾选事件
            this.selectVal = val;
        },

        currentChange(val) { // 翻页方法
            this.currentPage = val;
            // this.getList();
        },
        sizeChange(val) { //改变页目方法
            this.currentPage = 1;
            this.pageSize = val;
            //   this.getList();
        },

    
		// 取消按钮
		cancelFun() {
			this.$refs.multipleTable.clearSelection();
		},

		// 确认按钮
		confimGoods() {
			if(this.selectVal.length == 0){
				this.$message.error('请勾选内容后再进行操作')
				return
			}

			let commodityIds = this.selectVal.map(item => Number(item.commodityId));

			let data = {
				commodityIds,
				priceStrategyId: this.id,
			}

			// toFixed 
			addCommodityInPriceStrategy(data).then(res => {
				
				if(res.status == 200){
					this.$message({
						message: '商品添加策略成功',
						type: 'success'
					});
					
					this.$emit('myGet')

					this.$refs.multipleTable.clearSelection();
				}else{
					this.$message.error(res.message)
				}
			}).catch(error =>{
				console.log('销售价格 销售价格详情 价格策略新增商品 views/price/price', error);
			})
		}
    

  },
};
</script>
<style scoped lang="scss">
    .tabs_after_table {
        .tableHead {
            /* background : #8f9094; */
            height: 60px;
            /* border: 1px solid #e4e7ec; */
            display: flex;
            align-items: center;
            justify-content: space-between;
            .tabs_button {
                min-width : 30%;
                padding: 12px;
                display: flex;
                flex-wrap: nowrap;
            }
        }
        .table_head_title {
            padding: 12px;
            font-size: 16px;
            box-sizing: border-box;
        }
    }



</style>


