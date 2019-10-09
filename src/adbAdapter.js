const { exec } = require('child_process');

export default class AdbAdapter {
  constructor() {
    this.prefix = 'adb'
  }

  /**
   * 获取当前的 android 设备列表
   * @return {Promise<Array>}
   */
  async getDevices() {
    const result = await this.exec('devices');
    return result.stdout.split('\r\n')
      .filter(item => {
        return item.indexOf('List of devices attached') === -1
      })
      .map(item => {
        const [id, state] = item.split('\t');
        return { id, state };
      });
  }

  /**
   * 模拟用户点击
   * @param {Number}  x   X 轴坐标
   * @param {Number}  y   Y 轴坐标
   * @returns {Promise<void>}
   */
  tap(x, y) {
    return this.exec(`shell input tap ${x} ${y}`)
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
    return this.exec(`shell input swipe ${startX} ${startY} ${endX} ${endY} ${timeout}`)
  }

  /**
   * 执行 shell 命令
   * @param   {String}  cmd   待执行的命令
   * @return  {Promise<string, string>}
   */
  exec(cmd) {
    return new Promise((resolve, reject) => {
      exec(`${this.prefix} ${cmd}`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout, stderr);
        }
      })
    })
  }
};
