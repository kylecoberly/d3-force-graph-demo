import getCentroids from "./centroids"

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
