<template>
    <div>
        <!-- 修改密码 -->
        <el-dialog v-model="state.changePasswordDialog" title="修改密码" width="450">
            <el-form :model="passwordData" label-width="auto" class="login-form" :label-position="labelPosition"
                :rules="rules">

                <!-- 密码输入 -->
                <el-form-item label="请输入原始密码" prop="oldPassword">
                    <el-input v-model="passwordData.oldPassword" placeholder="请输入密码" show-password />
                </el-form-item>
                <el-form-item label="请输入新密码" prop="newPassword">
                    <el-input v-model="passwordData.newPassword" placeholder="请输入密码" show-password />
                </el-form-item>
            </el-form>
            <!-- 底部确认修改 -->
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="state.changePasswordDialog = false">取消</el-button>
                    <el-button type="primary" @click="change_Password">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">

import { ref, reactive } from 'vue'
import { changePassword } from '@/api/userInfo'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router';

const router = useRouter()
// 表单对齐方式
const labelPosition = ref('top')

// 表单对象接口
interface passwordData {
    oldPassword: String;
    newPassword: String;
}

// 表单对象数据
const passwordData: passwordData = reactive({
    oldPassword: '',
    newPassword: '',
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
    oldPassword: [
        { required: true, message: '请输入原始密码', trigger: 'blur' },
    ],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
    ]
})

// 控制弹出，默认关闭
const state = reactive({
    // 控制忘记密码弹窗出现
    changePasswordDialog: false
})

// 打开弹出回调
const open = () => {
    state.changePasswordDialog = true
}


// 修改密码 changePassword  oldPassword 新密码 newPassword 参数：id
const change_Password = async () => {
    const id = localStorage.getItem('id')
    if (passwordData.oldPassword && passwordData.newPassword) {
        const res = await changePassword(id, passwordData.newPassword, passwordData.oldPassword)
        console.log(res);
        
        if (res.data.status == 0) {
            ElMessage({
                message: '修改成功',
                type: 'success',
            })
            // 关闭修改密码窗口
            state.changePasswordDialog = false
            router.push('/login')
        } else {
            ElMessage.error('密码修改失败')
        }
    } else {
        ElMessage.error('两次密码输入不一致')
    }

}

// 将方法传递给父组件
defineExpose({
    open
})

</script>

<style scoped lang="scss"></style>