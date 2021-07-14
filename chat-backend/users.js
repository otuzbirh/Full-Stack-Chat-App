var currentUsers = [];

var getPeopleInRoom = (room) => currentUsers.filter((user) => user.room === room);
var getUser = (id) => currentUsers.find((user) => user.id === id);

var addUserToCurrentUsers = (id, room, name) => {
    
    var existingUser = currentUsers.find(
        (user) => user.room === room && user.name === name
    );
    if (existingUser) {
        return existingUser;
    } else {
        var user = { id, name, room };
        currentUsers.push(user);
        return { id, name: user.name };
    }
};

var removeUserFromCurrentUsers = (id) => {
    var index = currentUsers.findIndex((user) => user.id === id);

    if (index !== -1) return currentUsers.splice(index, 1)[0];
};

module.exports = { 
    getPeopleInRoom,  
    getUser,
    addUserToCurrentUsers, 
    removeUserFromCurrentUsers 
};