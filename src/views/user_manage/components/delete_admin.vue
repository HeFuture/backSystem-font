<template>
    <div>
        <el-dialog v-model="dialogFormVisible" title="删除管理员" width="600" center :draggable="true">
            <span v-if="adminId">是否去掉此用户的管理员职位？删除后此用户将重新展现在用户列表中</span>
            <span v-else>请慎重操作，删除后此用户将失去登录资格</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="deleteAdmin">删除</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">

import { ref, onBeforeUnmount } from 'vue'
// 兄弟组件传值之mitt
import { bus } from "@/utils/mitt"
import { changeIdentitytoUser, delUser } from '@/api/userInfo'
import { ElMessage } from 'element-plus';
// 操作日志记录
import { tracking } from '@/utils/operation'

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

// 获得user_Info传过来的id
const userId = ref()
const account = ref()
const name = ref()
bus.on('delUserId', (userInfor: any) => {
    userId.value = userInfor.id
    account.value = userInfor.account
    name.value = userInfor.name
})

// 获得父组件传递的 editId
const adminId = ref()
bus.on('deleteId', (id: number) => {
    adminId.value = id
})

// 接收父组件传递的方法
// const emit = defineEmits(['success'])

// 降级用户权限
const deleteAdmin = async () => {
    if (adminId.value) {
        const res = await changeIdentitytoUser(adminId.value)
        if (res.data.status == 0) {
            dialogFormVisible.value = false
            // 向user_info 传递值，通知其关闭窗口
            bus.emit('adminDialogOff', 3)
            // emit('success')
            ElMessage({
                message: '降级成功',
                type: 'success'
            })
        } else {
            ElMessage.error('降级失败')
            dialogFormVisible.value = false
        }
    }
    if (userId.value) {
        const res = await delUser(userId.value, account.value)
        if (res.data.status == 0) {
            dialogFormVisible.value = false
            // 向user_info 传递值，通知其关闭窗口
            bus.emit('offDialog', 1)
            // emit('success')
            // 操作日志记录
            await tracking('管理员', localStorage.getItem('name'),name.value,'高级')
            ElMessage({
                message: '删除成功',
                type: 'success'
            })
        } else {
            ElMessage.error('删除失败')
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