import React from 'react'
import { Card, Button } from '@demo/ui'
import type { Account } from '@demo/types'
import { useAccounts, useInstitutions } from '@demo/common'

const AccountsSummary: React.FC = () => {
  const { institutions } = useInstitutions()
  const [selected, setSelected] = React.useState<Account | null>(null)
  const { data: accounts, isLoading, isError } = useAccounts()

  if (isLoading) {
    return <div>Loading accounts…</div>
  }

  if (isError || !accounts) {
    return <div>Unable to load accounts.</div>
  }

  return (
    <div>
      <h2>Accounts (Accounts MFE)</h2>
      {accounts.map((acct) => {
        const inst = institutions.find((inst) => inst.id === acct.institutionId)
        return (
          <Card key={acct.id} title={`${acct.name} ${inst ? `(${inst.name})` : ""}`}>
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
