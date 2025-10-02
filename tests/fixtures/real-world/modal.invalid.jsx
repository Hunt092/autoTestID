function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
	if (!isOpen) return null;

	return (
		<div className="modal-backdrop" onClick={onClose}>
			<div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<h3>{title}</h3>
					<button className="modal-close" onClick={onClose}>
						×
					</button>
				</div>

				<div className="modal-body">
					<p>{message}</p>
				</div>

				<div className="modal-footer">
					<button className="btn-cancel" onClick={onClose}>
						Cancel
					</button>
					<button className="btn-confirm" onClick={onConfirm}>
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
}
