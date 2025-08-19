
'use client';

import { useState } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';

interface TipState {
  step: 'amount' | 'confirm' | 'processing' | 'success' | 'error';
  amount: string;
  recipient: string;
  transactionHash?: string;
  error?: string;
}

const SUGGESTED_AMOUNTS = ['1', '5', '10', '25'];

export function TipFlow() {
  const { context } = useMiniKit();
  const [tipState, setTipState] = useState<TipState>({
    step: 'amount',
    amount: '',
    recipient: '',
  });

  const handleAmountSelect = (amount: string) => {
    setTipState(prev => ({ ...prev, amount }));
  };

  const handleCustomAmount = (amount: string) => {
    setTipState(prev => ({ ...prev, amount }));
  };

  const handleRecipientChange = (recipient: string) => {
    setTipState(prev => ({ ...prev, recipient }));
  };

  const handleConfirmTip = async () => {
    setTipState(prev => ({ ...prev, step: 'processing' }));
    
    try {
      // Mock transaction processing - in real app, use OnchainKit
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 40);
      setTipState(prev => ({
        ...prev,
        step: 'success',
        transactionHash: mockTxHash,
      }));
    } catch (error) {
      setTipState(prev => ({
        ...prev,
        step: 'error',
        error: 'Transaction failed. Please try again.',
      }));
    }
  };

  const resetTip = () => {
    setTipState({
      step: 'amount',
      amount: '',
      recipient: '',
    });
  };

  if (tipState.step === 'success') {
    return (
      <div className="card text-center animate-scale-in">
        <div className="w-16 h-16 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">✓</span>
        </div>
        <h2 className="text-heading mb-2">Tip Sent Successfully!</h2>
        <p className="text-body text-text-secondary mb-4">
          Your ${tipState.amount} USDC tip has been sent on-chain.
        </p>
        {tipState.transactionHash && (
          <div className="bg-bg rounded-lg p-3 mb-4">
            <div className="text-caption text-text-secondary mb-1">Transaction Hash</div>
            <div className="font-mono text-xs text-accent break-all">
              {tipState.transactionHash}
            </div>
          </div>
        )}
        <button onClick={resetTip} className="btn-primary w-full">
          Send Another Tip
        </button>
      </div>
    );
  }

  if (tipState.step === 'error') {
    return (
      <div className="card text-center animate-scale-in">
        <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">✗</span>
        </div>
        <h2 className="text-heading mb-2">Transaction Failed</h2>
        <p className="text-body text-text-secondary mb-4">
          {tipState.error}
        </p>
        <button onClick={resetTip} className="btn-primary w-full">
          Try Again
        </button>
      </div>
    );
  }

  if (tipState.step === 'processing') {
    return (
      <div className="card text-center animate-scale-in">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
        <h2 className="text-heading mb-2">Processing Transaction</h2>
        <p className="text-body text-text-secondary">
          Please confirm the transaction in your wallet and wait for confirmation.
        </p>
      </div>
    );
  }

  if (tipState.step === 'confirm') {
    return (
      <div className="card animate-scale-in">
        <h2 className="text-heading mb-4">Confirm Your Tip</h2>
        
        <div className="bg-bg rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-caption text-text-secondary">Amount</span>
            <span className="text-body font-semibold">${tipState.amount} USDC</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-caption text-text-secondary">To</span>
            <span className="text-body font-mono text-sm">
              {tipState.recipient.length > 20 
                ? `${tipState.recipient.slice(0, 6)}...${tipState.recipient.slice(-4)}`
                : tipState.recipient
              }
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-caption text-text-secondary">Network Fee</span>
            <span className="text-body">~$0.01</span>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setTipState(prev => ({ ...prev, step: 'amount' }))}
            className="btn-accent flex-1"
          >
            Back
          </button>
          <button onClick={handleConfirmTip} className="btn-primary flex-1">
            Send Tip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card animate-scale-in">
      <h2 className="text-heading mb-6">Send a Tip</h2>
      
      {/* Recipient Input */}
      <div className="mb-6">
        <label className="block text-caption text-text-secondary mb-2">
          Recipient Address or @username
        </label>
        <input
          type="text"
          value={tipState.recipient}
          onChange={(e) => handleRecipientChange(e.target.value)}
          placeholder="0x... or @username"
          className="input-field w-full"
        />
      </div>

      {/* Amount Selection */}
      <div className="mb-6">
        <label className="block text-caption text-text-secondary mb-3">
          Select Amount (USDC)
        </label>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          {SUGGESTED_AMOUNTS.map((amount) => (
            <button
              key={amount}
              onClick={() => handleAmountSelect(amount)}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                tipState.amount === amount
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <div className="text-body font-semibold">${amount}</div>
            </button>
          ))}
        </div>

        <div>
          <label className="block text-caption text-text-secondary mb-2">
            Custom Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
              $
            </span>
            <input
              type="number"
              value={tipState.amount}
              onChange={(e) => handleCustomAmount(e.target.value)}
              placeholder="0.00"
              className="input-field w-full pl-8"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Balance Info */}
      <div className="bg-bg rounded-lg p-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-caption text-text-secondary">Your USDC Balance</span>
          <span className="text-body font-semibold">$250.00</span>
        </div>
      </div>

      <button
        onClick={() => setTipState(prev => ({ ...prev, step: 'confirm' }))}
        disabled={!tipState.amount || !tipState.recipient || parseFloat(tipState.amount) <= 0}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
}
