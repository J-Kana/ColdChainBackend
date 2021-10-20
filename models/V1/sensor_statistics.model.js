module.exports = (sequelize, DataTypes) => {
    const Sensor_Statistics = sequelize.define("sensor_statistics", {
        factory_ID: {
            type: DataTypes.TEXT
        },
        channel: {
            type: DataTypes.STRING,
            allowNull: false
        },
        temperature: {
            type: DataTypes.STRING
        },
        humidity: {
            type: DataTypes.STRING
        },
        bat_lifetime: {
            type: DataTypes.STRING
        },
        bat_capacity: {
            type: DataTypes.STRING
        },
        device_signal: {
            type: DataTypes.STRING
        },
        modem_signal: {
            type: DataTypes.STRING
        }
    });

    return Sensor_Statistics;
};
