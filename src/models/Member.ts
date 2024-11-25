export interface Department {
  id: number;
  name: string;
}

export interface StudyType {
  id: number;
  name: string;
}

export interface MemberFormData {
  firstName: string;
  lastName: string;
  nickName: string;
  gender: 'M' | 'F' | '';
  department: string;
  isGraduated: boolean;
  graduationYear?: number;
  grade?: number;
  studyType: string;
}

export const mapMemberFormDataToRequest = (data: MemberFormData) => {
  return {
    first_name: data.firstName,
    last_name: data.lastName,
    nick_name: data.nickName,
    grade: data.grade,
    department: data.department,
    study_type: data.studyType,
    is_graduated: data.isGraduated,
    year_of_graduation: data.graduationYear,
    gender: data.gender,
  };
};
