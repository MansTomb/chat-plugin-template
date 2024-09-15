import { Button, Modal, Spin, Tree } from 'antd';
import { createStyles } from 'antd-style';
import { memo, useEffect, useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import ReactMarkdown from 'react-markdown';
import { Article, ResponseData, Settings } from '@/type';
import { Input } from '@lobehub/ui';

const useStyles = createStyles(({ css, token }) => ({
  list: css`
    margin-top: 16px;
  `,
  articleTitle: css`
    cursor: pointer;
    font-weight: bold;
    &:hover {
      color: ${token.colorPrimary};
    }
  `,
}));

interface TreeNode {
  title: string;
  key: string;
  children?: TreeNode[];
  article?: Article;
}

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

  const handleRootFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateSettings({ ...settings, DOCUMENTS_ROOT_FOLDER: value });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateSettings({ ...settings, FILTER: value });
  };

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
      <Flexbox gap={8}>
        <label htmlFor="documentsRootFolder">Document Root Folder:</label>
        <Input
          id="documentsRootFolder"
          value={settings.DOCUMENTS_ROOT_FOLDER}
          onChange={handleRootFolderChange}
          placeholder="Enter document root folder"
        />
      </Flexbox>

      <Flexbox gap={8}>
        <label htmlFor="filter">Filter (Separated by ;):</label>
        <Input
          id="filter"
          value={settings.FILTER}
          onChange={handleFilterChange}
          placeholder="Enter filter here (separated by ; regex supported)"
        />
      </Flexbox>

      <Button onClick={handleFetchData} type="primary" loading={loading}>
        Fetch
      </Button>

      {loading && <Spin size="small" style={{ marginLeft: 8 }} />}

      <Tree
        className={styles.list}
        treeData={treeData}
        defaultExpandAll={false}
        onSelect={(_, { node }) => {
          if (node.article) { // Check for the presence of an article
            handleArticleClick(node.article);
          }
        }}
        showLine
      />

      <Modal
        title={selectedArticle?.title}
        visible={!!selectedArticle}
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedArticle && (
          <ReactMarkdown>{selectedArticle.content}</ReactMarkdown>
        )}
      </Modal>
    </Flexbox>
  );
});

export default Render;
