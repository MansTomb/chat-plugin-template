import { Card } from 'antd';
import { createStyles } from 'antd-style';
import dayjs from 'dayjs';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { ResponseData } from '@/type';

const useStyles = createStyles(({ css, token }) => ({
  date: css`
    color: ${token.colorTextQuaternary};
  `,
}));

const Render = memo<Partial<ResponseData>>(({ folders }) => {
  const { styles } = useStyles();

  // render list of folders
  return (
    <Flexbox gap={24}>
      <Flexbox gap={8}>
        List of folders
        <Flexbox gap={12}>
          {folders?.map((folder) => (
            <Card key={folder.name} title={folder.name}>
              <div>Folder</div>
            </Card>
          ))}
        </Flexbox>
      </Flexbox>
    </Flexbox>
  );
});

export default Render;
