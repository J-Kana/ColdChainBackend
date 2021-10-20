module.exports = (sequelize, DataTypes ) => {
    const Object_Type = sequelize.define("object_type", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        value: {
            type: DataTypes.STRING
        },
    });

    return Object_Type;
};