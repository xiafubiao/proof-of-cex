# A Quick Demo for Primus zkTLS 

This demo shows how to create zkTLS data attestations (proofs) about your 30-day PNL rate in Binance. I use the conditional compare in the proof generation, check [here] (https://docs.primuslabs.xyz/data-verification/zk-tls-sdk/test#verification-logics) for the syntax.


# How to Run the Demo?
git clone the repo into your local folder, then:

```node
cd proof-of-cex

npm run dev
```
and copy the local server URL in your browser and play. 

Remember to install the Primus [extension](https://chromewebstore.google.com/detail/primus/oeiomhmbaapihbilkfkhmlajkeegnjhe) before the test.

# How to Create Your Own zkTLS DAPP?

We use vite and React as the frameworks to create a dapp project. 
```node
npm create vite@latest YOUR_PROJECT
```
You can choose **JavaScript** and **React** as framework options in the question list. In your project folder, install the realted modules.

```node
cd YOUR_PROJECT

npm install
```
Open your terminal and navigate to your project directory. Then run one of the following commands:

Using npm:
```node
npm install --save @primuslabs/zktls-js-sdk
```

Using yarn:
```node
yarn add --save @primuslabs/zktls-js-sdk
```

# Importing the SDK
After installation, you can import the SDK in your JavaScript or TypeScript files. Here's how:
```node
import PrimusZKTLS from "@primuslabs/zktls-js-sdk"
```

# Generate the Attestation
for init the SDK and get the zkTLS attestation, you can refer to this [example](https://docs.primuslabs.xyz/data-verification/zk-tls-sdk/test)


# Verify the Attestation On-Chain

Before verifying your attestation on-chain, make sure to configure the following parameters:

- Contract Address – Refer to [this page](https://docs.primuslabs.xyz/data-verification/zk-tls-sdk/solidity/overview) for the official Primus zkTLS verifier contract addresses deployed on different blockchains. In this example, we use the contract on the Monad testnet as the verifier.

- Contract ABI – You can retrieve the ABI from the contractData.js file in the project folder.

- RPC URL – Use the RPC URL of the target chain. In this example, we use the RPC provided by the Monad team.


Once the parameters are set, you can verify the attestation in two ways:

- Direct Call – Call the `verifyAttestation()` method in the zkTLS verifier contract.

- Wrapped Call – Call a function in your own business contract that internally calls the Primus zkTLS verifier contract.
You can follow this [ guide](https://docs.primuslabs.xyz/data-verification/zk-tls-sdk/solidity/quickstart#deploy-a-smart-contract) to see how to deploy and integrate such a contract.


```
        const abi = contractData.abi;

        const contractAddress = "0x1Ad7fD53206fDc3979C672C0466A1c48AF47B431"; // monad test
        // Use ethers.js connect to the smart contract
        const provider = new ethers.providers.JsonRpcProvider("https://testnet-rpc.monad.xyz");
    
        console.log(provider);
        const contract = new ethers.Contract(contractAddress, abi, provider);
       

        try {
            // Call verifyAttestation func
            const tx = await contract.verifyAttestation(attestation);
            console.log("Transaction verified on monad testnet:", tx);
        } catch (error) {
            console.error("Error in verifyAttestation:", error);
        }
```

# More Templates
You can get more templates from the dev hub [marketplace](https://dev.primuslabs.xyz/marketplace)
