const curry = func => {
  const curried = (...args) => args.length >= func.length
      ? func(...args)
      : (...args2) => curried(...args, ...args2);

  return curried;
};

// example

function sum(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sum);

console.log( curriedSum(1, 2, 3) ); // 6, can still be called normally
console.log( curriedSum(1)(2,3) ); // 6, first argument currying
console.log( curriedSum(1)(2)(3) ); // 6, currying all arguments
