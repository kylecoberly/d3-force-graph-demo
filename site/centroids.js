export function getCentroids(nodes) {
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
