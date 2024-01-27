import { create } from 'zustand';

interface useSettingsModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useSettingsModal = create<useSettingsModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useSettingsModal;
