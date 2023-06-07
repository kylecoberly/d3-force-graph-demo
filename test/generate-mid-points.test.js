import { generateMidPoints } from "../site/chart/rendering/link-line.js"

describe("#generateMidPoints", () => {
	test("1 point, positive, up/right", () => {
		const count = 1
		const source = {
			x: 3,
			y: 3,
		}
		const target = {
			x: 5,
			y: 5,
		}

		const midPoints = generateMidPoints(count, { source, target })

		expect(midPoints).toEqual([4, 4])
	})

	test("1 point, positive, upright", () => {
		const count = 1
		const source = {
			x: 6,
			y: 6,
		}
		const target = {
			x: 10,
			y: 10,
		}

		const midPoints = generateMidPoints(count, { source, target })

		expect(midPoints).toEqual([8, 8])
	})

	test("1 point, postive, up", () => {
		const count = 1
		const source = {
			x: 10,
			y: 6,
		}
		const target = {
			x: 10,
			y: 10,
		}

		const midPoints = generateMidPoints(count, { source, target })

		expect(midPoints).toEqual([10, 8])
	})

	test("3 points, positive, right", () => {
		const count = 3
		const source = {
			x: 0,
			y: 8,
		}
		const target = {
			x: 8,
			y: 8,
		}

		const midPoints = generateMidPoints(count, { source, target })

		expect(midPoints).toEqual([2, 8, 4, 8, 6, 8])
	})

	test("3 points, positive, up/right", () => {
		const count = 3
		const source = {
			x: 0,
			y: 0,
		}
		const target = {
			x: 0,
			y: 15,
		}

		const midPoints = generateMidPoints(count, { source, target })

		expect(midPoints).toEqual([0, 3.75, 0, 7.5, 0, 11.25])
	})

	test("3 points, positive, down", () => {
		const count = 3
		const source = {
			x: 0,
			y: 15,
		}
		const target = {
			x: 0,
			y: 0,
		}

		const midPoints = generateMidPoints(count, { source, target })

		expect(midPoints).toEqual([0, 11.25, 0, 7.5, 0, 3.75])
	})

	test("4 points, postive, down", () => {
		const count = 4
		const source = {
			x: 0,
			y: 10,
		}
		const target = {
			x: 0,
			y: 0,
		}

		const midPoints = generateMidPoints(count, { source, target })

		expect(midPoints).toEqual([0, 7.5, 0, 5, 0, 2.5])
	})

	test("2 points, negative, up/right", () => {
		const count = 2
		const source = {
			x: -10,
			y: -10,
		}
		const target = {
			x: -6,
			y: -6,
		}

		const midPoints = generateMidPoints(count, { source, target })

		expect(midPoints).toEqual([-8, -8])
	})

	test("3 points, cross-origin, up/right", () => {
		const count = 3
		const source = {
			x: -4,
			y: -4,
		}
		const target = {
			x: 4,
			y: 4,
		}

		const midPoints = generateMidPoints(count, { source, target })

		expect(midPoints).toEqual([-2, -2, 0, 0, 2, 2])
	})
})
