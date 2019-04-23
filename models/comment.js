/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('comment', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		avatar: {
			type: DataTypes.STRING(300),
			allowNull: true
		},
		nick_name: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		time: {
			type: DataTypes.DATE,
			allowNull: true
		},
		source: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		support: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		content: {
			type: DataTypes.STRING(300),
			allowNull: true
		},
	}, {
		tableName: 'comment',
		timestamps: true,
		paranoid: true,
		createdAt: false,
		updatedAt: 'update_time',
		deletedAt: 'delete_time'
	});
};
