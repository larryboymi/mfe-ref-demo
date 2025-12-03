import React from 'react'
import { Card } from '@demo/ui'
import { usePositions, useInstitutions, useFavoritesActions, useFavoritesSnapshot } from '@demo/common'
import type { Institution } from '@demo/types'

const PositionsTable: React.FC = () => {
  const { institutions } = useInstitutions()
  const { data: positions, isLoading, isError } = usePositions()
  const favorites = useFavoritesSnapshot()
  const { toggle } = useFavoritesActions()

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
              const isFav = inst ? favorites.state.ids.includes(inst.id) : false
              return (
                <tr key={p.id}>
                  <td>
                    {`${p.symbol} ${inst ? `held @ ${inst.name})` : ""}`}{' '}
                    {inst && (
                      <button
                        aria-label="toggle favorite institution"
                        onClick={() => toggle(inst.id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                      >
                        {isFav ? '❤️' : '🤍'}
                      </button>
                    )}
                  </td>
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
