const basecolors = {
	'dark-blue': '#005687',
	'mid-blue': '#0468b1',
	'light-blue': '#32bee1',
	'dark-red': '#a51e41',
	'mid-red': '#fa1c26',
	'light-red': '#f03c8c',
	'dark-green': '#418246',
	'mid-green': '#61b233',
	'light-green': '#b4dc28',
	'dark-yellow': '#fa7814',
	'mid-yellow': '#ffc10e',
	'light-yellow': '#fff32a',
	'dark-grey': '#000000',
	'mid-grey': '#646464',
	'light-grey': '#969696',
}
const colors = [
	basecolors['mid-blue'],
	basecolors['mid-yellow'],
	basecolors['light-red'],
	basecolors['light-green']
]

const offsetFirstRow = false

function setupSVG (kwargs) {
	const { width, height } = kwargs
	const svg = d3.select('svg')
	.attrs({ 
		'x': 0,
		'y':0,
		'viewBox': `0 0 ${width} ${height}`,
		'preserveAspectRatio': 'xMidYMid meet'
	})
	return svg
}

function findBestTextDisplay (svg, text, maxwidth) {
	const terms = text.split(' ');
	const lines = [];
	let start = 0;
	let end = 1;

	function getWidth (terms, start, end, maxwidth) {
		const txt = svg.addElems('text', 'dummy hide')
		.text(terms.slice(start, end));
		const { width } = txt.node().getBBox();
		txt.remove()
		if (width < maxwidth && end < terms.length) {
			return getWidth(terms, start, end + 1, maxwidth);
		} else {
			return [start, end]
		}
	}

	if (end === terms.length) return terms
	else {
		while (end <= terms.length) {
			const bounds = getWidth(terms, start, end, maxwidth);
			start = bounds[0];
			end = bounds[1];
			const line = terms.slice(start, end);
			lines.push(line.join(' '))

			start = end;
			end = end + 1;
		}
	}

	return lines;
}

function drawSankey () {
	const { clientWidth: cw, clientHeight: ch, offsetWidth: ow, offsetHeight: oh } = d3.select('body').node()
	const width = Math.min(cw ?? ow, 1080) //Math.round(Math.min(cw ?? ow, ch ?? oh))
	const height = ch ?? oh //width
	const padding = 60
	const edit_layout = true

	const svg = setupSVG({ width, height })

	fetch('https://github.com/UNDP-Accelerator-Labs/AI-map/blob/main/data/acclab_data_innovation.csv')
	.then(res => res.text())
	.then(data => console.log(data))
	.catch(err => console.log(err))

	// d3.csv('../data/acclab_data_innovation.csv')
	d3.csv('https://github.com/UNDP-Accelerator-Labs/AI-map/blob/main/data/acclab_data_innovation.csv')
	.then(data => {
		console.log(data)
		// data.shuffle()
		const levels = ['Aggregate datasource', 'Technique', 'Area', 'Lab']//.reverse()
		// const levels = ['Lab', 'Datasource', 'Aggregate datasource', 'Area'].reverse()
		
		const lists = levels.map(d => {
			return {
				key: d,
				values: data.unique(d, true).sort((a, b) => a?.localeCompare(b))
			}
		})

		const x = levels.map((d, i) => {
			return d3.scaleLinear()
			.range([padding, width - padding])
			.domain([0, lists.find(c => c.key === d).values.length + 2])
		})	

		const y = d3.scaleLinear()
			.range([padding, height - padding * 2])
			.domain([0, levels.length - 1])

		const rows = svg.addElems('g', 'level', levels)
		.attr('transform', (d, i) => `translate(${[0, y(i)]})`)
		const base = rows.addElems('g', 'base', d => {
			const entries = lists.find(c => c.key === d).values
			return entries.map(c => {
				const obj = {}
				obj.level = levels.indexOf(d)
				obj.value = c
				return obj
			})
		}).attr('transform', (d, i) => {
			let y = 0
			
			if (offsetFirstRow) {
				if (d.level === 0) {
					if (i % 2 !== 0) y = -45
					else y = -15
				} else if (d.level % 3 === 0) {
					if (i % 2 !== 0) y = 60
					else y = 15
				}
			} else {
				if (d.level === 0) {
					y = -15
				} else if (d.level % 3 === 0) {
					if (i % 2 !== 0) y = 60
					else y = 15
				}
			}
			
			return `translate(${[x[d.level](i + 1), y]})`
		})

		const multiline = true
		if (multiline) {
			base.addElems('text')
			.styles({
				'text-anchor': 'middle',
				'font-face': 'Helvetica, Arial, Sans-serif',
				'font-size': '12px',
				'fill': basecolors['mid-grey'],
			}).on('mouseover', function (d) {
				const connection = d3.selectAll('path.connection').filter(c => c.target === d.value);
				highlight(connection);
			}).on('mouseout', _ => {
				resetHighlight();
			}).addElems('tspan', 'line', d => {
				const maxwidth = (width - padding * 2) / (Math.max(...x[d.level].domain()) + 2);
				const lines = findBestTextDisplay(svg, d.value, maxwidth);
				return lines
			}).attrs({
				'x': 0,
				'dy': (d, i) => i === 0 ? 0 : 12 * 1.3,
			}).text(d => d)
		} else {
			base.addElems('text')
			.styles({
				'text-anchor': 'middle',
				'font-face': 'Helvetica, Arial, Sans-serif',
				'font-size': '12px',
				'fill': basecolors['mid-grey'],
			}).text(d => d.value)
			.on('mouseover', function (d) {
				const connection = d3.selectAll('path.connection').filter(c => c.target === d.value);
				highlight(connection);
			}).on('mouseout', _ => {
				resetHighlight();
			})
		}

		let hierarchy = []
		levels.forEach((d, i) => {
			if (i > 0) {
				const prev = levels[i - 1]
				const nest = data.nest(c => `${c[prev]}---${c[d]}`)
				nest.forEach(c => {
					const sources = lists.find(c => c.key === prev).values
					const targets = lists.find(c => c.key === d).values

					c.source = c.key.split('---')[0]
					c.target = c.key.split('---')[1]

					let x1 = x[levels.indexOf(prev)](sources.indexOf(c.source) + 1)
					let x2 = x[levels.indexOf(d)](targets.indexOf(c.target) + 1)
					let y1 = levels.indexOf(prev) % 3 === 0 ? y(levels.indexOf(prev)) : y(levels.indexOf(prev)) + 10
					let y2 = levels.indexOf(d) % 3 === 0 ? y(levels.indexOf(d)) : y(levels.indexOf(d)) - 15

					if (offsetFirstRow) {
						if (i - 1 === 0) {
							if (sources.indexOf(c.source) % 2 !== 0) y1 -= 35
						} else if (i % 3 === 0) {
							if (targets.indexOf(c.target) % 2 !== 0) y2 += 45
						}
					} else {
						if (i % 3 === 0) {
							if (targets.indexOf(c.target) % 2 !== 0) y2 += 45
						}
					}

					c.from = [x1, y1]
					c.q1 = [x1, y1 + (y2 - y1) / 2]
					c.q2 = [x2, y1 + (y2 - y1) / 2]
					c.to = [x2, y2]
					c.level = d
					c.level_id = i
				})
				hierarchy.push(nest)
			}
		})
		hierarchy = hierarchy.flat()

		const w = d3.scaleLinear()
			.domain([1, d3.max(hierarchy, d => d.count)])
			.range([1, 10])

		svg.addElems('path', 'connection', hierarchy)
		.attr('d', d => `M ${d.from.join(' ')} C ${d.q1.join(' ')}, ${d.q2.join(' ')}, ${d.to.join(' ')}`)
		.styles({
			'stroke': d => {
				const { values } = lists.find(c => c.key === 'Aggregate datasource')
				if (values.includes(d.values[0]['Aggregate datasource'])) return colors[values.indexOf(d.values[0]['Aggregate datasource'])]
				else if (values.includes(d.target)) return colors[values.indexOf(d.target)]
				
			},'fill': 'none',
			'stroke-width': d => w(d.count),
			'stroke-linecap': 'round',
			'stroke-opacity': .5
		}).on('mouseover', function () {
			const sel = d3.select(this);
			highlight(sel);
		}).on('mouseout', _ => {
			resetHighlight();
		})

	function highlight (sel) {
		// let { level_id, source, target } = sel.datum()
		let level_id = sel.data().unique('level_id', true)[0]
		let source = sel.data().unique('source', true)
		let target = sel.data().unique('target', true)

		sel.classed('highlight', true)
		.classed('dim', false)
		.moveToFront();

		if (level_id === levels.length - 1) { // IF A LEAF IS INSPECTED
			const branch = data.filter(c => {
				return target.includes(c[levels[level_id]]) && source.includes(c[levels[level_id - 1]])
			})
			d3.selectAll('path.connection')
			.classed('dim', c => {
				return levels.every((b, k) => {
					if (k < levels.length -1) {
						return !(branch.some(a => a[b] === c.source && a[levels[k + 1]] === c.target));
					} else return true;
				})
			})
			d3.selectAll('path.connection:not(.dim)')
			.moveToFront()
			.classed('highlight', true);
		} else {
			while (level_id >= 0) {
				if (!Array.isArray(source)) source = [source]
				const prevPath = d3.selectAll('path.connection').filter(c => source.includes(c.target))
				.moveToFront()
				.classed('highlight', true);
				source = prevPath.data().unique('source', true);
				d3.selectAll('path.connection:not(.highlight)')
				.classed('dim', true);
				
				level_id --
			}
		}

		const nodes = d3.selectAll('path.connection.highlight').data().map(d => [d.source, d.target]).flat().unique()
		d3.selectAll('g.base')
		.classed('highlight', c => nodes.includes(c.value))
		.classed('dim', c => !nodes.includes(c.value))
	}
	function resetHighlight () {
		d3.selectAll('path.connection, g.base')
		.classed('highlight dim', false);
	}

	}).catch(err => console.log(err))
}


document.addEventListener('DOMContentLoaded', drawSankey)