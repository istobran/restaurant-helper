import { deltaE } from 'rgb-lab';
import { addIndex, is, map, pipe, reduce, flip, then } from "ramda";
import { cleanDump, dumpScreen, tap } from './adb';
import { randomSleep, fuzzyCoord, shuffle } from "./fuzzy";
import {
  BTN_RESTAURANT_FISHES,
  BTN_RESTAURANT_ORDERS,
  BTN_SPREAD,
  COLOR_FISHES,
  COLOR_ORDER,
  MAGIC_ORDER_OFFSET
} from "./constant";
import { getColorFromDump } from "./color";
import Color from "./classes/color.class";
import Point from "./classes/point.class";

/**
 * 执行宣传
 * @returns {Promise<void>}
 */
export async function publicize() {
  while (true) {
    tap(fuzzyCoord(BTN_SPREAD, 80));
    await randomSleep();
  }
}

/**
 * 检查对应点上的颜色并点击
 * @param   {Color}   target  目标颜色值
 * @param   {Point}   offset  匹配时的坐标偏移
 * @param   {Point}   point   待检查的坐标点
 * @param   {Number}  index   遍历顺序
 * @returns {Promise<void>}
 */
async function tapColorPoint(target, offset = null, point, index) {
  try {
    const coord = is(Point, offset)
      ? new Point(point.x + offset.x, point.y + offset.y)
      : fuzzyCoord(point, 10);
    const color = await getColorFromDump(coord);
    console.log(`第 ${index} 位置的颜色`, point, color);
    if (deltaE(target.lab, color.lab) < 5) {
      await tap(fuzzyCoord(point, 10));
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * 匹配一组颜色并执行点击
 * @param   {Array}   colorArr    待匹配的颜色列表
 * @param   {Color}   color       目标颜色值
 * @param   {Point}   offset      匹配时的坐标偏移
 * @returns {Promise<*>}
 */
async function pollColorList(colorArr, color, offset = null) {
  const buildPromFunc = (...args) => tapColorPoint.bind(null, color, offset, ...args);
  return await pipe(
    addIndex(map)(buildPromFunc), // 生成异步函数数组
    shuffle, // 打乱数组顺序
    reduce(flip(then), Promise.resolve()), // 同步依次执行所有 promise
  )(colorArr);
}

/**
 * 执行屏幕轮询检测
 * @return {Promise<void>}
 */
export async function screenPoll() {
  while (true) {
    await dumpScreen();
    console.log('=======FISH=======');
    await pollColorList(BTN_RESTAURANT_FISHES, COLOR_FISHES); // 收集小鱼干
    console.log('======ORDERS======');
    await pollColorList(BTN_RESTAURANT_ORDERS, COLOR_ORDER, MAGIC_ORDER_OFFSET); // 帮动物点餐
    console.log('=======END========');
    await cleanDump();
    await randomSleep();
  }
}
