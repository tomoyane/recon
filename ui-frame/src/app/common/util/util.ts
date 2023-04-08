export class Util {
  public static hourSecond = 3600;
  public static minutesSecond = 60;

  public static convertTime(time: number) {
    const hour = Math.floor(time / this.hourSecond) === 0 ? 0 : (time / this.hourSecond);
    const hourStr = ('00' + hour).slice(-2);

    const minutes = Math.floor(time / this.minutesSecond);
    const minutesStr = ('00' + minutes).slice(-2);

    const seconds = time % this.minutesSecond;
    const secondsStr = ('00' + seconds).slice(-2);

    return hourStr + ':' + minutesStr + ':' + secondsStr;
  }

  public static getDefaultKeyName(map: Map<string, string>, isVideo: boolean = false) {
    let keyName = null;
    let cacheValue = null;
    let i = 0;
    map.forEach((k, v) => {
      if (i === 0) {
        cacheValue = v;
      }
      if (k === 'default') {
        keyName = v;
      }
      if (isVideo && v.includes('FaceTime')) {
        keyName = v;
      }
      i++;
    });
    if (keyName === null) {
      keyName = cacheValue;
    }
    return keyName;
  }

  public static getPosition(el) {
    let x = 0;
    let y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return {top: y, left: x};
  }
}
