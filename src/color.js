import { readScreenBuffer } from './adb';
import Color from "./classes/color.class";

/**
 * 从屏幕截图快照中获取坐标颜色
 * @param   {Point}   point   需要获取颜色的坐标点
 * @return  {Color}           该点对应的颜色值
 */
export async function getColorFromDump({ x, y }) {
  const buffer = await readScreenBuffer(1080 * y + x + 3);
  const [r, g, b, a] = buffer;
  return new Color(r, g, b, a);
}
