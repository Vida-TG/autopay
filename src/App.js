import './App.css';
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";

function App() {

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
  //autoRun();
  return (
    <div className="App">
      <header className="App-header">
        <p>
          <button onClick={autoRun}>Connect Wallet</button>
        </p>
      </header>
    </div>
  );
}

export default App;
