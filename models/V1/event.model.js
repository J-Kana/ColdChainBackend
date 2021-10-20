module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("event", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        event_description: {
            type: DataTypes.STRING
        },
        active: {
            type: DataTypes.BOOLEAN
        }
    });

    return Event;
};
