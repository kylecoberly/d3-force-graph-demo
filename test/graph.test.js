/**
 * @jest-environment jsdom
 */
import { runSimulation } from "../site/chart/simulation.js"

test("simulation renders", () => {
	const nodes = [{
		"id": "Quality",
		"group": "quality",
		"critical": true,
		"complete": true
	},
	{
		"id": "Naming",
		"group": "quality",
		"critical": true,
		"complete": true
	}]
	const links = [{
		"source": "Quality",
		"target": "Naming"
	}]

	const simulation = runSimulation({ nodes, links })

	expect(simulation.nodes()[0].x).toEqual(expect.any(Number))
	expect(simulation.nodes()[0].y).toEqual(expect.any(Number))
	expect(simulation.nodes()[1].x).toEqual(expect.any(Number))
	expect(simulation.nodes()[1].y).toEqual(expect.any(Number))
})
