module.exports = (sequelize, DataTypes) => {
    const Medicaments = sequelize.define("medicaments", {
        name: {
            type: DataTypes.STRING
        }
    });

    return Medicaments;
};
