// ArticleModal.tsx
import React from 'react';
import { Modal } from 'antd';
import ReactMarkdown from 'react-markdown';
import { Article } from '@/type';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  return (
    <Modal
      title={article?.title}
      visible={!!article}
      onCancel={onClose}
      footer={null}
    >
      {article && <ReactMarkdown>{article.content}</ReactMarkdown>}
    </Modal>
  );
};

export default ArticleModal;
