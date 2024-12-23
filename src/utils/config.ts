import { ROUTE_LIST } from "@router/index"

/** 菜单列表 */
export const MENU_LIST = ROUTE_LIST.filter(item => item?.isMenu).map(item => ({
  key: item?.path,
  label: item?.title,
}))

/** 角色列表 */
export const ROLE_LIST = [
  { value: '1', label: '管理员', },
  { value: '2', label: '普通用户', },
];

/** 角色列表 - 全部 */
export const ROLE_LIST_ALL = [
  { value: '0', label: '超级管理员', },
  ...ROLE_LIST,
];

/**
 * 查询当前角色信息 - 操作
 * @param value 
 * @returns 
 */
export const queryRoleInfoFn = (value: "0" | "1" | "2") => {
  const info = ROLE_LIST_ALL.find(item => item?.value === value);
  return info;
}

export const LANGUAGE_LIST = [
  { key: 'zh', label: '中文', },
  { key: 'en', label: 'English', },
  { key: 'ru', label: 'Русский язык', },
];
