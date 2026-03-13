import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  loading?: boolean;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, loading }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-neutral-900 border border-neutral-800 w-full max-w-xs sm:max-w-md rounded-3xl p-4 sm:p-8 shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-2 sm:top-4 right-2 sm:right-4 text-zinc-500 hover:text-white"><X size={20}/></button>
            <div className="flex flex-col items-center text-center space-y-2 sm:space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
                <AlertTriangle size={24} className="sm:size-32" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Critical Action</h3>
              <p className="text-zinc-400 text-xs sm:text-sm">Are you sure you want to delete <span className="text-white font-bold">{title}</span>? This action is permanent and will remove all associated logs.</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full pt-2 sm:pt-4">
                <button 
                  onClick={onClose}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-neutral-800 hover:bg-neutral-700 text-zinc-300 font-bold rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-600/20 transition-all flex items-center justify-center"
                >
                  {loading ? "Deleting..." : "Delete User"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}