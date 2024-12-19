import { getItem, removeItem } from "@analytics/storage-utils"
import { cache } from "./cache"
import $axios from "@axios"
import { AUTH_CODE, SUCCESS_CODE } from "@axios/config"
import { message } from "antd"
import { eventBus } from "./event-bus"

/**
 * 创建日志信息 - 操作
 * @param params
 * @returns
 */
export const createLogContentFn = (params: {
  path: string
  msg?: string
  error: any
}) => {
  if (!params || !Object.keys(params).length) return

  const date = new Date()
  const time = date.toLocaleString()
  const { path, msg, error } = params
  if (!path) return

  console.log(`${time} --- ${path} --- ${msg || "操作失败"}`, {
    content: error || {},
  })
}

export interface IUserInfo {
  id: number;
  phone: string
  nickname: string
  avatar: string
  token: string
}

/**
 * 获取用户信息 - 操作
 * @returns
 */
export const getUserInfoFn = () => {
  const login_info = getItem(cache.LOGIN_INFO, {
    storage: "localStorage",
  }) as Partial<IUserInfo>
  return login_info || {}
}

/**
 * 退出登录 - 操作
 * @returns
 */
export const onEmitLogoutClick = async () => {
  let context = false

  try {
    const result = await $axios.get<IResult>(`/user/logout`)
    let msg = result?.data?.message
    const code = result?.data?.code

    if(code === AUTH_CODE) {
        context = true;
        msg = "退出登录成功";
    }else {
        context = code === SUCCESS_CODE
    }

    if (msg) {
        if (context) {
            message.success(msg)
        } else {
            message.error(msg)
        }
    }
  } catch (error) {
    createLogContentFn({
      path: "emitLogoutFn",
      error,
    })
  }

  if (context) {
    onNavigateToLoginClick();
  }

  return context
}

/**
 * 跳转登录页 - 操作
 */
export const onNavigateToLoginClick = () => {
    const pathname = window?.location?.pathname;

    const login_path = "/login";
    if(pathname === login_path) return;
    
    removeItem(cache.LOGIN_INFO)
    eventBus.emit("navigate", {
        to: login_path,
    })
}
