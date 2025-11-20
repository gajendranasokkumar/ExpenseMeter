const exportService = require('../services/exportService');

class ExportController {
  async getUserExport(req, res) {
    try {
      const { userId } = req.params;
      const data = await exportService.exportUserData(userId);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(400).json({ message: error.message || 'Unable to generate export data' });
    }
  }
}

module.exports = new ExportController();


