function InfoTooltip({ isOpen, onClose, isSuccess }) {
  return (
    <div className={`popup popup_type_tooltip ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container popup__container_type_tooltip">
        <button className="popup__close" type="button" onClick={onClose} />
        <div className={`popup__tooltip-icon ${isSuccess ? 'popup__tooltip-icon_success' : 'popup__tooltip-icon_error'}`} />
        <p className="popup__tooltip-message">
          {isSuccess
            ? 'Vitória! Você se registrou com sucesso.'
            : 'Ops, algo deu errado! Por favor, tente novamente.'}
        </p>
      </div>
    </div>
  );
}

export default InfoTooltip;
