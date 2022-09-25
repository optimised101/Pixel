function translate(points, pt) {
  for (let p of points) {
    let a = [[p.x], [p.y], [1]];
    let transMatrix = [
      [1, 0, pt.x],
      [0, 1, pt.y],
      [0, 0, 1],
    ];
    let ans = matrixMult(transMatrix, a);

    p.x = ans[0][0];
    p.y = ans[1][0];
  }
  return points;
}

function scale(points, sx, sy, pf) {
  for (let p of points) {
    let a = [[p.x], [p.y], [1]];
    let scaMatrix = [
      [sx, 0, 0],
      [0, sy, 0],
      [0, 0, 1],
    ];

    let transToMatrix = [
      [1, 0, -pf.x],
      [0, 1, -pf.y],
      [0, 0, 1],
    ];

    let transBackMatrix = [
      [1, 0, pf.x],
      [0, 1, pf.y],
      [0, 0, 1],
    ];
    let ans = matrixMult(transToMatrix, a);
    ans = matrixMult(scaMatrix, ans);
    ans = matrixMult(transBackMatrix, ans);

    p.x = ans[0][0];
    p.y = ans[1][0];
  }
  return points;
}

function rotate(points, angle, pf) {
  angle = angle * (Math.PI / 180.0);
  for (let p of points) {
    let a = [[p.x], [p.y], [1]];
    let rotMatrix = [
      [Math.cos(angle), -Math.sin(angle), 0],
      [Math.sin(angle), Math.cos(angle), 0],
      [0, 0, 1],
    ];

    let transToMatrix = [
      [1, 0, -pf.x],
      [0, 1, -pf.y],
      [0, 0, 1],
    ];

    let transBackMatrix = [
      [1, 0, pf.x],
      [0, 1, pf.y],
      [0, 0, 1],
    ];
    let ans = matrixMult(transToMatrix, a);
    ans = matrixMult(rotMatrix, ans);
    ans = matrixMult(transBackMatrix, ans);

    p.x = ans[0][0];
    p.y = ans[1][0];
  }

  return points;
}
