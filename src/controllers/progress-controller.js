import Progress from '../models/progress.js';

export const getProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    let progress = await Progress.findOne({ user: userId, course: courseId });

    if (!progress) {
      progress = { progress: {} };
    }

    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { courseId, contentId, completed } = req.body;
    const userId = req.user.id;

    let progress = await Progress.findOne({ user: userId, course: courseId });

    if (!progress) {
      progress = new Progress({ user: userId, course: courseId, progress: {} });
    }

    progress.progress.set(contentId, completed);
    await progress.save();

    res.json({ message: 'Progress updated successfully', progress: progress.progress });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};