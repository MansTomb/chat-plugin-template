// ArticleTree.tsx
import React from 'react';
import { Tree } from 'antd';
import { Article } from '@/type';
import { ar } from 'vitest/dist/chunks/reporters.WnPwkmgA';

interface ArticleTreeProps {
  articles: Article[]; // Pass articles as a prop
  onArticleSelect: (article: Article) => void;
}

export interface TreeNode {
  title: string;
  key: string;
  path: string;
  children?: TreeNode[];
  article?: Article;
}

// Function to build tree data from articles
const buildTreeData = (articles: Article[]): TreeNode[] => {
  const tree: Record<string, any> = {};

  if (!articles) return [];

  articles.forEach(article => {
    // add additional folder path at start of article path Documents.
    const pathWithFolder = `Documents/${article.path}`;
    const parts = pathWithFolder.split(/[\\\\/]|$/).filter(Boolean);
    let currentLevel = tree;

    parts.forEach((part, index) => {
      if (!currentLevel[part]) {
        currentLevel[part] = { children: [], path: parts.slice(0, index + 1).join('/') };
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
      key: value.path,
      path: value.path,
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

const ArticleTree: React.FC<ArticleTreeProps> = ({ articles, onArticleSelect }) => {
  const treeData = buildTreeData(articles); // Build tree data from articles

  return (
    <Tree
      treeData={treeData}
      defaultExpandAll={false}
      onSelect={(_, { node }) => {
        if (node.article) {
          onArticleSelect(node.article);
        }
      }}
      showLine
    />
  );
};

export default ArticleTree;
