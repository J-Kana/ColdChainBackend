module.exports = (sequelize, DataTypes ) => {
    const FAQ = sequelize.define("faq", {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
    });

    return FAQ;
};