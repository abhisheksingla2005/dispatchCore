const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EmailQuotaTracking = sequelize.define(
    'EmailQuotaTracking',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date for daily tracking (UTC midnight)',
        index: true,
      },
      dailyCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'daily_count',
        comment: 'Emails sent today (resets at UTC midnight)',
      },
      monthlyCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'monthly_count',
        comment: 'Emails sent this month (resets on 1st UTC)',
      },
      monthYear: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'month_year',
        comment: 'Format: YYYY-MM for monthly tracking',
        index: true,
      },
    },
    {
      tableName: 'email_quota_tracking',
      timestamps: true,
      underscored: true,
      paranoid: false,
    },
  );

  return EmailQuotaTracking;
};
