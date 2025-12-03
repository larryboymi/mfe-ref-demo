import React from "react"
import { Card } from "./index"

export type SelectionDemoProps = {
  activeId: string | null
  ticks: number
  values: string[]
  onSelect: (id: string | null) => void
  onReset: () => void
}

export const SelectionDemo: React.FC<SelectionDemoProps> = ({
  activeId,
  ticks,
  values,
  onSelect,
  onReset,
}) => {
  const burstUpdate = () => {
    values.forEach((val, idx) => {
      setTimeout(() => onSelect(val), idx * 20)
    })
  }

  return (
    <Card title="Selection context demo">
      <div style={{ marginBottom: "0.5rem" }}>
        <div>Active: {activeId ?? "none"}</div>
        <div>Updates: {ticks}</div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {values.map((val) => (
          <button key={val} onClick={() => onSelect(val)}>
            Select {val}
          </button>
        ))}
        <button onClick={burstUpdate}>Burst updates</button>
        <button onClick={onReset}>Reset</button>
      </div>
    </Card>
  )
}
