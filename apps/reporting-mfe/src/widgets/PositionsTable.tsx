import React from 'react'
import { Card } from '@demo/ui'
import { usePositions, useInstitutions } from '@demo/common'
import type { Institution } from '@demo/types'

const PositionsTable: React.FC = () => {
  const { institutions } = useInstitutions()
  const { data: positions, isLoading, isError } = usePositions()

  if (isLoading) {
    return <div>Loading positions…</div>
  }

  if (isError || !positions) {
    return <div>Unable to load positions.</div>
  }

  const total = positions.reduce((sum, p) => sum + p.value, 0)

  return (
    <div>
      <h2>Positions (Reporting MFE)</h2>
      <Card title="Positions">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th align="left">Symbol</th>
              <th align="right">Qty</th>
              <th align="right">Value</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((p) => {
              const inst = institutions.find((inst: Institution) => inst.id === p.institutionId)
              return (
                <tr key={p.id}>
                  <td>{`${p.symbol} ${inst ? `held @ ${inst.name})` : ""}`}</td>
                  <td align="right">{p.quantity}</td>
                  <td align="right">${p.value.toLocaleString()}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td />
              <td align="right">${total.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </Card>
    </div>
  )
}

export default PositionsTable
