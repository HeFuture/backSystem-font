<template>
    <div>
        <el-dialog v-model="dialogFormVisible" :title="title" width="40%" align-center :draggable="true"
            :destroy-on-close="true" :append-to-body="true">
            <div class="dialog-content">
                <el-form :model="formData" label-width="auto" :rules="rules" ref="ruleForm"
                    :label-position="labelPosition" style="max-width: 700px">
                    <el-form-item label="主题：" prop="message_title">
                        <el-input v-model="formData.message_title" />
                    </el-form-item>
                    <el-form-item label="发布部门：" prop="message_publish_department"
                        v-if="title == '发布公告' || title == '编辑公告'">
                        <el-select v-model="formData.message_publish_department" placeholder="请选择发布部门">
                            <el-option :label="item.value" :value="item.value" v-for="item in options"
                                :key="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发布人：" prop="message_publish_name">
                        <el-input v-model="formData.message_publish_name" :disabled="true" />
                    </el-form-item>
                    <el-form-item label="接收部门：" prop="message_receipt_object" v-if="title == '发布公告' || title == '编辑公告'">
                        <el-select v-model="formData.message_receipt_object" placeholder="请选择接收部门">
                            <el-option :label="item.value" :value="item.value" v-for="item in alloptions"
                                :key="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="公告等级：" prop="message_Level" v-if="title == '发布公告' || title == '编辑公告'">
                        <el-select v-model="formData.message_Level" placeholder="请选择公告等级">
                            <el-option label="一般" value="一般" />
                            <el-option label="重要" value="重要" />
                            <el-option label="必要" value="必要" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="内容：" prop="message_content">
                        <div style="border: 1px solid #ccc">
                            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef"
                                :defaultConfig="toolbarConfig" :mode="mode" />
                            <Editor style="height: 300px; overflow-y: hidden;" v-model="formData.message_content"
                                :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" />
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="yes">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">

import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { ref, onBeforeUnmount, reactive, shallowRef } from 'vue'
// 兄弟组件传值之mitt
import { bus } from "@/utils/mitt"
import { ElMessage } from 'element-plus';
import { publishMessage, editMessage } from '@/api/message'
import { getDepartment } from '@/api/setting'
import { changeUserReadList } from '@/api/dep_msg'
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

// 表单对齐方式
const labelPosition = ref('left')

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// mode
const mode = ref('default')

// 标题
const title = ref()

// 下拉框数据，不包括全体成员
const options = ref()
// 下拉框数据，包括全体成员
const alloptions = ref()

const departmentData = ref([])
// 获取部门,从setting里设置的部门
const getdepartment = async () => {
    const res = await getDepartment()
    // JSON.parse 反序列化数据 
    departmentData.value = JSON.parse(res.data[0].set_value)
    // console.log(departmentData.value);
    // {0: '总裁办', 1: '组织部'}
    const data = []
    const datas = []
    for (let i = 0; i < departmentData.value.length; i++) {
        let obj = {
            value: departmentData.value[i]
        }
        data.push(obj)
        datas.push(obj)
    }
    options.value = data
    datas.push({ value: '全体成员' })
    alloptions.value = datas
}
getdepartment()

function resetFormData() {
    // 直接修改响应式对象的属性来重置它们  
    // 注意：我们不需要使用 Object.assign 或类似的函数，因为 formData 是响应式的  
    // 直接赋值给属性会触发 Vue 的响应性系统  
    formData.id = 0; // 假设您想要重置 id 为 0，或者您可以根据需要将其设置为 null 或 undefined  
    formData.message_title = '';
    formData.message_category = '';
    formData.message_publish_department = '';
    // formData.message_publish_name = '';
    formData.message_receipt_object = '';
    formData.message_Level = '';
    formData.message_content = '';
}

// 接收父组件的值，判断是发布还是编辑
bus.on('createMessage', (id: number) => {
    // 如果要发布新公告，先重置表单数据  
    resetFormData();
    if (id == 1) {
        title.value = '发布公告'
    } else if (id == 2) {
        title.value = '发布系统消息'
    }

})

bus.on('editMessage', (row: any) => {
    title.value = '编辑公告'
    formData.id = row.id
    formData.message_title = row.message_title
    formData.message_publish_department = row.message_publish_department
    // formData.message_publish_name = row.message_publish_name
    formData.message_receipt_object = row.message_receipt_object
    formData.message_Level = row.message_Level
    formData.message_content = row.message_content
})
bus.on('editSystemMessage', (row: any) => {
    title.value = '编辑系统消息'
    formData.id = row.id
    formData.message_title = row.message_title
    // formData.message_publish_name = row.message_publish_name
    formData.message_content = row.message_content
})


interface formData {
    id: number,
    message_title: string,
    message_category: string,
    message_publish_department: string,
    message_publish_name: string,
    message_receipt_object: string,
    message_Level: string,
    message_content: string,
}

// 表单数据
const formData: formData = reactive({
    id: 0,
    message_title: '',
    message_category: '',
    message_publish_department: '',
    message_publish_name: localStorage.getItem('name'),
    message_receipt_object: '',
    message_Level: '',
    message_content: '',
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
    message_title: [
        { required: true, message: '请输入公告标题', trigger: 'blur' },
    ],
    message_publish_department: [
        { required: true, message: '请选择发布部门', trigger: 'blur' },
    ],
    message_publish_name: [
        { required: false, message: '请输入发布人', trigger: 'blur' },
    ],
    message_receipt_object: [
        { required: true, message: '请输入接收对象', trigger: 'blur' },
    ],
    message_Level: [
        { required: true, message: '请选择公告等级', trigger: 'blur' },
    ],
    message_content: [
        { required: true, message: '请输入公告内容', trigger: 'blur' },
    ],
})

const toolbarConfig = {
    excludeKeys: []
}
const editorConfig = {
    placeholder: '请输入公告内容...',
    MENU_CONF: {

    }
}
// 上传图片，修改 uploadImage 菜单配置
// 需要注意的是，如何去修改参数？
toolbarConfig.excludeKeys = [
    'blockquote',
    'bgColor',
    'color',
    'group-more-style',
    'fontFamily',
    'bulletedList',
    'numberedList',
    'lineHeight',
    'todo',
    'emotion',
    'insertLink',
    'group-video',
    'insertTable',
    'codeBlock',
    'divider',
    'fullScreen',
    // 'group-image',

    // 排除菜单组，写菜单组 key 的值即可
]

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})

const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}

// 接收父组件传递的方法
const emit = defineEmits(['success'])
// 获取表单数据，用来判断用户是否填入指定数据
const ruleForm = ref(null)
// 确认发布或编辑
const yes = async () => {
    // 提交form表单前，判断表单数据是否输入
    await ruleForm.value.validate(async (valid) => {
        if (valid) {
            if (title.value == '发布公告') {
                formData.message_category = '公司公告';
                const res = await publishMessage(formData)
                if (res.data.status == 0) {
                    // 公告发布成功，把新发布文章的 id 插入 当前用户阅读列表
                    await changeUserReadList(formData.message_publish_department, res.data.id)
                    msgStore.returnReadList(localStorage.getItem('id'))
                    emit('success')
                    dialogFormVisible.value = false
                    ElMessage({
                        message: '发布公告成功',
                        type: 'success'
                    })
                }
                else {
                    ElMessage.error('发布公告失败')
                }
            }
            if (title.value == '编辑公告') {
                const res = await editMessage(formData)
                if (res.data.status == 0) {
                    msgStore.returnReadList(localStorage.getItem('id'))
                    
                    emit('success')
                    dialogFormVisible.value = false
                    ElMessage({
                        message: '编辑公告成功',
                        type: 'success'
                    })
                } else {
                    ElMessage.error('编辑公告失败')
                }
            }
            if (title.value == '发布系统消息') {
                formData.message_category = '系统消息';
                const res = await publishMessage(formData)
                if (res.data.status == 0) {
                    emit('success')
                    dialogFormVisible.value = false
                    ElMessage({
                        message: '发布系统消息成功',
                        type: 'success'
                    })
                }
                else {
                    ElMessage.error('发布系统消息失败')
                }
            }
            if (title.value == '编辑系统消息') {
                const res = await editMessage(formData)
                if (res.data.status == 0) {
                    emit('success')
                    dialogFormVisible.value = false
                    ElMessage({
                        message: '编辑系统消息成功',
                        type: 'success'
                    })
                } else {
                    ElMessage.error('编辑系统消息失败')
                }
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
    max-height: 800px;
    display: flex;
    padding: 20px 30px;
    flex: 1;
    overflow: auto;
    justify-content: center;
}

.dialog-footer {
    button {
        margin-right: 62px;
        margin-bottom: 20px;
    }
}


:deep(.w-e-text-placeholder) {
    top: 10px;
}
</style>

<style lang="scss">
.el-dialog__title {
    display: flex;
    justify-content: center;
    align-items: center;

}
</style>