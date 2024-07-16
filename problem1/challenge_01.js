var sum_to_n_a = function (n) {
  if (n < 0) return 0;

  let sum = 0;
  let i = 1;
  while (i <= n) {
    sum += i;
    i++;
  }
  return sum;
};

var sum_to_n_b = function (n) {
  if (n < 0) return 0;

  return (n * (n + 1)) / 2;
};

var sum_to_n_c = function (n) {
  if (n < 0) return 0;

  return Array.from({ length: n }, (_, i) => i + 1).reduce(
    (acc, cur) => acc + cur,
    0
  );
};

console.time("sum_to_n_a");
console.log(sum_to_n_a(3));
console.timeEnd("sum_to_n_a");

console.time("sum_to_n_b");
console.log(sum_to_n_b(3));
console.timeEnd("sum_to_n_b");

console.time("sum_to_n_c");
console.log(sum_to_n_c(3));
console.timeEnd("sum_to_n_c");
