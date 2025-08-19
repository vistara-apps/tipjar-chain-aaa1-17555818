'use client';

import React from 'react';
import { useState } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';

interface TipButtonProps {
  creatorAddress: string;
  creatorName: string;
  onTipSent?: (amount: number) => void;
}

export default function TipButton({ creatorAddress, creatorName, onTipSent }: TipButtonProps) {
  const { context } = useMiniKit();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

  const predefinedAmounts = ['1', '5', '10', '25'];

  const handleTip = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setIsLoading(true);
    try {
      // Here you would integrate with your payment provider (Privy/Turnkey)
      // For now, we'll simulate the transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onTipSent?.(parseFloat(amount));
      setIsOpen(false);
      setAmount('1');
    } catch (error) {
      console.error('Tip failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (address: string): `0x${string}` => {
    if (address.startsWith('0x')) {
      return address as `0x${string}`;
    }
    return `0x${address}` as `0x${string}`;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out transform hover:scale-105 shadow-card animate-pulse"
      >
        💰 Tip {creatorName}
      </button>
    );
  }

  return (
    <div className="bg-surface rounded-lg p-lg shadow-card">
      <div className="flex justify-between items-center mb-md">
        <h3 className="text-heading text-text-primary">Send Tip</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-text-secondary hover:text-text-primary"
        >
          ✕
        </button>
      </div>

      <div className="mb-md">
        <div className="text-caption text-text-secondary mb-sm">To: {creatorName}</div>
        <div className="text-caption text-text-secondary font-mono break-all">
          {formatAddress(creatorAddress)}
        </div>
      </div>

      <div className="mb-md">
        <label className="text-caption text-text-secondary mb-sm block">Amount (USDC)</label>
        <div className="grid grid-cols-4 gap-sm mb-sm">
          {predefinedAmounts.map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(preset)}
              className={`py-sm px-md rounded-md text-sm font-medium transition-colors duration-fast ${
                amount === preset
                  ? 'bg-accent text-white'
                  : 'bg-bg text-text-primary hover:bg-accent/20'
              }`}
            >
              ${preset}
            </button>
          ))}
        </div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Custom amount"
          className="w-full bg-bg border border-text-secondary/20 rounded-md px-md py-sm text-text-primary placeholder:text-text-secondary focus:border-accent focus:outline-none"
          min="0.01"
          step="0.01"
        />
      </div>

      <button
        onClick={handleTip}
        disabled={isLoading || !amount || parseFloat(amount) <= 0}
        className="w-full bg-accent hover:bg-accent/90 disabled:bg-text-secondary/20 disabled:text-text-secondary text-white py-3 rounded-lg font-semibold transition-all duration-200"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            <span>Sending...</span>
          </div>
        ) : (
          <span className="flex items-center justify-center">
            <span className="mr-2">Send ${amount} USDC</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        )}
      </button>
    </div>
  );
}
