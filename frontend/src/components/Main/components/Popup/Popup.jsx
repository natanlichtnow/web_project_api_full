import { useEffect } from "react";

export default function Popup(props) {
  // onClose desestruturando dos props
  const { onClose, title, children } = props;

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="popup" onClick={onClose}>
      <div
        className={`popup__content ${
          !title ? "popup__content_content_image" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close modal"
          className="popup__close"
          type="button"
          onClick={onClose} //chame onClose ao clicar no botão
        />
        
        {title && <h3 className="popup__title">{title}</h3>}

        {children}
      </div>
    </div>
  );
}