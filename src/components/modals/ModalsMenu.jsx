import { useState } from "react";
import { X } from "lucide-react";
import "../../styles/modals/ModalsMenu.css";

const SAVE_KEY = "ladyHungryGame";

const SettingsModal = ({ isOpen, onClose, onNewGame }) => {
    const [view, setView] = useState("main"); // "main" | "confirm" | "about" | "import"
    const [importText, setImportText] = useState("");
    const [toast, setToast] = useState(null);

    if (!isOpen) return null;

    const showToast = (msg, type = "ok") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 2500);
    };

    const handleExport = () => {
        const save = localStorage.getItem(SAVE_KEY);
        if (!save) return showToast("No hay partida guardada", "error");
        navigator.clipboard.writeText(save)
            .then(() => showToast("Partida copiada al portapapeles"))
            .catch(() => showToast("Error al copiar", "error"));
    };

    const handleImport = () => {
        try {
            const parsed = JSON.parse(importText);
            localStorage.setItem(SAVE_KEY, JSON.stringify(parsed));
            showToast("Partida importada — recarga para aplicar");
            setTimeout(() => window.location.reload(), 1500);
        } catch {
            showToast("JSON inválido", "error");
        }
    };

    const handleNewGame = () => {
        onNewGame();
        onClose();
    };

    return (
        <div className="settings-overlay" onClick={onClose}>
            <div className="settings-panel" onClick={e => e.stopPropagation()}>

                <div className="settings-header">
                    <span className="settings-title">⚙️ Ajustes</span>
                    <button className="settings-close" onClick={() => { setView("main"); onClose(); }}><X size={18} /></button>
                </div>

                {/* VISTA PRINCIPAL */}
                {view === "main" && (
                    <div className="settings-list">
                        <button className="settings-item" onClick={() => setView("confirm")}>
                            <span className="settings-item-icon">🔄</span>
                            <span className="settings-item-label">Nuevo juego</span>
                        </button>
                        <button className="settings-item" onClick={handleExport}>
                            <span className="settings-item-icon">💾</span>
                            <span className="settings-item-label">Exportar partida</span>
                        </button>
                        <button className="settings-item" onClick={() => setView("import")}>
                            <span className="settings-item-icon">📂</span>
                            <span className="settings-item-label">Importar partida</span>
                        </button>
                        <button className="settings-item" onClick={() => setView("about")}>
                            <span className="settings-item-icon">ℹ️</span>
                            <span className="settings-item-label">Sobre el juego</span>
                        </button>
                    </div>
                )}

                {/* CONFIRMACIÓN NUEVO JUEGO */}
                {view === "confirm" && (
                    <div className="settings-subview">
                        <p className="settings-warn-text">¿Seguro que quieres empezar de nuevo? Se perderá toda la partida actual.</p>
                        <div className="settings-row">
                            <button className="settings-btn-cancel" onClick={() => setView("main")}>Cancelar</button>
                            <button className="settings-btn-danger" onClick={handleNewGame}>Sí, reiniciar</button>
                        </div>
                    </div>
                )}

                {/* IMPORTAR PARTIDA */}
                {view === "import" && (
                    <div className="settings-subview">
                        <p className="settings-subview-label">Pega aquí tu save:</p>
                        <textarea
                            className="settings-import-input"
                            value={importText}
                            onChange={e => setImportText(e.target.value)}
                            placeholder='{"gold": 1000, ...}'
                            rows={5}
                        />
                        <div className="settings-row">
                            <button className="settings-btn-cancel" onClick={() => setView("main")}>Cancelar</button>
                            <button className="settings-btn-ok" onClick={handleImport} disabled={!importText.trim()}>Importar</button>
                        </div>
                    </div>
                )}

                {/* SOBRE EL JUEGO */}
                {view === "about" && (
                    <div className="settings-subview settings-about">
                        <div className="settings-about-title">🐾 Lady Hungry</div>
                        <p className="settings-about-desc">Un juego idle de minería y forja.</p>
                        <div className="settings-about-version">v0.1.0 — Alpha</div>
                        <button className="settings-btn-cancel" onClick={() => setView("main")}>Volver</button>
                    </div>
                )}

                {/* TOAST */}
                {toast && (
                    <div className={`settings-toast ${toast.type === "error" ? "settings-toast-error" : ""}`}>
                        {toast.msg}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsModal;
