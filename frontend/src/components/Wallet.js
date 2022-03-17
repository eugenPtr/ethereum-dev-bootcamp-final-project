import ReverseMortgage from "../contracts/ReverseMortgage.json"
import {ethers} from "ethers";


export const checkIfWalletIsConnected = async (connectedAccountSetter, connectedContractSetter) => {

    if (window.ethereum) {

        // Check if metamask is connected to the local blockchain. Trigger network switch if not.
        await switchNetwork()

        let provider = new ethers.providers.Web3Provider(window.ethereum);
        let signer = provider.getSigner();
        let accounts = await provider.send("eth_requestAccounts", []);
        
        if (accounts.length != 0) {
            console.log("Found authorized account:", accounts[0]);
            await connectedAccountSetter(accounts[0]);
        }

        // Connect to contract
        if (window.reverseMortgageAddress) {
            let contract = new ethers.Contract(window.reverseMortgageAddress, ReverseMortgage.abi, signer);
            await connectedContractSetter(contract);
        }
        

    } else {
        console.log("Please connect metamask wallet")
    }
        
}

const switchNetwork = async () => {
    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "31337"}]
        })
    } catch (error) {
        if (error.code === 4902) {
            try {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                        {
                            chainId: "31337",
                            chainName: "Localhost 8545",
                            rpcUrls: ["http://localhost:8545"],
                            nativeCurrency: {
                                name: "Ether",
                                symbol: "ETH",
                                decimals: 18,
                            }
                        }
                    ]
                })
            } catch (error) {
                alert(error.message);
            }
        }
    }
}

