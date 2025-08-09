/**
 * Helper function because number.toFixed often does not round correctly if last digit is 5
 * e.g. 25.675.toFixed(2) returns '25.67' instead of '25.68'. If we round with this function
 * first and then use toFixed, it works correctly.
 * @param value The number to round
 * @param decimals The number of decimal places to round to
 * @return The rounded number
 * @example round(25.675, 2) returns 25.68
 */

export function round(value: number, decimals: number): number {
    const shifter = Math.pow(10, decimals);
    const roundedValue = Math.sign(value) * Math.round(Math.abs(value * shifter));
    return roundedValue / shifter;
}
