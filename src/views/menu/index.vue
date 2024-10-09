<template>
    <div class="common-layout">
        <el-container>
            <el-aside width="200px">
                <el-menu class="el-menu-vertical-demo" router text-color="white" background-color="#2b303b">
                    <div class="title">通用后台管理系统</div>
                    <el-menu-item index="home">
                        <el-icon>
                            <House />
                        </el-icon>
                        <span>首页</span>
                    </el-menu-item>

                    <el-menu-item index="overview">
                        <el-icon>
                            <Document />
                        </el-icon>
                        <span>系统概览</span>
                    </el-menu-item>
                    <el-sub-menu index="2">
                        <template #title>
                            <el-icon>
                                <User />
                            </el-icon>
                            <span>用户管理</span>
                        </template>
                        <el-menu-item-group title="管理员管理">
                            <el-menu-item index="product_manage">产品管理员</el-menu-item>
                            <el-menu-item index="users_manage">用户管理员</el-menu-item>
                            <el-menu-item index="message_manage">消息管理员</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="员工管理">
                            <el-menu-item index="user_list">用户列表</el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>

                    <el-sub-menu index="3">
                        <template #title>
                            <el-icon>
                                <TakeawayBox />
                            </el-icon>
                            <span>产品管理</span>
                        </template>
                        <el-menu-item-group title="入库管理">
                            <el-menu-item index="productmanage">产品列表</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="出库管理">
                            <el-menu-item index="out_productmanage">出库列表</el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>

                    <el-sub-menu index="4">
                        <template #title>
                            <el-icon>
                                <ChatSquare />
                            </el-icon>
                            <span>消息管理</span>
                        </template>
                        <el-menu-item-group title="消息管理">
                            <el-menu-item index="message_list">消息列表</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="回收站">
                            <el-menu-item index="recycle">回收站</el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>

                    <el-menu-item index="file">
                        <el-icon><icon-menu /></el-icon>
                        <span>合同管理</span>
                    </el-menu-item>
                    <el-menu-item index="operation_log">
                        <el-icon><icon-menu /></el-icon>
                        <span>操作日志</span>
                    </el-menu-item>
                    <el-menu-item index="login_log">
                        <el-icon><icon-menu /></el-icon>
                        <span>登录日志</span>
                    </el-menu-item>
                    <el-menu-item index="set">
                        <el-icon>
                            <Tools />
                        </el-icon>
                        <span>系统设置</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header>
                    <span class="header-left-content">
                        尊敬的 {{ userStore.name }} 欢迎你登录本系统
                    </span>
                    <div class="header-right-content">
                        <el-badge :is-dot="msgStore.read_list.length > 0 ? true : false" class="item"
                            @click="openDepartment">
                            <el-icon :size="24">
                                <Message />
                            </el-icon>
                        </el-badge>
                        <el-avatar :size="24" :src="userStore.imageUrl" />
                        <el-dropdown>
                            <span class="el-dropdown-link">设置</span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item>设置账号</el-dropdown-item>
                                    <el-dropdown-item>更改头像</el-dropdown-item>
                                    <el-dropdown-item @click="goLogin">退出登录</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </el-header>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
    <dep_message ref="dep"></dep_message>
</template>

<script setup lang="ts">

import { Menu as IconMenu, House, Document, User, TakeawayBox, ChatSquare, Tools, Message } from '@element-plus/icons-vue'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router';
import { UserInfoStore } from '@/store/userInfo';
import dep_message from '@/components/dep_message.vue';
// import { getReadListAndStatus } from '@/api/dep_msg'
import { UseMessage } from '@/store/message'

const msgStore = UseMessage()
const userStore = UserInfoStore()
const router = useRouter()


const goLogin = () => {
    router.push('/login')
}


// const noread = ref(false)
// 查询当前用户部门消息列表是否有消息，有就显示红点提示
// const getUserRead = async () => {
//     const res = await getReadListAndStatus(localStorage.getItem('id'))
//     let readList = res.data[0].read_list || '[]';
//     try {
//         // console.log(JSON.parse(readList).length);
//         let lenght = JSON.parse(readList).length
//         if (lenght > 0) {
//             noread.value = true
//         } else {
//             noread.value = false
//         }
//     } catch (error) {
//         console.error('解析 read_list 时出错:', error);
//     }
// }
// getUserRead()
// console.log(msgStore.read_list.length);

// 点击打开部门消息弹窗
const dep = ref()
const openDepartment = () => {
    dep.value.open()
}

</script>

<style scoped lang="scss">
// 侧边栏
.el-aside {
    height: 100vh;
    background-color: $base-menu-background;
    width: $base-menu-width;
    overflow-x: hidden;

    .el-menu {
        background: $base-menu-background;
        width: $base-menu-width;
        height: 100vh;
        border-right: 0px;
    }

    .title {
        padding: 20px;
        display: flex;
        justify-content: center;
        color: #fff;
        background: $base-menu-background;
    }

    .el-menu-item.is-active {
        background: #636771;
        color: rgb(241, 150, 150);
    }

}

.el-menu-item:hover {
    background: #545d70;
}

:deep(.el-sub-menu__title):hover {
    background: #545d70;
}

// tabbar
.el-header {
    display: flex;
    height: $base-tabbar-height;
    background: $base-menu-background;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    padding: 0 40px;

    .header-left-content {
        font-size: 14px;
    }

    .header-right-content {
        width: 160px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .el-dropdown-link {
            color: #fff;
        }

        .item {
            cursor: pointer;
        }
    }
}

// 内容
.el-main {
    padding: 0;
    background-color: #f3f4f4;
}
</style>