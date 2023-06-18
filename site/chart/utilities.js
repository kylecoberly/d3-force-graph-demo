import { min, max } from "d3"

export function getCentroids(nodes) {
	const groupCoordinates = getGroupCoordinates(nodes)

	const centroids = Object
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

	return centroids
}

export function getGroupCoordinates(nodes) {
	return nodes.reduce((groupCoordinates, node) => {
		groupCoordinates[node.group] = groupCoordinates[node.group] || []
		groupCoordinates[node.group].push([node.x, node.y])
		return groupCoordinates
	}, {})
}

export function getDistance({ x: x1, y: y1 }, { x: x2, y: y2 }) {
	const positionDifferential = {
		x: x1 > x2 ? x1 - x2 : x2 - x1,
		y: y1 > y2 ? y1 - y2 : y2 - y1,
	}

	return Math.sqrt(
		positionDifferential.x ** 2
		+ positionDifferential.y ** 2
	)
}

export function getLinkCounts(links) {
	return links.reduce((counts, link) => {
		counts[link.source] = counts[link.source] ?? { from: 0, to: 0 }
		counts[link.target] = counts[link.target] ?? { from: 0, to: 0 }
		counts[link.source].from = counts[link.source].from + 1
		counts[link.target].to = counts[link.target].to + 1
		return counts
	}, {})
}

export function toDegrees(radians) {
	return radians * (180 / Math.PI)
}

export function clampToBoundary(nodes, size) {
	nodes.forEach(d => {
		d.x = max([d.x, -size])
		d.y = max([d.y, -size])
		d.x = min([d.x, size])
		d.y = min([d.y, size])
	})
}
