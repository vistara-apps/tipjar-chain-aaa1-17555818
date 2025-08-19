
'use client';

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from '@coinbase/onchainkit/minikit';
import {
  Name,
  Identity,
  Address,
  Avatar,
} from '@coinbase/onchainkit/identity';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import { useEffect, useState, useCallback } from 'react';
import { CreatorProfile } from './components/CreatorProfile';
import { TipFlow } from './components/TipFlow';
import { TransactionHistory } from './components/TransactionHistory';

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [activeView, setActiveView] = useState<'profile' | 'tip' | 'history'>('profile');
  const [frameAdded, setFrameAdded] = useState(false);

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  return (
    <div className="flex flex-col min-h-screen bg-bg text-text-primary">
      <div className="w-full max-w-lg mx-auto px-4 py-3">
        {/* Header */}
        <header className="flex justify-between items-center mb-6 h-11">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div>
              <h1 className="text-heading text-text-primary">TipJar Chain</h1>
              <p className="text-caption text-text-secondary">Instant on-chain tips</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Wallet className="z-10">
              <ConnectWallet>
                <Name className="text-inherit text-sm" />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                </Identity>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>

            {context && !context.client.added && (
              <button
                onClick={handleAddFrame}
                className="btn-primary text-xs px-3 py-2"
              >
                + Save
              </button>
            )}

            {frameAdded && (
              <div className="flex items-center text-xs text-accent animate-fade-in">
                ✓ Saved
              </div>
            )}
          </div>
        </header>

        {/* Navigation */}
        <nav className="flex mb-6 bg-surface rounded-lg p-1">
          <button
            onClick={() => setActiveView('profile')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
              activeView === 'profile'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveView('tip')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
              activeView === 'tip'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Send Tip
          </button>
          <button
            onClick={() => setActiveView('history')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
              activeView === 'history'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            History
          </button>
        </nav>

        {/* Main Content */}
        <main className="flex-1 animate-fade-in">
          {activeView === 'profile' && <CreatorProfile />}
          {activeView === 'tip' && <TipFlow />}
          {activeView === 'history' && <TransactionHistory />}
        </main>

        {/* Footer */}
        <footer className="mt-6 pt-4 text-center">
          <button
            onClick={() => openUrl('https://base.org/builders/minikit')}
            className="text-text-secondary text-xs hover:text-text-primary transition-colors duration-200"
          >
            Built on Base with MiniKit
          </button>
        </footer>
      </div>
    </div>
  );
}
