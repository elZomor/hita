import { z } from 'zod';

export interface PersonalInfo {
  username: string;
  dateOfBirth?: Date;
  skills?: (string | number | boolean)[];
  bio?: string;
  height?: number;
  weight?: number;
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
  producer: string | null;
  roleName: string | null;
  brief: string | null;
  showType: string;
  festivalName: string | null;
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

export interface NewPerformerFormData {
  personalInfo: PersonalInfo;
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

// Validation schemas for each step
const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 16);

export const personalInfoSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .regex(
      /^[a-zA-Z0-9_-]{8,30}$/,
      'Username must be 8-30 characters long, contain no spaces, and only include letters, numbers, hyphens (-), or underscores (_).'
    ),
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
  weight: z.number().max(230).optional(),
});

export const experienceSchema = z
  .object({
    showName: z
      .string()
      .min(1, 'PERFORMER_PAGE.EXPERIENCE.ERRORS.SHOW_NAME_REQUIRED')
      .max(100, 'PERFORMER_PAGE.EXPERIENCE.ERRORS.SHOW_NAME_MAX'),
    director: z
      .string()
      .min(1, 'PERFORMER_PAGE.EXPERIENCE.ERRORS.DIRECTOR_REQUIRED')
      .max(20, 'PERFORMER_PAGE.EXPERIENCE.ERRORS.DIRECTOR_MAX'),
    venue: z
      .string()
      .max(50, 'PERFORMER_PAGE.EXPERIENCE.ERRORS.VENUE_MAX')
      .nullable()
      .optional(),
    producer: z
      .string()
      .max(30, 'PERFORMER_PAGE.EXPERIENCE.ERRORS.PRODUCER_MAX')
      .nullable()
      .optional(),
    roleName: z
      .string()
      .max(20, 'PERFORMER_PAGE.EXPERIENCE.ERRORS.ROLE_NAME_MAX')
      .nullable()
      .optional(),
    brief: z
      .string()
      .max(50, 'PERFORMER_PAGE.EXPERIENCE.ERRORS.ROLE_BRIEF_MAX')
      .nullable()
      .optional(),
    showType: z.string().min(1, 'PERFORMER_PAGE.EXPERIENCE.ERRORS.SHOW_TYPE_REQUIRED'),
    roles: z.array(z.string()).min(1, 'PERFORMER_PAGE.EXPERIENCE.ERRORS.ROLES_REQUIRED'),
    year: z
      .number()
      .min(1900, 'PERFORMER_PAGE.EXPERIENCE.ERRORS.YEAR_INVALID')
      .max(new Date().getFullYear(), 'PERFORMER_PAGE.EXPERIENCE.ERRORS.YEAR_INVALID'),
    duration: z.number().positive().nullable().optional(),
    festivalName: z
      .string()
      .max(50, 'PERFORMER_PAGE.EXPERIENCE.ERRORS.FESTIVAL_NAME_MAX')
      .nullable()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.showType === 'THEATER') {
      if (!data.venue || data.venue.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['venue'],
          message: 'PERFORMER_PAGE.EXPERIENCE.ERRORS.VENUE_REQUIRED',
        });
      }

      if (data.duration === null || data.duration === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['duration'],
          message: 'PERFORMER_PAGE.EXPERIENCE.ERRORS.DURATION_REQUIRED',
        });
      } else if (data.duration <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['duration'],
          message: 'PERFORMER_PAGE.EXPERIENCE.ERRORS.DURATION_POSITIVE',
        });
      }

      if (!data.festivalName || data.festivalName.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['festivalName'],
          message: 'PERFORMER_PAGE.EXPERIENCE.ERRORS.FESTIVAL_NAME_REQUIRED',
        });
      }
    } else if (data.showType === 'TV' || data.showType === 'MOVIE') {
      if (!data.producer || data.producer.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['producer'],
          message: 'PERFORMER_PAGE.EXPERIENCE.ERRORS.PRODUCER_REQUIRED',
        });
      }
    }
  });

export const achievementSchema = z.object({
  rank: z
    .string()
    .min(1, 'PERFORMER_PAGE.ACHIEVEMENT.ERRORS.RANK_REQUIRED')
    .max(50, 'PERFORMER_PAGE.ACHIEVEMENT.ERRORS.RANK_MAX'),
  field: z
    .string()
    .min(1, 'PERFORMER_PAGE.ACHIEVEMENT.ERRORS.FIELD_REQUIRED')
    .max(50, 'PERFORMER_PAGE.ACHIEVEMENT.ERRORS.FIELD_MAX'),
  showName: z
    .string()
    .min(1, 'PERFORMER_PAGE.ACHIEVEMENT.ERRORS.SHOW_NAME_REQUIRED')
    .max(50, 'PERFORMER_PAGE.ACHIEVEMENT.ERRORS.SHOW_NAME_MAX'),
  festivalName: z
    .string()
    .min(1, 'PERFORMER_PAGE.ACHIEVEMENT.ERRORS.FESTIVAL_NAME_REQUIRED')
    .max(50, 'PERFORMER_PAGE.ACHIEVEMENT.ERRORS.FESTIVAL_NAME_MAX'),
  year: z
    .number()
    .min(1900, 'PERFORMER_PAGE.ACHIEVEMENT.ERRORS.YEAR_INVALID')
    .max(new Date().getFullYear(), 'PERFORMER_PAGE.ACHIEVEMENT.ERRORS.YEAR_INVALID'),
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
export const newPerformerFormSchema = z.object({
  personalInfo: personalInfoSchema,
});
