const { ethers, getNamedAccounts } = require("hardhat");

async function donate() {
  const { donator, donee } = await getNamedAccounts();
  const defiContribute = await ethers.getContract("DefiContribute", donator);
  console.log("You are now donating...");
  const donationRes = await defiContribute.donate(0, donee, {
    value: ethers.utils.parseEther("0.005"),
  });
  await donationRes.wait(1);
  console.log("Donated successfully!");
}

donate()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
