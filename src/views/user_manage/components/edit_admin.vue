<template>
    <div>
        <el-dialog v-model="dialogFormVisible" title="编辑管理员信息" width="600" align-center :draggable="true">
            <div class="dialog-content">
                <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="100px">
                    <el-form-item label="账号" prop="account">
                        <el-input v-model="formData.account" disabled />
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="formData.name" />
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <el-select v-model="formData.sex" placeholder="男">
                            <el-option label="男" value="男" />
                            <el-option label="女" value="女" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="formData.email" />
                    </el-form-item>
                    <el-form-item label="部门" prop="department">
                        <el-select v-model="formData.department" placeholder="请选择部门">
                            <el-option :label="item" :value="item" v-for="item in departmentData" :key="item" />
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 底部确认修改 -->
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="editadmin">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">

import { ref, reactive, onBeforeUnmount } from 'vue'
// 兄弟组件传值之mitt
import { bus } from "@/utils/mitt"
import { getUserInfor, editAdmin } from '@/api/userInfo'
import { ElMessage } from 'element-plus';
import { getDepartment } from '@/api/setting';

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

const departmentData = ref([])
// 获取部门数据
const getdepartment = async () => {
    const res = await getDepartment()
    // JSON.parse 反序列化数据 
    departmentData.value = JSON.parse(res.data[0].set_value)
}
getdepartment()

// 数据接口类型
interface formData {
    id?: number,
    account: number,
    name: string,
    sex: string,
    email: string,
    department: string
}
// 数据绑定
const formData: formData = reactive({
    id: null,
    account: null,
    name: '',
    sex: '',
    email: '',
    department: ''
})

// 表单校验规则
const rules = reactive({
    // 规则对象属性：
    /* 
        required：表示字段必须要校验
        min：文本长度最少多少位
        max：文本长度最多多少位
        message：错误的提示信息
        trigger：触发校验表单的时机 change -> 文本发生改变时触发校验，blur -> 失去焦点触发
    */
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
    ],
    sex: [
        { required: true, message: '请选择性别', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
    ],
    department: [
        { required: true, message: '请输入部门', trigger: 'blur' },
    ]
})


// 获得父组件传递的 editId
bus.on('editId', async (id: number) => {
    const res = await getUserInfor(id)
    formData.id = res.data.id
    formData.account = res.data.account
    formData.name = res.data.name
    formData.sex = res.data.sex
    formData.email = res.data.email
    formData.department = res.data.department
})

// 接收父组件传递的方法
// const emit = defineEmits(['success'])
// 点击确认修改
const editadmin = async () => {
    const res = await editAdmin(formData)
    if (res.data.status == 0) {
        dialogFormVisible.value = false
        // 调用父组件传递的方法，重新获取用户列表 刷新页面
        // emit('success')
        bus.emit('adminDialogOff', 2)
        ElMessage({
            message: '编辑管理员成功',
            type: 'success'
        })
    } else {
        ElMessage.error('编辑失败')
        dialogFormVisible.value = false
    }

}

// 取消监听
onBeforeUnmount(() => {
    bus.all.clear()
})
</script>

<style scoped lang="scss">
.dialog-content {
    display: flex;
    padding: 20px 40px;

    .el-form {
        padding-left: 25px;

        .el-form-item {
            margin: 30px;
        }
    }

}
</style>