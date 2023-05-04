import React from 'react';
import ReactDOM from 'react-dom/client';
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));


const autoRun = async () => {
  const selector = await setupWalletSelector({
    network: "testnet",
    modules: [setupNearWallet()],
  });

  const modal = setupModal(selector, {
    contractId: "test.testnet",
  });

  modal.show();
}
autoRun();