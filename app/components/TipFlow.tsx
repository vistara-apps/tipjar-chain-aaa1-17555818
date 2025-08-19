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
        <div className="w-20 h-20 bg-accent rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg animate-pulse">
          <svg className="w-10 h-10 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h2 className="text-heading mb-3">Tip Sent Successfully!</h2>
        <div className="bg-accent/10 rounded-lg p-4 mb-5 inline-block">
          <span className="text-accent text-xl font-bold">${tipState.amount} USDC</span>
        </div>
        <p className="text-body text-text-secondary mb-5">
          Your tip has been successfully sent on-chain and will be received shortly.
        </p>
        {tipState.transactionHash && (
          <div className="bg-bg rounded-lg p-4 mb-5">
            <div className="text-caption text-text-secondary mb-2">Transaction Hash</div>
            <div className="font-mono text-xs text-accent break-all">
              {tipState.transactionHash}
            </div>
            <button 
              className="mt-2 text-xs text-text-secondary hover:text-accent transition-colors duration-200"
              onClick={() => window.open(`https://basescan.org/tx/${tipState.transactionHash}`, '_blank')}
            >
              View on BaseScan ↗
            </button>
          </div>
        )}
        <button onClick={resetTip} className="btn-primary w-full group">
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/>
              <path d="M12 8v4l3 3"/>
            </svg>
            Send Another Tip
          </span>
        </button>
      </div>
    );
  }

  if (tipState.step === 'error') {
    return (
      <div className="card text-center animate-scale-in">
        <div className="w-20 h-20 bg-red-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
          <svg className="w-10 h-10 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h2 className="text-heading mb-3">Transaction Failed</h2>
        <div className="bg-red-500/10 rounded-lg p-4 mb-5">
          <p className="text-red-400">
            {tipState.error || "There was an error processing your transaction. Please try again."}
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => window.open('https://help.base.org', '_blank')}
            className="flex-1 bg-bg hover:bg-surface text-text-primary py-3 rounded-lg font-medium transition-all duration-200 border border-white/10"
          >
            Get Help
          </button>
          <button onClick={resetTip} className="flex-1 btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (tipState.step === 'processing') {
    return (
      <div className="card text-center animate-scale-in">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-accent border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
          </div>
        </div>
        <h2 className="text-heading mb-3">Processing Transaction</h2>
        <p className="text-body text-text-secondary mb-4">
          Please confirm the transaction in your wallet and wait for confirmation.
        </p>
        <div className="bg-bg rounded-lg p-3 text-left">
          <div className="text-caption text-text-secondary mb-1">Transaction Status</div>
          <div className="flex items-center text-accent">
            <div className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse"></div>
            <span>Waiting for wallet confirmation...</span>
          </div>
        </div>
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
