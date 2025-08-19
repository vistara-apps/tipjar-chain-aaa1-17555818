'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { Address } from '@coinbase/onchainkit/identity';

interface Creator {
  farcasterId: string;
  baseWalletAddress: string;
  displayName: string;
}

interface Tip {
  tipId: string;
  senderFarcasterId: string;
  senderWalletAddress: string;
  receiverWalletAddress: string;
  amount: number;
  currency: string;
  transactionHash: string;
  timestamp: string;
}

interface CreatorProfileProps {
  creator: Creator;
  tips: Tip[];
}

export default function CreatorProfile(props?: CreatorProfileProps) {
  const { context } = useMiniKit();
  const [totalTips, setTotalTips] = useState(0);
  const [creator, setCreator] = useState<Creator>({
    farcasterId: 'creator123',
    baseWalletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    displayName: 'Demo Creator'
  });
  const [tips, setTips] = useState<Tip[]>([]);

  useEffect(() => {
    // If props are provided, use them; otherwise use mock data
    if (props?.creator) {
      setCreator(props.creator);
    }
    
    if (props?.tips) {
      setTips(props.tips);
    } else {
      // Mock data for demonstration
      setTips([
        {
          tipId: '1',
          senderFarcasterId: 'user456',
          senderWalletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
          receiverWalletAddress: creator.baseWalletAddress,
          amount: 5,
          currency: 'USDC',
          transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          timestamp: new Date().toISOString()
        },
        {
          tipId: '2',
          senderFarcasterId: 'user789',
          senderWalletAddress: '0x9876543210fedcba9876543210fedcba98765432',
          receiverWalletAddress: creator.baseWalletAddress,
          amount: 10,
          currency: 'USDC',
          transactionHash: '0xfedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210',
          timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        }
      ]);
    }
  }, [props]);

  useEffect(() => {
    const total = tips.reduce((sum, tip) => sum + tip.amount, 0);
    setTotalTips(total);
  }, [tips]);

  const formatAddress = (address: string): `0x${string}` => {
    if (address.startsWith('0x')) {
      return address as `0x${string}`;
    }
    return `0x${address}` as `0x${string}`;
  };

  return (
    <div className="bg-surface rounded-lg p-lg shadow-card">
      {/* Profile Header */}
      <div className="flex items-center space-x-md mb-lg">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
          <span className="text-heading text-white font-bold">
            {creator.displayName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <h2 className="text-heading text-text-primary">{creator.displayName}</h2>
          <p className="text-caption text-text-secondary">@{creator.farcasterId}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-md mb-lg">
        <div className="bg-bg rounded-md p-md text-center">
          <div className="text-display text-accent">{tips.length}</div>
          <div className="text-caption text-text-secondary">Tips Received</div>
        </div>
        <div className="bg-bg rounded-md p-md text-center">
          <div className="text-display text-accent">{totalTips.toFixed(2)}</div>
          <div className="text-caption text-text-secondary">USDC Total</div>
        </div>
      </div>

      {/* Wallet Address */}
      <div className="mb-lg">
        <div className="bg-bg rounded-md p-md">
          <div className="text-caption text-text-secondary mb-1">Wallet Address</div>
          <div className="font-mono text-sm text-text-primary break-all">
            <Address address={formatAddress(creator.baseWalletAddress)} />
          </div>
        </div>
      </div>

      {/* Recent Tips */}
      <div>
        <h3 className="text-heading text-text-primary mb-md">Recent Tips</h3>
        {tips.length === 0 ? (
          <div className="text-center py-lg">
            <div className="text-caption text-text-secondary">No tips received yet</div>
          </div>
        ) : (
          <div className="space-y-sm">
            {tips.slice(0, 5).map((tip) => (
              <div key={tip.tipId} className="bg-bg rounded-md p-md">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-body text-text-primary font-semibold">
                      {tip.amount} {tip.currency}
                    </div>
                    <div className="text-caption text-text-secondary">
                      From @{tip.senderFarcasterId}
                    </div>
                  </div>
                  <div className="text-caption text-text-secondary">
                    {new Date(tip.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
