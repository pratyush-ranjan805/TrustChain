import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    console.log("Connect Wallet Triggered...");
    if (isConnecting) return;
    setIsConnecting(true);
    
    // Check if ethereum object exists
    const eth = window.ethereum;
    
    if (eth) {
      try {
        console.log("Requesting accounts...");
        // Use a more direct method for account fetching
        const accounts = await eth.request({ method: 'eth_requestAccounts' });
        
        if (!accounts || accounts.length === 0) {
          throw new Error("No accounts found. Please unlock MetaMask.");
        }

        console.log("Initializing Ethers...");
        const _provider = new ethers.BrowserProvider(eth);
        const _signer = await _provider.getSigner();
        const _account = accounts[0];
        
        setProvider(_provider);
        setSigner(_signer);
        setAccount(_account);
        setError(null);
        console.log("Wallet connected successfully:", _account);
      } catch (err) {
        console.error("Detailed Connection Error:", err);
        const errMsg = err?.message || "Unknown error";
        setError(errMsg);
        
        if (!errMsg.includes('already pending')) {
          alert("Connection failed: " + errMsg);
        }
      }
    } else {
      const msg = "MetaMask not detected. If you just installed it, please restart Chrome.";
      setError(msg);
      alert(msg);
    }
    setIsConnecting(false);
  };

  const disconnectWallet = () => {
    setAccount(null);
    setSigner(null);
    setProvider(null);
  };

  useEffect(() => {
    const eth = window.ethereum;
    if (eth) {
      // Auto-reconnect if already authorized
      eth.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts.length > 0) {
          connectWallet();
        }
      }).catch(console.error);

      eth.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnectWallet();
        }
      });
      eth.on('chainChanged', () => window.location.reload());
    }
  }, []);

  return (
    <Web3Context.Provider value={{ account, signer, provider, connectWallet, disconnectWallet, error, isConnecting }}>
      {children}
    </Web3Context.Provider>
  );
};
