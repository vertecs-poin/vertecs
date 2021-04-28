export default class MathUtils {

  /**
   * Map a value between low and high to the 0 and 1 range
   */
  public static map(low: number, value: number, high: number): number {
    return (value - low) / (high - low);
  }
}
