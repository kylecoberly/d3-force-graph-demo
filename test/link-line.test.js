/**
 * @jest-environment jsdom
 */
import getLinkLine from "../site/chart/rendering/link-line.js"

test("linkLine works", () => {
	const source = {
		x: 0,
		y: 0,
	}
	const target = {
		x: 10,
		y: 10,
	}
	const linkLine = getLinkLine({ source, target })

	expect(linkLine).toEqual(expect.any(Array))
})

test.skip("linkLine works left to right", () => {
	const source = {
		x: 0,
		y: 0,
	}
	const target = {
		x: 10,
		y: 0,
	}
	const linkLine = getLinkLine({ source, target })
	expect(linkLine.length).toBe(4)

	const [x1, y1, x2, y2] = linkLine

	expect(x1).toBeGreaterThanOrEqual(source.x)
	expect(x1).toBeLessThan(x2)
	expect(x2).toBeLessThanOrEqual(target.x)

	expect(y1).toBe(0)
	expect(y2).toBe(0)
})

test.skip("linkLine works right to left", () => {
	const source = {
		x: 10,
		y: 0,
	}
	const target = {
		x: 0,
		y: 0,
	}
	const linkLine = getLinkLine({ source, target })
	expect(linkLine.length).toBe(4)

	const [x1, y1, x2, y2] = linkLine

	expect(x1).toBeLessThanOrEqual(source.x)
	expect(x1).toBeGreaterThan(x2)
	expect(x2).toBeGreaterThanOrEqual(target.x)

	expect(y1).toBe(0)
	expect(y2).toBe(0)
})
