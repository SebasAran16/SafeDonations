const { ethers, getNamedAccounts } = require("hardhat");

async function acceptDonee() {
  const { admin, donee2, deployer } = await getNamedAccounts();
  const defiContribute = await ethers.getContract("DefiContribute", admin);
  console.log(`Accepting the ${donee2} as donee...`);
  const acceptRes = await defiContribute.approveDonee(donee2);
  await acceptRes.wait(1);
  console.log("Accepted!");
}

acceptDonee()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
