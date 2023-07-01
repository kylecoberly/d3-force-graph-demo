import data from "./data.json"
const { nodes, links, groups } = data
import runSimulation from "./chart/simulation/simulation.js"
import render from "./chart/rendering/render.js"

renderFilters(groups)

let simulation
rerender("all")

function rerender(id) {
	const normalizedLinks = id === "all"
		? links
		: links
			.filter(({ source, target }) => ([
				source.group,
				target.group
			].includes(id)))

	const normalizedNodes = Array.from(
		(new Set(
			normalizedLinks
				.flatMap(({ source, target }) => ([
					source,
					target,
				]))
		))
	).map(nodeId => nodes.find(({ id }) => id === nodeId))

	const normalizedGroups = Array.from(
		(new Set(
			normalizedNodes.map(({ group }) => group)
		))
	).map(groupName => groups.find(group => group.id === groupName))

	simulation = runSimulation({
		simulation,
		nodes: normalizedNodes,
		links: normalizedLinks,
		groups: normalizedGroups,
	})

	render({
		nodes: normalizedNodes,
		links: normalizedLinks,
		groups: normalizedGroups
	})
}

function renderFilters(groups) {
	const $nodeFiltersList = document.querySelector("#node-filters-list")

	const $allOption = document.createElement("option")
	$allOption.value = "all"
	$allOption.textContent = "All"
	$nodeFiltersList.append($allOption)

	groups
		.map(group => {
			const $option = document.createElement("option")
			$option.textContent = group.label
			$option.value = group.id
			return $option
		}).forEach($option => {
			$nodeFiltersList.append($option)
		})

	$nodeFiltersList
		.addEventListener("input", (event) => {
			rerender(event.target.value)
		})

	document
		.querySelector("#reset-filters")
		.addEventListener("click", () => {
			rerender("all")
		})

}
