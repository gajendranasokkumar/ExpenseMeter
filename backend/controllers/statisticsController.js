const statisticsService = require("../services/statisticsService");

class StatisticsController {
  async getDailyStats(req, res) {
    try {
      const { userId } = req.params;
      const { day, month, year } = req.body;
      if (!userId || !day || !month || !year) {
        return res.status(400).json({ message: "userId, day, month, year are required" });
      }
      const dailyStats = await statisticsService.getDailyStats(userId, day, month, year);
      return res.status(200).json(dailyStats);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getMonthlySummary(req, res) {
    try {
      const { userId } = req.params;
      const { month, year } = req.body;
      if (!userId || !month || !year) {
        return res.status(400).json({ message: "userId, month, year are required" });
      }
      const summary = await statisticsService.getMonthlySummary(userId, month, year);
      return res.status(200).json(summary);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new StatisticsController();
