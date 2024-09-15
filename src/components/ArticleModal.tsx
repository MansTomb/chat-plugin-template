// ArticleModal.tsx
import React from 'react';
import { Modal } from 'antd';
import ReactMarkdown from 'react-markdown';
import { Article } from '@/type';
import { SyntaxHighlighter } from '@lobehub/ui';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  const renderContent = () => {
    if (!article) return null;

    const fileExtension = article.path.split('.').pop();

    // If the file is a markdown file (.md)
    if (fileExtension === 'md') {
      return <ReactMarkdown>{article.content}</ReactMarkdown>;
    }

    // If the file is a TypeScript file (.tsx)
    if (fileExtension === 'tsx' || fileExtension === 'ts') {
      return (
        <SyntaxHighlighter language="typescript">
          {article.content}
        </SyntaxHighlighter>
      );
    }

    return <div>Unsupported file type</div>;
  };

  return (
    <Modal
      title={article?.title}
      visible={!!article}
      onCancel={onClose}
      footer={null}
    >
      {renderContent()}
    </Modal>
  );
};

export default ArticleModal;
