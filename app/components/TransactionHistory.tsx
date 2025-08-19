
'use client';

import { useState, useEffect } from 'react';
import { useOpenUrl } from '@coinbase/onchainkit/minikit';

interface Tip {
  tipId: string;
  senderFarcasterId: string;
  senderWalletAddress: string;
  receiverWalletAddress: string;
  amount: number;
  currency: string;
  transactionHash: string;
  timestamp: string;
  senderDisplayName?: string;
  type: 'sent' | 'received';
}

export function TransactionHistory() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');
  const openUrl = useOpenUrl();

  useEffect(() => {
    // Mock transaction data - in real app, fetch from API
    const mockTips: Tip[] = [
      {
        tipId: '1',
        senderFarcasterId: '123',
        senderWalletAddress: '0xabc123...',
        receiverWalletAddress: '0x1234567...',
        amount: 5.00,
        currency: 'USDC',
        transactionHash: '0x1234567890abcdef...',
        timestamp: '2024-01-15T10:30:00Z',
        senderDisplayName: 'Alice Creator',
        type: 'received',
      },
      {
        tipId: '2',
        senderFarcasterId: '456',
        senderWalletAddress: '0x1234567...',
        receiverWalletAddress: '0xdef456...',
        amount: 2.50,
        currency: 'USDC',
        transactionHash: '0xabcdef1234567890...',
        timestamp: '2024-01-14T15:45:00Z',
        senderDisplayName: 'Bob Fan',
        type: 'sent',
      },
      {
        tipId: '3',
        senderFarcasterId: '789',
        senderWalletAddress: '0xghi789...',
        receiverWalletAddress: '0x1234567...',
        amount: 10.00,
        currency: 'USDC',
        transactionHash: '0x567890abcdef1234...',
        timestamp: '2024-01-13T09:15:00Z',
        senderDisplayName: 'Charlie Supporter',
        type: 'received',
      },
    ];
    setTips(mockTips);
  }, []);

  const filteredTips = tips.filter(tip => 
    filter === 'all' || tip.type === filter
  );

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const openTransaction = (hash: string) => {
    openUrl(`https://basescan.org/tx/${hash}`);
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex bg-surface rounded-lg p-1">
        {(['all', 'received', 'sent'] as const).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 capitalize ${
              filter === filterType
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {filterType}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="card animate-scale-in">
        <h3 className="text-heading mb-4">Transaction History</h3>
        
        {filteredTips.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-surface rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-body text-text-secondary">
              No transactions found for this filter.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTips.map((tip) => (
              <div
                key={tip.tipId}
                className="bg-bg rounded-lg p-4 hover:bg-surface transition-colors duration-200 cursor-pointer"
                onClick={() => openTransaction(tip.transactionHash)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tip.type === 'received' ? 'bg-accent' : 'bg-primary'
                    }`}>
                      <span className="text-white text-sm">
                        {tip.type === 'received' ? '↓' : '↑'}
                      </span>
                    </div>
                    <div>
                      <div className="text-body font-medium">
                        {tip.senderDisplayName || 'Anonymous'}
                      </div>
                      <div className="text-caption text-text-secondary">
                        {formatDate(tip.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-body font-semibold ${
                      tip.type === 'received' ? 'text-accent' : 'text-primary'
                    }`}>
                      {tip.type === 'received' ? '+' : '-'}${tip.amount.toFixed(2)}
                    </div>
                    <div className="text-caption text-text-secondary">{tip.currency}</div>
                  </div>
                </div>
                
                <div className="text-caption text-text-secondary font-mono break-all">
                  {tip.transactionHash.slice(0, 20)}...
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="card animate-slide-up">
        <h3 className="text-heading mb-4">Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-bg rounded-lg p-4 text-center">
            <div className="text-display text-accent mb-1">
              ${tips.filter(t => t.type === 'received').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
            </div>
            <div className="text-caption text-text-secondary">Total Received</div>
          </div>
          <div className="bg-bg rounded-lg p-4 text-center">
            <div className="text-display text-primary mb-1">
              ${tips.filter(t => t.type === 'sent').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
            </div>
            <div className="text-caption text-text-secondary">Total Sent</div>
          </div>
        </div>
      </div>
    </div>
  );
}
