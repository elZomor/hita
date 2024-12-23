import { AlertCircle, LucideProps, User } from 'lucide-react';
import * as react from 'react';
import { toWords } from 'number-to-words';

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
  isPostGrad: boolean;
}

export interface MemberViewOne {
  username: string;
  fullName: string;
  nickName?: string;
  department: string;
  grade?: string;
  isGraduated: boolean;
  isPostGrad: boolean;
  graduationYear?: number;
  studyType: string;
  location: string;
  gender: 'M' | 'F' | '';
  status: StatusConfig;
  hasPerformer: boolean;
}

interface StatusConfig {
  color: string;
  icon: react.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & react.RefAttributes<SVGSVGElement>
  >;
  status: string;
}

const getStatusConfig = (status: string) => {
  const statusConfig: Record<string, StatusConfig> = {
    PENDING: {
      color: 'bg-yellow-100 text-yellow-800',
      icon: AlertCircle,
      status: status,
    },
    APPROVED: {
      color: 'bg-green-100 text-green-800',
      icon: User,
      status: status,
    },
    REJECTED: {
      color: 'bg-red-100 text-red-800',
      icon: AlertCircle,
      status: status,
    },
    BLOCKED: {
      color: 'bg-gray-100 text-gray-800',
      icon: AlertCircle,
      status: status,
    },
  };
  return statusConfig[status];
};

export const mapMemberViewOneResponseToMemberViewOne = (
  data: Record<string, any>
): MemberViewOne => {
  return {
    username: data['username'],
    fullName: data['full_name'],
    nickName: data['nick_name'],
    department: data['department'],
    isGraduated: data['is_graduated'],
    isPostGrad: data['is_post_grad'],
    grade: data['grade']
      ? 'GRADE_' + toWords(data['grade']).toUpperCase()
      : undefined,
    graduationYear: data['year_of_graduation'],
    studyType: data['study_type'],
    location: data['location'],
    gender: data['gender'],
    status: getStatusConfig(data['request_status'] as string),
    hasPerformer: data['has_performer'],
  };
};

export const mapMemberFormDataToRequest = (data: MemberFormData) => {
  return {
    first_name: data.firstName,
    last_name: data.lastName,
    nick_name: data.nickName,
    grade: data.grade,
    department: data.department,
    study_type: data.studyType,
    is_graduated: data.isGraduated,
    is_post_grad: data.isPostGrad,
    year_of_graduation: data.graduationYear,
    gender: data.gender,
  };
};
