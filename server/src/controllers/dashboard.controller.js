import DebugSession from '../models/DebugSession.js';

const sessionStatuses = ['OPEN', 'IN_PROGRESS', 'SOLVED', 'ARCHIVED'];

export async function getDashboardStats(request, response) {
  const userId = request.user._id;
  const ownedFilter = { userId };

  const [totalSessions, statusCounts, technologyDistribution, recentSessions] = await Promise.all([
    DebugSession.countDocuments(ownedFilter),
    DebugSession.aggregate([
      { $match: ownedFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    DebugSession.aggregate([
      { $match: { ...ownedFilter, technology: { $exists: true, $nin: ['', null] } } },
      { $group: { _id: '$technology', count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
    ]),
    DebugSession.find(ownedFilter)
      .sort({ updatedAt: -1 })
      .limit(8)
      .select('title technology status severity updatedAt createdAt'),
  ]);

  const statusMap = Object.fromEntries(statusCounts.map(({ _id, count }) => [_id, count]));

  return response.json({
    success: true,
    data: {
      totalSessions,
      solvedSessions: statusMap.SOLVED ?? 0,
      openSessions: statusMap.OPEN ?? 0,
      inProgressSessions: statusMap.IN_PROGRESS ?? 0,
      technologyDistribution: technologyDistribution.map(({ _id, count }) => ({
        technology: _id,
        count,
      })),
      recentSessions,
      statuses: Object.fromEntries(
        sessionStatuses.map((status) => [status, statusMap[status] ?? 0]),
      ),
    },
  });
}
