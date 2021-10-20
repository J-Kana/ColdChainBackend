module.exports = (sequelize, DataTypes) => {
    const Transport_Geolocation = sequelize.define("transport_geolocation", {
        longitude: {
            type: DataTypes.STRING
        },
        latitude: {
            type: DataTypes.STRING
        }
    });

    return Transport_Geolocation;
};
