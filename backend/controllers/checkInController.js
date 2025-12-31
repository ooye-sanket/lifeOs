const CheckIn = require('../models/CheckIn');

// Get check-ins
exports.getCheckIns = async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    let query = { userId: req.userId };

    if (date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: targetDate, $lte: endOfDay };
    } else if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const checkIns = await CheckIn.find(query).sort({ date: -1 });
    res.json(checkIns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create check-in
exports.createCheckIn = async (req, res) => {
  try {
    // Check if check-in exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingCheckIn = await CheckIn.findOne({
      userId: req.userId,
      date: { $gte: today, $lte: endOfDay },
    });

    if (existingCheckIn) {
      return res.status(400).json({ error: 'Already checked in today' });
    }

    const checkIn = new CheckIn({
      ...req.body,
      userId: req.userId,
    });
    await checkIn.save();
    res.status(201).json(checkIn);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get weekly summary
exports.getWeeklySummary = async (req, res) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const checkIns = await CheckIn.find({
      userId: req.userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    const summary = {
      totalDays: checkIns.length,
      moodDistribution: {},
      taskFeelingDistribution: {},
    };

    checkIns.forEach(checkIn => {
      summary.moodDistribution[checkIn.mood] = 
        (summary.moodDistribution[checkIn.mood] || 0) + 1;
      summary.taskFeelingDistribution[checkIn.taskFeeling] = 
        (summary.taskFeelingDistribution[checkIn.taskFeeling] || 0) + 1;
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};