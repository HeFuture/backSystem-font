<template>
    <bread_crumb ref="breadcrumb" :item="item"></bread_crumb>
    <!-- wrapper -->
    <div class="module-common-wrapped">
        <div class="module-common-content">
            <el-tabs v-model="activeName" class="demo-tabs">
                <el-tab-pane label="产品列表" name="first">
                    <div class="pane-content">
                        <!-- 头部 -->
                        <div class="pane-top">
                            <div class="module-common-header">
                                <div class="search-wrapped">
                                    <el-input v-model="productId" style="width: 240px" placeholder="输入入库编号进行搜索..."
                                        :prefix-icon="Search" @input="searchProduct" />
                                </div>
                                <div class="button-wrapped">
                                    <el-button type="primary" @click="productInWareHouse">产品入库</el-button>
                                </div>
                            </div>
                            <!-- 表格 -->
                            <div class="module-common-table">
                                <el-table :data="tableData" border style="width: 100%">
                                    <el-table-column type="index" width="50"></el-table-column>
                                    <el-table-column prop="product_id" label="入库编号" width="200" />
                                    <el-table-column prop="product_name" label="产品名称" width="160" />
                                    <el-table-column prop="product_category" label="产品类别" width="100" />
                                    <el-table-column prop="product_unit" label="单位" />
                                    <el-table-column prop="product_inwarehouse_number" label="库存数量" width="100" />
                                    <el-table-column prop="product_single_price" label="产品单价" width="140" />
                                    <el-table-column prop="product_all_price" label="库存总价" width="140" />
                                    <el-table-column prop="product_status" label="库存状态" width="100">
                                        <template #default="{ row }">
                                            <el-tag type="danger"
                                                v-if="row.product_inwarehouse_number < 100">库存较少</el-tag>
                                            <el-tag type="primary"
                                                v-else-if="row.product_inwarehouse_number > 100 && row.product_inwarehouse_number < 300">库存正常</el-tag>
                                            <el-tag type="success" v-else>库存过剩</el-tag>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="product_create_person" label="入库负责人" width="100" />
                                    <el-table-column prop="product_create_time" label="入库时间" width="180">
                                        <template #default="{ row }">
                                            <div>{{ row.product_create_time?.slice(0, 10) }}</div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="product_update_time" label="最后修改时间" width="180">
                                        <template #default="{ row }">
                                            <div>{{ row.product_update_time?.slice(0, 10) }}</div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="in_memo" label="入库备注" width="200" />
                                    <el-table-column label="操作" width="300" fixed="right">
                                        <template #default="{ row }">
                                            <el-button type="primary" @click="applyOut(row)"
                                                :disabled="row.product_status == '申请出库' || row.product_inwarehouse_number == 0">申请出库</el-button>
                                            <el-button type="success" @click="editProduct(row)"
                                                :disabled="row.product_status == '申请出库'">修改</el-button>
                                            <el-button type="danger" @click="deleteProduct(row.id)"
                                                :disabled="row.product_status == '申请出库'">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                        <!-- 底部 -->
                        <div class="table-footer">
                            <el-pagination :page-size="1" v-model:current-page="pageinationData.productCurrentpage"
                                :total="pageinationData.productTotal" layout="prev, pager, next"
                                :page-count="pageinationData.productPageCont" @current-change="productCurrentChange" />
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="审核列表" name="second">
                    <div class="pane-content">
                        <!-- 头部 -->
                        <div class="pane-top">
                            <div class="module-common-header">
                                <div class="search-wrapped">
                                    <el-input v-model="productOutId" style="width: 240px" placeholder="输入申请出库编号进行搜索..."
                                        :prefix-icon="Search" @input="searchApplyProduct" />
                                </div>
                                <div class="button-wrapped">
                                </div>
                            </div>
                            <!-- 表格 -->
                            <div class="module-common-table">
                                <el-table :data="applytableData" border style="width: 100%">
                                    <el-table-column type="index" width="50"></el-table-column>
                                    <el-table-column prop="product_out_id" label="申请出库编号" width="200" />
                                    <el-table-column prop="product_name" label="产品名称" width="200" />
                                    <el-table-column prop="product_out_number" label="申请出库数量" width="180" />
                                    <el-table-column prop="product_out_price" label="申请出库总价" width="180" />
                                    <el-table-column prop="product_out_apply_person" label="申请人" width="200" />
                                    <el-table-column prop="product_apply_time" label="申请出库时间" width="200">
                                        <template #default="{ row }">
                                            <div>{{ row.product_apply_time?.slice(0, 10) }}</div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="product_out_audit_person" label="审核人" width="150" />
                                    <el-table-column prop="product_audit_time" label="审核时间" width="100">
                                        <template #default="{ row }">
                                            <div>{{ row.product_audit_time?.slice(0, 10) }}</div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="product_out_status" label="审核状态" width="100" />
                                    <el-table-column prop="apply_memo" label="申请出库备注" width="200" />
                                    <el-table-column prop="audit_memo" label="审核备注" width="200" />
                                    <el-table-column label="操作" width="300" fixed="right">
                                        <template #default="{ row }">
                                            <el-button type="primary" @click="withdrawProduct(row.id)">撤回申请</el-button>
                                            <el-button type="success" :disabled="row.product_out_status == '申请出库'"
                                                @click="AgainApply(row)">再次申请</el-button>
                                            <el-button type="danger" @click="auditProduct(row)">审核</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                        <!-- 底部 -->
                        <div class="table-footer">
                            <el-pagination :page-size="1" v-model:current-page="pageinationData.applyproductCurrentpage"
                                :total="pageinationData.applyProductTotal" layout="prev, pager, next"
                                :page-count="pageinationData.applyProductCont"
                                @current-change="applyProductCurrentChange" />
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
    <!-- 入库操作影响产品列表 -->
    <inwarehouse ref="inware" @success="changeTwoPageList"></inwarehouse>
    <!-- 申请出库操作影响产品列表 -->
    <apply ref="applyp" @success="changeTwoPageList"></apply>
    <!-- 编辑操作影响产品列表 -->
    <edit_product ref="editp" @success="getFirstPageList"></edit_product>
    <!-- 删除操作影响产品列表 -->
    <delete_product ref="deleteP" @success="changeTwoPageList"></delete_product>
    <!-- 更新产品列表及申请列表的第一页数据 -->
    <audit ref="auditP" @success="changeTwoPageList"></audit>
    <!-- 撤回操作后更新产品列表和申请产品列表 -->
    <withDraw ref="withdrawP" @success="changeTwoPageList"></withDraw>
    <!-- 再次申请后，影响审核列表 -->
    <again_apply ref="againP" @success="getApplyFirstPageList"></again_apply>
</template>

<script setup lang="ts">

import { ref, reactive } from 'vue';
import bread_crumb from '@/components/bread_crumb.vue';
import { Search } from '@element-plus/icons-vue';
import inwarehouse from './components/product_in_wareHouse.vue';
import apply from './components/apply.vue';
import edit_product from './components/edit_product.vue';
import delete_product from './components/delete_product.vue';
import withDraw from './components/withDraw.vue';
import again_apply from './components/again_apply.vue';
import { getProductList, searchProductForId, searchProductForApplyId, applyProductList, getProductLength, getApplyProductLength, returnProductListData, returnApplyProductListData } from '@/api/product'
import { bus } from '@/utils/mitt';
import audit from './components/audit.vue';

// 面包屑
const breadcrumb = ref()
// 将面包屑值传递给 bread_crumb 组件
const item = ref({
    first: '产品管理',
    second: '产品列表'
})

// Tabs 标签页默认打开项
const activeName = ref('first')

// 产品入库编号
const productId = ref()
// 产品入库表格绑定参数
const tableData = ref()


// 产品申请出库编号
const productOutId = ref()
// 产品申请出库表格绑定参数
const applytableData = ref()

// 分页数据
const pageinationData = reactive({
    // 产品总数
    productTotal: 1,
    // 产品列表总页数
    productPageCont: 0,
    // 产品列表当前所处页数
    productCurrentpage: 1,

    // 申请的总数
    applyProductTotal: 1,
    // 申请列表总页数
    applyProductCont: 0,
    // 申请列表当前所处页数
    applyproductCurrentpage: 1,
})

// 获取产品列表的页数
const getProductListlength = async () => {
    const res = await getProductLength()
    pageinationData.productTotal = res.data.length
    // Math.ceil “向上取整”， 即小数部分直接舍去，并向正数部分进1
    pageinationData.productPageCont = Math.ceil(res.data.length / 10)
}
getProductListlength()

// 获取申请列表的页数
const getApplyProductListlength = async () => {
    const res = await getApplyProductLength()
    pageinationData.applyProductTotal = res.data.length
    // Math.ceil “向上取整”， 即小数部分直接舍去，并向正数部分进1
    pageinationData.applyProductCont = Math.ceil(res.data.length / 10)
}
getApplyProductListlength()

// 默认获取产品列表第一页的数据
const getFirstPageList = async () => {
    const res = await returnProductListData(1)
    tableData.value = res.data
}
getFirstPageList()

// 默认获取申请列表第一页的数据
const getApplyFirstPageList = async () => {
    const res = await returnApplyProductListData(1)
    applytableData.value = res.data
}
getApplyFirstPageList()

// 更新产品列表及申请列表的第一页数据
const changeTwoPageList = async () => {
    const res = await returnProductListData(pageinationData.productCurrentpage)
    tableData.value = res.data
    getProductListlength()

    const res2 = await returnApplyProductListData(pageinationData.applyproductCurrentpage)
    applytableData.value = res2.data
    getApplyProductListlength()
}

// 产品列表监听换页
const productCurrentChange = async (value: number) => {
    pageinationData.productCurrentpage = value
    const res = await returnProductListData(value)
    tableData.value = res.data
}

// 申请列表监听换页
const applyProductCurrentChange = async (value: number) => {
    pageinationData.applyproductCurrentpage = value
    const res = await returnApplyProductListData(value)
    applytableData.value = res.data
}


// 绑定 product_in_wareHouse 打开产品入库弹窗
const inware = ref()
const productInWareHouse = () => {
    inware.value.open()
}

// 绑定 apply 打开产品申请出库弹窗
const applyp = ref()
const applyOut = (row: any) => {
    // 使用bus将id传递给apply子组件
    bus.emit('appllyId', row)
    applyp.value.open()
}

// 绑定 edit 打开修改产品信息弹窗
const editp = ref()
const editProduct = (row: any) => {
    // 使用bus将id传递给edit子组件
    bus.emit('editProId', row)
    editp.value.open()
}

// 绑定 delete 打开删除产品信息弹窗
const deleteP = ref()
const deleteProduct = (id: number) => {
    // 使用bus将id传递给delete子组件
    bus.emit('deleteProId', id)
    deleteP.value.open()
}

// 审核产品   打开审核弹窗
const auditP = ref()
const auditProduct = (row: any) => {
    bus.emit('auditProductInfo', row)
    auditP.value.open()
}

// 绑定 withdraw 打开编辑 产品信息弹窗
const withdrawP = ref()
const withdrawProduct = (id: number) => {
    // 使用bus将id传递给delete子组件
    bus.emit('withdrawId', id)
    withdrawP.value.open()
}

// 绑定 again_apply 组件，打开再次申请出库弹窗
const againP = ref()
const AgainApply = (row: any) => {
    bus.emit('againId', row)
    againP.value.open()
}

/* 
    // 产品总数
    productTotal: 1,
    // 产品列表总页数
    productPageCont: 0,
    // 产品列表当前所处页数
    productCurrentpage: 1,
*/

// 通过入库编号搜索产品  防抖处理
let timer = null; // 使用 let 而不是 var，以便在函数内部正确更新变量 
const searchProduct = async () => {
    // 当前页数
    // const current = pageinationData.productCurrentpage
    // 清除之前的定时器（如果存在）  
    if (timer !== null) {
        clearTimeout(timer);
    }
    // 检查 productId 的值 看用户是否输入入库编号
    if (productId.value == null || productId.value.trim() === '') {
        // 如果 productId 为空或 null，则直接调用 getProductlist 获取产品列表
        getFirstPageList()
        getProductListlength()
    } else {
        // 否则，设置一个新的定时器 
        timer = setTimeout(async () => {
            const res = await searchProductForId(productId.value, pageinationData.productCurrentpage)
            tableData.value = res.data
            pageinationData.productPageCont = Math.ceil(res.data.length / 10)
            // console.log(pageinationData.productPageCont);
            
        }, 400); // 400 毫秒后执行
    }
}

// 通过出库申请编号 进行搜索
let timer1 = null; // 使用 let 而不是 var，以便在函数内部正确更新变量 
const searchApplyProduct = async () => {
    // 清除之前的定时器（如果存在）  
    if (timer1 !== null) {
        clearTimeout(timer1);
    }
    // 检查 productOutId 的值 看用户是否输入入库编号
    if (productOutId.value == null || productOutId.value.trim() === '') {
        // 如果 productOutId 为空或 null，则直接调用 getapplyProductList 获取产品审核列表
        getApplyFirstPageList()
        getApplyProductListlength()
    } else {
        // 否则，设置一个新的定时器 
        timer1 = setTimeout(async () => {
            const res = await searchProductForApplyId(productOutId.value, pageinationData.applyproductCurrentpage)
            applytableData.value = res.data
            pageinationData.applyProductCont = Math.ceil(res.data.length / 10)
            // console.log(pageinationData.applyProductCont);
        }, 400); // 400 毫秒后执行
    }
}

</script>

<style scoped lang="scss">
:deep(.el-table .cell) {
    font-weight: 400;
}
</style>