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
const COLOR_FISHES = Object.freeze([
  new Color(146, 146, 146),
  new Color(121, 79, 67),
]);

export {
  BTN_SPREAD,
  BTN_RESTAURANT_FISHES,
  COLOR_FISHES,
}
