import BN from "bn.js";
import numberToBN from "number-to-bn";

function isString(s) {
  return typeof s === "string" || s instanceof String;
}

const zero = new BN(0);
const negative1 = new BN(-1);

export function fromDecimalValue(
  amount: number | string,
  decimals: number
): BN {
  var wei = numberToBN(amount); // eslint-disable-line
  var negative = wei.lt(zero); // eslint-disable-line
  const ten = new BN(10);
  const base = ten.pow(new BN(decimals));

  if (negative) {
    wei = wei.mul(negative1);
  }

  var fraction = wei.mod(base).toString(10); // eslint-disable-line

  while (fraction.length < decimals) {
    fraction = `0${fraction}`;
  }

  var whole = wei.div(base).toString(10); // eslint-disable-line

  var value = `${whole}${fraction == "0" ? "" : `.${fraction}`}`; // eslint-disable-line

  if (negative) {
    value = `-${value}`;
  }

  return value;
}

export function toDecimalValue(amount: number | string, decimals: number): BN {
  let value = amount + "";
  if (!isString(value)) {
    throw new Error("Pass strings to prevent floating point precision issues.");
  }
  const ten = new BN(10);
  const base = ten.pow(new BN(decimals));

  // Is it negative?
  let negative = value.substring(0, 1) === "-";
  if (negative) {
    value = value.substring(1);
  }

  if (value === ".") {
    throw new Error(
      `Invalid value ${value} cannot be converted to` +
        ` base unit with ${decimals} decimals.`
    );
  }

  // Split it into a whole and fractional part
  let comps = value.split(".");
  if (comps.length > 2) {
    throw new Error("Too many decimal points");
  }

  let whole: string | BN = comps[0],
    fraction: string | BN = comps[1];

  if (!whole) {
    whole = "0";
  }
  if (!fraction) {
    fraction = "0";
  }
  if (fraction.length > decimals) {
    throw new Error("Too many decimal places");
  }

  while (fraction.length < decimals) {
    fraction += "0";
  }

  whole = new BN(whole);
  fraction = new BN(fraction);
  let wei = whole.mul(base).add(fraction);

  if (negative) {
    wei = wei.neg();
  }

  return new BN(wei.toString(10), 10);
}
