const { ethers, getNamedAccounts } = require("hardhat");

async function addAdmin() {
  const { admin } = await getNamedAccounts();
  const defiContribute = await ethers.getContract("DefiContribute");
  console.log(`Adding ${admin} as admin...`);
  const addRes = await defiContribute.addAdmin(admin);
  await addRes.wait(1);
  console.log("Admin added!");
}

addAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
