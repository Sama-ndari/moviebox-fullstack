import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  callback: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey;
        const metaMatch = shortcut.meta ? event.metaKey : !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (keyMatch && ctrlMatch && metaMatch && shiftMatch) {
          event.preventDefault();
          shortcut.callback();
          break;
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Global keyboard shortcuts hook
export function useGlobalShortcuts(navigate: (path: string) => void, openSearch?: () => void) {
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrl: true,
      callback: () => openSearch?.(),
    },
    {
      key: 'k',
      meta: true,
      callback: () => openSearch?.(),
    },
    {
      key: 'h',
      ctrl: true,
      callback: () => navigate('/'),
    },
    {
      key: 'b',
      ctrl: true,
      callback: () => navigate('/browse'),
    },
    {
      key: 'Escape',
      callback: () => {
        // Close any open modals/dialogs
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(event);
      },
    },
  ]);
}
