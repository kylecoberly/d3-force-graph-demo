import { max, min } from "d3"

export default function clampToBoundary(nodes, size) {
	nodes.forEach(d => {
		d.x = max([d.x, -size])
		d.y = max([d.y, -size])
		d.x = min([d.x, size])
		d.y = min([d.y, size])
	})
}
