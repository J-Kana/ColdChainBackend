module.exports = (sequelize, DataTypes) => {
    const Log = sequelize.define("log", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        action: {
            type: DataTypes.STRING
        },
        body: {
            type: DataTypes.JSON
        },
        user_name: {
            type: DataTypes.STRING
        },
        user_surname: {
            type: DataTypes.STRING
        },
        user_phone: {
            type: DataTypes.STRING
        },
        user_email: {
            type: DataTypes.STRING
        }
    });

    return Log;
};
