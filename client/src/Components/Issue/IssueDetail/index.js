import React, { useEffect, useContext } from 'react';
import styled from 'styled-components';
import { AuthStateContext, AuthDispatchContext } from '../../../Context/AuthContext';
import { request } from '../../../Api';
import Header from './IssueDetailHeader';
import CommentInput from './CommentInput';
import IssueSideBar from '../IssueSideBar';
import CommentList from './CommentList';
import { IssueDispatchContext } from '../../../Context/IssueContext';
import { MilestoneDispatchContext } from '../../../Context/MilestoneContext';
import { IssueInfoDispatchContext } from '../../../Context/IssueInfoContext';

const Wrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const DiscussionSection = styled.section`
  display: flex;
`;

const CommentSection = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const IssueDetail = ({ match }) => {
  const authState = useContext(AuthStateContext);
  const authDispatch = useContext(AuthDispatchContext);
  const issueDispatch = useContext(IssueDispatchContext);
  const milestoneDispatch = useContext(MilestoneDispatchContext);
  const issueInfoDispatch = useContext(IssueInfoDispatchContext);
  const { id } = match.params;

  const fetchUserInfo = async () => {
    if (!authState.user.id) {
      const config = { url: '/auth/user', method: 'GET', token: authState.token };
      const { status, data } = await request(config);
      if (status === 401) authDispatch({ type: 'LOGOUT' });
      if (data) authDispatch({ type: 'SET_USERINFO', data });
    }
  };

  const fetchIssueAllData = async () => {
    const config = { url: '/api/all', method: 'GET', token: authState.token };
    const { status, data } = await request(config);
    if (status === 401) authDispatch({ type: 'LOGOUT' });
    if (data) issueDispatch({ type: 'STORE_DETAIL_DATA', payload: data });
  };

  const fetchMilestoneData = async () => {
    const params = { state: 1 };
    const config = { url: '/api/milestone', method: 'GET', token: authState.token, params };
    const { status, data } = await request(config);
    if (status === 401) authDispatch({ type: 'LOGOUT' });
    if (data) milestoneDispatch({ type: 'GET_OPEN_MILESTONE', data });
  };

  const fetchIssueData = async () => {
    const config = { url: `/api/issue/${id}`, method: 'GET', token: authState.token };
    const { status, data = {} } = await request(config);
    if (status === 401) authDispatch({ type: 'LOGOUT' });
    if (data) issueInfoDispatch({ type: 'GET_ISSUE_INFO', data });
  };

  const fetchComments = async () => {
    const config = { url: `/api/issue/${id}/comment`, method: 'GET', token: authState.token };
    const { status, data = {} } = await request(config);
    if (status === 401) authDispatch({ type: 'LOGOUT' });
    if (data) issueInfoDispatch({ type: 'SET_COMMENTS', data });
  };

  useEffect(() => {
    fetchUserInfo();
    fetchIssueAllData();
    fetchMilestoneData();
    fetchIssueData();
    fetchComments();
  }, []);

  return (
    <Wrapper>
      <Header />
      <DiscussionSection>
        <CommentSection>
          <CommentList />
          <CommentInput />
        </CommentSection>
        <IssueSideBar />
      </DiscussionSection>
    </Wrapper>
  );
};

export default IssueDetail;
