<template>
    <div>
        <el-dialog v-model="dialogFormVisible" :title="title" width="600" align-center :draggable="true">
            <div class="dialog-content">
                <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="100px">
                    <el-form-item label="账号" prop="account">
                        <el-input v-model="formData.account" />
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="formData.password" />
                    </el-form-item>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="formData.name" />
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <el-select v-model="formData.sex" placeholder="请选择性别">
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
                    <el-button type="primary" @click="addAdmin">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">

import { ref, reactive, onBeforeUnmount } from 'vue'
// 兄弟组件传值之mitt
import { bus } from "@/utils/mitt"
import { createAdmin } from '@/api/userInfo'
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
    account: number,
    password: string,
    name: string,
    sex: string,
    email: string,
    identity: string,
    department: string
}
const identity = ref()
// 数据绑定
const formData: formData = reactive({
    account: null,
    password: '',
    name: '',
    sex: '',
    department: '',
    email: '',
    identity: identity,
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
    account: [
        { required: true, message: '请输入账号', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ],
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
    ],
    sex: [
        { required: true, message: '请选择性别', trigger: 'change' },
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
    ],
    department: [
        { required: true, message: '请选择部门', trigger: 'change' },
    ]
})

// 弹窗标题
const title = ref(null)
// 获得父组件传递的 createId
bus.on('createId', (id: number) => {
    if (id == 1) {
        title.value = '新建产品管理员'
        identity.value = '产品管理员'
    }
    if (id == 2) {
        title.value = '新建用户管理员'
        identity.value = '用户管理员'
    }
    if (id == 3) {
        title.value = '新建消息管理员'
        identity.value = '消息管理员'
    }
})

// 接收父组件传递的方法
// const emit = defineEmits(['success'])

const ruleFormRef = ref(null)
// 创建管理员
const addAdmin = () => {
    // 提交form表单前，判断表单数据是否输入
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            const res = await createAdmin(formData)
            if (res.data.status == 0) {
                dialogFormVisible.value = false
                // 调用父组件传递的方法，重新获取用户列表 刷新页面
                // emit('success')
                bus.emit('adminDialogOff',1)
                ElMessage({
                    message: '创建管理员成功',
                    type: 'success'
                })
            } else {
                ElMessage.error('创建失败')
                dialogFormVisible.value = false
            }
        }

    })

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