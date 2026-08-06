import { createPortal } from 'react-dom';
import '../styles/ConfirmDialog.css';

export default function ConfirmDialog({ message, confirmLabel = 'Sí, mover', onConfirm, onCancel }) {
    if (!message) return null;

    return createPortal(
        <div className="confirm-dialog-overlay" onClick={onCancel}>
            <div className="confirm-dialog-box" onClick={e => e.stopPropagation()}>
                <p className="confirm-dialog-text">{message}</p>
                <div className="confirm-dialog-actions">
                    <button className="confirm-dialog-btn confirm-dialog-cancel" onClick={onCancel}>Cancelar</button>
                    <button className="confirm-dialog-btn confirm-dialog-confirm" onClick={onConfirm}>{confirmLabel}</button>
                </div>
            </div>
        </div>,
        document.body
    );
}
