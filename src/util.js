function isFunction(x) {
  return typeof x === "function";
}

function capitalize(x) {
  return typeof x === "string" && x.length !== 0
    ? x[0].toUpperCase() + x.slice(1)
    : x;
}

function isAlike(matcher) {
  return value => !matcher || value.includes(matcher);
}

function tap(x) {
  console.log(x);
  return x;
}

export { isAlike, isFunction, capitalize, tap };
