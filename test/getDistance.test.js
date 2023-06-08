import { getDistance } from "../site/chart/utilities.js"

test("#getDistance no movement", () => {
	const source = {
		x: 0,
		y: 0,
	}
	const target = {
		x: 0,
		y: 0,
	}

	const distance = getDistance(source, target)

	expect(distance).toEqual(0)
})

test("#getDistance forward from negative", () => {
	const source = {
		x: 0,
		y: -8,
	}
	const target = {
		x: 0,
		y: 0,
	}

	const distance = getDistance(source, target)

	expect(distance).toEqual(8)
})

test("#getDistance forward from positive", () => {
	const source = {
		x: 0,
		y: 8,
	}
	const target = {
		x: 0,
		y: 16,
	}

	const distance = getDistance(source, target)

	expect(distance).toEqual(8)
})

test("#getDistance forward across origin", () => {
	const source = {
		x: 0,
		y: -4,
	}
	const target = {
		x: 0,
		y: 4,
	}

	const distance = getDistance(source, target)

	expect(distance).toEqual(8)
})

test("#getDistance backward from positive", () => {
	const source = {
		x: 0,
		y: 8,
	}
	const target = {
		x: 0,
		y: 0,
	}

	const distance = getDistance(source, target)

	expect(distance).toEqual(8)
})

test("#getDistance backward from negative", () => {
	const source = {
		x: 0,
		y: -8,
	}
	const target = {
		x: 0,
		y: -16,
	}

	const distance = getDistance(source, target)

	expect(distance).toEqual(8)
})

test("#getDistance backward across origin", () => {
	const source = {
		x: 0,
		y: 4,
	}
	const target = {
		x: 0,
		y: -4,
	}

	const distance = getDistance(source, target)

	expect(distance).toEqual(8)
})
