module.exports = (sequelize, DataTypes) => {
    const Object_Statistics = sequelize.define("object_statistics", {
        temperature: {
            type: DataTypes.STRING
        },
        humidity: {
            type: DataTypes.STRING
        },
        reason: {
            type: DataTypes.STRING
        }
    });

    return Object_Statistics;
};
