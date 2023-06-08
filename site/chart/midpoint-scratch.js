export function generateMidPoints(count, { source, target }) {
	const midPoints = []
	// if (count % 2 === 0) count--

	for (let proportion = 2; count > 0; proportion *= 2, count -= 2) {
		if (count % 2 !== 0) {
			// Pivot value
			midPoints.push(...getMidPoint(proportion, { source, target }))
			// Since 2 will be taken off at increment
			count++
			continue
		}

		// if the proportion is 4
		// need to generate 2 points
		const proportion4 = 4
		const [xx1, yy1] = getMidPointPairs(proportion4, { source, target })
		const dxx1 = xx1 - source.x
		const dyy1 = yy1 - source.y
		const offsetFactor2 = (proportion8 / 2) - 1

		const xx5 = source.x + (dx3 * offsetFactor2)
		const yy5 = source.y + (dy3 * offsetFactor2)

		// if the proportion is 8
		// need to generate 4 points
		const proportion8 = 8
		const [x3, y3, x4, y4] = getMidPointPairs(proportion8, { source, target })
		const dx3 = x4 - x3
		const dy3 = y4 - y3
		const offsetFactor = (proportion8 / 2) - 1

		const x5 = source.x + (dx3 * offsetFactor)
		const y5 = source.y + (dy3 * offsetFactor)
		const x6 = target.x - (dx3 * offsetFactor)
		const y6 = target.y - (dy3 * offsetFactor)

		const [x1, y1, x2, y2] = getMidPointPairs(proportion, { source, target })

		midPoints.unshift(x1, y1)
		midPoints.push(x2, y2)
	}

	return midPoints
}

export function generateMidPointsAlt(count, { source, target }) {
	const dx = target.x - source.x
	const dy = target.y - source.y

	const segmentLengthX = dx / count
	const segmentLengthY = dy / count

	const midPoints = []
	for (let iteration = 1; iteration <= count; iteration++) {
		midPoints.push(segmentLengthX * iteration)
		midPoints.push(segmentLengthY * iteration)
	}

	return midPoints
}
