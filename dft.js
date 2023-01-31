function complexMult(a, b) {
  const re = a.x * b.x - a.y * b.y;
  const im = a.y * b.x + a.x * b.y;
  const c = createVector(re,im);
  return c;
}
function expo(phi) {
  const res = createVector(cos(phi), -sin(phi));
  return res;
}

function dft(x) {
  let X = [];
  const N = x.length;
  for (let k = 0; k < N; k++) {
    let sum = createVector(0, 0);
    const w = TWO_PI * k;
    for (let n = 0; n < N; n++) {
      sum.add(complexMult(x[n], expo((w * n) / N)));
    }
    sum.mult(1 / N);
    X.push({ freq: k, amp: sum.mag(), phase: sum.heading() });
  }
  return X;
}
