module.exports = function(sequelize, DataTypes){
    var Room = sequelize.define("Room", {
        name:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: false
    });

    Room.associate = function(models){
        Room.hasMany(models.User, {
            onDelete: "cascade"
        });
    };

    return Room;
}