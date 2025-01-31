function add(x: number, y: number): number {
	return Math.ceil((x * 10) + (y * 10)) / 10;
}

test('test - expect : 기본 test', () => {
	expect(add(1, 2)).toBe(3);
});

const context = describe;

describe('describe - it - expect : add 함수는', () => {
	it('returns number', () => {
		expect(typeof add(1, 2)).toBe('number');
	});

	context('두 개의 양수가 주어졌을 때', () => {
		it('두 숫자의 합을 돌려준다', () => {
			expect(add(1, 2)).toBe(3);
		});
		it('항상 두 숫자보다 큰 값을 돌려준다', () => {
			expect(add(1, 2)).toBeGreaterThan(1);
			expect(add(1, 2)).toBeGreaterThan(2);
		});
	});
	context('양수와 음수가 주어졌을 때', () => {
		it('항상 양수보다 작은 값을 돌려준다', () => {
			expect(add(1, -2)).toBeLessThan(1);
		});
	});

	context('0.1과 0.2가 주어져도', () => {
		it('항상 이상한 값을 돌려주지 않는다', () => {
			expect(add(0.1, 0.2)).toBe(0.3);
		});
	});
});
