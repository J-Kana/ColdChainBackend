module.exports = (sequelize, DataTypes ) => {
    const Help = sequelize.define("help", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
    });

    return Help;
};