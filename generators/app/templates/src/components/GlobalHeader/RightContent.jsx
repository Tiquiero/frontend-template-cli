import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import React from 'react';
import { connect, useIntl } from 'umi';
import SelectLang from '../SelectLang';
import Avatar from './AvatarDropdown';
import styles from './index.less';

const GlobalHeaderRight = (props) => {
  const intl = useIntl();
  const { theme, layout, platformInfo } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  const menu = (
    <Menu>
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="/custom-user-dashboard">
          {platformInfo?.iamTitle || JSON.parse(localStorage.getItem('platformConfig'))?.iamTitle}
        </a>
      </Menu.Item>
    </Menu>

  );

  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}
    >
      <Dropdown overlay={menu}>
        <a className="ant-dropdown-link" style={{ display: 'inline-block', margin: '0 10px' }} onClick={e => e.preventDefault()}>
          {intl.formatMessage({ id: 'component.globalHeader.rightContent.globalHeaderRight.menu' })} <DownOutlined />
        </a>
      </Dropdown>
      <Avatar menu />
      <SelectLang className={styles.action} />
    </div>
  );
};

export default connect(({ settings, common }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  projectName: common.projectName,
  platformInfo: common.platformInfo,
}))(GlobalHeaderRight);
