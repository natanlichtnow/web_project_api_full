export default function RemoveCard({ onConfirm }) {
  function handleSubmit(e) {
    e.preventDefault();
    if (onConfirm) onConfirm();
  }

  return (
    <>
      
      <form className="popup__form" id="delete-card-form" onSubmit={handleSubmit}>
        <button className="button popup__button" type="submit">Sim</button>
      </form>
    </>
  );
}