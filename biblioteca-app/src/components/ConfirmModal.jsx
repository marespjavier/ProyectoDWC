import React from "react"

/*
|--------------------------------------------------------------------------
| Modal confirmación reutilizable
|--------------------------------------------------------------------------
*/

export function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
}) {
  /*
  |--------------------------------------------------------------------------
  | Oculto
  |--------------------------------------------------------------------------
  */

  if (!open) return null

  return (
    <div className="modal-overlay">
      <div className="confirm-modal">
        <h2>{title}</h2>

        <p>{message}</p>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onCancel}>
            Cancelar
          </button>

          <button className="btn-danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
