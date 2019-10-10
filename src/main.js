import AdbAdapter from "./adbAdapter";

async function main() {
  const adb = new AdbAdapter();
  // adb.savePng();
  const result = await adb.getColorFromDump(390, 805);

  console.log(result);
}

main();

