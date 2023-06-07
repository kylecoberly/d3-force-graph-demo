import { getMidPoint } from "../site/chart/rendering/link-line.js"

test("#getMidPoint simple forward hypotenuse, halfway", () => {
	const proportion = 2
	const source = {
		x: 0,
		y: 8,
	}
	const target = {
		x: 8,
		y: 8,
	}

	const midPoint = getMidPoint(proportion, { source, target })

	expect(midPoint).toEqual([4, 8])
})

test("#getMidPoint simple forward hypotenuse, 1/4 mark", () => {
	const proportion = 4
	const source = {
		x: 0,
		y: 8,
	}
	const target = {
		x: 8,
		y: 8,
	}

	const midPoint = getMidPoint(proportion, { source, target })

	expect(midPoint).toEqual([2, 8])
})

test("#getMidPoint positive backward horizontal line, 1/4 mark", () => {
	const proportion = 4
	const source = {
		x: 8,
		y: 8,
	}
	const target = {
		x: 0,
		y: 8,
	}

	const midPoint = getMidPoint(proportion, { source, target })

	expect(midPoint).toEqual([6, 8])
})

test("#getMidPoint negative forward horizontal line, 1/4 mark", () => {
	const proportion = 4
	const source = {
		x: -8,
		y: -8,
	}
	const target = {
		x: 0,
		y: -8,
	}

	const midPoint = getMidPoint(proportion, { source, target })

	expect(midPoint).toEqual([-6, -8])
})

test("#getMidPoint postive backward vertical line, 1/4 mark", () => {
	const proportion = 4
	const source = {
		x: 0,
		y: 8,
	}
	const target = {
		x: 0,
		y: 0,
	}

	const midPoint = getMidPoint(proportion, { source, target })

	expect(midPoint).toEqual([0, 6])
})

test("#getMidPoint cross-origin backward vertical line, 1/4 mark", () => {
	const proportion = 4
	const source = {
		x: 0,
		y: 4,
	}
	const target = {
		x: 0,
		y: -4,
	}

	const midPoint = getMidPoint(proportion, { source, target })

	expect(midPoint).toEqual([0, 2])
})

test("#getMidPoint cross-origin backward vertical line, halfway mark", () => {
	const proportion = 2
	const source = {
		x: 0,
		y: 4,
	}
	const target = {
		x: 0,
		y: -4,
	}

	const midPoint = getMidPoint(proportion, { source, target })

	expect(midPoint).toEqual([0, 0])
})
