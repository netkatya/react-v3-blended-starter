import { createPortal } from "react-dom";
import css from "./Modal.module.css";
import { useEffect, useRef } from "react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const modalRoot = document.getElementById('modal-root') as HTMLElement;

export default function Modal({ children, onClose }: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

            const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        }
    window.addEventListener('keydown', handleKeyDown);
    
            return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [onClose]);

    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === backdropRef.current) {
            onClose();
        }
    }

  
if (!modalRoot) {
        console.error('modal-root not found')
        return null;
    };

  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleClickOutside} ref={backdropRef}>
      <div className={css.modal}>{children}</div>
    </div>, modalRoot
  )

}
