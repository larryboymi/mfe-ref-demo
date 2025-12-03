import React from 'react'
import { SelectionDemo } from '@demo/ui'
import { useSelectionActions, useSelectionSnapshot } from '@demo/common'

const SelectionMirror: React.FC = () => {
  const snapshot = useSelectionSnapshot()
  const { select, reset } = useSelectionActions()

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>Shared selection (Accounts)</h3>
      <SelectionDemo
        activeId={snapshot.state.activeId}
        ticks={snapshot.ticks}
        values={['401k', 'Brokerage', 'IRA', '529']}
        onSelect={select}
        onReset={reset}
      />
    </div>
  )
}

export default SelectionMirror
