import { deltaE } from 'rgb-lab';
import { cleanDump, dumpScreen, tap } from './adb';
import { randomSleep, fuzzyCoord, shuffle } from "./fuzzy";
import { BTN_RESTAURANT_FISHES, BTN_SPREAD, COLOR_FISHES } from "./constant";
import { getColorFromDump } from "./color";
import Color from "./classes/color.class";

/**
 * 执行宣传
 * @returns {Promise<void>}
 */
export async function publicize() {
  do {
    tap(fuzzyCoord(BTN_SPREAD, 80));
    await randomSleep();
  } while (true);
}

/**
 * 获取颜色的欧式距离
 * @param   {Array<Color>}   arr    需要计算最小距离的颜色数组
 * @param   {Color}          color  待计算的颜色
 * @returns {Promise<void>}
 */
function getDeltaE(arr, color) {
  return arr.reduce((min, target) => {
    const value = deltaE(target, color.lab);
    return value < min ? value : min;
  }, Infinity);
}


/**
 * 检测某点上是否有鱼干
 * @param   {Point}   point   待检查的坐标点
 * @param   {Number}  index   遍历顺序
 * @returns {Promise<Boolean>}
 */
async function checkFishExist(point, index) {
  try {
    const color = await getColorFromDump(fuzzyCoord(point, 30));
    const distance = getDeltaE(COLOR_FISHES.map(p => p.lab), color);
    console.log(`获取第 ${index} 位置的颜色与鱼干的 CIE94 色差`, color.hex, distance);
    return distance < 10;
  } catch (err) {
    return false;
  }
}

/**
 * 模拟点击收集鱼干
 * @param   {Point}   point   待检查的坐标点
 * @param   {Number}  index   遍历顺序
 * @return  {Promise<void>}
 */
async function tapFish(point, index) {
  const exist = await checkFishExist(point, index);
  if (exist) await tap(fuzzyCoord(point, 30));
}

/**
 * 收集小鱼干
 * @returns {Promise<void>}
 */
export async function collectFishes() {
  do {
    await dumpScreen();
    const fns = BTN_RESTAURANT_FISHES
      .map((...args) => tapFish.bind(null, ...args));
    shuffle(fns); // 打乱数组顺序
    await fns.reduce((chain, fn) => chain.then(fn), Promise.resolve());
    console.log('=========================');
    await cleanDump();
    await randomSleep();
  } while (true);
}
