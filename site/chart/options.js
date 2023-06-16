export const {
	dimensions,
	zoom,
	tickCount,
	chartBoundary,
	alphaCutoff,
	positionalForce,
	chargeStrength,
	collisionStrength,
	linkDistance,
	linkStrength,
	groupLinkStrength,
	groupChargeStrength,
	groupDistanceCutoff,
	groupDistanceCutoffSpeed,
} = {
	dimensions: {
		height: 800,
		width: 1500,
	},
	zoom: {
		initial: 4,
		minimum: 4,
		maximum: 30,
		constraintFactor: 6,
	},
	focus: {
		duration: 1000,
		scale: 18,
	},
	tickCount: 300,
	chartBoundary: 300,
	alphaCutoff: 0.3,
	positionalForce: {
		x: 0,
		y: 0,
	},
	chargeStrength: {
		initial: -100,
		final: -10,
	},
	collisionStrength: {
		initial: 0,
		final: 0,
	},
	linkDistance: {
		initial: 0.1,
		final: 1,
	},
	linkStrength: {
		initial: 0.2,
		final: 0.9,
	},
	groupLinkStrength: {
		initial: 1,
		final: 0.2,
	},
	groupChargeStrength: 0,
	groupDistanceCutoff: 5,
	groupDistanceCutoffSpeed: 100,
}
