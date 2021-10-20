module.exports = (sequelize, DataTypes) => {
    const Doc_File = sequelize.define("doc_file", {
        name: {
            type: DataTypes.STRING
        }
    });

    return Doc_File;
};
