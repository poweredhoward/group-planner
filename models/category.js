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

    //What about user choice? Can this belong to user too?
    Category.associate = function(models){
        console.log(models.UserCategory);
        Category.belongsTo(models.Room, {
            foreignKey: {
                allowNull: true
            }
        });

        Category.belongsToMany(models.User, {
            through: models.UserCategory
        })
    }

    return Category;
}