import React from 'react'
import { Card, Button } from '@demo/ui'
import { useQuery } from '@tanstack/react-query'
import type { Account } from '@demo/types'
import { accountsQueryKey, fetchAccounts } from '@demo/common/api/accounts'

const AccountsSummary: React.FC = () => {
  const [selected, setSelected] = React.useState<Account | null>(null)
  const { data: accounts, isLoading, isError } = useQuery({
    queryKey: accountsQueryKey,
    queryFn: fetchAccounts,
  })

  if (isLoading) {
    return <div>Loading accounts…</div>
  }

  if (isError || !accounts) {
    return <div>Unable to load accounts.</div>
  }

  return (
    <div>
      <h2>Accounts (Accounts MFE)</h2>
      {accounts.map((acct) => (
        <Card key={acct.id} title={acct.name}>
          <div>Balance: ${acct.balance.toLocaleString()}</div>
          <Button onClick={() => setSelected(acct)}>View details</Button>
        </Card>
      ))}
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
