import {ContactDetail, ContactDetailsObject} from "../../models/Performer.ts";
import {useTranslation} from "react-i18next";
import {FaFacebook} from "react-icons/fa";
import {FaLock, FaXTwitter} from "react-icons/fa6";

type ContactDetailsProps = {
    contactDetailsObject: ContactDetailsObject
}
const ContactDetailsSection = ({contactDetailsObject}: ContactDetailsProps) => {
    const {t} = useTranslation();
    const {data, isLocked} = contactDetailsObject;
    const getContactDetailsTag = (info: string, contactType: string) => {
        switch (contactType) {
            case 'FACEBOOK':
                return (
                    <div
                        onClick={() => window.open(info, '_blank')}
                        className="cursor-pointer text-blue-600 hover:text-blue-800"
                        title={t('FACEBOOK')}
                    >
                        <FaFacebook size={24}/>
                    </div>
                )
            case 'TWITTER':
                return <div
                    onClick={() => window.open(info, '_blank')}
                    className="cursor-pointer "
                    title={t('TWITTER')}
                >
                    <FaXTwitter size={24}/>
                </div>
        }
    }
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('CONTACT_DETAILS')}</h2>
            {isLocked ? (<div
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
                    <FaLock className="text-gray-500" size={20}/>
                    <span className="text-gray-700 text-sm">{t('LOCKED')}</span>
                </div>) :

                (<div className=" flex flex-row items-center space-x-2">
                    {data?.map((contact: ContactDetail, index) =>
                        (<div key={index}>
                            {getContactDetailsTag(contact.contactInfo, contact.contactType)}
                        </div>))
                    }
                </div>)}
        </div>
    );
};

export default ContactDetailsSection;