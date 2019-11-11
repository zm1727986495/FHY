<template>
    <div class="addPurchaseOrder">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="warp_head_list">
                <div class="list_top">
                    <div>
                        <el-input @keyup.enter.native="search" v-model="params.names" placeholder="采购合同号/采购单号" size="medium" maxlength="50" clearable></el-input>
                    </div>
                    <div>
                        <el-input @keyup.enter.native="search" v-model="params.namesOrder" placeholder="订单编号/客户姓名/客户电话/备用电话/订单地址" size="medium" maxlength="50" clearable></el-input>
                    </div>
                    <div>
                        <el-select @keyup.enter.native="search" v-model="params.accountsStatus" placeholder="对账单完成状态" size="medium"  clearable filterable>
                            <el-option v-for="(item,idx) in statementCompletionStatus" :key="idx" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <div >
                        <el-date-picker
                          size="medium" type="daterange"
                          value-format='yyyy-M-dd' format='yyyy-M-dd'
                          range-separator="-"
                          v-model="purchaseOrderDate"
                          @keyup.enter.native="search"
                          start-placeholder="采购单生成时间" end-placeholder="采购单生成时间">
                        </el-date-picker>
                    </div>
                    <div v-if="isShow">
                        <el-select @keyup.enter.native="search" v-model="params.brandId" placeholder="品牌" size="medium"  clearable filterable @change="changeBrandOrCate">
                            <el-option v-for="(item,idx) in listBrandArr" :key="idx" :value="item.brandId" :label="item.brandName"></el-option>
                        </el-select>
                    </div>
                    <div v-if="isShow">
                        <el-select  @keyup.enter.native="search" v-model="params.categoryId" placeholder="品类" size="medium"  clearable filterable @change="changeBrandOrCate">
                            <el-option v-for="(item,idx) in listCategoryArr" :key="idx" :value="item.commodityCategoryId" :label="item.categoryName"></el-option>
                        </el-select>
                    </div>
                    <div v-if="isShow">
                        <el-select  @keyup.enter.native="search" v-model="params.companyId" placeholder="供应商" size="medium"  clearable filterable>
                            <el-option v-for="(item,idx) in listCompanyByAllArr" :key="idx" :value="item.companyId" :label="item.companyName"></el-option>
                        </el-select>
                    </div>
                    <div v-if="isShow">
                        <el-select  @keyup.enter.native="search" v-model="params.isCheckBill" placeholder="是否整单对账完成" size="medium" clearable filterable>
                            <el-option :value="1" label="已完成"></el-option>
                            <el-option :value="0" label="未完成"></el-option>
                        </el-select>
                    </div>
                    <div v-if="isShow">
                        <el-select  @keyup.enter.native="search" v-model="params.purchaseStatus" placeholder="执行状态" size="medium" clearable filterable>
                            <el-option :value="1" label="待执行"></el-option>
                            <el-option :value="2" label="执行完成"></el-option>
                        </el-select>
                    </div>
                    <div v-if="isShow">
                        <el-select  @keyup.enter.native="search" v-model="params.orderType" placeholder="订单类型" size="medium" clearable filterable>
                            <el-option v-for="(item,idx) in orderTypeArr" :key="idx" :value="item.id" :label="item.dictName"></el-option>
                        </el-select>
                    </div>
                    <div v-if="isShow">
                        <el-date-picker
                            prefix-icon="el-icon-date"
                            size="medium" type="daterange" 
                            value-format='yyyy-M-dd' format='yyyy-M-dd' 
                            range-separator="-"
                            v-model="purchaseDate"
                             @keyup.enter.native="search"
                            start-placeholder="采购单执行完成开始时间" end-placeholder="采购单执行完成结束时间">
                        </el-date-picker>
                    </div>
                    <div v-if="isShow">
                        <el-date-picker
                            size="medium" type="daterange" 
                            value-format='yyyy-M-dd' format='yyyy-M-dd' 
                            range-separator="-"
                            v-model="accountsCreateDate"
                             @keyup.enter.native="search"
                            start-placeholder="对账单生成开始时间" end-placeholder="对账单生成结束时间">
                        </el-date-picker>
                    </div>
                    <div v-if="isShow">
                        <el-date-picker
                            size="medium" type="daterange" 
                            value-format='yyyy-M-dd' format='yyyy-M-dd' 
                            range-separator="-"
                            v-model="accountsDate"
                             @keyup.enter.native="search"
                            start-placeholder="对账单对账完成开始时间" end-placeholder="对账单对账完成结束时间">
                        </el-date-picker>
                    </div>
                    <div v-if="isShow">
                        <el-date-picker
                            size="medium" type="daterange" 
                            value-format='yyyy-M-dd' format='yyyy-M-dd' 
                            range-separator="-"
                            v-model="checkFinishDate"
                            @keyup.enter.native="search"
                            start-placeholder="整单对账完成开始时间" end-placeholder="整单对账完成结束时间">
                        </el-date-picker>
                    </div>
                    
                </div>
                <div class="head_nav_btn">
                    <span class="fontMore cursors margright" @click="hideSearch()">{{isShow ? '收起' : '更多'}}</span>
                    <div v-loading="searchLoading" style="margin-left:5px">
                        <el-button @click="search" type="warning" class="button-fc" size="medium">查询</el-button>
                    </div>
                    <div v-loading="resetLoading" style="margin-left:10px">
                        <el-button type='primary' size="medium" @click="reset">重置</el-button>
                    </div>
                </div>
            </div>
        </el-card>
        <el-card class="m-top10">
            <el-button size="small" class="button-96" @click="addNewPurchaseOrder">新增采购单</el-button>
            <el-button size="small" class="button-96" :loading="batchObtainLoading" @click="batchObtain">批量获取</el-button>
            <el-button size="small" class="button-96" :loading="deleteLoading" @click="deleteRows" v-if="tableData.length">删除采购单</el-button>
            <el-button size="small" class="button-96" :loading="accomplishLoading" @click="accomplish" v-if="tableData.length">完成对账</el-button>
            <!-- <el-button size="small" class="button-96" :loading="overLoading" @click="over">结束对账</el-button> -->
            <el-button size="small" class="button-96" :loading="finishOverLoading" v-if="tableData.length" @click="finishOver">整单对账完成</el-button>
            <div class="simTable table_list unsortable">
                <el-table v-loading="tableLoading" class="m-top20" border :data="tableData" :row-class-name="tableRowClassName" @selection-change="purchaseChange">
                    <el-table-column fixed="left" align="center" type="selection" :selectable='checkboxT'></el-table-column>
                    <el-table-column width="230" align="center" show-overflow-tooltip prop="purchaseNumber" label="采购单号">
                        <template slot-scope="scope">
                            <div>
                                <el-tooltip placement="right" visible-arrow v-if="scope.row.purchaseStatus==2&&scope.row.accountsStatus!=3">
                                    <div slot="content" class="tips tipFon">
                                        <p class="operaItems" @click="dispose(scope.row)">处理</p>
                                    </div>
                                    <img :src="spot" alt="" class=" attributesTips">
                                </el-tooltip>
                                <p>{{scope.row.purchaseNumber}}</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="150" align="center" prop="settlementMoneyIm" label="对账金额">
                        <template slot-scope="scope">
                            <div v-if="scope.row.accountsStatus!=4&&scope.row.accountsStatus!=3&&scope.row.purchaseStatus==2">
                                <el-input @focus="focus(scope.row.settlementMoneyIm)" @input="changeNum(scope.row,1)" @blur="changeMoney(scope.row,scope.row.settlementMoneyIm,0)" placeholder="请输入金额" size="small" v-model="scope.row.settlementMoneyIm"></el-input>
                            </div>
                            <div v-else>
                                {{scope.row.settlementMoneyIm}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="160" align="center" show-overflow-tooltip prop="headquartersMoney" label="总部成本金额">
                        <template slot-scope="scope">
                            <div v-if="scope.row.accountsStatus!=4&&scope.row.accountsStatus!=3&&scope.row.purchaseStatus==2">
                                <el-input @focus="focus(scope.row.headquartersMoneyIm)" @input="changeNum(scope.row,3)" @blur="changeMoney(scope.row,scope.row.headquartersMoneyIm,3)" placeholder="总部结算金额" size="small" v-model="scope.row.headquartersMoneyIm"></el-input>
                            </div>
                            <div v-else>
                                {{scope.row.headquartersMoneyIm}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="160" align="center" prop="asAmountIm" label="加减收金额">
                        <template slot-scope="scope">
                            <div v-if="(scope.row.accountsStatus==1||scope.row.accountsStatus==2||(scope.row.accountsStatus==4&&scope.row.status!=3))&&scope.row.purchaseStatus==2">
                                <el-input @focus="focus(scope.row.asAmountIm)" @input="changeNum(scope.row,2)" @blur="changeMoney(scope.row,scope.row.asAmountIm,1)" placeholder="请输入加减收金额" size="small" v-model="scope.row.asAmountIm"></el-input>
                            </div>
                            <div v-else>
                                {{scope.row.asAmountIm}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="160" show-overflow-tooltip align="center" prop="earningExtraEarning" label="额外加减收金额">
                        <template slot-scope="scope">
                            <div v-if="(scope.row.accountsStatus==1||scope.row.accountsStatus==2||(scope.row.accountsStatus==4&&scope.row.status==3))&&scope.row.purchaseStatus==2">
                                <el-input @focus="focus(scope.row.additionalAsAmountIm)" @input="changeNum(scope.row,4)" @blur="changeMoney(scope.row,scope.row.additionalAsAmountIm,2)" placeholder="请输入额外加减收金额" size="small" v-model="scope.row.additionalAsAmountIm"></el-input>
                            </div>
                            <div v-else>
                                {{scope.row.additionalAsAmountIm}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="130" show-overflow-tooltip align="center" prop="earningExtraEarning" label="历史加减收金额">
                        <template slot-scope="scope">
                            <div>
                                {{Number(scope.row.earning)+Number(scope.row.extraEarning)}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="130" align="center" show-overflow-tooltip prop="verifyMonye" label="对账成本金额"></el-table-column>
                    <el-table-column width="130" align="center" show-overflow-tooltip prop="settlementMoney" label="拆单成本金额"></el-table-column>
                    <el-table-column width="100" align="center" label="对账状态">
                        <template slot-scope="scope">
                            <div v-if="scope.row.accountsStatus==1||!scope.row.accountsStatus">对账中</div>
                            <div v-if="scope.row.accountsStatus==2">对账完成</div>
                            <div v-if="scope.row.accountsStatus==3">结算中</div>
                            <div v-if="scope.row.accountsStatus==4">结算完成</div>
                        </template>
                    </el-table-column>
                    <el-table-column width="250" align="center" show-overflow-tooltip prop="purchaseContractCode" label="采购合同号"> </el-table-column>
                    <el-table-column width="130" align="center" show-overflow-tooltip prop="purchaseStatus" label="采购单执行状态">
                        <template slot-scope="scope">
                            <div v-if="scope.row.purchaseStatus==1">待执行</div>
                            <div v-if="scope.row.purchaseStatus==2">执行完成</div>
                        </template>
                    </el-table-column>
                    <el-table-column width="140" align="center" show-overflow-tooltip prop="isSignOrder" label="下单完成">
                        <template slot-scope="scope">
                            <div>
                                <span v-if="scope.row.isSignOrder==1">下单完成</span>
                                <span v-else>未完成</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="140" align="center" show-overflow-tooltip prop="purchaseContractCode" label="是否整单对账完成">
                        <template slot-scope="scope">
                            <div>
                                <span v-if="scope.row.isCheckBill==1">已完成</span>
                                <span v-if="scope.row.isCheckBill==0">未完成</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="150" align="center" show-overflow-tooltip prop="companyName" label="供货商名称"></el-table-column>
                    <el-table-column width="100" align="center" show-overflow-tooltip prop="customerName" label="客户姓名"></el-table-column>
                    <el-table-column width="140" align="center" show-overflow-tooltip prop="customerPhone" label="客户电话"></el-table-column>
                    <el-table-column width="140" align="center" show-overflow-tooltip prop="otherPhone" label="备用电话"></el-table-column>
                    <el-table-column width="80" align="center" show-overflow-tooltip prop="address" label="订单地址"></el-table-column>
                    <el-table-column width="200" align="center" show-overflow-tooltip prop="orderNumber" label="订单编号">
                        <template slot-scope="scope">
                            <div class="table_action_span" @click="goToOrderDetails(scope.row)">{{scope.row.orderNumber}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column width="80" align="center" show-overflow-tooltip prop="orderTypeName" label="订单类型"></el-table-column>
                    <el-table-column width="250" align="center" show-overflow-tooltip prop="contractSerialNumber" label="客户合同号"></el-table-column>
                    <el-table-column width="80" align="center" show-overflow-tooltip prop="checkBillAt" label="对账人"></el-table-column>
                    <!-- <el-table-column width="180" align="center" show-overflow-tooltip prop="checkBillTime" label="对账时间"></el-table-column> -->
                    <el-table-column width="180" align="center" show-overflow-tooltip prop="accountsTime" label="对账完成时间"></el-table-column>
                    <el-table-column width="180" align="center" show-overflow-tooltip prop="checkFinishTime" label="整单对账完成时间"></el-table-column>
                    <el-table-column width="180" align="center" show-overflow-tooltip prop="purchaseTime" label="执行完成时间"></el-table-column>
                    <!-- <el-table-column width="150" align="center" show-overflow-tooltip prop="accounts_start_time" label="对账单生成时间"></el-table-column> -->
                    <el-table-column width="100" align="center" show-overflow-tooltip prop="brandName" label="品牌"></el-table-column>
                    <el-table-column width="100" align="center" show-overflow-tooltip prop="categoryName" label="品类"></el-table-column>
                    <el-table-column width="65" align="center" show-overflow-tooltip prop="createAt" label="创建人"></el-table-column>
                    <el-table-column width="180" align="center" show-overflow-tooltip prop="createTime" label="创建时间"></el-table-column>
                </el-table>
            </div>
            <div class="pagination_wrap">
				<pagination
					:current-page="params.page"
					:pageSize="params.limit"
					:total="total"
					@sizeChange="sizeChange"
					@currentChange="currentChange">
				</pagination>
			</div>
        </el-card>
        <el-dialog  title="新增采购单" width="1300px" custom-class="customDialogTitle" :visible.sync="dialog">
            <div class="warp_head_list">
                <div class="list_top">
                    <div>
                        <el-input @keyup.enter.native="searchDialog" v-model="dialogParams.names" placeholder="订单编号/客户合同号/采购合同号/采购单号/客户姓名/客户电话/备用电话/订单地址" size="medium" maxlength="50" clearable></el-input>
                    </div>
                    <div>
                        <el-select @keyup.enter.native="searchDialog" v-model="dialogParams.accountsStatus" placeholder="对账单完成状态" size="medium"  clearable filterable>
                            <el-option v-for="(item,idx) in statementCompletionStatus" :key="idx" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <div>
                        <el-select @keyup.enter.native="searchDialog" v-model="dialogParams.purchaseStatus" placeholder="执行状态" size="medium" clearable filterable>
                            <el-option :value="1" label="待执行"></el-option>
                            <el-option :value="2" label="执行完成"></el-option>
                        </el-select>
                    </div>
                    <div>
                        <el-select @keyup.enter.native="searchDialog" v-model="dialogParams.brandId" placeholder="品牌" size="medium"  clearable filterable @change="changeDiaBrandOrCate">
                            <el-option v-for="(item,idx) in listBrandArr" :key="idx" :value="item.brandId" :label="item.brandName"></el-option>
                        </el-select>
                    </div>
                    <div v-if="dialogIsShow">
                        <el-select @keyup.enter.native="searchDialog" v-model="dialogParams.categoryId" placeholder="品类" size="medium"  clearable filterable @change="changeDiaBrandOrCate">
                            <el-option v-for="(item,idx) in listCategoryArr" :key="idx" :value="item.commodityCategoryId" :label="item.categoryName"></el-option>
                        </el-select>
                    </div>
                    <div v-if="dialogIsShow">
                        <el-select @keyup.enter.native="searchDialog" v-model="dialogParams.companyId" placeholder="供应商" size="medium"  clearable filterable>
                            <el-option v-for="(item,idx) in listCompanyByAllArr2" :key="idx" :value="item.companyId" :label="item.companyName"></el-option>
                        </el-select>
                    </div>
                    <div v-if="dialogIsShow">
                        <el-select @keyup.enter.native="searchDialog" v-model="dialogParams.isCheckBill" placeholder="是否整单对账完成" size="medium" clearable filterable>
                            <el-option :value="1" label="已完成"></el-option>
                            <el-option :value="0" label="未完成"></el-option>
                        </el-select>
                    </div>
                    <div v-if="dialogIsShow">
                        <el-select @keyup.enter.native="searchDialog" v-model="dialogParams.orderType" placeholder="订单类型" size="medium" clearable filterable>
                            <el-option v-for="(item,idx) in orderTypeArr" :key="idx" :value="item.id" :label="item.dictName"></el-option>
                        </el-select>
                    </div>
                    <div v-if="dialogIsShow">
                        <el-date-picker
                            prefix-icon="el-icon-date"
                            size="medium" type="daterange" 
                            value-format='yyyy-M-dd' format='yyyy-M-dd' 
                            range-separator="-"
                            v-model="purchaseDate2"
                            @keyup.enter.native="searchDialog"
                            start-placeholder="采购单执行完成开始时间" end-placeholder="采购单执行完成结束时间">
                        </el-date-picker>
                    </div>
                    <div v-if="dialogIsShow">
                        <el-date-picker
                            size="medium" type="daterange" 
                            value-format='yyyy-M-dd' format='yyyy-M-dd' 
                            range-separator="-"
                            v-model="accountsCreateDate2"
                            @keyup.enter.native="searchDialog"
                            start-placeholder="对账单生成开始时间" end-placeholder="对账单生成结束时间">
                        </el-date-picker>
                    </div>
                    <div v-if="dialogIsShow">
                        <el-date-picker
                            size="medium" type="daterange" 
                            value-format='yyyy-M-dd' format='yyyy-M-dd' 
                            range-separator="-"
                            v-model="accountsDate2"
                            @keyup.enter.native="searchDialog"
                            start-placeholder="对账单对账完成开始时间" end-placeholder="对账单对账完成结束时间">
                        </el-date-picker>
                    </div>
                    <div v-if="dialogIsShow">
                        <el-date-picker
                            size="medium" type="daterange" 
                            value-format='yyyy-M-dd' format='yyyy-M-dd' 
                            range-separator="-"
                            v-model="checkFinishDate2"
                            @keyup.enter.native="searchDialog"
                            start-placeholder="整单对账完成开始时间" end-placeholder="整单对账完成结束时间">
                        </el-date-picker>
                    </div>
                </div>
                <div class="head_nav_btn">
                    <span class="fontMore cursors margright" @click="hideSearch2()">{{dialogIsShow ? '收起' : '更多'}}</span>
                    <div v-loading="dialogSearchLoading" style="margin-left:5px">
                        <el-button @click="searchDialog" type="warning" class="button-fc" size="medium">查询</el-button>
                    </div>
                    <div v-loading="dialogResetLoading" style="margin-left:10px">
                        <el-button type='primary' size="medium" @click="reset2">重置</el-button>
                    </div>
                </div>
            </div>
            <div class="simTable table_list unsortable">
                <el-table v-loading="dialogLoading" class="m-top20" border :data="dialogTableData" :row-class-name="tableRowClassName" @selection-change="selectChange">
                    <el-table-column :selectable='checkboxT' align="center" type="selection"></el-table-column>
                    <el-table-column width="200" align="center" show-overflow-tooltip prop="purchaseNumber" label="采购单"></el-table-column>
                    <el-table-column width="150" align="center" show-overflow-tooltip prop="purchaseStatus" label="执行状态">
                        <template slot-scope="scope">
                            <div v-if="scope.row.purchaseStatus==1">待执行</div>
                            <div v-if="scope.row.purchaseStatus==2">执行完成</div>
                            <div v-if="scope.row.purchaseStatus==3">对账中</div>
                            <div v-if="scope.row.purchaseStatus==4">对账完成</div>
                            <div v-if="scope.row.purchaseStatus==5">执行完成</div>
                            <div v-if="scope.row.purchaseStatus==6">结算中</div>
                            <div v-if="scope.row.purchaseStatus==7">结算完成</div>
                        </template>
                    </el-table-column>
                    <el-table-column width="130" align="center" show-overflow-tooltip prop="accountsStatus" label="对账单完成状态">
                        <template slot-scope="scope">
                            <div>
                                <span v-if="scope.row.accountsStatus==1">待对账</span>
                                <span v-if="scope.row.accountsStatus==2">已对账</span>
                                <span v-if="scope.row.accountsStatus==3">结算中</span>
                                <span v-if="scope.row.accountsStatus==4">已结算</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="200" align="center" show-overflow-tooltip prop="purchaseContractCode" label="采购合同号"></el-table-column>
                    <el-table-column width="200" align="center" show-overflow-tooltip prop="orderNumber" label="订单编号"></el-table-column>
                    <el-table-column width="200" align="center" show-overflow-tooltip prop="contractSerialNumber" label="客户合同号"></el-table-column>
                    <el-table-column width="150" align="center" show-overflow-tooltip prop="customerName" label="客户姓名"></el-table-column>
                    <el-table-column width="150" align="center" show-overflow-tooltip prop="customerPhone" label="客户电话"></el-table-column>
                    <el-table-column width="150" align="center" show-overflow-tooltip prop="otherPhone" label="备用电话"></el-table-column>
                    <el-table-column width="150" align="center" show-overflow-tooltip prop="address" label="订单地址"></el-table-column>
                    <el-table-column width="150" align="center" show-overflow-tooltip prop="brandName" label="品牌"></el-table-column>
                    <el-table-column width="150" align="center" show-overflow-tooltip prop="categoryName" label="品类"></el-table-column>
                    <el-table-column width="150" align="center" show-overflow-tooltip prop="companyName" label="供货商名称"></el-table-column>
                    <el-table-column width="150" align="center" show-overflow-tooltip prop="purchaseContractCode" label="是否整单对账完成">
                        <template slot-scope="scope">
                            <div>
                                <span v-if="scope.row.isCheckBill==1">已完成</span>
                                <span v-if="scope.row.isCheckBill==0">未完成</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column width="150" align="center" show-overflow-tooltip prop="orderTypeName" label="订单状态"></el-table-column>
                    <el-table-column align="center" show-overflow-tooltip prop="settlementMoney" label="对账金额"></el-table-column>
                    <el-table-column width="150" align="center" show-overflow-tooltip prop="earning" label="加减收金额"></el-table-column>
                    <el-table-column width="150" align="center" show-overflow-tooltip prop="extraEarning" label="额外加减收金额"></el-table-column>
                    <el-table-column align="center" show-overflow-tooltip prop="createAt" label="创建人"></el-table-column>
                    <el-table-column width="180" align="center" show-overflow-tooltip prop="createTime" label="创建时间"></el-table-column>
                    <el-table-column width="180" align="center" show-overflow-tooltip prop="purchaseTime" label="执行完成时间"></el-table-column>
                    <!-- <el-table-column width="180" align="center" show-overflow-tooltip prop="accounts_start_time" label="对账单生成时间"></el-table-column> -->
                    <el-table-column width="180" align="center" show-overflow-tooltip prop="accountsTime" label="对账完成时间"></el-table-column>
                    <el-table-column width="180" align="center" show-overflow-tooltip prop="checkFinishTime" label="整单对账完成时间"></el-table-column>
                </el-table>
                <div class="pagination_wrap">
                    <pagination
                        :current-page="dialogParams.page"
                        :pageSize="dialogParams.limit"
                        :total="dialogTotal"
                        @sizeChange="dialogSizeChange"
                        @currentChange="dialogCurrentChange">
                    </pagination>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="confirmLoading" @click="confirm">确 定</el-button>
                <el-button @click="dialog = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import spot from '@/assets/images/spot.png';
import breadcrumb from "@/views/components/breadcrumb";
import pagination from '@/views/components/pagination';
import { batchPullPurchaseOrder, listChoicePurchaseOrder, listPurchaseOrder, addPurchaseOrderBatch, savePurchaseOrderData, delPurchaseOrderBatch } from '@/api/administrationCenter/purchaseOrderAccountCheck/addPurchaseOrder'
import { listCategory, listBrand, listCompanyByAll, listBaseDict, listCompanyByParam } from "@/api/pulicJava";
import { formatDate } from '@/utils/index';
import { editReconciliationComplete, endPurchaseOrder, editImportPurchaseData, getCheckPurchaseOrderData } from '@/api/administrationCenter/purchaseOrderAccountCheck/index';

export default {
    components:{
        breadcrumb,
        pagination
    },
    name:'addPurchaseOrder',
    data(){
        return{
            spot,
            navList:[],
            span:6,
            total:0,
            dialogTotal:0,
            isShow:false,
            dialogIsShow:false,
            batchObtainLoading:false,
            searchLoading:false,
            resetLoading:false,
            dialogSearchLoading:false,
            dialogResetLoading:false,
            overLoading:false,
            finishOverLoading:false,
            params:{
                page:1,
                limit:10,
                purchaseNumber:null,//采购单号
                purchaseContractCode:null,//采购合同
                names:null,//合并搜索
                namesOrder:null,//合并搜索2
                accountsStatus:null,//对账单完成状态
                isCheckBill:null,//是否整单对账完成
                brandId:null,//品牌
                companyId:null,//供应商
                categoryId:null,//品类
                orderType:null,//订单类型
                purchaseStatus:null,//执行状态
                purchaseTimeStart:'',//执行完成开始
                purchaseTimeEnd:'',//执行完成结束
                checkFinishTimeStart:'',//整单对账开始
                checkFinishTimeEnd:"",//整单对账结束
                accountsTimeStart:"",//对账完成时间开始
                accountsTimeEnd:"",//对账完成时间结束
                accountsStartTimeStart:'',//对账生成时间开始
                accountsStartTimeEnd:'',//对账生成时间结束
                purchaseOrderDateStart:null,
                purchaseOrderDateEnd:null
            },
            purchaseDate:[],
            checkFinishDate:[],
            accountsDate:[],
            accountsCreateDate:[],
            purchaseOrderDate: [], // 采购单生成时间

            purchaseDate2:[],
            checkFinishDate2:[],
            accountsDate2:[],
            accountsCreateDate2:[],

            tableData:[],
            dialog:false,

            dialogTableData:[],
            dialogParams:{
                page:1,
                limit:10,
                purchaseNumber:null,//采购单号
                purchaseContractCode:null,//采购合同号
                names:null,//合并搜索
                accountsStatus:null,//对账单完成状态
                isCheckBill:null,//是否整单对账完成
                brandId:null,//品牌
                companyId:null,//供应商
                categoryId:null,//品类
                orderType:null,//订单类型
                purchaseStatus:null,//执行状态
                purchaseTimeStart:'',//执行完成开始
                purchaseTimeEnd:'',//执行完成结束
                checkFinishTimeStart:'',//整单对账开始
                checkFinishTimeEnd:"",//整单对账结束
                accountsTimeStart:"",//对账完成时间开始
                accountsTimeEnd:"",//对账完成时间结束
                accountsStartTimeStart:'',//对账生成时间开始
                accountsStartTimeEnd:'',//对账生成时间结束
            },
            rowsData:[],
            checkboxT(row,idx){
                if(row.purchaseStatus==2&&row.accountsStatus!=3){
                    return 1;
                }else{
                    return 0;
                }
            },
            purchaseRows:[],
            tableLoading:false,
            deleteLoading:false,
            accomplishLoading:false,
            confirmLoading:false,
            dialogLoading:false,

            //采购单状态
            statementCompletionStatus:[ 
                {
                    value:1,
                    label:"待对账"
                },
                {
                    value:2,
                    label:"已对账"
                },
                {
                    value:3,
                    label:"结算中"
                },
                {
                    value:4,
                    label:"已结算"
                }
            ],
            //品类
            listCategoryArr:[],
            //品牌
            listBrandArr:[],
            //供应商
            listCompanyByAllArr:[],
            listCompanyByAllArr2:[],
            //订单类型
            orderTypeArr:[],
            focusMoney:0,
            id:0,//批次id
        }
    },
    created() {
        // this.init()
    },
    mounted() {
    },
    activated(){
        this.id = this.$route.query.purchaseId;
        if(this.$loca.getItem("addPurchaseOrderParams")){
            this.params=JSON.parse(this.$loca.getItem("addPurchaseOrderParams"))
        }
        this.setDefaultDate();
        this.init();
    },
    watch: {
        params:{
            handler(newval,oldValue){
                window.localStorage.addPurchaseOrderParams=JSON.stringify(this.params)
            },
            deep:true
        }
    },
    methods: {
        //整单对账完成
        finishOver(){
            if(this.purchaseRows.length){
                let flag=this.purchaseRows.every((item,idx)=>{
                    return item.accountsStatus==2
                })
                if(flag){
                    let flag2=this.purchaseRows.every((item,idx)=>{
                        return item.isSignOrder==1
                    })
                    if(flag2){
                        let status=this.purchaseRows.every((item,idx)=>{
                            return item.isCheckBill==0
                        })
                        if(status){
                            this.finishOverLoading=true;
                            let arr=[];
                            this.purchaseRows.map((item,idx)=>{
                                arr.push(item.customerContractId)
                            })
                            editReconciliationComplete({
                                customerContractIds:arr.join(",")
                            }).then(res=>{
                                this.finishOverLoading=false;
                                if(res.status==200){
                                    this.pages()
                                    this.$message({
                                        message: '操作成功',
                                        type: 'success'
                                    });
                                }else{
                                    this.$message({
                                        message: res.message,
                                        type: 'warning'
                                    });
                                }
                                
                                // this.dialog2=false;
                            })
                        }else{
                            this.$message({
                                message: '已完成的不可再进行整单对账完成',
                                type: 'warning'
                            });
                        }
                    }else{
                        this.$message({
                            message: '还未下单完成',
                            type: 'warning'
                        });
                    }
                }else{
                    this.$message({
                        message: '必须为对账完成',
                        type: 'warning'
                    });
                }
            }else{
                this.$message({
                    message: '请选择',
                    type: 'warning'
                });
            }
            
        },
        //结束对账
        over(){
            this.overLoading=true;
            endPurchaseOrder({
                purchaseOrderBatchId:this.id
            }).then(res=>{
                this.overLoading=false;
                this.$message.success("操作成功")
                this.$router.push({
                    path:"purchaseOrderReconciliation",
                })
            })
        },
        goToNeedDispose(val){
            this.$router.push({
                path:'needDispose',
                query:{
                    contractId:val.customerContractId,
                    orderId:val.orderId,
                }
            })
        },
        goToOrderDetails(val){
            this.$router.push({
                path:'/ordermm/details',
                query:{
                    orderId:val.orderId
                }
            })
        },
        batchObtain(){
            if(this.purchaseDate==null||this.purchaseDate==""){
                this.purchaseDate=[];
            }
            if(this.checkFinishDate==null||this.checkFinishDate==""){
                this.checkFinishDate=[];
            }
            if(this.accountsDate==null||this.accountsDate==""){
                this.accountsDate=[];
            }
            if(this.accountsCreateDate==null||this.accountsCreateDate==""){
                this.accountsCreateDate=[];
            }
            if(this.purchaseOrderDate==null||this.purchaseOrderDate==""){
              this.purchaseOrderDate=[];
            }
            if(this.namesOrder||this.purchaseOrderDate.length||this.params.names||this.params.accountsStatus||this.params.brandId||this.params.categoryId||this.params.companyId||this.params.isCheckBill||this.params.purchaseStatus||this.params.orderType||this.purchaseDate.length||this.checkFinishDate.length||this.accountsDate.length||this.accountsCreateDate.length){
                this.batchObtainLoading=true;
                this.params.purchaseOrderBatchId = Number(this.id),//批次id
                this.params.purchaseTimeStart=this.purchaseDate[0];//执行完成开始
                this.params.purchaseTimeEnd=this.purchaseDate[1];//执行完成结束
                this.params.checkFinishTimeStart=this.checkFinishDate[0];//整单对账开始
                this.params.checkFinishTimeEnd=this.checkFinishDate[1];//整单对账结束
                this.params.accountsTimeStart=this.accountsDate[0];//对账完成时间开始
                this.params.accountsTimeEnd=this.accountsDate[1];//对账完成时间结束
                this.params.accountsStartTimeStart=this.accountsCreateDate[0];//对账生成时间开始
                this.params.accountsStartTimeEnd=this.accountsCreateDate[1];//对账生成时间结束
                this.params.purchaseOrderDateStart = this.purchaseOrderDate[0];
                this.params.purchaseOrderDateEnd = this.purchaseOrderDate[1];
                let obj=Object.assign({},this.params)
                if(obj.accountsStatus>1){
                    obj.accountsStatus=null;
                }
                batchPullPurchaseOrder(obj).then(res=>{
                    this.batchObtainLoading=false;
                    if(res.status==200){
                        this.$message.success("批量获取成功")
                        this.pages()
                    }
                }).catch(err=>{
                    this.batchObtainLoading=false;
                    console.log(err)
                })
            }else{
                this.$message.warning("至少添加一个筛选条件再进行批量获取")
            }
        },
        changeNum(val,index){
            if(index==1){
                val.settlementMoneyIm = val.settlementMoneyIm.replace(/[^\-?\d.]/g,'');
            }else if(index==2){
                val.asAmountIm = val.asAmountIm.replace(/[^\-?\d.]/g,'');
            }else if(index==3){
                val.headquartersMoneyIm = val.headquartersMoneyIm.replace(/[^\-?\d.]/g,'')
            }else{
                val.additionalAsAmountIm = val.additionalAsAmountIm.replace(/[^\-?\d.]/g,'')
            }
        },
        focus(val){
            this.focusMoney=val;
        },
        changeMoney(val,money,index){
            switch(index){
                case 0:
                    if(val.settlementMoneyIm==""){
                        val.settlementMoneyIm=0;
                    }
                break;
                case 1:
                    if(val.asAmountIm==""){
                        val.asAmountIm=0;
                    }
                break;
                case 2:
                    if(val.additionalAsAmountIm==""){
                        val.additionalAsAmountIm=0;
                    }
                break;
                case 3:
                    if(val.headquartersMoney==""){
                        val.headquartersMoney=0;
                    }
                break;
            }
            if(this.focusMoney!=money){
                editImportPurchaseData({
                    purchaseOrderBatchDataId:val.purchaseOrderBatchDataId,
                    settlementMoney:Number(money),
                    dataType:index,
                    purchaseNumber:val.purchaseNumber
                }).then(res=>{
                    this.$message.success("修改成功")
                    this.pages()
                })
            }
        },
        reset(){
            this.purchaseDate=[];
            this.checkFinishDate=[];
            this.accountsDate=[];
            this.accountsCreateDate=[];
            for(let i in this.params){
                this.params[i]=null;
            }
            this.params.pages=1;
            this.params.limit=10;
            this.params.purchaseOrderBatchId=this.id;
            this.resetLoading=true;
            this.setDefaultDate();
            this.pages()
        },
        reset2(){
            this.purchaseDate=[];
            this.checkFinishDate=[];
            this.accountsDate=[];
            this.accountsCreateDate=[];
            for(let i in this.dialogParams){
                this.dialogParams[i]=null;
            }
            this.dialogParams.pages=1;
            this.dialogParams.limit=10;
            this.dialogParams.purchaseOrderBatchId = this.id;
            this.dialogResetLoading=true;
            this.dialogPages()
        },
        //获取查看采购单接口
        pages(){
            this.tableLoading=true;
            if(this.purchaseDate==null||this.purchaseDate==""){
                this.purchaseDate=[];
            }
            if(this.checkFinishDate==null||this.checkFinishDate==""){
                this.checkFinishDate=[];
            }
            if(this.accountsDate==null||this.accountsDate==""){
                this.accountsDate=[];
            }
            if(this.accountsCreateDate==null||this.accountsCreateDate==""){
                this.accountsCreateDate=[];
            }
            if(this.purchaseOrderDate==null||this.purchaseOrderDate==""){
              this.purchaseOrderDate=[];
            }
            this.params.purchaseOrderBatchId = Number(this.id),//批次id
            this.params.purchaseTimeStart=this.purchaseDate[0];//执行完成开始
            this.params.purchaseTimeEnd=this.purchaseDate[1];//执行完成结束
            this.params.checkFinishTimeStart=this.checkFinishDate[0];//整单对账开始
            this.params.checkFinishTimeEnd=this.checkFinishDate[1];//整单对账结束
            this.params.accountsTimeStart=this.accountsDate[0];//对账完成时间开始
            this.params.accountsTimeEnd=this.accountsDate[1];//对账完成时间结束
            this.params.accountsStartTimeStart=this.accountsCreateDate[0];//对账生成时间开始
            this.params.accountsStartTimeEnd=this.accountsCreateDate[1];//对账生成时间结束
            this.params.purchaseOrderDateStart = this.purchaseOrderDate[0];
            this.params.purchaseOrderDateEnd = this.purchaseOrderDate[1];
            listChoicePurchaseOrder(this.params).then(res=>{
                this.tableLoading=false;
                this.searchLoading=false;
                this.resetLoading=false;
                this.total=res.data.total;
                res.data.rows.map((item,idx)=>{
                    if(!item.settlementMoneyIm){
                        item.settlementMoneyIm=item.settlementMoney;
                    }
                    if(!item.headquartersMoneyIm){
                        item.headquartersMoneyIm=item.settlementMoney;
                    }
                    if(!item.asAmountIm){
                        item.asAmountIm=0;
                    }
                    if(!item.additionalAsAmountIm){
                        item.additionalAsAmountIm=0;
                    }
                    if(!item.verifyMonye){
                        item.verifyMonye=0;
                    }
                })
                this.tableData=res.data.rows;
            }).catch(err=>{
                console.log(err)
                this.tableLoading=false;
            })
        },
        //初始化
        init(){
            this.navList = this.$route.meta;
            this.pages()
            //品类接口
            listCategory().then(res=>{
                this.listCategoryArr=res.data;
            })
            //品牌接口
            listBrand().then(res=>{
                this.listBrandArr=res.data;
            })
            //订单类型
            listBaseDict({
                dataType:"ORDER_TYPE"
            }).then(res=>{
                this.orderTypeArr=res.data;
            })
            
        },
        changeBrandOrCate(){
            if(this.params.brandId&&this.params.categoryId){
                this.listCompanyByParam(1)
            }
        },
        changeDiaBrandOrCate(){
            if(this.dialogParams.brandId&&this.dialogParams.categoryId){
                this.listCompanyByParam(2)
            }
        },
        listCompanyByParam(val){
             //供应商接口 0 是正常的 1是供应商
            this.params.companyId=null;
            listCompanyByParam({
                companyType: 1,
                brandId:val==1?this.params.brandId:this.dialogParams.brandId,
                commodityCategoryId:val==1?this.params.categoryId:this.dialogParams.categoryId
            }).then(res=>{
                if(val==1){
                    this.listCompanyByAllArr=res.data;
                }else if(val==2){
                    this.listCompanyByAllArr2=res.data;
                }
                
            })
        },
        hideSearch(){
            this.isShow=!this.isShow;
        },
        hideSearch2(){
            this.dialogIsShow=!this.dialogIsShow;
        },
        dispose(val){
            if(val.customerContractId&&val.orderId){
                this.$router.push({
                    path:"needDispose",
                    query:{
                        contractId:val.customerContractId,
                        orderId:val.orderId,
                        purchaseOrderBatchDataId:val.purchaseOrderBatchDataId,
                        brandId:val.brandId,
                        commodityCategoryId:val.commodityCategoryId,
                        contractType:val.contractType,
                        dataSource:1,
                        purchaseOrderBatchId:this.id
                    }
                })
            }else{
                this.$message({
                    message: '合同与订单没有匹配上',
                    type: 'warning'
                });
            }
        },
        //完成对账
        accomplish(){
            if(this.purchaseRows.length){
                let status=this.purchaseRows.every((item,idx)=>{
                    return item.purchaseStatus==2
                })
                if(status){
                    let flag=this.purchaseRows.every((item,idx)=>{
                        return Number(item.settlementMoneyIm)!=0
                    })
                    if(flag){
                        let flag2=this.purchaseRows.every((item,idx)=>{
                            return item.accountsStatus!=3&&item.accountsStatus!=4;
                        })
                        if(flag2){
                            let arr=[];
                            this.purchaseRows.map((item,idx)=>{
                                arr.push(item.purchaseOrderBatchDataId)
                            })
                            getCheckPurchaseOrderData({
                                purchaseOrderBatchId:Number(this.id),
                                purchaseOrderBatchDataIds:arr
                            }).then(res=>{
                                if(res.status==205){
                                    this.$message({
                                        message: res.message,
                                        type: 'warning'
                                    });
                                }else{
                                    let arr=[];
                                    let brr=[];
                                    this.purchaseRows.map((item,idx)=>{
                                        let obj={
                                            handleType:0,
                                            purchaseNumber:item.purchaseNumber,
                                            purchaseOrderBatchDataId:item.purchaseOrderBatchDataId,
                                            purchaseOrderBatchId:this.id,
                                            purchaseOrderDataId:-1
                                        }
                                        arr.push(obj)
                                        brr.push(item.purchaseOrderBatchDataId)
                                    })
                                    savePurchaseOrderData(
                                        {
                                            purchaseOrderBatchId:this.id,
                                            purchaseOrderBatchDataList:arr,
                                            purchaseOrderBatchDataIds:brr
                                        }
                                    ).then(res=>{
                                        this.$message({
                                            message: '操作成功',
                                            type: 'success'
                                        });
                                        this.pages()
                                        // this.$router.go(-1)
                                    }).catch(err=>{
                                        console.log(err)
                                    })
                                }
                                
                            })
                        }else{
                            this.$message.warning("只可操作对账中和已对账的数据")
                        }
                        
                    }else{
                        this.$message.warning("对账金额不能为0")
                    }
                }else{
                    this.$message.warning("只有执行完成的才可进行完成对账")
                }
            }else{
                this.$message.warning("请选择采购单")
            }
            
        },
        deleteRows(){
            if(this.purchaseRows.length){
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let arr=[],brr=[];
                    this.purchaseRows.map((item,idx)=>{
                        arr.push(item.purchaseOrderId)
                        brr.push(item.purchaseOrderBatchDataId)
                    })
                    this.deleteLoading=true;
                    delPurchaseOrderBatch({
                        purchasingBatchId:this.id,
                        purchaseOrderIds:arr,
                        purchaseOrderBatchDataIds:brr
                    }).then(res=>{
                        this.pages()
                        this.deleteLoading=false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    }).catch(err=>{
                        this.deleteLoading=false;
                        console.log(err)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            }else{
                this.$message({
                    message: '请选择后再进行删除',
                    type: 'warning'
                });
            }
        },
        //新增采购单按钮
        addNewPurchaseOrder(){
            this.dialog=true;
            this.dialogPages()
        },
        //查询接口
        search(){
            this.params.page=1;
            this.searchLoading=true;
            this.pages()
        },
        tableRowClassName({ row, rowIndex }) {
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        //采购单改变数量
        sizeChange(val){
            this.params.page=1;
            this.params.limit=val;
            this.pages()
        },
        //采购单改变页数
        currentChange(val){
            this.params.page=val;
            this.pages()
        },
        purchaseChange(val){
            this.purchaseRows=val
        },
        confirm(){
            if(this.rowsData.length){
                let arr=[];
                this.rowsData.map((item,idx)=>{

                    arr.push(item.purchaseOrderId)
                })
                this.confirmLoading=true;
                addPurchaseOrderBatch({
                    purchasingBatchId:this.id,
                    purchaseOrderIds:arr,
                    // purchaseOrderBatchDataIds:[]
                }).then(res=>{
                    this.pages();
                    this.dialog=false;
                    this.confirmLoading=false;
                    this.$message({
                        message: '新增成功',
                        type: 'success'
                    });
                }).catch(err=>{
                    console.log(err)
                    this.confirmLoading=false;
                })
            }else{
                this.$message({
                    message: '请选择!',
                    type: 'warning'
                });
            }
        },
        searchDialog(){
            this.dialogParams.page=1;
            this.dialogSearchLoading=true;
            this.dialogPages()
        },
        dialogReset(){
            this.dialogParams.purchaseStatus=null;
            this.dialogParams.purchaseContractCode=null;
            this.dialogParams.purchaseNumber=null;
            this.dialogParams.page=1;
            this.dialogPages()
        },
        dialogPages(){
            this.dialogTableData=[];
            this.dialogLoading=true;
            if(this.purchaseDate2==null||this.purchaseDate2==""){
                this.purchaseDate2=[];
            }
            if(this.checkFinishDate2==null||this.checkFinishDate2==""){
                this.checkFinishDate2=[];
            }
            if(this.accountsDate2==null||this.accountsDate2==""){
                this.accountsDate2=[];
            }
            if(this.accountsCreateDate2==null||this.accountsCreateDate2==""){
                this.accountsCreateDate2=[];
            }
            this.dialogParams.purchaseOrderBatchId = this.id;
            this.dialogParams.purchaseTimeStart=this.purchaseDate2[0];//执行完成开始
            this.dialogParams.purchaseTimeEnd=this.purchaseDate2[1];//执行完成结束
            this.dialogParams.checkFinishTimeStart=this.checkFinishDate2[0];//整单对账开始
            this.dialogParams.checkFinishTimeEnd=this.checkFinishDate2[1];//整单对账结束
            this.dialogParams.accountsTimeStart=this.accountsDate2[0];//对账完成时间开始
            this.dialogParams.accountsTimeEnd=this.accountsDate2[1];//对账完成时间结束
            this.dialogParams.accountsStartTimeStart=this.accountsCreateDate2[0];//对账生成时间开始
            this.dialogParams.accountsStartTimeEnd=this.accountsCreateDate2[1];//对账生成时间结束
            listPurchaseOrder(this.dialogParams).then(res=>{
                this.dialogTotal=res.data.total;
                this.dialogTableData=res.data.rows;
                this.dialogLoading=false;
                this.dialogSearchLoading=false;
                this.dialogResetLoading=false;
            }).catch(err=>{
                this.dialogLoading=false;
                this.dialogSearchLoading=false;
                this.dialogResetLoading=false;
            })
        },
        dialogSizeChange(val){
            this.dialogParams.page=1;
            this.dialogParams.limit=val;
            this.dialogPages()
        },
        dialogCurrentChange(val){
            this.dialogParams.page=val;
            this.dialogPages()
        },
        selectChange(val){
            this.rowsData=val;
        },
        setDefaultDate() {
          const start = new Date();
          const end = new Date();
          start.setTime(end.getTime() - 3600 * 1000 * 24 * 182);
          this.purchaseOrderDate = [formatDate(start), formatDate(end)];
        }
    }
}
</script>
<style lang="scss">
.addPurchaseOrder{
    .el-card__body{
        padding: 10px;
    }
    .warp_head_list{
        width: 100%;
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        .list_top{
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            >div{
                margin-bottom: 10px;
                padding: 0px 5px;
                width: 25%;
                >div{
                    width: 100%;
                }
            }
            .fontMore{
                color:#d0cfcf;
            }
            .margright{
                margin-right: 5px;
            }
        }
        .head_nav_btn{
            width: 200px;
            text-align: center;
            margin-bottom: 0px;
            display: flex;
            align-items: center;    
            .fontMore{
                color:#d0cfcf;
            }
            button+button{
                margin-left: 10px;
            }
        }
    }
}

</style>
