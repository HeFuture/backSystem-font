<template>
    <bread_crumb ref="breadcrumb" :item="item"></bread_crumb>
    <!-- 首页外壳 -->
    <div class="home-wrapped">
        <!-- 轮播图外壳 -->
        <div class="swiper-wrapped">
            <el-carousel height="320px" motion-blur>
                <el-carousel-item v-for="(item, index) in imageUrl" :key="index">
                    <img v-show="imageUrl[index] !== ''" :src="imageUrl[index]" class="swiper" />
                </el-carousel-item>
            </el-carousel>
        </div>
        <!-- 栅格外壳 -->
        <div class="layout-wrapped">
            <el-row :gutter="20">
                <el-col :span="6" v-for="(item, index) in companyIntroduce" :key="index">
                    <div class="company-message-area" @click="openIntroduce(index + 1)">
                        <span>{{ item.set_name }}</span>
                        <div v-html="item.set_text" class="company-introduce"></div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 表格外壳 -->
        <div class="two-table-wrapped">
            <!-- 公司公告 -->
            <div class="compary-natice">
                <span>公司公告</span>
                <el-table :data="companyData" style="width: 100%" :show-header="false" @row-click="openCompany">
                    <el-table-column prop="message_title" label="公告主题">
                        <template #default="{ row }">
                            <div class="message_title">{{ row.message_title }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="message_Level" label="等级">
                        <template #default="{ row }">
                            <div class="title-wrapped">
                                <el-tag class="mx-1" type="success" round v-if="row.message_Level == '一般'">{{
                                    row.message_Level
                                }}</el-tag>
                                <el-tag class="mx-1" type="primary" round v-else-if="row.message_Level == '重要'">{{
                                    row.message_Level }}</el-tag>
                                <el-tag class="mx-1" type="danger" round v-else-if="row.message_Level == '必要'">{{
                                    row.message_Level }}</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="message_publish_department" label="发布部门" />
                    <el-table-column label="发布时间" prop="message_create_time" width="180">
                        <template #default="{ row }">
                            <div class="title">{{ row.message_create_time?.slice(0, 10) }}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 系统通知 -->
            <div class="system-message">
                <span>系统通知</span>
                <el-table :data="systemData" style="width: 100%" :show-header="false" @row-click="openSystem">
                    <el-table-column prop="message_title" label="公告主题">
                        <template #default="{ row }">
                            <div class="message_title">{{ row.message_title }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="发布时间" prop="message_create_time" width="180">
                        <template #default="{ row }">
                            <div class="title">{{ row.message_create_time?.slice(0, 10) }}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
    <introduce ref="introduceId"></introduce>
    <comone_message ref="cmsg"></comone_message>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import bread_crumb from '@/components/bread_crumb.vue';
import { getSwiper, getAllCompanyIntroduce } from '@/api/setting'
import { bus } from "@/utils/mitt"
import introduce from './components/introduce.vue';
import { companyMessageList, systemMessageList } from '@/api/message'
import comone_message from '@/components/comone_message.vue';

// 面包屑
const breadcrumb = ref()
// 将面包屑值传递给 bread_crumb 组件
const item = ref({
    first: '首页'
})

// 公司公告
const companyData = ref()
// 系统消息
const systemData = ref()
const getMessageList = async () => {
    const res = await companyMessageList()
    companyData.value = res.data
    const res1 = await systemMessageList()
    systemData.value = res1.data
}
getMessageList()

// 绑定轮播图默认图片
const imageUrl = ref()
// 获取轮播图
const getAllswiper = async () => {
    const res = await getSwiper()
    imageUrl.value = res.data

}
getAllswiper()

// 存储公司信息
const companyIntroduce = ref<any[]>([])
// 获取公司介绍
const getAllcompanyIntroduce = async () => {
    const res = await getAllCompanyIntroduce()
    const [name, ...intro] = res.data
    companyIntroduce.value = intro
}
getAllcompanyIntroduce()

// 弹窗
const introduceId = ref()
// 打开栅格框介绍
const openIntroduce = async (id: number) => {
    // const res = await getSwiper()
    // 第一个参数是标记，第二个参数是要传的值
    bus.emit('introduce', id)
    introduceId.value.open()
}

const cmsg = ref()
const openCompany = (row: any) => {
    bus.emit('homeCompany', row)
    cmsg.value.open()
}
const openSystem = (row: any) => {
    bus.emit('homeSystem', row)
    cmsg.value.open()
}

</script>


<style scoped lang="scss">
@mixin table-class {
    height: 100%;
    width: 48%;
    display: flex;
    flex-direction: column;

    span {
        font-size: 15px;
        margin-bottom: 5px;
        border-bottom: 1px solid rgb(152, 152, 152);
    }
}

// 首页外壳
.home-wrapped {
    padding: 8px;
    background-color: #f5f5f5;
    height: calc(100vh - 85px);
    display: flex;
    flex-direction: column;

    // 轮播图外壳
    .swiper-wrapped {
        padding: 10px 40px 10px 40px;
        background-color: #fff;
        margin-bottom: 8px;

        .swiper {
            height: 100%;
            width: 100%;
        }
    }

    // 栅格外壳
    .layout-wrapped {
        padding: 10px 40px 10px 40px;
        background-color: #fff;
        margin-bottom: 8px;

        // 公司信息卡片
        .company-message-area {
            background-color: #f5f5f5;
            height: 20vh;
            padding: 8px;
            cursor: pointer;
            transition: all 0.3s ease-in-out;

            &:hover {
                background-color: #dfdfdf;
            }

            span {
                border-bottom: 1px solid rgb(152, 152, 152);
                font-size: 14px;
            }

            .company-introduce {
                padding-top: 18px;
                text-indent: 24px;
                font-size: 14px;
                overflow: hidden;
                text-overflow: ellipsis;
                // CSS 属性可以把块容器中的内容限制为指定的行数
                -webkit-line-clamp: 4;
                display: -webkit-box;
                -webkit-box-orient: vertical;
            }
        }
    }

    // 表格外壳
    .two-table-wrapped {
        padding: 0 40px;
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #fff;

        // 公司公告
        .compary-natice {
            @include table-class;

            .message_title {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }

        // 系统通知
        .system-message {
            @include table-class
        }
    }
}

// 轮播图默认样式
.demonstration {
    color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>