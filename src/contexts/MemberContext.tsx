import { createContext, ReactNode, useContext, useState } from 'react';

interface MemberContextType {
  memberName: string;
  setMemberName: (value: string) => void;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [memberName, setMemberName] = useState<string>('');

  return (
    <MemberContext.Provider value={{ memberName, setMemberName }}>
      {children}
    </MemberContext.Provider>
  );
}

export function useMember() {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error('useEditMode must be used within an EditModeProvider');
  }
  return context;
}
