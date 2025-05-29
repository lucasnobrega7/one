'use client'

import React, { memo } from 'react'
import { EdgeProps, getBezierPath, BaseEdge } from '@xyflow/react'

const CustomEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        stroke: selected ? '#ff6d5a' : '#666',
        strokeWidth: 2,
        transition: 'stroke 0.2s ease',
      }}
      className="hover:!stroke-[#ff6d5a]"
    />
  )
})

CustomEdge.displayName = 'CustomEdge'

export default CustomEdge