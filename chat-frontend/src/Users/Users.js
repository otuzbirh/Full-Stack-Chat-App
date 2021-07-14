import React from "react";

import "./Users.css";

const Users = ({ users }) => {
  return users.length > 0 ? (
    <div>
      <h2>Active users:</h2>
      <ul className="user-list">
        {users.map((user, index) => (
          <li key={index} className="user-box">
            <span>{user.name}</span>
          </li>
        ))}
      </ul>
      <h3>Total active users: {users.length + 1} </h3>
    </div>
  ) : (
    <div>There is no user in this room</div>
  );
};

export default Users;
