import React, { useEffect } from 'react';
import { connect } from 'umi';
import { message } from 'antd';
import NoticeIcon from '../NoticeIcon';
import styles from './index.less';
import { io } from 'socket.io-client';

const ENDPOINT = 'http://localhost:8888';

const mockData = [];
for (let i = 1; i < 20; i++) {
  mockData.push({
    avatar: 'http://linxunzyf.cn/img/avatar.jpg',
    title: '这是标题',
    description: '这是描述信息',
    datetime: Date.now(),
    extra: '这是额外信息',
    key: i,
    read: Math.random() > .5,
  })
}

const NoticeIconView = props => {
  const { currentUser } = props;

  useEffect(() => {
    // const socket = io(ENDPOINT, { withCredentials: true });
    // socket.on('notice', data => {
    //   console.log(data);
    // });
  }, []);

  return (
    <NoticeIcon
      className={styles.action}
      count={mockData.length}
      onItemClick={(item) => {
        console.log(item);
      }}
      loading={false}
      clearText='清空'
      viewMoreText='查看更多'
      onClear={() => {
        console.log('clear all message')
      }}
      onPopupVisibleChange={visible => {
        console.log(visible);
      }}
      onViewMore={() => message.info('Click on view more')}
      clearClose
    >
      <NoticeIcon.Tab
        tabKey='system'
        count={0}
        list={[]}
        title='系统'
        emptyText='您已读完所有系统消息'
        showViewMore
      />
      <NoticeIcon.Tab
        tabKey='message'
        count={mockData.length}
        list={mockData}
        title='通知'
        emptyText='您已读完所有通知消息'
        showViewMore
      />
      <NoticeIcon.Tab
        tabKey='approval'
        count={0}
        list={[]}
        title='审批'
        emptyText='您已读完所有审批消息'
        showViewMore
      />
    </NoticeIcon>
  );
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(NoticeIconView);
