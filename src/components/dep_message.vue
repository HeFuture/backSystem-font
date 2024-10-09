<template>
    <el-dialog v-model="dialog" title="部门消息" width="912" center destroy-on-close>
        <el-container>
            <el-aside width="416px">
                <div class="message-list-wrapped">
                    <div class="list-table-content">
                        <el-table :data="msgStore.msg_list.length > 0 ? msgStore.msg_list : tabledata" style="width: 100%;"
                            highlight-current-row @row-click="getdetail">
                            <el-table-column type="index" width="50"></el-table-column>
                            <el-table-column width="5">
                                <template #default="{ row }">
                                    <div :class="idTnList(row.id) ? 'readed' : 'noread'"></div>
                                </template>
                            </el-table-column>
                            <el-table-column label="主题" prop="message_title">
                                <template #default="{ row }">
                                    <div class="title-wrapped">
                                        <div class="title">{{ row.message_title }}</div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="等级" prop="message_Level">
                                <template #default="{ row }">
                                    <div class="title-wrapped">
                                        <el-tag class="mx-1" round v-if="row.message_Level == '一般'">{{ row.message_Level
                                            }}</el-tag>
                                        <el-tag class="mx-1" round v-else-if="row.message_Level == '重要'">{{
                                            row.message_Level }}</el-tag>
                                        <el-tag class="mx-1" round v-else-if="row.message_Level == '必要'">{{
                                            row.message_Level }}</el-tag>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="发布日期" prop="message_publish_time" width="180">
                                <template #default="{ row }">
                                    <div class="title">{{ row.message_update_time?.slice(0, 10) }}</div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-aside>
            <el-main>
                <div class="datail-wrapped" v-if="messageInfo.message_title !== ''">
                    <div>{{ messageInfo.message_title }}</div>
                    <div v-html="messageInfo.message_content"></div>
                </div>
                <div class="datail-wrapped-msg" v-else>
                    请点击列表中的消息进行查看...
                </div>
            </el-main>
        </el-container>
    </el-dialog>
</template>

<script setup lang="ts">

import { ref, reactive } from 'vue';
import { getDepartmentMsg, getDepartmentMsgList, getReadListAndStatus, clickDelete } from '@/api/dep_msg';
import { updateclick } from '@/api/message'
import { UseMessage } from '@/store/message'

const msgStore = UseMessage()

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

const tabledata = ref([])

const messageInfo = reactive({
    message_title: '',
    message_content: ''
})
// 当前未读消息
const readlist = ref([])

const getUserDepMessage = async () => {
    // console.log(JSON.parse(localStorage.getItem('userInfor')).department);
    try {
        const userInforString = localStorage.getItem('userInfor')
        if (!userInforString) {
            console.error('用户信息未找到');
            return;
        }
        const userInfor = JSON.parse(userInforString);
        const department = userInfor.department;
        const id = localStorage.getItem('id');
        if (!department) {
            console.error('部门信息未找到');
            return;
        }
        // 返回 阅读列表 和 阅读状态
        const res = await getReadListAndStatus(id)
        // 返回 部门消息
        const res3 = await getDepartmentMsgList(department)
        // console.log(res3.data);
        tabledata.value = res3.data

        if (res.data[0].read_status == 0) {
            // 阅读状态为0时，获取部门消息列表 并更新 未读消息列表
            const res2 = await getDepartmentMsg(id, department)
            readlist.value = JSON.parse(res2.data[0].read_list) || '[]';

        } else {
            // 阅读状态为1时，将获取的部门消息 赋值给 未读消息
            readlist.value = JSON.parse(res.data[0].read_list) || '[]';
        }
    } catch (error) {

    }
}
getUserDepMessage()

// 点击部门消息，展示详细
const getdetail = async (row: any) => {
    // console.log(row);
    // 更新点击率
    await updateclick(row.message_click_number, row.id)
    // 用户点击消息后对 read_list 内的数据进行删减 
    let readid = localStorage.getItem('id')
    await clickDelete(readid, row.id)
    messageInfo.message_title = row.message_title
    messageInfo.message_content = row.message_content
    getUserDepMessage()
}

// 判断阅读列表中是否包含当前id，包含显示已读
const idTnList = (id: number) => {
    // console.log(readlist.value);

    if (readlist.value.indexOf(id) !== -1) {
        return 1
    } else {
        return 0
    }
}

</script>

<style scoped lang="scss">
.el-aside {
    padding-left: 8px;
    min-height: 500px;

    .message-list-wrapped {
        height: 500px;

        .list-table-content {
            min-height: 10px;
            padding: 8px;

            .el-table {
                height: 100%;

                .title-wrapped {
                    display: flex;
                    align-items: center;

                    .title {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }

                .readed {
                    display: block;
                    width: 5px;
                    padding: 1px;
                    height: 5px;
                    border-radius: 50%;
                    background-color: #a9a9a9;
                }

                .noread {
                    display: block;
                    width: 5px;
                    padding: 1px;
                    height: 5px;
                    border-radius: 50%;
                    background-color: #ffa500;
                }
            }


        }
    }
}

.el-main {
    min-height: 500px;
    --el-main-padding: 0px;
    border-left: 1px solid #eee;
    position: relative;

    .datail-wrapped {
        padding: 8px;
    }

    .datail-wrapped-msg {
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%)
    }
}
</style>