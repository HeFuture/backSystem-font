<template>
    <bread_crumb ref="breadcrumb" :item="item"></bread_crumb>
    <!-- 外壳 -->
    <div class="table-warpped">
        <!-- 头部 -->
        <div class="table-top">
            <div class="table-header">
                <div class="search-wrapped">
                    <el-input v-model="productOutId" style="width: 240px" placeholder="输入出库编号进行搜索..."
                        :prefix-icon="Search" @input="searchProductOutId" />
                </div>
            </div>
            <div class="table-content">
                <el-table :data="tableData" border style="width: 100%" stripe>
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column prop="product_out_id" label="出库编号" width="200" />
                    <el-table-column prop="product_out_number" label="出库数量" width="160" />
                    <el-table-column prop="product_out_price" label="申请出库总价" width="160" />
                    <el-table-column prop="product_out_apply_person" label="出库申请人" width="180" />
                    <el-table-column prop="product_apply_time" label="申请出库时间" width="180">
                        <template #default="{ row }">
                            <div>{{ row.product_apply_time?.slice(0, 10) }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="product_out_audit_person" label="审核人" width="180" />
                    <el-table-column prop="product_audit_time" label="审核时间" width="180">
                        <template #default="{ row }">
                            <div>{{ row.product_audit_time?.slice(0, 10) }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="audit_memo" label="审核备注" />
                </el-table>
            </div>
        </div>
        <!-- 底部 -->
        <div class="table-footer">
            <el-pagination :page-size="1" v-model:current-page="pageinationData.currentpage" :total="outProductTotal"
                layout="prev, pager, next" :page-count="pageinationData.pageCont" @current-change="currentChange" />
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref, reactive } from 'vue';
import bread_crumb from '@/components/bread_crumb.vue';
import { Search } from '@element-plus/icons-vue';
import { searchProductForOutId, returnoutProductListData, getOutProductLength } from '@/api/product'

// 面包屑
const breadcrumb = ref()
// 将面包屑值传递给 bread_crumb 组件
const item = ref({
    first: '产品管理',
    second: '出库列表'
})

// 出库编号
const productOutId = ref()
// 出库表格
const tableData = ref()

// 分页数据
const pageinationData = reactive({
    // 总页数
    pageCont: 0,
    // 当前所处页数
    currentpage: 1
})
// 存储管理员数量
const outProductTotal = ref<number>(0)
// 获取对应身份的总人数 identity
const getOutProListlength = async () => {
    const res = await getOutProductLength()
    outProductTotal.value = res.data.length
    // Math.ceil “向上取整”， 即小数部分直接舍去，并向正数部分进1
    pageinationData.pageCont = Math.ceil(res.data.length / 10)
}
getOutProListlength()

// 默认获取第一页的数据
const getFirstPageList = async () => {
    const res = await returnoutProductListData(1)
    tableData.value = res.data
}
getFirstPageList()

// 监听换页
const currentChange = async (value: number) => {
    pageinationData.currentpage = value
    const res = await returnoutProductListData(value)
    tableData.value = res.data
}


// 通过入库编号搜索产品  防抖处理
let timer = null; // 使用 let 而不是 var，以便在函数内部正确更新变量 
const searchProductOutId = async () => {
    // 清除之前的定时器（如果存在）  
    if (timer !== null) {
        clearTimeout(timer);
    }
    // 检查 productOutId 的值 看用户是否输入入库编号
    if (productOutId.value == null || productOutId.value.trim() === '') {
        // 如果 productOutId 为空或 null，则直接调用 getFirstPageList 获取产品列表
        getFirstPageList()
        getOutProListlength()
    } else {
        // 否则，设置一个新的定时器 
        timer = setTimeout(async () => {
            const res = await searchProductForOutId(productOutId.value, pageinationData.currentpage)
            tableData.value = res.data
            pageinationData.pageCont = Math.ceil(res.data.length / 10)
            // console.log(pageinationData.pageCont);
        }, 400); // 400 毫秒后执行
    }
}
</script>

<style scoped lang="scss">
.table-warpped {
    padding: 8px;
    background: #f5f5f5;
    // height: calc(100vh  -  101px);
    height: calc(100vh - 85px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .table-top {
        padding: 0 40px;
        display: flex;
        flex-direction: column;
        height: calc(100vh - 166px);
        background: #fff;

        .table-header {
            padding: 12px 20px 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 54px;
            background-color: #fff;
        }

        .table-content {
            min-height: 10px;
            padding: 10px 20px 20px;
            margin-bottom: 8px;
            background: #fff;
        }
    }

    .table-footer {
        padding: 26px 40px 8px;
        min-height: 10px;
        display: flex;
        justify-content: right;
        background: #fff;
    }
}

:deep(.el-table__row) {
    height: 48.8px;
}

:deep(.el-table .cell) {
    font-weight: 400;
}
</style>