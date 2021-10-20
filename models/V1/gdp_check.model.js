module.exports = (sequelize, DataTypes) => {
    const GDP_Check = sequelize.define("gdp_check", {
        calibration: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING
        },
        surname: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING
        }
    });

    return GDP_Check;
};
