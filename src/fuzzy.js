// 用于反侦测的函数

import Point from "./classes/point.class";
import { add, compose, multiply, applyTo } from 'ramda';

const { PI, random, ceil, sin, cos, floor } = Math;

/**
 * 随机等待一定的时间，默认为 100 ~ 300 毫秒
 * @param   {Number}    delay     固定等待的时间
 * @param   {Number}    range     需要随机的时间范围
 * @return  {Promise<void>}
 */
export function randomSleep(delay = 100, range = 200) {
  return new Promise((resolve) => {
    setTimeout(resolve, add(delay)(multiply(random(), range)));
  });
}

/**
 * 根据半径给用户点击的坐标产生一个新的随机偏移坐标
 * @param   {Point}   point   原始坐标点
 * @param   {Number}  range   模糊半径
 * @return  {Point}           随机偏移后的新坐标
 */
export function fuzzyCoord({ x, y }, range) {
  const fuzzyRange = multiply(random(), range);
  const angle = multiply(random(), 2 * PI);
  const f = (fn, orig) => add(compose(ceil, multiply(fuzzyRange), applyTo(angle))(fn), orig);
  return new Point(f(sin, x), f(cos, y));
}

/**
 * 借助 Fisher–Yates shuffle 洗牌算法打乱数组
 * https://www.zhihu.com/question/68330851
 * @param   {Array}   arr     待打乱的数组
 * @return  {Array}           打乱后的新数组
 */
export function shuffle(arr) {
  for (let i = 1; i < arr.length; i++) {
    const rnd = floor(random() * (i + 1));
    [arr[i], arr[rnd]] = [arr[rnd], arr[i]];
  }
  return arr;
}
