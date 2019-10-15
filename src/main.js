import { screenPoll, publicize } from './action';
import { debug, info } from './logger';
import { cleanDump } from "./adb";

process.on('SIGINT', process.exit);
process.on('exit', async function() {
  debug('正在清除手机上的屏幕缓存...');
  await cleanDump();
  process.exit();
});

function main() {
  publicize();
  screenPoll();
  info('程序初始化完毕');
}

main();

