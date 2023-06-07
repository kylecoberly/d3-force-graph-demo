import { getSine, getSegmentCount } from "../utilities"

export default function getLinkLine({ source, target }) {
	const { sine, cosine } = getSine(4, { target, source })
	source = {
		...source,
		x: source.x + cosine,
		y: source.y + sine,
	}
	target = {
		...target,
		x: target.x - cosine,
		y: target.y - sine,
	}

	const segmentCount = getSegmentCount(10, { source, target })
	const segments = generateMidPoints(segmentCount - 1, { source, target })
	// const segments = generateMidPoints(1, { source, target })

	return [
		source.x, source.y,
		// source.x, source.y,
		...segments,
		// ...getMidPoint(2, { source, target }),
		// target.x, target.y
		target.x, target.y,
	]
}

export function generateMidPoints(count, { source, target }) {
	const midPoints = []
	if (count % 2 === 0) count--

	for (let proportion = 2; count > 0; proportion += 2, count -= 2) {
		if (count % 2 !== 0) {
			// Pivot value
			midPoints.push(...getMidPoint(proportion, { source, target }))
			// Since 2 will be taken off at increment
			count++
			continue
		}
		const [x1, y1] = getMidPoint(proportion, { source, target })
		const [x2, y2] = [
			target.x === source.x
				? target.x
				: target.x > source.x
					? source.x + (Math.abs(x1) * 3)
					: source.x - x1,
			target.y === source.y
				? target.y
				: target.y > source.y
					? source.y + (Math.abs(y1) * 3)
					: source.y - y1,
		]

		midPoints.unshift(x1, y1)
		midPoints.push(x2, y2)
	}

	return midPoints
}

export function getMidPoint(proportion, { source, target }) {
	return [
		((target.x - source.x) * (1 / proportion)) + source.x,
		((target.y - source.y) * (1 / proportion)) + source.y,
	]
}
