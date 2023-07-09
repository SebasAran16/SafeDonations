const { ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { expect, assert } = require("chai");
const { time } = require("@nomicfoundation/hardhat-network-helpers/");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("DeFi Contribute Unit test", async function () {
      let defiContribute, deployer;
      let weekInSecs = 604800;

      beforeEach(async function () {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        user1 = accounts[1];
        user2 = accounts[2];
        await deployments.fixture(["all"]);
        const defiContributeContract = await ethers.getContract(
          "DefiContribute"
        );
        defiContribute = await defiContributeContract.connect(deployer);
      });

      describe("Constructor", async function () {
        it("Verifies that the owner is set the contract's deployer", async function () {
          assert.equal(await defiContribute.owner(), deployer.address);
        });
      });

      describe("addAdmin", async function () {
        it("Tries to add an admin without being the owner", async function () {
          defiContribute = await defiContribute.connect(user1);
          await expect(
            defiContribute.addAdmin(user2.address)
          ).to.be.revertedWith("Ownable: caller is not the owner");
        });
        it("Succesfully adds an admin and emits the event and verifies admin bool", async function () {
          await expect(defiContribute.addAdmin(user1.address)).to.emit(
            defiContribute,
            "NewAdmin"
          );
          assert.equal(await defiContribute.admin(user1.address), true);
        });
      });

      describe("revokeAdmin", async function () {
        it("Verifies that owner can revoke admin position, verify admin bool to false and event triggers", async function () {
          await defiContribute.addAdmin(user1.address);
          await expect(defiContribute.revokeAdmin(user1.address)).to.emit(
            defiContribute,
            "AdminRevoke"
          );
          assert.equal(await defiContribute.admin(user1.address), false);
        });
        it("Verifies that no other person can revoke an admin", async function () {
          await defiContribute.addAdmin(user2.address);
          defiContribute = await defiContribute.connect(user1);
          await expect(
            defiContribute.revokeAdmin(user2.address)
          ).to.be.revertedWith("Ownable: caller is not the owner");
        });
        it("Verifies revert when no admin found with that address", async function () {
          await expect(
            defiContribute.revokeAdmin(user1.address)
          ).to.be.revertedWith("DefiContribute__NoAdminFound()");
        });
      });

      describe("doneePetition", async function () {
        it("Verifies the request is sent, request counter sums, request status change and triggers the event", async function () {
          defiContribute = await defiContribute.connect(user1);
          await expect(
            defiContribute.doneePetition(
              "We are a company that help single-mothers to develop skills to be able to economically provide for their children, find out more in our webpage abc.com"
            )
          ).to.emit(defiContribute, "NewDoneeRequest");
          assert.equal(
            await defiContribute.addressToRequestsSent(user1.address),
            1
          );
          assert.equal(await defiContribute.doneeToStatus(user1.address), 1);
        });
        it("Verifies that account can not apply for being a donee during freeze time", async function () {
          defiContribute = await defiContribute.connect(user1);
          await defiContribute.doneePetition(
            "We are a company that help single-mothers to develop skills to be able to economically provide for their children, find out more in our webpage abc.com"
          );
          await defiContribute.cancelDoneePetition();
          await expect(
            defiContribute.doneePetition(
              "We are a company that help single-mothers to develop skills to be able to economically provide for their children, find out more in our webpage abc.com"
            )
          ).to.be.revertedWith("DefiContribute__NotEligibleToDoneeRequest()");
        });
        it("Verifies that account can apply after freeze", async function () {
          defiContribute = await defiContribute.connect(user1);
          await defiContribute.doneePetition("I am just a troll, nevermind");
          await defiContribute.cancelDoneePetition();
          await time.increase(4 * weekInSecs);
          await expect(
            defiContribute.doneePetition("Not a troller anymore...")
          ).to.emit(defiContribute, "NewDoneeRequest");
        });
        it("Verifies that account is not eligible after 3 attempts", async function () {
          defiContribute = await defiContribute.connect(user1);
          await defiContribute.doneePetition("I am just a troll, nevermind");
          await defiContribute.cancelDoneePetition();
          await time.increase(4 * weekInSecs);
          await defiContribute.doneePetition("Hey, trolling again");
          await defiContribute.cancelDoneePetition();
          await time.increase(4 * weekInSecs);
          await defiContribute.doneePetition(
            "Here again, got nothing better to do..."
          );
          await defiContribute.cancelDoneePetition();
          await time.increase(4 * weekInSecs);
          await expect(
            defiContribute.doneePetition("Hehe again")
          ).to.be.revertedWith("DefiContribute__NotEligibleToDoneeRequest()");
        });
        it("Verifies that owner can not request donee petition", async function () {
          await expect(
            defiContribute.doneePetition(
              "Hey admin, accept me or I will revoke you"
            )
          ).to.be.revertedWith("DefiContribute__NotElegibleDueYourRole()");
        });
        it("Verifies that admins can not request donee petition", async function () {
          await defiContribute.addAdmin(user1.address);
          defiContribute = await defiContribute.connect(user1);
          await expect(
            defiContribute.doneePetition(
              "Hey boss, make me donee, wanna make some easy money"
            )
          ).to.be.revertedWith("DefiContribute__NotElegibleDueYourRole()");
        });
      });

      describe("cancelDoneePetition", async function () {
        it("Verifies that an address can cancel petition, freeze time is set, request status changes and event emits", async function () {
          defiContribute = await defiContribute.connect(user1);
          await defiContribute.doneePetition(
            "We are a company that help single-mothers to develop skills to be able to economically provide for their children, find out more in our webpage abc.com"
          );
          await expect(defiContribute.cancelDoneePetition()).to.emit(
            defiContribute,
            "DoneeRequestCanceled"
          );
          assert.equal(
            await defiContribute.doneeCandidateToFreezeTime(user1.address),
            (await time.latest()) + 4 * weekInSecs
          );
          assert.equal(await defiContribute.doneeToStatus(user1.address), 3);
        });
        it("Verifies revert when address is not in pending status", async function () {
          defiContribute = await defiContribute.connect(user1);
          await expect(defiContribute.cancelDoneePetition()).to.be.revertedWith(
            "DefiContribute__NotInPendingStatus()"
          );
        });
      });

      describe("approveDonee", async function () {
        it("Verifies that admins can verify petitions, request status changes and the event is triggered", async function () {
          await defiContribute.addAdmin(user2.address);
          defiContribute = await defiContribute.connect(user1);
          await defiContribute.doneePetition(
            "We are a company that help single-mothers to develop skills to be able to economically provide for their children, find out more in our webpage abc.com"
          );
          defiContribute = await defiContribute.connect(user2);
          await expect(defiContribute.approveDonee(user1.address)).to.emit(
            defiContribute,
            "ApprovedDonee"
          );
          assert.equal(await defiContribute.doneeToStatus(user1.address), 2);
        });
        it("Verifies revert when address has no petition", async function () {
          await defiContribute.addAdmin(user2.address);
          defiContribute = await defiContribute.connect(user2);
          await expect(
            defiContribute.approveDonee(user1.address)
          ).to.be.revertedWith("DefiContribute__NotTheDonee()");
        });
        it("Verifies that only admins can approve petitions", async function () {
          defiContribute = await defiContribute.connect(user1);
          await defiContribute.doneePetition(
            "We are a company that help single-mothers to develop skills to be able to economically provide for their children, find out more in our webpage abc.com"
          );
          defiContribute = await defiContribute.connect(user2);
          await expect(
            defiContribute.approveDonee(user1.address)
          ).to.be.revertedWith("DefiContribute__NoAdminFound()");
        });
      });

      describe("rejectDonee", async function () {
        it("Verifies admins can reject a donee, request status changes, freeze time increases and event is triggered", async function () {
          await defiContribute.addAdmin(user2.address);
          defiContribute = await defiContribute.connect(user1);
          await defiContribute.doneePetition(
            "We are a company that help single-mothers to develop skills to be able to economically provide for their children, find out more in our webpage abc.com"
          );
          defiContribute = await defiContribute.connect(user2);
          await expect(defiContribute.rejectDonee(user1.address)).to.emit(
            defiContribute,
            "RejectedDonee"
          );
          assert.equal(await defiContribute.doneeToStatus(user1.address), 0);
          assert.equal(
            await defiContribute.doneeCandidateToFreezeTime(user1.address),
            (await time.latest()) + 12 * weekInSecs
          );
        });
        it("Verifies revert when _donee is not in pending status", async function () {
          await defiContribute.addAdmin(user2.address);
          defiContribute = await defiContribute.connect(user2);
          await expect(
            defiContribute.rejectDonee(user1.address)
          ).to.be.revertedWith("DefiContribute__NotInPendingStatus()");
        });
        it("Verifies that only the admin can reject the petition", async function () {
          defiContribute = await defiContribute.connect(user1);
          await defiContribute.doneePetition(
            "We are a company that help single-mothers to develop skills to be able to economically provide for their children, find out more in our webpage abc.com"
          );
          defiContribute = await defiContribute.connect(user2);
          await expect(
            defiContribute.rejectDonee(user1.address)
          ).to.be.revertedWith("DefiContribute__NoAdminFound()");
        });
      });

      describe("becomeDonee", async function () {
        it("Verifies approved candidate can become donee, each property, donee id increases and event emits", async function () {
          let pastDoneeId = await defiContribute.doneesId();
          await defiContribute.addAdmin(user2.address);
          defiContribute = await defiContribute.connect(user1);
          await defiContribute.doneePetition(
            "We are a company that help single-mothers to develop skills to be able to economically provide for their children, find out more in our webpage abc.com"
          );
          defiContribute = await defiContribute.connect(user2);
          await defiContribute.approveDonee(user1.address);
          defiContribute = await defiContribute.connect(user1);
          await expect(
            defiContribute.becomeDonee(
              "Mothers Power",
              "Gatering the donations we will make an academy that will provide resources and help to motivated sigle-mothers to be able to increase their incomes by demanded skills"
            )
          ).to.emit(defiContribute, "NewDonee");
          assert.equal(
            parseInt(await defiContribute.doneesId(), 16),
            pastDoneeId + 1
          );
          let newDonee = await defiContribute.idToDonee(0);
          assert.equal(newDonee.cause, "Mothers Power");
          assert.equal(newDonee.id, 0);
          assert.equal(newDonee.proceeds, 0);
          assert.equal(newDonee.wallet, user1.address);
          assert.equal(
            newDonee.message,
            "Gatering the donations we will make an academy that will provide resources and help to motivated sigle-mothers to be able to increase their incomes by demanded skills"
          );
        });
        it("Verifies that only accepted candidates can become donees -> Pending Status", async function () {
          await defiContribute.addAdmin(user2.address);
          defiContribute = await defiContribute.connect(user1);
          await defiContribute.doneePetition(
            "We are a company that help single-mothers to develop skills to be able to economically provide for their children, find out more in our webpage abc.com"
          );
          await expect(
            defiContribute.becomeDonee(
              "Rug",
              "Here to steal, give me your money"
            )
          ).to.be.revertedWith("DefiContribute__NotAcceptedAsDonee()");
        });
        it("Verifies that only accepted candidates can become donees -> Canceled Status", async function () {
          await defiContribute.addAdmin(user2.address);
          defiContribute = await defiContribute.connect(user1);
          await defiContribute.doneePetition(
            "We are a company that help single-mothers to develop skills to be able to economically provide for their children, find out more in our webpage abc.com"
          );
          await defiContribute.cancelDoneePetition();
          await expect(
            defiContribute.becomeDonee(
              "Rug",
              "Here to steal, give me your money"
            )
          ).to.be.revertedWith("DefiContribute__NotAcceptedAsDonee()");
        });
      });

      describe("addRedFlag", async function () {
        beforeEach(async () => {
          await defiContribute.addAdmin(user2.address);
          defiContribute = await defiContribute.connect(user1);
          await defiContribute.doneePetition(
            "We are a company that help single-mothers to develop skills to be able to economically provide for their children, find out more in our webpage abc.com"
          );
          defiContribute = await defiContribute.connect(user2);
          await defiContribute.approveDonee(user1.address);
          defiContribute = await defiContribute.connect(user1);
          await defiContribute.becomeDonee(
            "Testing",
            "Do not donate, I am just testing..."
          );
          defiContribute = await defiContribute.connect(deployer);
        });
        it("Verifies the function adds Flag to the Donee and the event triggers", async function () {
          defiContribute = await defiContribute.connect(user2);
          await expect(defiContribute.addRedFlag(0, user1.address)).to.emit(
            defiContribute,
            "RedFlag"
          );
          assert.equal(await defiContribute.idToRedFlags(0), 1);
        });
        it("Verifies that only the admin can use the function", async function () {
          await expect(
            defiContribute.addRedFlag(0, user1.address)
          ).to.be.revertedWith("DefiContribute__NoAdminFound()");
        });
        it("Verifying conditionants -> _doneeId", async function () {
          defiContribute = await defiContribute.connect(user2);
          await expect(
            defiContribute.addRedFlag(1, user1.address)
          ).to.be.revertedWith("DefiContribute__NotDonee()");
        });
        it("Verifying conditionants -> _wallet", async function () {
          defiContribute = await defiContribute.connect(user2);
          await expect(
            defiContribute.addRedFlag(0, user2.address)
          ).to.be.revertedWith("DefiContribute__NotDonee()");
        });
      });

      describe("eliminateDonee", async function () {
        beforeEach(async () => {
          await defiContribute.addAdmin(user2.address);
          defiContribute = await defiContribute.connect(user1);
          await defiContribute.doneePetition(
            "We are a company that help single-mothers to develop skills to be able to economically provide for their children, find out more in our webpage abc.com"
          );
          defiContribute = await defiContribute.connect(user2);
          await defiContribute.approveDonee(user1.address);
          defiContribute = await defiContribute.connect(user1);
          await defiContribute.becomeDonee(
            "Testing",
            "Do not donate, I am just testing..."
          );
          defiContribute = await defiContribute.connect(user2);
        });
        it("Verifies that the owner can eliminate a donee, donee is deleted and event triggers", async function () {
          await defiContribute.addRedFlag(0, user1.address);
          await defiContribute.addRedFlag(0, user1.address);
          await defiContribute.addRedFlag(0, user1.address);
          await expect(defiContribute.removeDonee(0, user1.address)).to.emit(
            defiContribute,
            "EliminatedDonee"
          );
          let doneeArray = await defiContribute.idToDonee(0);
          assert.equal(doneeArray.cause, "");
          assert.equal(doneeArray.id, 0);
          assert.equal(doneeArray.proceeds, 0);
          assert.equal(doneeArray.wallet, 0);
          assert.equal(doneeArray.message, 0);
        });
        it("Verifies the only admin modifier", async function () {
          await defiContribute.addRedFlag(0, user1.address);
          await defiContribute.addRedFlag(0, user1.address);
          await defiContribute.addRedFlag(0, user1.address);
          defiContribute = await defiContribute.connect(deployer);
          await expect(
            defiContribute.removeDonee(0, user1.address)
          ).to.be.revertedWith("DefiContribute__NoAdminFound()");
        });
        it("Verifies the modifier doneeRemovalRequirements -> 3 red flags", async function () {
          await expect(
            defiContribute.removeDonee(0, user1.address)
          ).to.be.revertedWith("DefiContribute__NotEligibleToRemoval()");
        });
        it("Verifies the modifier doneeRemovalRequirements -> id", async function () {
          await expect(
            defiContribute.removeDonee(1, user1.address)
          ).to.be.revertedWith("DefiContribute__NotEligibleToRemoval()");
        });
        it("Verifies the modifier doneeRemovalRequirements -> wallet", async function () {
          await expect(
            defiContribute.removeDonee(0, deployer.address)
          ).to.be.revertedWith("DefiContribute__NotEligibleToRemoval()");
        });
        it("Verifies that the proceeds are summed to the randomDonationPool", async function () {
          await defiContribute.addRedFlag(0, user1.address);
          await defiContribute.addRedFlag(0, user1.address);
          await defiContribute.addRedFlag(0, user1.address);
          await defiContribute.donate(0, user1.address, {
            value: 1000000000000,
          });
          await expect(defiContribute.removeDonee(0, user1.address)).to.emit(
            defiContribute,
            "SummedToThePool"
          );
          assert.equal(
            await defiContribute.randomDonationPool(),
            1000000000000
          );
        });
      });
      describe("Donate function testing", async function () {
        beforeEach(async () => {
          await defiContribute.addAdmin(user2.address);
          defiContribute = await defiContribute.connect(user1);
          await defiContribute.doneePetition(
            "We are a company that help single-mothers to develop skills to be able to economically provide for their children, find out more in our webpage abc.com"
          );
          defiContribute = await defiContribute.connect(user2);
          await defiContribute.approveDonee(user1.address);
          defiContribute = await defiContribute.connect(user1);
          await defiContribute.becomeDonee(
            "Testing",
            "Do not donate, I am just testing..."
          );
        });
        it("Verifies that everyone can donate, proceeds of the donee increase and the event emits", async function () {
          defiContribute = await defiContribute.connect(deployer);
          await expect(
            defiContribute.donate(0, user1.address, { value: 1000000000000 })
          ).to.emit(defiContribute, "Dontation");
        });
        it("Verifies that the id and the wallet has to be assigned to the same Donee -> Id", async function () {
          defiContribute = await defiContribute.connect(deployer);
          await expect(
            defiContribute.donate(1, user1.address)
          ).to.be.revertedWith("DefiContribute__NotTheDonee()");
        });
        it("Verifies that the id and the wallet has to be assigned to the same Donee -> Address", async function () {
          defiContribute = await defiContribute.connect(deployer);
          await expect(
            defiContribute.donate(0, user2.address)
          ).to.be.revertedWith("DefiContribute__NotTheDonee()");
        });
      });
      describe("Withdraw function", async function () {
        beforeEach(async () => {
          await defiContribute.addAdmin(user2.address);
          defiContribute = await defiContribute.connect(user1);
          await defiContribute.doneePetition(
            "We are a company that help single-mothers to develop skills to be able to economically provide for their children, find out more in our webpage abc.com"
          );
          defiContribute = await defiContribute.connect(user2);
          await defiContribute.approveDonee(user1.address);
          defiContribute = await defiContribute.connect(user1);
          await defiContribute.becomeDonee(
            "Testing",
            "Do not donate, I am just testing..."
          );
          defiContribute = await defiContribute.connect(deployer);
          await defiContribute.donate(0, user1.address, {
            value: 1000000000000000,
          });
        });
        it("Verifies that the Donee can withdraw the funds correctly, proceeds are zeroed and the event emits", async function () {
          defiContribute = await defiContribute.connect(user1);
          await time.increase(4 * weekInSecs);
          await expect(defiContribute.withdraw()).to.emit(
            defiContribute,
            "Withdrawal"
          );
          let donee = await defiContribute.idToDonee(0);
          assert.equal(donee.proceeds, 0);
        });
        it("Verifies the onlyDonee() modifier", async function () {
          await expect(defiContribute.withdraw()).to.be.revertedWith(
            "DefiContribute__NotDonee()"
          );
        });
        it("Reveerts as freeze time is active", async function () {
          defiContribute = await defiContribute.connect(user1);
          await expect(defiContribute.withdraw()).to.be.revertedWith(
            "DefiContribute__NotEligibleToWithdraw()"
          );
        });
      });
    });
