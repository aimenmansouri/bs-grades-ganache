pragma solidity ^0.8.28;

contract GradeVerification {
    address public owner;
    mapping(bytes32 => bytes32) public grades;
    mapping(uint256 => address) public userAddresses;
    
    event GradeAdded(uint256 studentId, uint256 courseId, uint256 grade, uint256 timestamp);
    event UserAddressLinked(uint256 userId, address userAddress);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyTeacher(address teacherAddress) {
        require(teacherAddress != address(0), "Invalid teacher address");
        _;
    }
    
    function linkUserAddress(uint256 userId, address userAddress) public onlyOwner {
        require(userAddress != address(0), "Invalid address");
        userAddresses[userId] = userAddress;
        emit UserAddressLinked(userId, userAddress);
    }
    
    function addGrade(
        uint256 studentId, 
        uint256 courseId, 
        uint256 grade, 
        uint256 kind
    ) public {
        bytes32 gradeKey = keccak256(abi.encodePacked(studentId, courseId));
        bytes32 gradeHash = keccak256(abi.encodePacked(studentId, courseId, grade, kind));
        
        grades[gradeKey] = gradeHash;
        
        emit GradeAdded(studentId, courseId, grade, kind);
    }
    
    function verifyGrade(
        uint256 studentId, 
        uint256 courseId, 
        uint256 grade, 
        uint256 timestamp
    ) public view returns (bool) {
        bytes32 gradeKey = keccak256(abi.encodePacked(studentId, courseId));
        bytes32 storedGradeHash = grades[gradeKey];
        bytes32 providedGradeHash = keccak256(abi.encodePacked(studentId, courseId, grade, timestamp));
        
        return storedGradeHash == providedGradeHash;
    }
    
    function getUserAddress(uint256 userId) public view returns (address) {
        return userAddresses[userId];
    }
}