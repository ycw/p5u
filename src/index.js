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
  const f = ({ graphics, contain, useCss, noRedraw }) => { // resize fn
    const r = p5.width / p5.height; // ratio
    let cw = contain.w;
    let ch = contain.h;
    if (contain instanceof HTMLElement) {
      const r = contain.getBoundingClientRect(); // container dims
      cw = r.width;
      ch = r.height;
    }
    let w = cw;
    let h = w / r;
    if (h > ch) {
      h = ch;
      w = h * r;
    }
    for (const g of graphics) {
      if (useCss) g.canvas.style.transform = `scale(${w / g.width}, ${h / g.height})`;
      else g.resizeCanvas(w, h, noRedraw);
    }
  };
  let t = null; // debounce timer
  return ({
    graphics = [p5], // p5.Graphics []
    contain = p5.canvas.parentElement, // html elm | { w , h }
    useCss = false, // true=scale by css; false=resize drawing buffer
    noRedraw = false, // used by `p5.resizeCanvas()`
    delay = 100, // debounce t in ms
  } = {}) => {
    clearTimeout(t);
    t = setTimeout(() => f({ graphics, contain, useCss, noRedraw }), delay);
  };
};