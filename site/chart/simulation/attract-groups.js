import { getDistance, getCentroids } from "../utilities.js"

export default function attractGroups(nodes, alpha, {
	alphaCutoff,
	chargeStrength,
	distanceCutoff,
	distanceRate,
}) {
	const centroids = getCentroids(nodes)
	nodes.forEach(d => {
		const groupCenter = {
			x: centroids[d.group].x,
			y: centroids[d.group].y,
		}
		const nodePosition = {
			x: d.x,
			y: d.y,
		}
		const distanceToGroup = getDistance(groupCenter, nodePosition)

		let adjustedDistanceCutoff = (alpha < alphaCutoff)
			? distanceCutoff + (distanceRate * (alphaCutoff - alpha))
			: distanceCutoff

		const charge = 1 - chargeStrength
		if (distanceToGroup > adjustedDistanceCutoff) {
			d.x = (nodePosition.x * charge) + (groupCenter.x * charge)
			d.y = (nodePosition.y * charge) + (groupCenter.y * charge)
		}
	})
}
