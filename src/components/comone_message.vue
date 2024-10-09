<template>
    <el-dialog v-model="dialog" :title="title" width="800" center>
        <el-container>
            <el-main>
                <!-- 主题 -->
                <div class="title">{{ message.message_title }}</div>
                <!-- 内容 -->
                <div class="content" v-html="message.message_content"></div>
            </el-main>
            <el-aside width="200px">
                <div class="publish-msg" v-if="title.value == '公司公告'">发布部门:{{ message.message_publish_department }}
                </div>
                <div class="publish-msg">发布人:{{ message.message_publish_name }}</div>
                <div class="publish-msg">类别:{{ message.message_category }}</div>
                <div class="publish-msg" v-if="title.value == '公司公告'">等级
                    <el-tag class="mx-1" type="success" round v-if="message.message_Level == '一般'">{{ message.message_Level
                        }}</el-tag>
                    <el-tag class="mx-1" type="primary" round v-else-if="message.message_Level == '重要'">{{
                        message.message_Level }}</el-tag>
                    <el-tag class="mx-1" type="danger" round v-else-if="message.message_Level == '必要'">{{
                        message.message_Level }}</el-tag>
                </div>
                <div class="publish-msg">发布时间:{{ message.message_create_time?.slice(0, 10) }}</div>
            </el-aside>
        </el-container>
    </el-dialog>
</template>

<script setup lang="ts">

import { ref, reactive, onBeforeUnmount } from 'vue';
import { bus } from "@/utils/mitt"

const title = ref()
// 弹窗默认为false
const dialog = ref(false)
// open改变dialog
const open = () => {
    dialog.value = true
}
// 对外暴露
defineExpose({
    open
})

bus.on('homeCompany', (row: any) => {
    title.value = '公司公告'
    message.message_title = row.message_title
    message.message_category = row.message_category
    message.message_publish_department = row.message_publish_department
    message.message_content = row.message_content
    message.message_Level = row.message_Level
    message.message_publish_name = row.message_publish_name
    message.message_create_time = row.message_create_time
})

bus.on('homeSystem', (row: any) => {
    title.value = '系统消息'
    message.message_title = row.message_title
    message.message_category = row.message_category
    message.message_publish_department = row.message_publish_department
    message.message_content = row.message_content
    message.message_Level = row.message_Level
    message.message_publish_name = row.message_publish_name
    message.message_create_time = row.message_create_time
})

interface Message {
    message_title: string,
    message_category: string,
    message_publish_department: string,
    message_content: string,
    message_Level: string,
    message_publish_name: string,
    message_create_time: string
}
const message: Message = reactive({
    message_title: '',
    message_category: '',
    message_publish_department: '',
    message_content: '',
    message_Level: '',
    message_publish_name: '',
    message_create_time: '',
})

onBeforeUnmount(() => {
    bus.all.clear()
})
</script>

<style scoped lang="scss">
.el-main {
    min-height: 500px;
    --el-main-padding: 0px;
    border-right: 1px solid #eee;

    .title {
        height: 32px;
        line-height: 32px;
        font-size: 16px;
        margin-left: 8px;
        margin-bottom: 8px;
        border-bottom: 1px solid #eee;
    }

    .content {
        text-align: center;
    }
}

.el-aside {
    padding-right: 8px;

    .publish-msg {
        height: 32px;
        line-height: 32px;
        font-size: 16px;
        margin-bottom: 8px;
        margin-left: 8px;
        border-bottom: 1px solid #eee;
    }
}
</style>