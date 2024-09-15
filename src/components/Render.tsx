
import React, { memo, useEffect, useState } from 'react';
import { Button } from 'antd';
import ArticleTree, { TreeNode } from './ArticleTree';
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
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  const settingsConfig = [
    { key: 'DOCUMENTS_ROOT_FOLDER', label: 'Document Root Folder', placeholder: 'Enter document root folder' } as Setting,
    { key: 'FILTER', label: 'Filter (Separated by ;)', placeholder: 'Enter filter here (separated by ; regex supported)' } as Setting,
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

  const buildTreeData = (articles: Article[]): TreeNode[] => {
    const tree: Record<string, any> = {};

    articles.forEach(article => {
      const parts = article.path.split(/[\\/]|$/).filter(Boolean);
      let currentLevel = tree;

      parts.forEach((part, index) => {
        if (!currentLevel[part]) {
          currentLevel[part] = { children: [] };
        }
        if (index === parts.length - 1) { // Last part is the file
          currentLevel[part].article = article; // Store the article object at file level
        }
        currentLevel = currentLevel[part].children; 
      });
    });

    const convertTree = (node: Record<string, any>): TreeNode[] => {
      return Object.entries(node).map(([key, value]) => ({
        title: key,
        key: key,
        children: convertTree(value.children || []),
        article: value.article, // Include article for leaf nodes
      })).sort((a, b) => {
        const isADirectory = a.children && a.children.length > 0;
        const isBDirectory = b.children && b.children.length > 0;
        if (isADirectory && !isBDirectory) return -1; // a is a directory, b is not
        if (!isADirectory && isBDirectory) return 1;  // b is a directory, a is not
        return 0; // both are either directories or files
      });
    };
    
    return convertTree(tree);
  };

  useEffect(() => {
    if (articles && articles.length > 0) {
      const formattedTreeData = buildTreeData(articles);
      setTreeData(formattedTreeData);
    }
  }, [articles]);

  return (
    <Flexbox gap={24}>
      <SettingsForm settings={settings} updateSettings={updateSettings} settingsConfig={settingsConfig} />
      <Button onClick={handleFetchData} type="primary" loading={loading}>
        Fetch
      </Button>
      {loading && <Loader />}
      <ArticleTree treeData={treeData} onArticleSelect={handleArticleClick} />
      <ArticleModal article={selectedArticle} onClose={handleCloseModal} />
    </Flexbox>
  );
});

export default Render;
