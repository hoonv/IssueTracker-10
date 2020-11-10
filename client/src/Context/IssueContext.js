import { createContext } from 'react';

export const initialIssueState = {
  filter: {
    state: 'open',
    author: null,
    label: [],
    milestones: null,
    assignees: null,
  },
  issues: [],
  openCount: 0,
  closedCount: 0,
  checkedIds: [],
};

export const issueReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_HEADER': {
      const { openCount, closedCount } = action.payload;
      return {
        ...state,
        openCount,
        closedCount,
      };
    }
    case 'FETCH_ISSUES': {
      return {
        ...state,
        issues: [...action.payload],
      };
    }
    case 'OPEN': {
      return {
        ...state,
        filter: {
          ...state.filter,
          state: 'open',
        },
        issues: [...action.payload],
      };
    }
    case 'CLOSE': {
      return {
        ...state,
        filter: {
          ...state.filter,
          state: 'closed',
        },
        issues: [...action.payload],
      };
    }
    case 'ALL': {
      return {
        ...state,
        filter: {
          ...state.filter,
          state: 'all',
        },
        issues: [...action.payload],
      };
    }
    case 'SET_AUTHOR': {
      return {
        ...state,
        filter: {
          ...state.filter,
          author: action.id,
        },
        issues: [...action.payload],
      };
    }
    case 'REMOVE_AUTHOR': {
      return {
        ...state,
        filter: {
          ...state.filter,
          author: null,
        },
        issues: [...action.payload],
      };
    }
    case 'SET_ASSIGNEE': {
      return {
        ...state,
        filter: {
          ...state.filter,
          assignee: action.id,
        },
        issues: [...action.payload],
      };
    }
    case 'REMOVE_ASSIGNEE': {
      return {
        ...state,
        filter: {
          ...state.filter,
          assignee: null,
        },
        issues: [...action.payload],
      };
    }
    case 'CHECK_ISSUE': {
      return {
        ...state,
        checkedIds: [...state.checkedIds, action.id],
      };
    }
    case 'CHECK_ALL_ISSUE': {
      return {
        ...state,
        checkedIds: [...action.ids],
      };
    }
    case 'UNCHECK_ISSUE': {
      return {
        ...state,
        checkedIds: state.checkedIds.filter((id) => id !== action.id),
      };
    }
    case 'UNCHECK_ALL_ISSUE': {
      return {
        ...state,
        checkedIds: [],
      };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const IssueStateContext = createContext();
export const IssueDispatchContext = createContext();
