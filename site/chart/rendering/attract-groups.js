export default function attractGroups(nodes, alpha) {
	const centroids = getCentroids(nodes)
	nodes.forEach(d => {
		const cx = centroids[d.group].x;
		const cy = centroids[d.group].y;
		const x = d.x;
		const y = d.y;

		const dx = cx - x;
		const dy = cy - y;
		const r = Math.sqrt(dx * dx + dy * dy)

		let distanceCutoff = 3;
		if (alpha < 0.2) {
			distanceCutoff = 3 + (100 * (0.2 - alpha))
		}

		if (r > distanceCutoff) {
			d.x = x * 0.9 + cx * 0.1;
			d.y = y * 0.9 + cy * 0.1;
		}
	})
}

function getCentroids(nodes) {
	const groupCoordinates = getGroupCoordinates(nodes)

	return Object
		.entries(groupCoordinates)
		.reduce((centroids, [group, coordinates]) => {
			const count = coordinates.length;
			let tx = 0;
			let ty = 0;

			coordinates.forEach(([x, y]) => {
				tx += x;
				ty += y;
			})

			const cx = tx / count;
			const cy = ty / count;

			centroids[group] = { x: cx, y: cy }

			return centroids
		}, {})
}

function getGroupCoordinates(nodes) {
	return nodes.reduce((groupCoordinates, node) => {
		groupCoordinates[node.group] = groupCoordinates[node.group] || []
		groupCoordinates[node.group].push([node.x, node.y])
		return groupCoordinates
	}, {})
}
