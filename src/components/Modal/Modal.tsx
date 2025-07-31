import { useEffect, useRef } from "react";
import styled from "./Modal.module.css";


interface ModalProps {
  children: React.ReactNode; //???
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  
  const backdopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
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
    if (e.target === backdopRef.current) {
      onClose();
    }
  }

  return (
    <div className={styled.backdrop} role="dialog" aria-modal="true" ref={backdopRef} onClick={handleClickOutside}>
      <div className={styled.modal}>
        <button className={styled.closeButton} aria-label="Close modal" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
