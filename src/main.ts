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

async function main() {
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

  const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xf38181, 0xaa96da]
  const gems: Gem[] = []
  const groundY = window.innerHeight - 100

  for (let i = 0; i < 6; i++) {
    const x = 100 + i * 120
    const y = -100 - i * 80
    const color = colors[i % colors.length]
    const gem = new Gem(x, y, 30, color)
    gems.push(gem)
    app.stage.addChild(gem.graphic)
  }

  const ground = new Graphics()
  ground.rect(0, groundY, window.innerWidth, 10)
  ground.fill({ color: 0x4a4a6a })
  app.stage.addChild(ground)

  function animateGems() {
    gems.forEach((gem, index) => {
      gsap.to(gem.graphic, {
        y: groundY - gem.size,
        duration: 1.2,
        ease: 'elastic.out(1, 0.4)',
        delay: index * 0.15,
        onComplete: () => {
          gsap.to(gem.graphic, {
            y: groundY - gem.size - 5,
            duration: 0.15,
            yoyo: true,
            repeat: 3,
            ease: 'power1.inOut',
          })
        },
      })
    })
  }

  app.canvas.addEventListener('click', () => {
    gems.forEach((gem, index) => {
      gem.graphic.y = -100 - index * 80
    })
    animateGems()
  })

  animateGems()
}

main().catch(console.error)
