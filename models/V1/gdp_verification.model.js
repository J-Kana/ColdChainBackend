module.exports = (sequelize, DataTypes) => {
    const GDP_Verification = sequelize.define("gdp_verification", {
        validation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        file_number: {
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

    return GDP_Verification;
};
