import { get_media_link } from '../utils/restUtils.ts';

import { toWords } from 'number-to-words';

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
  role: string[];
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

export interface SinglePerformer {
  performer: Performer;
  experiences: Experience[];
  achievements: Achievement[];
  contactDetailsObject: ContactDetailsObject;
  galleryObject: GalleryObject;
}

export interface PerformerResponse {
  username: string;
  full_name: string;
  department: string;
  skills_tags: string[];
  biography: string;
  profile_picture: string;
  status: string;
  graduation_year: number;
  grade?: string;
  gender: string;
  age?: number;
  study_type: string;
  height?: number;
}

export interface SinglePerformerResponse {
  performer: PerformerResponse;
  experiences: Experience[];
  achievements: Achievement[];
  contact_detail_protected: boolean;
  gallery_protected: boolean;
  contact_details: ContactDetail[];
  gallery: Gallery[];
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
  graduationYear: performerResponse.graduation_year,
  gender: performerResponse.gender,
  studyType: performerResponse.study_type,
  grade: performerResponse.grade
    ? toWords(performerResponse.grade).toUpperCase()
    : undefined,
  age: performerResponse.age,
  height: performerResponse.height,
});

const mapExperienceResponseToExperience = (
  experienceResponseList: Record<string, any>[]
): Experience[] => {
  return experienceResponseList.map((experienceResponse) => ({
    showName: experienceResponse['show_name'],
    director: experienceResponse['director'],
    venue: experienceResponse['venue'],
    year: experienceResponse['year'],
    duration: experienceResponse['duration'],
    role: experienceResponse['role'],
  }));
};
const mapAchievementsResponseToAchievements = (
  achievementResponseList: Record<string, any>[]
): Achievement[] => {
  return achievementResponseList.map((achievementResponse) => ({
    rank: achievementResponse['position'],
    field: achievementResponse['field'],
    showName: achievementResponse['show_name'],
    year: achievementResponse['year'],
    festivalName: achievementResponse['festival_name'],
  }));
};

const mapGalleryResponseToGallery = (
  galleryResponse: Record<string, any>[]
): Gallery[] => {
  return galleryResponse.map((image) => ({
    imagePath: get_media_link(image['file']),
    description: image['description'],
  }));
};

const mapContactDetailsResponseToContactDetails = (
  contactDetailResponse: Record<string, any>[]
): ContactDetail[] => {
  return contactDetailResponse.map((contactDetails) => ({
    contactType: contactDetails['contact_type'],
    contactInfo: contactDetails['contact_info'],
  }));
};

export const mapSinglePerformerResponseToSinglePerformer = (
  response: SinglePerformerResponse
): SinglePerformer => {
  return {
    performer: mapPerformerResponseToPerformer(response.performer),
    experiences: mapExperienceResponseToExperience(response.experiences),
    achievements: mapAchievementsResponseToAchievements(response.achievements),
    contactDetailsObject: {
      isLocked: response.contact_detail_protected,
      data: mapContactDetailsResponseToContactDetails(response.contact_details),
    },
    galleryObject: {
      isLocked: response.contact_detail_protected,
      data: mapGalleryResponseToGallery(response.gallery),
    },
  };
};
