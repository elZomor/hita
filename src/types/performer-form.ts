import { z } from 'zod';

export interface PersonalInfo {
  dateOfBirth?: Date;
  skills?: (string | number | boolean)[];
  bio?: string;
  height?: number;
  status: 'AVAILABLE' | 'UNAVAILABLE';
  openFor: 'PAID' | 'FREE' | 'BOTH';
}

export interface Experience {
  showName: string;
  director: string;
  venue: string;
  roles: string[];
  year: number;
  duration: number | null;
  // showType: 'THEATER' | 'TV' | 'MOVIE' | 'RADIO' | 'DUBBING' | '';
  showType: string;
}

export interface Achievement {
  rank: string;
  field: string;
  showName: string;
  festivalName: string;
  year: number;
}

export interface ContactDetail {
  contactType: string;
  contactInfo: string;
}

export interface ContactSection {
  details: ContactDetail[];
  keepProtected: boolean;
}

export interface ProfileImage {
  file: File;
  description: string;
  isProfilePicture: boolean;
}

export interface GallerySection {
  images: ProfileImage[];
  keepProtected: boolean;
}

export interface PublicLink {
  linkType: string;
  linkInfo: string;
}

export interface PerformerFormData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  achievements: Achievement[];
  contactSection: ContactSection;
  gallerySection: GallerySection;
  publicLinks: PublicLink[];
}

export type FormStep =
  | 'personal-info'
  | 'experiences'
  | 'achievements'
  | 'contact-details'
  | 'profile-images'
  | 'public-links';

export const STEPS: { id: FormStep; label: string }[] = [
  { id: 'personal-info', label: 'PERSONAL_INFO' },
  { id: 'experiences', label: 'EXPERIENCES' },
  { id: 'achievements', label: 'ACHIEVEMENTS' },
  { id: 'contact-details', label: 'CONTACT_DETAILS' },
  { id: 'profile-images', label: 'GALLERY' },
  { id: 'public-links', label: 'PUBLIC_LINKS' },
];

export const SKILLS_OPTIONS = [
  { value: 'acting', label: 'Acting' },
  { value: 'singing', label: 'Singing' },
  { value: 'dancing', label: 'Dancing' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'drama', label: 'Drama' },
  { value: 'improv', label: 'Improvisation' },
  { value: 'stage-combat', label: 'Stage Combat' },
  { value: 'voice-acting', label: 'Voice Acting' },
  { value: 'musical-theatre', label: 'Musical Theatre' },
  { value: 'physical-theatre', label: 'Physical Theatre' },
];

export const CONTACT_TYPES = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'telegram', label: 'Telegram' },
];

export const LINK_TYPES = [
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'showreel', label: 'Showreel' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'youtube', label: 'YouTube' },
];

// Validation schemas for each step
const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 16);

export const personalInfoSchema = z.object({
  dateOfBirth: z
    .date()
    .optional()
    .refine(
      (date) => !date || date <= maxDate,
      'Must be at least 16 years old'
    ),
  skills: z.array(z.string()).optional(),
  bio: z.string().max(300).optional(),
  status: z.enum(['AVAILABLE', 'UNAVAILABLE']),
  openFor: z.enum(['FREE', 'PAID', 'BOTH']),
  height: z.number().max(230).optional(),
});

export const experienceSchema = z
  .object({
    showName: z.string().min(1, 'Show name is required'),
    director: z.string().min(1, 'Director is required'),
    venue: z.string().nullable().optional(), // Nullable and optional
    showType: z.string().min(1, 'Show type is required'),
    roles: z.array(z.string()).min(1, 'At least one role is required'),
    year: z.number().min(1900).max(new Date().getFullYear()),
    duration: z.number().nullable().optional(), // Nullable and optional
  })
  .refine(
    (data) =>
      data.showType === 'THEATER'
        ? data.venue &&
          data.venue.length > 0 &&
          data.duration &&
          data.duration > 0
        : true, // Only validate if showType is 'THEATER'
    {
      message: 'Venue and duration are required for theater shows',
      path: ['venue', 'duration'], // Target both venue and duration fields
    }
  );

export const achievementSchema = z.object({
  rank: z.string().min(1, 'Rank is required'),
  field: z.string().min(1, 'Field is required'),
  showName: z.string().min(1, 'Show name is required'),
  festivalName: z.string().min(1, 'Festival name is required'),
  year: z.number().min(1900).max(new Date().getFullYear()),
});

export const contactDetailSchema = z.object({
  contactType: z.string().min(1, 'Contact type is required'),
  contactInfo: z.string().min(1, 'Contact info is required'),
});

export const contactSectionSchema = z.object({
  details: z.array(contactDetailSchema),
  keepProtected: z.boolean(),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const profileImageSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      'File size must be less than 5MB'
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only JPEG, PNG and WebP images are supported'
    ),
  description: z.string().max(255),
  isProfilePicture: z.boolean(),
});

export const gallerySectionSchema = z.object({
  images: z
    .array(profileImageSchema)
    .max(3, 'Maximum 3 images allowed')
    .refine(
      (images) => images.filter((img) => img.isProfilePicture).length <= 1,
      'Only one image can be set as profile picture'
    ),
  keepProtected: z.boolean(),
});

export const publicLinkSchema = z.object({
  linkType: z.string().min(1, 'Link type is required'),
  linkInfo: z.string().url('Must be a valid URL'),
});

// Complete form schema
export const performerFormSchema = z.object({
  personalInfo: personalInfoSchema,
  experiences: z.array(experienceSchema),
  achievements: z.array(achievementSchema),
  contactSection: contactSectionSchema,
  gallerySection: gallerySectionSchema,
  publicLinks: z.array(publicLinkSchema),
});
