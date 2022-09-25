// override of finishRendering of gif.js
GIF.prototype.finishRendering = function () {
  var data,
    frame,
    i,
    image,
    j,
    k,
    l,
    len,
    len1,
    len2,
    len3,
    offset,
    page,
    ref,
    ref1,
    ref2;
  len = 0;
  ref = this.imageParts;
  for (j = 0, len1 = ref.length; j < len1; j++) {
    frame = ref[j];
    len += (frame.data.length - 1) * frame.pageSize + frame.cursor;
  }
  len += frame.pageSize - frame.cursor;
  this.log("rendering finished - filesize " + Math.round(len / 1e3) + "kb");
  data = new Uint8Array(len);
  offset = 0;
  ref1 = this.imageParts;
  for (k = 0, len2 = ref1.length; k < len2; k++) {
    frame = ref1[k];
    ref2 = frame.data;
    for (i = l = 0, len3 = ref2.length; l < len3; i = ++l) {
      page = ref2[i];
      data.set(page, offset);
      if (i === frame.data.length - 1) {
        offset += frame.cursor;
      } else {
        offset += frame.pageSize;
      }
    }
  }
  image = new Blob([data], {
    type: "image/gif",
  });
  this.running = false; // *this is the new part*
  return this.emit("finished", image, data);
};

var Tool = {
  pen: 0,
  eraser: 1,
  fillBucket: 2,
  line: 3,
  circle: 4,
  ellipse: 5,
  addFrame: 6,
  undo: 7,
  redo: 8,
  clearCanvas: 9,
};
var tools = [true, false, false, false, false, false];
var lc = [];

class Popup {
  constructor(s) {
    this.s = s;
    document.querySelector(this.s).style.display = "block";
    document.querySelector(this.s).style.transform =
      "translate(-50%,-50%) scale(1,1)";
  }
  close() {
    document.querySelector(this.s).style.transform =
      "translate(-50%,-50%) scale(0,0)";
  }
}

class Frames {
  static open() {
    document.querySelector("#frames").style.display = "block";
    document.querySelector("#frames").style.transform =
      "translate(-50%,-50%) scale(1,1)";
    document.querySelector("#frames").focus();
    document.querySelector("#frames #gallery").innerHTML = "";
    for (var frame of board.frames)
      document.querySelector("#frames #gallery").appendChild(frame[0]);
    document.querySelectorAll("#frames #gallery img").forEach((x, i) => {
      x.onclick = (e) => {
        board.loadFrame(i);
        Frames.close();
      };
      x.oncontextmenu = (e) => {
        e.preventDefault();
        var del_confirmation = confirm("Delete?");
        if (del_confirmation) {
          board.deleteFrame(i);
          Frames.open();
        }
      };
    });
  }
  static close() {
    document.querySelector("#frames").style.transform =
      "translate(-50%,-50%) scale(0,0)";
  }
}

function createPalette(ele) {
  ele.innerHTML = window.colors
    .map(
      (x) =>
        `<div class="item" style="background-color: rgb(${x[0]},${x[1]},${x[2]})" ></div>`
    )
    .join("\n");
}

function showColorSettings(e) {
  document.querySelector("#color-settings-popup").style.display = "block";
  createPalette(
    document.querySelector("#color-settings-popup > div.color-palette")
  );
}

function exportColors() {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += window.colors.join("\n");

  console.log(csvContent);
  let encodedUri = encodeURI(csvContent);
  let link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "colors.csv");
  document.body.appendChild(link);

  link.click();
}

window.onload = function () {
  let canvasData = localStorage.getItem("pc-canvas-data");
  if (canvasData) {
    data = JSON.parse(canvasData);
    // console.log(data);
    window.colors = data.colors;
    if (window.board == undefined) {
      window.board = new Canvas(data.width, data.height);
    }

    let img = new Image();
    img.setAttribute("src", data.url);
    img.addEventListener("load", function () {
      window.board.ctx.drawImage(img, 0, 0);
    });
    /*
      window.board.frames = JSON.parse(data.frames).map(frame=>{
        let img = new Image();
        img.src = frame[0]
        return [img, frame[1]]
      });
      
      for(let f in data.frames){
        let c = document.createElement('canvas');
        c.width = data.width;
        c.height = data.height;
        let c_ctx = c.getContext('2d');
        c_ctx.drawImage(f[0], 0, 0);
        window.board.addFrame(c.toDataURL());
      }
     */

    window.board.steps = data.steps;
    window.board.redo_arr = data.redo_arr;
    window.board.setcolor(data.currColor);
    window.gif = new GIF({
      workers: 2,
      quality: 10,
      width: 10 * window.board.width,
      height: 10 * window.board.height,
    });
    window.gif.on("finished", function (blob) {
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.download = "canvas.gif";
      link.href = url;
      link.click();
    });
  } else {
    newProject();
  }

  let paletteDiv = document.querySelector("#palette");
  paletteDiv.innerHTML = colors
    .map(
      (x) =>
        `<div class="item" style="background-color: rgb(${x[0]},${x[1]},${x[2]})" onclick="board.setcolor([${x}]);act(this);" oncontextmenu="board.setcolor([${x}]);act(this);board.ctx.globalAlpha=+prompt('Transparency(0-1)?')"></div>`
    )
    .join("\n");

  // paletteDiv.innerHTML += '<div class="btn" ><i class="fa fa-upload"></i></div>';

  document
    .querySelector("#palette")
    .addEventListener("contextmenu", (e) => e.preventDefault());
};

document.querySelector("#close").onclick = function () {
  var width = +document.querySelector("#width").value;
  var height = +document.querySelector("#height").value;
  if (window.board == undefined) {
    window.board = new Canvas(width, height);
  }
  window.board.canvas.width = 10 * width; //display each pixel in 10 by 10pxs
  window.board.canvas.height = 10 * height;
  window.board.width = width; //Dimentions of x pixels
  window.board.height = height; //Dimentions of Y pixels
  window.board.canvas.style.display = "block";
  window.board.canvas.style.height =
    Math.floor((height / width) * window.board.canvas.clientWidth) + "px";
  window.board.w = +window.board.canvas.width;
  window.board.h = +window.board.canvas.height;
  window.board.ctx = window.board.canvas.getContext("2d");
  window.board.ctx.fillStyle = "white";
  window.board.ctx.globalAlpha = 1;
  window.board.ctx.fillRect(0, 0, window.board.w, window.board.h);
  window.board.data = [...Array(window.board.width)].map((e) =>
    Array(window.board.height).fill([255, 255, 255, 255])
  );
  window.board.steps = [];
  window.board.redo_arr = [];
  window.board.frames = [];

  window.board.setcolor([0, 0, 0, 255]);
  window.dim.close();
  window.gif = new GIF({
    workers: 2,
    quality: 10,
    width: 10 * window.board.width,
    height: 10 * window.board.height,
  });
  window.gif.on("finished", function (blob) {
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.download = "canvas.gif";
    link.href = url;
    link.click();
  });
};

// document.querySelector(".menubtn").onclick = function () {
//   document.querySelector(".menu").style.display =
//     document.querySelector(".menu").style.display != "block" ? "block" : "none";
// };

function newProject() {
  //   document.querySelector(".menu").style.display = "none";
  localStorage.removeItem("pc-canvas-data");
  window.dim = new Popup("#popup");
  window.colors = [
    [0, 0, 0, 255],
    [127, 127, 127, 255],
    [136, 0, 21, 255],
    [237, 28, 36, 255],
    [255, 127, 39, 255],
    [255, 242, 0, 255],
    [34, 177, 36, 255],
    [0, 162, 232, 255],
    [63, 72, 204, 255],
    [163, 73, 164, 255],
    [255, 255, 255, 255],
    [195, 195, 195, 255],
    [185, 122, 87, 255],
    [255, 174, 201, 255],
    [255, 201, 14, 255],
    [239, 228, 176, 255],
    [181, 230, 29, 255],
    [153, 217, 234, 255],
    [112, 146, 190, 255],
    [200, 191, 231, 255],
  ];
}
function filler(x, y, cc) {
  if (x >= 0 && x < board.width && y >= 0 && y < board.height) {
    if (
      JSON.stringify(board.data[x][y]) == JSON.stringify(cc) &&
      JSON.stringify(board.data[x][y]) != JSON.stringify(board.color)
    ) {
      board.draw(x, y);
      filler(x + 1, y, cc);
      filler(x, y + 1, cc);
      filler(x - 1, y, cc);
      filler(x, y - 1, cc);
    }
  }
}

function act(clr) {
  document.querySelectorAll("#palette .item").forEach((x) => {
    x.style.boxShadow = "";
    x.style.border = "";
  });
  clr.style.boxShadow = "10px 10px 10px 10px rgba(0,0,0,0.5)";
  clr.style.border = `1px white solid`;
}

// window.onbeforeunload = function () {
//   board.saveInLocal();
//   return "Data will be lost if you leave the page, are you sure?";
// };

var scope = {
  scope: "./",
};
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js", scope)
    .then(function (serviceWorker) {
      console.log("successful");
    })
    .catch(function (error) {
      alert("error");
    });
} else {
  console.log("unavailable");
}

// var msg;
// window.addEventListener("beforeinstallprompt", (e) => {
//   e.preventDefault();
//   msg = e;
//   // Shows the install button only when the app is installable
// //   document.querySelector("#install-pwa-btn").classList.remove("display-none");
// });

function install() {
  msg.prompt();
  msg.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === "accepted") {
      // Hides the install button
      document.querySelector("#install-pwa-btn").classList.add("display-none");
    }
  });
}

window.onerror = function (errorMsg, url, lineNumber) {
  alert("Error: " + errorMsg + " Script: " + url + " Line: " + lineNumber);
};
