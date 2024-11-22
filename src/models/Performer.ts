import { get_media_link } from '../rest_utils.ts';

export interface Performer {
  username: string;
  name: string;
  profilePicture: string;
  skills?: string[];
  status: string;
  biography: string;
  department: string;
  grade?: string;
  graduationYear?: number;
  gender: string;
  age?: number;
  studyType: string;
  height?: number;
}

export interface Experience {
  showName: string;
  director: string;
  venue: string;
  year: number;
  duration: number;
  roles: string[];
}

export interface Achievement {
  rank: string;
  field: string;
  showName: string;
  festivalName: string;
  year: number;
}

export interface ContactDetailsObject {
  data?: ContactDetail[];
  isLocked: boolean;
}

export interface ContactDetail {
  contactType: string;
  contactInfo: string;
}

export interface GalleryObject {
  data?: Gallery[];
  isLocked: boolean;
}

export interface Gallery {
  imagePath: string;
  description: string;
}

export interface PerformerResponse {
  username: string;
  full_name: string;
  department: string;
  skills_tags: string[];
  biography: string;
  profile_picture: string;
  status: string;
  year_of_graduation: number;
  grade?: string;
  gender: string;
  age?: number;
  study_type: string;
}

export const mapPerformerResponseToPerformer = (
  performerResponse: PerformerResponse
): Performer => ({
  username: performerResponse.username,
  name: performerResponse.full_name,
  department: performerResponse.department,
  skills: performerResponse.skills_tags,
  biography: performerResponse.biography,
  profilePicture: get_media_link(performerResponse.profile_picture),
  status: performerResponse.status,
  graduationYear: performerResponse.year_of_graduation,
  gender: performerResponse.gender,
  studyType: performerResponse.study_type,
});
