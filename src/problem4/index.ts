/**
 * Implementation A: Iterative Approach
 *
 * Complexity: O(n)
 *   - Loop executes exactly n iterations
 */
function sum_to_n_a(n: number): number {
	let sum = 0;
	for (let i = 1; i <= n; i++) {
		sum += i;
	}
	return sum;
}


/**
 * Implementation B: Recursive Approach
 *
 * Complexity: O(n)
 *   - Makes n recursive calls (n, n-1, n-2, ..., 1)
 */
function sum_to_n_b(n: number): number {
	if (n <= 0) return 0;
	return n + sum_to_n_b(n - 1);
}


/**
 * Implementation C: Mathematical Formula (Gauss Formula)
 *
 * Complexity: O(1)
 *   - No loops or recursion
 */
function sum_to_n_c(n: number): number {
	return (n * (n + 1)) / 2;
}

// Test cases
// npx tsx src/problem3/index.ts
console.log('Testing sum_to_n functions:\n');

const testValues = [0, 5, 100];

testValues.forEach(n => {
	console.log(`n = ${n}:`);
	console.log(`  sum_to_n_a: ${sum_to_n_a(n)}`);
	console.log(`  sum_to_n_b: ${sum_to_n_b(n)}`);
	console.log(`  sum_to_n_c: ${sum_to_n_c(n)}`);
	console.log('');
});