import * as d3 from "d3"
import simulation from "./simulation"

export function ticked({ circle, link, text }) {
	return () => {
		const nodes = simulation.nodes()

		const groupCoordinates = nodes.reduce((groupCoordinates, node) => {
			// Initialize
			groupCoordinates[node.group] = groupCoordinates[node.group] || []
			groupCoordinates[node.group].push([node.x, node.y])
			return groupCoordinates
		}, {})

		const centroids = Object.entries(groupCoordinates).reduce((centroids, [group, coordinates]) => {
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

		// don't modify points close the the group centroid:
		let minDistance = 3;

		// modify the min distance as the force cools:
		const alpha = simulation.alpha()
		if (simulation < 0.2) {
			minDistance = 3 + (1000 * (0.2 - alpha))
		}

		nodes.forEach(d => {
			const cx = centroids[d.group].x;
			const cy = centroids[d.group].y;
			const x = d.x;
			const y = d.y;

			const dx = cx - x;
			const dy = cy - y;
			const r = Math.sqrt(dx * dx + dy * dy)

			// if (r > minDistance) {
			// 	d.x = x * 0.9 + cx * 0.1;
			// 	d.y = y * 0.9 + cy * 0.1;
			// }
		})
		nodes.forEach(d => {
			d.x = d3.max([d.x, -300])
			d.y = d3.max([d.y, -300])
			d.x = d3.min([d.x, 300])
			d.y = d3.min([d.y, 300])
		})

		// Weaken charge and strengthen links over time
		if (alpha < 0.2) {
			simulation.force("charge", d3.forceManyBody()
				.strength(-20)
			)
				.force("link", d3.forceLink()
					.id(d => d.id)
					.distance(3)
					.strength(1)
				)
		}

		circle
			.attr("cx", d => d.x)
			.attr("cy", d => d.y)

		link
			.attr("points", d => {
				const radius = 4
				const angle = Math.atan2(d.target.y - d.source.y, d.target.x - d.source.x)
				const cosine = Math.cos(angle) * radius
				const sine = Math.sin(angle) * radius
				return [
					// x1
					d.source.x + cosine,
					// y1
					d.source.y + sine,
					// Midpoint
					(d.source.x / 2) + (d.target.x / 2), (d.source.y / 2) + (d.target.y / 2),
					// x2
					d.target.x - cosine,
					// y2
					d.target.y - sine,
				]
			})

		text
			.attr("x", d => d.x)
			.attr("y", d => d.y + 6)
			.attr("text-anchor", "middle")
			.text(d => d.id)
	}
}
