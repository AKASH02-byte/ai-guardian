import React, { createContext, useContext, useMemo, useState } from 'react';
import { getEntityProfile, type EntityId, type EntityProfile } from '../data/entityProfiles';

interface EntityContextValue {
  activeEntityId: EntityId;
  entity: EntityProfile;
  setActiveEntityId: (id: EntityId) => void;
}

const EntityContext = createContext<EntityContextValue | null>(null);

export const EntityProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [activeEntityId, setActiveEntityId] = useState<EntityId>('bharat-financial');
  const value = useMemo(() => ({
    activeEntityId,
    entity: getEntityProfile(activeEntityId),
    setActiveEntityId
  }), [activeEntityId]);

  return <EntityContext.Provider value={value}>{children}</EntityContext.Provider>;
};

export const useEntity = (): EntityContextValue => {
  const context = useContext(EntityContext);
  if (!context) throw new Error('useEntity must be used inside EntityProvider');
  return context;
};
