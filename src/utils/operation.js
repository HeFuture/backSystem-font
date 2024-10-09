
import { operation } from '@/api/loginLog'
// 操作日志记录

/* 
module,  标识是不是管理员操作
operation_person,  操作人的名字
operation_object,  被操作人的名字
operation_level   操作等级
*/
export const tracking = async (module, operation_person, operation_object, operation_level, operation_status) => {
    if (module == '管理员') {
        // 操作内容
        let operation_content = `管理员对 ${operation_object} 进行了删除操作`

        await operation(operation_person, operation_content, operation_level)
    }
    if (module == '产品') {
        let operation_content = `管理员对 ${operation_object} 进行了审核操作，结果为${operation_status}`
        await operation(operation_person, operation_content, operation_level)
    }
}