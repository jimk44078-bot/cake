// 选择类名为"sun"的元素，该元素将作为太阳的容器
const sun = document.querySelector(".sun");

// 循环创建太阳的光线，共创建60条光线，代表一圈（360度）
for (let i = 1; i <= 60; i++) {
  // 创建一个新的div元素，该元素将作为太阳的一条光线
  let div = document.createElement("div");

  // 设置新创建的div元素的类名为"ray"，以便应用相应的样式
  div.className = "ray";

  // 设置每条光线的旋转角度，通过变量i计算得出，确保光线均匀分布
  div.style.setProperty("--rotate", i * 6 + "deg");

  // 设置每条光线的动画延迟时间，通过变量i计算得出，确保光线依次显示
  div.style.setProperty("--delay", i * -0.33 + "s");

  // 将创建的光线div添加到太阳容器中
  sun.appendChild(div);
}
