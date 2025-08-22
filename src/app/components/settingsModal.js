"use client";
import { X, Plus, RotateCcw, Import, Download, Save } from "lucide-react";
import modelsData from "../data/models.json";
import { useEffect, useRef, useState } from "react";
import ConfirmModal from "./confirmModal";

export default function SettingsModal({setSettingsModalOpen}) {
    const LOCAL_STORAGE_KEY = "expert-panel.models";
    const [models, setModels] = useState(modelsData.models);
    const [newModel, setNewModel] = useState("");
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [modelToRemove, setModelToRemove] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        try {
            const raw = typeof window !== "undefined" ? window.localStorage.getItem(LOCAL_STORAGE_KEY) : null;
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    setModels(parsed);
                }
            }
        } catch (err) {
            // ignore
        }
    }, []);

    const persistModels = (nextModels) => {
        setModels(nextModels);
        try {
            if (typeof window !== "undefined") {
                window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextModels));
            }
        } catch (err) {
            // ignore
        }
    };

    const handleAddModel = () => {
        const candidate = newModel.trim();
        if (!candidate) return;
        if (models.includes(candidate)) return;
        persistModels([...models, candidate]);
        setNewModel("");
    };

    const handleRemoveModel = (model) => {
        const next = models.filter((m) => m !== model);
        persistModels(next);
    };

    const handleResetDefaults = () => {
        try {
            if (typeof window !== "undefined") {
                window.localStorage.removeItem(LOCAL_STORAGE_KEY);
            }
        } catch (err) {
            // ignore
        }
        setModels(modelsData.models);
    };

    const handleExport = () => {
        const data = { models };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "models.json";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleImportFile = async (event) => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;
        try {
            const text = await file.text();
            const parsed = JSON.parse(text);
            const next = Array.isArray(parsed) ? parsed : Array.isArray(parsed.models) ? parsed.models : null;
            if (Array.isArray(next)) {
                persistModels(next);
            }
        } catch (err) {
            // ignore invalid imports silently for now
        } finally {
            event.target.value = "";
        }
    };

    const handleSaveToFile = async () => {
        // File System Access API (Chromium) only; fallback to export
        try {
            if (window.showSaveFilePicker) {
                const handle = await window.showSaveFilePicker({
                    suggestedName: "models.json",
                    types: [
                        {
                            description: "JSON Files",
                            accept: { "application/json": [".json"] }
                        }
                    ]
                });
                const writable = await handle.createWritable();
                const data = { models };
                await writable.write(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
                await writable.close();
            } else {
                handleExport();
            }
        } catch (err) {
            // user likely cancelled; no-op
        }
    };
    return (
        <div className="fixed top-0 left-0 w-full h-full bg-neutral-900/50 flex items-center justify-center p-10">
            <div className="bg-neutral-800 rounded-lg p-4 w-full h-full flex flex-col gap-4 overflow-y-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <button className="bg-neutral-700 text-white rounded-lg p-4 cursor-pointer h-full" onClick={() => setSettingsModalOpen(false)}>
                        <X className="w-full h-full" />
                    </button>
                </div>
                <div className="flex flex-col gap-4 bg-neutral-700 rounded-lg p-4 w-1/3">
                    <div className="flex items-center justify-between border-b border-neutral-600 pb-4">
                        <h1 className="text-lg font-bold">Models</h1>
                        <p className="text-sm text-neutral-400">The models to use in the chat</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center w-full gap-2">
                            <input
                                type="text"
                                className="w-full h-10 bg-neutral-800 rounded-lg p-4"
                                placeholder="Add model e.g. openai/gpt-4o-mini"
                                value={newModel}
                                onChange={(e) => setNewModel(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleAddModel();
                                    }
                                }}
                            />
                            <button className="bg-neutral-700 text-white rounded-lg p-4 cursor-pointer h-full" onClick={handleAddModel} title="Add model">
                                <Plus className="w-full h-full" />
                            </button>
                        </div>
                        <div className="flex items-start flex-col justify-between w-full overflow-y-auto gap-2">
                            {models.map((model, index) => (
                                <div key={index} className="flex items-center justify-between w-full">
                                    <p className="text-sm text-neutral-400 w-full">{model}</p>
                                    <button className="bg-neutral-700 text-white rounded-lg p-4 cursor-pointer h-full" onClick={() => {
                                        setConfirmModalOpen(true);
                                        setModelToRemove(model);
                                    }}>
                                        <X className="w-full h-full" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-start w-full gap-2 pt-2 border-t border-neutral-600">
                            <button className="bg-neutral-700 text-white rounded-lg p-4 cursor-pointer h-full flex items-center gap-2" onClick={handleResetDefaults} title="Reset to defaults">
                                <RotateCcw className="w-4 h-4" />
                                <span>Reset</span>
                            </button>
                            <button className="bg-neutral-700 text-white rounded-lg p-4 cursor-pointer h-full flex items-center gap-2" onClick={handleExport} title="Export models.json">
                                <Download className="w-4 h-4" />
                                <span>Export</span>
                            </button>
                            <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
                            <button className="bg-neutral-700 text-white rounded-lg p-4 cursor-pointer h-full flex items-center gap-2" onClick={handleImportClick} title="Import models.json">
                                <Import className="w-4 h-4" />
                                <span>Import</span>
                            </button>
                            <button className="bg-neutral-700 text-white rounded-lg p-4 cursor-pointer h-full flex items-center gap-2" onClick={handleSaveToFile} title="Save to file (Chromium)">
                                <Save className="w-4 h-4" />
                                <span>Save to file</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {confirmModalOpen && (
                <ConfirmModal
                    setConfirmModalOpen={setConfirmModalOpen}
                    modelToRemove={modelToRemove}
                    onConfirm={() => handleRemoveModel(modelToRemove)}
                />
            )}
        </div>
    )
}