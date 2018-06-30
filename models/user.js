module.exports = function(sequelize, DataTypes){
    var User = sequelize.define("User", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        monday_start: {
            type: DataTypes.DATE
        },
        monday_end: {
            type: DataTypes.DATE
        },
        tuesday_start: {
            type: DataTypes.DATE
        },
        tuesday_end: {
            type: DataTypes.DATE
        },
        wednesday_start: {
            type: DataTypes.DATE
        },
        wednesday_end: {
            type: DataTypes.DATE
        },
        thursday_start: {
            type: DataTypes.DATE
        },
        thursday_end: {
            type: DataTypes.DATE
        },
        friday_start: {
            type: DataTypes.DATE
        },
        friday_end: {
            type: DataTypes.DATE
        },
        saturday_start: {
            type: DataTypes.DATE
        },
        saturday_end: {
            type: DataTypes.DATE
        },
        sunday_start: {
            type: DataTypes.DATE
        },
        sunday_end: {
            type: DataTypes.DATE
        }
    }, {
        timestamps: false
    });

    User.associate = function(models){
        User.belongsTo(models.Room, {
            foreignKey: {
                allowNull: false
            }
        });

        User.belongsToMany(models.Category, {
            through: models.UserCategory
        })

        User.hasMany(models.UserCategory);
    };

   
    return User;
}