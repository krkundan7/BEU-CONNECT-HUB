export function handleKeyboardNav(e: React.KeyboardEvent, onEnter: () => void, onEscape?: () => void): void {
  if (e.key === 'Enter') {
    e.preventDefault();
    onEnter();
  } else if (e.key === 'Escape' && onEscape) {
    e.preventDefault();
    onEscape();
  }
}
