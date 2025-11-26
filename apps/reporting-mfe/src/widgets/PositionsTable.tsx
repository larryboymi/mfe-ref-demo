import React from 'react';
import { Card } from '@demo/ui';
import type { Position } from '@demo/types';

const mockPositions: Position[] = [
  { id: '1', symbol: 'AAPL', quantity: 50, value: 9500 },
  { id: '2', symbol: 'TSLA', quantity: 10, value: 2500 }
];

const PositionsTable: React.FC = () => {
  const total = mockPositions.reduce((sum, p) => sum + p.value, 0);

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
            {mockPositions.map((p) => (
              <tr key={p.id}>
                <td>{p.symbol}</td>
                <td align="right">{p.quantity}</td>
                <td align="right">${p.value.toLocaleString()}</td>
              </tr>
            ))}
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
  );
};

export default PositionsTable;
