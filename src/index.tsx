import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Arc, Circle, Group, Layer, Rect, Stage, Text } from 'react-konva'
import { Dial } from './components/dial'

const root = createRoot(document.querySelector('main')!)

const App = () => (
	<Stage width={300} height={100}>
		<Layer>
			<Dial label='Foo' x={50} y={50} defaultValue={0.4} />
			<Dial
				label='Bar'
				x={100}
				y={50}
				defaultValue={0.6}
				mapValue={(v) => v * 100}
				displayValue={(v) => v.toFixed(0) + '%'}
			/>
			<Dial
				label='Baz'
				x={150}
				y={50}
				defaultValue={0.6}
				onChange={console.log}
				mapValue={(v) => 20000 * 2000 ** (v - 1)}
				displayValue={(v) =>
					v < 1000 ? v.toFixed(0) + 'Hz' : (v / 1000).toFixed(2) + 'KHz'
				}
			/>
		</Layer>
	</Stage>
)

root.render(<App />)
