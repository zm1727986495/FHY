<template>
    <div class="purchaseOrderAccountCheck">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <el-card>
            <div class="warp_head_list">
                <div class="list_top">
                    <div>
                        <el-input size="medium" clearable placeholder="采购单号/采购合同号" v-model="formList.orderGroup"></el-input>
                    </div>
                    <div>
                        <el-input size="medium" clearable placeholder="客户和同号/订单编号/门店" v-model="formList.names"></el-input>
                    </div>
                    <div>
                        <el-select v-model="formList.isCheckBill" filterable clearable size="medium" placeholder="是否整单对账完成">
                            <el-option label="否" :value="0"></el-option>
                            <el-option label="是" :value="1"></el-option>
                        </el-select>
                    </div>
                    <div>
                        <el-date-picker
                        v-model="date"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="对账开始时间"
                        size="medium"
                        value-format='yyyy-M-dd' format='yyyy-M-dd' 
                        end-placeholder="对账结束时间">
                        </el-date-picker>
                    </div>
                    <div v-if="isShow">
                        <el-date-picker
                        v-model="date2"
                        type="daterange"
                        range-separator="-"
                        size="medium"
                        value-format='yyyy-M-dd' format='yyyy-M-dd' 
                        start-placeholder="整单对账完成开始时间"
                        end-placeholder="整单对账完成结束时间">
                        </el-date-picker>
                    </div>
                    <div v-if="isShow">
                        <el-select v-model="formList.status" filterable clearable size="medium" placeholder="请选择状态">
                            <el-option label="对账完成" :value="2"></el-option>
                            <!-- <el-option label="结算中" :value="3"></el-option> -->
                            <el-option label="已结算" :value="4"></el-option>
                        </el-select>
                    </div>
                    <div v-if="isShow">
                        <el-select @keyup.enter.native="search" v-model="formList.brandId" placeholder="品牌" size="medium"  clearable filterable @change="changeBrandOrCate">
                            <el-option v-for="(item,idx) in listBrandArr" :key="idx" :value="item.brandId" :label="item.brandName"></el-option>
                        </el-select>
                    </div>
                    <div v-if="isShow">
                        <el-select  @keyup.enter.native="search" v-model="formList.categoryId" placeholder="品类" size="medium"  clearable filterable @change="changeBrandOrCate">
                            <el-option v-for="(item,idx) in listCategoryArr" :key="idx" :value="item.commodityCategoryId" :label="item.categoryName"></el-option>
                        </el-select>
                    </div>
                    <div v-if="isShow">
                        <el-select  @keyup.enter.native="search" v-model="formList.companyId" placeholder="供应商" size="medium"  clearable filterable>
                            <el-option v-for="(item,idx) in listCompanyByAllArr" :key="idx" :value="item.companyId" :label="item.companyName"></el-option>
                        </el-select>
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
        </el-card>
        <div class="m-top20">
            <el-tabs type="border-card" @tab-click="tabClick">
                <el-tab-pane label="对账完成">
                    <div>
                        <el-button class="button-96" size="small" @click="orderCompleted">整单对账完成</el-button>
                        <el-button class="button-96" size="small" @click="exportExcel">导出</el-button>
                        <el-button class="button-96" size="small" v-if="btnJurisdiction.hasBeenSettled" @click="hasBeenSettled">财务结算</el-button>
                    </div>
                    <div class="simTable table_list unsortable">
                        <el-table v-loading="tabLoading" class="m-top20" :data="tableData" border :row-class-name="tableRowClassName" @selection-change="selectChange">
                            <el-table-column fixed type="selection" align="center"></el-table-column>
                            <el-table-column width="250px" show-overflow-tooltip align="center" prop="purchaseNumber" label="采购单号">
                                <template slot-scope="scope">
                                    <div>
                                        <p class="table_action_span" @click="goToPurchase(scope.row)">{{scope.row.purchaseNumber}}</p>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column width="100px" show-overflow-tooltip align="center" prop="status" label="结算单状态">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.status==2">对账完成</div>
                                    <div v-if="scope.row.status==3">结算中</div>
                                    <div v-if="scope.row.status==4">结算完成</div>
                                </template>
                            </el-table-column>
                            <el-table-column width="100px" show-overflow-tooltip align="center" prop="purchaseStatus" label="执行状态">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.purchaseStatus==1">待执行</div>
                                    <div v-if="scope.row.purchaseStatus==2">执行完成</div>
                                </template>
                            </el-table-column>
                            <el-table-column width="160px" show-overflow-tooltip align="center" prop="isCheckBill" label="是否整单对账完成">
                                <template slot-scope="scope">
                                    <div>
                                        {{scope.row.isCheckBill==0?"否":"是"}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column width="170px" show-overflow-tooltip align="center" prop="checkFinishTime" label="整单对账完成时间"></el-table-column>
                            <el-table-column width="130px" show-overflow-tooltip align="center" prop="verifyMonye" label="对账成本金额"></el-table-column>
                            <el-table-column width="130px" show-overflow-tooltip align="center" prop="settlementMoney" label="拆单成本金额"></el-table-column>
                            <el-table-column width="130px" show-overflow-tooltip align="center" prop="asAmount" label="加减收"></el-table-column>
                            <el-table-column width="130px" show-overflow-tooltip align="center" prop="additionalAsAmount" label="额外加减收"></el-table-column>
                            <el-table-column width="130px" show-overflow-tooltip align="center" prop="contractSerialNumber" label="客户合同号">
                                <template slot-scope="scope">
                                    <div>
                                        <p class="table_action_span" @click="goToCustomerContract(scope.row)">{{scope.row.contractSerialNumber}}</p>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column width="230px" show-overflow-tooltip align="center" prop="purchaseContractCode" label="采购合同号"></el-table-column>
                            <el-table-column width="230px" show-overflow-tooltip align="center" prop="orderNumber" label="订单号">
                                <template slot-scope="scope">
                                    <div>
                                        <p class="table_action_span" @click="goToOrder(scope.row)">{{scope.row.orderNumber}}</p>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="orderTypeName" label="订单类型"></el-table-column>
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="storeName" label="所属门店"></el-table-column>
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="companyName" label="供应商"></el-table-column>
                            <!-- <el-table-column width="180px" show-overflow-tooltip align="center" prop="createOrderTime" label="下单完成时间"></el-table-column>
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="createOrderAt" label="下单人"></el-table-column> -->
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="splitOrderTime" label="拆单完成时间"></el-table-column>
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="splitOrderAt" label="拆单人"></el-table-column>
                            <el-table-column width="130px" show-overflow-tooltip align="center" prop="userName" label="对账人"></el-table-column>
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="accountsTime" label="对账完成时间"></el-table-column>
                            <!-- <el-table-column width="180px" show-overflow-tooltip align="center" prop="createTime" label="提交结算时间"></el-table-column> -->
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="settlementTime" label="结算完成时间"></el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="未整单对账完成">
                    <el-button class="button-96" size="small" @click="orderCompleted">整单对账完成</el-button>
                    <div class="simTable table_list unsortable">
                        <el-table v-loading="tabLoading" class="m-top20" @selection-change="selectChange" :data="tableData" border :row-class-name="tableRowClassName">
                            <el-table-column align="center" type="selection"></el-table-column>
                            <el-table-column width="250px" show-overflow-tooltip align="center" prop="purchaseContractCode" label="采购合同号">
                                <template slot-scope="scope">
                                    <div>
                                        <p class="table_action_span" @click="showDialog(scope.row)">{{scope.row.purchaseContractCode}}</p>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column width="230px" show-overflow-tooltip align="center" prop="orderNumber" label="订单号">
                                <template slot-scope="scope">
                                    <div>
                                        <p class="table_action_span" @click="goToOrder(scope.row)">{{scope.row.orderNumber}}</p>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column show-overflow-tooltip align="center" prop="orderTypeName" label="订单类型"></el-table-column>
                            <el-table-column show-overflow-tooltip align="center" prop="storeName" label="所属门店"></el-table-column>
                            <!-- <el-table-column show-overflow-tooltip align="center" prop="createOrderTime" label="下单完成时间"></el-table-column>
                            <el-table-column show-overflow-tooltip align="center" prop="createOrderAt" label="下单人"></el-table-column> -->
                            <el-table-column show-overflow-tooltip align="center" prop="splitOrderTime" label="拆单完成时间"></el-table-column>
                            <el-table-column show-overflow-tooltip align="center" prop="splitOrderAt" label="拆单人"></el-table-column>
                            <!-- <el-table-column width="180px" show-overflow-tooltip align="center" prop="createTime" label="提交结算时间"></el-table-column> -->
                        </el-table>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="结算列表">
                    <div class="simTable table_list unsortable">
                        <el-table v-loading="tabLoading" class="m-top20" :data="tableData" border :row-class-name="tableRowClassName">
                            <el-table-column width="250px" show-overflow-tooltip align="center" prop="purchaseNumber" label="采购单号">
                                <template slot-scope="scope">
                                    <div>
                                        <p class="table_action_span" @click="goToPurchase(scope.row)">{{scope.row.purchaseNumber}}</p>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column width="100px" show-overflow-tooltip align="center" prop="status" label="结算单状态">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.status==2">对账完成</div>
                                    <div v-if="scope.row.status==3">结算中</div>
                                    <div v-if="scope.row.status==4">结算完成</div>
                                </template>
                            </el-table-column>
                            <el-table-column width="100px" show-overflow-tooltip align="center" prop="purchaseStatus" label="执行状态">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.purchaseStatus==1">待执行</div>
                                    <div v-if="scope.row.purchaseStatus==2">执行完成</div>
                                </template>
                            </el-table-column>
                            <el-table-column width="160px" show-overflow-tooltip align="center" prop="isCheckBill" label="是否整单对账完成">
                                <template slot-scope="scope">
                                    <div>
                                        {{scope.row.isCheckBill==0?"否":"是"}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column width="170px" show-overflow-tooltip align="center" prop="checkFinishTime" label="整单对账完成时间"></el-table-column>
                            <el-table-column width="130px" show-overflow-tooltip align="center" prop="verifyMonye" label="对账成本金额"></el-table-column>
                            <el-table-column width="130px" show-overflow-tooltip align="center" prop="settlementMoney" label="拆单成本金额"></el-table-column>
                            <el-table-column width="130px" show-overflow-tooltip align="center" prop="asAmount" label="加减收"></el-table-column>
                            <el-table-column width="130px" show-overflow-tooltip align="center" prop="additionalAsAmount" label="额外加减收"></el-table-column>
                            <el-table-column width="130px" show-overflow-tooltip align="center" prop="contractSerialNumber" label="客户合同号">
                                <template slot-scope="scope">
                                    <div>
                                        <p class="table_action_span" @click="goToCustomerContract(scope.row)">{{scope.row.contractSerialNumber}}</p>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column width="230px" show-overflow-tooltip align="center" prop="purchaseContractCode" label="采购合同号"></el-table-column>
                            <el-table-column width="230px" show-overflow-tooltip align="center" prop="orderNumber" label="订单号">
                                <template slot-scope="scope">
                                    <div>
                                        <p class="table_action_span" @click="goToOrder(scope.row)">{{scope.row.orderNumber}}</p>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="orderTypeName" label="订单类型"></el-table-column>
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="storeName" label="所属门店"></el-table-column>
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="companyName" label="供应商"></el-table-column>
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="createOrderTime" label="下单完成时间"></el-table-column>
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="createOrderAt" label="下单人"></el-table-column>
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="splitOrderTime" label="拆单完成时间"></el-table-column>
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="splitOrderAt" label="拆单人"></el-table-column>
                            <el-table-column width="130px" show-overflow-tooltip align="center" prop="userName" label="对账人"></el-table-column>
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="accountsTime" label="对账完成时间"></el-table-column>
                            <!-- <el-table-column width="180px" show-overflow-tooltip align="center" prop="createTime" label="提交结算时间"></el-table-column> -->
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="settlementTime" label="结算完成时间"></el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="对账明细">
                    <div class="simTable table_list unsortable">
                        <el-table v-loading="tabLoading" class="m-top20" :data="tableData" border :row-class-name="tableRowClassName">
                            <el-table-column width="250px" show-overflow-tooltip align="center" prop="purchaseNumber" label="采购单号">
                                <template slot-scope="scope">
                                    <div>
                                        <p class="table_action_span" @click="goToPurchase(scope.row)">{{scope.row.purchaseNumber}}</p>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column width="100px" show-overflow-tooltip align="center" prop="status" label="结算单状态">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.status==2">对账完成</div>
                                    <div v-if="scope.row.status==3">结算中</div>
                                    <div v-if="scope.row.status==4">结算完成</div>
                                </template>
                            </el-table-column>
                            <el-table-column width="100px" show-overflow-tooltip align="center" prop="purchaseStatus" label="执行状态">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.purchaseStatus==1">待执行</div>
                                    <div v-if="scope.row.purchaseStatus==2">执行完成</div>
                                </template>
                            </el-table-column>
                            <el-table-column width="160px" show-overflow-tooltip align="center" prop="isCheckBill" label="是否整单对账完成">
                                <template slot-scope="scope">
                                    <div>
                                        {{scope.row.isCheckBill==0?"否":"是"}}
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column width="170px" show-overflow-tooltip align="center" prop="checkFinishTime" label="整单对账完成时间"></el-table-column>
                            <el-table-column width="130px" show-overflow-tooltip align="center" prop="verifyMonye" label="对账成本金额"></el-table-column>
                            <el-table-column width="130px" show-overflow-tooltip align="center" prop="settlementMoney" label="拆单成本金额"></el-table-column>
                            <el-table-column width="130px" show-overflow-tooltip align="center" prop="asAmount" label="加减收"></el-table-column>
                            <el-table-column width="130px" show-overflow-tooltip align="center" prop="additionalAsAmount" label="额外加减收"></el-table-column>
                            <el-table-column width="130px" show-overflow-tooltip align="center" prop="contractSerialNumber" label="客户合同号">
                                <template slot-scope="scope">
                                    <div>
                                        <p class="table_action_span" @click="goToCustomerContract(scope.row)">{{scope.row.contractSerialNumber}}</p>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column width="230px" show-overflow-tooltip align="center" prop="purchaseContractCode" label="采购合同号"></el-table-column>
                            <el-table-column width="230px" show-overflow-tooltip align="center" prop="orderNumber" label="订单号">
                                <template slot-scope="scope">
                                    <div>
                                        <p class="table_action_span" @click="goToOrder(scope.row)">{{scope.row.orderNumber}}</p>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="orderTypeName" label="订单类型"></el-table-column>
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="storeName" label="所属门店"></el-table-column>
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="companyName" label="供应商"></el-table-column>
                            <!-- <el-table-column width="180px" show-overflow-tooltip align="center" prop="createOrderTime" label="下单完成时间"></el-table-column>
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="createOrderAt" label="下单人"></el-table-column> -->
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="splitOrderTime" label="拆单完成时间"></el-table-column>
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="splitOrderAt" label="拆单人"></el-table-column>
                            <el-table-column width="130px" show-overflow-tooltip align="center" prop="userName" label="对账人"></el-table-column>
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="accountsTime" label="对账完成时间"></el-table-column>
                            <!-- <el-table-column width="180px" show-overflow-tooltip align="center" prop="createTime" label="提交结算时间"></el-table-column> -->
                            <el-table-column width="180px" show-overflow-tooltip align="center" prop="settlementTime" label="结算完成时间"></el-table-column>
                        </el-table>
                    </div>
                </el-tab-pane>
            </el-tabs>
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
        <el-dialog title="整单对账完成" width="1300px" custom-class="customDialogTitle" :visible.sync="dialog2">
            <el-table max-height="300px" border :data="tableList" :row-class-name="tableRowClassName">
                <el-table-column :align="columnAlign" type="index" fixed></el-table-column>
                <el-table-column prop="accountsStatus" label="是否采购单对账完成" :align="columnAlign" sortable width="180">
                    <template slot-scope="scope">
                        <span v-if="scope.row.accountsStatus == 1">对账中</span>
                        <span v-else-if="scope.row.accountsStatus >= 2">对账完成</span>
                        <span v-else>未对账</span>
                    </template>
                </el-table-column>
                <el-table-column prop="purchaseNumber" label="采购单号" :align="columnAlign" width="180" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="settlementMoney" label="对账金额" :align="columnAlign" width="150" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.settlementMoney?scope.row.settlementMoney:"0.00"}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="earning" label="加减收金额" :align="columnAlign" width="130" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.earning?scope.row.earning:"0.00"}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="extraEarning" label="额外加减收金额" :align="columnAlign" width="150" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.extraEarning?scope.row.extraEarning:"0.00"}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="checkBillAt" label="对账人" :align="columnAlign" width="110" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="checkBillTime" label="对账完成时间" :align="columnAlign" width="170" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="purchaseContractCode" label="采购合同号" :align="columnAlign" width="150" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="companyName" label="供应商" :align="columnAlign" width="220" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="contractMoney" label="订单合同金额" :align="columnAlign" width="150" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.contractMoney?scope.row.contractMoney:"0.00"}}
                        </div>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="name" label="签合同订单成本金额" :align="columnAlign" width="180" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.contractMoney?scope.row.contractMoney:"0.00"}}
                        </div>
                    </template>
                </el-table-column> -->
                <el-table-column prop="purchaseContractMoney" label="采购单合同金额" :align="columnAlign" width="150" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.purchaseContractMoney?scope.row.purchaseContractMoney:"0.00"}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="purchaseCost" label="签合同采购单成本金额" :align="columnAlign" width="190" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.purchaseCost?scope.row.purchaseCost:"0.00"}}
                        </div>
                    </template>
                </el-table-column>
                
                <el-table-column prop="supplierCostMoney" label="供货商成本" :align="columnAlign" width="130" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.supplierCostMoney?scope.row.supplierCostMoney:"0.00"}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="actualSettlementMoney" label="实际结算金额" :align="columnAlign" width="130" sortable show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.actualSettlementMoney?scope.row.actualSettlementMoney:"0.00"}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="purchaseAt" label="下单人" :align="columnAlign" width="110" sortable show-overflow-tooltip></el-table-column>
                <el-table-column prop="purchaseTime" label="下单完成时间" :align="columnAlign" width="170" sortable show-overflow-tooltip></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createComfirm">确 定</el-button>
                <el-button @click="dialog2 = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import spot from '@/assets/images/spot.png';
import breadcrumb from "@/views/components/breadcrumb";
import pagination from '@/views/components/pagination';
import { editReconciliationComplete, listPurchaseOrder, importPurchaseOrderBatch, listPurchaseOrderDataVO, savePurchasingSettlement, listPurchaseOrderBatch, listPurchaseOrderBatchData, addPurchasingBatch, editPurchaseOrder } from '@/api/administrationCenter/purchaseOrderAccountCheck/index';
import { listCompanyByAll, listCategory, listBrand, listBaseDict, listCompanyByParam, getUUID } from '@/api/pulicJava';
import { put } from '@/utils/pubilcFn';
import module from '../../../../config/index';
import { getToken } from '@/utils/auth';
export default {
    name: "purchaseOrderAccountCheck",
    components:{
        breadcrumb,
        pagination
    },
    data(){
        return {
            spot,
            navList:[],
            data:[],
            rowsData:[],
            costMonth:'',
            dialog:false,
            visible:false,
            orderBatch:false,
            formList:{
                orderGroup:null,
                status:null,
                page:1,
                limit:10,
                isCheckBill:null,
                startDate:null,
                endDate:null,
                checkFinishStartTime:null,
                checkFinishEndTime:null,
                companyId:null,
                categoryId:null,
                brandId:null,
                dataType:1
            },
            isShow:false,
            date:[],
            date2:[],
            dialogTable:[
            ],
            tableData:[],
            total:10,
            listCompanyArr:[],
            companyId:'',
            dialogParams:{
                page:1,
                limit:10,
            },
            dialogTabTotal:0,
            dialog2:false,
            purchaseOrderData:[],
            purchaseOrderBatchId:"",
            btnJurisdiction:{
                import:false,
                create:false,
                view:false,
                hasBeenSettled:false
            },
            batchNumber:'',
            tabLoading:false,
            columnAlign:"center",
            tableList:[],
            searchLoading:false,
            resetLoading:false,
            listCategoryArr:[],
            listBrandArr:[],
            listCompanyByAllArr:[]
        }
    },
    mounted() {
    // 头部面包屑
        var now = new Date(); //当前日期
        var nowMonth = now.getMonth(); //当前月
        var nowYear = now.getFullYear(); //当前年
        var monthStartDate = new Date(nowYear, nowMonth, 1);
        var monthEndDate = new Date(nowYear, nowMonth + 1, 0);
        this.date = [
            monthStartDate.getFullYear() + '-' + Number(monthStartDate.getMonth() + 1) + '-' + monthStartDate.getDate(),
            monthEndDate.getFullYear() + '-' + Number(monthEndDate.getMonth() + 1) + '-' + monthEndDate.getDate()
        ];
        this.btnInit()
        this.navList = this.$route.meta;
        listCompanyByAll(
            {
                companyType:1
            }
        ).then(res=>{
            this.listCompanyArr=res.data;
        })
        //品类接口
        listCategory().then(res=>{
            this.listCategoryArr=res.data;
        })
        //品牌接口
        listBrand().then(res=>{
            this.listBrandArr=res.data;
        })
        this.pages()
    },
    methods: {
        tabClick(val){
            this.tableData=[];
            this.total=0;
            this.formList.page=1;
            this.rowsData=[];
            if(val.index==0){
                this.formList.dataType=1;
            }else if(val.index==1){
                this.formList.dataType=4;
                
            }else if(val.index==2){
                this.formList.dataType=2;
            }else{
                this.formList.dataType=3;
            }
            this.pages()
        },
        //已结算
        hasBeenSettled(){
            if(this.rowsData.length){
                let arr=[]
                this.rowsData.map((item,idx)=>{
                    arr.push(item.purchaseOrderDataId)
                })
                editPurchaseOrder({
                    purchaseOrderIds:arr
                }).then(res=>{
                    this.pages()
                    this.$message.success("操作成功")
                })
            }else{
                this.$message.warning("请选择")
            }
            
        },
        hideSearch(){
            this.isShow=!this.isShow;
        },
        changeBrandOrCate(){
            this.formList.companyId=null;
            this.listCompanyByAllArr=[];
            if(this.formList.brandId&&this.formList.categoryId){
                this.listCompanyByParam()
            }
        },
        listCompanyByParam(val){
             //供应商接口 0 是正常的 1是供应商
            this.formList.companyId=null;
            listCompanyByParam({
                companyType: 1,
                brandId:this.formList.brandId,
                commodityCategoryId:this.formList.categoryId,
            }).then(res=>{
                this.listCompanyByAllArr=res.data;
            })
        },
        exportExcel(){
            let obj=Object.assign({},this.formList)
            for(let i in obj){
                if(!obj[i]){
                    obj[i]="";
                }
            }
            let Url=module.dev.proxyTable['/api'].target+`/api/pc/purchasingOrder/exportPurchaseOrderDataVO?${obj.orderGroup?"orderGroup=":''}${obj.orderGroup}${obj.status?'&status=':''}${obj.status}${obj.isCheckBill?"&isCheckBill=":""}${obj.isCheckBill}${obj.startDate?"&startDate=":""}${obj.startDate}${obj.endDate?"&endDate=":""}${obj.endDate}${obj.checkFinishStartTime?"&checkFinishStartTime=":""}${obj.checkFinishStartTime}${obj.checkFinishEndTime?"&checkFinishEndTime=":""}${obj.checkFinishEndTime}${obj.companyId?"&companyId=":""}${obj.companyId}${obj.categoryId?"&categoryId=":""}${obj.categoryId}${obj.brandId?"&brandId=":""}${obj.brandId}&token=${getToken()}`;
            window.location.href=Url;
        },
        createComfirm(){
            let flag=this.tableList.every((item,idx)=>{
                return item.accountsStatus>=2
            })
            if(flag){
                editReconciliationComplete({
                    customerContractId:Number(this.customerContractId)
                }).then(res=>{
                    this.pages()
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    this.dialog2=false;
                })
            }else{
                this.$message({
                    message: '有对账中的不可操作',
                    type: 'warning'
                });
            }
        },
        showDialog(val){
            if(val.isCheckBill==0){
                this.customerContractId=val.customerContractId;
                this.dialogPages()
            }else{
                this.$message({
                    message: '已整单完成对账，不可再进行整单完成对账操作',
                    type: 'warning'
                });
            }
            
        },
        orderCompleted(){
            if(this.rowsData.length){
                if(this.rowsData.length==1){
                    if(this.rowsData[0].isCheckBill==0){
                        this.customerContractId=this.rowsData[0].customerContractId;
                        this.dialogPages()
                    }else{
                        this.$message({
                            message: '已整单完成对账，不可再进行整单完成对账操作',
                            type: 'warning'
                        });
                    }
                }else{
                    this.$message({
                        message: '只可选择一条',
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
        reset(){
            this.formList.page=1;
            this.formList.orderGroup='';
            this.formList.status='';
            this.formList.startDate='';
            this.formList.endDate='';
            this.formList.checkFinishStartTime='';
            this.formList.checkFinishEndTime='';
            this.formList.isCheckBill=null;
            this.formList.companyId='';
            this.formList.categoryId='';
            this.formList.brandId='';
            this.date=[];
            this.date2=[];
            this.resetLoading=true;
            this.pages()
        },
        goToCustomerContract(val){
            if(val.customerContractId&&val.orderId){
                this.$router.push({
                    path: '/contractmanagement/contractView',
                    query: {
                        contractId: val.customerContractId,
                        orderId: val.orderId
                    }
                })
            }else{
                this.$message({
                    message: '合同与订单没有匹配上',
                    type: 'warning'
                });
            }
        },
        goToPurchase(val){
            if(val.customerContractId&&val.orderId){
                this.$router.push({
                    path:"needDispose",
                    query:{
                        contractId:val.customerContractId,
                        orderId:val.orderId,
                        purchaseOrderBatchDataId:val.purchaseOrderBatchDataId,
                        onlyReady:1
                    }
                })
            }else{
                this.$message({
                    message: '合同与订单没有匹配上',
                    type: 'warning'
                });
            }
        },
        goToOrder(val){
            this.$router.push({
                path:'/ordermm/details',
                query:{
                    orderId:val.orderId
                }
            })
        },
        createPurchaseOrderBatch(){
            this.orderBatch=true;
        },
        btnInit(){
            this.btnJurisdiction.import=JSON.parse(this.$loca.getItem('element'))["purchaseOrderAccountCheck:btn_import"];
            this.btnJurisdiction.create=JSON.parse(this.$loca.getItem('element'))["purchaseOrderAccountCheck:btn_create"];
            this.btnJurisdiction.view=JSON.parse(this.$loca.getItem('element'))["purchaseOrderAccountCheck:btn_view"];
            this.btnJurisdiction.hasBeenSettled=JSON.parse(this.$loca.getItem('element'))["purchaseOrderAccountCheck:hasBeenSettled"];
        },
        uploadSectionFile(val){
            put(val).then(res =>{
                this.postFile(val,res);
            })
        },
        postFile(val,res){
            var formData = new FormData();
            formData.append("sourceName",val.file.name);
            formData.append("targetName", res.name);
            formData.append("fileUrl", res.url); 
            formData.append("file", val.file);
            importPurchaseOrderBatch(formData).then(res=>{
                this.$message({
                    message: '导入成功',
                    type: 'success'
                });
                this.purchaseOrderBatchId=res.data.purchaseOrderBatchId;
            })
        },
        lookAt(val){
            this.purchaseOrderBatchId=val.purchaseOrderBatchId;
            listPurchaseOrderBatchData({
                page:1,
                limit:10,
                purchaseOrderBatchId:val.purchaseOrderBatchId
            }).then(res=>{
                this.purchaseOrderData=res.data.rows;
                this.dialog2=true
            })
        },
        dialogPages(){
            listPurchaseOrder({
                customerContractId:this.customerContractId,
            }).then(res=>{
                this.dialog2=true;
                this.tableList=res.data
            })
        },
        search(){
            this.formList.page=1;
            this.searchLoading=true;
            this.pages()
        },
        pages(){
            if(this.date==null){
                this.date=[];
            }
            if(this.date2==null){
                this.date2=[];
            }
            this.formList.startDate=this.date[0];
            this.formList.endDate=this.date[1];
            this.formList.checkFinishStartTime=this.date2[0];
            this.formList.checkFinishEndTime=this.date2[1];
            this.tabLoading=true;
            listPurchaseOrderDataVO(this.formList).then(res=>{
                res.data.rows.map((item,idx)=>{
                    if(!item.settlementMoney){
                        item.settlementMoney=0;
                    }
                    if(!item.asAmount){
                        item.asAmount=0;
                    }
                    if(!item.additionalAsAmount){
                        item.additionalAsAmount=0;
                    }
                    if(!item.verifyMonye){
                        item.verifyMonye=0;
                    }
                })
                this.tableData=res.data.rows;
                this.total=res.data.total;
                this.tabLoading=false;
                this.searchLoading=false;
                this.resetLoading=false;
            }).catch(err=>{
                console.log(err);
                this.tabLoading=false;
                this.resetLoading=false;
                this.searchLoading=false;
            })
        },
        tableRowClassName({ row, rowIndex }) {
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        selectChange(val){
            this.rowsData=val;
        },
        toLead(){
            this.$router.push({
                path:'importStatement'
            })
        },
        sizeChange(val){
            this.formList.page=1;
            this.formList.limit=val;
            this.pages()
        },
        currentChange(val){
            this.formList.page=val;
            this.pages()
        }
    },
}
</script>

<style lang="scss">
.purchaseOrderAccountCheck{
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
