import { get_media_link } from '../rest_utils.ts';

export interface Performer {
  username: string;
  name: string;
  profilePicture: string;
  skills?: string[];
  status: string;
  biography: string;
  department: string;
}

export interface PerformerResponse {
  username: string;
  full_name: string;
  department: string;
  skills_tags: string[];
  biography: string;
  profile_picture: string;
  status: string;
}

export const mapPerformerResponseToPerformer = (
  performerResponse: PerformerResponse
) => ({
  username: performerResponse.username,
  name: performerResponse.full_name,
  department: performerResponse.department,
  skills: performerResponse.skills_tags,
  biography: performerResponse.biography,
  profilePicture: get_media_link(performerResponse.profile_picture),
  status: performerResponse.status,
});
