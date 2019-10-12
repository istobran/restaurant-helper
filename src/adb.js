import { exec } from 'child_process';
import { EOL } from 'os';
import {
  pipe,
  split,
  filter,
  complement,
  anyPass,
  isEmpty,
  includes,
  map,
} from 'ramda';

const dumpScreenPath = '/sdcard/screen.dump';

/**
 * 执行 adb 命令
 * @param   {String}  cmd       待执行的命令
 * @param   {String}  encoding  返回数据流的格式
 * @return  {Promise<String|Buffer, String|Buffer>}
 */
function adb(cmd, encoding = 'utf8') {
  return new Promise((resolve, reject) => {
    exec(
      `adb ${cmd}`,
      { encoding, maxBuffer: 16 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout, stderr);
        }
      })
  })
}

/**
 * 执行 adb shell 命令
 * @param   {String}  cmd   待执行的命令
 * @param   {String}  encoding  返回数据流的格式
 * @return  {Promise<String|Buffer, String|Buffer>}
 */
function shell(cmd, encoding = 'utf8') {
  return adb(`shell "${cmd}"`, encoding);
}

/**
 * 获取当前的 android 设备列表
 * @return {Promise<Array>}
 */
export async function getDevices() {
  const stdout = await adb('devices');
  const arrToObj = ([id, state]) => ({ id, state });
  const invalidLine = anyPass([isEmpty, includes('List of devices attached')]);
  return pipe(
    split(EOL),
    filter(complement(invalidLine)),
    map(pipe(split('\t'), arrToObj)),
  )(stdout);
}

/**
 * 模拟用户点击
 * @param   {Point}   point   需要点击的坐标点
 * @return  {Promise<String|Buffer, String|Buffer>}
 */
export function tap({ x, y }) {
  return shell(`input tap ${x} ${y}`)
}

/**
 * 模拟用户拖动
 * @param {Number}  startX    起始点 X 坐标
 * @param {Number}  startY    起始点 Y 坐标
 * @param {Number}  endX      终点 X 坐标
 * @param {Number}  endY      终点 Y 坐标
 * @param {Number}  timeout   拖动过程延迟
 */
export function swipe(startX, startY, endX, endY, timeout) {
  return shell(`input swipe ${startX} ${startY} ${endX} ${endY} ${timeout}`)
}

/**
 * 生成手机屏幕截图快照
 * @return  {Promise<String|Buffer, String|Buffer>}
 */
export function dumpScreen() {
  return shell(`screencap ${dumpScreenPath}`)
}

/**
 * 清除缓存的屏幕快照
 * @return  {Promise<String|Buffer, String|Buffer>}
 */
export function cleanDump() {
  return shell(`rm -f ${dumpScreenPath}`);
}

/**
 * 读取屏幕快照中的像素点值
 * @param   {Number}  offset  偏移值
 * @param   {Number}  size    读取的数据块大小
 * @return  {Promise<String|Buffer, String|Buffer>}
 */
export function readScreenBuffer(offset, size = 4) {
  return shell(`dd if='${dumpScreenPath}' bs=${size} count=1 skip=${offset} 2>/dev/null`, 'buffer');
}
