import { createContext, ReactNode, useContext, useState } from 'react';

type IData = {
  name: string;
  status: string;
};
interface MemberContextType {
  memberData: IData;
  setMemberData: (value: IData) => void;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [memberData, setMemberData] = useState<IData>({ name: '', status: '' });

  return (
    <MemberContext.Provider value={{ memberData, setMemberData }}>
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
