module.exports = function(sequelize, DataTypes){
    var Category = sequelize.define("Category", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
              len: [1]
            }
        },
        isDefault: {
           type:  DataTypes.BOOLEAN,
           defaultValue: true
        }
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
                allowNull: true,
                name: "RoomId"
            }
        });

        Category.belongsToMany(models.User, {
            through: models.UserCategory
        })
    }

    return Category;
}