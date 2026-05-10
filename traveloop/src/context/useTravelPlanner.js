import { useContext } from 'react';
import { TravelPlannerContext } from './plannerContextValue';

export function useTravelPlanner() {
  const context = useContext(TravelPlannerContext);
  if (!context) {
    throw new Error('useTravelPlanner must be used inside TravelPlannerProvider');
  }
  return context;
}
