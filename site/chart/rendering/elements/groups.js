import { move, fadeIn } from "../animations.js"
import getSmoothHull from "../hull.js"

export default function renderGroups(selection, currentFilter) {
	selection
		.call(fadeIn)

	selection
		.append("path")
		.attr("d", ({ points }) => getSmoothHull(points))
		.attr("fill", (group) => group.id === currentFilter || currentFilter === "all" ? group["background-color"] : "none")

	selection
		.append("text")
		.classed("group-label", true)
		.classed("inactive", (group) => {
			return group.id !== currentFilter && currentFilter !== "all"
		})
		.call(move)
		.attr("fill", group => group["foreground-color"])
		.attr("text-anchor", "middle")
		.text(({ label }) => label)
}

export function setActiveGroup(selection, currentFilter) {
	selection
		.select("path")
		.classed("disabled", (group) => {
			return group.id !== currentFilter && currentFilter !== "all"
		})

	selection
		.select("text")
		.classed("disabled", (group) => {
			return group.id !== currentFilter && currentFilter !== "all"
		})
}
