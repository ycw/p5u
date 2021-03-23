export default function p5u(p5) {
  const fpsDat = {
    c: 0, // frame count
    r: 0, // frame rates sum
    f: 0 // last average fps
  };
  return {
    frame: fFrame(p5, fpsDat), // call once in `p5.draw()`
    fps: fFps(p5, fpsDat), // return average fps
    resize: fResize(p5), // call once in `p5.windowResized`
  };
}



const fFrame = (p5, dat) => {
  return ({ rate = 60 } = {}) => { // `rate` should be eq to`p5.frameRate(rate)`
    dat.c += 1; // incr frame count
    dat.r += p5.frameRate(); // sum framerate
    if (dat.c === rate) { // enough samples?  
      dat.f = dat.r / rate + 0.5 | 0; // round the avg fps
      dat.c = dat.r = 0; // reset
    }
  }
};



const fFps = (p5, dat) => {
  return () => dat.f; // the most recent average fps
};


 
const fResize = (p5) => {
  const f = ({ useCss, parent, noRedraw }) => { // resize fn
    const r = p5.width / p5.height; // ratio
    const { width, height } = parent.getBoundingClientRect(); // container dims
    let w = width;
    let h = w / r;
    if (h > height) {
      h = height;
      w = h * r;
    }
    if (useCss) p5.canvas.style.transform = `scale(${w / p5.width}, ${h / p5.height})`;
    else p5.resizeCanvas(w, h, noRedraw);
  };
  let t = null; // debounce timer
  return ({ 
    useCss = false, 
    parent = p5.canvas.parentElement, 
    delay = 100,
    noRedraw = false,
  } = {}) => {
    clearTimeout(t);
    setTimeout(() => f({ useCss, parent, noRedraw }), delay);
  };
};