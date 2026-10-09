import { useContext } from "react";
import ImagePopup from "../Popup/components/ImagePopup/ImagePopup";
import RemoveCard from "../Popup/components/RemoveCard/RemoveCard";
import CurrentUserContext from "../../../../contexts/CurrentUserContext";

export default function Card(props) {
  const { card, onCardClick, onCardDelete, onCardLike, onClosePopup } = props;
  const { name, link } = card;
  const { currentUser } = useContext(CurrentUserContext);

  const isLiked = Array.isArray(card.likes) && currentUser ? card.likes.some((u) => {
    const userId = typeof u === 'string' ? u : u._id;
    return userId === currentUser._id;
  }) : false;
  
  console.log('Card render:', card._id, 'currentUser:', currentUser?._id, 'likes:', card.likes, 'isLiked:', isLiked);
  
  const isOwn = currentUser ? (card.owner && (card.owner._id ? card.owner._id === currentUser._id : card.owner === currentUser._id)) : false;
  const cardLikeButtonClassName = `card__like-button ${isLiked ? 'card__like-button_is-active' : ''}`;

  function handleLikeClick() {
    console.log('Like clicked for card:', card._id, 'onCardLike:', !!onCardLike);
    if (onCardLike) onCardLike(card);
  }

  function handleDeleteClick() {
    console.log('Delete clicked for card:', card._id, 'onCardClick:', !!onCardClick);
    if (onCardClick) {
      onCardClick({ title: 'Tem certeza?', children: <RemoveCard onConfirm={() => { if (onCardDelete) onCardDelete(card); if (onClosePopup) onClosePopup(); }} /> });
    }
  }

  function handleImageError(e) {
    console.warn('Image failed to load:', link);
    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3EImage not found%3C/text%3E%3C/svg%3E';
  }

  return (
    <li className="card">
      <img 
        className="card__image" 
        src={link} 
        alt={name}
        onError={handleImageError}
        onClick={() => {
          console.log('Image clicked for card:', card._id, 'onCardClick:', !!onCardClick);
          if (onCardClick) onCardClick({ children: <ImagePopup card={card} /> });
        }}
      />
      {isOwn && (
        <button
          aria-label="Delete card"
          className="card__delete-button"
          type="button"
          onClick={handleDeleteClick}
        />
      )}
      <div className="card__description">
        <h2 className="card__title">{name}</h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            aria-label="Like card"
            type="button"
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
            style={{ marginRight: '8px' }}
          />
          <span style={{ color: '#000', fontSize: '14px', minWidth: '20px' }}>
            {Array.isArray(card.likes) ? card.likes.length : 0}
          </span>
        </div>
      </div>
    </li>
  );
}