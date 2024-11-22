import {
  Achievement,
  ContactDetail,
  ContactDetailsObject,
  Experience,
  Gallery,
  GalleryObject,
  Performer,
} from '../models/Performer.ts';

export const performer: Performer = {
  username: 'elzomor13',
  name: 'محمد الزمر',
  department: 'DRAMA',
  skills: ['MUSICIAN', 'ACTOR'],
  biography: 'This is My Bio',
  profilePicture:
    'http://localhost:8005/media/test/01f37d07-93e9-4380-91b8-19fa64eb94e7.jpg',
  status: 'AVAILABLE',
  gender: 'M',
  grade: 'ONE',
  age: 30,
  studyType: 'NORMAL',
  height: 180,
};
export const experienceList: Experience[] = [
  {
    roles: ['ACTOR', 'MUSICIAN'],
    showName: 'سقط صدفة',
    director: 'إسماعيل إبراهيم',
    venue: 'المركز الثقافي الفرنسي',
    year: 2017,
    duration: 6,
  },
  {
    roles: ['ACTOR'],
    showName: 'بيليبيوس',
    director: 'إسماعيل إبراهيم',
    venue: 'مسرح المدينة الجامعية بجامعة القاهرة',
    year: 2015,
    duration: 1,
  },
];
export const achievementsList: Achievement[] = [
  {
    rank: 'المركز الأول',
    field: 'تأليف موسقي',
    showName: 'الدحديرة',
    festivalName: 'مهرجان جامعة القاهرة للعروض الطويلة',
    year: 2024,
  },
  {
    rank: 'المركز الأول',
    field: 'تأليف موسقي',
    showName: 'الدحديرة',
    festivalName: 'مهرجان جامعة القاهرة للعروض الطويلة',
    year: 2024,
  },
];
const contactDetailsList: ContactDetail[] = [
  {
    contactType: 'MOBILE',
    contactInfo: '01115441098',
  },
  {
    contactType: 'FACEBOOK',
    contactInfo: 'https://www.facebook.com/elzomor13',
  },
  {
    contactType: 'TWITTER',
    contactInfo: 'https://www.facebook.com/elzomor13',
  },
];
const gallery: Gallery[] = [
  {
    imagePath:
      'http://localhost:8005/media/test/01f37d07-93e9-4380-91b8-19fa64eb94e7.jpg',
    description: 'My Profile Pic',
  },
  {
    imagePath: '',
    description: 'My Profile Pic',
  },
];

export const contactDetailsObject: ContactDetailsObject = {
  isLocked: false,
  data: contactDetailsList,
};
export const galleryObject: GalleryObject = { isLocked: false, data: gallery };
