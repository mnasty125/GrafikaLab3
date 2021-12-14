// Ширина и высота экрана
const vw = Math.max(
  document.documentElement.clientWidth || 0,
  window.innerWidth || 0
);
const vh = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
);

// Инициализация канваса
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

// Растягиваем на весь экран
canvas.width = vw;
canvas.height = vh;

//Функция отрисовки пикселя
let pixel = (x, y, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 2, 1);
};

//Функция отрисовки линии по Алгоритму Брезенхема
let DrawLine = (x1, y1, x2, y2, stroke) => {
  let dx = x2 - x1;
  let dy = y2 - y1;
  if (
    (Math.abs(dx) > Math.abs(dy) && x2 < x1) ||
    (Math.abs(dx) <= Math.abs(dy) && y2 < y1)
  ) {
    let x = x1;
    x1 = x2;
    x2 = x;
    let y = y1;
    y1 = y2;
    y2 = y;
  }
  dx = x2 - x1;
  dy = y2 - y1;

  let stp = 1;
  pixel(x1, x2, stroke);

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dy < 0) {
      stp = -1;
      dy *= -1;
    }
    let d = dy * 2 - dx;
    let d1 = dy * 2;
    let d2 = (dy - dx) * 2;
    y = y1;
    for (x = x1 + 1; x <= x2; x++) {
      if (d > 0) {
        y = y + stp;
        d = d + d2;
      } else {
        d = d + d1;
      }
      pixel(x, y, stroke);
    }
  } else {
    if (dx < 0) {
      stp = -1;
      dx *= -1;
    }
    d = dx * 2 - dy;
    d1 = dx * 2;
    d2 = (dx - dy) * 2;
    x = x1;
    for (y = y1 + 1; y <= y2; y++) {
      if (d > 0) {
        x = x + stp;
        d = d + d2;
      } else {
        d = d + d1;
      }
      pixel(x, y, stroke);
    }
  }
};

//Функция рисования окружности по Алгоритму Брезенхема
let DrawCircle = (_x, _y, radius, stroke) => {
  let x = 0,
    y = radius,
    gap = 0,
    delta = 2 - 2 * radius;
  while (y >= 0) {
    pixel(_x + x, _y + y, stroke);
    pixel(_x + x, _y - y, stroke);
    pixel(_x - x, _y - y, stroke);
    pixel(_x - x, _y + y, stroke);
    gap = 2 * (delta + y) - 1;
    if (delta < 0 && gap <= 0) {
      x++;
      delta += 2 * x + 1;
      continue;
    }
    if (delta > 0 && gap > 0) {
      y--;
      delta -= 2 * y + 1;
      continue;
    }
    x++;
    delta += 2 * (x - y);
    y--;
  }
};


//Функция рисования прямоугольника
let DrawRect = (x, y, dx, dy, stroke) => {
  DrawLine(x, y, x, y + dy, stroke);
  DrawLine(x, y + dy, x + dx, y + dy, stroke);
  DrawLine(x + dx, y + dy, x + dx, y, stroke);
  DrawLine(x + dx, y, x, y, stroke);
};

//Функция рисования треугольника
let DrawTriangle = (x1, y1, x2, y2, x3, y3, stroke) => {
  DrawLine(x1, y1, x2, y2, stroke);
  DrawLine(x2, y2, x3, y3, stroke);
  DrawLine(x3, y3, x1, y1, stroke);
};

// Отрисовка Сплайна
let DrawSpline = (plot, stroke) => {
  let temp = [];
  for (let i = 0; i < plot.length; i++)
      temp[i + 1] = plot[i];
  let j = plot.length;

  let res = 0;
  for (let i = 0; i < 2 * j; i += 2) {
      if (i > 0) {
          let x_ = temp[i / 2 + 1].x - temp[i / 2].x;
          let y_ = temp[i / 2 + 1].y - temp[i / 2].y;
          res += Math.sqrt(x_ ** 2 + y_ ** 2);
      }
  }
  temp[0] = temp[1];
  temp[temp.length] = temp[temp.length - 1];

  for (let i = 1; i <= temp.length - 3; i++)
  {
      let a = [], b = [];
      let plots = { a: a, b: b };

      plots.a[3] = (-temp[i - 1].x + 3 * temp[i].x - 3 * temp[i + 1].x + temp[i + 2].x) / 6;
      plots.a[2] = (temp[i - 1].x - 2 * temp[i].x + temp[i + 1].x) / 2;
      plots.a[1] = (-temp[i - 1].x + temp[i + 1].x) / 2;
      plots.a[0] = (temp[i - 1].x + 4 * temp[i].x + temp[i + 1].x) / 6;
      plots.b[3] = (-temp[i - 1].y + 3 * temp[i].y - 3 * temp[i + 1].y + temp[i + 2].y) / 6;
      plots.b[2] = (temp[i - 1].y - 2 * temp[i].y + temp[i + 1].y) / 2;
      plots.b[1] = (-temp[i - 1].y + temp[i + 1].y) / 2;
      plots.b[0] = (temp[i - 1].y + 4 * temp[i].y + temp[i + 1].y) / 6;

      let points = {};
      for (let j = 0; j < res; j++) {
          let t = j / res;
          points.x = (plots.a[0] + t * (plots.a[1] + t * (plots.a[2] + t * plots.a[3])));
          points.y = (plots.b[0] + t * (plots.b[1] + t * (plots.b[2] + t * plots.b[3])));
          pixel(points.x, points.y, stroke);
      }
  }
}

for (let t = vh / 2 + 150; t < vh; t++){
  DrawLine (0, t, vw, t, "#6DA2D0");
}

for (let t = 0; t < vh / 2 + 150; t++){
  DrawLine (0, t, vw, t, "#85BB65");
}


// Ствол
DrawRect (vw / 2 - 30, vh / 2 + 100, 60, 60, "black");
for ( let h = vh / 2 + 101; h < vh / 2 + 100 + 60; h++){
  DrawLine((vw / 2) - 30, h, vw / 2 + 30, h, "brown");
}

// Ёлка
DrawTriangle (vw / 2 - 200, vh / 2 + 100, vw / 2, vh / 2 - 260, vw / 2 + 200, vh / 2 + 100,"green");

//Шарики
for (r = 1; r < 20; r++) {
  DrawCircle(vw / 2 + 40, vh / 2 - 30, r, "red");
  DrawCircle(vw / 2 - 50, vh / 2 - 50, r, "yellow");
  DrawCircle(vw / 2 - 100, vh / 2 + 50, r, "pink");
  DrawCircle(vw / 2 + 20, vh / 2 + 50, r, "orange");
  DrawCircle(vw / 2 + 110, vh / 2 + 70, r, "blue");
  DrawCircle(vw / 2, vh / 2 - 130, r, "purple");
}

//Снег
for (let s = 0; s < 90; s+=30){
  DrawSpline([
    { x: vw / 2 - 200, y: vh / 2 + 190 + s },
    { x: vw / 2 - 150, y: vh / 2 + 140 + s },
    { x: vw / 2 - 100, y: vh / 2 + 190 + s },
    { x: vw / 2 - 50, y: vh / 2 + 140 + s },
    { x: vw / 2, y: vh / 2 + 190 + s },
    { x: vw / 2 + 50, y: vh / 2 + 140 + s },
    { x: vw / 2 + 100, y: vh / 2 + 190 + s },
    { x: vw / 2 + 150, y: vh / 2 + 140 + s },
    { x: vw / 2 + 200, y: vh / 2 + 190 + s }
  ], 'white');
}
