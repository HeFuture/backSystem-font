<template>
    <div>
        <el-dialog v-model="dialogFormVisible" :title="title" width="600" center :draggable="true">
            <span v-if="title == '删除消息'">您确定是要删除这个公告吗？</span>
            <span v-else-if="title == '恢复消息'">请慎重操作，是否恢复公告？</span>
            <span v-else>请慎重操作，是否从回收站删除公告？该操作无法撤回</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="operationMessage">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">

import { ref, onBeforeUnmount } from 'vue'
// 兄弟组件传值之mitt
import { bus } from "@/utils/mitt"
import { fisrtDelete, recover, deleteMessage } from '@/api/message'
import { ElMessage } from 'element-plus';
import { changeUserReadListButDelete, changeUserReadList } from '@/api/dep_msg'
import { UseMessage } from '@/store/message'

const msgStore = UseMessage()

// 控制弹窗开关
const dialogFormVisible = ref(false)
// 打开修改密码弹窗
const open = () => {
    dialogFormVisible.value = true
}

// 将方法传递给父组件
defineExpose({
    open
})

const title = ref()
const department = ref()
// 获得父组件的 row 用户信息
const MeaageId = ref()
bus.on('deleteMessageId', (row: any) => {
    title.value = '删除消息'
    MeaageId.value = row.id
    department.value = row.message_receipt_object
})
bus.on('renewID', (row: any) => {
    title.value = '恢复消息'
    MeaageId.value = row.id
    department.value = row.message_receipt_object
})
bus.on('realDelete', (id: number) => {
    title.value = '真正删除消息'
    MeaageId.value = id
})


// 接收父组件传递的方法
const emit = defineEmits(['success'])

// 删除产品信息
const operationMessage = async () => {
    if (title.value == '删除消息') {
        const res = await fisrtDelete(MeaageId.value)
        if (res.data.status == 0) {
            await changeUserReadListButDelete(department.value, MeaageId.value)
            msgStore.returnReadList(localStorage.getItem('id'))
            dialogFormVisible.value = false
            emit('success')
            ElMessage({
                message: '删除公告成功',
                type: 'success'
            })
        } else {
            ElMessage.error('删除公告失败')
            dialogFormVisible.value = false
        }
    }
    if (title.value == '恢复消息') {
        const res = await recover(MeaageId.value)
        if (res.data.status == 0) {
            await changeUserReadList(department.value, MeaageId.value)
            msgStore.returnReadList(localStorage.getItem('id'))
            dialogFormVisible.value = false
            emit('success')
            ElMessage({
                message: '恢复消息成功',
                type: 'success'
            })
        } else {
            ElMessage.error('恢复消息失败')
            dialogFormVisible.value = false
        }
    }
    if (title.value == '真正删除消息') {
        const res = await deleteMessage(MeaageId.value)
        if (res.data.status == 0) {
            dialogFormVisible.value = false
            emit('success')
            ElMessage({
                message: '删除消息成功',
                type: 'success'
            })
        } else {
            ElMessage.error('删除消息失败')
            dialogFormVisible.value = false
        }
    }
}

// 取消监听
onBeforeUnmount(() => {
    bus.all.clear()
})

</script>

<style scoped lang="scss">
.el-dialog {
    span {
        padding: 20px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        font-weight: 600;
    }
}
</style>