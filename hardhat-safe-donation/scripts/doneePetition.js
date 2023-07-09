const { ethers, getNamedAccounts } = require("hardhat");

async function sendDoneePetition() {
  const { donee2 } = await getNamedAccounts();
  const defiContribute = await ethers.getContract("DefiContribute", donee2);
  console.log(`Sending the Donee Petition for... ${donee2}`);
  const petitionRes = await defiContribute.doneePetition("Accept me dumb");
  petitionRes.wait(1);
}

sendDoneePetition()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
