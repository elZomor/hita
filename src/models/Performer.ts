import { get_media_link } from '../utils/restUtils.ts';

import { toWords } from 'number-to-words';
import { format } from 'date-fns';

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
  dateOfBirth?: Date;
  studyType: string;
  height?: number;
  nickName?: string;
  openFor: 'PAID' | 'FREE' | 'BOTH';
}

export interface Experience {
  id: number;
  showName: string;
  director: string;
  venue: string | null | undefined;
  year: number;
  duration: number | null | undefined;
  roles: string[];
  showType: string;
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

export interface PublicLink {
  linkType: string;
  linkInfo: string;
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
  publicLinks: PublicLink[];
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
  nick_name?: string;
  date_of_birth?: string;
  open_for: 'FREE' | 'PAID' | 'BOTH';
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
  nickName: performerResponse.nick_name,
  openFor: performerResponse.open_for,
  dateOfBirth:
    performerResponse.date_of_birth !== null
      ? new Date(performerResponse.date_of_birth!)
      : undefined,
});

export const mapExperienceResponseToExperience = (
  experienceResponseList: Record<string, any>[]
): Experience[] => {
  return experienceResponseList.map((experienceResponse) => ({
    id: experienceResponse['id'],
    showName: experienceResponse['show_name'],
    director: experienceResponse['director'],
    venue: experienceResponse['venue'],
    year: experienceResponse['year'],
    duration: experienceResponse['duration'],
    roles: experienceResponse['role'],
    showType: experienceResponse['show_type'],
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
    publicLinks: [],
  };
};

export const mapPerformerRegisterToRequest = (data: Record<string, any>) => {
  console.log(data);
  const personalInfo = data['personalInfo'];
  const experiencesSection = data['experiences']?.map(
    (experience: Record<string, any>) => ({
      show_name: experience['showName'],
      director: experience['director'],
      venue: experience['venue'],
      show_type: experience['showType'],
      roles: experience['roles'],
      year: experience['year'],
      duration: experience['duration'],
    })
  );
  const achievementsSection = data['achievements']?.map(
    (achievement: Record<string, any>) => ({
      position: achievement['rank'],
      field: achievement['field'],
      show_name: achievement['showName'],
      festival_name: achievement['festivalName'],
      year: achievement['year'],
    })
  );
  const contactSection = data['contactSection'].details?.map(
    (contact: Record<string, any>) => ({
      contact_type: contact['contactType'],
      contact_info: contact['contactInfo'],
    })
  );
  const publicLinksSection = data['publicLinks']?.map(
    (link: Record<string, any>) => ({
      channel_type: link['linkType'],
      channel_info: link['linkInfo'],
    })
  );
  return {
    performer_data: {
      username: personalInfo['username'],
      date_of_birth: personalInfo['dateOfBirth']
        ? format(personalInfo['dateOfBirth'], 'yyyy-MM-dd')
        : null,
      biography: personalInfo['bio'],
      open_for: personalInfo['openFor'],
      status: personalInfo['status'],
      height: personalInfo['height'],
      skills_tags: personalInfo['skills'],
      contact_detail_protected: data['contactSection']['keepProtected'],
      gallery_protected: data['gallerySection']['keepProtected'],
    },
    experiences: experiencesSection,
    achievements: achievementsSection,
    contact_section: contactSection,
    public_links_section: publicLinksSection,
  };
};
