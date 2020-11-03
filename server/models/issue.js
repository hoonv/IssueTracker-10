const sequelize = require('sequelize');
const { issue, user, milestone, label } = require('./database');
const errorMessages = require('../services/errorMessages');

const { Op } = sequelize;

const issueType = {
  closed: 0,
  open: 1,
};

const createIssueLabel = async ({ issueInfo, labels }) => {
  try {
    const result = await Promise.all(
      labels.map(async (labelId) => {
        await issueInfo.addLabel(labelId);
      }),
    );
    return result;
  } catch (err) {
    throw new Error(errorMessages.issue.createFailed);
  }
};

const createIssueAssignee = async ({ issueInfo, assignees }) => {
  try {
    const result = await Promise.all(
      assignees.map(async (userId) => {
        await issueInfo.addAssignee(userId);
      }),
    );
    return result;
  } catch (err) {
    throw new Error(errorMessages.issue.createFailed);
  }
};

const createIssue = async (issueData) => {
  try {
    const { userId, title, milestoneId, assignees = [], labels = [] } = issueData;
    const issueInfo = await issue.create({
      author: userId,
      title,
      state: issueType.open,
      milestoneId,
    });
    if (labels.length > 0) await createIssueLabel({ issueInfo, labels });
    if (assignees.length > 0) await createIssueAssignee({ issueInfo, assignees });
    return issueInfo;
  } catch (err) {
    throw new Error(errorMessages.issue.createFailed);
  }
};

const deleteIssueById = async (issueId) => {
  try {
    const result = await issue.destroy({ where: { id: issueId } });
    if (result) return true;
    return false;
  } catch (err) {
    throw new Error(errorMessages.issue.deleteFailed);
  }
};

const findIssueById = async (id) => {
  try {
    const issueInfo = issue.findOne({
      attributes: ['id', 'title', 'state', 'createdAt'],
      include: [
        {
          model: user,
          attributes: ['id', 'username'],
          required: true,
        },
        {
          model: milestone,
          attributes: ['id', 'title'],
        },
        {
          model: label,
          attributes: ['id', 'title', 'color'],
          through: {
            attributes: [],
          },
        },
        {
          model: user,
          as: 'assignees',
          attributes: ['id', 'username', 'avatar'],
          through: {
            attributes: [],
          },
        },
      ],
      where: { id },
    });

    return issueInfo;
  } catch (err) {
    throw new Error(errorMessages.issue.notFoundError);
  }
};

const findIssueAll = async () => {
  try {
    const issues = await issue.findAll({
      attributes: ['id', 'author', 'title', 'state', 'createdAt', 'updatedAt', 'milestoneId'],
      include: [
        {
          model: user,
          attributes: ['id', 'username', 'avatar'],
          require: true,
        },
        {
          model: milestone,
          as: 'milestone',
          attributes: ['id', 'title'],
        },
        {
          model: label,
          attributes: ['id', 'title', 'color'],
        },
        {
          model: user,
          as: 'assignees',
          attributes: ['id', 'username', 'avatar'],
        },
      ],
    });
    return issues.map((row) => {
      const { dataValues } = row;
      const { user: userData, ...rest } = dataValues;
      return { ...rest, author: { ...userData.dataValues } };
    });
  } catch (err) {
    throw new Error(errorMessages.issue.notFoundError);
  }
};

const countAllClosedIssues = async () => {
  try {
    const closedCount = await issue.count({ where: { state: issueType.closed } });

    return closedCount;
  } catch (err) {
    throw new Error(errorMessages.issue.notFoundError);
  }
};

const countAllOpenIssues = async () => {
  try {
    const openCount = await issue.count({ where: { state: issueType.open } });

    return openCount;
  } catch (err) {
    throw new Error(errorMessages.issue.notFoundError);
  }
};

const countClosedIssuesByMilestone = async (milestoneId) => {
  try {
    const closedCount = await issue.count({ where: { state: issueType.closed, milestoneId } });

    return closedCount;
  } catch (err) {
    throw new Error(errorMessages.issue.notFoundError);
  }
};

const countOpenIssuesByMilestone = async (milestoneId) => {
  try {
    const openCount = await issue.count({ where: { state: issueType.open, milestoneId } });

    return openCount;
  } catch (err) {
    throw new Error(errorMessages.issue.notFoundError);
  }
};

const countIssuesByMilestone = async (milestoneId) => {
  try {
    const closedCount = await countClosedIssuesByMilestone(milestoneId);
    const openCount = await countOpenIssuesByMilestone(milestoneId);
    return { closed: closedCount, open: openCount };
  } catch (err) {
    throw new Error(errorMessages.issue.notFoundError);
  }
};

const compareAuthor = async (userId, issueId) => {
  try {
    const result = issue.findOne({
      where: {
        id: issueId,
        author: userId,
      },
    });

    return result;
  } catch (err) {
    throw new Error(errorMessages.issue.compareAuthorFailed);
  }
};

const updateIssueTitle = async (id, title) => {
  try {
    const result = issue.update(
      {
        title,
      },
      {
        where: { id },
      },
    );
    return result;
  } catch (err) {
    throw new Error(errorMessages.issue.updateFailed);
  }
};

const updateStateOfIssues = async (stateData) => {
  try {
    const { state, issueIds } = stateData;
    const [updatedResult] = await issue.update(
      { state },
      {
        where: {
          id: {
            [Op.in]: issueIds,
          },
        },
      },
    );
    return updatedResult === issueIds.length;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  createIssue,
  deleteIssueById,
  findIssueById,
  findIssueAll,
  countAllClosedIssues,
  countAllOpenIssues,
  countIssuesByMilestone,
  compareAuthor,
  updateIssueTitle,
  updateStateOfIssues,
};
