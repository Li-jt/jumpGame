let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext('2d');
let countMod = document.getElementById("count");
let maskMod = document.getElementById("mask");
let yxjsMod = document.getElementById("yxjs");

//游戏是否结束
let gameIsEnd = false;

// 每个方块的大小
let rectW = 150;
let rectH = 50;

//下一个方块的创建位置
let initX = 0;
let initY = window.outerHeight - rectH;

//方块池
let rectArr = [];
let player = {
  x: 150,
  y: window.outerHeight - 100,
  w: 50,
  h: 100,
  c: '#000000',
  j: window.outerHeight - 100 - 200,
};

//是否创建方块
let isCreat = false;
//跳跃
let isJump = false;
//下落
let isFall = false;

let count = 0;
let requestId;
maskMod.addEventListener('click', function () {
  maskMod.style.display = 'none';
  init();
  requestId = requestAnimationFrame(frame);
})

//初始化
function init() {
  canvas.width = window.outerWidth;
  canvas.height = window.outerHeight;
  rectArr = [];
  gameIsEnd = false;
  initX = 0;
  initY = window.outerHeight - rectH;
  //是否创建方块
  isCreat = false;
  //跳跃
  isJump = false;
  //下落
  isFall = false;
  player = {
    x: 150,
    y: window.outerHeight - 100,
    w: 50,
    h: 100,
    c: '#000000',
    j: window.outerHeight - 100 - 200,
  };
  count = 0;
  creatRect();
}

function frame() {
  if (gameIsEnd) return;
  if (isCreat) {
    isCreat = false;
    creatRect();
  }
  //设置canvas宽高
  canvas.width = window.outerWidth;
  canvas.height = window.outerHeight;

  if (isJump) {
    jump();
    if (player.y <= player.j) {
      isFall = true;
    }
  }

  if (isFall) {
    fall();
  }

  drawRect(player.x, player.y, player.c, player.w, player.h);

  for (let i = 0; i < rectArr.length; i++) {

    drawRect(rectArr[i].x, rectArr[i].y, rectArr[i].c);

    // 向右移动
    if (!rectArr[i].isStop) {
      rectArr[i].x += rectArr[i].moveSteep;
    }

    // 角色站立 停止
    if (i == 0) {
      if (player.x <= rectArr[0].x + rectW &&
        player.x >= rectArr[0].x &&
        player.y >= initY) {
        rectArr[0].isStop = true;
        isCreat = true;
        count += 1;
      }
    }
  }

  if ((rectArr[0].moveSteep > 0 && player.y + player.h > initY + rectH * 1.1 && player.x <= rectArr[0].x + rectW) ||
    (rectArr[0].moveSteep > 0 && player.y + player.h > initY + rectH * 1.1 && player.x + player.w < rectArr[0].x) ||
    (rectArr[0].moveSteep < 0 && player.y + player.h > initY + rectH * 1.1 && player.x + player.w >= rectArr[0].x) ||
    (rectArr[0].moveSteep < 0 && player.y + player.h > initY + rectH * 1.1 && player.x > rectArr[0].x + rectW)) {
    gameIsEnd = true;
    console.log(`分数：${count}`);
    console.log('游戏结束！');
    yxjsMod.style.display = 'block';
    maskMod.style.display = 'block';
  } else {
    if (player.y + player.h >= initY + rectH) {
      if (player.x <= rectArr[0].x + rectW &&
        player.x >= rectArr[0].x) {
        isFall = false;
        player.y = initY - rectH;
        player.j = player.y - 200;
        rectArr[0].isStop = true;
        //是否创建方块
        isCreat = true;
        //分数
        count += 1;
        countMod.innerHTML = `分数：${count}`;
      }
    }
  }

  requestId = requestAnimationFrame(frame);
}


canvas.addEventListener('click', function () {
  isJump = true;
})

//跳跃
function jump() {
  player.y -= 5
  if (player.y <= player.j) {
    isJump = false;
  }
}

//下落
function fall() {
  player.y += 7;
}

// 创建方块
function creatRect() {
  initX = initX == 0 ? 1 : 0;

  // 向方块池中添加方块 位置：第一个
  rectArr.unshift({
    x: initX == 1 ? -rectW : canvas.width,
    y: initY,
    c: Color(),
    isStop: false,
    moveSteep: initX == 1 ? 3 : -3,
  })

  //下一个方块创建时的高度
  initY -= rectH;
  //场景中只出现5个方块 多了就删掉
  if (rectArr.length > 5) {
    // 删掉最后一个方块
    rectArr.pop();
    // 修改下一个方块创建时的高度
    initY += rectH;
    // 所有方块下降
    for (let i = 0; i < rectArr.length; i++) {
      rectArr[i].y += rectH;
    }
    player.y += rectH;
    player.j = player.y - 200;
  }
}

// 绘制方块
function drawRect(x, y, color, w, h) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w ? w : rectW, h ? h : rectH);
}

//随机颜色生成
function Color() {
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);
  return 'rgba(' + r + ',' + g + ',' + b + ',1)';
}