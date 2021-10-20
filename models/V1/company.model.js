module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define("company", {
        comp_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        street: {
            type: DataTypes.STRING,
            allowNull: false
        },
        house: {
            type: DataTypes.STRING,
            allowNull: false
        },
        office: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        work_phone: {
            type: DataTypes.STRING
        },
        fax: {
            type: DataTypes.STRING
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_surname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_patronymic: {
            type: DataTypes.STRING
        },
        user_phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        logo: {
            type: DataTypes.TEXT
        },
        active: {
            type: DataTypes.BOOLEAN
        },
        parent_company: {
            type: DataTypes.INTEGER
        }
    });

    return Company;
};
