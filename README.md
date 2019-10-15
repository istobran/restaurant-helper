# restaurant-helper

> 基于 `adb` 和 `node.js` 的动物餐厅小游戏辅助工具

## 依赖

* Node.js 10+
* Android Debug Bridge (adb)

## 使用

1、将项目下载到本地
```shell
git clone git@github.com:istobran/restaurant-helper.git
```

2、安装 adb 工具，如 macOS 的 Homebrew
```shell
brew cask install android-platform-tools
```

3、安装 node 依赖
```shell
cd restaurant-helper && npm i
```

4、编译项目
```shell
npm run build
```

5、启动项目
```shell
npm start
```

## 原理

直接对手机屏幕截图，然后去匹配对应的点上的颜色，匹配到了就执行点击

## 已知问题

1. 由于是获取点上的颜色，并仅进行一次匹配，会出现误判的情况  
   已通过两种方法进行尝试解决  
   一是通过颜色近似度算法 CIE94 判断颜色是否相似  
   二是对取色点的坐标产生随机的小范围偏移  
   但仍然无法根除该问题，因为这种判断机制本身就有这种缺陷
2. 由于每一次取色都要调用 adb 去对手机执行一次 IO 操作，当 IO 操作多的时候程序性能较差  
   对手机显存产生一次 dump 需要约 200 ~ 300 毫秒的延迟，而取色需要约 100 毫秒的延迟  
3. 辅助工具暂时无法对捣乱的顾客，地上的垃圾，广告君等特殊物体做处理
