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
            type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", ""),
            defaultValue: ""
        },
        // monday_end: {
        //     type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", null),
        // defaultValue: null,
        // },
        tuesday_time: {
            type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", ""),
            defaultValue: ""
        },
        // tuesday_end: {
        //     type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", null),
        // defaultValue: null,
        // },
        wednesday_time: {
            type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", ""),
            defaultValue: ""
        },
        // wednesday_end: {
        //     type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", null),
        // defaultValue: null,
        // },
        thursday_time: {
            type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", ""),
            defaultValue: ""
        },
        // thursday_end: {
        //     type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", null),
        // defaultValue: null,
        // },
        friday_time: {
            type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", ""),
            defaultValue: ""
        },
        // friday_end: {
        //     type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", null),
        // defaultValue: null,
        // },
        saturday_time: {
            type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", ""),
            defaultValue: ""
        },
        // saturday_end: {
        //     type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", null),
        // defaultValue: null,
        // },
        sunday_time: {
            type: DataTypes.ENUM("Morning", "Afternoon", "Evening", "Late Night", ""),
            defaultValue: ""
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