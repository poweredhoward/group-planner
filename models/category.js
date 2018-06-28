module.exports = function(sequelize, DataTYpes){
    var Category = sequelize.define("Category", {
        name: {
            type: DataTYpes.STRING,
            allowNull: false,
            validate: {
              len: [1]
            }
        },
        // default: {
        //    type:  DataTypes.BOOLEAN,
        //    defaultValue: true
        // }
    },
        {
            timestamps: false
        }
    );

    Category.associate = function(models){
        Category.belongsTo(models.Room, {
            foreignKey: {
                allowNull: true
            }
        });
    }

    return Category;
}