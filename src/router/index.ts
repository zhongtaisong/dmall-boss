import Home from "./../pages/home"
import GoodsBrand from "./../pages/goods-brand"
import GoodsList from "./../pages/goods-list"
import OrderList from "./../pages/order-list"
import UserList from "./../pages/user-list"
import PermissionList from "./../pages/permission-list"
import Login from "./../pages/login"

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
    title: "订单列表",
    path: "/order-list",
    element: OrderList,
    isMenu: true,
  },
  {
    title: "用户列表",
    path: "/user-list",
    element: UserList,
    isMenu: true,
  },
  {
    title: "权限列表",
    path: "/permission-list",
    element: PermissionList,
    isMenu: true,
  },
]

export const ROUTE_LIST_PUBLIC = [
  {
    title: "登录",
    path: "/login",
    element: Login,
  },
]
