import { useRef, useContext } from "react";
import CurrentUserContext from "../../../../../../contexts/CurrentUserContext";

export default function EditAvatar() {
  const avatarRef = useRef(null);
  const { handleUpdateAvatar } = useContext(CurrentUserContext) || {};

  function handleSubmit(e) {
    e.preventDefault();
    if (handleUpdateAvatar && avatarRef.current) {
      handleUpdateAvatar({ avatar: avatarRef.current.value });
    }
  }

  return (
    <form className="popup__form" id="edit-avatar-form" onSubmit={handleSubmit}>
      <input
        ref={avatarRef}
        className="popup__input popup__input_type_avatar"
        name="avatar"
        placeholder="Link da imagem"
        required
        type="url"
      />
      <button className="button popup__button" type="submit">Salvar</button>
    </form>
  );
}