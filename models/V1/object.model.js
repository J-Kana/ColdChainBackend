module.exports = (sequelize, DataTypes) => {
    const Object = sequelize.define("object", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        longitude: {
            type: DataTypes.STRING
        },
        latitude: {
            type: DataTypes.STRING
        },
        country: {
            type: DataTypes.STRING,

        },
        city: {
            type: DataTypes.STRING,

        },
        street: {
            type: DataTypes.STRING,

        },
        house: {
            type: DataTypes.STRING,

        },
        office: {
            type: DataTypes.STRING,

        },
        phone: {
            type: DataTypes.STRING,

        },
        work_phone: {
            type: DataTypes.STRING
        },
        fax: {
            type: DataTypes.STRING
        },
        building_plan: {
            type: DataTypes.TEXT
        },
        temperature: {
            type: DataTypes.STRING
        },
        humidity: {
            type: DataTypes.STRING
        },
        max_temperature: {
            type: DataTypes.STRING
        },
        min_temperature: {
            type: DataTypes.STRING
        },
        max_humidity: {
            type: DataTypes.STRING
        },
        min_humidity: {
            type: DataTypes.STRING
        },
        lighting: {
            type: DataTypes.STRING
        },
        logo: {
            type: DataTypes.TEXT
        },
        active: {
            type: DataTypes.BOOLEAN
        },
        object_ID: {
            type: DataTypes.INTEGER
        }
    });

    return Object;
};
