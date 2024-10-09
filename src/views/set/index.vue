<template>
    <div>
        <bread_crumb ref="breadcrumb" :item="item"></bread_crumb>
        <!-- 外壳 -->
        <div class="common-wrapped">
            <!-- 内容 -->
            <div class="common-content">
                <el-tabs v-model="activeName" class="demo-tabs">
                    <el-tab-pane label="账号详情" name="first">
                        <div class="account-infor-warpped">
                            <span>用户头像:</span>
                            <div class="account-infor-content">
                                <!-- 
                                    action:头像上传接口
                                    show-file-list ：是否显示已上传文件列表
                                -->
                                <el-upload class="avatar-uploader" action="http://localhost:3000/user/uploadAvatar"
                                    :show-file-list="false" :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload">
                                    <img v-if="userStore.imageUrl" :src="userStore.imageUrl" class="avatar" />
                                    <el-icon v-else class="avatar-uploader-icon">
                                        <Plus />
                                    </el-icon>
                                </el-upload>
                            </div>
                        </div>
                        <div class="account-infor-warpped">
                            <span>用户账号:</span>
                            <div class="account-infor-content">
                                <el-input v-model="userStore.account" disabled />
                            </div>
                        </div>
                        <div class="account-infor-warpped">
                            <span>用户密码:</span>
                            <div class="account-infor-content">
                                <el-button type="primary" @click="openChangePassword">修改密码</el-button>
                            </div>
                        </div>
                        <div class="account-infor-warpped">
                            <span>用户姓名:</span>
                            <div class="account-infor-content">
                                <el-input v-model="userStore.name" />
                            </div>
                            <div class="account-infor-btn">
                                <el-button type="primary" @click="change_name">保存</el-button>
                            </div>
                        </div>
                        <div class="account-infor-warpped">
                            <span>用户性别:</span>
                            <div class="account-infor-content">
                                <el-select v-model="userStore.sex" placeholder="请选择">
                                    <el-option label="男" value="男" />
                                    <el-option label="女" value="女" />
                                </el-select>
                            </div>
                            <div class="account-infor-btn">
                                <el-button type="primary" @click="change_sex">保存</el-button>
                            </div>
                        </div>
                        <div class="account-infor-warpped">
                            <span>用户身份:</span>
                            <div class="account-infor-content">
                                <el-input v-model="userStore.identity" disabled />
                            </div>
                        </div>
                        <div class="account-infor-warpped">
                            <span>用户部门:</span>
                            <div class="account-infor-content">
                                <el-input v-model="userStore.department" disabled />
                            </div>
                        </div>
                        <div class="account-infor-warpped">
                            <span>用户邮箱:</span>
                            <div class="account-infor-content">
                                <el-input v-model="userStore.email" />
                            </div>
                            <div class="account-infor-btn">
                                <el-button type="primary" @click="change_email">保存</el-button>
                            </div>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="公司信息" name="second">
                        <div class="account-infor-warpped">
                            <span>公司名称:</span>
                            <div class="account-infor-content">
                                <el-input v-model="companyName" />
                            </div>
                            <div class="account-infor-btn">
                                <el-button type="primary" @click="changeCnyName">编辑公司名称</el-button>
                            </div>
                        </div>
                        <div class="account-infor-warpped">
                            <span>公司介绍:</span>
                            <div class="account-infor-content">
                                <el-button type="success" @click="openEditor(1)">编辑介绍信息</el-button>
                            </div>
                        </div>
                        <div class="account-infor-warpped">
                            <span>公司架构:</span>
                            <div class="account-infor-content">
                                <el-button type="success" @click="openEditor(2)">编辑架构信息</el-button>
                            </div>
                        </div>
                        <div class="account-infor-warpped">
                            <span>公司战略:</span>
                            <div class="account-infor-content">
                                <el-button type="success" @click="openEditor(3)">编辑战略信息</el-button>
                            </div>
                        </div>
                        <div class="account-infor-warpped">
                            <span>公司高层:</span>
                            <div class="account-infor-content">
                                <el-button type="success" @click="openEditor(4)">编辑高层信息</el-button>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="首页管理" name="third">
                        <div class="home-warpped">
                            <!-- 提示 -->
                            <div class="tips">
                                <span>提示: 点击图片框切换首页轮播图</span>
                            </div>
                            <!-- 轮播图 -->
                            <div class="swiper-wrapped" v-for="(item, index) in swiperData" :key="index">
                                <div class="swiper-name">轮播图{{ index + 1 }}</div>
                                <el-upload class="avatar-uploader" action="http://localhost:3000/set/uploadSwiper"
                                    :show-file-list="false" :on-success="handleSwiperSuccess"
                                    :before-upload="beforeAvatarUpload" :data="item">
                                    <template #trigger>
                                        <img v-if="imageUrl && imageUrl[index] !== undefined" :src="imageUrl[index]"
                                            class="swiper" />
                                        <img src="@/assets/images/白素描纸_.jpg" alt="" style="width: 336px;height: 96px"
                                            v-else>
                                    </template>
                                </el-upload>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="其他设置" name="fourth">
                        <div class="other-set">
                            <div class="department-set">
                                <span>部门设置</span>
                                <el-tag v-for="tag in dynamicTags" :key="tag" closable :disable-transitions="false"
                                    @close="handleClose(tag)">
                                    {{ tag }}
                                </el-tag>
                                <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="w-20"
                                    size="small" @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
                                <el-button v-else class="button-new-tag" size="small" @click="showInput">
                                    + 添加部门
                                </el-button>
                            </div>
                            <div class="product-set">
                                <span>产品设置</span>
                                <el-tag v-for="tag in dynamicProTags" :key="tag" closable :disable-transitions="false"
                                    @close="handleProClose(tag)">
                                    {{ tag }}
                                </el-tag>
                                <el-input v-if="inputProVisible" ref="InputProRef" v-model="inputProValue" class="w-20"
                                    size="small" @keyup.enter="handleProInputConfirm" @blur="handleProInputConfirm" />
                                <el-button v-else class="button-new-tag" size="small" @click="showProInput">
                                    + 添加产品
                                </el-button>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
    <!-- 修改密码弹窗 -->
    <change_password ref="changePwd"></change_password>
    <!-- editor弹窗 -->
    <editor ref="editorId"></editor>
</template>

<script setup lang="ts">

import { ref, reactive, nextTick, toRaw } from 'vue'
import bread_crumb from '@/components/bread_crumb.vue';
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import { UserInfoStore } from '@/store/userInfo';
import { bingAccound, changeName, changeEmail, changeSex } from '@/api/userInfo';
import change_password from './components/change_password.vue';
import editor from './components/editor.vue';
import { ElInput } from 'element-plus'
import type { InputInstance } from 'element-plus'
// 兄弟组件传值之mitt
import { bus } from "@/utils/mitt"
import { getCompanyName, changeCompanyName, getSwiper, setDepartment, getDepartment, setProduct, getProduct } from '@/api/setting'

const userStore = UserInfoStore()
// 面包屑
const breadcrumb = ref()

// 将面包屑值传递给 bread_crumb 组件
const item = ref({
    first: '系统设置'
})

// Tabs 标签页默认打开项
const activeName = ref('first')

// 文件上传成功时的钩子  response:回应（里面是后端返回的数据）
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
) => {
    // imageUrl.value = URL.createObjectURL(uploadFile.raw!)
    console.log(response);
    if (response.status == 0) {
        // 将userStore的imageUrl赋值（用response返回的值）
        userStore.$patch({
            imageUrl: response.url
        })
        ElMessage({
            message: '头像更新成功',
            type: 'success'
        }),
            (async () => {
                await bingAccound(userStore.account, response.onlyId, response.url)
                // console.log(res);
                // 匿名函数需要再后面加一个小括号（小括号中可以传值）
            })()
    } else {
        ElMessage.error('头像更新失败，请重新上传')
    }

}
// 上传文件之前的钩子，参数为上传的文件， 若返回false或者返回 Promise 且被 reject，则停止上传。
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('头像必须是JPG格式')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('头像必须小于2MB!')
        return false
    }
    return true
}

// 绑定用户信息
const AccountData = reactive({
    account: '',
    name: '',
    sex: '',
    identity: '',
    department: ''
})

// 公司信息
// 公司名称
const companyName = ref()
// 获取公司名称
const getCnyName = async () => {
    const res = await getCompanyName()
    companyName.value = res.data
}
getCnyName()
// 修改公司名称
const changeCnyName = async () => {
    const res = await changeCompanyName(companyName.value)
    if (res.data.status == 0) {
        ElMessage({
            message: '修改成功',
            type: 'success'
        })
    } else {
        ElMessage.error('修改失败，请重新输入')
    }

}

// 绑定子组件 修改密码弹窗
const changePwd = ref()
// 打开修改密码弹窗
const openChangePassword = () => {
    changePwd.value.open()
}

// 修改用户名
const change_name = async () => {
    const res = await changeName(localStorage.getItem('id'), userStore.name)

    if (res.data.status == 0) {
        ElMessage({
            message: '修改成功',
            type: 'success'
        })
    } else {
        ElMessage.error('修改姓名失败，请重新输入')
    }

}
// 修改性别
const change_sex = async () => {
    const res = await changeSex(localStorage.getItem('id'), userStore.sex)
    if (res.data.status == 0) {
        ElMessage({
            message: '修改成功',
            type: 'success'
        })
    } else {
        ElMessage.error('修改失败')
    }
}
// 修改邮箱
const change_email = async () => {
    const res = await changeEmail(localStorage.getItem('id'), userStore.email)
    if (res.data.status == 0) {
        ElMessage({
            message: '修改成功',
            type: 'success'
        })
    } else {
        ElMessage.error('修改邮箱失败,请重新输入')
    }
}

const editorId = ref()
// 打开富文本编辑器
const openEditor = (id) => {
    // 第一个参数是标记，第二个参数是要传的值
    bus.emit('editorTitle', id)
    editorId.value.open()
}

// 首页管理
const swiperData = [{ name: 'swiper1' }, { name: 'swiper2' }, { name: 'swiper3' }, { name: 'swiper4' }, { name: 'swiper5' }, { name: 'swiper6' }]

// 首页管理
// 上传轮播图
const handleSwiperSuccess: UploadProps['onSuccess'] = (response) => {
    console.log(response);
    getAllswiper()
}

// 绑定轮播图默认图片
const imageUrl = ref()
// 获取轮播图
const getAllswiper = async () => {
    const res = await getSwiper()
    imageUrl.value = res.data
}
getAllswiper()

// 其他设置
// 部门设置  setDepartment, getDepartment
const inputValue = ref('')
const dynamicTags = ref([])
const inputVisible = ref(false)
const InputRef = ref<InputInstance>()

// 产品设置  setDepartment, getDepartment
const inputProValue = ref('')
const dynamicProTags = ref([])
const inputProVisible = ref(false)
const InputProRef = ref<InputInstance>()

// 获取部门数据
const getdepartment = async () => {
    const res = await getDepartment()
    // JSON.parse 反序列化数据 
    dynamicTags.value = JSON.parse(res.data[0].set_value)
}
getdepartment()

// 获取产品数据
const getproduct = async () => {
    const res = await getProduct()
    // JSON.parse 反序列化数据 
    dynamicProTags.value = JSON.parse(res.data[0].set_value)
}
getproduct()

// 关闭删除标签的函数  部门设置
const handleClose = async (tag: string) => {
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
    // 使用toRaw（）方法来获取原始对象，这里的‘xxx’就是你需要转换的数据
    // JSON.stringify() 方法将一个 JavaScript 对象或值转换为 JSON 字符串
    // JSON.stringify() 序列化数据
    const res = await setDepartment(JSON.stringify(toRaw(dynamicTags.value)))
    if (res.data.status == 0) {
        ElMessage({
            message: '删除部门成功',
            type: 'success'
        })
    } else {
        ElMessage.error('删除部门失败')
    }
}

// 关闭删除标签的函数  产品设置
const handleProClose = async (tag: string) => {
    dynamicProTags.value.splice(dynamicProTags.value.indexOf(tag), 1)
    // 使用toRaw（）方法来获取原始对象，这里的‘xxx’就是你需要转换的数据
    // JSON.stringify() 方法将一个 JavaScript 对象或值转换为 JSON 字符串
    // JSON.stringify() 序列化数据
    const res = await setProduct(JSON.stringify(toRaw(dynamicProTags.value)))
    if (res.data.status == 0) {
        ElMessage({
            message: '删除产品成功',
            type: 'success'
        })
    } else {
        ElMessage.error('删除产品失败')
    }
}

// 点击按钮出现输入框  部门设置
const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value!.input!.focus()
    })
}

// 点击按钮出现输入框  产品设置
const showProInput = () => {
    inputProVisible.value = true
    nextTick(() => {
        InputProRef.value!.input!.focus()
    })
}

// 输入数据后的函数  部门设置
const handleInputConfirm = async () => {
    if (inputValue.value) {
        dynamicTags.value.push(inputValue.value)
        // 使用toRaw（）方法来获取原始对象，这里的‘xxx’就是你需要转换的数据
        // JSON.stringify() 方法将一个 JavaScript 对象或值转换为 JSON 字符串
        const res = await setDepartment(JSON.stringify(toRaw(dynamicTags.value)))
        if (res.data.status == 0) {
            ElMessage({
                message: '添加部门成功',
                type: 'success'
            })
        } else {
            ElMessage.error('添加部门失败')
        }
    }
    inputVisible.value = false
    inputValue.value = ''
}

// 输入数据后的函数  产品设置
const handleProInputConfirm = async () => {
    if (inputProValue.value) {
        dynamicProTags.value.push(inputProValue.value)
        // 使用toRaw（）方法来获取原始对象，这里的‘xxx’就是你需要转换的数据
        // JSON.stringify() 方法将一个 JavaScript 对象或值转换为 JSON 字符串
        const res = await setProduct(JSON.stringify(toRaw(dynamicProTags.value)))
        if (res.data.status == 0) {
            ElMessage({
                message: '添加产品成功',
                type: 'success'
            })
        } else {
            ElMessage.error('添加产品失败')
        }
    }
    inputProVisible.value = false
    inputProValue.value = ''
}

</script>


<style scoped lang="scss">
.common-wrapped {
    padding: 8px;
    background-color: #f5f5f5;
    height: calc(100vh - 85px);

    // 内容
    .common-content {
        padding: 0 40px;
        height: 100%;
        background-color: #fff;

        // 账号详情
        .account-infor-warpped {
            display: flex;
            align-items: center;
            padding-left: 60px;
            margin-bottom: 24px;
            font-size: 14px;

            // 输入框的长度
            .el-input {
                width: 240px;
            }

            // 按钮
            .account-infor-btn {
                margin-left: 10px;
            }

            // 下拉框
            .el-select {
                width: 240px;
            }

            // 账号详情内容
            .account-infor-content {
                margin: 0 16px 0 24px;
            }
        }

        // 首页管理
        .home-warpped {
            padding-left: 60px;
            display: flex;
            flex-direction: column;

            // 提示
            .tips {
                display: flex;
                align-items: center;
                margin-bottom: 8px;

                span {
                    font-size: 14px;
                    color: silver;

                }
            }

            // 轮播图
            .swiper-wrapped {
                display: flex;
                // margin-left: 16px;
                margin-bottom: 14px;

                // 名字
                .swiper-name {
                    font-size: 14px;
                    margin-right: 14px;
                }

                .swiper {
                    width: 336px;
                    height: 96px
                }

            }
        }

        // 其他设置
        .other-set {
            padding-left: 50px;
            font-size: 14px;

            .department-set {
                margin-bottom: 24px;

                span {
                    margin-right: 24px;
                }
                
            }

            .product-set {
                span {
                    margin-right: 24px;
                }
            }
        }
    }

    // Tabs 标签页
    .demo-tabs>.el-tabs__content {
        padding: 32px;
        color: #6b778c;
        font-size: 32px;
        font-weight: 600;
    }
}

:deep(.el-input){
    width: 180px;
}

// 头像上传样式
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
<!-- 头像上传样式 -->
<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>