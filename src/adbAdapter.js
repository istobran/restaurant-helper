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

export default class AdbAdapter {
  constructor() {
    this.prefix = 'adb'
  }

  /**
   * 获取当前的 android 设备列表
   * @return {Promise<Array>}
   */
  async getDevices() {
    const stdout = await this.exec('devices');
    const arrToObj = ([id, state]) => ({ id, state });
    return pipe(
      split(EOL),
      filter(complement(anyPass([isEmpty, includes('List of devices attached')]))),
      map(pipe(split('\t'), arrToObj)),
    )(stdout);
  }

  /**
   * 模拟用户点击
   * @param {Number}  x   X 轴坐标
   * @param {Number}  y   Y 轴坐标
   * @return {Promise<String|Buffer, String|Buffer>}
   */
  tap(x, y) {
    return this.shell(`input tap ${x} ${y}`)
  }

  /**
   * 模拟用户拖动
   * @param {Number}  startX    起始点 X 坐标
   * @param {Number}  startY    起始点 Y 坐标
   * @param {Number}  endX      终点 X 坐标
   * @param {Number}  endY      终点 Y 坐标
   * @param {Number}  timeout   拖动过程延迟
   */
  swipe(startX, startY, endX, endY, timeout) {
    return this.shell(`input swipe ${startX} ${startY} ${endX} ${endY} ${timeout}`)
  }

  /**
   * 生成手机屏幕截图快照
   * @param   {String}  path    屏幕快照存放的绝对路径
   * @return {Promise<String|Buffer, String|Buffer>}
   */
  dumpScreen(path = '/sdcard/screen.dump') {
    return this.shell(`screencap ${path}`)
  }

  /**
   * 读取屏幕快照中的像素点值
   * @param   {String}  path    屏幕快照存放的绝对路径
   * @param   {Number}  offset  偏移值
   * @return {Promise<String|Buffer, String|Buffer>}
   */
  readBuffer(path = '/sdcard/screen.dump', offset) {
    return this.shell(`dd if='${path}' bs=4 count=1 skip=${offset} 2>/dev/null`, 'buffer');
  }

  /**
   * 从屏幕截图快照中获取坐标颜色
   * @param {Number}  x   X 轴坐标
   * @param {Number}  y   Y 轴坐标
   */
  async getColorFromDump(x, y) {
    const path = '/data/local/tmp/screen.dump';
    await this.dumpScreen(path);
    const buffer = await this.readBuffer(path, 1080 * y + x + 3);
    this.shell(`rm -f ${path}`);
    const [red, green, blue, alpha] = buffer;
    const hex = '#' + [red, green, blue, alpha]
      .map(color => color.toString(16))
      .join('');
    return { red, green, blue, alpha, hex };
  }

  /**
   * 执行 adb 命令
   * @param   {String}  cmd       待执行的命令
   * @param   {String}  encoding  返回数据流的格式
   * @return  {Promise<String|Buffer, String|Buffer>}
   */
  exec(cmd, encoding = 'utf8') {
    return new Promise((resolve, reject) => {
      exec(
        `${this.prefix} ${cmd}`,
        { encoding, maxBuffer: 128 * 1024 * 1024 },
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
  shell(cmd, encoding = 'utf8') {
    return this.exec(`shell "${cmd}"`, encoding);
  }
};
