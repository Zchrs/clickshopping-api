/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Avatar } from './Avatar';
import { BaseButton } from './BaseButton';
import { useTranslation } from 'react-i18next'; 
import axios from 'axios';
// import { useSelector } from 'react-redux';
const Comment = ({ name, content }) => {
  return (
    <div className="comments-addcomment">
      <h4>{name}</h4>
      <p>{content}</p>
    </div>
  );
};

const CommentForm = ({ addComment, productId, names }) => {
  const [content, setContent] = useState('');
  // const user = useSelector((state) => state.auth.user);
  // const names = user.name + ' ' + user.lastname;
  
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content) return;

    try {
      const { data } = await axios.post(
        import.meta.env.VITE_APP_API_POST_PRODUCTS_COMMENT,
        {
          user_id: names,
          product_id: productId,
          comment: content,
        }
      );

      addComment(data);
      setContent('');
    } catch (error) {
      console.error(
        'Error al guardar el comentario:',
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="comments-form">
        <form onSubmit={handleSubmit}>
        <div>
          <Avatar img={"default-avatar"} avtsmall={true} clas={"avatar"} nameSmall={"namesmall"} />
        </div>
          <textarea
            placeholder={t('globals.comment')}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <BaseButton 
          handleclick={handleSubmit}
          textLabel={true} 
          label={t('globals.commentBtn')} 
          classs={'button primary'} 
          colorbtn={"var(--bg-primary)"}
          colortextbtnprimary={"var(--light)"}
          colorbtnhoverprimary={"var(--bg-primary-tr)"}
          colortextbtnhoverprimary={"white"} 
          />
        </form>
    </div>
  );
};

export const Comments = () => {
  const [comments, setComments] = useState([]);
  const { t } = useTranslation(); 
  const addComment = (comment) => {
    setComments([...comments, comment]);
  };

  return (
    <div className="comments">
      <h2>{t('globals.comments')}</h2>
      <CommentForm addComment={addComment} />
      <div className="comments-list">
        {comments.map((comment, index) => (
          <Comment key={index} name={comment.name} content={comment.content} />
        ))}
      </div>
    </div>
  );
};

