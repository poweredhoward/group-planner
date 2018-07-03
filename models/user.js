module.exports = function(sequelize, DataTypes){
    var User = sequelize.define("User", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        monday_time: {
            type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", "")
        },
        // monday_end: {
        //     type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", null),
        // defaultValue: null,
        // },
        tuesday_time: {
            type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", "")
        },
        // tuesday_end: {
        //     type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", null),
        // defaultValue: null,
        // },
        wednesday_time: {
            type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", "")
        },
        // wednesday_end: {
        //     type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", null),
        // defaultValue: null,
        // },
        thursday_time: {
            type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", "")
        },
        // thursday_end: {
        //     type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", null),
        // defaultValue: null,
        // },
        friday_time: {
            type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", "")
        },
        // friday_end: {
        //     type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", null),
        // defaultValue: null,
        // },
        saturday_time: {
            type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", "")        
        },
        // saturday_end: {
        //     type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", null),
        // defaultValue: null,
        // },
        sunday_time: {
            type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", "")
        }
        // sunday_end: {
        //     type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night")
        // }
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