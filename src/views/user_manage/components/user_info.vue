<template>
    <el-dialog v-model="dialogUserVisible" title="用户信息" width="500" center :draggable="true">
        <el-container>
            <el-header></el-header>
            <el-container>
                <el-aside width="200px">
                    <el-avatar shape="square" :size="130" :src="userData.image_url" />
                </el-aside>
                <el-main>
                    <div>账号：{{ userData.account }}</div>
                    <div>姓名：{{ userData.name }}</div>
                    <div>性别：{{ userData.sex }}</div>
                    <div>部门：{{ userData.department }}</div>
                    <div>邮箱：{{ userData.email }}</div>
                    <div>状态：
                        <span v-if="userData.status == 0">正常</span>
                        <span v-else>冻结</span>
                    </div>
                </el-main>
            </el-container>
        </el-container>
        <el-footer>
            <span @click="openEdit(userData.id)">编辑</span>
            <span @click="openPro(userData.id)">赋权</span>
            <span @click="openDelete(userData.id)">删除用户</span>
        </el-footer>
    </el-dialog>
    <promote ref="pro"></promote>
    <edit_user ref="edit"></edit_user>
    <delete_admin ref="deleteU"></delete_admin>
</template>

<script setup lang="ts">

import { ref, reactive, onBeforeUnmount } from 'vue'
// 兄弟组件传值之mitt
import { bus } from "@/utils/mitt";
import promote from './promote.vue';
import edit_user from './edit_user.vue'
import delete_admin from './delete_admin.vue';

// 接收userList传递的row
bus.on('userId', (row: any) => {
    userData.id = row.id
    userData.image_url = row.image_url
    userData.account = row.account
    userData.name = row.name
    userData.sex = row.sex
    userData.department = row.department
    userData.email = row.email
    userData.status = row.status
})

// 绑定弹窗展示数据
const userData = reactive({
    id: 0,
    image_url: '',
    account: 0,
    name: '',
    sex: '',
    department: '',
    email: '',
    status: 0
})

// 接收promote的 offDialog 并关闭窗口
bus.on('offDialog', (id: number) => {
    if (id) {
        dialogUserVisible.value = false
    }

})

// 控制弹窗开关
const dialogUserVisible = ref(false)

// 打开修改密码弹窗
const open = () => {
    dialogUserVisible.value = true
}
// 将方法传递给父组件
defineExpose({
    open
})

// 打开promote赋权弹窗
const pro = ref()
const openPro = (id: number) => {
    bus.emit('promoteId', id)
    pro.value.open()
}

// 打开promote编辑弹窗
const edit = ref()
const openEdit = (id: number) => {
    bus.emit('editId', id)
    edit.value.open()
}

// 打开删除弹窗
const deleteU = ref()
const openDelete = (id: number) => {
    let userInfor = {
        id: id,
        account: userData.account,
        name: userData.name
    }
    // console.log(userInfor);
    // {id: 3, account: 7654321}
    bus.emit('delUserId', userInfor)
    deleteU.value.open()

}

// 取消监听
onBeforeUnmount(() => {
    bus.all.clear()
})
</script>

<style scoped lang="scss">
.el-header {
    --el-header-height: 20px;
}

.el-aside {
    padding: 10px 0 0 10px;
}

.el-main {
    --el-main-padding: 0px;
    padding: 5px 0 10px 0;
}

.el-main>div {
    --el-main-padding: 0px;
    margin-bottom: 8px;
}

.el-footer {
    display: flex;
    justify-content: flex-end;
    --el-footer-height: 28px;

    span {
        cursor: pointer;
        margin-left: 8px;
        color: #409eff;
    }
}
</style>