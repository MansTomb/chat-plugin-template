// ArticleTree.tsx
import React from 'react';
import { Tree } from 'antd';
import { Article } from '@/type';

interface ArticleTreeProps {
  treeData: TreeNode[];
  onArticleSelect: (article: Article) => void;
}

export interface TreeNode {
    title: string;
    key: string;
    children?: TreeNode[];
    article?: Article;
  }

const ArticleTree: React.FC<ArticleTreeProps> = ({ treeData, onArticleSelect }) => {
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
