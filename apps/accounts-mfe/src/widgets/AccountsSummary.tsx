import React from 'react';
import { Card, Button } from '@demo/ui';
import type { Account } from '@demo/types';

const mockAccounts: Account[] = [
  { id: '1', name: 'Retirement 401k', balance: 150000 },
  { id: '2', name: 'Brokerage', balance: 55000 }
];

const AccountsSummary: React.FC = () => {
  const [selected, setSelected] = React.useState<Account | null>(null);

  return (
    <div>
      <h2>Accounts (Accounts MFE)</h2>
      {mockAccounts.map((acct) => (
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
  );
};

export default AccountsSummary;
