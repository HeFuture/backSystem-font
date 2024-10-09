<template>
    <bread_crumb ref="breadcrumb" :item="item"></bread_crumb>
    <!-- wrapper -->
    <div class="module-common-wrapped">
        <div class="module-common-content">
            <el-tabs v-model="activeName" class="demo-tabs">
                <el-tab-pane label="公司公告管理" name="first">
                    <div class="pane-content">
                        <!-- 头部 -->
                        <div class="pane-top">
                            <div class="module-common-header">
                                <div class="search-wrapped">
                                    <el-select v-model="department" placeholder="请选择部门" style="width:240px"
                                        @change="getlistByDepartment" clearable @clear="clearDepartment">
                                        <el-option :label="item" :value="item" v-for="item in departmentData"
                                            :key="item" />
                                    </el-select>
                                    <el-radio-group v-model="radio1" @change="getMessageListBylevel">
                                        <el-radio value="一般" size="large">一般</el-radio>
                                        <el-radio value="重要" size="large">重要</el-radio>
                                        <el-radio value="必要" size="large">必要</el-radio>
                                    </el-radio-group>
                                </div>
                                <div class="button-wrapped">
                                    <el-button type="primary" plain @click="getCompanyFirstPageList">全部公告</el-button>
                                    <el-button type="primary" @click="createMessage(1)">发布公告</el-button>
                                </div>
                            </div>
                            <!-- 表格 -->
                            <div class="module-common-table">
                                <el-table :data="companyTableData" border style="width: 100%">
                                    <el-table-column type="index" width="50"></el-table-column>
                                    <el-table-column prop="message_title" label="公告主题" width="320" />
                                    <el-table-column prop="message_category" label="类别" />
                                    <el-table-column prop="message_publish_department" label="发布部门" />
                                    <el-table-column prop="message_publish_name" label="发布人" :disabled="true" />
                                    <el-table-column prop="message_receipt_object" label="接收对象" />
                                    <el-table-column prop="message_Level" label="公告等级" />
                                    <el-table-column prop="message_create_time" label="发布时间" width="180">
                                        <template #default="{ row }">
                                            <div>{{ row.message_create_time?.slice(0, 10) }}</div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="message_update_time" label="最新编辑时间" width="180">
                                        <template #default="{ row }">
                                            <div>{{ row.message_update_time?.slice(0, 10) }}</div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="message_click_number" label="阅读人数" />
                                    <el-table-column label="操作" width="260" fixed="right">
                                        <template #default="{ row }">
                                            <el-button type="primary" @click="editMessage(row)">编辑公告</el-button>
                                            <el-button type="danger" @click="deleteMessage(row)">删除公告</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                        <!-- 底部 -->
                        <div class="table-footer">
                            <el-pagination :page-size="1" v-model:current-page="pageinationData.companyCurrentpage"
                                :total="pageinationData.companyTotal" layout="prev, pager, next"
                                :page-count="pageinationData.companyPageCont" @current-change="companyCurrentChange" />
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="系统消息" name="second">
                    <div class="pane-content">
                        <!-- 头部 -->
                        <div class="pane-top">
                            <div class="module-common-header">
                                <div class="search-wrapped">
                                    <el-button type="primary" @click="createMessage(2)">发布系统消息</el-button>
                                </div>
                                <div class="button-wrapped">
                                </div>
                            </div>
                            <!-- 表格 -->
                            <div class="module-common-table">
                                <el-table :data="systemTableData" border style="width: 100%">
                                    <el-table-column type="index" width="50"></el-table-column>
                                    <el-table-column prop="message_title" label="消息主题" />
                                    <el-table-column prop="message_publish_name" label="发布者" />
                                    <el-table-column prop="message_click_number" label="阅读人数" />
                                    <el-table-column prop="message_create_time" label="发布时间" width="180">
                                        <template #default="{ row }">
                                            <div>{{ row.message_create_time?.slice(0, 10) }}</div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="300" fixed="right">
                                        <template #default="{ row }">
                                            <el-button type="primary" @click="editSystemMessage(row)">编辑公告</el-button>
                                            <el-button type="danger" @click="deleteMessage(row)">删除公告</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                        <!-- 底部 -->
                        <div class="table-footer">
                            <el-pagination :page-size="1" v-model:current-page="pageinationData.systemCurrentpage"
                                :total="pageinationData.systemTotal" layout="prev, pager, next"
                                :page-count="pageinationData.systemCount" @current-change="systemCurrentChange" />
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
    <createEdit ref="cre" @success="changeTwoPageList"></createEdit>
    <Delete ref="deleteM" @success="changeTwoPageList"></Delete>
</template>

<script setup lang="ts">

import { ref, reactive } from 'vue';
import bread_crumb from '@/components/bread_crumb.vue';
import { bus } from '@/utils/mitt';
import createEdit from '../components/create.vue';
import Delete from '../components/delete.vue';
import { companyMessageList, systemMessageList, searchMessageByDepartment, searchMessageByLevel, getCompanyMessageLength, getSystemMessageLength, returnCompanyListData, returnSystemListData } from '@/api/message'
import { getDepartment } from '@/api/setting'

// 面包屑
const breadcrumb = ref()
// 将面包屑值传递给 bread_crumb 组件
const item = ref({
    first: '消息管理',
    second: '消息列表'
})

// Tabs 标签页默认打开项
const activeName = ref('first')

const department = ref()
// 下拉框，根据部门进行筛选
const departmentData = ref([])
// 获取部门,从setting里设置的部门
const getdepartment = async () => {
    const res = await getDepartment()
    // JSON.parse 反序列化数据 
    departmentData.value = JSON.parse(res.data[0].set_value)
    // console.log(departmentData.value);
    // {0: '总裁办', 1: '组织部'}
}
getdepartment()

// 根据部门进行筛选
const getlistByDepartment = async () => {
    if (department.value) {
        const res = await searchMessageByDepartment(department.value)
        companyTableData.value = res.data
    }
}

// 清空选择框后，重新获取公告列表
const clearDepartment = async () => {
    await getCompanyFirstPageList()
}

// 单选框选择 消息等级
const radio1 = ref()
// 根据等级进行筛选
const getMessageListBylevel = async () => {
    const res = await searchMessageByLevel(radio1.value)
    companyTableData.value = res.data
    getCompanyListlength()
    getSystemListlength()
}

// 公司公告管理
const companyTableData = ref([
    { id: 1 }
])

// 系统消息
const systemTableData = ref()

// 分页数据
const pageinationData = reactive({
    // 公司公告总数
    companyTotal: 1,
    // 公司公告列表总页数
    companyPageCont: 0,
    // 公司公告列表当前所处页数
    companyCurrentpage: 1,

    // 系统消息的总数
    systemTotal: 1,
    // 系统消息列表总页数
    systemCount: 0,
    // 系统消息列表当前所处页数
    systemCurrentpage: 1,
})
// 获取公司公告的页数
const getCompanyListlength = async () => {
    const res = await getCompanyMessageLength()
    pageinationData.companyTotal = res.data.length
    // Math.ceil “向上取整”， 即小数部分直接舍去，并向正数部分进1
    pageinationData.companyPageCont = Math.ceil(res.data.length / 10)
}
getCompanyListlength()

// 获取系统消息的页数
const getSystemListlength = async () => {
    const res = await getSystemMessageLength()
    pageinationData.systemTotal = res.data.length
    // Math.ceil “向上取整”， 即小数部分直接舍去，并向正数部分进1
    pageinationData.systemCount = Math.ceil(res.data.length / 10)
}
getSystemListlength()

// 默认获取公司公告第一页的数据
const getCompanyFirstPageList = async () => {
    const res = await returnCompanyListData(1)
    companyTableData.value = res.data
    // 清除单选框
    radio1.value = ''
}
getCompanyFirstPageList()

// 默认获取系统消息第一页的数据
const getSystemFirstPageList = async () => {
    const res = await returnSystemListData(1)
    systemTableData.value = res.data
}
getSystemFirstPageList()

// 公司公告列表及系统消息的第一页数据
const changeTwoPageList = async () => {
    // 公司公告列表
    const res = await returnCompanyListData(pageinationData.companyCurrentpage)
    companyTableData.value = res.data
    getCompanyListlength()
    // 系统消息列表
    const res2 = await returnSystemListData(pageinationData.systemCurrentpage)
    systemTableData.value = res2.data
    getSystemListlength()
}

// 公司公告列表监听换页
const companyCurrentChange = async (value: number) => {
    pageinationData.companyCurrentpage = value
    const res = await returnCompanyListData(value)
    companyTableData.value = res.data
}

// 系统消息列表监听换页
const systemCurrentChange = async (value: number) => {
    pageinationData.systemCurrentpage = value
    const res = await returnSystemListData(value)
    systemTableData.value = res.data
}




// 发布公告弹窗
const cre = ref()
const createMessage = (id: number) => {
    bus.emit('createMessage', id)
    cre.value.open()
}

// 编辑弹窗
const editMessage = (row: any) => {
    bus.emit('editMessage', row)
    cre.value.open()
}

// 编辑系统消息弹窗
const editSystemMessage = (row: any) => {
    bus.emit('editSystemMessage', row)
    cre.value.open()
}

// 删除弹窗
const deleteM = ref()
const deleteMessage = (row: any) => {
    bus.emit('deleteMessageId', row)
    deleteM.value.open()
}
</script>

<style scoped lang="scss">
:deep(.el-table .cell) {
    font-weight: 400;
}
</style>