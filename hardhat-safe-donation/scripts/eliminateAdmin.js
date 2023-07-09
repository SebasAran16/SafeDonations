const { ethers, getNamedAccounts } = require("hardhat");

async function eliminateDonee() {
  const { admin } = await getNamedAccounts();
  const defiContribute = await ethers.getContract("DefiContribute");
  console.log(`Eliminating ${admin}...`);
  const eliminateRes = await defiContribute.revokeAdmin(admin);
  await eliminateRes.wait(1);
  console.log("Admin eliminated!");
}

eliminateDonee()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
