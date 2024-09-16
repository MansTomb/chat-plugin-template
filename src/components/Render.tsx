import React, { memo, useState } from 'react';
import { Button } from 'antd';
import ArticleTree from './ArticleTree';
import ArticleModal from './ArticleModal';
import { Article, ResponseData, Settings } from '@/type';
import SettingsForm from './SettingsForm';
import { Flexbox } from 'react-layout-kit';

interface RenderProps extends ResponseData {
  settings: Settings;
  fetching: boolean;
  updateSettings: (newSettings: Settings) => void;
  fetchData: (settings: Settings) => Promise<void>;
}

const Render = memo<RenderProps>(({ articles, settings, fetching, updateSettings, fetchData }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const handleFetchData = async () => {
    await fetchData(settings);
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
      <Button onClick={handleFetchData} type="primary" loading={fetching}>
        Fetch
      </Button>
      <ArticleTree articles={articles} onArticleSelect={handleArticleClick} />
      <ArticleModal article={selectedArticle} onClose={handleCloseModal} />
    </Flexbox>
  );
});

export default Render;
