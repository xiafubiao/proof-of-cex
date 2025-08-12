import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import {contractData} from './contractdata'

/** start: copy the dev hub code here */
import { PrimusZKTLS } from "@primuslabs/zktls-js-sdk"

import { ethers } from "ethers";




function App() {
  const [attestation, setAttestation] = useState();
  const [x, setX] = useState();

  async function primusProof() {
    try {
      // Initialize parameters, the init function is recommended to be called when the page is initialized.
      const primusZKTLS = new PrimusZKTLS();
      const appId = "0x79ef39162078e5e45d07700b53d89470bbf12a75";
      const appSecret = "0xf60bcb91c382c735af03c099ccff0a192e9de7f277760dc02a7bb81fd30ff331"; // Just for testing, appSecret cannot be written in the front-end code

      console.log("dddddd");
      const initAttestaionResult = await primusZKTLS.init(appId, appSecret);
      console.log("eeeee");
      // Set TemplateID and user address.
      const attTemplateID = "369e1db8-47c9-4dc6-85b5-037cd02d3383";//"369e1db8-47c9-4dc6-85b5-037cd02d3383";
      const userAddress = "0xc814b5AACFB7F3400e90FFa4fC6BF5169E221f61";
      // Generate attestation request.
      const request = primusZKTLS.generateRequestParams(attTemplateID, userAddress);

      // Set zkTLS mode, default is proxy model. (This is optional)
      const workMode = "proxytls";
      request.setAttMode({
        algorithmType: workMode,
      });
      console.log("cccccccc");
      // Set attestation conditions. (These are optional)
      // 1. Hashed result.
      // const attConditions = JSON.stringify([
      //  [
      //   { 
      //     field:'YOUR_CUSTOM_DATA_FIELD',
      //     op:'SHA256',
      //   },
      //  ],
      // ]);
      // 2. Conditions result.\
      /*
       const attConditions = JSON.stringify([
        [
          {
            field: "$.data.cumulativeCurrMonth.spotPnlRate",
            op: ">",
            value: "1",  // PNL Rate >= 10% (=0.1): trader,  else: loser
          },
        ],
       ]);
       request.setAttConditions(attConditions);
      */
       request.setAttConditions([
        [
          {
            field: "spotPnlRate",
            op: ">=",
            value: "0",  // PNL Rate >= 10% (=0.1): trader,  else: loser
          },
         ],
       ]);

      // Transfer request object to string.
      const requestStr = request.toJsonString();

      // Sign request.
      const signedRequestStr = await primusZKTLS.sign(requestStr);

      // Start attestation process.
      const attestation0 = await primusZKTLS.startAttestation(signedRequestStr);
      console.log("attestation=", attestation0);


      const spotPnlRate = JSON.parse(attestation0.data).spotPnlRate;
      console.log("spotPnlRate:", spotPnlRate); // -0.00100000

      setAttestation(attestation0);

      // Verify siganture locally
      const verifyResult = await primusZKTLS.verifyAttestation(attestation0)
      console.log("verifyResult=", verifyResult);

      if (verifyResult === true) {
        // Business logic checks, such as attestation content and timestamp checks
        // do your own business logic.

        // let's verify on-chain

        const abi = contractData.abi;
        
        console.log("1234");
       // const abi = contractData.abi;
        console.log(abi);
        const contractAddress = "0x1Ad7fD53206fDc3979C672C0466A1c48AF47B431";
        // Use ethers.js connect to the smart contract
        console.log("12345");
        
        const provider = new ethers.providers.JsonRpcProvider("https://testnet-rpc.monad.xyz");
        console.log("123456");
        console.log(provider);
        const contract = new ethers.Contract(contractAddress, abi, provider);
        console.log("1234567");

        try {
            // Call verifyAttestation func
            const tx = await contract.verifyAttestation(attestation);
            console.log("Transaction verified on monad testnet:", tx);
        } catch (error) {
            console.error("Error in verifyAttestation:", error);
        }

        console.log("ababababababababab");
        
      } else {
        // If failed, define your own logic.
        console.log("efefefefefefefefef");
      }

    } catch (error) {
      console.log("cdcdcdcdcdcdcd");
    }
    console.log("final symbol");

  }

  /** end: copy the dev hub code here */


  const handleClick = () => {
    setX(attestation);

  };


  return (
    <div>

      <div>
        Hello Trader!
      </div>

      <div className="card">
        <button onClick={primusProof}>
          Prove your Binace 30-Day PNL Rate
        </button>
      </div>

      <hr />

      <div>

        <textarea value={JSON.stringify(x, null, 2)} readOnly rows="30" cols="70"></textarea>
        <br /><br />


        <button onClick={handleClick}>Show the attestation result</button>
      </div>

    </div>
  )
}

export default App
