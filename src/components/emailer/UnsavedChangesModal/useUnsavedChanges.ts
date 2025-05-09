import { useEffect, useState, useRef } from 'react';
import { useFormState } from 'react-final-form';
import { useHistory } from 'react-router-dom';

interface UnsavedChangesWarningProps {
  hasUnsavedChanges: boolean;
}

export const useUnsavedChangesWarning = ({
  hasUnsavedChanges,
}: UnsavedChangesWarningProps) => {
  const formState = useFormState();
  const dirty = formState.dirty || hasUnsavedChanges;

  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const nextLocationRef = useRef<string | null>(null);
  const unblockRef = useRef<() => void>(() => {});

  // Handle browser tab closing/reloading
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue =
          'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirty]);

  // Handle in-app navigation
  useEffect(() => {
    if (!dirty) {
      unblockRef.current();
      return;
    }

    const newUnblock = history.block((tx) => {
      if (dirty && tx.pathname !== history.location.pathname) {
        nextLocationRef.current = tx.pathname;
        setShowModal(true);
        return false;
      }
      return;
    });

    unblockRef.current = newUnblock;

    return () => newUnblock();
  }, [dirty, history]);

  const handleConfirmNavigation = () => {
    unblockRef.current();
    setShowModal(false);

    if (nextLocationRef.current) {
      setTimeout(() => {
        history.push(nextLocationRef.current!);
      }, 0);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    nextLocationRef.current = null;
  };

  return {
    showModal,
    handleConfirmNavigation,
    handleCloseModal,
  };
};
