import { move, fadeIn } from "../animations.js"
import getSmoothHull from "../hull.js"

export default function renderGroups(group) {
	group
		.call(fadeIn)

	group
		.append("path")
		.attr("d", ({ points }) => getSmoothHull(points))
		.attr("fill", (group) => group["background-color"])

	group
		.append("text")
		.classed("group-label", true)
		.call(move)
		.attr("fill", (group) => group["foreground-color"])
		.attr("text-anchor", "middle")
		.text(({ label }) => label)
}
