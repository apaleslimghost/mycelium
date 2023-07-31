import React, {
	FC,
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { createRoot } from 'react-dom/client'
import { Stage, Layer, Group } from 'react-konva'
import { Dial } from './components/dial'

const root = createRoot(document.querySelector('main')!)

const AudioContextContext = createContext<AudioContext | null>(null)
const NodesContext = createContext<(node: AudioNode) => void>(() => {})

const Oscillator: FC<{
	x?: number
	y?: number
	defaultValue?: { frequency: number }
}> = ({ x = 0, y = 0, defaultValue = { frequency: 440 } }) => {
	const context = useContext(AudioContextContext)
	const addNode = useContext(NodesContext)
	const node = useMemo(() => {
		const osc = new OscillatorNode(context, {
			frequency: defaultValue.frequency,
			type: 'sawtooth',
		})
		osc.start()
		addNode(osc)
		return osc
	}, [context, defaultValue.frequency])

	return (
		<Group x={x} y={y}>
			<Dial
				x={0}
				y={0}
				label='Freq'
				onChange={(v) => node.frequency.setValueAtTime(v, 0)}
				defaultValue={
					Math.log(defaultValue.frequency / 20000) / Math.log(2000) + 1
				}
				mapValue={(v) => 20000 * 2000 ** (v - 1)}
				displayValue={(v) =>
					v < 1000 ? v.toFixed(0) + 'Hz' : (v / 1000).toFixed(2) + 'KHz'
				}
			/>
		</Group>
	)
}

const Filter: FC<{
	x?: number
	y?: number
	defaultValue?: { cutoff: number; q: number }
}> = ({ x = 0, y = 0, defaultValue = { cutoff: 2000, q: 1 } }) => {
	const context = useContext(AudioContextContext)
	const addNode = useContext(NodesContext)
	const node = useMemo(() => {
		const node = new BiquadFilterNode(context, {
			frequency: defaultValue.cutoff,
			Q: defaultValue.q,
			type: 'lowpass',
		})
		addNode(node)
		return node
	}, [context, defaultValue.cutoff, defaultValue.q])

	return (
		<Group x={x} y={y}>
			<Dial
				x={0}
				y={0}
				label='Cutoff'
				onChange={(v) => node.frequency.setValueAtTime(v, 0)}
				defaultValue={
					Math.log(defaultValue.cutoff / 20000) / Math.log(2000) + 1
				}
				mapValue={(v) => 20000 * 2000 ** (v - 1)}
				displayValue={(v) =>
					v < 1000 ? v.toFixed(0) + 'Hz' : (v / 1000).toFixed(2) + 'KHz'
				}
			/>
			<Dial
				x={50}
				y={0}
				label='Q'
				onChange={(v) => node.Q.setValueAtTime(v, 0)}
				defaultValue={defaultValue.q / 20}
				mapValue={(v) => v * 20}
			/>
		</Group>
	)
}

const App = () => {
	const [started, setStarted] = useState(false)
	const [nodes, setNodes] = useState<AudioNode[]>([])
	const context = useMemo(() => new AudioContext(), [])

	return (
		<>
			{started ? (
				<AudioContextContext.Provider value={context}>
					<NodesContext.Provider
						value={(node) => setNodes((nodes) => [...nodes, node])}
					>
						<Stage width={300} height={100}>
							<Layer>
								<Oscillator x={50} y={50} />
								<Filter x={100} y={50} />
							</Layer>
						</Stage>
					</NodesContext.Provider>
				</AudioContextContext.Provider>
			) : (
				<button
					onClick={async () => {
						await context.resume()
						console.log('audio resumed')
						setStarted(true)
					}}
				>
					start audio
				</button>
			)}
			<ul>
				{nodes.map((node, i) => (
					<li key={i}>{node.constructor.name}</li>
				))}
			</ul>
		</>
	)
}

root.render(<App />)
