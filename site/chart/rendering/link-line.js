import { getDistance } from "../utilities"

export default function getLinkLine({ source, target }) {
	const radius = 4
	const angle = Math.atan2(target.y - source.y, target.x - source.x)
	const cosine = Math.cos(angle) * radius
	const sine = Math.sin(angle) * radius

	const distance = getDistance(source, target)

	const segmentLength = 10
	const segmentCount = Math.floor(distance / segmentLength)

	// const segments = generateMidPoints({ source, target }, segmentCount)

	return [
		source.x + cosine, source.y + sine,
		// ...segments,
		...generateMidPoint({ source, target }, 2),
		target.x - cosine, target.y - sine,
	]
}

// function generateMidPoints({ source, target }, count) {
// 	const midPoints = []
//
// 	const [x, y] = generateMidPoint({ source, target }, count)
//
// 	for (let segment = 1; segment < count; segment++) {
// 		midPoints.push(x * segment, y)
// 	}
//
// 	return midPoints
// }

function generateMidPoint({ source, target }, proportion) {
	return [
		(source.x / proportion) + (target.x / proportion),
		(source.y / proportion) + (target.y / proportion),
	]
}
