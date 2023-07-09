//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

error SafeDonations__NoAdminFound();
error SafeDonations__NotEligibleToDoneeRequest();
error SafeDonations__NotDonee();
error SafeDonations__NotInPendingStatus();
error SafeDonations__NotAcceptedAsDonee();
error SafeDonations__NotTheDonee();
error SafeDonations__NotElegibleDueYourRole();
error SafeDonations__NotEligibleToRemoval();
error SafeDonations__NotEligibleToWithdraw();

contract SafeDonations is Ownable {
    enum doneeStatus {
        Rejected,
        Pending,
        Accepted,
        Canceled,
        Donee,
        Eliminated
    }

    struct Donee {
    string cause;
    uint256 id;
    uint256 proceeds;
    address payable wallet;
    string message;    
}

    mapping (address => bool) public admin;
    mapping (address => bool) public toNewDonee;
    mapping (address => doneeStatus) public doneeToStatus;
    mapping (address => uint8) public addressToRequestsSent;
    mapping (address => uint256) public doneeCandidateToFreezeTime;
    mapping (uint256 => Donee) public idToDonee;
    mapping (address => uint256) public addressToDoneeId;
    mapping (uint256 => uint256) public doneeToWithdrawalFreeze;
    mapping (uint256 => uint8) public idToRedFlags;

    uint256 public doneesId = 1;
    uint256 public randomDonationPool;

    event NewAdmin(address indexed admin);
    event AdminRevoke(address indexed admin);
    event NewDoneeRequest(address indexed donee, string message);
    event DoneeRequestCanceled(address indexed donee);
    event ApprovedDonee(address indexed donee);
    event RejectedDonee(address indexed donee);
    event NewDonee(string cause, uint256 indexed doneeId, address indexed donee,  string message);
    event EliminatedDonee(string cause, uint256 indexed doneeId, address indexed donee);
    event Donation(address indexed to, address indexed from, uint indexed amount);
    event RedFlag(string cause, uint256 indexed doneeId, address donee, address indexed admin);
    event ReadyToRemove(string cause, uint256 indexed id, address indexed wallet);
    event SummedToThePool(uint256 indexed amount);
    event Withdrawal(uint256 indexed doneeId, address indexed donee,  uint256 indexed proceeds);

    modifier onlyAdmin() {
        if (admin[msg.sender] == true) {
            _;
        } else {
            revert SafeDonations__NoAdminFound();
        }
    }

    modifier onlyAcceptedDonee() {
        if (doneeToStatus[msg.sender] == doneeStatus(2)) {
            _;
        } else {
            revert SafeDonations__NotAcceptedAsDonee();
        }
    }

    modifier onlyDonee() {
        if (idToDonee[addressToDoneeId[msg.sender]].wallet == msg.sender ) {
            _;
        } else {
            revert SafeDonations__NotDonee();
        }
    }

    modifier notRulers() {
        if ((owner() == msg.sender) || admin[msg.sender] == true) {
            revert SafeDonations__NotElegibleDueYourRole();
        }
        _;
    }

    modifier doneeRemovalRequirements(uint256 _id, address _wallet) {
        if (_id <= doneesId && _wallet == idToDonee[_id].wallet && idToRedFlags[_id] >= 3) {
            _;
        } else {
            revert SafeDonations__NotEligibleToRemoval();
        }
    }

    constructor() Ownable() {

    }


    function addAdmin(address _newAdmin) public onlyOwner() {
        admin[_newAdmin] = true;
        emit NewAdmin(_newAdmin);
    }

    function revokeAdmin (address _admin) public onlyOwner() {
        if (admin[_admin] == true) {
            admin[_admin] = false;
            emit AdminRevoke(_admin);
        } else {
            revert SafeDonations__NoAdminFound();
        }
    }

    /**
     * @notice Sends a petition to be confirmed as donee, first needs to be accepted and then finished by each donee in case.
     * It is verified that the address has not send more than 3 attempts and that if it was freezed, the time has already passed...
     */
    function doneePetition(string memory _message) public notRulers() returns (bool success) {
        if (addressToRequestsSent[msg.sender] < 3 && doneeCandidateToFreezeTime[msg.sender] <= block.timestamp) {
            addressToRequestsSent[msg.sender]++;
            doneeToStatus[msg.sender] = doneeStatus(1);
            emit NewDoneeRequest(msg.sender, _message);
            return true;
        } else {
            revert SafeDonations__NotEligibleToDoneeRequest();
        }
    }

    /**
     * @notice Cancell the donee petition but does not decrease the <addressToRequestSent> for the address, also freeze the address to be able to apply again to donee for a while.
     */
    function cancelDoneePetition() public {
        if (doneeToStatus[msg.sender] == doneeStatus.Pending) {
            doneeCandidateToFreezeTime[msg.sender] = block.timestamp + 4 weeks;
            doneeToStatus[msg.sender] = doneeStatus(3);
            emit DoneeRequestCanceled(msg.sender);
        } else {
            revert SafeDonations__NotInPendingStatus();
        }
    }

    /**
     * @notice Approves donee to be able to finish the process to make it's profile 
     */
    function approveDonee(address payable _donee) public onlyAdmin() {
        if (doneeToStatus[_donee] == doneeStatus(1)) {
            doneeToStatus[_donee] = doneeStatus(2);
            emit ApprovedDonee(_donee);
        } else {
            revert SafeDonations__NotTheDonee();
        }
    }

    function rejectDonee(address payable _donee) public onlyAdmin() {
        if (doneeToStatus[_donee] == doneeStatus(1)) {
            doneeCandidateToFreezeTime[_donee] = block.timestamp + 12 weeks;
            doneeToStatus[_donee] = doneeStatus(0);
            emit RejectedDonee(_donee);
        } else {
            revert SafeDonations__NotInPendingStatus();
        }
    }

    function becomeDonee(string memory _cause, string memory _message) public onlyAcceptedDonee() {
        idToDonee[doneesId] = Donee(_cause, doneesId, 0, payable(msg.sender), _message);
        addressToDoneeId[msg.sender] = doneesId;
        doneeToWithdrawalFreeze[doneesId] = block.timestamp + 4 weeks;
        doneeToStatus[msg.sender] = doneeStatus(4);
        emit NewDonee(_cause, doneesId, msg.sender, _message);
        doneesId++;
    }

    /**
     * @notice Admins can add a red flag to a donee for the sake of setting them to removal by admins for bad behaviour and giving
     * them time to withdraw funds
     */
    function addRedFlag(uint256 _doneeId, address _wallet) public onlyAdmin() {
        if (_doneeId <= doneesId && idToDonee[_doneeId]. wallet == _wallet) {
            idToRedFlags[_doneeId]++;
            emit RedFlag(idToDonee[_doneeId].cause, _doneeId, _wallet, msg.sender);
            if (idToRedFlags[_doneeId] >= 3) {
                emit ReadyToRemove(idToDonee[_doneeId].cause, _doneeId, _wallet);
            }
        } else {
            revert SafeDonations__NotDonee();
        }
    }

    /**
     * @notice Admins can only remove a donee after 3 red flags
     */
    function removeDonee(uint256 _doneeId, address payable _wallet) public onlyAdmin() doneeRemovalRequirements(_doneeId, _wallet) {
        string memory cause = idToDonee[_doneeId].cause;
        address wallet = idToDonee[_doneeId].wallet;
        uint256 proceeds = idToDonee[_doneeId].proceeds;
        doneeToStatus[_wallet] == doneeStatus(5);
        delete idToDonee[_doneeId];
        if (proceeds > 0) {
            randomDonationPool += proceeds;
            emit SummedToThePool(proceeds);
        }
        emit EliminatedDonee(cause, _doneeId, wallet);
    }

    function donate(uint256 _doneeId, address payable _wallet) public payable {
        if ((idToDonee[_doneeId].wallet != 0x0000000000000000000000000000000000000000) && (idToDonee[_doneeId].wallet == _wallet)) {
            idToDonee[_doneeId].proceeds += msg.value;
            emit Donation(_wallet, msg.sender, msg.value);
        } else {
            revert SafeDonations__NotTheDonee();
        }
    }

    function withdraw() public onlyDonee() {
        if (doneeToWithdrawalFreeze[addressToDoneeId[msg.sender]] <= block.timestamp) {
            uint256 proceeds = idToDonee[addressToDoneeId[msg.sender]].proceeds;
            idToDonee[addressToDoneeId[msg.sender]].proceeds = 0;
            (bool success, ) = msg.sender.call{value: proceeds}("");
            require (success, "Could not withdraw proceeds...");
            emit Withdrawal(addressToDoneeId[msg.sender], msg.sender, proceeds);
        } else {
            revert SafeDonations__NotEligibleToWithdraw();
        }
    }

}