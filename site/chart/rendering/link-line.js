import {
	centerToRadius,
	getSegmentCount,
	clampToLowerBound,
	generateMidPoints,
	generateMidPointsAlt,
} from "../utilities"

export default function getLinkLine({ source, target }) {
	const {
		source: normalizedSource,
		target: normalizedTarget
	} = centerToRadius(4, { source, target })
	// } = { source, target }

	const segmentCount = getSegmentCount(2, { source: normalizedSource, target: normalizedTarget })
	// const segments = generateMidPoints(
	// 	clampToLowerBound(1, segmentCount - 1),
	// 	{
	// 		source: normalizedSource,
	// 		target: normalizedTarget
	// 	},
	// )
	const segments = generateMidPointsAlt(
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

