// Render.tsx
import React, { memo, useEffect, useState } from 'react';
import { Button } from 'antd';
import ArticleTree from './ArticleTree';
import ArticleModal from './ArticleModal';
import Loader from './Loader';
import SettingsForm from './SettingsForm';
import { Article, ResponseData, Setting, Settings } from '@/type';
import { createStyles } from 'antd-style';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css, token }) => ({
  list: css`
    margin-top: 16px;
  `,
}));

interface RenderProps extends ResponseData {
  settings: Settings;
  updateSettings: (newSettings: Settings) => void;
  fetchData: () => Promise<void>;
}

const Render = memo<RenderProps>(({ articles, settings, updateSettings, fetchData }) => {
  const { styles } = useStyles();
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const settingsConfig = [
    { key: 'DOCUMENTS_ROOT_FOLDER', label: 'Document Root Folder', placeholder: 'Enter document root folder' } as Setting,
    { key: 'INCLUDE_FILTER', label: 'Include Filter (Separated by ;)', placeholder: 'Enter filter here (separated by ; regex supported)' } as Setting,
    { key: 'EXCLUDE_FILTER', label: 'Exclude Filter (Separated by ;)', placeholder: 'Enter exclude filter here (separated by ; regex supported)' } as Setting,
  ];

  const handleFetchData = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  return (
    <Flexbox gap={24}>
      <SettingsForm settings={settings} updateSettings={updateSettings} fetchData={fetchData} />
      <Button onClick={handleFetchData} type="primary" loading={loading}>
        Fetch
      </Button>
      {loading && <Loader />}
      <ArticleTree articles={articles} onArticleSelect={handleArticleClick} /> {/* Pass articles to ArticleTree */}
      <ArticleModal article={selectedArticle} onClose={handleCloseModal} />
    </Flexbox>
  );
});

export default Render;
