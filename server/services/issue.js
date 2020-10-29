const IssueModel = require('../models/issue');
const CommentModel = require('../models/comment');

const checkValidation = {
  create: (issueData) => {
    const { title, content, labels, assignees, milestone } = issueData;
    if (!title) return false;
    if (content && typeof content !== 'string') return false;
    if (labels && !Array.isArray(labels)) return false;
    if (assignees && !Array.isArray(assignees)) return false;
    if (milestone && !Array.isArray(milestone)) return false;
    return true;
  },
};

const createIssue = async (req, res) => {
  try {
    const issueData = req.body;
    const { id } = req.user;
    if (!checkValidation.create(issueData)) {
      return res.status(400).json({ message: '' });
    }

    const { content } = issueData;
    const { id: issueId } = await IssueModel.createIssue({ ...issueData, userId: id });
    await CommentModel.createComment({ userId: id, issueId, content });
    return res.status(200).json({ message: '' });
  } catch (err) {
    return res.status(500).json({ message: '' });
  }
};

module.exports = {
  createIssue,
};
