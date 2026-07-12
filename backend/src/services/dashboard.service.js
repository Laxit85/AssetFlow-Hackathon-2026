import User from "../models/User.js";

/**
 * Service to aggregate dashboard analytics.
 * Queries user database and returns mock data placeholders for unbuilt modules.
 * @returns {promise<object>} Dashboard metrics.
 */
export const getDashboardStats = async () => {
  // Query actual user analytics
  const totalUsers = await User.countDocuments();
  const distinctDeps = await User.distinct("department");
  const totalDepartments = distinctDeps.filter(dep => dep && dep.trim() !== "").length;

  // Placeholder data for unbuilt modules
  return {
    totalUsers,
    totalDepartments,
    assetSummary: {
      available: 15,
      allocated: 42,
      maintenance: 3
    },
    bookingSummary: {
      pending: 4,
      approved: 12,
      rejected: 1
    },
    maintenanceSummary: {
      pending: 2,
      in_progress: 2,
      completed: 28
    },
    recentActivity: [
      {
        id: "act-1",
        description: "New user registration",
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: "act-2",
        description: "Dashboard initialized successfully",
        timestamp: new Date(Date.now() - 60 * 60 * 1000)
      }
    ]
  };
};
