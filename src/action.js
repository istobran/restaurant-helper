import { deltaE } from 'rgb-lab';
import { addIndex, is, map, pipe, reduce, flip, then } from "ramda";
import { dumpScreen, tap } from './adb';
import { randomSleep, randomOffset, shuffle } from "./fuzzy";
import {
  BTN_RESTAURANT_FISHES,
  BTN_RESTAURANT_ORDERS,
  BTN_SPREAD, BTN_SPREAD_PICK,
  COLOR_FISHES,
  COLOR_ORDER, COLOR_SPREAD,
  MAGIC_ORDER_OFFSET
} from "./constant";
import { getColorFromDump } from "./color";
import Color from "./classes/color.class";
import Point from "./classes/point.class";
import { debug, info, warn, error } from "./logger";

/**
 * 判断是否可以点击宣传按钮
 * @returns {Promise<Boolean>}
 */
async function isPublicizeAvailable() {
  try {
    const color = await getColorFromDump(BTN_SPREAD_PICK);
    if (deltaE(COLOR_SPREAD.lab, color.lab) < 3) {
      return true;
    }
  } catch (err) {
    warn('获取宣传按钮位置颜色失败', err.message);
  }
  return false;
}

/**
 * 执行宣传
 * @returns {Promise<void>}
 */
export async function publicize() {
  info('正在启动自动宣传功能...');
  let counter = 0;
  while (true) {
    if (counter % 5 || await isPublicizeAvailable()) { // 每点击屏幕 5 次判断一次颜色
      tap(randomOffset(BTN_SPREAD, 80));
      counter++;
    }
    await randomSleep(200, 150);
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
      : randomOffset(point, 10);
    const color = await getColorFromDump(coord);
    debug(`第 ${index} 位置的颜色`, point, color);
    if (deltaE(target.lab, color.lab) < 3) {
      info(`第 ${index} 位置发现了目标，正在执行点击`, point, color);
      await tap(randomOffset(point, 10));
    }
  } catch (err) {
    error(err.message);
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
  info('正在启动自动收集功能...');
  while (true) {
    await dumpScreen();
    debug('===============正在查找小鱼干===============');
    await pollColorList(BTN_RESTAURANT_FISHES, COLOR_FISHES); // 收集小鱼干
    debug('===========正在查找是否有动物点餐============');
    await pollColorList(BTN_RESTAURANT_ORDERS, COLOR_ORDER, MAGIC_ORDER_OFFSET); // 帮动物点餐
    await randomSleep();
  }
}
