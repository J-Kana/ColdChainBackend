module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define("notification", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        active: {
            type: DataTypes.BOOLEAN
        }
    });

    return Notification;
};
