import {
	centerToRadius,
	getSegmentCount,
	clampToLowerBound,
	generateMidPoints,
} from "../utilities.js"

function scale({ source, target }, factor = 0.1) {
	return {
		source: {
			...source,
			x: source.x * factor,
			y: source.y * factor,
		},
		target: {
			...target,
			x: target.x * factor,
			y: target.y * factor,
		}
	}
}

export default function getLinkLine({ source, target }) {
	const {
		source: normalizedSource,
		target: normalizedTarget
	} = centerToRadius(3, scale({ source, target }, 1))

	const segmentCount = getSegmentCount(2, { source: normalizedSource, target: normalizedTarget })
	const segments = generateMidPoints(
		clampToLowerBound(1, segmentCount - 1),
		{
			source: normalizedSource,
			target: normalizedTarget,
		},
	)

	return [
		normalizedSource.x, normalizedSource.y,
		...segments,
		normalizedTarget.x, normalizedTarget.y,
	]
}

