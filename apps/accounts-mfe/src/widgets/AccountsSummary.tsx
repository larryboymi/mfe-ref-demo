import React from 'react'
import { Card, Button } from '@demo/ui'
import type { Account, Institution } from '@demo/types'
import { useAccounts, useInstitutions, useFavoritesActions, useFavoritesSnapshot } from '@demo/common'

const AccountsSummary: React.FC = () => {
  const { institutions } = useInstitutions()
  const [selected, setSelected] = React.useState<Account | null>(null)
  const { data: accounts, isLoading, isError } = useAccounts()
  const favorites = useFavoritesSnapshot()
  const { toggle } = useFavoritesActions()

  if (isLoading) {
    return <div>Loading accounts…</div>
  }

  if (isError || !accounts) {
    return <div>Unable to load accounts.</div>
  }

  return (
    <div>
      <h2>Accounts MFE</h2>
      {accounts.map((acct: Account) => {
        const inst = institutions.find((inst: Institution) => inst.id === acct.institutionId)
        const isFav = inst ? favorites.state.ids.includes(inst.id) : false
        return (
          <Card
            key={acct.id}
            title={
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{acct.name} {inst ? `(${inst.name})` : ""}</span>
                {inst && (
                  <button
                    aria-label="toggle favorite institution"
                    onClick={() => toggle(inst.id)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                  >
                    {isFav ? '❤️' : '🤍'}
                  </button>
                )}
              </span>
            }
          >
            <div>Balance: ${acct.balance.toLocaleString()}</div>
            <Button onClick={() => setSelected(acct)}>View details</Button>
          </Card>
        )
      })}
      {selected && (
        <Card title="Selected account">
          <div>ID: {selected.id}</div>
          <div>Name: {selected.name}</div>
          <div>Balance: ${selected.balance.toLocaleString()}</div>
        </Card>
      )}
    </div>
  )
}

export default AccountsSummary
