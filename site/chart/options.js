export const {
	chart,
	zoom,
	focus,
	simulation,
	forces,
} = {
	chart: {
		height: 600,//window.innerHeight * 0.8,
		width: 1000,//window.innerWidth * 0.8,
		boundary: 400,//window.innerWidth * 0.7,
	},
	zoom: {
		initial: 4,
		minimum: 4,
		maximum: 30,
		constraintFactor: 7,
	},
	focus: {
		duration: 500,
		scale: 18,
	},
	simulation: {
		tickCount: 300,
		alphaCutoff: 0.3,
	},
	forces: {
		positional: {
			x: 0,
			y: 0,
		},
		charge: {
			initial: -100,
			final: -10,
		},
		collision: {
			initial: 0,
			final: 0,
		},
		link: {
			distance: {
				initial: 0.1,
				final: 1,
			},
			strength: {
				initial: 0.2,
				final: 0.9,
			},
		},
		group: {
			charge: 0.5,
			link: {
				strength: {
					initial: 1,
					final: 0.5,
				},
			},
			distance: {
				cutoff: 30,
				rate: 100,
			},
		},
	},
}
