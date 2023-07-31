import React, { useState } from 'react'
import { Arc, Circle, Group, Layer, Rect, Stage, Text } from 'react-konva'

export const Dial: React.FC<{
	label?: string
	radius?: number
	x?: number
	y?: number
	defaultValue?: number
	onChange?: (value: number) => void
	mapValue?: (value: number) => number
	displayValue?: (value: number) => string
}> = ({
	label,
	x,
	y,
	defaultValue,
	radius = 20,
	onChange,
	mapValue = (v) => v,
	displayValue = (v) => v.toFixed(2),
}) => {
	const [rawValue, setRawValue] = useState(defaultValue)
	const [dragging, setDragging] = useState(false)
	const totalAngle = 300
	const rotation = 90 + (360 - totalAngle) / 2

	return (
		<Group>
			<Arc
				innerRadius={0.8 * radius}
				outerRadius={radius}
				angle={totalAngle * (1 - rawValue)}
				x={x}
				y={y}
				rotation={rotation + totalAngle * rawValue}
				fill='black'
			/>
			<Arc
				innerRadius={0.8 * radius}
				outerRadius={radius}
				angle={totalAngle * rawValue}
				x={x}
				y={y}
				rotation={rotation}
				fill='cyan'
			/>

			<Rect
				strokeWidth={dragging ? 1 : 0}
				dash={[1, 1]}
				stroke='black'
				fill='transparent'
				width={radius * 2}
				height={radius * 2}
				x={x - radius}
				y={y - radius}
				onMouseOver={(event) => {
					if (event.evt.target instanceof HTMLElement) {
						event.evt.target.style.cursor = 'grab'
					}
				}}
				onMouseOut={(event) => {
					if (event.evt.target instanceof HTMLElement) {
						event.evt.target.style.cursor = 'default'
					}
				}}
				onMouseDown={(event) => {
					setDragging(true)
					if (event.evt.target instanceof Element) {
						event.evt.target.requestPointerLock()
					}
				}}
				onMouseUp={(event) => {
					setDragging(false)
					document.exitPointerLock()
				}}
				onMouseMove={(event) => {
					if (dragging) {
						setRawValue((value) => {
							const newValue = Math.max(
								0,
								Math.min(1, value - event.evt.movementY / 100),
							)
							if (onChange) onChange(mapValue(newValue))
							return newValue
						})
					}
				}}
				onDblClick={() => {
					setRawValue(defaultValue)
				}}
			/>

			<Text
				text={displayValue(mapValue(rawValue))}
				align='center'
				width={2 * radius}
				x={x - radius}
				y={y + radius}
			/>
			{label && (
				<Text
					text={label}
					align='center'
					width={2 * radius}
					x={x - radius}
					y={y - radius - 16}
				/>
			)}
		</Group>
	)
}
