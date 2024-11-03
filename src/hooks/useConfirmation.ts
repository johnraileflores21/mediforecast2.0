import { useContext } from 'react';
import { ConfirmationContext } from '../components/ConfirmationContext';
import { ConfirmationContextType } from '../components/type';

export const useConfirmation = (): ConfirmationContextType['confirm'] => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context.confirm;
};