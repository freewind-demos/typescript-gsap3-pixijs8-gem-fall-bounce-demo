# GSAP3 + PixiJS8 宝石下落弹性动画

## 简介

本 Demo 演示如何使用 GSAP3 的 elastic.out 缓动函数，配合 PixiJS8 创建宝石下落后带弹性 bounce 效果的动画。

## 快速开始

### 环境要求

- Node.js 18+
- 现代浏览器

### 运行

```bash
npm install
npm run dev
```

然后打开 http://localhost:5173 ，点击画面可重新播放动画。

## 核心概念

### PixiJS8 图形绘制

使用 Graphics 绘制六边形宝石：

```typescript
const g = new Graphics()
g.poly([
  -s, -s * 0.3,
  -s * 0.5, -s,
  s * 0.5, -s,
  s, -s * 0.3,
  s * 0.5, s,
  -s * 0.5, s
])
g.fill({ color: this.color })
g.stroke({ color: 0xffffff, width: 2 })
```

### GSAP3 弹性缓动

使用 elastic.out 缓动实现弹跳效果：

```typescript
gsap.to(gem.graphic, {
  y: groundY - gem.size,
  duration: 1.2,
  ease: 'elastic.out(1, 0.4)',
  delay: index * 0.15
})
```

`elastic.out` 会在动画结束时产生自然的弹性振荡效果，是实现 bounce 效果的最佳选择。

参数说明：
- 第一个参数 1：弹性强度
- 第二个参数 0.4：弹性衰减（越小弹性越多）

### PixiJS8 初始化

v8 版本使用 async/await 初始化：

```typescript
const app = new Application()
await app.init({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x1a1a2e,
  antialias: true
})
document.body.appendChild(app.canvas as HTMLCanvasElement)
```

## 完整代码

```typescript
import { Application, Graphics } from 'pixi.js'
import { gsap } from 'gsap'

// 宝石类：绘制一个六边形宝石
class Gem {
  graphic: Graphics
  x: number
  y: number
  size: number
  color: number

  constructor(x: number, y: number, size: number, color: number) {
    this.x = x
    this.y = y
    this.size = size
    this.color = color
    this.graphic = new Graphics()
    this.draw()
    this.graphic.x = x
    this.graphic.y = y
  }

  draw() {
    const g = this.graphic
    const s = this.size
    // 六边形宝石
    g.poly([
      -s, -s * 0.3,
      -s * 0.5, -s,
      s * 0.5, -s,
      s, -s * 0.3,
      s * 0.5, s,
      -s * 0.5, s
    ])
    g.fill({ color: this.color })
    g.stroke({ color: 0xffffff, width: 2 })
    // 高光
    g.poly([-s * 0.3, -s * 0.8, s * 0.1, -s * 0.8, -s * 0.1, -s * 0.2])
    g.fill({ color: 0xffffff, alpha: 0.4 })
  }
}

// 初始化 PixiJS
const app = new Application()
await app.init({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x1a1a2e,
  antialias: true,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
})
document.body.appendChild(app.canvas as HTMLCanvasElement)

// 宝石颜色
const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xf38181, 0xaa96da]
const gems: Gem[] = []
const groundY = window.innerHeight - 100

// 创建多颗宝石
for (let i = 0; i < 6; i++) {
  const x = 100 + i * 120
  const y = -100 - i * 80
  const color = colors[i % colors.length]
  const gem = new Gem(x, y, 30, color)
  gems.push(gem)
  app.stage.addChild(gem.graphic)
}

// 绘制地面
const ground = new Graphics()
ground.rect(0, groundY, window.innerWidth, 10)
ground.fill({ color: 0x4a4a6a })
app.stage.addChild(ground)

// 使用 GSAP3 让宝石逐个下落并弹跳
function animateGems() {
  gems.forEach((gem, index) => {
    // 使用 elastic.out 缓动实现弹跳效果
    gsap.to(gem.graphic, {
      y: groundY - gem.size,
      duration: 1.2,
      ease: 'elastic.out(1, 0.4)',
      delay: index * 0.15,
      onComplete: () => {
        // 弹跳完成后，给一个轻微的上下颤动效果
        gsap.to(gem.graphic, {
          y: groundY - gem.size - 5,
          duration: 0.15,
          yoyo: true,
          repeat: 3,
          ease: 'power1.inOut'
        })
      }
    })
  })
}

// 点击画面重新播放动画
app.canvas.addEventListener('click', () => {
  // 先重置所有宝石位置
  gems.forEach((gem, index) => {
    gem.graphic.y = -100 - index * 80
  })
  animateGems()
})

// 启动动画
animateGems()
```

## 完整讲解

这个 Demo 展示了两个主流动画库的配合使用。

首先是 PixiJS8，它是一个高性能的 2D 渲染引擎，适合做游戏和复杂图形动画。在 v8 版本中，初始化方式从回调改成了 async/await，更加现代化。我们用 Graphics 对象绘制了六边形的宝石图形，填充颜色并加上白色描边和高光。

关键在于 GSAP3 的 elastic.out 缓动函数。当宝石从空中下落时，它不是简单地以匀速到达目标位置，而是以弹性方式振荡着落地。这种效果用传统的 CSS 动画很难实现，但 GSAP 只需要一行配置就能完成。

`elastic.out(1, 0.4)` 接受两个参数：第一个是弹性强度，决定振幅的大小；第二个是弹性衰减，决定弹性持续的时间。数值越小，弹的次数越多。

最后还给每个宝石添加了轻微的颤动效果，通过 yoyo: true 让动画来回执行，产生落地后还在微微震颤的真实感。

点击画面可以重新播放动画，方便观察效果。
