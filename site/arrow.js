export default function addArrow(container) {
	container
		.append("defs")
		.append("marker")
		.attr("id", "arrow")
		.attr("viewBox", [0, 0, 10, 10])
		.attr("refX", 5)
		.attr("refY", 5)
		.attr("markerWidth", 3)
		.attr("markerHeight", 3)
		.attr("orient", "auto")
		.attr("class", "arrow")
		.append("path")
		.attr("d", `
			M 0 0
			L 10 5
			L 0 10
			z
		`)
}
