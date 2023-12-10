import { React, useState } from "react";
import { ethers } from "ethers";
import contractInfo from "./contract/SalaryAutomation.json";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Info from "./components/Info";
import NextSteps from "./components/NextSteps";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // State variables
  const [account, setAccount] = useState([]);
  const [contract, setContract] = useState("");

  // Connect MetaMask account
  const connectAccount = async () => {
    try {
      if (window.ethereum) {
        const user = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(user);
      } else {
        window.alert("Need MetaMask Installed.")
      }
    } catch (error) {
      window.alert(error.message);
    }
  };

  // Deploys contract with relevant information provided by user
  const deployContract = async (event) => {
    event.preventDefault();
    let data = new FormData(event.target);
    let address = data.get("address");
    let salary = data.get("salary");
    let registry = data.get("registry");

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const networkName = (await provider.getNetwork()).name;

      // Checks if user is connected to Mainnet
      if (networkName === "homestead") {
        try {
          const signer = provider.getSigner();

          address = ethers.utils.getAddress(address);
          registry = ethers.utils.getAddress(registry);
          salary = parseInt(salary);

          const factory = new ethers.ContractFactory(contractInfo.abi, contractInfo.bytecode, signer);

          const contract = await factory.deploy(registry, salary, address);
          const id = toast.loading("Deploying contract...", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            className: "ToastMessage"
          });

          await contract.deployed();
          toast.update(id, { render: "Contract deployed!", type: "success", isLoading: false, className: "ToastMessage" });

          setContract(contract.address);
        } catch (error) {
          window.alert(error.message);
        }
      } else {
        window.alert("Need to be on Mainnet");
      }
    } catch (error) {
      window.alert(error.message);
    }
  };

  return (
    <div className="App">
      {account.length ?
        (
          <div className="InputContainer">
          <div className="WalletInfo">
            <label className="WalletLabel">Connected Wallet: {account[0]}</label>
            <label className="NetworkLabel">Mainnet</label>
          </div>
          <div className="Line"></div>
          <label className="InputInfo">~~~ Enter the following information ~~~</label>
          <form className="InputForm" onSubmit={deployContract}>
            <div className="InputLine">
              <label>Employee's Address:</label>
              <input name="address" type="text" className="InputDetail" />
            </div>
            <div className="InputLine">
              <label className="Tooltip">
                Employee's Salary
                <span className="TooltipText">
                  Salary amount will be rounded down if a decimal is added.
                </span>
              </label>
              <label>(Biweekly):</label>
              <input
                name="salary"
                type="text"
                className="InputDetail"
                placeholder="in USD"
              />
            </div>
            <div className="InputLine">
              <label>Chainlink Keepers Registry Address:</label>
              <input name="registry" type="text" className="InputDetail" />
            </div>
            <button type="submit" className="DeployButton">
              Deploy
            </button>
            <div className="Line"></div>
          </form>
          <div className="DeployedInfo">
            <label className="DeployedContractInfo">
              Deployed Contract Address: {contract}
            </label>
            <label className="NextStepsInfo">Next Steps:</label>
            <NextSteps />
          </div>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
        ) :
        (
          <div className="App">
            <Header />
            <Info />
            <button className="ConnectWallet" onClick={connectAccount}>Connect Wallet</button>
            <Footer />
          </div>
        )
      }
    </div>
  );
}

export default App;
