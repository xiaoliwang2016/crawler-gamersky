/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('article', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		title: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		source: {
			type: DataTypes.STRING(30),
			allowNull: true
		},
		views: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		author: {
			type: DataTypes.STRING(30),
			allowNull: true
		},
		editor: {
			type: DataTypes.STRING(30),
			allowNull: true
		},
		follow: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: true
		},
	}, {
		tableName: 'article',
		timestamps: true,
		paranoid: true,
		createdAt: false,
		updatedAt: 'update_time',
		deletedAt: 'delete_time'
	});
};
