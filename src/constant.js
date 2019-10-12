import Point from "./classes/point.class";
import Color from "./classes/color.class";

// 宣传按钮
const BTN_SPREAD = new Point(958, 1760);

// 餐厅鱼干的位置
const BTN_RESTAURANT_FISHES = Object.freeze([
  new Point(166, 778),
  new Point(445, 855),
  new Point(695, 855),
  new Point(945, 855),
  new Point(445, 1180),
  new Point(695, 1180),
  new Point(945, 1180),
  new Point(470, 1425),
  new Point(458, 1627),
]);

// 鱼干的颜色组
const COLOR_FISHES = new Color(146, 146, 146);

// 餐厅动物点餐的位置
const BTN_RESTAURANT_ORDERS = Object.freeze([
  new Point(409, 710),
  new Point(650, 710),
  new Point(891, 710),
  new Point(409, 1030),
  new Point(650, 1030),
  new Point(891, 1030),
]);

// 判断颜色的横轴偏移
const MAGIC_ORDER_OFFSET = new Point(-43, 0);

// 点餐提示的颜色
const COLOR_ORDER = new Color(249, 245, 232);

export {
  BTN_SPREAD,
  BTN_RESTAURANT_FISHES,
  COLOR_FISHES,
  BTN_RESTAURANT_ORDERS,
  COLOR_ORDER,
  MAGIC_ORDER_OFFSET,
}
