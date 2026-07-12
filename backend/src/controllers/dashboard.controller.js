import * as dashboardService from "../services/dashboard.service.js";

/**
 * Get dashboard analytics stats
 */
export const getDashboard = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    
    res.status(200).json({
      success: true,
      message: "Dashboard analytics retrieved successfully",
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
