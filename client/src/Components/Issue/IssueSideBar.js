import React from 'react';
import styled from 'styled-components';
import SideBarElement from './SideBarElement';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  margin-top: 30px;
  margin-left: 20px;
`;

const NewIssue = () => {
  return (
    <Wrapper>
      <SideBarElement type="assignees" />
      <SideBarElement type="labels" />
      <SideBarElement type="milestone" />
    </Wrapper>
  );
};

export default NewIssue;
