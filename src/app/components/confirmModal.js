export default function ConfirmModal({setConfirmModalOpen, modelToRemove, onConfirm}) {
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-neutral-900/80 flex items-center justify-center p-10">
            <div className="bg-neutral-800 rounded-lg p-4 w-1/3 h-1/3 flex flex-col gap-4 items-center justify-center">
                <h1 className="text-2xl font-bold">Confirm</h1>
                <p className="text-sm text-neutral-400">Are you sure you want to remove {modelToRemove}?</p>
                <div className="flex items-center justify-between gap-4">
                    <button className="bg-neutral-700 text-white rounded-lg p-4 cursor-pointer h-full" onClick={() => setConfirmModalOpen(false)}>
                        Cancel
                    </button>
                    <button className="bg-red-500 text-white rounded-lg p-4 cursor-pointer h-full" onClick={() => {
                        if (typeof onConfirm === "function") {
                            onConfirm();
                        }
                        setConfirmModalOpen(false);
                    }}>
                        Remove
                    </button>
                </div>
            </div>
        </div>
    )
}