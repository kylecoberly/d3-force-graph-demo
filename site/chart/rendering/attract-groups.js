import { getDistance, getCentroids } from "../utilities"

export default function attractGroups(nodes, alpha, {
	alphaCutoff,
	groupChargeStrength,
	groupDistanceCutoff,
	groupDistanceCutoffSpeed,
}) {
	const centroids = getCentroids(nodes)
	nodes.forEach(d => {
		groupCenter = {
			x: centroids[d.group].x,
			y: centroids[d.group].y,
		}
		nodePosition = {
			x: d.x,
			y: d.y,
		}
		const distanceToGroup = getDistance(groupCenter, nodePosition)

		let adjustedDistanceCutoff = (alpha < alphaCutoff)
			? groupDistanceCutoff + (groupDistanceCutoffSpeed * (alphaCutoff - alpha))
			: groupDistanceCutoff

		const defaultChargeStrength = 1 - groupChargeStrength
		if (distanceToGroup > adjustedDistanceCutoff) {
			d.x = (nodePosition.x * defaultChargeStrength) + (groupCenter.x * groupChargeStrength)
			d.y = (nodePosition.y * defaultChargeStrength) + (groupCenter.y * groupChargeStrength)
		}
	})
}
