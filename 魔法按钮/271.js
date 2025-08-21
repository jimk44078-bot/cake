// 获取按钮和画布元素
const button = document.getElementById("explosion-button");
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

// 调整画布以填充窗口
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// 粒子类
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    // 随机角度和速度
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    // 随机大小和旋转
    this.radius = Math.random() * 3 + 3;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.2;

    // 粒子寿命（3秒）
    this.life = 3000;
    this.elapsed = 0;
  }

  update(dt) {
    // 移动粒子
    this.x += this.vx;
    this.y += this.vy;
    // 施加轻微的摩擦，使其随着时间的推移而减速
    this.vx *= 0.98;
    this.vy *= 0.98;
    // 更新轮换
    this.rotation += this.rotationSpeed;
    // 更新已用时间
    this.elapsed += dt;
  }

  draw(ctx) {
    // 根据生命周期进度计算当前阿尔法值
    const progress = this.elapsed / this.life;
    const alpha = Math.max(1 - progress, 0);
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = alpha;

    // 绘制一个4点星形
    const spikes = 4;
    const outerRadius = this.radius;
    const innerRadius = outerRadius * 0.5;

    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      // 内外半径交替
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    // 为粒子使用明亮的橙黄色
    ctx.fillStyle = "rgba(255, 200, 0, 1)";
    ctx.fill();
    ctx.restore();
  }
}

// 用于存储活动粒子的阵列
let particles = [];

// 跟踪最后一帧的时间戳，以进行正确的增量时间计算
let lastTime = 0;

// 动画循环更新并绘制粒子
function animate(time) {
  const dt = time - lastTime;
  lastTime = time;

  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 更新并绘制每个粒子
  particles.forEach((p) => {
    p.update(dt);
    p.draw(ctx);
  });

  // 去除超过其寿命的颗粒
  particles = particles.filter((p) => p.elapsed < p.life);

  // 如果还有粒子，请继续设置动画
  if (particles.length > 0) {
    requestAnimationFrame(animate);
  }
}

// 在（x，y）处产生爆炸粒子的函数
function createParticles(x, y) {
  // 创建50到80个粒子以获得平衡效果
  const count = Math.floor(Math.random() * 30) + 50;
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y));
  }
  // 启动动画循环（如果尚未运行）
  lastTime = performance.now();
  requestAnimationFrame(animate);
}

// 按钮绑定点击事件
button.addEventListener("click", function (e) {
  // 获取按钮中心坐标
  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // 添加CSS类以快速放大按钮
  button.classList.add("active");

  // 200ms后删除活动类以平滑缩减
  setTimeout(() => {
    button.classList.remove("active");
  }, 200);

  // 从按钮中心创建爆炸粒子
  createParticles(centerX, centerY);
});
