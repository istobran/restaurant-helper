// 用于反侦测的函数

import Point from "./classes/point.class";

/**
 * 随机等待 100 ~ 300 毫秒
 * @return {Promise<void>}
 */
export function randomSleep() {
  return new Promise((resolve) => {
    setTimeout(resolve, 100 + Math.random() * 200);
  });
}

/**
 * 给用户点击的坐标产生随机偏移值
 * @param   {Point}   point   原始坐标点
 * @param   {Number}  range   模糊半径
 * @return  {Point}           随机偏移后的新坐标
 */
export function fuzzyCoord({ x, y }, range) {
  // 根据半径产生一个新的点
  const fuzzyRange = Math.random() * range;
  const angle = Math.random() * 2 * Math.PI;
  const fuzzyX = x + Math.ceil(Math.sin(angle) * fuzzyRange);
  const fuzzyY = y + Math.ceil(Math.cos(angle) * fuzzyRange);
  return new Point(fuzzyX, fuzzyY);
}

/**
 * 借助 Fisher–Yates shuffle 洗牌算法打算数组
 * https://www.zhihu.com/question/68330851
 * @param   {Array}   arr     待打乱的数组
 * @return  {Array}           打乱后的新数组
 */
export function shuffle(arr) {
  for (let i = 1; i < arr.length; i++) {
    const random = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[random]] = [arr[random], arr[i]];
  }
  return arr;
}
