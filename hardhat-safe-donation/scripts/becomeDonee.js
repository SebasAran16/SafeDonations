const { ethers, getNamedAccounts } = require("hardhat");

async function becomeDonee() {
  const { donee2 } = await getNamedAccounts();
  const defiContribute = await ethers.getContract("DefiContribute", donee2);
  console.log("Becoming a donee...");
  const becomeRes = await defiContribute.becomeDonee(
    "Testing functionalit",
    "All of these funds will go to my own testing wallets hehe"
  );
  await becomeRes.wait(1);
  console.log("You have become a donee");
}

becomeDonee()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
