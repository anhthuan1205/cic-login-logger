var user = function(object) {
    const {
        id,
        username,
        password
    } = object;

    this.id = id;
    this.username = username;
    this.password = password;
}

module.exports = user;