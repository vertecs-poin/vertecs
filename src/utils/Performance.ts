export default class Performance {
  public static timeOrigin = new Date().getTime();

  public static now(): number {
    if (typeof window !== "undefined") {
      return performance.now();
    }
    return new Date().getTime() - Performance.timeOrigin;
  }
}
