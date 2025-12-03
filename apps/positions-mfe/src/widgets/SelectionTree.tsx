import React from 'react'
import { SelectionDemo } from '@demo/ui'
import { useSelectionActions, useSelectionSnapshot } from '@demo/common'

const SelectionTree: React.FC = () => {
  const snapshot = useSelectionSnapshot()
  const { select, reset } = useSelectionActions()

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>Cross-component selection</h3>
      <SelectionDemo
        activeId={snapshot.state.activeId}
        ticks={snapshot.ticks}
        values={['Stock', 'Bond', 'Future', 'Alt Asset']}
        onSelect={select}
        onReset={reset}
      />
    </div>
  )
}

export default SelectionTree
