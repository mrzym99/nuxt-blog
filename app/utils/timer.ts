export default class Timer {
  t: number; // 总计时时间（毫秒）
  s: number; // 开始时间（毫秒）
  r: boolean; // 是否正在运行
  constructor() {
    this.t = 0;
    this.s = 0;
    this.r = false;
  }

  start() {
    if (!this.r) {
      this.s = performance.now();
      this.r = true;
    }
  }
  /**
   * 暂停计时
   * @param {number} redundant 冗余时间 ms
   */
  pause(redundant: number = 0) {
    if (this.r) {
      this.t += performance.now() - this.s;
      // 减去冗余时间 ms
      if (this.t >= redundant) {
        this.t -= redundant;
      }
      this.r = false;
    }
  }
  resume() {
    this.start();
  }
  end() {
    this.pause();
    return this.t;
  }
  get time() {
    return this.r ? this.t + (performance.now() - this.s) : this.t;
  }
}
