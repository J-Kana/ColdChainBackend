module.exports = (sequelize, DataTypes) => {
    const FirebaseToken = sequelize.define("firebase_token", {
        token: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    return FirebaseToken;
};
