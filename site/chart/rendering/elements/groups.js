import { move, fadeIn } from "../../utilities.js"
import getSmoothHull from "../../hull.js"
import options from "../options.js"

const {
	chart: {
		hullPadding,
	},
} = options


export default function renderGroups(group, groups) {
	group.call(fadeIn)

	group
		.append("path")
		.attr("d", ({ points }) => getSmoothHull(points, hullPadding))
		.attr("fill", ({ id }) => groups[id]["background-color"])

	group
		.append("text")
		.classed("group-label", true)
		.call(move)
		.attr("fill", ({ id }) => groups[id]["foreground-color"])
		.attr("text-anchor", "middle")
		.text(({ id }) => groups[id].label)
}
