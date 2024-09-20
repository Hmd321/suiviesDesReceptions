import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const handleChange = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <div className="language-selector">
            <select id="language" onChange={handleChange} defaultValue={i18n.language}>
                <option value="en">{i18n.t('English')}</option>
                <option value="fr">{i18n.t('Francias')}</option>
                <option value="ar">{i18n.t('عربية')}</option>
            </select>
        </div>
    );
};

export default LanguageSelector;
