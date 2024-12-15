import { ROUTE_LIST } from "@router/index"

/** 菜单列表 */
export const MENU_LIST = ROUTE_LIST.filter(item => item?.isMenu).map(item => ({
  key: item?.path,
  label: item?.title,
}))
