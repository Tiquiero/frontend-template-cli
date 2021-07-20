const hslToRgb = (H, S, L) => {
  let R, G, B;
  if (+S === 0) {
    R = G = B = L; // 饱和度为0 为灰色
  } else {
    const hue2Rgb = function (p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const Q = L < 0.5 ? L * (1 + S) : L + S - L * S;
    const P = 2 * L - Q;
    R = hue2Rgb(P, Q, H + 1 / 3);
    G = hue2Rgb(P, Q, H);
    B = hue2Rgb(P, Q, H - 1 / 3);
  }
  return `rgb(${[Math.round(R * 255), Math.round(G * 255), Math.round(B * 255)].join()})`;
};

const hslToRgba = (H, S, L, a) => {
  let R, G, B;
  if (+S === 0) {
    R = G = B = L; // 饱和度为0 为灰色
  } else {
    const hue2Rgb = function (p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const Q = L < 0.5 ? L * (1 + S) : L + S - L * S;
    const P = 2 * L - Q;
    R = hue2Rgb(P, Q, H + 1 / 3);
    G = hue2Rgb(P, Q, H);
    B = hue2Rgb(P, Q, H - 1 / 3);
  }
  return `rgba(${[Math.round(R * 255), Math.round(G * 255), Math.round(B * 255)].join()}, ${a})`;
};

// 获取随机HSL
const randomHsl = () => {
  const H = Math.random();
  const S = Math.random();
  const L = Math.random();
  return [H, S, L];
};

// 获取随机HSL(排除过灰过亮过暗)
const getRandomHsl = () => {
  let ret = randomHsl();

  ret[1] = 0.7 + (ret[1] * 0.2); // [0.7 - 0.9] 排除过灰颜色
  ret[2] = 0.4 + (ret[2] * 0.4); // [0.4 - 0.8] 排除过亮过暗色

  // 数据转化到小数点后两位
  ret = ret.map(function (item) {
    return parseFloat(item.toFixed(2));
  });

  return ret;
}

export const getRandomRgb = (a) => {
  const hsl = getRandomHsl();
  return a ? hslToRgba(hsl[0], hsl[1], hsl[2], a) : hslToRgb(hsl[0], hsl[1], hsl[2]);
};