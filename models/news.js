/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('news', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		article_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		title: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		descrption: {
			type: DataTypes.STRING(300),
			allowNull: true
		},
		img: {
			type: DataTypes.STRING(300),
			allowNull: true
		},
	}, {
		tableName: 'news',
		timestamps: true,
		paranoid: true,
		createdAt: false,
		updatedAt: 'update_time',
		deletedAt: 'delete_time'
	});
};
