module.exports = (sequelize, DataTypes ) => {
    const NotificationType = sequelize.define("notification_type", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        value: {
            type: DataTypes.STRING
        },
    });

    return NotificationType;
};