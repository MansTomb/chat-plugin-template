// Loader.tsx
import React from 'react';
import { Spin } from 'antd';
import { createStyles } from 'antd-style';
import { Center } from 'react-layout-kit';

// Define the types for styles to ensure proper TypeScript checking
const useStyles = createStyles(({ css }) => ({
  loader: css`
    transition: opacity 3s ease;
    &.fadeIn {
      opacity: 1;
    }
    &.fadeOut {
      opacity: 0;
    }
  `,
}));

interface LoaderProps {
  loading: boolean; // Prop to determine if loading
}

const Loader: React.FC<LoaderProps> = ({ loading }) => {
  const styles = useStyles(); // Get the styles
  const loaderClass = `${styles.styles.loader} ${loading ? 'fadeIn' : 'fadeOut'}`; // Conditional class based on loading state
  return (
    <Center>
      <div className={loaderClass}>
        <Spin size="default" />
      </div>
    </Center>
  );
};

export default Loader;
