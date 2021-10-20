module.exports = (sequelize, DataTypes) => {
    const Sensor = sequelize.define("sensor", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        channel: {
            type: DataTypes.STRING,
            allowNull: false
        },
        parameter: {
            type: DataTypes.STRING
        },
        temperature: {
            type: DataTypes.STRING
        },
        humidity: {
            type: DataTypes.STRING
        },
        factory_ID: {
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
        },
        modem_url: {
            type: DataTypes.STRING
        },
        logo: {
            type: DataTypes.TEXT
        },
        active: {
            type: DataTypes.BOOLEAN
        },
        type_device: {
            type: DataTypes.STRING
            
        }
    });

    return Sensor;
};
