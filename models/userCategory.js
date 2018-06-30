module.exports = function(sequelize, DataTypes){
    var UserCategory = sequelize.define("UserCategory", {

    });    

    UserCategory.associate = function(models){
        UserCategory.belongsTo(models.User);
        UserCategory.belongsTo(models.Category);
    }

    return UserCategory;
}

