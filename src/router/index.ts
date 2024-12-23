import Home from "./../pages/home"
import GoodsBrand from "./../pages/goods-brand"
import GoodsList from "./../pages/goods-list"
import UserList from "./../pages/user-list"
import Login from "./../pages/login"
import Register from "./../pages/register"
import ChangePassword from "./../pages/change-password"
import I18n from "./../pages/i18n"

export const ROUTE_LIST = [
  {
    title: "主页",
    path: "/",
    element: Home,
    isMenu: true,
  },
  {
    title: "商品品牌",
    path: "/goods-brand",
    element: GoodsBrand,
    isMenu: true,
  },
  {
    title: "商品列表",
    path: "/goods-list",
    element: GoodsList,
    isMenu: true,
  },
  {
    title: "用户列表",
    path: "/user-list",
    element: UserList,
    isMenu: true,
  },
  {
    title: "修改密码",
    path: "/change-password",
    element: ChangePassword,
  },
  {
    title: "多语言维护",
    path: "/i18n",
    element: I18n,
    isMenu: true,
  },
]

export const ROUTE_LIST_PUBLIC = [
  {
    title: "登录",
    path: "/login",
    element: Login,
  },
  {
    title: "注册",
    path: "/register",
    element: Register,
  },
]
