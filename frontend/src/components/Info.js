import React from "react";

function Info() {
  return (
    <div className="info-container">
      <h2 className="info-heading">How the Salary Automation Works:</h2>
      <ol className="info-list">
        <li>Install the Metamask extension to enable app functionality.</li>
        <li>Connect your wallet to the Ethereum Mainnet.</li>
        <li>Provide necessary details about the employee, considering a biweekly payment schedule.</li>
        <li>Deploy the Salary Automation smart contract.</li>
        <li>Register the contract using the Chainlink Keeper Registry (ensure funding with LINK).</li>
        <li>Witness the seamless automation of your employee's salary.</li>
      </ol>
    </div>
  );
}

export default Info;
